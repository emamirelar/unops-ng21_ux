using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSBusiness.Extensions;

/// <summary>
/// Partner org scope is persisted in <see cref="OfficeRelationship"/> only.
/// These methods clear the in-memory <see cref="Partner.OfficeRelationships"/> navigation (not EF-mapped).
/// </summary>
public static class PartnerExtensions
{
    public static Task LoadOrganizationUnitRelationshipsAsync(this Partner partner, UNOPSAppDbContext context)
    {
        if (partner != null)
            partner.OfficeRelationships = new List<OfficeRelationship>();
        return Task.CompletedTask;
    }

    public static Task LoadOrganizationUnitRelationshipsAsync(this IEnumerable<Partner> partners, UNOPSAppDbContext context)
    {
        foreach (var partner in partners)
            partner.OfficeRelationships = new List<OfficeRelationship>();
        return Task.CompletedTask;
    }

    public static Task EnsureOrganizationUnitRelationshipsLoadedAsync(this IEnumerable<Partner> partners, UNOPSAppDbContext context)
    {
        return partners.LoadOrganizationUnitRelationshipsAsync(context);
    }
}
