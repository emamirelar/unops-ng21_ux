using UNOPS.PAO.Models.Offices;
using UNOPS.PAO.Models.Shared;

namespace UNOPS.PAO.UNOPSBusiness.Interfaces;

/// <summary>
/// Service for Office entity operations including list, search, tree, detail,
/// related entities, and permissions.
/// </summary>
public interface IOfficeService
{
    Task<PaginationResponse<OfficeListModel>> GetOfficesAsync(OfficeFilterRequest request, CancellationToken cancellationToken = default);
    Task<PaginationResponse<OfficeListModel>> SearchOfficesAsync(string query, OfficeFilterRequest request, CancellationToken cancellationToken = default);
    Task<List<OfficeTreeNodeModel>> GetOfficeTreeAsync(int? rootId, CancellationToken cancellationToken = default);
    Task<OfficeDetailModel?> GetOfficeDetailAsync(int id, CancellationToken cancellationToken = default);
    Task<PaginationResponse<OfficeRelatedOpportunityModel>> GetRelatedOpportunitiesAsync(int officeId, OfficeFilterRequest request, CancellationToken cancellationToken = default);
    Task<PaginationResponse<OfficeRelatedPartnerModel>> GetRelatedPartnersAsync(int officeId, OfficeFilterRequest request, CancellationToken cancellationToken = default);
    Task<OfficePermissionsModel?> GetOfficePermissionsAsync(int officeId, int userId, CancellationToken cancellationToken = default);

    /// <summary>
    /// Updates one OfficeMaster operational role (Director, Deputy Director, or HSSE Coordinator) for the office.
    /// Re-syncs opportunity stakeholders for opportunities using this office as responsible unit.
    /// </summary>
    Task<OfficeDetailModel?> UpdateOfficeOperationalRoleAsync(
        int officeId,
        UpdateOfficeOperationalRoleRequest request,
        int currentUserId,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Paged audit entries for one editable operational role (same source as office detail audit trail, filtered by role code).
    /// </summary>
    Task<OfficeOperationalRoleAssignmentHistoryResponse?> GetOperationalRoleAssignmentHistoryAsync(
        int officeId,
        string entityRoleCode,
        int pageIndex,
        int pageSize,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Resolves global-filter / default-org scope: <paramref name="officeOrLegacyHierarchyId"/> is an
    /// <see cref="UNOPS.PAO.Domain.Entities.Office.Id"/> when chosen from the office tree, or a legacy
    /// <see cref="UNOPS.PAO.Domain.Entities.OrganizationHierarchy.Id"/>. Returns hierarchy ids for relationship-based filters.
    /// </summary>
    /// <param name="skipFilter">When true, do not apply org scope (e.g. root OPS).</param>
    Task<(bool SkipFilter, List<int> OrganizationHierarchyIds)> ResolveGlobalFilterOrganizationHierarchyIdsAsync(
        int officeOrLegacyHierarchyId,
        CancellationToken cancellationToken = default);
}
