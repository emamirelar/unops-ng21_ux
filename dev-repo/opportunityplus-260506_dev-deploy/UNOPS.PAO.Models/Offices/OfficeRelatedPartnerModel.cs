namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Lightweight partner model for office-related partners list.
/// Matches frontend OfficeRelatedPartner interface.
/// </summary>
public class OfficeRelatedPartnerModel
{
    public int Id { get; set; }
    public string? Name { get; set; }
    /// <summary>EntityStatus value (e.g. 0=Inactive, 1=Active, 4=Closed, 5=Archived).</summary>
    public int Status { get; set; }
    /// <summary>Count of related opportunities (as client or funding partner).</summary>
    public int OpportunitiesCount { get; set; }
}
