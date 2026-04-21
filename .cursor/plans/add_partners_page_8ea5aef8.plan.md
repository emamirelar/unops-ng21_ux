---
name: Add Partners Page
overview: Add a new "Partners" page under the Partnerships section at `/apps/partners`, using PrimeNG DataView to display a list of partners with mock data, following the existing project conventions.
todos:
  - id: create-partner-type
    content: Create `src/app/types/partner.ts` with the Partner interface
    status: pending
  - id: create-partner-service
    content: Create `src/app/apps/partners/partner.service.ts` with mock data and HttpClient-ready structure
    status: pending
  - id: create-partners-component
    content: Create `src/app/apps/partners/partners.ts` with DataView displaying list/grid of partners
    status: pending
  - id: create-barrel-export
    content: Create `src/app/apps/partners/index.ts` barrel export
    status: pending
  - id: add-route
    content: Add partners route to `src/app/apps/apps.routes.ts`
    status: pending
  - id: add-menu-item
    content: Add Partners menu item to `src/app/layout/components/app.menu.ts` under Partnerships
    status: pending
isProject: false
---

# Add Partners Page to Partnerships Section

## Architecture

The "Partnerships" section lives under `src/app/apps/` with routes defined in [`src/app/apps/apps.routes.ts`](src/app/apps/apps.routes.ts). The new Partners page will follow the same standalone component pattern used by Opportunity and other features.

```mermaid
flowchart LR
  Menu["Sidebar Menu"] -->|"/apps/partners"| Route["apps.routes.ts"]
  Route -->|"lazy load"| Component["Partners Component"]
  Component -->|"injects"| Service["PartnerService"]
  Service -->|"mock data now, API later"| Data["Partner[]"]
  Component -->|"renders"| DataView["p-dataview"]
```

## Files to Create

- **`src/app/types/partner.ts`** -- `Partner` interface with fields: `id`, `name`, `country`, `type`, `status`, etc. Follows the pattern of existing types like [`src/app/types/member.ts`](src/app/types/member.ts).

- **`src/app/apps/partners/partner.service.ts`** -- Injectable service with a `getPartners()` method. Returns mock data for now; the real endpoint will be `https://localhost:44426/partnerships/partners`. Uses `HttpClient` ready to swap in the real API call.

- **`src/app/apps/partners/partners.ts`** -- Standalone component using PrimeNG `DataViewModule`. Follows the DataView pattern from [`src/app/pages/uikit/listdemo.ts`](src/app/pages/uikit/listdemo.ts) but adapted for partner data. Supports both list and grid layouts. Uses `ChangeDetectionStrategy.OnPush` and signals.

- **`src/app/apps/partners/index.ts`** -- Barrel export (matches pattern in [`src/app/apps/opportunity/index.ts`](src/app/apps/opportunity/index.ts)).

## Files to Modify

- **[`src/app/apps/apps.routes.ts`](src/app/apps/apps.routes.ts)** -- Add a new lazy-loaded route:

```typescript
{
    path: 'partners',
    loadComponent: () => import('./partners').then((c) => c.Partners),
    data: { breadcrumb: 'Partners' }
}
```

- **[`src/app/layout/components/app.menu.ts`](src/app/layout/components/app.menu.ts)** -- Add a "Partners" menu item under the Partnerships section:

```typescript
{
    label: 'Partners',
    icon: 'pi pi-fw pi-building',
    routerLink: ['/apps/partners']
}
```

## Component Design (Partners)

- Page header with title "Partners" and a layout toggle (list/grid via `p-select-button`)
- **List layout**: Each partner card shows name, country, type, and status tag in a horizontal row
- **Grid layout**: Card-based view with partner details stacked vertically
- Status tags use PrimeNG `p-tag` with severity mapped from partner status (Active = success, Inactive = danger, etc.)
- Each partner card includes a "View" button that will eventually navigate to the detail page at `/apps/partners/:id`
- Mock data will include ~8-10 sample partners with realistic names, countries, and statuses
