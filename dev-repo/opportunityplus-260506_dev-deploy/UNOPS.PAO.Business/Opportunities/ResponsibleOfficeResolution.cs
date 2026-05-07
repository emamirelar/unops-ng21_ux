using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;

namespace UNOPS.PAO.Business.Opportunities;

/// <summary>
/// Maps opportunity "responsible org" keys (Office.Id from UI/API) to OrganizationHierarchy.Id for EntityUserRoles and legacy logic.
/// </summary>
public static class ResponsibleOfficeResolution
{
    /// <summary>
    /// If <paramref name="responsibleKey"/> is an Office id, returns its linked OrganizationHierarchy id.
    /// Otherwise, if it matches an OrganizationHierarchy id, returns that id.
    /// </summary>
    public static async Task<int?> GetOrganizationHierarchyIdForResponsibleKeyAsync(
        AppDbContext context,
        int responsibleKey,
        CancellationToken cancellationToken = default)
    {
        var officeHierarchyId = await context.Set<Office>()
            .AsNoTracking()
            .Where(o => o.Id == responsibleKey && !o.IsDeleted)
            .Select(o => o.OrganizationHierarchyId)
            .FirstOrDefaultAsync(cancellationToken);

        if (officeHierarchyId.HasValue)
            return officeHierarchyId;

        var exists = await context.OrganizationHierarchies.AsNoTracking()
            .AnyAsync(oh => oh.Id == responsibleKey && !oh.IsDeleted, cancellationToken);

        return exists ? responsibleKey : null;
    }

    /// <summary>
    /// Resolves a mix of Office ids and OrganizationHierarchy ids to distinct OrganizationHierarchy ids.
    /// </summary>
    public static async Task<int[]> ResolveKeysToOrganizationHierarchyIdsAsync(
        AppDbContext context,
        int[] keys,
        CancellationToken cancellationToken = default)
    {
        if (keys == null || keys.Length == 0)
            return Array.Empty<int>();

        var distinct = keys.Distinct().ToArray();

        var fromOffices = await context.Set<Office>()
            .AsNoTracking()
            .Where(o => !o.IsDeleted && distinct.Contains(o.Id) && o.OrganizationHierarchyId != null)
            .Select(o => o.OrganizationHierarchyId!.Value)
            .ToListAsync(cancellationToken);

        var officeIdsFound = await context.Set<Office>()
            .AsNoTracking()
            .Where(o => !o.IsDeleted && distinct.Contains(o.Id))
            .Select(o => o.Id)
            .ToListAsync(cancellationToken);

        var officeIdSet = new HashSet<int>(officeIdsFound);
        var notOffices = distinct.Where(k => !officeIdSet.Contains(k)).ToArray();

        var hierarchyOnly = await context.OrganizationHierarchies.AsNoTracking()
            .Where(oh => !oh.IsDeleted && notOffices.Contains(oh.Id))
            .Select(oh => oh.Id)
            .ToListAsync(cancellationToken);

        return fromOffices.Concat(hierarchyOnly).Distinct().ToArray();
    }
}
