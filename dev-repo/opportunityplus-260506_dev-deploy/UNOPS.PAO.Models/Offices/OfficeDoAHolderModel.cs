namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// DoA holder for office (Delegation of Authority).
/// </summary>
public class OfficeDoAHolderModel
{
    public string DoAType { get; set; } = string.Empty;
    public string DoALevel { get; set; } = string.Empty;
    public string? RoleHolder { get; set; }
    public DateTime? ApplicabilityPeriodStart { get; set; }
    public DateTime? ApplicabilityPeriodEnd { get; set; }
    public string? Conditions { get; set; }
    /// <summary>Source of the role assignment from EntityUserRole (e.g. DoA, Mgmt).</summary>
    public string? RoleSource { get; set; }
    public bool IsActive { get; set; }

    /// <summary>Officer-in-Charge resource / user id from EntityUserRole (when temporary OIC applies).</summary>
    public string? OfficerInChargeResourceId { get; set; }

    /// <summary>Resolved display name for the Officer in Charge (when <see cref="OfficerInChargeResourceId"/> is set).</summary>
    public string? OfficerInChargeDisplayName { get; set; }
}
