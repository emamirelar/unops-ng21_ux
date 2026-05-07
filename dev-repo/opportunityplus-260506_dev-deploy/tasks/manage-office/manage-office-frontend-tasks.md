# Task List: Office Entity — Frontend Implementation (Operational Roles & DoA)

**Generated from:** `manage-office-frontend-prd.md`  
**Generated on:** 2026-03-10

**Reference Mockups:** `tasks/manage-office/mockups/all-mockups.html`

**Prerequisites:** Backend Office API, EntityUserRoles (Operational Roles, DoA) implemented and deployed.

---

## Relevant Files

### Frontend Files (Angular)

**Services:**
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/services/office.service.ts` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/services/office.service.spec.ts` - NEW

**Models:**
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/models/office.model.ts` - NEW

**Components:**
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-list/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-detail/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-detail-tabs/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-roles-doa/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-operational-roles-table/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-doa-holders-table/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-details-tab/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-financial-tab/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-scope-tab/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-opportunities-tab/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-partners-tab/` - NEW
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-documents-tab/` - NEW

**Routing:**
- `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/office-management.routes.ts` - MODIFY (use OfficeDetailComponent for :id)
- `UNOPS.PAO.ClientApp/src/app/features/admin/admin.routes.ts` - MODIFY (replace ComingSoon with loadChildren for office-management)

**i18n:**
- `UNOPS.PAO.ClientApp/public/assets/i18n/en.json` - MODIFY
- `UNOPS.PAO.ClientApp/public/assets/i18n/fr.json` - MODIFY
- `UNOPS.PAO.ClientApp/public/assets/i18n/es.json` - MODIFY
- `UNOPS.PAO.ClientApp/public/assets/i18n/pt.json` - MODIFY

**Sidebar:**
- `UNOPS.PAO.ClientApp/src/app/layouts/components/sidebar/sidebar.component.ts` - MODIFY (ensure Office link points to office-management)

---

## ⚠️ CRITICAL Requirements

- **Tailwind-first:** Use Tailwind classes in templates; minimal SCSS
- **Translation keys:** All user-facing text uses `| translate`; add keys to all 4 language files
- **PrimeNG Modules:** Import PrimeNG Modules (TableModule, TabsModule, etc.) per component-development.mdc
- **Signals:** Use Angular 19 signals for state (input(), output(), computed(), signal())
- **Server-side permissions:** Use permission endpoint for canView, canEdit; never hardcode client-side

---

## Tasks

- [x] **1.0 Frontend: Office Models and Service**
  > Create TypeScript models and OfficeService to call backend API.

  - [x] 1.1 Create `office.model.ts` in `features/admin/office-management/models/`
    - Interfaces: OfficeListModel, OfficeDetailModel, OfficeOperationalRoleModel, OfficeDoAHolderModel, OfficeKeyInformationModel, OfficeFinancialInformationModel, OfficeScopeModel, OfficeTreeNodeModel, OfficeHierarchyNodeModel, OfficePermissionsModel, OfficeFilterRequest, PaginationResponse
    - Match backend DTO structure
  - [x] 1.2 Create `office.service.ts` in `features/admin/office-management/services/`
    - Methods: getOffices(request), searchOffices(query, request), getOfficeTree(rootId?), getOfficeDetail(id), getOfficePermissions(id), getRelatedOpportunities(id, request), getRelatedPartners(id, request)
    - Use HttpClient; inject API base URL
    - Return Observables
  - [x] 1.3 Add loading/error signals if needed for UI state
  - [x] 1.4 Verify service compiles; add unit tests for OfficeService
  - [x] 1.5 Review implementation: verify models and service match FR-1, FR-2

- [x] **2.0 Frontend: Office List Component**
  > Implement Office list with search and pagination.

  - [x] 2.1 Create `office-list` component
    - Use PrimeNG Table (TableModule) or equivalent
    - Columns: Name, Code, Type, Parent, Status
  - [x] 2.2 Add search input with debounce (e.g., 300ms)
  - [x] 2.3 Implement pagination (PageIndex, PageSize)
  - [x] 2.4 Row click navigates to `/admin/office-management/:id`
  - [x] 2.5 Use translation keys for column headers and labels
  - [x] 2.6 Add loading skeleton/state
  - [x] 2.7 Run ESLint --fix; verify component matches FR-3

- [x] **3.0 Frontend: Office Detail Component and Tabs**
  > Implement Office detail page with tabbed layout.

  - [x] 3.1 Create `office-detail` component
    - Resolve office by id from route (ActivatedRoute)
    - Load office detail via OfficeService.getOfficeDetail(id)
    - Page header: name, badges (type, status, level, scope), meta (ID, code, Regional Director, Effective date)
    - "Back to Offices" link
  - [x] 3.2 Create `office-detail-tabs` component
    - Tabs: Details, Financial, Scope, Roles & DoA, Related Opportunities, Related Partner Accounts, Documents
    - Use PrimeNG Tabs (TabsModule) or custom tab buttons
    - Tab counts for Related Opportunities, Related Partners (from detail or separate load)
  - [x] 3.3 Implement tab content switching (router-outlet with child routes or ngSwitch)
  - [x] 3.4 Add translation keys for tab labels
  - [x] 3.5 Review implementation: verify matches FR-4

- [x] **4.0 Frontend: Roles & DoA Tab — Container**
  > Create Roles & DoA tab container with two cards.

  - [x] 4.1 Create `office-roles-doa` component
    - Input: office detail (or operationalRoles, doaHolders directly)
    - Two cards: Operational Roles, Delegation of Authority Holders
  - [x] 4.2 Operational Roles card:
    - Header: groups icon, "Operational Roles", badge "Read-only · Source: ERP"
    - Body: `<app-office-operational-roles-table [operationalRoles]="operationalRoles" />`
    - Footer: "Source: ERP Admin — Management Structure · Last synced: [date or —]"
  - [x] 4.3 DoA Holders card:
    - Info callout: "All DoA types are shown. If no holder is currently assigned..."
    - Header: verified_user icon, "Delegation of Authority Holders", badge "Read-only · Source: ERP"
    - Body: `<app-office-doa-holders-table [doaHolders]="doaHolders" />`
    - Footer: "Source: ERP Core Controls · Last synced: [date or —]"
  - [x] 4.4 Use Tailwind/unops-card styling per mockups
  - [x] 4.5 Add translation keys
  - [x] 4.6 Review implementation: verify matches FR-5

- [x] **5.0 Frontend: Operational Roles Table Component**
  > Implement Operational Roles table per mockups.

  - [x] 5.1 Create `office-operational-roles-table` component
    - Input: `operationalRoles: OfficeOperationalRoleModel[]`
  - [x] 5.2 Table columns: Role, Personnel, Position Title, Org Unit Works At, Status
  - [x] 5.3 Empty holder: Personnel shows "Not assigned" (italic, muted); Position Title, Org Unit Works At colspan or "Not assigned"
  - [x] 5.4 Status: "Active" badge when isActive; empty otherwise
  - [x] 5.5 Use PrimeNG Table or native table with Tailwind
  - [x] 5.6 Add translation keys for column headers, "Not assigned", "Active"
  - [x] 5.7 Run ESLint --fix; verify matches FR-6

- [x] **6.0 Frontend: DoA Holders Table Component**
  > Implement DoA Holders table per mockups.

  - [x] 6.1 Create `office-doa-holders-table` component
    - Input: `doaHolders: OfficeDoAHolderModel[]`
  - [x] 6.2 Table columns: DoA Type, Level, Role Holder, Applicability Period, Conditions
    - (Optional: Source column if backend provides; otherwise omit)
  - [x] 6.3 Empty holder: Level "—", Role Holder "Not assigned", Period "—", Conditions "—"
  - [x] 6.4 Level: badge (primary/secondary) when assigned; "—" when not
  - [x] 6.5 Applicability Period: format as "MMM d, yyyy — MMM d, yyyy" (e.g., Jan 1, 2026 — Dec 31, 2026)
  - [x] 6.6 Use PrimeNG Table or native table with Tailwind
  - [x] 6.7 Add translation keys
  - [x] 6.8 Run ESLint --fix; verify matches FR-7

- [x] **7.0 Frontend: Details, Financial, Scope Tabs**
  > Implement tab content for Details, Financial, Scope.

  - [x] 7.1 Create `office-details-tab` component
    - Display Key Information (ID, Cost Centre, Internal Name, External Name, Alias, Organisational Entity Type, Hierarchy Level, Effective Date)
    - Parent hierarchy (parent chain)
    - Child offices (children)
    - Use detail-grid layout per mockups
  - [x] 7.2 Create `office-financial-tab` component
    - Display Financial Information (CostCentreId, FinancialCentreType, Funding, NerTarget, EaTarget, etc.)
  - [x] 7.3 Create `office-scope-tab` component
    - Display Scope (ScopeType)
  - [x] 7.4 Add translation keys
  - [x] 7.5 Review implementation against mockups

- [x] **8.0 Frontend: Related Opportunities and Partners Tabs**
  > Implement Related Opportunities and Related Partners tabs.

  - [x] 8.1 Create `office-opportunities-tab` component
    - Call OfficeService.getRelatedOpportunities(id, request)
    - List with search, pagination
    - Columns: Opportunity, Stage, Partner, Value, Target Signing
    - Link to opportunity detail
  - [x] 8.2 Create `office-partners-tab` component
    - Call OfficeService.getRelatedPartners(id, request)
    - List with search, pagination
    - Link to partner detail
  - [x] 8.3 Add translation keys
  - [x] 8.4 Review implementation against mockups

- [x] **9.0 Frontend: Documents Tab**
  > Implement Documents tab (or stub).

  - [x] 9.1 Create `office-documents-tab` component
    - Use existing document list component if available (EntityArtifact for Office)
    - Or stub with "Documents will be displayed here"
  - [x] 9.2 Add translation keys

- [x] **10.0 Frontend: Routing and Navigation**
  > Wire Office routes and sidebar.

  - [x] 10.1 Create `office-management.routes.ts`
    - Path: '' → Office list
    - Path: ':id' → Office detail with child routes for tabs
  - [x] 10.2 Update `admin.routes.ts`: replace `office-management` ComingSoon with loadChildren for office-management routes
  - [x] 10.3 Verify sidebar "Manage my Office" or "Offices" links to `/admin/office-management`
  - [x] 10.4 Add breadcrumbs for Office list and Office detail
  - [x] 10.5 Review implementation: verify matches FR-8

- [x] **11.0 Frontend: i18n — Translation Keys**
  > Add all Office UI translation keys to language files.

  - [x] 11.1 Add Office keys to `en.json`
    - office.list.*, office.detail.*, office.rolesDoa.*, office.details.*, office.financial.*, office.scope.*, office.opportunities.*, office.partners.*, office.documents.*
  - [x] 11.2 Add same keys to `fr.json`, `es.json`, `pt.json` (translate or copy for placeholder)
  - [x] 11.3 Verify all components use `| translate` for user-facing text
  - [x] 11.4 Review implementation: verify matches FR-9

- [x] **12.0 Integration & Verification**
  > End-to-end verification of Office frontend.

  - [x] 12.1 Build Angular app: `ng build` (no errors)
  - [x] 12.2 Run ESLint on all new/modified files
  - [x] 12.3 Navigate to Office list; verify data loads
  - [x] 12.4 Navigate to Office detail; verify tabs work
  - [x] 12.5 Open Roles & DoA tab; verify Operational Roles and DoA Holders tables display
  - [x] 12.6 Verify empty holders show "Not assigned" / "—"
  - [x] 12.7 Verify translation switching works
  - [x] 12.8 Document any open questions or follow-ups

---

## Notes

- **Backend dependency:** Office API must be deployed and returning OperationalRoles and DoAHolders in OfficeDetailModel
- **Source column (Direct/Inherited):** Omit from DoA table if backend does not provide; add when backend supports
- **Last synced date:** Stub with "—" or omit if backend does not provide
- **Operational role ordering:** Backend returns roles as synced; frontend may sort by RoleName for consistent display
- **DoA ordering:** Backend returns per DoATypeRegistry; frontend displays as-is
