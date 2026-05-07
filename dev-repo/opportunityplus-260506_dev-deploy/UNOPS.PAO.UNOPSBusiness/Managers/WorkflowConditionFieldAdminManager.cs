using System.Globalization;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Business.Interfaces;
using UNOPS.PAO.Models.AuditLogs;
using UNOPS.PAO.Models.EntityConfiguration;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSDataAccess.Context;
using UNOPS.PAO.UNOPSDomain.Entities;
using UNOPS.Workflow.Business.Interfaces;
using UNOPS.Workflow.Models;

namespace UNOPS.PAO.UNOPSBusiness.Managers;

/// <summary>
/// Implements <see cref="IWorkflowConditionFieldAdminManager"/>. Configuration is global —
/// one row per (EntityName, FieldKey) for the whole tenant. Lock detection runs against the
/// workflow store via <see cref="IWorkflowRepository.GetConditionFieldUsagesAsync"/>; office
/// names are resolved against <see cref="UNOPSAppDbContext.Offices"/> when scope is
/// <see cref="ScopeKindOffice"/>.
/// </summary>
public sealed class WorkflowConditionFieldAdminManager : IWorkflowConditionFieldAdminManager
{
    private const string ScopeKindOffice = "Office";

    private const string AuditEntityType = "WorkflowConditionField";

    private readonly UNOPSAppDbContext _context;
    private readonly IWorkflowRepository _workflowRepository;
    private readonly IManagerWrapper _managerWrapper;
    private readonly IReadOnlyDictionary<string, IWorkflowConditionFieldCatalog> _catalogsByEntity;

    public WorkflowConditionFieldAdminManager(
        UNOPSAppDbContext context,
        IWorkflowRepository workflowRepository,
        IManagerWrapper managerWrapper,
        IEnumerable<IWorkflowConditionFieldCatalog> catalogs)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
        _workflowRepository = workflowRepository ?? throw new ArgumentNullException(nameof(workflowRepository));
        _managerWrapper = managerWrapper ?? throw new ArgumentNullException(nameof(managerWrapper));

        _catalogsByEntity = (catalogs ?? Array.Empty<IWorkflowConditionFieldCatalog>())
            .GroupBy(c => c.EntityName, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.First(), StringComparer.OrdinalIgnoreCase);
    }

    public IReadOnlyList<string> GetSupportedEntities() =>
        _catalogsByEntity.Keys.OrderBy(k => k, StringComparer.OrdinalIgnoreCase).ToArray();

    public async Task<IReadOnlyList<WorkflowConditionFieldDto>> GetFieldsAsync(
        ClaimsPrincipal user,
        string entityName,
        CancellationToken cancellationToken = default)
    {
        var catalog = ResolveCatalog(entityName);
        var stored = await LoadStoredAsync(catalog.EntityName, cancellationToken);
        var usages = await _workflowRepository.GetConditionFieldUsagesAsync(catalog.EntityName, cancellationToken);

        var lockSummariesByKey = BuildLockSummaries(usages);
        return BuildFieldDtos(catalog, stored, lockSummariesByKey);
    }

    public async Task<IReadOnlyList<WorkflowConditionFieldUsageDto>> GetFieldUsagesAsync(
        ClaimsPrincipal user,
        string entityName,
        string fieldKey,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(fieldKey))
            return Array.Empty<WorkflowConditionFieldUsageDto>();

        var catalog = ResolveCatalog(entityName);
        var usages = await _workflowRepository.GetConditionFieldUsagesAsync(catalog.EntityName, cancellationToken);

        var matching = usages
            .Where(u => string.Equals(u.FieldKey, fieldKey, StringComparison.OrdinalIgnoreCase))
            .ToArray();

        var officeNamesById = await ResolveOfficeNamesAsync(matching, cancellationToken);

        return matching
            .OrderBy(u => u.ScopeEntityName ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(u => u.ScopeEntityId ?? string.Empty, StringComparer.OrdinalIgnoreCase)
            .ThenBy(u => u.StateMachineVersionId)
            .Select(u => new WorkflowConditionFieldUsageDto
            {
                StateMachineVersionId = u.StateMachineVersionId,
                ScopeEntityName = u.ScopeEntityName,
                ScopeEntityId = u.ScopeEntityId,
                ScopeDisplayName = ResolveScopeDisplayName(u, officeNamesById),
            })
            .ToArray();
    }

    public async Task<IReadOnlyList<WorkflowConditionFieldDto>> SaveFieldsAsync(
        ClaimsPrincipal user,
        SaveWorkflowConditionFieldsRequest request,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var catalog = ResolveCatalog(request.EntityName);
        var catalogKeys = catalog.GetAvailableFields()
            .Select(f => f.FieldKey)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        // Reject unknown keys before touching the database.
        var unknown = request.Fields
            .Where(f => !catalogKeys.Contains(f.FieldKey))
            .Select(f => f.FieldKey)
            .ToArray();
        if (unknown.Length > 0)
            throw new ArgumentException(
                $"Unknown field key(s) for {catalog.EntityName}: {string.Join(", ", unknown)}",
                nameof(request));

        // Server-side lock enforcement: the request may not deselect any in-use field.
        var usages = await _workflowRepository.GetConditionFieldUsagesAsync(catalog.EntityName, cancellationToken);
        var lockedKeys = usages
            .Select(u => u.FieldKey)
            .ToHashSet(StringComparer.OrdinalIgnoreCase);

        var requestedAllowed = request.Fields
            .ToDictionary(f => f.FieldKey, f => f.IsAllowed, StringComparer.OrdinalIgnoreCase);

        var attemptedDeselects = lockedKeys
            .Where(key => requestedAllowed.TryGetValue(key, out var allowed) && !allowed)
            .ToArray();
        if (attemptedDeselects.Length > 0)
            throw new InvalidOperationException(
                $"Cannot deselect field(s) currently used by a workflow version: {string.Join(", ", attemptedDeselects)}");

        var beforeSnapshot = await SnapshotForAuditAsync(catalog.EntityName, cancellationToken);

        await UpsertAsync(catalog.EntityName, request.Fields, cancellationToken);

        await TryWriteAuditLogAsync(user, catalog.EntityName, beforeSnapshot, request.Fields, cancellationToken);

        return await GetFieldsAsync(user, catalog.EntityName, cancellationToken);
    }

    /// <summary>
    /// Honors the EntityManager's <c>EnableChangeLog</c> flag for the workflow subject (e.g.
    /// Opportunity). When enabled and at least one field row changed, writes a single audit log
    /// entry summarizing the diff (added / removed / changed fields and label/order edits).
    /// Failures are swallowed so audit problems never block a successful save.
    /// </summary>
    private async Task TryWriteAuditLogAsync(
        ClaimsPrincipal user,
        string entityName,
        IReadOnlyDictionary<string, FieldAuditSnapshot> before,
        IReadOnlyList<WorkflowConditionFieldUpsertDto> requested,
        CancellationToken cancellationToken)
    {
        try
        {
            var entityManager = await _context.EntityManagers
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    e => !e.IsDeleted && e.EntityName == entityName,
                    cancellationToken);

            if (entityManager is null || !entityManager.EnableChangeLog)
                return;

            var diff = BuildAuditDiff(before, requested);
            if (diff.IsEmpty)
                return;

            if (!TryGetUserId(user, out var userId))
                return;

            await _managerWrapper.AuditLogManager.CreateAuditLogAsync(new AuditLogCreateRequest
            {
                EntityType = AuditEntityType,
                EntityId = entityManager.Id,
                Action = "Update",
                UserId = userId,
                Description = diff.Description,
                JsonData = JsonSerializer.Serialize(new
                {
                    EntityName = entityName,
                    diff.AddedKeys,
                    diff.RemovedKeys,
                    diff.AllowedToggles,
                    diff.LabelChanges,
                    diff.OrderChanges,
                }),
            });
        }
        catch
        {
            // Audit logging is best-effort — never fail the save because of audit issues.
        }
    }

    private async Task<IReadOnlyDictionary<string, FieldAuditSnapshot>> SnapshotForAuditAsync(
        string entityName,
        CancellationToken cancellationToken)
    {
        var rows = await _context.WorkflowConditionFields
            .AsNoTracking()
            .Where(w => !w.IsDeleted && w.EntityName == entityName)
            .ToListAsync(cancellationToken);

        return rows.ToDictionary(
            r => r.FieldKey,
            r => new FieldAuditSnapshot(r.IsAllowed, NormalizeLabel(r.LabelOverride), r.DisplayOrder),
            StringComparer.OrdinalIgnoreCase);
    }

    private static AuditDiff BuildAuditDiff(
        IReadOnlyDictionary<string, FieldAuditSnapshot> before,
        IReadOnlyList<WorkflowConditionFieldUpsertDto> requested)
    {
        var afterByKey = requested.ToDictionary(
            r => r.FieldKey,
            r => new FieldAuditSnapshot(r.IsAllowed, NormalizeLabel(r.LabelOverride), r.DisplayOrder),
            StringComparer.OrdinalIgnoreCase);

        var added = afterByKey.Keys.Where(k => !before.ContainsKey(k)).OrderBy(k => k, StringComparer.OrdinalIgnoreCase).ToArray();
        var removed = before.Keys.Where(k => !afterByKey.ContainsKey(k)).OrderBy(k => k, StringComparer.OrdinalIgnoreCase).ToArray();

        var allowedToggles = new List<AllowedToggle>();
        var labelChanges = new List<LabelChange>();
        var orderChanges = new List<OrderChange>();

        foreach (var (key, after) in afterByKey)
        {
            if (!before.TryGetValue(key, out var prev))
                continue;

            if (prev.IsAllowed != after.IsAllowed)
                allowedToggles.Add(new AllowedToggle(key, prev.IsAllowed, after.IsAllowed));

            if (!string.Equals(prev.LabelOverride, after.LabelOverride, StringComparison.Ordinal))
                labelChanges.Add(new LabelChange(key, prev.LabelOverride, after.LabelOverride));

            if (prev.DisplayOrder != after.DisplayOrder)
                orderChanges.Add(new OrderChange(key, prev.DisplayOrder, after.DisplayOrder));
        }

        var description = string.Join("; ", new[]
        {
            added.Length > 0 ? $"added {added.Length}" : null,
            removed.Length > 0 ? $"removed {removed.Length}" : null,
            allowedToggles.Count > 0 ? $"allowed-toggle {allowedToggles.Count}" : null,
            labelChanges.Count > 0 ? $"label {labelChanges.Count}" : null,
            orderChanges.Count > 0 ? $"order {orderChanges.Count}" : null,
        }.Where(s => s is not null));

        return new AuditDiff(added, removed, allowedToggles, labelChanges, orderChanges, description);
    }

    private static bool TryGetUserId(ClaimsPrincipal? user, out int userId)
    {
        userId = 0;
        var claim = user?.FindFirst(ClaimTypes.NameIdentifier);
        return claim is not null && int.TryParse(claim.Value, out userId);
    }

    private IWorkflowConditionFieldCatalog ResolveCatalog(string entityName)
    {
        if (string.IsNullOrWhiteSpace(entityName))
            throw new ArgumentException("Entity name is required.", nameof(entityName));

        if (!_catalogsByEntity.TryGetValue(entityName, out var catalog))
            throw new InvalidOperationException(
                $"No workflow condition field catalog registered for entity '{entityName}'.");

        return catalog;
    }

    private Task<List<WorkflowConditionField>> LoadStoredAsync(string entityName, CancellationToken cancellationToken) =>
        _context.WorkflowConditionFields
            .AsNoTracking()
            .Where(w => !w.IsDeleted && w.EntityName == entityName)
            .ToListAsync(cancellationToken);

    private async Task UpsertAsync(
        string entityName,
        IReadOnlyList<WorkflowConditionFieldUpsertDto> requested,
        CancellationToken cancellationToken)
    {
        var existing = await _context.WorkflowConditionFields
            .Where(w => !w.IsDeleted && w.EntityName == entityName)
            .ToListAsync(cancellationToken);

        var existingByKey = existing.ToDictionary(w => w.FieldKey, StringComparer.OrdinalIgnoreCase);
        var requestedKeys = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

        foreach (var dto in requested)
        {
            requestedKeys.Add(dto.FieldKey);

            if (existingByKey.TryGetValue(dto.FieldKey, out var row))
            {
                row.IsAllowed = dto.IsAllowed;
                row.LabelOverride = NormalizeLabel(dto.LabelOverride);
                row.DisplayOrder = dto.DisplayOrder;
            }
            else
            {
                _context.WorkflowConditionFields.Add(new WorkflowConditionField
                {
                    EntityName = entityName,
                    FieldKey = dto.FieldKey,
                    IsAllowed = dto.IsAllowed,
                    LabelOverride = NormalizeLabel(dto.LabelOverride),
                    DisplayOrder = dto.DisplayOrder,
                });
            }
        }

        // Soft-delete rows the admin omitted from the request entirely.
        foreach (var row in existing.Where(r => !requestedKeys.Contains(r.FieldKey)))
        {
            row.SetDeleteAuditData(0);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }

    private static string? NormalizeLabel(string? label) =>
        string.IsNullOrWhiteSpace(label) ? null : label.Trim();

    private static IReadOnlyDictionary<string, FieldLockSummary> BuildLockSummaries(
        IReadOnlyList<WorkflowConditionFieldUsage> usages)
    {
        return usages
            .GroupBy(u => u.FieldKey, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                g => g.Key,
                g => new FieldLockSummary(
                    VersionCount: g.Select(u => u.StateMachineVersionId).Distinct().Count(),
                    OfficeCount: g
                        .Where(u => string.Equals(u.ScopeEntityName, ScopeKindOffice, StringComparison.OrdinalIgnoreCase))
                        .Where(u => !string.IsNullOrWhiteSpace(u.ScopeEntityId))
                        .Select(u => u.ScopeEntityId!)
                        .Distinct(StringComparer.OrdinalIgnoreCase)
                        .Count()),
                StringComparer.OrdinalIgnoreCase);
    }

    private static IReadOnlyList<WorkflowConditionFieldDto> BuildFieldDtos(
        IWorkflowConditionFieldCatalog catalog,
        IReadOnlyList<WorkflowConditionField> stored,
        IReadOnlyDictionary<string, FieldLockSummary> lockSummariesByKey)
    {
        var storedByKey = stored.ToDictionary(s => s.FieldKey, StringComparer.OrdinalIgnoreCase);

        return catalog.GetAvailableFields()
            .Select(field =>
            {
                storedByKey.TryGetValue(field.FieldKey, out var row);
                lockSummariesByKey.TryGetValue(field.FieldKey, out var summary);

                var labelOverride = NormalizeLabel(row?.LabelOverride);
                var isAllowed = row?.IsAllowed ?? true;
                var isLocked = summary is not null;
                var lockSummary = summary is not null
                    ? FormatLockSummary(summary)
                    : null;

                return new WorkflowConditionFieldDto
                {
                    FieldKey = field.FieldKey,
                    DefaultDisplayName = field.DefaultDisplayName,
                    EffectiveDisplayName = labelOverride ?? field.DefaultDisplayName,
                    LabelOverride = labelOverride,
                    FieldType = field.FieldType,
                    IsNavigationProperty = field.IsNavigationProperty,
                    AllowedOperators = field.AllowedOperators?.ToList() ?? new List<string>(),
                    IsAllowed = isAllowed,
                    IsLocked = isLocked,
                    DisplayOrder = row?.DisplayOrder ?? 0,
                    InUseVersionCount = summary?.VersionCount ?? 0,
                    InUseOfficeCount = summary?.OfficeCount ?? 0,
                    LockSummary = lockSummary,
                };
            })
            .OrderBy(f => f.DisplayOrder)
            .ThenBy(f => f.DefaultDisplayName, StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    private static string FormatLockSummary(FieldLockSummary summary)
    {
        var versionsLabel = summary.VersionCount == 1 ? "version" : "versions";
        if (summary.OfficeCount == 0)
            return $"Used in {summary.VersionCount} {versionsLabel}";

        var officesLabel = summary.OfficeCount == 1 ? "office" : "offices";
        return $"Used in {summary.VersionCount} {versionsLabel} across {summary.OfficeCount} {officesLabel}";
    }

    private async Task<IReadOnlyDictionary<int, string>> ResolveOfficeNamesAsync(
        IReadOnlyList<WorkflowConditionFieldUsage> usages,
        CancellationToken cancellationToken)
    {
        var officeIds = usages
            .Where(u => string.Equals(u.ScopeEntityName, ScopeKindOffice, StringComparison.OrdinalIgnoreCase))
            .Where(u => !string.IsNullOrWhiteSpace(u.ScopeEntityId))
            .Select(u => int.TryParse(u.ScopeEntityId, NumberStyles.Integer, CultureInfo.InvariantCulture, out var id) ? id : (int?)null)
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToArray();

        if (officeIds.Length == 0)
            return new Dictionary<int, string>();

        var rows = await _context.Offices
            .AsNoTracking()
            .Where(o => officeIds.Contains(o.Id))
            .Select(o => new { o.Id, o.Name })
            .ToListAsync(cancellationToken);

        return rows.ToDictionary(o => o.Id, o => o.Name ?? string.Empty);
    }

    private static string? ResolveScopeDisplayName(
        WorkflowConditionFieldUsage usage,
        IReadOnlyDictionary<int, string> officeNamesById)
    {
        if (!string.Equals(usage.ScopeEntityName, ScopeKindOffice, StringComparison.OrdinalIgnoreCase))
            return null;

        if (string.IsNullOrWhiteSpace(usage.ScopeEntityId))
            return null;

        if (!int.TryParse(usage.ScopeEntityId, NumberStyles.Integer, CultureInfo.InvariantCulture, out var officeId))
            return null;

        return officeNamesById.TryGetValue(officeId, out var name) ? name : null;
    }

    private sealed record FieldLockSummary(int VersionCount, int OfficeCount);

    private sealed record FieldAuditSnapshot(bool IsAllowed, string? LabelOverride, int DisplayOrder);

    private sealed record AllowedToggle(string FieldKey, bool From, bool To);

    private sealed record LabelChange(string FieldKey, string? From, string? To);

    private sealed record OrderChange(string FieldKey, int From, int To);

    private sealed record AuditDiff(
        IReadOnlyList<string> AddedKeys,
        IReadOnlyList<string> RemovedKeys,
        IReadOnlyList<AllowedToggle> AllowedToggles,
        IReadOnlyList<LabelChange> LabelChanges,
        IReadOnlyList<OrderChange> OrderChanges,
        string Description)
    {
        public bool IsEmpty =>
            AddedKeys.Count == 0
            && RemovedKeys.Count == 0
            && AllowedToggles.Count == 0
            && LabelChanges.Count == 0
            && OrderChanges.Count == 0;
    }
}
