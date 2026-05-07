# Product Requirements Document: Office Entity — Backend Implementation

## Initial Requirement

Implement the backend for the **Office** entity — a new entity in Opportunity+ that represents UNOPS P3M organizational units. Office data is synced from the External Data Service (EDS) using the same Big Query source as OrganizationHierarchy (`unopsreporting.Organisation.Organisational_Structures`). An Office is **related to** OrganizationHierarchy via the **Code** field (Office.Code = OrganizationHierarchy.Code). The Office entity provides a comprehensive view with Key Information, Financial, Scope, Operational Roles, DoA Holders, Physical Office Details, and Workflow Configuration. Most sections are read-only; Workflow Configuration is editable by Regional Director and OiC only.

---

## Executive Summary

### Business Context

The UNOPS P3M organizational structure requires a dedicated **Office** entity in Opportunity+. Office is a **new entity** (separate from OrganizationHierarchy) with its own table and sync pipeline. Data is sourced from the same Big Query dataset as OrganizationHierarchy. The relationship between Office and OrganizationHierarchy is established via the **Code** field: each Office record links to the corresponding OrganizationHierarchy record where `Office.Code = OrganizationHierarchy.Code`. This allows Office to carry additional P3M-specific fields while leveraging the existing OrganizationHierarchy structure for hierarchy, relationships, and integrations (Opportunities, Partners, Countries).

### Goal

Deliver backend implementation for the Office entity: domain entity, EDS sync configuration, database migration, manager/service layer, API controller, and integration with related entities. Office is the primary entity for the Office management UI; OrganizationHierarchy remains the structure used for Opportunity.ResponsibleOrgUnitId and Partner OrganizationUnitRelationships — resolved via the Code-based link.

---

## PRD

### 1. Introduction/Overview

**Office** is a new entity in Opportunity+ with the following characteristics:

1. **New Domain Entity** — `Office` class with its own table `Offices`
2. **EDS Sync** — Data synced from Big Query `unopsreporting.Organisation.Organisational_Structures` (same source as OrganizationHierarchy)
3. **Relationship to OrganizationHierarchy** — Via `Code` field: `Office.Code = OrganizationHierarchy.Code`; `Office.OrganizationHierarchyId` (FK) links to the matching OrganizationHierarchy record
4. **Richer Data Model** — Office carries Key Information, Financial, Scope, and other P3M-specific fields; Operational Roles and DoA Holders are resolved from EntityUserRole using the linked OrganizationHierarchy
5. **Related Entities** — Opportunities (via ResponsibleOrgUnitId → OrganizationHierarchy) and Partners (via OrganizationUnitRelationship) are resolved through the Office's linked OrganizationHierarchy and its hierarchy (office + descendants)

**Problem Statement:** OrganizationHierarchy exists for structural/hierarchy purposes but lacks the rich Office view and P3M-specific fields. A separate Office entity is required to support the Office management UI and future master-data ownership.

**Solution:** Create Office entity, EDS sync config, migration, OfficeManager, OfficeService, OfficeController. Office links to OrganizationHierarchy via Code; related entity queries use the linked OrganizationHierarchy and its descendant tree.

---

### 2. Clarifying Questions and Responses

**Q1: Office vs OrganizationHierarchy**
- **Office** = New entity, own table, synced from EDS
- **OrganizationHierarchy** = Existing entity, used for hierarchy structure and existing integrations (Opportunity.ResponsibleOrgUnitId, Partner.OrganizationUnitRelationships)
- **Relationship:** Office.Code = OrganizationHierarchy.Code; Office.OrganizationHierarchyId (FK) references OrganizationHierarchy.Id

**Q2: EDS Sync**
- Same source: `unopsreporting.Organisation.Organisational_Structures`
- New EDS config: `13-offices.yaml` (or equivalent)
- Office sync runs independently; after sync, OrganizationHierarchyId is set by matching Code
- Office may have different grain (e.g., one Office per Org_Unit) — align with OrganizationHierarchy.Org_Unit level

**Q3: Related Entities**
- **Opportunities:** Where ResponsibleOrgUnitId = Office.OrganizationHierarchyId OR any descendant of that OrganizationHierarchy
- **Partners:** Where Partner has OrganizationUnitRelationship with Office.OrganizationHierarchyId or descendants
- **Countries:** OrganizationUnitRelationship where EntityType = "Country" for Office.OrganizationHierarchyId

**Q4: Workflow Configuration**
- Editable by Regional Director and OiC only
- May require new fields/table; defer detailed design to Phase 2
- Backend supports permission check: canEditWorkflowConfiguration

**Q5: Document Types**
- Strategy only initially
- EntityArtifact with EntityType = "Office", EntityId = Office.Id

---

### 3. Goals

1. **Office Domain Entity** — New `Office` class, `Offices` table, EF configuration
2. **EDS Sync Configuration** — New sync config for Offices from same Big Query source
3. **Office–OrganizationHierarchy Link** — Office.OrganizationHierarchyId FK; populated by Code match during/after sync
4. **Office Manager & Service** — CRUD (read-only for sync), list, search, tree, detail, related entities, permissions
5. **Office Controller** — REST API for list, search, tree, detail, permissions, related opportunities, related partners
6. **Document Support** — EntityArtifact for Office (Strategy type)

---

### 4. Architecture

#### 4.1 Entity Relationship

```
┌─────────────────────────┐         Code          ┌──────────────────────────────┐
│       Office            │ ────────────────────▶ │   OrganizationHierarchy     │
│ (NEW entity)            │   Office.Code =       │   (existing)                │
│                         │   OrgHierarchy.Code   │                             │
│ Id (PK)                 │                       │ Id (PK)                      │
│ Code (unique)           │◀──────────────────── │ Code (unique)               │
│ OrganizationHierarchyId │   FK                  │ Name, Type, ParentId, ...   │
│ InternalName            │                       │                             │
│ Alias, ExternalName      │                       │ Used by:                    │
│ OrganisationalEntityType│                       │ - Opportunity.ResponsibleOrgUnitId
│ HierarchyLevel          │                       │ - OrganizationUnitRelationship
│ EffectiveDate           │                       │ - EntityUserRole (EntityType=OrgHierarchy)
│ CostCentreId            │                       │                             │
│ ... (Financial, etc.)   │                       │                             │
└─────────────────────────┘                       └──────────────────────────────┘
```

#### 4.2 Data Flow

```
Big Query (Organisational_Structures)
         │
         ├──────────────────────────────┬──────────────────────────────┐
         ▼                              ▼                              ▼
  EDS: organization-hierarchies    EDS: offices (NEW)           (Future: Corporate_Performance,
         │                              │                        oUP Locations)
         ▼                              ▼
  OrganizationHierarchies          Offices
         │                              │
         │    Code match                │
         └──────────────┬───────────────┘
                        │
                        ▼
              Office.OrganizationHierarchyId
```

#### 4.3 Target Architecture

```
UNOPS.PAO.Domain/Entities/
└── Office.cs                          NEW — Office entity

UNOPS.PAO.UNOPSDomain/Entities/
└── (Office in Domain if shared)       Or UNOPS-specific override if needed

UNOPS.PAO.UNOPSDataAccess/
├── Context/UNOPSAppDbContext.cs       MODIFY — Add DbSet<Office>, configure Office
└── Migrations/
    └── YYYYMMDD_AddOfficeEntity.cs    NEW — Create Offices table

ExternalDataService/config/
└── 13-offices.yaml                    NEW — Office sync from Big Query

UNOPS.PAO.UNOPSBusiness/
├── Managers/OfficeManager.cs          NEW — IOfficeManager
├── Services/OfficeService.cs          NEW — List, search, tree, detail, related, permissions
└── Interfaces/IOfficeManager.cs       NEW

UNOPS.PAO.Models/Offices/
├── OfficeListModel.cs                 NEW
├── OfficeDetailModel.cs               NEW (+ sub-models)
├── OfficeFilterRequest.cs             NEW
├── OfficePermissionsModel.cs          NEW
├── OfficeTreeNodeModel.cs             NEW
└── (other models)

UNOPS.PAO.Presentation/
├── Controllers/Offices/OfficeController.cs  NEW
└── Helpers/
    ├── APIDictionary.cs              MODIFY — Add Office
    └── EntityTypes.cs                MODIFY — Add Office
```

---

### 5. User Stories (Backend-Focused)

#### US-1: Office Data Synced from EDS
**As a** system administrator  
**I want** Office records synced from Big Query via EDS  
**So that** Office data stays current with the organisational structure

**Acceptance Criteria:**
- EDS config syncs Offices from `unopsreporting.Organisation.Organisational_Structures`
- Office.Code matches OrganizationHierarchy.Code for link
- Office.OrganizationHierarchyId populated (during sync or post-sync step)
- Sync runs on schedule; Offices table updated

#### US-2: List Offices
**As a** user with read access  
**I want to** retrieve a paginated list of offices  
**So that** I can browse the Office directory

**Acceptance Criteria:**
- GET /api/office returns paginated list
- Filter by type, parent, search text
- Response includes Code, Name, Type, ChildrenCount (from linked OrganizationHierarchy)
- Excludes soft-deleted (IsDeleted = false)

#### US-3: View Office Detail
**As a** user with read access  
**I want to** retrieve full office details  
**So that** I can view all sections (Key Info, Financial, Scope, Roles, DoA, Physical)

**Acceptance Criteria:**
- GET /api/office/{id} returns OfficeDetailModel
- Key Information from Office + OrganizationHierarchy
- Financial, Scope from Office (stubs where sync not available)
- Operational Roles, DoA from EntityUserRole (EntityType=OrganizationHierarchy, EntityId=Office.OrganizationHierarchyId)
- Physical Office Details: stub until oUP sync
- Parent/Children from OrganizationHierarchy hierarchy
- 404 if not found or soft-deleted

#### US-4: View Office Organigram
**As a** user with read access  
**I want to** retrieve the office hierarchy as a tree  
**So that** I can display the organigram

**Acceptance Criteria:**
- GET /api/office/tree returns hierarchical structure
- Built from Office records linked to OrganizationHierarchy; tree structure follows OrganizationHierarchy.ParentId
- Each node: Id, Code, Name, Type, Children (recursive)

#### US-5: View Related Opportunities
**As a** user viewing an office  
**I want to** see opportunities where Responsible Org Unit = this office's OrganizationHierarchy or descendants  
**So that** I understand which opportunities this office influences

**Acceptance Criteria:**
- GET /api/office/{id}/opportunities
- Resolve Office.OrganizationHierarchyId; include descendants
- Opportunities where ResponsibleOrgUnitId in (org hierarchy + descendants)
- Pagination, search, sort

#### US-6: View Related Partner Accounts
**As a** user viewing an office  
**I want to** see partners managed by this office's OrganizationHierarchy or descendants  
**So that** I understand which partners this office manages

**Acceptance Criteria:**
- GET /api/office/{id}/partners
- Resolve Office.OrganizationHierarchyId; include descendants
- Partners with OrganizationUnitRelationship to org hierarchy or descendants
- Pagination, search, sort

#### US-7: Check Office Permissions
**As a** frontend application  
**I want to** retrieve permission flags for an office  
**So that** I can show/hide edit controls (e.g., Workflow Configuration)

**Acceptance Criteria:**
- GET /api/office/{id}/permissions
- canView, canEditWorkflowConfiguration
- canEditWorkflowConfiguration = true only for Regional Director or OiC (EntityUserRole for Office.OrganizationHierarchyId)

#### US-8: Manage Office Documents
**As a** Regional Director or OiC  
**I want to** upload Strategy documents to an office  
**So that** office artifacts are stored

**Acceptance Criteria:**
- EntityArtifact with EntityType = "Office", EntityId = Office.Id
- ArtifactType = "Strategy"
- Upload restricted to canEditWorkflowConfiguration (or dedicated permission)

---

### 6. Functional Requirements

#### FR-1: Office Domain Entity

| Req | Description |
|-----|-------------|
| FR-1.1 | Create `Office` entity in UNOPS.PAO.Domain (or UNOPSDomain if UNOPS-specific) |
| FR-1.2 | Inherit from ModifiableDeletableEntity (Id, Name, Status, audit fields, IsDeleted) |
| FR-1.3 | Properties: Code (required, unique), OrganizationHierarchyId (nullable FK), InternalName, Alias, ExternalName, OrganisationalEntityType, HierarchyLevel, EffectiveDate, CostCentreId, FinancialCentreType, Funding (JSON or related table), NerTarget, NerTargetPeriod, EaTarget, EaTargetPeriod, ScopeType |
| FR-1.4 | Navigation: OrganizationHierarchy (FK) |
| FR-1.5 | Name: Required; use InternalName or Code for display |
| FR-1.6 | Configure in UNOPSAppDbContext: HasOne(OrganizationHierarchy).WithMany().HasForeignKey(OrganizationHierarchyId) |
| FR-1.7 | Index on Code (unique); index on OrganizationHierarchyId |

#### FR-2: Database Migration

| Req | Description |
|-----|-------------|
| FR-2.1 | Create migration `AddOfficeEntity` |
| FR-2.2 | Create `Offices` table with all columns |
| FR-2.3 | FK to OrganizationHierarchies(Id) |
| FR-2.4 | Defensive migration pattern (check existence before add) |

#### FR-3: EDS Sync Configuration

| Req | Description |
|-----|-------------|
| FR-3.1 | Create `13-offices.yaml` (or next available number) |
| FR-3.2 | Source: Big Query `unopsreporting.Organisation.Organisational_Structures` |
| FR-3.3 | Query: Extract Office-level records (align with Org_Unit grain from OrganizationHierarchy sync) |
| FR-3.4 | Destination: `Offices` table |
| FR-3.5 | Field mappings: Id, Code, InternalName, Alias, ExternalName, OrganisationalEntityType, HierarchyLevel, EffectiveDate, CostCentreId, FinancialCentreType, etc. |
| FR-3.6 | Post-sync or in-query: Set OrganizationHierarchyId by matching Code to OrganizationHierarchies.Code |
| FR-3.7 | Primary key: Id or Code (per EDS design) |
| FR-3.8 | Sync mode: Upsert |

#### FR-4: Office Manager

| Req | Description |
|-----|-------------|
| FR-4.1 | IOfficeManager, OfficeManager |
| FR-4.2 | GetByIdAsync(id), GetByCodeAsync(code) |
| FR-4.3 | List with pagination, filters (Code, Type, SearchTerm) |
| FR-4.4 | All queries filter !IsDeleted |
| FR-4.5 | Register in ManagerWrapper |

#### FR-5: Office Service

| Req | Description |
|-----|-------------|
| FR-5.1 | OfficeService: GetOfficesAsync, SearchOfficesAsync, GetOfficeTreeAsync, GetOfficeDetailAsync |
| FR-5.2 | GetDescendantOrganizationHierarchyIdsAsync(orgHierarchyId) — recursive |
| FR-5.3 | GetRelatedOpportunitiesAsync(officeId, request) — via Office.OrganizationHierarchyId + descendants |
| FR-5.4 | GetRelatedPartnersAsync(officeId, request) — via OrganizationUnitRelationship |
| FR-5.5 | GetOfficePermissionsAsync(officeId, userId) — canView, canEditWorkflowConfiguration |
| FR-5.6 | Detail: Populate from Office + OrganizationHierarchy + EntityUserRole + OrganizationUnitRelationship |

#### FR-6: Office Controller

| Req | Description |
|-----|-------------|
| FR-6.1 | GET /api/office — List |
| FR-6.2 | GET /api/office/search — Search |
| FR-6.3 | GET /api/office/tree — Tree (organigram) |
| FR-6.4 | GET /api/office/{id} — Detail |
| FR-6.5 | GET /api/office/{id}/permissions — Permissions |
| FR-6.6 | GET /api/office/{id}/opportunities — Related opportunities |
| FR-6.7 | GET /api/office/{id}/partners — Related partners |
| FR-6.8 | AccessControlled(EntityTypes.Office, "read") |
| FR-6.9 | Add APIDictionary.Office, EntityTypes.Office |

#### FR-7: Office Models

| Req | Description |
|-----|-------------|
| FR-7.1 | OfficeListModel: Id, Code, Name, Type, ParentId, ParentName, ChildrenCount, Status |
| FR-7.2 | OfficeDetailModel: KeyInformation, FinancialInformation, Scope, OperationalRoles, DoAHolders, PhysicalOfficeDetails, ParentChain, Children |
| FR-7.3 | OfficeTreeNodeModel: Id, Code, Name, Type, Children (recursive) |
| FR-7.4 | OfficePermissionsModel: CanView, CanEditWorkflowConfiguration |
| FR-7.5 | OfficeFilterRequest: PaginationRequest + Name, Code, Type, ParentId, SearchTerm |

#### FR-8: Documents

| Req | Description |
|-----|-------------|
| FR-8.1 | EntityArtifact: EntityType = "Office", EntityId = Office.Id |
| FR-8.2 | ArtifactType "Strategy" exists and linkable to Office |
| FR-8.3 | Extend entity configuration if Office not yet supported |

---

### 7. Non-Goals (Out of Scope)

- Frontend implementation
- Workflow Configuration entity/table (Phase 2)
- Corporate_Performance sync (stub financial fields)
- oUP Locations sync (stub physical office details)
- Office CRUD by users (Office is sync-managed)

---

### 8. Technical Considerations

#### 8.1 Office–OrganizationHierarchy Link

- **Code** is the business key linking Office to OrganizationHierarchy
- **OrganizationHierarchyId** is the FK for efficient joins
- EDS sync must populate OrganizationHierarchyId: either via SQL join in query, or post-sync UPDATE matching Code
- If Code has no matching OrganizationHierarchy, OrganizationHierarchyId remains null; detail/tree may exclude or handle gracefully

#### 8.2 Hierarchy and Tree

- Office tree structure follows OrganizationHierarchy.ParentId (via Office.OrganizationHierarchyId)
- Parent/Children for an Office: resolve via OrganizationHierarchy.Parent, OrganizationHierarchy.Children
- Descendant IDs for related entities: recursive from OrganizationHierarchy

#### 8.3 EntityUserRole

- Operational Roles and DoA: EntityType = "OrganizationHierarchy", EntityId = Office.OrganizationHierarchyId
- When OrganizationHierarchyId is null, return empty lists for roles/DoA

---

### 9. Data Models

#### Office Entity (Domain)

```csharp
public class Office : ModifiableDeletableEntity
{
    public required string Code { get; set; }
    public int? OrganizationHierarchyId { get; set; }
    public virtual OrganizationHierarchy? OrganizationHierarchy { get; set; }
    public string? InternalName { get; set; }
    public string? Alias { get; set; }
    public string? ExternalName { get; set; }
    public string? OrganisationalEntityType { get; set; }
    public int? HierarchyLevel { get; set; }
    public DateTime? EffectiveDate { get; set; }
    public string? CostCentreId { get; set; }
    public string? FinancialCentreType { get; set; }
    public string? Funding { get; set; }  // JSON or comma-separated; expand as needed
    public decimal? NerTarget { get; set; }
    public string? NerTargetPeriod { get; set; }
    public decimal? EaTarget { get; set; }
    public string? EaTargetPeriod { get; set; }
    public string? ScopeType { get; set; }
    // PhysicalOfficeDetails: stub; add when oUP sync available
}
```

#### Office API Models

- OfficeListModel, OfficeDetailModel, OfficeKeyInformationModel, OfficeFinancialInformationModel, OfficeScopeModel
- OfficeOperationalRoleModel, OfficeDoAHolderModel, OfficePhysicalDetailsModel
- OfficeHierarchyNodeModel, OfficeTreeNodeModel
- OfficePermissionsModel, OfficeFilterRequest

(Full structure per previous PRD Section 9; adjust for Office as primary source.)

---

### 10. Success Metrics

- Office entity and table created
- EDS sync populates Offices; OrganizationHierarchyId linked via Code
- All API endpoints return correct data
- Related entities include hierarchy (office + descendants)
- Unit and integration tests pass

---

### 11. Open Questions

1. Exact Office grain in Big Query (Org_Unit only, or include Region/Hub?)
2. EDS post-sync step for OrganizationHierarchyId vs. in-query join
3. EntityRole codes for Regional Director, OiC (canEditWorkflowConfiguration)
4. Artifact/Entity configuration: ensure Office is supported

---

## Appendix A: API Route Summary

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/office | List offices |
| GET | /api/office/search | Search offices |
| GET | /api/office/tree | Office hierarchy (organigram) |
| GET | /api/office/{id} | Office detail |
| GET | /api/office/{id}/permissions | Permission flags |
| GET | /api/office/{id}/opportunities | Related opportunities |
| GET | /api/office/{id}/partners | Related partner accounts |

---

## Appendix B: Office–OrganizationHierarchy Relationship

| Office Field | OrganizationHierarchy | Relationship |
|--------------|------------------------|--------------|
| Code | Code | Match key (Office.Code = OrganizationHierarchy.Code) |
| OrganizationHierarchyId | Id | FK |
| Parent/Children | — | Resolved via OrganizationHierarchy.Parent, Children |
| Related Opportunities | ResponsibleOrgUnitId | Opportunity.ResponsibleOrgUnitId = OrganizationHierarchy.Id |
| Related Partners | OrganizationUnitRelationship | OrgUnitRelationship.OrganizationHierarchyId |
| Operational Roles, DoA | EntityUserRole | EntityId = OrganizationHierarchy.Id, EntityType = "OrganizationHierarchy" |
| Geographic Scope | OrganizationUnitRelationship | EntityType = "Country" |
