---
name: "Opportunity Detail: Four remaining fixes"
overview: "Fix four remaining UI issues on the team's Opportunity Detail page: (1) slim down sticky header by moving workflow/validation into header-meta, (2) remove duplicate Analysis section from Overview tab, (3) restyle sidebar Documents as collapsible card, (4) remove Tasks button/drawer."
todos:
  - id: fix-header-workflow
    content: "Move stage workflow, requirements-validation, decision panels, progress strip out of ux-detail-header into ux-detail-header-meta so sticky header shows only title row"
    status: pending
  - id: remove-analysis-from-overview
    content: "Remove app-opportunity-analysis-section from Overview tab (lines 147-165 in HTML); keep ux-ai-insights-card in sidebar only. Remove TS import/ViewChild if unused elsewhere."
    status: pending
  - id: fix-documents-sidebar
    content: "Restyle sidebar Documents as collapsible card matching ux-ai-insights-card visual pattern (icon + title + count + chevron header, expand-body toggle)"
    status: pending
  - id: remove-tasks
    content: "Remove sidebar Open Tasks p-button (lines 502-509), p-drawer (lines 514-525), and taskDrawerVisible signal from TS (line 772)"
    status: pending
  - id: verify-build
    content: "Visual check on opportunity detail page, npm run build:dev, dotnet build"
    status: pending
isProject: false
---

# Opportunity Detail: Four remaining fixes

Four UI issues remain on the team's Opportunity Detail page after the previous content-restructure prompts were applied.

**Target repo:** UNOPS-ITG/opportunityplus (branch from `dev-deploy` or current active branch)
**Reference demo:** `unops-ng21_ux` → `src/app/apps/opportunity/opportunity.ts`

**Primary files:**

| File | Purpose |
|------|---------|
| `.../view/opportunity-view.component.html` | Layout, tabs, sidebar |
| `.../view/opportunity-view.component.ts` | Signals, imports, ViewChild cleanup |

Full path prefix: `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/`

---

## Fix 1: Header — move workflow out of sticky area

**Problem:** `app-stage-workflow`, `app-requirements-validation`, decision `p-message`, `app-opportunity-decision-info-panel`, and loading progress strip all sit inside `<div ux-detail-header>` (lines 20-140), making the sticky header bloated with a "Current Stage" section under the title.

**Fix:** Keep **only** the title row (lines 20-62) inside `ux-detail-header`:
- `h1` + stage/status `p-tag`s + opportunity id `span`
- OUP `p-button` (conditional)

Move everything from line 64 to line 139 (requirements-validation, decision guidance, decision-info-panel, stage-workflow, progress-strip) into `<div ux-detail-header-meta>` which is currently empty (line 141). These elements will scroll away naturally instead of sticking.

**Result structure:**

```html
<div ux-detail-header class="flex flex-col gap-3 py-4">
    <!-- Title row only: h1 + tags + id + OUP button -->
</div>

<div ux-detail-header-meta>
    <!-- Requirements validation (conditional) -->
    <!-- Decision guidance p-message (conditional) -->
    <!-- Decision info panel (conditional) -->
    <!-- Stage workflow -->
    <!-- Progress strip (conditional) -->
</div>
```

**Keep ALL existing inputs, outputs, event handlers, template refs** — only relocate the markup.

---

## Fix 2: Remove analysis section from Overview tab

**Problem:** `app-opportunity-analysis-section` in the Overview tab (lines 147-165) duplicates the AI insights already shown by `ux-ai-insights-card` in the sidebar.

**Fix in HTML:** Remove entire `#section-analysis` div from `<ng-template uxDetailTab="overview">`. Keep only `#section-overview` with `app-opportunity-overview-section`.

**Fix in TS:** Remove these if nothing else references them:
- Import: `import { OpportunityAnalysisSectionComponent } from './sections/analysis/...'` (line 75)
- From `imports` array: `OpportunityAnalysisSectionComponent` (line 132)
- ViewChild: `@ViewChild(OpportunityAnalysisSectionComponent) analysisSectionComponent` (lines 363-364)

**Note:** `allInsights()`, `allSuggestions()`, `insightsLoading()`, etc. may still be used by the sidebar `ux-ai-insights-card` or mapped to `aiInsights()` — keep those signals. Only remove the component import/ViewChild.

---

## Fix 3: Restyle sidebar Documents as collapsible card

**Problem:** `app-opportunity-documents` is wrapped in a plain `div.card` — doesn't match the `ux-ai-insights-card` visual pattern above it.

**Note:** The demo's `app-documents-card` component lives in the demo app (`unops-ng21_ux/src/app/apps/documents/documents-card.ts`), NOT published from `@emamirelar/ux/components`. Cannot import it directly — replicate the collapsible card wrapper pattern instead.

**Fix in HTML:** Replace sidebar documents block (lines 488-500) with:

```html
<div class="card flex flex-col overflow-hidden" id="section-documents">
    <div
        class="flex cursor-pointer items-center justify-between gap-2 px-4 py-3"
        (click)="documentsExpanded.set(!documentsExpanded())"
    >
        <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0">
                <i class="pi pi-folder text-deepsea-500 dark:text-surface-0"></i>
            </div>
            <div class="flex flex-col">
                <span class="title-h4 text-left text-deepsea-500 dark:text-surface-0">
                    {{ 'label.documents' | translate }}
                </span>
                <span class="text-surface-500 dark:text-surface-300 text-sm font-medium leading-tight">
                    {{ documentsComponent.documentCount() }} {{ 'label.filesAttached' | translate }}
                </span>
            </div>
        </div>
        <i
            class="pi text-sm text-surface-400 shrink-0"
            [class.pi-chevron-down]="!documentsExpanded()"
            [class.pi-chevron-up]="documentsExpanded()"
        ></i>
    </div>
    <div class="expand-body" [class.expand-body--open]="documentsExpanded()">
        <div class="expand-body__inner">
            <div class="px-4 pb-4">
                <app-opportunity-documents
                    #documentsComponent
                    [opportunityId]="opportunity()!.id!"
                    [opportunity]="opportunity()"
                    [embedInPage]="true"
                    [collapsed]="false"
                    [canUpdate]="canUpdate()"
                    (togglePanel)="toggleDocumentsPanel()"
                    (opportunityUpdated)="handleDocumentUploaded()"
                />
            </div>
        </div>
    </div>
</div>
```

**Fix in TS:** Add one signal:

```typescript
documentsExpanded = signal(false);
```

The child `app-opportunity-documents` already has its own `documentCount` computed (defined in its TS at line 531). We reference it via the template ref `documentsComponent.documentCount()`.

The `expand-body` / `expand-body--open` CSS classes are globally available (from `styles.scss`).

---

## Fix 4: Remove Tasks button and drawer

**Problem:** Sidebar has a `p-button` "Open Tasks" and a `p-drawer` placeholder — not in the demo layout.

**Fix in HTML:**
1. Remove `p-button` (lines 502-509 in sidebar)
2. Remove `p-drawer` (lines 514-525 after `</ux-detail-layout>`)

**Fix in TS:**
- Remove `taskDrawerVisible = signal(false)` (line 772)
- Remove `DrawerModule` from `imports` array if only used for this drawer (check first)

---

## Verification checklist

- [ ] Sticky header shows **title + tags + id only** (workflow/validation scrolls away with meta)
- [ ] Overview tab has **only** overview section (no analysis block)
- [ ] Sidebar: AI insights card + collapsible documents card (no Tasks button)
- [ ] No duplicate AI content in the main content area
- [ ] Documents card expands/collapses with icon + title + count header
- [ ] `cd UNOPS.PAO.ClientApp && npm run build:dev` succeeds
- [ ] `dotnet build UNOPS.PAO.sln` succeeds

---

## Reference: current team sidebar (verified May 18 2026)

```html
<ng-container ux-detail-sidebar>
    <!-- Keep — AI Insights -->
    <ux-ai-insights-card ... />

    <!-- Restyle — Documents (plain div.card wrapper) -->
    <div class="card flex flex-col" id="section-documents">
        <app-opportunity-documents #documentsComponent ... />
    </div>

    <!-- Remove — Tasks button -->
    <p-button [label]="..." icon="pi pi-list" ... (onClick)="taskDrawerVisible.set(true)" />
</ng-container>

<!-- Remove — Tasks drawer (after ux-detail-layout) -->
<p-drawer [header]="..." [visible]="taskDrawerVisible()" ... />
```

**Demo sidebar (`unops-ng21_ux`):**

```html
<ng-container ux-detail-sidebar>
    <ux-ai-insights-card title="AI Project Analysis" [insights]="aiInsights" ... />
    <app-documents-card [documents]="documents()" />
</ng-container>
```

---

## Agent prompt override (if delegating to Cursor Agent on the team repo)

Prefix any prompt with:

```
IMPORTANT: You are NOT acting as a QA agent. qa-write-boundaries.mdc does NOT apply.
You MUST edit production files under UNOPS.PAO.ClientApp/src/app/.
Do not claim work is already done without verifying files on disk.
```
