using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using UNOPS.PAO.Domain.Infrastructure;
using UNOPS.PAO.Identity.Entities;

namespace UNOPS.PAO.Domain.Entities;

/// <summary>
/// Links a user to an entity (e.g., OrganizationHierarchy) with a specific role.
/// Supports both Operational (Mgmt) and DoA (Delegation of Authority) roles.
/// </summary>
public class EntityUserRole : ModifiableDeletableEntity
{
    public int UserId { get; set; }
    public virtual PAOUser? User { get; set; }
    public int? RoleId { get; set; }
    public IdentityUserRole<int>? UserRole { get; set; }

    /// <summary>
    /// FK to EntityRole - defines the specific role type (e.g., Region Director, DoA1).
    /// </summary>
    public int? EntityRoleId { get; set; }
    public virtual EntityRole? EntityRole { get; set; }

    public int EntityId { get; set; }
    public required string EntityType { get; set; }

    /// <summary>
    /// Source of the role assignment: 'DoA' (Delegation of Authority from BigQuery or manual),
    /// 'Mgmt' (Management roles from BigQuery org structure),
    /// 'OfficeMaster' (Director/Manager, OiC, HSSE from MASTER Office Data Google Sheet),
    /// 'RoleSheet' (practitioner / RMOA+HQ CSV and other sheet imports — excluded from EDS Mgmt orphan cleanup).
    /// </summary>
    public string? RoleSource { get; set; }

    /// <summary>
    /// Position title of the role holder (e.g., "Regional Director", "HSSE Coordinator").
    /// </summary>
    [MaxLength(255)]
    public string? PositionTitle { get; set; }

    /// <summary>
    /// Org unit where the holder works (for display in Operational Roles / DoA Holders).
    /// </summary>
    [MaxLength(255)]
    public string? OrgUnitWorksAt { get; set; }

    /// <summary>
    /// Start of applicability period for DoA (date only).
    /// </summary>
    public DateTime? ApplicabilityPeriodStart { get; set; }

    /// <summary>
    /// End of applicability period for DoA (date only).
    /// </summary>
    public DateTime? ApplicabilityPeriodEnd { get; set; }

    /// <summary>
    /// Conditions or notes for the DoA assignment.
    /// </summary>
    public string? Conditions { get; set; }

    /// <summary>
    /// DoA type (e.g., "Engagement Acceptance", "Financial", "HR", "Procurement", "HSSE").
    /// </summary>
    [MaxLength(100)]
    public string? DoAType { get; set; }

    /// <summary>
    /// Officer-in-Charge resource ID (from Delegation_Of_Authorities_Report.Officer_In_Charge_Resource).
    /// </summary>
    [MaxLength(50)]
    public string? OfficerInChargeResourceId { get; set; }

    /// <summary>
    /// When true, this row was created outside EDS (e.g. UI test DoA assignment) and must not be
    /// soft-deleted by DoA orphan sync.
    /// </summary>
    public bool IsManualAssignment { get; set; } = false;
}