namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Lightweight opportunity model for office-related opportunities list.
/// Matches frontend OfficeRelatedOpportunity interface.
/// </summary>
public class OfficeRelatedOpportunityModel
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public int? ResponsibleOrgUnitId { get; set; }
    public string? ResponsibleOrgUnitName { get; set; }
    public string? Stage { get; set; }
    public string? PartnerName { get; set; }
    public decimal? Value { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? TargetSigningDate { get; set; }
}
