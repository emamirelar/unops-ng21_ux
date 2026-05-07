namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Office tree node for hierarchy display.
/// </summary>
public class OfficeTreeNodeModel
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Type { get; set; }
    public List<OfficeTreeNodeModel> Children { get; set; } = new();
}
