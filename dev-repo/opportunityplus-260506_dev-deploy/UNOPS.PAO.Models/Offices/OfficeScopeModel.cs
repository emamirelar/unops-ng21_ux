namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Scope section for office detail.
/// </summary>
public class OfficeScopeModel
{
    public string? ScopeType { get; set; }
    public List<CountryScopeModel>? GeographicScope { get; set; }
}
