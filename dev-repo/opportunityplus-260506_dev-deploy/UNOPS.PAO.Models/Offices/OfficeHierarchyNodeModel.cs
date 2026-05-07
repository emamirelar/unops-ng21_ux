namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Office hierarchy node (parent chain).
/// </summary>
public class OfficeHierarchyNodeModel
{
    public int Id { get; set; }
    /// <summary>
    /// Office ID for navigation; null when no Office record exists for this org unit.
    /// </summary>
    public int? OfficeId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
    /// <summary>True for the office being viewed (last row in the chain).</summary>
    public bool IsCurrent { get; set; }
}
