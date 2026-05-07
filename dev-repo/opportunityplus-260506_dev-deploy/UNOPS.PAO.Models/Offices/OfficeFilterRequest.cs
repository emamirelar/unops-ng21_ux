using UNOPS.PAO.Models.Shared;

namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Filter request for office list/search.
/// </summary>
public class OfficeFilterRequest : PaginationRequest
{
    public string? Name { get; set; }
    public string? Alias { get; set; }
    public string? Code { get; set; }
    public string? Type { get; set; }
    public int? ParentId { get; set; }
    public string? CostCentreId { get; set; }
    public string? SearchTerm { get; set; }
    public string? InternalName { get; set; }
    public string? ExternalName { get; set; }
    public int? HierarchyLevel { get; set; }
    public DateTime? EffectiveDateFrom { get; set; }
    public DateTime? EffectiveDateTo { get; set; }
    public string? FinancialCentreType { get; set; }
    public string? Funding { get; set; }
    public string? ScopeType { get; set; }
    public int? Status { get; set; }
}
