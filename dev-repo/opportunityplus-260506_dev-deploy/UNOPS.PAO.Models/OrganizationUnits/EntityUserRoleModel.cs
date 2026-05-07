namespace UNOPS.PAO.Models.OrganizationUnits;

/// <summary>
/// Model representing an entity user role assignment for an organization hierarchy.
/// Used to display users assigned to specific roles within an org unit.
/// </summary>
public class EntityUserRoleModel
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
    public int EntityRoleId { get; set; }
    public string? EntityRoleName { get; set; }
    public int OrganizationHierarchyId { get; set; }
    public string? OrganizationHierarchyName { get; set; }
}

/// <summary>
/// Response model for entity user roles grouped by entity role.
/// </summary>
public class EntityUserRolesByOrgUnitResponse
{
    public int OrganizationHierarchyId { get; set; }
    public string? OrganizationHierarchyName { get; set; }
    public string? OrganizationHierarchyType { get; set; }
    public List<EntityUserRoleGroupModel> RoleGroups { get; set; } = new();
    /// <summary>DoA types (Human Resources, Finance, Procurement, Procurement ICA, Engagement Acceptance) that have no assigned holders for this org unit.</summary>
    public List<string> UnassignedDoATypes { get; set; } = new();
}

/// <summary>
/// Represents a group of users assigned to a specific entity role.
/// </summary>
public class EntityUserRoleGroupModel
{
    public int EntityRoleId { get; set; }
    public string? EntityRoleName { get; set; }
    public string? EntityRoleCode { get; set; }
    public List<UserBasicModel> Users { get; set; } = new();
}

/// <summary>
/// Basic user information model.
/// Aligned with EntityUserRole: PositionTitle, OrgUnitWorksAt, ApplicabilityPeriod*, Conditions, DoAType.
/// </summary>
public class UserBasicModel
{
    public int UserId { get; set; }
    public string? Name { get; set; }
    public string? Email { get; set; }
    /// <summary>Standardised position title (from EntityUserRole.PositionTitle or UserProfile.Position).</summary>
    public string? Position { get; set; }
    /// <summary>Org unit where the holder works (Operational Roles / DoA Holders AC).</summary>
    public string? OrgUnitWorksAt { get; set; }
    /// <summary>Start of applicability period for DoA (date only).</summary>
    public DateTime? ApplicabilityPeriodStart { get; set; }
    /// <summary>End of applicability period for DoA (date only; null = ongoing).</summary>
    public DateTime? ApplicabilityPeriodEnd { get; set; }
    /// <summary>Conditions or notes for the DoA assignment.</summary>
    public string? Conditions { get; set; }
    /// <summary>DoA type (e.g., Engagement Acceptance, Finance, HR, Procurement).</summary>
    public string? DoAType { get; set; }

    /// <summary>Officer-in-Charge user id (resource id) when set on the assignment (e.g. DoA Engagement Acceptance).</summary>
    public string? OfficerInChargeResourceId { get; set; }

    /// <summary>Resolved display name for <see cref="OfficerInChargeResourceId"/> when it matches an internal user.</summary>
    public string? OfficerInChargeDisplayName { get; set; }
}

