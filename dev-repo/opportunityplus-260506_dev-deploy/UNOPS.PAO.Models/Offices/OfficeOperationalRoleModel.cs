namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Operational role for office (e.g., Regional Director, HSSE Coordinator).
/// </summary>
public class OfficeOperationalRoleModel
{
    /// <summary>Entity role code (e.g. Regional_Director_OrganizationHierarchy) for fixed matrix rows.</summary>
    public string EntityRoleCode { get; set; } = string.Empty;

    public string RoleName { get; set; } = string.Empty;
    public string? HolderName { get; set; }

    /// <summary>When known, PAO user id of the holder (for edit UI pre-selection).</summary>
    public int? HolderUserId { get; set; }

    public string? PositionTitle { get; set; }
    public string? OrgUnitWorksAt { get; set; }

    /// <summary>Start of assignment applicability (AC3), from EntityUserRole when present.</summary>
    public DateTime? ApplicabilityPeriodStart { get; set; }

    public bool IsActive { get; set; }

    /// <summary>
    /// True when the Director/Manager holder&apos;s &quot;Works at&quot; does not match this office&apos;s org unit (AC6).
    /// </summary>
    public bool WorksAtMismatch { get; set; }
}
