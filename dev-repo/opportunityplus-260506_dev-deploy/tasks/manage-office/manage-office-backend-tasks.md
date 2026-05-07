# Task List: Office Entity — Backend Implementation

**Generated from:** `manage-office-backend-prd.md`  
**Generated on:** 2026-03-10

**Key Architecture:** Office is a **new entity** with its own table. Data is synced from EDS (same Big Query source as OrganizationHierarchy). Office is **related to** OrganizationHierarchy via the **Code** field (Office.OrganizationHierarchyId FK, populated by matching Code).

---

## Relevant Files

### Backend Files (.NET Core)

**Domain Entity:**
- `UNOPS.PAO.Domain/Entities/Office.cs` - NEW (or UNOPS.PAO.UNOPSDomain/Entities/Office.cs if UNOPS-specific)

**Database:**
- `UNOPS.PAO.UNOPSDataAccess/Context/UNOPSAppDbContext.cs` - EXISTS - MODIFY (Add DbSet<Office>, configure Office entity)
- `UNOPS.PAO.UNOPSDataAccess/Migrations/YYYYMMDD_AddOfficeEntity.cs` - NEW

**EDS Sync:**
- `ExternalDataService/config/13-offices.yaml` - NEW (or next available config number)

**Managers & Services:**
- `UNOPS.PAO.UNOPSBusiness/Interfaces/IOfficeManager.cs` - NEW
- `UNOPS.PAO.UNOPSBusiness/Managers/OfficeManager.cs` - NEW
- `UNOPS.PAO.UNOPSBusiness/Services/OfficeService.cs` - NEW

**Models:**
- `UNOPS.PAO.Models/Offices/OfficeListModel.cs` - NEW
- `UNOPS.PAO.Models/Offices/OfficeDetailModel.cs` - NEW
- `UNOPS.PAO.Models/Offices/OfficeFilterRequest.cs` - NEW
- `UNOPS.PAO.Models/Offices/OfficePermissionsModel.cs` - NEW
- `UNOPS.PAO.Models/Offices/OfficeTreeNodeModel.cs` - NEW
- `UNOPS.PAO.Models/Offices/` (sub-models: OfficeKeyInformationModel, OfficeFinancialInformationModel, etc.) - NEW

**Controller:**
- `UNOPS.PAO.Presentation/Controllers/Offices/OfficeController.cs` - NEW

**Helpers:**
- `UNOPS.PAO.Presentation/Helpers/APIDictionary.cs` - EXISTS - MODIFY (add Office route)
- `UNOPS.PAO.Presentation/Helpers/EntityTypes.cs` - EXISTS - MODIFY (add Office entity type)

**Manager Wrapper:**
- `UNOPS.PAO.UNOPSBusiness/Managers/ManagerWrapper.cs` - EXISTS - MODIFY (register OfficeManager)
- `UNOPS.PAO.UNOPSBusiness/Interfaces/IManagerWrapper.cs` - EXISTS - MODIFY (add IOfficeManager)

**Mapping:**
- `UNOPS.PAO.Business/Managers/Mapping/MappingProfile.cs` - EXISTS - MODIFY (Office mappings)
- `UNOPS.PAO.UNOPSBusiness/Managers/Mapping/MappingProfile.cs` - EXISTS - MODIFY (if Office is UNOPS-overridden)

**Backend - Unit/Integration Tests:**
- `QA Tests/Integration Tests/Controllers/OfficeControllerTests.cs` - NEW
- `QA Tests/C# Tests/.../OfficeManagerTests.cs` or `OfficeServiceTests.cs` - NEW

**Existing (Reference):**
- `UNOPS.PAO.Domain/Entities/OrganizationHierarchy.cs` - EXISTS
- `UNOPS.PAO.Domain/Entities/OrganizationUnitRelationship.cs` - EXISTS
- `ExternalDataService/config/09-organization-hierarchies.yaml` - EXISTS (reference for sync pattern)

---

## ⚠️ CRITICAL Testing Requirements

### Testing Philosophy
All implementation tasks MUST include corresponding unit tests. Tests are integrated as sub-tasks within each parent task.

### Required Tools
- **Backend:** xUnit, Moq, InMemory Database (EF Core), FluentAssertions

### Mandatory Verification
Every unit test task includes: "Verify all tests compile and run successfully with no errors"

---

## Tasks

- [ ] **1.0 Backend: Office Domain Entity and Migration**
  > Create the Office entity and database table. Office is a new entity related to OrganizationHierarchy via Code.

  - [ ] 1.1 Create `Office.cs` in `UNOPS.PAO.Domain/Entities/` (or UNOPSDomain if UNOPS-specific)
    - Inherit from ModifiableDeletableEntity
    - Properties: Code (required), OrganizationHierarchyId (nullable int), InternalName, Alias, ExternalName, OrganisationalEntityType, HierarchyLevel, EffectiveDate, CostCentreId, FinancialCentreType, Funding, NerTarget, NerTargetPeriod, EaTarget, EaTargetPeriod, ScopeType
    - Navigation: OrganizationHierarchy
    - Name: Required (use InternalName ?? Code for base Name)
  - [ ] 1.2 Configure Office in `UNOPSAppDbContext.OnModelCreating()`
    - HasOne(o => o.OrganizationHierarchy).WithMany().HasForeignKey(o => o.OrganizationHierarchyId).OnDelete(DeleteBehavior.Restrict)
    - Index on Code (unique)
    - Index on OrganizationHierarchyId
  - [ ] 1.3 Add `DbSet<Office> Offices` to UNOPSAppDbContext
  - [ ] 1.4 Create migration: `dotnet ef migrations add AddOfficeEntity --context UNOPSAppDbContext`
  - [ ] 1.5 Make migration defensive (check column/table existence before add)
  - [ ] 1.6 Create unit tests for Office entity
    - Test entity creation, property mapping
    - Test OrganizationHierarchy navigation
    - Verify all tests compile and run successfully with no errors
  - [ ] 1.7 Review implementation: verify entity and migration match FR-1, FR-2

- [ ] **2.0 Backend: EDS Sync Configuration for Offices**
  > Create EDS config to sync Office data from Big Query (same source as OrganizationHierarchy). Office links to OrganizationHierarchy via Code.

  - [ ] 2.1 Create `13-offices.yaml` in `ExternalDataService/config/` (or next available number)
    - metadata: name, description, version, enabled
  - [ ] 2.2 Configure source: type bigquery, query from `unopsreporting.Organisation.Organisational_Structures`
    - Align grain with OrganizationHierarchy (e.g., Org_Unit level)
    - Extract: Id, Code, InternalName (Name/path), Alias, ExternalName, OrganisationalEntityType, HierarchyLevel, EffectiveDate, CostCentreId, FinancialCentreType, Funding, NerTarget, EaTarget, etc.
    - Use same date filter as org-hierarchies: Effective_Date = CURRENT_DATE()
  - [ ] 2.3 Configure destination: table_name "Offices", schema "public"
  - [ ] 2.4 Define field_mappings for all Office columns
  - [ ] 2.5 Add OrganizationHierarchyId population
    - Option A: Include in query via JOIN on OrganizationHierarchies.Code = Office.Code
    - Option B: Post-sync script/step: UPDATE Offices SET OrganizationHierarchyId = (SELECT Id FROM OrganizationHierarchies WHERE Code = Offices.Code)
    - Document chosen approach in config or README
  - [ ] 2.6 Set primary_key_field, sync_options (Upsert)
  - [ ] 2.7 Verify EDS can run offices sync (manual test or document)
  - [ ] 2.8 Review implementation: verify sync matches FR-3

- [ ] **3.0 Backend: Office Models and DTOs**
  > Create all Office-related API models.

  - [ ] 3.1 Create `UNOPS.PAO.Models/Offices/` folder
  - [ ] 3.2 Create `OfficeListModel.cs`: Id, Code, Name, Type, ParentId, ParentName, ChildrenCount, Status
  - [ ] 3.3 Create `OfficeDetailModel.cs` with KeyInformation, FinancialInformation, Scope, OperationalRoles, DoAHolders, PhysicalOfficeDetails, ParentChain, Children, Permissions
  - [ ] 3.4 Create sub-models: OfficeKeyInformationModel, OfficeFinancialInformationModel, OfficeScopeModel, OfficeOperationalRoleModel, OfficeDoAHolderModel, OfficePhysicalDetailsModel, OfficeHierarchyNodeModel
  - [ ] 3.5 Create `OfficeTreeNodeModel.cs`: Id, Code, Name, Type, Children (recursive)
  - [ ] 3.6 Create `OfficePermissionsModel.cs`: CanView, CanEditWorkflowConfiguration
  - [ ] 3.7 Create `OfficeFilterRequest.cs`: extend PaginationRequest with Name, Code, Type, ParentId, SearchTerm
  - [ ] 3.8 Create `CountryScopeModel.cs` for GeographicScope
  - [ ] 3.9 Add AutoMapper profiles for Office → OfficeListModel, Office → OfficeDetailModel
  - [ ] 3.10 Review implementation: verify models match FR-7

- [ ] **4.0 Backend: OfficeManager**
  > Implement OfficeManager for data access.

  - [ ] 4.1 Create `IOfficeManager.cs` in UNOPS.PAO.UNOPSBusiness/Interfaces
    - GetByIdAsync(int id), GetByCodeAsync(string code)
    - GetOfficesAsync(OfficeFilterRequest request) → PaginationResult<Office>
  - [ ] 4.2 Create `OfficeManager.cs` in UNOPS.PAO.UNOPSBusiness/Managers
    - Inject AppDbContext, IMapper
    - Implement GetByIdAsync, GetByCodeAsync
    - Implement GetOfficesAsync with filters, pagination, !IsDeleted
    - Include OrganizationHierarchy for ParentName, ChildrenCount
  - [ ] 4.3 Register OfficeManager in ManagerWrapper and IManagerWrapper
  - [ ] 4.4 Create unit tests for OfficeManager
    - Test GetByIdAsync, GetByCodeAsync
    - Test GetOfficesAsync pagination, filters
    - Test soft-deleted excluded
    - Verify all tests compile and run successfully with no errors
  - [ ] 4.5 Review implementation: verify manager matches FR-4

- [ ] **5.0 Backend: OfficeService — List, Search, Tree, Detail**
  > Implement OfficeService for list, search, tree, and detail operations.

  - [ ] 5.1 Create `OfficeService.cs` in UNOPS.PAO.UNOPSBusiness/Services
    - Inject IOfficeManager, AppDbContext, IManagerWrapper (for UserResolverService)
  - [ ] 5.2 Implement `GetOfficesAsync(OfficeFilterRequest request)`
    - Delegate to OfficeManager or query Offices with filters
    - Map to OfficeListModel; include ParentName, ChildrenCount from OrganizationHierarchy
  - [ ] 5.3 Implement `SearchOfficesAsync(string query, OfficeFilterRequest request)`
    - Full-text search on InternalName, Code, Alias
    - Return paginated OfficeListModel
  - [ ] 5.4 Implement `GetDescendantOrganizationHierarchyIdsAsync(int orgHierarchyId)`
    - Recursive: orgHierarchyId + all descendants from OrganizationHierarchy.Children
    - Used for related opportunities/partners
  - [ ] 5.5 Implement `GetOfficeTreeAsync(int? rootId = null)`
    - Build tree from Offices joined with OrganizationHierarchy for ParentId/Children
    - Structure follows OrganizationHierarchy hierarchy
    - Return List<OfficeTreeNodeModel>
  - [ ] 5.6 Implement `GetOfficeDetailAsync(int id)`
    - Fetch Office by id with OrganizationHierarchy; 404 if not found or IsDeleted
    - Populate KeyInformation from Office + OrganizationHierarchy
    - Populate FinancialInformation, Scope from Office (stubs where null)
    - Populate ParentChain, Children via OrganizationHierarchy
    - Populate OperationalRoles, DoAHolders from EntityUserRole (EntityType=OrganizationHierarchy, EntityId=Office.OrganizationHierarchyId)
    - Populate GeographicScope from OrganizationUnitRelationship (EntityType=Country)
    - PhysicalOfficeDetails: stub
  - [ ] 5.7 Register OfficeService in DI
  - [ ] 5.8 Create unit tests for OfficeService
    - Test GetOfficesAsync, SearchOfficesAsync
    - Test GetOfficeTreeAsync structure
    - Test GetOfficeDetailAsync with all sections
    - Test GetDescendantOrganizationHierarchyIdsAsync
    - Test 404 for non-existent/soft-deleted
    - Verify all tests compile and run successfully with no errors
  - [ ] 5.9 Review implementation: verify service matches FR-5

- [ ] **6.0 Backend: OfficeService — Related Entities and Permissions**
  > Implement related opportunities, partners, and permissions.

  - [ ] 6.1 Implement `GetRelatedOpportunitiesAsync(int officeId, PaginationRequest request)`
    - Get Office.OrganizationHierarchyId; get descendant IDs via GetDescendantOrganizationHierarchyIdsAsync
    - Query Opportunities where ResponsibleOrgUnitId in (orgHierarchyId + descendants), !IsDeleted
    - Support query, orderBy, ascending, filterActive
    - Return PaginationResponse<OpportunityModel>
  - [ ] 6.2 Implement `GetRelatedPartnersAsync(int officeId, PaginationRequest request)`
    - Get descendant org hierarchy IDs
    - Query Partners with OrganizationUnitRelationship where OrganizationHierarchyId in descendants
    - Exclude soft-deleted
    - Return PaginationResponse<PartnerModel>
  - [ ] 6.3 Implement `GetOfficePermissionsAsync(int officeId, int userId)`
    - canView: User has read access to Office
    - canEditWorkflowConfiguration: EntityUserRole for Office.OrganizationHierarchyId where user has Regional Director or OiC role
    - Return OfficePermissionsModel
  - [ ] 6.4 Create unit tests for GetRelatedOpportunitiesAsync, GetRelatedPartnersAsync, GetOfficePermissionsAsync
    - Test hierarchy inclusion
    - Test pagination
    - Test permissions for RD/OiC vs other roles
    - Verify all tests compile and run successfully with no errors
  - [ ] 6.5 Review implementation: verify related entities and permissions match FR-5

- [ ] **7.0 Backend: OfficeController**
  > Create OfficeController with all REST endpoints.

  - [ ] 7.1 Add `APIDictionary.Office = "api/office"` to APIDictionary.cs
  - [ ] 7.2 Add `EntityTypes.Office = "Office"` to EntityTypes.cs
  - [ ] 7.3 Create `OfficeController.cs` in `UNOPS.PAO.Presentation/Controllers/Offices/`
    - Route: [Route("/")], Authorize: IAP
    - Inject OfficeService, UserResolverService, IAuthorizationService, ILogger
  - [ ] 7.4 Implement GET /api/office — List offices
    - [AccessControlled(EntityTypes.Office, "read")]
    - Query params: pageIndex, pageSize, orderBy, ascending, name, code, type, parentId, searchTerm
    - Return PaginationResponse<OfficeListModel>
  - [ ] 7.5 Implement GET /api/office/search — Search offices
    - Query param: query (required)
    - Return PaginationResponse<OfficeListModel>
  - [ ] 7.6 Implement GET /api/office/tree — Office hierarchy
    - Query param: rootId (optional)
    - Return tree structure (List<OfficeTreeNodeModel> or root node with children)
  - [ ] 7.7 Implement GET /api/office/{id} — Office detail
    - Return OfficeDetailModel; 404 if not found
  - [ ] 7.8 Implement GET /api/office/{id}/permissions
    - Verify user can view; return OfficePermissionsModel; 403 if cannot view
  - [ ] 7.9 Implement GET /api/office/{id}/opportunities
    - Query params: query, pageIndex, pageSize, orderBy, ascending, filterActive
    - Return PaginationResponse<OpportunityModel>
  - [ ] 7.10 Implement GET /api/office/{id}/partners
    - Query params: query, pageIndex, pageSize, orderBy, ascending, filterActive
    - Return PaginationResponse<PartnerModel>
  - [ ] 7.11 Create integration tests in OfficeControllerTests.cs
    - Test all endpoints, status codes
    - Test 404, 403
    - Verify all tests compile and run successfully with no errors
  - [ ] 7.12 Review implementation: verify all endpoints match PRD Appendix A

- [ ] **8.0 Backend: Document Integration**
  > Ensure Office documents (Strategy type) work with artifact system.

  - [ ] 8.1 Verify EntityArtifact/entity configuration supports EntityType = "Office"
  - [ ] 8.2 Add Office to entity configuration if needed
  - [ ] 8.3 Verify ArtifactType "Strategy" can be linked to Office
  - [ ] 8.4 Document: Document upload uses existing artifact endpoints with entityType=Office, entityId=office.Id
  - [ ] 8.5 Review implementation: verify document integration matches FR-8

- [ ] **9.0 Integration & End-to-End Verification**
  > Verify complete Office backend flows.

  - [ ] 9.1 Run migration; verify Offices table created
  - [ ] 9.2 Run EDS offices sync (or document manual steps)
  - [ ] 9.3 Verify Office.OrganizationHierarchyId populated via Code match
  - [ ] 9.4 Test all API endpoints end-to-end
  - [ ] 9.5 Test related opportunities and partners include hierarchy
  - [ ] 9.6 Test permissions endpoint
  - [ ] 9.7 Document any issues; create follow-up tasks if needed
  - [ ] 9.8 Review complete implementation against PRD user stories and functional requirements

---

## Notes

- **Office is a NEW entity** — separate table, not a view of OrganizationHierarchy
- **Relationship:** Office.Code = OrganizationHierarchy.Code; Office.OrganizationHierarchyId (FK)
- **EDS sync:** Same source as OrganizationHierarchy; Office sync runs independently
- **Related entities:** Resolved via Office.OrganizationHierarchyId and OrganizationHierarchy descendant tree
- **EntityUserRole:** Use EntityType = "OrganizationHierarchy", EntityId = Office.OrganizationHierarchyId for roles/DoA
- All queries filter !IsDeleted on Office, OrganizationHierarchy, Opportunity, Partner, OrganizationUnitRelationship

### Codebase Notes
- ModifiableDeletableEntity provides Id, Name, Status, CreatedBy, CreatedDate, LastModifiedBy, LastModifiedDate, IsDeleted, DeletedBy, DeletedDate
- OrganizationHierarchy has Code, Name, Type, Description, ParentId, Children
- Opportunity.ResponsibleOrgUnitId → OrganizationHierarchy.Id
- OrganizationUnitRelationship links OrganizationHierarchyId to EntityId/EntityType (Country, Partner, etc.)
