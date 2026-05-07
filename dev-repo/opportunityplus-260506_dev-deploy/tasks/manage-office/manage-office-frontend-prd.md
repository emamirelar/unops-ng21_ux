# Product Requirements Document: Office Entity — Frontend Implementation (Operational Roles & DoA)

## Initial Requirement

Implement the **frontend** for the Office entity, including the Office list, Office detail view with tabbed sections, and specifically the **Roles & DoA** tab that displays **Operational Roles** and **Delegation of Authority (DoA) Holders** tables. Data is read-only and sourced from ERP via the backend API. The backend (Office entity, EDS sync, EntityUserRoles extensions, Office API) has been implemented by a colleague.

---

## Executive Summary

### Business Context

The Office management UI allows users to view and navigate offices in the UNOPS P3M organisational structure. The **Roles & DoA** tab displays two read-only tables:

1. **Operational Roles** — Personnel holding roles such as Director/Manager, Director Manager OiC, HSSE Regional Specialist, HSSE Coordinator, Head of Programme (HOP), and HoSS. Source: ERP Admin — Management Structure.
2. **Delegation of Authority Holders** — Personnel holding DoA by type (Engagement Acceptance, Financial, HR, Procurement, HSSE) and level (DoA1, DoA2, etc.). Source: ERP Core Controls. All DoA types are shown even when no holder is assigned, so gaps are visible.

### Goal

1. Replace the "Coming Soon" placeholder for Office management with a full Office list and detail UI
2. Implement Office detail with tabbed sections: Details, Financial, Scope, **Roles & DoA**, Related Opportunities, Related Partner Accounts, Documents
3. Implement the **Roles & DoA** tab with Operational Roles and DoA Holders tables per mockups
4. Create Angular services to fetch Office data from the backend API
5. Ensure all user-facing text uses translation keys (i18n)

---

## PRD

### 1. Introduction/Overview

**Reference Mockups:** `tasks/manage-office/mockups/all-mockups.html`

**Office List (Screen 2):**
- Paginated list of offices with search
- Columns: Office name, Code, Type, Parent, Status
- Click row to navigate to Office detail

**Office Detail (Screens 3–9):**
- Page header: Office name, badges (type, status, level, scope), meta (ID, code, Regional Director, Effective date)
- Tabs: Details | Financial | Scope | **Roles & DoA** | Related Opportunities | Related Partner Accounts | Documents
- Each tab shows relevant content

**Roles & DoA Tab (Screen 6) — Primary Focus:**

**Operational Roles Table:**
| Column | Description |
|--------|-------------|
| Role | Role name (e.g., Director / Manager, HSSE Coordinator) |
| Personnel | Holder name or "Not assigned" |
| Position Title | Position title or empty |
| Org Unit Works At | Org unit code/name or empty |
| Status | "Active" badge or empty |

- Card header: "Operational Roles" with groups icon; badge "Read-only · Source: ERP"
- Card footer: "Source: ERP Admin — Management Structure · Last synced: [date]"
- Rows with no holder: Personnel, Position Title, Org Unit Works At show "Not assigned" (italic, muted)

**Delegation of Authority Holders Table:**
| Column | Description |
|--------|-------------|
| DoA Type | Engagement Acceptance, Financial, HR, Procurement, HSSE |
| Level | DoA1, DoA2, etc. (badge) or "—" if unassigned |
| Role Holder | Holder name, "OiC: [name]" (warning style), or "Not assigned" |
| Applicability Period | "Jan 1, 2026 — Dec 31, 2026" or "—" |
| Conditions | Conditions text or "—" |
| Source | "Direct" or "Inherited" badge (optional; backend may not provide—see Open Questions) |

- Info callout: "All DoA types are shown. If no holder is currently assigned, the row appears with an empty holder — making gaps immediately visible."
- Card header: "Delegation of Authority Holders" with verified_user icon; badge "Read-only · Source: ERP"
- Card footer: "Source: ERP Core Controls · Last synced: [date]"
- Rows with no holder: Level, Role Holder, Applicability Period, Conditions show "—" or "Not assigned"

**Problem Statement:** The Office management route (`/admin/office-management`) currently shows a "Coming Soon" placeholder. Users cannot view offices, navigate to office detail, or see Operational Roles and DoA Holders.

**Solution:** Implement Office list, Office detail with tabs, Office service to call backend API, and the Roles & DoA tab with Operational Roles and DoA Holders tables per mockups.

---

### 2. Backend API Contract (Pre-Implemented)

The backend provides these endpoints (already implemented):

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/office | List offices (paginated) |
| GET | /api/office/search?query= | Search offices |
| GET | /api/office/tree | Office hierarchy tree |
| GET | /api/office/{id} | Office detail |
| GET | /api/office/{id}/permissions | Permission flags |
| GET | /api/office/{id}/opportunities | Related opportunities |
| GET | /api/office/{id}/partners | Related partners |

**OfficeDetailModel** (GET /api/office/{id}) includes:
- `OperationalRoles`: `{ RoleName, HolderName?, PositionTitle?, OrgUnitWorksAt?, IsActive }[]`
- `DoAHolders`: `{ DoAType, DoALevel, RoleHolder?, ApplicabilityPeriodStart?, ApplicabilityPeriodEnd?, Conditions?, IsActive }[]`

**Note:** Backend does not currently return "Source" (Direct/Inherited) for DoA Holders or "Last synced" date. These may be stubbed or omitted until backend support is added.

---

### 3. Goals

1. **Office Service** — Angular service to call Office API endpoints
2. **Office Models** — TypeScript interfaces matching backend DTOs
3. **Office List** — List view with search, pagination, navigation to detail
4. **Office Detail** — Detail view with tabs, page header, key info
5. **Roles & DoA Tab** — Operational Roles table and DoA Holders table per mockups
6. **Other Tabs** — Details, Financial, Scope, Related Opportunities, Related Partners, Documents (stubbed or full per scope)
7. **Routing** — Replace ComingSoon with Office routes
8. **i18n** — Add translation keys for all Office UI text

---

### 4. Architecture

#### 4.1 Angular Module Structure

```
UNOPS.PAO.ClientApp/src/app/features/admin/
├── office-management/                    NEW
│   ├── office-management.routes.ts      NEW
│   ├── components/
│   │   ├── office-list/                  NEW — Office list view
│   │   │   ├── office-list.component.ts
│   │   │   ├── office-list.component.html
│   │   │   └── office-list.component.scss
│   │   │
│   │   ├── office-detail/                NEW — Office detail container
│   │   │   ├── office-detail.component.ts
│   │   │   ├── office-detail.component.html
│   │   │   └── office-detail.component.scss
│   │   │
│   │   ├── office-detail-tabs/           NEW — Tab content router
│   │   │   ├── office-detail-tabs.component.ts
│   │   │   ├── office-detail-tabs.component.html
│   │   │   └── office-detail-tabs.component.scss
│   │   │
│   │   ├── office-roles-doa/             NEW — Roles & DoA tab content
│   │   │   ├── office-roles-doa.component.ts
│   │   │   ├── office-roles-doa.component.html
│   │   │   └── office-roles-doa.component.scss
│   │   │
│   │   ├── office-operational-roles-table/   NEW — Operational Roles table
│   │   │   ├── office-operational-roles-table.component.ts
│   │   │   ├── office-operational-roles-table.component.html
│   │   │   └── office-operational-roles-table.component.scss
│   │   │
│   │   ├── office-doa-holders-table/         NEW — DoA Holders table
│   │   │   ├── office-doa-holders-table.component.ts
│   │   │   ├── office-doa-holders-table.component.html
│   │   │   └── office-doa-holders-table.component.scss
│   │   │
│   │   ├── office-details-tab/           NEW — Details tab
│   │   ├── office-financial-tab/         NEW — Financial tab
│   │   ├── office-scope-tab/             NEW — Scope tab
│   │   ├── office-opportunities-tab/     NEW — Related Opportunities tab
│   │   ├── office-partners-tab/          NEW — Related Partners tab
│   │   └── office-documents-tab/          NEW — Documents tab
│   │
│   ├── models/
│   │   └── office.model.ts               NEW — Office interfaces
│   │
│   └── services/
│       └── office.service.ts             NEW — HTTP client for Office API
```

#### 4.2 Data Flow

```
OfficeService (Angular)
    │
    ├── getOffices() → GET /api/office
    ├── searchOffices() → GET /api/office/search
    ├── getOfficeTree() → GET /api/office/tree
    ├── getOfficeDetail(id) → GET /api/office/{id}
    ├── getOfficePermissions(id) → GET /api/office/{id}/permissions
    ├── getRelatedOpportunities(id) → GET /api/office/{id}/opportunities
    └── getRelatedPartners(id) → GET /api/office/{id}/partners

OfficeDetailComponent
    │
    └── resolve/load office detail
        │
        └── office-detail-tabs (router-outlet or tab content)
            │
            ├── office-details-tab
            ├── office-financial-tab
            ├── office-scope-tab
            ├── office-roles-doa  ← OperationalRoles, DoAHolders from detail
            │   ├── office-operational-roles-table [operationalRoles]
            │   └── office-doa-holders-table [doaHolders]
            ├── office-opportunities-tab
            ├── office-partners-tab
            └── office-documents-tab
```

---

### 5. User Stories

#### US-1: View Office List
**As a** user with Office read access  
**I want to** see a paginated list of offices with search  
**So that** I can browse and find offices

**Acceptance Criteria:**
- Office list displays with columns: Name, Code, Type, Parent, Status
- Search filters offices by name/code
- Pagination works
- Click row navigates to Office detail

#### US-2: View Office Detail
**As a** user with Office read access  
**I want to** view full office details in a tabbed layout  
**So that** I can see Key Information, Financial, Scope, Roles & DoA, Related entities, Documents

**Acceptance Criteria:**
- Page header shows office name, badges, meta
- Tabs: Details, Financial, Scope, Roles & DoA, Related Opportunities, Related Partner Accounts, Documents
- Tab content loads when tab is selected
- Back to Offices link works

#### US-3: View Operational Roles
**As a** user viewing an Office  
**I want to** see the Operational Roles table in the Roles & DoA tab  
**So that** I know who holds each role

**Acceptance Criteria:**
- Table columns: Role, Personnel, Position Title, Org Unit Works At, Status
- All 7 role types shown (Director/Manager, OiC, HSSE Regional Specialist, HSSE Regional Specialist OiC, HSSE Coordinator, HOP, HoSS)
- Rows with no holder show "Not assigned" (italic, muted)
- Status shows "Active" badge when IsActive
- Read-only badge; Source footer (ERP Admin — Management Structure)

#### US-4: View DoA Holders
**As a** user viewing an Office  
**I want to** see the DoA Holders table in the Roles & DoA tab  
**So that** I know who holds each DoA and can spot gaps

**Acceptance Criteria:**
- Table columns: DoA Type, Level, Role Holder, Applicability Period, Conditions, (Source if available)
- All DoA types shown; rows with no holder show "Not assigned" or "—"
- Info callout: "All DoA types are shown. If no holder is currently assigned..."
- Applicability Period formatted as "Jan 1, 2026 — Dec 31, 2026"
- Read-only badge; Source footer (ERP Core Controls)

#### US-5: View Related Opportunities and Partners
**As a** user viewing an Office  
**I want to** see related opportunities and partners in their tabs  
**So that** I understand which opportunities and partners this office influences

**Acceptance Criteria:**
- Related Opportunities tab: list with search, pagination, link to opportunity detail
- Related Partner Accounts tab: list with search, pagination, link to partner detail
- Tab counts shown in tab labels (e.g., "Related Opportunities 47")

---

### 6. Functional Requirements

#### FR-1: Office Service

| Req | Description |
|-----|-------------|
| FR-1.1 | Create `OfficeService` in `features/admin/office-management/services/` |
| FR-1.2 | Methods: `getOffices()`, `searchOffices()`, `getOfficeTree()`, `getOfficeDetail(id)`, `getOfficePermissions(id)`, `getRelatedOpportunities(id, request)`, `getRelatedPartners(id, request)` |
| FR-1.3 | Use HttpClient; inject base URL from environment/config |
| FR-1.4 | Return Observables; handle errors via global HTTP interceptor |
| FR-1.5 | Use signals for loading state where appropriate |

#### FR-2: Office Models

| Req | Description |
|-----|-------------|
| FR-2.1 | Create `office.model.ts` with interfaces: `OfficeListModel`, `OfficeDetailModel`, `OfficeOperationalRoleModel`, `OfficeDoAHolderModel`, `OfficeKeyInformationModel`, etc. |
| FR-2.2 | Match backend DTO structure |
| FR-2.3 | Use optional fields for nullable properties |

#### FR-3: Office List

| Req | Description |
|-----|-------------|
| FR-3.1 | Create `office-list` component |
| FR-3.2 | Use PrimeNG Table (p-table) or equivalent for list |
| FR-3.3 | Search input; debounce on search |
| FR-3.4 | Pagination |
| FR-3.5 | Row click navigates to `/admin/office-management/{id}` |

#### FR-4: Office Detail

| Req | Description |
|-----|-------------|
| FR-4.1 | Create `office-detail` component; resolve office by id from route |
| FR-4.2 | Page header: name, badges (type, status, level, scope), meta (ID, code, Regional Director, Effective date) |
| FR-4.3 | Tabs: use PrimeNG Tabs or custom tab component |
| FR-4.4 | Tab content: router-outlet with child routes or ngSwitch |
| FR-4.5 | "Back to Offices" link |

#### FR-5: Roles & DoA Tab

| Req | Description |
|-----|-------------|
| FR-5.1 | Create `office-roles-doa` component |
| FR-5.2 | Two cards: Operational Roles, Delegation of Authority Holders |
| FR-5.3 | Operational Roles: use `office-operational-roles-table` with `operationalRoles` input |
| FR-5.4 | DoA Holders: use `office-doa-holders-table` with `doaHolders` input |
| FR-5.5 | DoA info callout above table |
| FR-5.6 | Read-only badge on each card |
| FR-5.7 | Source footer on each card (Last synced: stub or from API if available) |

#### FR-6: Operational Roles Table

| Req | Description |
|-----|-------------|
| FR-6.1 | Create `office-operational-roles-table` component |
| FR-6.2 | Input: `operationalRoles: OfficeOperationalRoleModel[]` |
| FR-6.3 | Columns: Role, Personnel, Position Title, Org Unit Works At, Status |
| FR-6.4 | Empty holder: show "Not assigned" (italic, muted) for Personnel; colspan for Position Title, Org Unit Works At |
| FR-6.5 | Status: "Active" badge when IsActive; empty otherwise |
| FR-6.6 | Use PrimeNG Table or native table with Tailwind classes |

#### FR-7: DoA Holders Table

| Req | Description |
|-----|-------------|
| FR-7.1 | Create `office-doa-holders-table` component |
| FR-7.2 | Input: `doaHolders: OfficeDoAHolderModel[]` |
| FR-7.3 | Columns: DoA Type, Level, Role Holder, Applicability Period, Conditions, (Source if available) |
| FR-7.4 | Empty holder: Level "—", Role Holder "Not assigned", Period "—", Conditions "—" |
| FR-7.5 | Level: badge (primary/secondary) when assigned |
| FR-7.6 | Applicability Period: format dates as "MMM d, yyyy — MMM d, yyyy" |
| FR-7.7 | OiC handling: if backend supports OiC indicator, show "OiC: [name]" with warning style |

#### FR-8: Routing

| Req | Description |
|-----|-------------|
| FR-8.1 | Replace `office-management` route with Office list and detail routes |
| FR-8.2 | `/admin/office-management` → Office list |
| FR-8.3 | `/admin/office-management/:id` → Office detail with tabs |
| FR-8.4 | `/admin/office-management/:id/roles-doa` or tab param for Roles & DoA |

#### FR-9: i18n

| Req | Description |
|-----|-------------|
| FR-9.1 | All user-facing text uses translation keys |
| FR-9.2 | Add keys to en.json, fr.json, es.json, pt.json |
| FR-9.3 | Keys: office.list.title, office.detail.title, office.rolesDoa.operationalRoles, office.rolesDoa.doaHolders, office.rolesDoa.readOnly, office.rolesDoa.source, office.rolesDoa.notAssigned, etc. |

---

### 7. Non-Goals

- Editing Operational Roles or DoA (read-only from ERP)
- Office CRUD (Office is sync-managed)
- "Source" (Direct/Inherited) for DoA Holders if backend does not provide it
- "Last synced" date if backend does not provide it
- Workflow Configuration editing (Phase 2)

---

### 8. UI/UX Specifications (from Mockups)

#### 8.1 Card Styling

- Card: `unops-card` with `unops-card-header`, `unops-card-body`, `unops-card-footer`
- Header: `unops-card-title` with icon (Material Symbols: groups, verified_user)
- Badge: `badge badge-neutral` with lock icon for "Read-only · Source: ERP"
- Footer: `text-sm text-muted` with info icon

#### 8.2 Table Styling

- `data-table` class
- Headers: bold
- Empty cells: `color: var(--unops-neutral-400); font-style: italic`
- Status badges: `badge badge-success` for Active
- Level badges: `badge badge-primary` or `badge badge-secondary` for DoA

#### 8.3 Info Callout

- `info-callout` with info icon
- "All DoA types are shown. If no holder is currently assigned, the row appears with an empty holder — making gaps immediately visible."

#### 8.4 Tailwind-First

- Use Tailwind classes per component-development.mdc
- Minimal SCSS for complex patterns only

---

### 9. Data Models (TypeScript)

```typescript
// office.model.ts

export interface OfficeOperationalRoleModel {
  roleName: string;
  holderName?: string | null;
  positionTitle?: string | null;
  orgUnitWorksAt?: string | null;
  isActive: boolean;
}

export interface OfficeDoAHolderModel {
  doAType: string;
  doALevel: string;
  roleHolder?: string | null;
  applicabilityPeriodStart?: string | null;  // ISO date
  applicabilityPeriodEnd?: string | null;    // ISO date
  conditions?: string | null;
  isActive: boolean;
}

export interface OfficeDetailModel {
  id: number;
  code: string;
  name: string;
  organizationHierarchyId?: number | null;
  keyInformation?: OfficeKeyInformationModel;
  financialInformation?: OfficeFinancialInformationModel;
  scope?: OfficeScopeModel;
  operationalRoles: OfficeOperationalRoleModel[];
  doAHolders: OfficeDoAHolderModel[];
  parentChain: OfficeHierarchyNodeModel[];
  children: OfficeTreeNodeModel[];
  permissions?: OfficePermissionsModel;
}
```

---

### 10. Open Questions

1. **DoA Source column:** Mockup shows "Direct" / "Inherited". Backend does not provide this. Omit or stub until backend support?
2. **Last synced date:** Backend does not provide. Omit or use static "Last synced: —"?
3. **OiC indicator:** Backend does not distinguish OiC in RoleHolder. Use plain RoleHolder text until backend supports?
4. **Operational role types:** Backend returns all roles from EntityUserRole; frontend displays as-is. Ensure all 7 role types appear (backend may return subset if not synced).

---

### 11. Success Metrics

- Office list loads and displays offices
- Office detail loads with tabs
- Roles & DoA tab displays Operational Roles and DoA Holders tables
- Empty holders show "Not assigned" / "—"
- All text uses translation keys
- No console errors; responsive layout

---

## Appendix A: Mockup Reference

| Screen | Mockup Section ID | Description |
|--------|-------------------|-------------|
| Office List | `office-list` | Paginated list with search |
| Office Detail | `office-detail` | Key info, tabs |
| Roles & DoA | `office-detail-roles-doa` | Operational Roles + DoA Holders tables
| Related Opportunities | `office-detail-opportunities` | Related opportunities list |
| Related Partners | `office-detail-partners` | Related partners list |

---

## Appendix B: Translation Keys (Partial)

| Key | English |
|-----|---------|
| office.list.title | Offices |
| office.detail.title | Office Detail |
| office.rolesDoa.operationalRoles | Operational Roles |
| office.rolesDoa.doaHolders | Delegation of Authority Holders |
| office.rolesDoa.readOnly | Read-only · Source: ERP |
| office.rolesDoa.sourceMgmt | Source: ERP Admin — Management Structure |
| office.rolesDoa.sourceCoreControls | Source: ERP Core Controls |
| office.rolesDoa.notAssigned | Not assigned |
| office.rolesDoa.infoCallout | All DoA types are shown. If no holder is currently assigned, the row appears with an empty holder — making gaps immediately visible. |
| office.rolesDoa.role | Role |
| office.rolesDoa.personnel | Personnel |
| office.rolesDoa.positionTitle | Position Title |
| office.rolesDoa.orgUnitWorksAt | Org Unit Works At |
| office.rolesDoa.status | Status |
| office.rolesDoa.doaType | DoA Type |
| office.rolesDoa.level | Level |
| office.rolesDoa.roleHolder | Role Holder |
| office.rolesDoa.applicabilityPeriod | Applicability Period |
| office.rolesDoa.conditions | Conditions |
| office.rolesDoa.active | Active |
