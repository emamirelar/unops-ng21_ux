# Task List: EntityUserRoles — Operational Roles and DoA Types

**Generated from:** `entity-user-roles-operational-doa-prd.md`  
**Generated on:** 2026-03-10

---

## Relevant Files

### Backend Files (.NET Core)

**Domain:**
- `UNOPS.PAO.Domain/Entities/EntityUserRole.cs` - EXISTS - MODIFY (add PositionTitle, OrgUnitWorksAt, ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, DoAType)

**Database:**
- `UNOPS.PAO.UNOPSDataAccess/Context/UNOPSAppDbContext.cs` - EXISTS (EntityUserRole config if needed)
- `UNOPS.PAO.UNOPSDataAccess/Migrations/YYYYMMDD_AddEntityUserRoleOperationalDoAFields.cs` - NEW

**Seeders:**
- `UNOPS.PAO.UNOPSDataAccess/Seed/Seeders/EntityRoleSeeder.cs` - EXISTS - MODIFY (add Operational Roles, DoA-type-specific roles)

**EDS Sync:**
- `ExternalDataService/config/10-entity-user-roles-doa.yaml` - EXISTS - MODIFY (all DoA types, new columns)
- `ExternalDataService/config/11-entity-user-roles-mgmt.yaml` - EXISTS - MODIFY (Operational Roles, PositionTitle, OrgUnitWorksAt) or NEW config

**Models:**
- `UNOPS.PAO.Models/Offices/OfficeOperationalRoleModel.cs` - EXISTS or NEW (in manage-office)
- `UNOPS.PAO.Models/Offices/OfficeDoAHolderModel.cs` - EXISTS or NEW

**Services:**
- `UNOPS.PAO.UNOPSBusiness/Services/OfficeService.cs` - EXISTS - MODIFY (populate Operational Roles, DoA Holders with new fields and gap logic)

**Config/Registry:**
- `UNOPS.PAO.UNOPSBusiness/Config/DoATypeRegistry.cs` or similar - NEW (static list of DoA types for gap display)

**Workflow and Email (DoAType Filter — Engagement Acceptance Only):**
- `UNOPS.PAO.Business/Workflow/Adapters/PaoWorkflowApproverProvider.cs` - EXISTS - MODIFY (add DoAType filter)
- `UNOPS.PAO.Business/Workflow/Adapters/PaoWorkflowNotificationService.cs` - EXISTS - MODIFY (add DoAType filter)

**Backend - Unit/Integration Tests:**
- `QA Tests/Integration Tests/.../EntityUserRoleTests.cs` or extend OfficeControllerTests - NEW or MODIFY
- `QA Tests/Integration Tests/PNO-1197_DoA3Fallback/*` - EXISTS - MODIFY (update role codes)
- `QA Tests/Integration Tests/Controllers/WorkflowControllerTests.cs` - EXISTS - MODIFY (update role codes)

---

## ⚠️ CRITICAL Testing Requirements

- All new code must have unit tests
- Verify all tests compile and run successfully with no errors

---

## Tasks

- [ ] **1.0 Backend: EntityUserRole Schema Extension**
  > Add new columns to EntityUserRole for Operational Roles and DoA display.

  - [ ] 1.1 Add properties to `EntityUserRole.cs`:
    - PositionTitle (string?, max 255)
    - OrgUnitWorksAt (string?, max 255)
    - ApplicabilityPeriodStart (DateTime?, date only)
    - ApplicabilityPeriodEnd (DateTime?, date only)
    - Conditions (string?, text)
    - DoAType (string?, max 100)
  - [ ] 1.2 Create migration `AddEntityUserRoleOperationalDoAFields`
  - [ ] 1.3 Use defensive migration pattern (check column existence before add)
  - [ ] 1.4 Create unit tests for EntityUserRole with new properties
  - [ ] 1.5 Review implementation: verify schema matches FR-2

- [ ] **2.0 Backend: EntityRole Seeds — Operational Roles**
  > Add EntityRole seeds for new Operational Roles.

  - [ ] 2.1 Add to EntityRoleSeeder (OrganizationHierarchy roles):
    - Director_Manager_OiC_OrganizationHierarchy — Director Manager OiC
    - HSSE_Regional_Specialist_OrganizationHierarchy — HSSE Regional Specialist
    - HSSE_Regional_Specialist_OiC_OrganizationHierarchy — HSSE Regional Specialist OiC
    - HSSE_Coordinator_OrganizationHierarchy — HSSE Coordinator
    - Head_Of_Programme_OrganizationHierarchy — Head of Programme (HOP)
    - HoSS_OrganizationHierarchy — HoSS
  - [ ] 2.2 Confirm Director/Manager mapping (unified vs existing Regional/MCO/OrgUnit Director)
  - [ ] 2.3 Run EntityRoleSeeder; verify new roles in database
  - [ ] 2.4 Create unit tests for EntityRoleSeeder (new roles seeded)
  - [ ] 2.5 Review implementation: verify seeds match FR-1 (Operational Roles)

- [ ] **3.0 Backend: EntityRole Seeds — DoA Types**
  > Add EntityRole seeds for DoA-type-specific roles (Engagement Acceptance, Financial, HR, Procurement, HSSE × DoA1–4).

  - [ ] 3.1 Add DoA-type-specific EntityRoles to EntityRoleSeeder:
    - DoA1_EngagementAcceptance_OrganizationHierarchy through DoA4_EngagementAcceptance_OrganizationHierarchy
    - DoA1_Financial_OrganizationHierarchy through DoA4_Financial_OrganizationHierarchy
    - DoA1_HR_OrganizationHierarchy through DoA4_HR_OrganizationHierarchy
    - DoA1_Procurement_OrganizationHierarchy through DoA4_Procurement_OrganizationHierarchy
    - DoA1_HSSE_OrganizationHierarchy through DoA4_HSSE_OrganizationHierarchy
  - [ ] 3.2 Validate DoA levels per type with Delegation_Of_Authorities_Report (some types may have fewer levels)
  - [ ] 3.3 Run seeder; verify new roles in database
  - [ ] 3.4 Create unit tests for DoA EntityRole seeds
  - [ ] 3.5 Review implementation: verify seeds match FR-1 (DoA types)

- [ ] **4.0 Backend: DoA Type Registry**
  > Create registry of all DoA types for gap display (show all types even when no holder assigned).

  - [ ] 4.1 Create DoATypeRegistry (static config or service)
    - List: Engagement Acceptance, Financial, HR, Procurement, HSSE
    - Levels per type: DoA1, DoA2, DoA3, DoA4 (or validate per type)
  - [ ] 4.2 Add method GetDoATypeLevelMatrix() → List<(DoAType, Level)>
  - [ ] 4.3 Create unit tests for registry
  - [ ] 4.4 Review implementation: verify registry matches FR-5

- [ ] **5.0 Backend: EDS Sync — Operational Roles**
  > Update mgmt sync to include HSSE, HOP, HoSS, OiC and new columns.

  - [ ] 5.1 Identify Big Query source columns for HSSE, HOP, HoSS, OiC
    - Check Organisational_Structures schema; if missing, document alternative source
  - [ ] 5.2 Extend 11-entity-user-roles-mgmt.yaml query to include new role types
    - Add CTEs for HSSE_Regional_Specialist, HSSE_Coordinator, HOP, HoSS, OiC (from appropriate columns)
  - [ ] 5.3 Add field_mappings for PositionTitle, OrgUnitWorksAt
  - [ ] 5.4 Add EntityRoleCode mappings for new Operational Roles
  - [ ] 5.5 Update EntityUserRoles destination table structure (manage_table_structure: true) to add new columns
  - [ ] 5.6 Run sync; verify data populated
  - [ ] 5.7 Review implementation: verify sync matches FR-3

- [ ] **6.0 Backend: EDS Sync — DoA All Types**
  > Extend DoA sync to include all DoA types and new columns.

  - [ ] 6.1 Remove filter `Delegation_Of_Authority_Description = 'Engagement Acceptance'` from 10-entity-user-roles-doa.yaml
  - [ ] 6.2 Update EntityRoleCode in query: build from DoAType + Level (e.g., DoA1_Financial_OrganizationHierarchy)
    - Map Delegation_Of_Authority_Description to DoAType suffix (e.g., "Financial" → "Financial")
  - [ ] 6.3 Add field_mappings for DoAType, ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions
  - [ ] 6.4 Update foreign_key_mappings: EntityRoleCode lookup uses new DoA-type-specific codes
  - [ ] 6.5 Ensure EntityRole seeds for DoA types exist before sync
  - [ ] 6.6 Run sync; verify all DoA types populated
  - [ ] 6.7 Review implementation: verify sync matches FR-4

- [ ] **7.0 Backend: Office Service — Operational Roles and DoA**
  > Update OfficeService to return Operational Roles and DoA Holders with new fields and gap logic.

  - [ ] 7.1 Update GetOfficeDetailAsync (or GetOperationalRolesAsync) to query EntityUserRole
    - Filter: EntityType=OrganizationHierarchy, EntityId=Office.OrganizationHierarchyId, RoleSource=Mgmt
    - Include User, EntityRole
    - Map to OperationalRoleModel with RoleName, HolderName, PositionTitle, OrgUnitWorksAt, IsActive
  - [ ] 7.2 Ensure all 7 Operational Role types returned; add placeholder rows for unassigned
  - [ ] 7.3 Update GetOfficeDetailAsync (or GetDoAHoldersAsync) to query EntityUserRole
    - Filter: EntityType=OrganizationHierarchy, EntityId=Office.OrganizationHierarchyId, RoleSource=DoA
    - Include User, EntityRole
    - Map to DoAHolderModel with DoAType, DoALevel, RoleHolder, ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, IsActive
  - [ ] 7.4 Implement gap logic: for each (DoAType, Level) in DoATypeRegistry, return row
    - If EntityUserRole exists: populate holder and dates
    - If not: return row with RoleHolder=null, empty period/conditions
  - [ ] 7.5 Create unit tests for Operational Roles and DoA Holders retrieval
  - [ ] 7.6 Review implementation: verify API matches FR-6

- [ ] **8.0 Backend: Workflow and Email — DoAType Filter (Engagement Acceptance Only)**
  > Add DoAType filter to workflow and email logic. Keep EntityRole codes unchanged; filter EntityUserRole by DoAType = null or "Engagement Acceptance".

  - [ ] 8.1 Update `PaoWorkflowApproverProvider.cs`:
    - Add DoAType filter to GetDoA2HoldersForOrgUnitAsync: `(e.DoAType == null || e.DoAType == "Engagement Acceptance")`
    - Add DoAType filter to GetDoA3HoldersForOrgUnitAsync
    - Add DoAType filter to GetDoAHolderTasksForOpportunityAsync (DoA2 and DoA3 queries)
  - [ ] 8.2 Update `PaoWorkflowNotificationService.cs`:
    - GetApproverRoleShortForOpportunityAsync: add DoAType filter
    - GetRoleHolderEmailsForOrgUnitAsync: add DoAType filter when role is DoA2 or DoA3
  - [ ] 8.3 Ensure EDS sync populates EntityUserRole.DoAType for all DoA types
  - [ ] 8.4 Create unit tests verifying workflow excludes Financial/HR/Procurement/HSSE DoA holders
  - [ ] 8.5 Review implementation: verify matches FR-7

- [ ] **9.0 Integration & Verification**
  > End-to-end verification of Operational Roles, DoA, and workflow.

  - [ ] 9.1 Run migration; verify new columns exist
  - [ ] 9.2 Run EntityRoleSeeder; verify new roles (including DoA2/DoA3_EngagementAcceptance_OrganizationHierarchy)
  - [ ] 9.3 Run EDS syncs (mgmt, doa); verify data
  - [ ] 9.4 Call Office detail API; verify Operational Roles and DoA Holders returned
  - [ ] 9.5 Verify DoA gap rows (unassigned types) appear correctly
  - [ ] 9.6 Submit Opportunity for Go decision; verify approval request goes to Engagement Acceptance DoA holders only (or legacy with DoAType null)
  - [ ] 9.7 Verify Financial/HR/Procurement/HSSE DoA holders (DoAType populated) do NOT receive approval emails
  - [ ] 9.8 Document any source schema findings or open questions
  - [ ] 9.9 Review complete implementation against PRD

---

## Notes

- **Operational Roles** and **DoA Holders** are read-only; data synced from ERP via EDS
- **DoA gap display** requires returning rows for all (DoAType, Level) even when no EntityUserRole exists
- **CRITICAL — Workflow/Email:** Add DoAType filter: `(DoAType == null || DoAType == "Engagement Acceptance")` in PaoWorkflowApproverProvider and PaoWorkflowNotificationService. EntityRole codes stay as DoA2_Engagement_Acceptance, DoA3_Engagement_Acceptance.
- **Backward compatibility:** Legacy records with DoAType = null are included; EDS must populate DoAType for new Financial/HR/Procurement/HSSE records
- **Source validation:** Confirm Big Query schema for HSSE, HOP, HoSS, OiC before implementing mgmt sync extension
