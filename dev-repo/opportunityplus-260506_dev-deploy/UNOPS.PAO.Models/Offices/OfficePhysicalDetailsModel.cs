namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Physical office/location details from oneUNOPS Projects.
/// Populated when oUP sync is available.
/// </summary>
public class OfficePhysicalDetailsModel
{
    public string? OfficeId { get; set; }
    public string? OfficeName { get; set; }
    public string? Alias { get; set; }
    public string? LocationType { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? Country { get; set; }
    public string? GeoCoordinates { get; set; }
}
