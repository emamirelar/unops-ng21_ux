namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Country in geographic scope.
/// </summary>
public class CountryScopeModel
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    /// <summary>Office responsible for this country (e.g. "Kenya MCO (B0110)") when an Office exists at the country's OrganizationHierarchyId; otherwise "Directly under [current office]".</summary>
    public string? ResponsibleOfficeName { get; set; }
    /// <summary>Office ID for linking to office detail when an Office exists at the country's OrganizationHierarchyId.</summary>
    public int? ResponsibleOfficeId { get; set; }
    /// <summary>Status: "Assigned" when an Office exists at the country's OrganizationHierarchyId, "Unassigned child" when directly under current office.</summary>
    public string? Status { get; set; }
}
