using System.Globalization;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Business.Workflow.Interfaces;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Models.Offices;
using UNOPS.Workflow.Business.Interfaces;
using UNOPS.Workflow.DataAccess;
using UNOPS.Workflow.Domain.Entities;
using UNOPS.Workflow.Models.WorkflowVersionAdmin;

namespace UNOPS.PAO.Business.Workflow;

/// <inheritdoc />
public sealed class OfficeWorkflowConfigService : IOfficeWorkflowConfigService
{
    private readonly WorkflowDbContext _workflowContext;
    private readonly AppDbContext _appDb;
    private readonly IWorkflowRepository _workflowRepository;
    private readonly IWorkflowVersionAdminService _workflowVersionAdminService;

    public OfficeWorkflowConfigService(
        WorkflowDbContext workflowContext,
        AppDbContext appDb,
        IWorkflowRepository workflowRepository,
        IWorkflowVersionAdminService workflowVersionAdminService)
    {
        _workflowContext = workflowContext;
        _appDb = appDb;
        _workflowRepository = workflowRepository;
        _workflowVersionAdminService = workflowVersionAdminService;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyList<string>> ListEntityTypesForOfficeScopeAsync(
        int officeId,
        CancellationToken cancellationToken = default)
    {
        _ = officeId;

        var types = await _workflowContext.StateMachineVersions
            .AsNoTracking()
            .Where(v => !v.IsDeleted)
            .Select(v => v.EntityType)
            .Distinct()
            .ToListAsync(cancellationToken);

        if (!types.Contains(OpportunityWorkflow.EntityName))
            types.Add(OpportunityWorkflow.EntityName);

        types.Sort(StringComparer.Ordinal);
        return types;
    }

    /// <inheritdoc />
    public Task<IReadOnlyList<WorkflowVersionSummaryDto>> ListVersionsForOfficeScopeAsync(
        int officeId,
        string entityType,
        CancellationToken cancellationToken = default) =>
        _workflowVersionAdminService.ListVersionsForScopeAsync(
            new WorkflowVersionScopeDescriptor
            {
                EntityType = entityType,
                ScopeEntityName = OpportunityWorkflow.WorkflowScopeEntityName,
                ScopeEntityId = officeId.ToString(CultureInfo.InvariantCulture)
            },
            cancellationToken);

    /// <inheritdoc />
    public async Task<IReadOnlyList<OfficeWorkflowEntityTypeOverviewDto>> GetWorkflowConfigurationOverviewAsync(
        OfficeDetailModel office,
        CancellationToken cancellationToken = default)
    {
        var officeId = office.Id;
        var entityTypes = await ListEntityTypesForOfficeScopeAsync(officeId, cancellationToken);
        var scopeName = OpportunityWorkflow.WorkflowScopeEntityName;
        var currentScopeId = officeId.ToString(CultureInfo.InvariantCulture);
        var relatedIds = RelatedInstanceScopeIds(office);
        var utc = DateTime.UtcNow;

        var officeNamesByScopeId = (office.ParentChain ?? [])
            .Where(n => n.OfficeId.HasValue || n.Id > 0)
            .GroupBy(n => (n.OfficeId ?? n.Id).ToString(CultureInfo.InvariantCulture))
            .ToDictionary(g => g.Key, g => g.First().Name, StringComparer.Ordinal);

        var result = new List<OfficeWorkflowEntityTypeOverviewDto>();
        var scopeResolutionOrder = OfficeWorkflowScopeResolution.BuildOrderFromParentChain(office);
        foreach (var entityType in entityTypes)
        {
            var rows = await _workflowRepository.ListStateMachineVersionsForOfficeConfigurationAsync(
                entityType,
                scopeName,
                currentScopeId,
                relatedIds,
                utc,
                cancellationToken);

            var applicableId = await _workflowRepository.ResolveApplicableVersionIdAsync(
                entityType,
                scopeName,
                currentScopeId,
                utc,
                cancellationToken,
                scopeResolutionOrder);

            StateMachineVersion? applicableRow = null;
            if (applicableId.HasValue)
                applicableRow = rows.FirstOrDefault(r => r.Id == applicableId.Value);

            if (applicableRow is null && applicableId.HasValue)
            {
                applicableRow = await _workflowContext.StateMachineVersions
                    .AsNoTracking()
                    .FirstOrDefaultAsync(v => v.Id == applicableId.Value && !v.IsDeleted, cancellationToken);
            }

            var (ctxKind, ctxDetail) = ResolveApplicableContext(
                applicableRow,
                scopeName,
                currentScopeId,
                officeNamesByScopeId);

            var summaries = rows
                .Select(v => MapSummary(v, scopeName, currentScopeId, applicableId, officeNamesByScopeId))
                .ToList();

            var upcomingRows = await _workflowRepository.ListUpcomingStateMachineVersionsForOfficeConfigurationAsync(
                entityType,
                scopeName,
                currentScopeId,
                relatedIds,
                utc,
                cancellationToken);

            var upcomingSummaries = upcomingRows
                .Select(v => MapSummary(v, scopeName, currentScopeId, applicableId: null, officeNamesByScopeId))
                .ToList();

            result.Add(new OfficeWorkflowEntityTypeOverviewDto
            {
                EntityType = entityType,
                ApplicableStateMachineVersionId = applicableId,
                ApplicableContextKind = ctxKind,
                ApplicableContextDetail = ctxDetail,
                Versions = summaries,
                UpcomingVersions = upcomingSummaries
            });
        }

        return result;
    }

    /// <inheritdoc />
    public async Task<OfficeWorkflowApplicableVersionResponse> GetApplicableVersionAsync(
        int officeId,
        string entityType,
        CancellationToken cancellationToken = default)
    {
        var scopeResolutionOrder = await OfficeWorkflowScopeResolution.BuildOrderForOfficeIdAsync(
            _appDb,
            officeId,
            cancellationToken);

        var versionId = await _workflowRepository.ResolveApplicableVersionIdAsync(
            entityType,
            OpportunityWorkflow.WorkflowScopeEntityName,
            officeId.ToString(CultureInfo.InvariantCulture),
            DateTime.UtcNow,
            cancellationToken,
            scopeResolutionOrder);

        return new OfficeWorkflowApplicableVersionResponse
        {
            EntityType = entityType,
            ApplicableStateMachineVersionId = versionId
        };
    }

    /// <inheritdoc />
    public async Task<WorkflowVersionGraphDto?> GetGraphForOfficeScopeAsync(
        OfficeDetailModel office,
        string entityType,
        int stateMachineVersionId,
        CancellationToken cancellationToken = default)
    {
        var scopeName = OpportunityWorkflow.WorkflowScopeEntityName;
        var currentId = office.Id.ToString(CultureInfo.InvariantCulture);
        var related = RelatedInstanceScopeIds(office);

        var version = await _workflowContext.StateMachineVersions
            .AsNoTracking()
            .FirstOrDefaultAsync(v => v.Id == stateMachineVersionId && !v.IsDeleted, cancellationToken);

        if (version is null || !string.Equals(version.EntityType, entityType, StringComparison.Ordinal))
            return null;

        static bool E(string? s) => string.IsNullOrWhiteSpace(s);

        var allowed =
            (version.ScopeEntityName == scopeName && version.ScopeEntityId == currentId) ||
            (version.ScopeEntityName == scopeName && E(version.ScopeEntityId)) ||
            (E(version.ScopeEntityName) && E(version.ScopeEntityId)) ||
            (version.ScopeEntityName == scopeName &&
             version.ScopeEntityId != null &&
             related.Contains(version.ScopeEntityId));

        if (!allowed)
            return null;

        return await _workflowVersionAdminService.GetWorkflowGraphAsync(stateMachineVersionId, cancellationToken);
    }

    /// <inheritdoc />
    public Task<WorkflowVersionSaveResult> SaveForOfficeScopeAsync(
        int officeId,
        OfficeWorkflowVersionSaveRequest request,
        CancellationToken cancellationToken = default)
    {
        var workflowRequest = new WorkflowVersionSaveRequest
        {
            TargetScope = new WorkflowVersionScopeDescriptor
            {
                EntityType = request.EntityType,
                ScopeEntityName = OpportunityWorkflow.WorkflowScopeEntityName,
                ScopeEntityId = officeId.ToString(CultureInfo.InvariantCulture)
            },
            SourceVersionId = request.SourceVersionId,
            EffectiveFromUtc = request.EffectiveFromUtc,
            ActivateImmediately = request.ActivateImmediately,
            VersionDisplayName = request.VersionDisplayName,
            Graph = request.Graph
        };

        return _workflowVersionAdminService.SaveWorkflowVersionAsync(workflowRequest, cancellationToken);
    }

    private static HashSet<string> RelatedInstanceScopeIds(OfficeDetailModel office)
    {
        var ids = new HashSet<string>(StringComparer.Ordinal)
        {
            office.Id.ToString(CultureInfo.InvariantCulture)
        };
        foreach (var node in office.ParentChain ?? [])
        {
            var oid = node.OfficeId ?? node.Id;
            if (oid > 0)
                ids.Add(oid.ToString(CultureInfo.InvariantCulture));
        }

        return ids;
    }

    private static WorkflowVersionSummaryDto MapSummary(
        StateMachineVersion v,
        string scopeName,
        string currentOfficeScopeId,
        int? applicableId,
        IReadOnlyDictionary<string, string> officeNamesByScopeId)
    {
        var classification = Classify(v, scopeName);
        string? instanceOfficeName = null;
        if (classification == WorkflowVersionScopeClassification.InstanceScoped
            && v.ScopeEntityId != null
            && officeNamesByScopeId.TryGetValue(v.ScopeEntityId.Trim(), out var oname))
            instanceOfficeName = oname;

        return new WorkflowVersionSummaryDto
        {
            Id = v.Id,
            EntityType = v.EntityType,
            ScopeEntityName = v.ScopeEntityName,
            ScopeEntityId = v.ScopeEntityId,
            EffectiveFrom = v.EffectiveFrom,
            EffectiveTo = v.EffectiveTo,
            Status = v.Status,
            ScopeClassification = classification,
            ScopeInstanceName = instanceOfficeName,
            IsCurrentlyApplicable = applicableId.HasValue && v.Id == applicableId.Value,
            CreatedBy = v.CreatedBy,
            CreatedDate = v.CreatedDate
        };
    }

    private static WorkflowVersionScopeClassification Classify(StateMachineVersion v, string scopeName)
    {
        static bool E(string? s) => string.IsNullOrWhiteSpace(s);
        if (E(v.ScopeEntityName) && E(v.ScopeEntityId))
            return WorkflowVersionScopeClassification.SubjectDefault;
        if (!E(v.ScopeEntityName) && string.Equals(v.ScopeEntityName, scopeName, StringComparison.Ordinal) && E(v.ScopeEntityId))
            return WorkflowVersionScopeClassification.ScopeKindDefault;
        return WorkflowVersionScopeClassification.InstanceScoped;
    }

    private static (OfficeWorkflowApplicableContextKind Kind, string? Detail) ResolveApplicableContext(
        StateMachineVersion? applicableRow,
        string scopeName,
        string currentOfficeScopeId,
        IReadOnlyDictionary<string, string> officeNamesByScopeId)
    {
        if (applicableRow is null)
            return (OfficeWorkflowApplicableContextKind.None, null);

        var classification = Classify(applicableRow, scopeName);
        switch (classification)
        {
            case WorkflowVersionScopeClassification.SubjectDefault:
                return (OfficeWorkflowApplicableContextKind.GlobalDefault, null);
            case WorkflowVersionScopeClassification.ScopeKindDefault:
                return (OfficeWorkflowApplicableContextKind.OfficeScopeDefault, null);
            case WorkflowVersionScopeClassification.InstanceScoped:
            {
                var sid = applicableRow.ScopeEntityId?.Trim();
                if (string.Equals(sid, currentOfficeScopeId, StringComparison.Ordinal))
                    return (OfficeWorkflowApplicableContextKind.ThisOffice, null);
                if (sid != null &&
                    officeNamesByScopeId.TryGetValue(sid, out var pname) &&
                    !string.Equals(sid, currentOfficeScopeId, StringComparison.Ordinal))
                    return (OfficeWorkflowApplicableContextKind.InheritedFromParent, pname);
                return (OfficeWorkflowApplicableContextKind.OtherOfficeInstance, sid);
            }
            default:
                return (OfficeWorkflowApplicableContextKind.None, null);
        }
    }
}
