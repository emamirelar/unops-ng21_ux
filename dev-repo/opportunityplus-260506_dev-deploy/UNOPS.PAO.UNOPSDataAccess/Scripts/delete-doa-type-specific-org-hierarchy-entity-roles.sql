-- Removes DoA-type-specific OrganizationHierarchy roles (Financial, HR, Procurement, HSSE)
-- previously seeded in EntityRoleSeeder.SeedOrganizationHierarchyRolesAsync.
-- Schema public. Run inside EF migration (do not wrap in BEGIN/COMMIT; migration owns the transaction).
-- Deletes dependents first so FK constraints are satisfied (EntityUserRole / OpportunityStakeholder
-- do not cascade on EntityRole delete; EntityRolePerson cascades in the model but we delete explicitly for clarity).

CREATE TEMP TABLE _doa_org_hierarchy_role_codes (code text PRIMARY KEY) ON COMMIT DROP;

INSERT INTO _doa_org_hierarchy_role_codes (code) VALUES
    ('DoA1_Financial_OrganizationHierarchy'),
    ('DoA2_Financial_OrganizationHierarchy'),
    ('DoA3_Financial_OrganizationHierarchy'),
    ('DoA4_Financial_OrganizationHierarchy'),
    ('DoA1_HR_OrganizationHierarchy'),
    ('DoA2_HR_OrganizationHierarchy'),
    ('DoA3_HR_OrganizationHierarchy'),
    ('DoA4_HR_OrganizationHierarchy'),
    ('DoA1_Procurement_OrganizationHierarchy'),
    ('DoA2_Procurement_OrganizationHierarchy'),
    ('DoA3_Procurement_OrganizationHierarchy'),
    ('DoA4_Procurement_OrganizationHierarchy'),
    ('DoA1_HSSE_OrganizationHierarchy'),
    ('DoA2_HSSE_OrganizationHierarchy'),
    ('DoA3_HSSE_OrganizationHierarchy'),
    ('DoA4_HSSE_OrganizationHierarchy'),
    ('DoA1_EngagementAcceptance_OrganizationHierarchy'),
    ('DoA2_EngagementAcceptance_OrganizationHierarchy'),
    ('DoA3_EngagementAcceptance_OrganizationHierarchy'),
    ('DoA4_EngagementAcceptance_OrganizationHierarchy');

DELETE FROM public."EntityRoles" er
USING _doa_org_hierarchy_role_codes c
WHERE er."Code" = c.code;