namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Key information section for office detail.
/// </summary>
public class OfficeKeyInformationModel
{
    public int Id { get; set; }
    public required string Code { get; set; }
    public string? InternalName { get; set; }
    public string? Alias { get; set; }
    public string? ExternalName { get; set; }
    public string? OrganisationalEntityType { get; set; }
    public int? HierarchyLevel { get; set; }
    public DateTime? EffectiveDate { get; set; }
}
