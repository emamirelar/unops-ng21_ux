# Product Requirements Document: EntityUserRoles — Operational Roles and DoA Types

## Initial Requirement

Extend EntityUserRoles to incorporate new **Operational Roles** (Director/Manager, Director Manager OiC, HSSE Regional Specialist, HSSE Regional Specialist OiC, HSSE Coordinator, Head of Programme, HoSS) and new **Delegation of Authority (DoA) types** (Engagement Acceptance, Financial, HR, Procurement, HSSE). Both sections are read-only and sourced from ERP. The system must display all Operational Role types and all DoA types—including rows with no holder assigned—so gaps are immediately visible. Backend changes include EntityRole seeds, EntityUserRole schema extensions, and EDS sync configuration updates.

---

## Executive Summary

### Business Context

The Office entity UI (Roles & DoA tab) requires two data sections:

1. **Operational Roles** — Personnel holding roles such as Director/Manager, OiC, HSSE Regional Specialist, HSSE Coordinator, Head of Programme (HOP), and Head of Support Services (HoSS). Source: ERP>Admin - Management Structure.
2. **Delegation of Authority Holders** — Personnel holding DoA by type (Engagement Acceptance, Financial, HR, Procurement, HSSE) and level (DoA1, DoA2, etc.). Source: ERP>Core Controls.

Currently, EntityUserRoles syncs only:
- **Management roles** (Regional Director, Deputy, MCO Director, OrgUnit Director, etc.) from Organisational_Structures
- **DoA** for Engagement Acceptance only from Delegation_Of_Authorities_Report

The backend must be extended to support the full set of Operational Roles and DoA types, with additional display fields (Position Title, Org Unit Works At, Applicability Period, Conditions) and a registry of all DoA types for gap visibility.

### Goal

1. Add new EntityRole seeds for Operational Roles and DoA types
2. Extend EntityUserRole with PositionTitle, OrgUnitWorksAt, ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, DoAType
3. Update/extend EDS sync configs for Operational Roles and all DoA types
4. Provide API support for Office detail to return Operational Roles and DoA Holders in the required table format, including empty rows for unassigned DoA types
5. **Update workflow and email logic** to use **Engagement Acceptance** DoA type only — Opportunity approval workflow, Go decision emails, and related notifications must not use Financial, HR, Procurement, or HSSE DoA holders

---

## PRD

### 1. Introduction/Overview

The Office Roles & DoA tab displays two tables:

**Operational Roles Table:**
| ROLE | PERSONNEL | POSITION TITLE | ORG UNIT WORKS AT | STATUS |
|------|-----------|----------------|-------------------|--------|
| Director/Manager | Ms. Fatima Ndiaye | Regional Director | Africa, AFRRO (RMO) | Active |
| Director Manager OiC | Mr. James Chambes | Deputy Regional Director | Africa, AFRRO (RMO) | Active |
| HSSE Regional Specialist | Dr. Belma Halvors | HSSE Regional Specialist | AFRRO (RMO) | Active |
| HSSE Regional Specialist OiC | — | — | — | Not assigned |
| HSSE Coordinator | Mr. Jonathan Mwalog | HSSE Coordinator | AFRRO (RMO) | Active |
| Head of Programme (HOP) | Ms. Grace Aboyo | Head of Programme | AFRRO (RMO) | Active |
| HoSS | Mr. Patrick Odongo | Head of Support Services | AFRRO (RMO) | Active |

**DoA Holders Table:**
| DoA TYPE | LEVEL | ROLE HOLDER | APPLICABILITY PERIOD | CONDITIONS | STATUS |
|----------|-------|-------------|----------------------|-------------|--------|
| Engagement Acceptance | DoA1 | Ms. Fatima Ndiaye | Jan 1, 2020 – Dec 31, 2026 | Up to $7.5M engagement value | Active |
| Engagement Acceptance | DoA2 | Mr. Jorge Cardenas | Jan 1, 2020 – Dec 31, 2026 | Above $7.5M or High-risk | Active |
| Financial | DoA2 | Ms. Fatima Ndiaye | Jan 1, 2020 – Dec 31, 2026 | Regional financial authority | Active |
| HR | DoA1 | Ms. Fatima Ndiaye | Jan 1, 2020 – Dec 31, 2026 | — | Active |
| Procurement | DoA2 & OiC | Mr. James Chambes | Feb 1, 2020 – Mar 31, 2026 | Temporary OIC assignment | Active |
| HSSE | — | Not assigned | — | — | — |

**Key requirement:** All DoA types must be shown even when no holder is assigned, so gaps are visible.

**Problem Statement:** Current EntityUserRole lacks Position Title, Org Unit Works At, Applicability Period, Conditions, and DoA Type. EntityRole seeds lack Operational Roles (HSSE, HOP, HoSS, OiC) and DoA-type-specific roles (Financial, HR, Procurement, HSSE). DoA sync only covers Engagement Acceptance.

**Solution:** Extend EntityUserRole schema, add EntityRole seeds, update EDS sync configs, and introduce a DoA type registry for gap display.

---

### 2. Clarifying Questions and Responses

**Q1: ERP Source for Operational Roles**
- Operational Roles: ERP>Admin - Management Structure
- Likely Big Query source: `unopsreporting.Organisation.Organisational_Structures` or related table with HSSE, HOP, HoSS, OiC columns
- If columns not in Organisational_Structures, a separate ERP/Big Query source must be identified (TBC)

**Q2: ERP Source for DoA**
- DoA: ERP>Core Controls
- Big Query: `unopsreporting.Common.Delegation_Of_Authorities_Report`
- Field `Delegation_Of_Authority_Description` contains DoA type (Engagement Acceptance, Financial, HR, Procurement, HSSE)
- Current sync filters `Delegation_Of_Authority_Description = 'Engagement Acceptance'`; remove filter to include all types

**Q3: DoA Type Registry**
- To show "all DoA types even when no holder assigned": maintain a registry (config or table) of all DoA types
- API returns: for each (DoAType, Level) combination, either the EntityUserRole record or an empty placeholder
- Registry: DoAType enum or DoATypeConfig table with (DoAType, DisplayOrder)

**Q4: EntityRole Strategy for DoA**
- Option A: One EntityRole per (DoAType, Level) — e.g., DoA1_EngagementAcceptance_OrganizationHierarchy, DoA2_Financial_OrganizationHierarchy (20 roles)
- Option B: EntityUserRole.DoAType column + existing DoA1–DoA4 EntityRoles
- **Recommended:** Option A for cleaner sync and role lookup; EntityRole.Code = `DoA{Level}_{DoAType}_OrganizationHierarchy`

**Q5: Position Title, Org Unit Works At**
- Mgmt sync has PositionDescription in query but not in EntityUserRoles table
- Add PositionTitle (or PositionDescription), OrgUnitWorksAt to EntityUserRole
- EDS field mappings must include these

---

### 3. Goals

1. **EntityRole seeds** — Add Operational Roles (Director/Manager, OiC, HSSE, HOP, HoSS) and DoA-type-specific roles (Engagement Acceptance, Financial, HR, Procurement, HSSE × DoA1–4)
2. **EntityUserRole schema** — Add PositionTitle, OrgUnitWorksAt, ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, DoAType
3. **EDS sync: Operational Roles** — Extend or add sync for HSSE, HOP, HoSS, OiC from ERP
4. **EDS sync: DoA** — Extend DoA sync to all Delegation_Of_Authority_Description values (remove Engagement Acceptance filter)
5. **DoA type registry** — Config or table listing all DoA types for gap display
6. **API** — Office detail returns Operational Roles and DoA Holders in table format; DoA includes empty rows for unassigned types
7. **Workflow and email logic** — Add DoAType filter to workflow and email queries: use only `EntityUserRole` records where `DoAType == null` or `DoAType == "Engagement Acceptance"` (keeps existing EntityRole codes)

---

### 4. Architecture

#### 4.1 EntityRole Additions

**Operational Roles (EntityType = OrganizationHierarchy):**
| Code | Name |
|------|------|
| Director_Manager_OrganizationHierarchy | Director/Manager |
| Director_Manager_OiC_OrganizationHierarchy | Director Manager OiC |
| HSSE_Regional_Specialist_OrganizationHierarchy | HSSE Regional Specialist |
| HSSE_Regional_Specialist_OiC_OrganizationHierarchy | HSSE Regional Specialist OiC |
| HSSE_Coordinator_OrganizationHierarchy | HSSE Coordinator |
| Head_Of_Programme_OrganizationHierarchy | Head of Programme (HOP) |
| HoSS_OrganizationHierarchy | HoSS |

**Note:** Director/Manager may map to existing Regional_Director, MCO_Director, OrgUnit_Director depending on hierarchy level. Confirm with product whether "Director/Manager" is a unified display or separate roles.

**DoA Roles (EntityType = OrganizationHierarchy):**
| Code | Name | DoAType | Level |
|------|------|---------|-------|
| DoA1_EngagementAcceptance_OrganizationHierarchy | DoA1 - Engagement Acceptance | Engagement Acceptance | DoA1 |
| DoA2_EngagementAcceptance_OrganizationHierarchy | DoA2 - Engagement Acceptance | Engagement Acceptance | DoA2 |
| ... | ... | ... | ... |
| DoA1_Financial_OrganizationHierarchy | DoA1 - Financial | Financial | DoA1 |
| DoA2_Financial_OrganizationHierarchy | DoA2 - Financial | Financial | DoA2 |
| ... | ... | ... | ... |
| DoA1_HR_OrganizationHierarchy | DoA1 - HR | HR | DoA1 |
| ... | ... | ... | ... |
| DoA1_Procurement_OrganizationHierarchy | DoA1 - Procurement | Procurement | DoA1 |
| ... | ... | ... | ... |
| DoA1_HSSE_OrganizationHierarchy | DoA1 - HSSE | HSSE | DoA1 |
| ... | ... | ... | ... |

(5 DoA types × 4 levels = 20 EntityRoles; some types may have fewer levels—validate with source.)

#### 4.2 EntityUserRole Schema Extensions

| Column | Type | Description |
|--------|------|-------------|
| PositionTitle | varchar(255) | Standardized position title |
| OrgUnitWorksAt | varchar(255) | Org unit where personnel works (e.g., "Africa, AFRRO (RMO)") |
| ApplicabilityPeriodStart | date | DoA start date |
| ApplicabilityPeriodEnd | date | DoA end date |
| Conditions | text | DoA conditions/description |
| DoAType | varchar(100) | DoA type (Engagement Acceptance, Financial, HR, Procurement, HSSE) — denormalized for display; can derive from EntityRole |

#### 4.3 DoA Type Registry

- **Option A:** Static config (JSON/appsettings) listing DoA types and levels
- **Option B:** DoATypeConfig table (Id, DoAType, DisplayName, DisplayOrder)
- **Option C:** Derive from EntityRole where Code contains DoA type
- **Recommended:** Option A or C for minimal schema change; Option B if DoA types are dynamic

#### 4.4 Data Flow

```
ERP (Big Query)
├── Organisational_Structures (or Mgmt source)
│   └── Operational Roles sync → EntityUserRoles (RoleSource=Mgmt)
│       + PositionTitle, OrgUnitWorksAt
└── Delegation_Of_Authorities_Report
    └── DoA sync (all types) → EntityUserRoles (RoleSource=DoA)
        + ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, DoAType

Office Detail API
├── Operational Roles: Query EntityUserRole where EntityType=OrganizationHierarchy, RoleSource=Mgmt
│   Join User, EntityRole; filter by Office.OrganizationHierarchyId
├── DoA Holders: Query EntityUserRole where RoleSource=DoA
│   Join User, EntityRole; filter by Office.OrganizationHierarchyId
└── DoA Gaps: For each (DoAType, Level) in registry, left join EntityUserRole
    → Return row with holder or empty
```

---

### 5. User Stories (Backend-Focused)

#### US-1: Operational Roles Display
**As a** user viewing an Office  
**I want to** see all Operational Roles with Personnel, Position Title, Org Unit Works At, Status  
**So that** I know who holds each role

**Acceptance Criteria:**
- API returns Operational Roles with Role, Personnel (name), PositionTitle, OrgUnitWorksAt, Status
- All 7 role types shown (Director/Manager, OiC, HSSE Regional Specialist, HSSE Regional Specialist OiC, HSSE Coordinator, HOP, HoSS)
- Rows with no holder show "Not assigned" or empty
- Data sourced from EntityUserRole (synced from ERP)

#### US-2: DoA Holders Display
**As a** user viewing an Office  
**I want to** see all DoA types with Level, Role Holder, Applicability Period, Conditions, Status  
**So that** I know who holds each DoA and can spot gaps

**Acceptance Criteria:**
- API returns DoA Holders with DoAType, Level, RoleHolder, ApplicabilityPeriod, Conditions, Status
- All DoA types shown: Engagement Acceptance, Financial, HR, Procurement, HSSE
- All levels shown (DoA1, DoA2, etc.) per type
- Rows with no holder shown with empty holder—gaps visible
- Data sourced from EntityUserRole (synced from ERP)

#### US-3: EDS Syncs Operational Roles
**As a** system administrator  
**I want** Operational Roles (including HSSE, HOP, HoSS, OiC) synced from ERP  
**So that** Office Roles & DoA tab shows current data

**Acceptance Criteria:**
- EDS sync populates EntityUserRole with RoleSource=Mgmt for all Operational Role types
- PositionTitle, OrgUnitWorksAt populated when available from source
- Sync runs on schedule

#### US-4: EDS Syncs All DoA Types
**As a** system administrator  
**I want** all DoA types (Engagement Acceptance, Financial, HR, Procurement, HSSE) synced from ERP  
**So that** Office DoA tab shows full DoA matrix

**Acceptance Criteria:**
- EDS sync populates EntityUserRole with RoleSource=DoA for all Delegation_Of_Authority_Description values
- ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, DoAType populated
- Sync runs on schedule

#### US-5: Workflow and Emails Use Engagement Acceptance DoA Only
**As a** user submitting an Opportunity for Go decision  
**I want** approval requests and emails sent only to **Engagement Acceptance** DoA holders  
**So that** Financial, HR, Procurement, and HSSE DoA holders do not receive irrelevant approval requests

**Acceptance Criteria:**
- PaoWorkflowApproverProvider and PaoWorkflowNotificationService filter EntityUserRole by `DoAType == null || DoAType == "Engagement Acceptance"`
- EntityRole codes remain DoA2_Engagement_Acceptance, DoA3_Engagement_Acceptance (no change)
- No Financial, HR, Procurement, or HSSE DoA holders receive workflow approval emails

---

### 6. Functional Requirements

#### FR-1: EntityRole Seeds

| Req | Description |
|-----|-------------|
| FR-1.1 | Add Operational Role seeds: Director_Manager_OiC, HSSE_Regional_Specialist, HSSE_Regional_Specialist_OiC, HSSE_Coordinator, Head_Of_Programme, HoSS |
| FR-1.2 | Director/Manager: Confirm if unified or maps to existing Regional/MCO/OrgUnit Director |
| FR-1.3 | Add DoA-type-specific EntityRoles: DoA{1-4}_{EngagementAcceptance|Financial|HR|Procurement|HSSE}_OrganizationHierarchy |
| FR-1.4 | Update EntityRoleSeeder; run seeder as part of deployment |
| FR-1.5 | Preserve existing DoA1–DoA4_Engagement_Acceptance for backward compatibility during transition; deprecate once new roles in use |

#### FR-2: EntityUserRole Schema

| Req | Description |
|-----|-------------|
| FR-2.1 | Add PositionTitle (varchar 255, nullable) |
| FR-2.2 | Add OrgUnitWorksAt (varchar 255, nullable) |
| FR-2.3 | Add ApplicabilityPeriodStart (date, nullable) |
| FR-2.4 | Add ApplicabilityPeriodEnd (date, nullable) |
| FR-2.5 | Add Conditions (text, nullable) |
| FR-2.6 | Add DoAType (varchar 100, nullable) |
| FR-2.7 | Create migration AddEntityUserRoleOperationalDoAFields |
| FR-2.8 | Defensive migration pattern |

#### FR-3: EDS Sync — Operational Roles

| Req | Description |
|-----|-------------|
| FR-3.1 | Identify Big Query source for HSSE, HOP, HoSS, OiC (Organisational_Structures or other) |
| FR-3.2 | Extend 11-entity-user-roles-mgmt.yaml or create new config to include HSSE, HOP, HoSS, OiC roles |
| FR-3.3 | Map PositionDescription → PositionTitle, OrgUnit/Region → OrgUnitWorksAt |
| FR-3.4 | Add field_mappings for PositionTitle, OrgUnitWorksAt to EntityUserRoles destination |
| FR-3.5 | EntityRoleCode mapping for new roles |

#### FR-4: EDS Sync — DoA All Types

| Req | Description |
|-----|-------------|
| FR-4.1 | Remove filter `Delegation_Of_Authority_Description = 'Engagement Acceptance'` from 10-entity-user-roles-doa.yaml |
| FR-4.2 | Map Delegation_Of_Authority_Description → DoAType |
| FR-4.3 | Map Delegation_Of_Authority_Start_Date → ApplicabilityPeriodStart, Delegation_Of_Authority_End_Date → ApplicabilityPeriodEnd |
| FR-4.4 | Map Delegation_Of_Authority_Description (or conditions field) → Conditions |
| FR-4.5 | EntityRoleCode: Build from DoAType + Level, e.g., DoA1_Financial_OrganizationHierarchy |
| FR-4.6 | Add field_mappings for new columns |
| FR-4.7 | Create new EntityRoles for each (DoAType, Level) before sync; ensure lookup succeeds |

#### FR-5: DoA Type Registry

| Req | Description |
|-----|-------------|
| FR-5.1 | Define registry of all DoA types: Engagement Acceptance, Financial, HR, Procurement, HSSE |
| FR-5.2 | Define levels per type (DoA1, DoA2, DoA3, DoA4 — validate with source) |
| FR-5.3 | Implementation: Static list in code, or DoATypeConfig table, or derive from EntityRole |
| FR-5.4 | API uses registry to return rows for all (DoAType, Level); left join EntityUserRole for holder |

#### FR-6: API — Office Operational Roles and DoA

| Req | Description |
|-----|-------------|
| FR-6.1 | Office detail (or dedicated endpoint) returns OperationalRoles array |
| FR-6.2 | Each Operational Role: RoleName, HolderName, PositionTitle, OrgUnitWorksAt, IsActive |
| FR-6.3 | All 7 Operational Role types included; HolderName null/empty if not assigned |
| FR-6.4 | Office detail returns DoAHolders array |
| FR-6.5 | Each DoA Holder: DoAType, DoALevel, RoleHolder, ApplicabilityPeriodStart, ApplicabilityPeriodEnd, Conditions, IsActive |
| FR-6.6 | All (DoAType, Level) combinations from registry included; RoleHolder null/empty if not assigned |
| FR-6.7 | Filter by Office.OrganizationHierarchyId (EntityId in EntityUserRole) |

#### FR-7: Workflow and Email — Engagement Acceptance DoA Only (DoAType Filter)

**CRITICAL:** When all DoA types (Engagement Acceptance, Financial, HR, Procurement, HSSE) are synced into EntityUserRole, the Opportunity workflow and email notifications must use **only Engagement Acceptance** DoA holders. Financial, HR, Procurement, and HSSE DoA holders must not receive approval requests or be used for Go decision logic.

**Approach:** Keep existing EntityRole codes (`DoA2_Engagement_Acceptance`, `DoA3_Engagement_Acceptance`) to avoid impacting existing data. Add an additional filter on `EntityUserRole.DoAType`: include only records where `DoAType == null` (legacy) or `DoAType == "Engagement Acceptance"`. EDS sync must populate `DoAType` for all DoA types.

| Req | Description |
|-----|-------------|
| FR-7.1 | **PaoWorkflowApproverProvider:** Add DoAType filter to all DoA holder queries: `(e.DoAType == null \|\| e.DoAType == "Engagement Acceptance")` |
| FR-7.2 | **PaoWorkflowNotificationService:** Add DoAType filter to `GetApproverRoleShortForOpportunityAsync` |
| FR-7.3 | **PaoWorkflowNotificationService:** Add DoAType filter in `GetRoleHolderEmailsForOrgUnitAsync` when role is DoA2 or DoA3 |
| FR-7.4 | **EDS sync:** Populate `EntityUserRole.DoAType` from `Delegation_Of_Authority_Description` for all DoA types |
| FR-7.5 | **EntityRole codes:** No change — keep `DoA2_Engagement_Acceptance`, `DoA3_Engagement_Acceptance` |

**Affected Components:**
- `UNOPS.PAO.Business/Workflow/Adapters/PaoWorkflowApproverProvider.cs`
- `UNOPS.PAO.Business/Workflow/Adapters/PaoWorkflowNotificationService.cs`

---

### 7. Non-Goals

- Frontend implementation (separate PRD)
- Editing Operational Roles or DoA in Opportunity+ (read-only from ERP)
- Workflow Configuration entity/table changes (Phase 2)
- **Note:** Workflow and email logic updates (FR-7) to use Engagement Acceptance DoA only **are in scope** — required when multiple DoA types exist

---

### 8. Technical Considerations

#### 8.1 Backward Compatibility

- Existing DoA sync uses DoA1_Engagement_Acceptance, DoA2_Engagement_Acceptance, etc.
- New DoA sync adds all DoA types (Engagement Acceptance, Financial, HR, Procurement, HSSE) with `EntityUserRole.DoAType` populated
- **Workflow/email filter:** Add `(DoAType == null || DoAType == "Engagement Acceptance")` to all DoA holder queries. EntityRole codes stay unchanged (`DoA2_Engagement_Acceptance`, `DoA3_Engagement_Acceptance`). Legacy records with `DoAType == null` remain included.

#### 8.2 Big Query Source Validation

- Confirm Organisational_Structures has HSSE, HOP, HoSS, OiC columns
- Confirm Delegation_Of_Authorities_Report has all DoA types in Delegation_Of_Authority_Description
- Document actual column names for implementation

#### 8.3 OiC Handling

- "Director Manager OiC" and "Procurement DoA2 & OiC" indicate temporary/OiC assignments
- May need IsOic or OicIndicator flag on EntityUserRole if source distinguishes
- Defer to implementation if source supports it

---

### 9. Data Models

#### OperationalRoleModel (API)

```csharp
public class OperationalRoleModel
{
    public string RoleName { get; set; }       // Director/Manager, HSSE Coordinator, etc.
    public string? HolderName { get; set; }
    public string? PositionTitle { get; set; }
    public string? OrgUnitWorksAt { get; set; }
    public bool IsActive { get; set; }
}
```

#### DoAHolderModel (API)

```csharp
public class DoAHolderModel
{
    public string DoAType { get; set; }        // Engagement Acceptance, Financial, etc.
    public string? DoALevel { get; set; }      // DoA1, DoA2
    public string? RoleHolder { get; set; }
    public DateTime? ApplicabilityPeriodStart { get; set; }
    public DateTime? ApplicabilityPeriodEnd { get; set; }
    public string? Conditions { get; set; }
    public bool IsActive { get; set; }
}
```

---

### 10. Open Questions

1. Exact Big Query columns for HSSE, HOP, HoSS, OiC in Organisational_Structures
2. Whether "Director/Manager" is a new unified role or maps to existing Director roles
3. DoA levels per type (all types have DoA1–4?)
4. OiC flag: separate field or inferred from role name
5. **EDS DoAType population:** Ensure EDS sync populates EntityUserRole.DoAType for all DoA types; legacy records with null remain included in workflow

---

## Appendix A: Operational Role Types

| Role | EntityRole Code |
|------|-----------------|
| Director/Manager | Director_Manager_OrganizationHierarchy (or existing Regional/MCO/OrgUnit Director) |
| Director Manager OiC | Director_Manager_OiC_OrganizationHierarchy |
| HSSE Regional Specialist | HSSE_Regional_Specialist_OrganizationHierarchy |
| HSSE Regional Specialist OiC | HSSE_Regional_Specialist_OiC_OrganizationHierarchy |
| HSSE Coordinator | HSSE_Coordinator_OrganizationHierarchy |
| Head of Programme (HOP) | Head_Of_Programme_OrganizationHierarchy |
| HoSS | HoSS_OrganizationHierarchy |

---

## Appendix B: DoA Types and Levels

| DoA Type | Levels |
|----------|--------|
| Engagement Acceptance | DoA1, DoA2, DoA3, DoA4 |
| Financial | DoA1, DoA2, ... |
| HR | DoA1, DoA2, ... |
| Procurement | DoA1, DoA2, ... |
| HSSE | DoA1, DoA2, ... |

(Validate with Delegation_Of_Authorities_Report.)
