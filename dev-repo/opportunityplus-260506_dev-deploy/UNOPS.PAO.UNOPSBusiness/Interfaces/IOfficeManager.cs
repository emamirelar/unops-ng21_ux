using System.Security.Claims;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Models.Offices;
using UNOPS.PAO.Models.Shared;

namespace UNOPS.PAO.UNOPSBusiness.Interfaces;

/// <summary>
/// Manager for Office entity data access.
/// </summary>
public interface IOfficeManager
{
    Task<Office?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Office?> GetByCodeAsync(string code, CancellationToken cancellationToken = default);
    Task<PaginationResponse<OfficeListModel>> GetOfficesAsync(OfficeFilterRequest request, CancellationToken cancellationToken = default);
    /// <summary>Returns OfficeListModel for given IDs (used by global search).</summary>
    Task<List<object>> GetByIdsAsync(int[] ids, ClaimsPrincipal? user = null);

    /// <summary>Maps Office entities to OfficeListModel with ChildrenCount and RegionalDirector.</summary>
    Task<List<OfficeListModel>> MapOfficesToOfficeListModelsAsync(List<Office> offices, CancellationToken cancellationToken = default);
}
