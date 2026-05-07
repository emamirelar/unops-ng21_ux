using System.Linq;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.Domain.Infrastructure;
using UNOPS.PAO.Models.OrganizationUnits;

namespace UNOPS.PAO.Business.Services;

/// <summary>
/// Dual-write / read support: mirrors <see cref="OrganizationUnitRelationship"/> (hierarchy keys) to
/// <see cref="OfficeRelationship"/> (office keys) and helps global filters merge both sources.
/// </summary>
public static class OfficeRelationshipSyncHelper
{
    public static async Task<List<int>> GetOfficeIdsMatchingOrgFilterAsync(
        AppDbContext context,
        IReadOnlyList<int> orgUnitIds,
        CancellationToken cancellationToken = default)
    {
        if (orgUnitIds == null || orgUnitIds.Count == 0)
            return new List<int>();

        return await context.Offices.AsNoTracking()
            .Where(o => !o.IsDeleted &&
                        ((o.OrganizationHierarchyId != null && orgUnitIds.Contains(o.OrganizationHierarchyId.Value)) ||
                         orgUnitIds.Contains(o.Id)))
            .Select(o => o.Id)
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Partners that have active office links where every linked hierarchy is not <see cref="OrganizationUnitType.OrgUnit"/>.
    /// Legacy OUR filtering excluded these from list/detail views.
    /// </summary>
    public static async Task<HashSet<int>> GetPartnerIdsWithOnlyNonOrgUnitOfficeLinksAsync(
        AppDbContext context,
        CancellationToken cancellationToken = default)
    {
        var rows = await (
            from r in context.OfficeRelationships.AsNoTracking()
            join o in context.Offices.AsNoTracking() on r.OfficeId equals o.Id
            join h in context.OrganizationHierarchies.AsNoTracking() on o.OrganizationHierarchyId equals h.Id
            where r.EntityType == nameof(Partner)
                  && !r.IsDeleted
                  && r.Status == EntityStatus.Active
                  && !o.IsDeleted
                  && o.OrganizationHierarchyId != null
            select new { r.EntityId, h.Type }
        ).ToListAsync(cancellationToken);

        return rows
            .GroupBy(x => x.EntityId)
            .Where(g => g.Any() && g.All(x => x.Type != OrganizationUnitType.OrgUnit))
            .Select(g => g.Key)
            .ToHashSet();
    }

    /// <summary>
    /// True when the partner should be hidden: has at least one active office link and none of them are OrgUnit type.
    /// </summary>
    public static async Task<bool> PartnerHasOnlyNonOrgUnitOfficeLinksAsync(
        AppDbContext context,
        int partnerId,
        CancellationToken cancellationToken = default)
    {
        if (partnerId <= 0)
            return false;

        var types = await (
            from r in context.OfficeRelationships.AsNoTracking()
            join o in context.Offices.AsNoTracking() on r.OfficeId equals o.Id
            join h in context.OrganizationHierarchies.AsNoTracking() on o.OrganizationHierarchyId equals h.Id
            where r.EntityId == partnerId
                  && r.EntityType == nameof(Partner)
                  && !r.IsDeleted
                  && r.Status == EntityStatus.Active
                  && !o.IsDeleted
                  && o.OrganizationHierarchyId != null
            select h.Type
        ).ToListAsync(cancellationToken);

        if (types.Count == 0)
            return false;

        return types.All(t => t != OrganizationUnitType.OrgUnit);
    }

    public static async Task<List<int>> GetEntityIdsFromOfficeRelationshipsAsync(
        AppDbContext context,
        string entityTypeName,
        List<int> officeIds,
        CancellationToken cancellationToken = default)
    {
        if (officeIds.Count == 0)
            return new List<int>();

        return await context.OfficeRelationships.AsNoTracking()
            .Where(r => r.EntityType == entityTypeName
                        && !r.IsDeleted
                        && r.Status == EntityStatus.Active
                        && officeIds.Contains(r.OfficeId))
            .Select(r => r.EntityId)
            .Distinct()
            .ToListAsync(cancellationToken);
    }

    /// <summary>
    /// Replaces office links for an entity so they match the given organization hierarchy ids (via <see cref="Office.OrganizationHierarchyId"/>).
    /// Uses soft-delete and reactivation so rows stay auditable and the unique index on (EntityId, EntityType, OfficeId) is respected.
    /// </summary>
    /// <param name="auditUserId">User performing the change (DeletedBy / LastModifiedBy); use 0 when no user context.</param>
    public static async Task ReplaceForHierarchyKeysAsync(
        AppDbContext context,
        int entityId,
        string entityType,
        IEnumerable<int>? organizationHierarchyIds,
        int auditUserId = 0,
        CancellationToken cancellationToken = default)
    {
        var hierarchyIds = organizationHierarchyIds?.Distinct().ToList() ?? new List<int>();

        var officeRows = await context.Offices.AsNoTracking()
            .Where(o => !o.IsDeleted
                        && o.OrganizationHierarchyId != null
                        && hierarchyIds.Contains(o.OrganizationHierarchyId.Value))
            .Select(o => new { o.Id, o.Code })
            .ToListAsync(cancellationToken);

        if (hierarchyIds.Count > 0 && officeRows.Count == 0)
        {
            throw new BusinessException(
                "No active office is linked to the selected organization unit(s). Select an organization unit that matches an office.");
        }

        var targetOfficeIds = officeRows.Select(o => o.Id).ToHashSet();
        var utcNow = DateTime.UtcNow;

        if (targetOfficeIds.Count > 0)
        {
            await context.OfficeRelationships
                .Where(r => r.EntityId == entityId
                            && r.EntityType == entityType
                            && !r.IsDeleted
                            && !targetOfficeIds.Contains(r.OfficeId))
                .ExecuteUpdateAsync(setters => setters
                        .SetProperty(r => r.IsDeleted, true)
                        .SetProperty(r => r.DeletedBy, auditUserId)
                        .SetProperty(r => r.DeletedDate, utcNow),
                    cancellationToken);

            await context.OfficeRelationships
                .Where(r => r.EntityId == entityId
                            && r.EntityType == entityType
                            && r.IsDeleted
                            && targetOfficeIds.Contains(r.OfficeId))
                .ExecuteUpdateAsync(setters => setters
                        .SetProperty(r => r.IsDeleted, false)
                        .SetProperty(r => r.DeletedBy, 0)
                        .SetProperty(r => r.DeletedDate, (DateTime?)null)
                        .SetProperty(r => r.Status, EntityStatus.Active)
                        .SetProperty(r => r.LastModifiedBy, auditUserId)
                        .SetProperty(r => r.LastModifiedDate, utcNow),
                    cancellationToken);
        }
        else
        {
            await context.OfficeRelationships
                .Where(r => r.EntityId == entityId
                            && r.EntityType == entityType
                            && !r.IsDeleted)
                .ExecuteUpdateAsync(setters => setters
                        .SetProperty(r => r.IsDeleted, true)
                        .SetProperty(r => r.DeletedBy, auditUserId)
                        .SetProperty(r => r.DeletedDate, utcNow),
                    cancellationToken);
        }

        var existingOfficeIds = await context.OfficeRelationships
            .Where(r => r.EntityId == entityId && r.EntityType == entityType)
            .Select(r => r.OfficeId)
            .ToListAsync(cancellationToken);

        var toAdd = targetOfficeIds.Except(existingOfficeIds).ToList();
        if (toAdd.Count == 0)
            return;

        var codeById = officeRows.ToDictionary(x => x.Id, x => x.Code);
        foreach (var officeId in toAdd)
        {
            var code = codeById.TryGetValue(officeId, out var c) ? c : "?";
            var rel = new OfficeRelationship
            {
                OfficeId = officeId,
                EntityId = entityId,
                EntityType = entityType,
                Name = $"{entityType}-{entityId}-{code}",
                Status = EntityStatus.Active
            };
            rel.SetCreateAuditData(auditUserId);
            context.OfficeRelationships.Add(rel);
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Builds API DTOs for partner org scope from <see cref="OfficeRelationship"/> rows (no <see cref="OrganizationUnitRelationship"/> entities).
    /// </summary>
    public static List<OrganizationUnitRelationshipModel> ToPartnerOrganizationUnitRelationshipModels(
        IEnumerable<OfficeRelationship> officeRelationships)
    {
        var list = new List<OrganizationUnitRelationshipModel>();
        foreach (var r in officeRelationships)
        {
            if (r.IsDeleted || r.Status != EntityStatus.Active)
                continue;
            var office = r.Office;
            var hid = office?.OrganizationHierarchyId;
            var hierarchy = office?.OrganizationHierarchy;
            if (hid == null || hierarchy == null || office == null)
                continue;

            list.Add(new OrganizationUnitRelationshipModel
            {
                OrganizationHierarchyId = hid.Value,
                OrganizationHierarchy = new OrganizationHierarchyModel
                {
                    Id = office.Id,
                    OrganizationHierarchyId = hid.Value,
                    Code = office.Code,
                    Name = office.Name,
                    Status = hierarchy.Status.ToString(),
                    Type = hierarchy.Type.ToString(),
                    Description = hierarchy.Description,
                    ParentId = hierarchy.ParentId
                },
                EntityId = r.EntityId,
                EntityType = r.EntityType,
                Status = r.Status,
                IsDeleted = r.IsDeleted
            });
        }

        return list;
    }

    /// <summary>
    /// Batch-loads partner org scope as API models keyed by partner id.
    /// </summary>
    public static async Task<Dictionary<int, List<OrganizationUnitRelationshipModel>>> GetPartnerOrganizationUnitModelsByPartnerIdsAsync(
        AppDbContext context,
        IEnumerable<int> partnerIds,
        CancellationToken cancellationToken = default)
    {
        var ids = partnerIds.Distinct().Where(id => id > 0).ToList();
        var result = ids.ToDictionary(id => id, _ => new List<OrganizationUnitRelationshipModel>());
        if (ids.Count == 0)
            return result;

        var rels = await context.OfficeRelationships
            .AsNoTracking()
            .Include(r => r.Office)
            .ThenInclude(o => o!.OrganizationHierarchy)
            .Where(r => ids.Contains(r.EntityId)
                        && r.EntityType == nameof(Partner)
                        && !r.IsDeleted
                        && r.Status == EntityStatus.Active)
            .ToListAsync(cancellationToken);

        foreach (var group in rels.GroupBy(r => r.EntityId))
        {
            result[group.Key] = ToPartnerOrganizationUnitRelationshipModels(group);
        }

        return result;
    }

    /// <summary>
    /// Batch-loads contact org scope as API models keyed by contact id.
    /// </summary>
    public static async Task<Dictionary<int, List<OrganizationUnitRelationshipModel>>> GetContactOrganizationUnitModelsByContactIdsAsync(
        AppDbContext context,
        IEnumerable<int> contactIds,
        CancellationToken cancellationToken = default)
    {
        var ids = contactIds.Distinct().Where(id => id > 0).ToList();
        var result = ids.ToDictionary(id => id, _ => new List<OrganizationUnitRelationshipModel>());
        if (ids.Count == 0)
            return result;

        var rels = await context.OfficeRelationships
            .AsNoTracking()
            .Include(r => r.Office)
            .ThenInclude(o => o!.OrganizationHierarchy)
            .Where(r => ids.Contains(r.EntityId)
                        && r.EntityType == nameof(Contact)
                        && !r.IsDeleted
                        && r.Status == EntityStatus.Active)
            .ToListAsync(cancellationToken);

        foreach (var group in rels.GroupBy(r => r.EntityId))
            result[group.Key] = ToPartnerOrganizationUnitRelationshipModels(group);

        return result;
    }

    /// <summary>
    /// Batch-loads interaction org scope as API models keyed by interaction id.
    /// </summary>
    public static async Task<Dictionary<int, List<OrganizationUnitRelationshipModel>>> GetInteractionOrganizationUnitModelsByInteractionIdsAsync(
        AppDbContext context,
        IEnumerable<int> interactionIds,
        CancellationToken cancellationToken = default)
    {
        var ids = interactionIds.Distinct().Where(id => id > 0).ToList();
        var result = ids.ToDictionary(id => id, _ => new List<OrganizationUnitRelationshipModel>());
        if (ids.Count == 0)
            return result;

        var rels = await context.OfficeRelationships
            .AsNoTracking()
            .Include(r => r.Office)
            .ThenInclude(o => o!.OrganizationHierarchy)
            .Where(r => ids.Contains(r.EntityId)
                        && r.EntityType == nameof(Interaction)
                        && !r.IsDeleted
                        && r.Status == EntityStatus.Active)
            .ToListAsync(cancellationToken);

        foreach (var group in rels.GroupBy(r => r.EntityId))
            result[group.Key] = ToPartnerOrganizationUnitRelationshipModels(group);

        return result;
    }

    /// <summary>
    /// Comma-separated org unit labels for <see cref="UNOPS.PAO.Models.Partners.PartnerModel.PartnerOrgUnit"/>,
    /// aligned with <see cref="Partner.PartnerOrgUnit"/> (active, non-deleted links only).
    /// </summary>
    public static string FormatPartnerOrgUnitDisplay(IReadOnlyList<OrganizationUnitRelationshipModel>? relationships)
    {
        if (relationships == null || relationships.Count == 0)
            return string.Empty;

        return string.Join(", ", relationships
            .Where(r => r.Status == EntityStatus.Active && !r.IsDeleted && r.OrganizationHierarchy != null)
            .Select(r => r.OrganizationHierarchy!.Name)
            .Where(static name => !string.IsNullOrEmpty(name))
            .OrderBy(static name => name));
    }

    public static async Task SoftDeleteForEntityAsync(
        AppDbContext context,
        int entityId,
        string entityType,
        int userId,
        CancellationToken cancellationToken = default)
    {
        var utcNow = DateTime.UtcNow;
        await context.OfficeRelationships
            .Where(r => r.EntityId == entityId && r.EntityType == entityType && !r.IsDeleted)
            .ExecuteUpdateAsync(setters => setters
                    .SetProperty(r => r.IsDeleted, true)
                    .SetProperty(r => r.DeletedBy, userId)
                    .SetProperty(r => r.DeletedDate, utcNow),
                cancellationToken);
    }

    /// <summary>
    /// Merges office-based links into an in-memory list for mapping when hierarchy rows are missing.
    /// </summary>
    public static void MergeOfficeRelationshipsIntoList(
        ICollection<OrganizationUnitRelationship> target,
        IEnumerable<OfficeRelationship> officeRelationships,
        int entityId,
        string entityType)
    {
        foreach (var or in officeRelationships)
        {
            if (or.IsDeleted || or.Status != EntityStatus.Active)
                continue;
            var office = or.Office;
            var hid = office?.OrganizationHierarchyId;
            var hierarchy = office?.OrganizationHierarchy;
            if (hid == null || hierarchy == null)
                continue;
            if (target.Any(r => r.OrganizationHierarchyId == hid.Value))
                continue;
            target.Add(new OrganizationUnitRelationship
            {
                OrganizationHierarchyId = hid.Value,
                OrganizationHierarchy = hierarchy,
                EntityId = entityId,
                EntityType = entityType,
                Name = or.Name,
                Status = EntityStatus.Active
            });
        }
    }
}
