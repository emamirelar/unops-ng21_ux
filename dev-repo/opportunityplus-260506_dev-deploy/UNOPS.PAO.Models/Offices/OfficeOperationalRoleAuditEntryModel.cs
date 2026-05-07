namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// One audit row for in-app operational role assignments (AC5); sourced from <c>AuditLogs</c> with <c>EntityType = OfficeOperationalRole</c>.
/// </summary>
public class OfficeOperationalRoleAuditEntryModel
{
    public DateTime Timestamp { get; set; }

    public int ChangedByUserId { get; set; }

    public string? ChangedByName { get; set; }

    public string EntityRoleCode { get; set; } = string.Empty;

    /// <summary>Entity role display name from DB (same source as operational roles <c>roleName</c>).</summary>
    public string? RoleName { get; set; }

    /// <summary>Assignment effective date (yyyy-MM-dd) from audit payload when present.</summary>
    public string? EffectiveDate { get; set; }

    public int NewUserId { get; set; }

    public string? NewAssigneeName { get; set; }

    public List<int> PreviousUserIds { get; set; } = new();

    public string? Description { get; set; }
}
