# Manage Office — Remaining Tasks

**Last updated:** 2026-03-10  
**Purpose:** Track remaining backend and EDS work for Manage Office and EntityUserRoles (Operational Roles / DoA).

---

## People Search — "Org Unit Works At"

**Question:** Is "Org Unit Works At" in the EDS configs?

**Answer:** Yes. It is in **`02-userprofile.yaml`** (People Search sync):

| BQ Source | Field | UserProfile | Sync Frequency |
|-----------|-------|-------------|----------------|
| `unopsreporting.Employment.People_Search_Report` | `Org_Unit_Work_At` | `OrgUnit` | Once a day (with user-profiles) |

- **01-aspnetusers.yaml** — Syncs users from People_Search_Report (Id, Email, etc.). Does **not** include Org Unit Works At.
- **02-userprofile.yaml** — Syncs `Org_Unit_Work_At AS OrgUnit` to `UserProfile.OrgUnit`. This **is** the "Org Unit Works At" for personnel.

**Usage:** When displaying Operational Roles or DoA Holders, use `UserProfile.OrgUnit` for "Org Unit Works At" when joining User → UserProfile. EntityUserRole.OrgUnitWorksAt (from Mgmt sync) provides org-structure-derived value; UserProfile.OrgUnit is the People Search–sourced value per AC.

---

## Completed Work (Reference)

| Area | Status | Notes |
|------|--------|-------|
| EntityUserRole schema | Done | PositionTitle, OrgUnitWorksAt, ApplicabilityPeriodStart/End, Conditions, DoAType |
| 10-entity-user-roles-doa.yaml | Done | All DoA types, PositionTitle, DoAType, ApplicabilityPeriod* |
| 11-entity-user-roles-mgmt.yaml | Done | PositionTitle, OrgUnitWorksAt |
| EntityRoleSeeder (DoA types) | Done | HR, Finance, Procurement, Procurement ICA, Engagement Acceptance |
| UnassignedDoATypes API | Done | ValuesRepository.GetEntityUserRolesByOrgUnitsAsync |
| UserBasicModel / API models | Done | Position, OrgUnitWorksAt, ApplicabilityPeriod*, Conditions, DoAType |
| 13-offices.yaml | Exists | Financial fields currently CAST(NULL) |

---

## Remaining Tasks

### 1. EDS — Operational Roles (HSSE, HOP, HoSS, OiC)

**Source:** entity-user-roles-operational-doa Task 5.0

**BQ schema (Organisational_Structures):** Confirmed columns: `Region_HSSE_Coordinator_*`, `Hub_HSSE_Coordinator_*`, `Org_Unit_HSSE_Coordinator_*`. No columns for HSSE Regional Specialist, HSSE Regional Specialist OiC, Head of Programme, HoSS, Director Manager OiC in sample.

| Task | Description | Status |
|------|-------------|--------|
| 1.1 | Identify Big Query columns for HSSE, HOP, HoSS, OiC in Organisational_Structures | HSSE Coordinator columns found; others not in schema |
| 1.2 | Extend 11-entity-user-roles-mgmt.yaml with CTEs for HSSE_Coordinator (Region, Hub, OrgUnit) | **Done** (v1.2) |
| 1.3 | Add EntityRole seeds for HSSE_Coordinator_OrganizationHierarchy | Already in EntityRoleSeeder |
| 1.4 | Add EntityRoleCode validation in mgmt yaml for HSSE_Coordinator | **Done** |
| 1.5 | Run sync; verify HSSE Coordinator data populated | Pending |
| 1.6 | HOP, HoSS, OiC: Confirm BQ columns or derive from existing (e.g. Deputy with "Head of Programme" in Position_Description) | Pending |

---

### 2. EDS — Offices Financial Data

**Source:** manage-office Task 2.0, AC (Financial data by B-code). Manage Office PRD confirms BQ source.

**Yes — these fields belong in the Offices table.** The empty columns (CostCentreId, FinancialCentreType, Funding, NerTarget, NerTargetPeriod, EaTarget, EaTargetPeriod) should be populated from BQ.

| Task | Description | Status |
|------|-------------|--------|
| 2.1 | **BQ source confirmed:** `unopsreporting.Corporate_Performance.Corporate_Performance_Report` for NER Target, EA Target (Manage Office PRD). Sync once a day. | Source identified |
| 2.2 | Get Corporate_Performance_Report schema: join key (CostCentre/Org_Unit/B-code), NER_Target, EA_Target, fiscal period columns | Schema validation needed |
| 2.3 | Update 13-offices.yaml: LEFT JOIN Corporate_Performance_Report on Code (Org_Unit) to populate NerTarget, NerTargetPeriod, EaTarget, EaTargetPeriod | Depends on 2.2 |
| 2.4 | CostCentreId: Org_Unit = B-code (already in Organisational_Structures) — can use Org_Unit AS CostCentreId | Ready |
| 2.5 | FinancialCentreType, Funding: Manage Office PRD says IPMG mapping (PQMS supplement) — may need separate config or manual mapping | TBC |
| 2.6 | OrganizationHierarchyId population | Already in place |

---

### 3. EDS — Physical Office Locations (oUP)

**Source:** manage-office PRD Physical Office Details. **Design:** See `locations-sync-design.md`.

| Task | Description | Blocker |
|------|-------------|---------|
| 3.1 | Create new table `Locations` with FK `OfficeId` → `Offices.Id` | Migration (user generates) |
| 3.2 | Create EDS config `14-locations.yaml` | Depends on 3.1 |
| 3.3 | Source: `unopsreporting.Locations.Location` WHERE `Location_Type = 'ORGUNIT_OFFICE'` | — |
| 3.4 | Map: Code, Name, Alias, Description, Address, City, State, Country, PrimaryLatitude, PrimaryLongitude, CoordinatesJson (jsonb) | — |
| 3.5 | **Coordinates:** Store full array as JSONB + primary lat/long from first coordinate (one job, one row per Location) | Design done |

---

### 4. EDS — Country Mapping Extension

**Source:** AC (Country mapping)

| Task | Description | Blocker |
|------|-------------|---------|
| 4.1 | Extend 04-countries.yaml to include Responsible Office (B-code), Status (Active/Unassigned) | Verify BQ Partners.Country has these columns |
| 4.2 | Add field_mappings for new columns | — |

---

### 5. EDS — Last Synced Timestamp

**Source:** AC (Last synced timestamp stored and displayed)

| Task | Description | Blocker |
|------|-------------|---------|
| 5.1 | Add sync metadata storage (e.g., SyncExecutionLog or similar) if not present in EDS | EDS architecture review |
| 5.2 | Expose last sync timestamp per sync type (offices, DoA, mgmt, countries, etc.) | — |
| 5.3 | Add API endpoint for frontend to retrieve last sync timestamps | — |

---

### 6. Backend — Office Entity & API (from manage-office-backend-tasks)

| Task | Description | Status |
|------|-------------|--------|
| 6.1 | Office domain entity, migration, EDS (13-offices) | 13-offices exists; financial fields pending |
| 6.2 | OfficeManager, OfficeService, OfficeController | Pending |
| 6.3 | Related Opportunities API (org unit + descendants) | Pending |
| 6.4 | Related Partner Accounts API (org unit + descendants) | Pending |
| 6.5 | Office permissions (canEditWorkflowConfiguration) | Pending |
| 6.6 | Document integration (Strategy type) | Pending |

---

### 7. Backend — API: Use UserProfile.OrgUnit for "Org Unit Works At"

| Task | Description | Status |
|------|-------------|--------|
| 7.1 | Ensure GetEntityUserRolesByOrgUnitsAsync (or Office detail) returns OrgUnitWorksAt | — |
| 7.2 | When displaying personnel, prefer UserProfile.OrgUnit (People Search) over EntityUserRole.OrgUnitWorksAt when both available, per AC | Design decision |
| 7.3 | Document: EntityUserRole.OrgUnitWorksAt = org-structure-derived; UserProfile.OrgUnit = People Search (daily) | — |

---

## EDS Config Reference

| Config | Source | Key Fields | Status |
|--------|--------|------------|--------|
| 01-aspnetusers | People_Search_Report | Id, Email, UserName | No Org Unit Works At |
| 02-userprofile | People_Search_Report | Name, Position, **OrgUnit** (Org_Unit_Work_At) | **Org Unit Works At here** |
| 10-entity-user-roles-doa | Delegation_Of_Authorities_Report | DoA types, PositionTitle, DoAType, ApplicabilityPeriod* | Done |
| 11-entity-user-roles-mgmt | Organisational_Structures | Directors, Deputies, HSSE Coordinators, PositionTitle, OrgUnitWorksAt | Done; HOP/HoSS/OiC pending (no BQ columns) |
| 13-offices | Organisational_Structures + Corporate_Performance_Report | Code, Name; CostCentreId=Org_Unit; NerTarget/EaTarget from Corporate_Performance (pending) | Financial fields pending JOIN |
| 04-countries | Partners.Country | ISO, Name, Region | Responsible Office, Status pending |

---

## Execution Plan Order

1. **No blocker:** Verify API uses UserProfile.OrgUnit for "Org Unit Works At" display (Task 7).
2. **Schema validation:** Confirm Organisational_Structures has HSSE/HOP/HoSS/OiC columns (Task 1.1).
3. **Schema validation:** Confirm BQ source for Office financial data by B-code (Task 2.1).
4. **Implementation:** Extend mgmt sync with new Operational Roles (Task 1).
5. **Implementation:** Populate Office financial fields (Task 2).
6. **Future:** oUP Locations, Country mapping, Last sync timestamp (Tasks 3, 4, 5).
