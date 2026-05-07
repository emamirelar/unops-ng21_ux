using UNOPS.PAO.Domain.Entities;

namespace UNOPS.PAO.Business.Opportunities;

/// <summary>
/// Filters <see cref="EntityUserRole"/> rows for Opportunity Team UI and stakeholder sync.
/// Directors sync to <see cref="OpportunityStakeholder"/>; Engagement Acceptance DoA2/DoA3 are shown only in Decision Making Pathway (not persisted as stakeholders).
/// </summary>
public static class OpportunityTeamAutoPopulateRoleFilter
{
    /// <summary>Matches <see cref="EntityRole.SubType"/> for Engagement Acceptance DoA roles in the catalog.</summary>
    public const string EngagementAcceptanceSubType = "Engagement Acceptance";

    /// <summary>Same value as workflow / assignment <see cref="EntityUserRole.DoAType"/> for EA holders.</summary>
    public const string EngagementAcceptanceDoAType = "Engagement Acceptance";

    public const string DoA2EngagementAcceptanceCode = "DoA2_Engagement_Acceptance";
    public const string DoA3EngagementAcceptanceCode = "DoA3_Engagement_Acceptance";

    /// <summary>
    /// Management / director roles for "Auto-populated from Responsible Org Unit" (and normally responsible block).
    /// </summary>
    public static readonly HashSet<string> DirectorRoleCodes = new(StringComparer.OrdinalIgnoreCase)
    {
        "Regional_Director_OrganizationHierarchy",
        "Regional_Deputy_Director_OrganizationHierarchy",
        "Director_Manager_OiC_OrganizationHierarchy",
        "MCO_Director_OrganizationHierarchy",
        "MCO_Deputy_Director_OrganizationHierarchy",
        "OrgUnit_Director_OrganizationHierarchy",
        "OrgUnit_Deputy_Director_OrganizationHierarchy",
    };

    /// <summary>
    /// Rows that sync to auto-populated <see cref="OpportunityStakeholder"/> — <b>directors only</b> (no DoA roles).
    /// </summary>
    public static bool IsDirectorStakeholderEntityUserRole(EntityUserRole eur, EntityRole? role) =>
        role?.Code != null && DirectorRoleCodes.Contains(role.Code);

    /// <summary>
    /// "Opportunity Decision Making Pathway": DoA2/DoA3 Engagement Acceptance only.
    /// Uses <see cref="EntityRole.SubType"/> (catalog), <see cref="EntityUserRole.DoAType"/> (assignment), and role <see cref="EntityRole.Code"/>.
    /// </summary>
    public static bool IsDecisionMakingPathwayEngagementAcceptanceDoA(EntityUserRole eur, EntityRole? role)
    {
        if (role?.Code == null) return false;
        if (!IsEngagementAcceptanceDoALevelCode(role.Code)) return false;
        // Catalog: SubType must be Engagement Acceptance when set (seeded roles); allow null for legacy data.
        if (!string.IsNullOrEmpty(role.SubType) &&
            !string.Equals(role.SubType, EngagementAcceptanceSubType, StringComparison.Ordinal))
            return false;
        // Assignment: same filter as PaoWorkflowApproverProvider (null = legacy).
        return eur.DoAType == null || string.Equals(eur.DoAType, EngagementAcceptanceDoAType, StringComparison.Ordinal);
    }

    public static bool IsEngagementAcceptanceDoALevelCode(string roleCode) =>
        string.Equals(roleCode, DoA2EngagementAcceptanceCode, StringComparison.OrdinalIgnoreCase)
        || string.Equals(roleCode, DoA3EngagementAcceptanceCode, StringComparison.OrdinalIgnoreCase);
}
