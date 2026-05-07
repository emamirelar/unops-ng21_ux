namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Describes how the applicable workflow version resolves for an office (for UI labels).
/// </summary>
public enum OfficeWorkflowApplicableContextKind
{
    None = 0,
    GlobalDefault = 1,
    OfficeScopeDefault = 2,
    ThisOffice = 3,
    InheritedFromParent = 4,
    OtherOfficeInstance = 5
}
