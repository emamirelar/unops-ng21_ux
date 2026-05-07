using System.Globalization;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Models.Offices;

namespace UNOPS.PAO.Business.Workflow;

/// <summary>
/// Builds office scope instance order for workflow version resolution (current office, then parents toward root).
/// Matches <see cref="OfficeWorkflowConfigService"/> / regional office configuration behavior.
/// </summary>
public static class OfficeWorkflowScopeResolution
{
    /// <summary>
    /// Office ids to try for instance-scoped workflow versions: current office, then immediate parent, up to root.
    /// </summary>
    public static IReadOnlyList<string> BuildOrderFromParentChain(OfficeDetailModel office)
    {
        var order = new List<string> { office.Id.ToString(CultureInfo.InvariantCulture) };
        var chain = office.ParentChain;
        if (chain == null || chain.Count < 2)
            return order;

        for (var i = chain.Count - 2; i >= 0; i--)
        {
            var node = chain[i];
            var oid = node.OfficeId ?? node.Id;
            if (oid <= 0)
                continue;
            var s = oid.ToString(CultureInfo.InvariantCulture);
            if (order.Contains(s, StringComparer.Ordinal))
                continue;
            order.Add(s);
        }

        return order;
    }

    /// <inheritdoc cref="BuildOrderFromParentChain" />
    public static async Task<IReadOnlyList<string>> BuildOrderForOfficeIdAsync(
        AppDbContext db,
        int officeId,
        CancellationToken cancellationToken = default)
    {
        var office = await db.Offices
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == officeId && !o.IsDeleted, cancellationToken);

        if (office == null)
            return new[] { officeId.ToString(CultureInfo.InvariantCulture) };

        var ancestorsRootToParent = await BuildAncestorOfficeIdsRootToParentAsync(db, office, cancellationToken);
        var order = new List<string> { office.Id.ToString(CultureInfo.InvariantCulture) };
        for (var i = ancestorsRootToParent.Count - 1; i >= 0; i--)
        {
            var id = ancestorsRootToParent[i];
            if (id <= 0)
                continue;
            var s = id.ToString(CultureInfo.InvariantCulture);
            if (order.Contains(s, StringComparer.Ordinal))
                continue;
            order.Add(s);
        }

        return order;
    }

    private static async Task<List<int>> BuildAncestorOfficeIdsRootToParentAsync(
        AppDbContext db,
        Office office,
        CancellationToken cancellationToken)
    {
        var ancestors = new List<int>();
        if (!office.ParentOrganizationHierarchyId.HasValue)
            return ancestors;

        var cursor = office;
        var visited = new HashSet<int>();
        const int maxDepth = 64;
        for (var depth = 0; depth < maxDepth && cursor.ParentOrganizationHierarchyId.HasValue; depth++)
        {
            var parentOrgId = cursor.ParentOrganizationHierarchyId.Value;
            if (!visited.Add(parentOrgId))
                break;

            var parent = await db.Offices
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    o => o.OrganizationHierarchyId == parentOrgId && !o.IsDeleted,
                    cancellationToken);
            if (parent == null)
                break;

            ancestors.Insert(0, parent.Id);
            cursor = parent;
        }

        return ancestors;
    }
}
