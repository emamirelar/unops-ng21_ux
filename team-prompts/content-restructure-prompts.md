# Content Restructure Prompts

> **Prerequisite**: Before running any prompt below, ensure `qa-write-boundaries.mdc` has been fixed:
> change `alwaysApply: true` to `alwaysApply: false` and add `globs: ["QA Tests/**", "**/qa-frontend-tests/**"]`.

---

## Prompt 1 — Add pill-tabs sub-navigation to Scope and Stakeholders tabs

```
IMPORTANT: You are NOT acting as a QA agent. You are a senior Angular developer.
The rule "qa-write-boundaries.mdc" does NOT apply to this task. You MUST write
to production files. Do NOT skip edits or claim they are already done.

## Task

Add `ux-pill-tabs` sub-navigation to the Scope and Stakeholders tabs so that
each sub-section renders one at a time instead of stacking vertically.

## Files to modify

1. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/opportunity-view.component.ts`
2. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/opportunity-view.component.html`

## Step 1 — TypeScript changes (opportunity-view.component.ts)

### 1a. Add import

Add `PillTabsComponent` to the existing import from `@emamirelar/ux/components`:

```typescript
import { PillTabsComponent, PillTabItem } from '@emamirelar/ux/components';
```

If an import from `@emamirelar/ux/components` does not already exist, add this new
import line. If `DetailLayoutComponent`, `DetailTabDirective` etc. are imported from
`@unopsitg/ux`, that is fine — `PillTabsComponent` comes from a different path.

### 1b. Add to imports array

Add `PillTabsComponent` to the `@Component({ imports: [...] })` array.

### 1c. Add signals and tab definitions

Add these properties to the class body, near the `detailTabs` / `activeTab` definitions:

```typescript
// ─── Sub-tab Navigation ───
activeScopeSub = signal('what');
activeStakeholderSub = signal('partners');

scopeSubTabs: PillTabItem[] = [
  { value: 'what', label: 'What' },
  { value: 'when', label: 'When' },
  { value: 'where', label: 'Where' },
];

stakeholderSubTabs: PillTabItem[] = [
  { value: 'partners', label: 'Partners' },
  { value: 'why', label: 'Why' },
  { value: 'team', label: 'Team' },
];
```

## Step 2 — HTML changes (opportunity-view.component.html)

### 2a. Scope tab — add pill-tabs and conditionally show sections

Find the `<ng-template uxDetailTab="scope">` block. Currently it stacks three
section wrappers vertically. Restructure it to:

```html
<ng-template uxDetailTab="scope">
  <ux-pill-tabs [items]="scopeSubTabs" [(activeValue)]="activeScopeSub" />

  @if (activeScopeSub() === 'what') {
    <div
      class="opportunity-section-enter group relative section-hover-container"
      [class.section-editable]="canUpdate() && !sectionsWithUnsavedChanges().has('what')"
      (click)="handleSectionClick('what', $event)"
    >
      <app-opportunity-what-section
        #whatSection
        [opportunity]="opportunity()!"
        [canUpdate]="canUpdate()"
        [documentUploadTrigger]="documentUploadTrigger()"
        [sectionSaveTrigger]="sectionSaveTrigger()"
        (opportunityUpdated)="handleOpportunityUpdate($event)"
        (changesDetected)="handleSectionChangesDetected('what')"
        (changesSavedOrDiscarded)="handleSectionChangesSaved('what')"
      />
    </div>
  }

  @if (activeScopeSub() === 'when') {
    <div
      class="opportunity-section-enter group relative section-hover-container"
      [class.section-editable]="canUpdate() && !sectionsWithUnsavedChanges().has('when')"
      (click)="handleSectionClick('when', $event)"
    >
      <app-opportunity-when-section
        #whenSection
        [opportunity]="opportunity()!"
        [canUpdate]="canUpdate()"
        (opportunityUpdated)="handleOpportunityUpdate($event)"
        (changesDetected)="handleSectionChangesDetected('when')"
        (changesSavedOrDiscarded)="handleSectionChangesSaved('when')"
      />
    </div>
  }

  @if (activeScopeSub() === 'where') {
    <div
      class="opportunity-section-enter group relative section-hover-container"
      [class.section-editable]="canUpdate() && !sectionsWithUnsavedChanges().has('where')"
      (click)="handleSectionClick('where', $event)"
    >
      <app-opportunity-where-section
        #whereSection
        [opportunity]="opportunity()!"
        [canUpdate]="canUpdate()"
        (opportunityUpdated)="handleOpportunityUpdate($event)"
        (changesDetected)="handleSectionChangesDetected('where')"
        (changesSavedOrDiscarded)="handleSectionChangesSaved('where')"
      />
    </div>
  }
</ng-template>
```

### 2b. Stakeholders tab — same pattern

Find the `<ng-template uxDetailTab="stakeholders">` block. Restructure it to:

```html
<ng-template uxDetailTab="stakeholders">
  <ux-pill-tabs [items]="stakeholderSubTabs" [(activeValue)]="activeStakeholderSub" />

  @if (activeStakeholderSub() === 'partners') {
    <div
      class="opportunity-section-enter group relative section-hover-container"
      [class.section-editable]="canUpdate() && !sectionsWithUnsavedChanges().has('who')"
      (click)="handleSectionClick('who', $event)"
    >
      <app-opportunity-who-section
        #whoSection
        [opportunity]="opportunity()!"
        [canUpdate]="canUpdate()"
        (opportunityUpdated)="handleOpportunityUpdate($event)"
        (changesDetected)="handleSectionChangesDetected('who')"
        (changesSavedOrDiscarded)="handleSectionChangesSaved('who')"
      />
    </div>
  }

  @if (activeStakeholderSub() === 'why') {
    <div
      class="opportunity-section-enter group relative section-hover-container"
      [class.section-editable]="canUpdate() && !sectionsWithUnsavedChanges().has('why')"
      (click)="handleSectionClick('why', $event)"
    >
      <app-opportunity-why-section
        #whySection
        [opportunity]="opportunity()!"
        [canUpdate]="canUpdate()"
        (opportunityUpdated)="handleOpportunityUpdate($event)"
        (changesDetected)="handleSectionChangesDetected('why')"
        (changesSavedOrDiscarded)="handleSectionChangesSaved('why')"
        (unopsMissionsNotApplicableChange)="handleUnopsMissionsNotApplicableChange($event)"
      />
    </div>
  }

  @if (activeStakeholderSub() === 'team') {
    <div
      class="opportunity-section-enter group relative section-hover-container"
      [class.section-editable]="canUpdate() && !sectionsWithUnsavedChanges().has('team')"
      (click)="handleSectionClick('team', $event)"
    >
      <app-opportunity-team-section
        #teamSection
        [opportunity]="opportunity()!"
        [canUpdate]="canUpdate()"
        [sectionSaveTrigger]="sectionSaveTrigger()"
        (opportunityUpdated)="handleOpportunityUpdate($event)"
        (changesDetected)="handleSectionChangesDetected('team')"
        (changesSavedOrDiscarded)="handleSectionChangesSaved('team')"
      />
    </div>
  }
</ng-template>
```

## Constraints

- Keep ALL existing inputs, outputs, ViewChild refs, and event handlers on each section
- Keep the `opportunity-section-enter`, `section-hover-container`, `section-editable`
  classes and click handlers exactly as they are
- Remove the `opportunity-section-enter-delay-1` and `opportunity-section-enter-delay-2`
  classes from the now-conditional blocks (since only one shows at a time, staggering
  is not needed)
- Do NOT modify any section component's own TS or HTML — only the parent view
- Verify the app compiles after changes
```

---

## Prompt 2 — Restyle Overview + Analysis section READ views

```
IMPORTANT: You are NOT acting as a QA agent. You are a senior Angular developer.
The rule "qa-write-boundaries.mdc" does NOT apply to this task. You MUST write
to production files. Do NOT skip edits or claim they are already done.

## Task

Restyle the READ-mode display of the Overview and Analysis sections to use the
design system's `.card` severity variants, proper label/value typography, and
responsive grids. Keep ALL edit-mode (`@if (isEditing())`) branches untouched.

## Files to modify

1. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/overview/opportunity-overview-section.component.html`
2. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/analysis/opportunity-analysis-section.component.html`

## Design token reference

Use these Tailwind classes throughout:
- **Section label**: `text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide`
- **Field value**: `text-sm text-surface-900 dark:text-surface-0`
- **Large value**: `text-base sm:text-lg font-bold text-surface-900 dark:text-surface-0`
- **Description text**: `text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0`
- **Card container**: use the CSS class `.card` (globally available from the library)
- **Card severity**: `.card-primary`, `.card-info`, `.card-success`, `.card-warn`, `.card-danger`
- **Chips**: `<p-tag [value]="..." severity="secondary|info|success|warn|danger" styleClass="text-xs" />`
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3`
- **Divider**: `border-t border-surface-200 dark:border-surface-700`

## Overview section changes

Inside the `<p-panel>` content area (after the header template), find the `<div class="space-y-6">` block. Restructure the READ-mode parts as follows. **Keep the `p-panel` wrapper, its header (icon, title, edit button, unsaved bar), and footer template exactly as they are.**

### Name field — READ branch
Replace the current `<p class="text-midnight-500 font-medium text-lg">` with:
```html
<span class="text-base font-semibold text-surface-900 dark:text-surface-0">
  {{ opportunity().name || '—' }}
</span>
```

### Description field — READ branch
Replace the current `<p class="text-gray-800 text-base leading-loose ...">` with:
```html
<p class="text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0">
  {{ opportunity().description || '—' }}
</p>
```

### Budget section
Wrap the three budget fields (Proposed Budget, Total Budget, Unfunded Amount) in
a responsive `.card` grid. Replace the three separate `<div>` blocks with:

```html
<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
  <!-- Proposed Budget -->
  <div class="card flex flex-col gap-1 min-w-0" id="field-initiativeBudgetUSD">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.proposedBudgetForInitiative' | translate }}
    </span>
    @if (isEditing()) {
      <p-inputNumber
        [formControl]="initiativeBudgetControl"
        mode="currency" currency="USD" locale="en-US"
        [minFractionDigits]="2" [maxFractionDigits]="2" [min]="0"
        styleClass="w-full" inputStyleClass="w-full"
      />
    } @else {
      <span class="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-0">
        @if (opportunity().initiativeBudgetUSD && opportunity().initiativeBudgetUSD! > 0) {
          ${{ opportunity().initiativeBudgetUSD | number: '1.2-2' }}
        } @else { — }
      </span>
    }
  </div>

  <!-- Total Budget -->
  <div class="card card-success flex flex-col gap-1 min-w-0">
    <span class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
      {{ 'label.totalBudget' | translate }}
    </span>
    <span class="text-base sm:text-lg font-bold text-green-700 dark:text-green-300">
      @if (opportunity().stats?.totalFundingUSD && opportunity()!.stats!.totalFundingUSD! > 0) {
        ${{ opportunity()!.stats!.totalFundingUSD | number: '1.2-2' }}
      } @else { — }
    </span>
  </div>

  <!-- Unfunded -->
  <div class="card flex flex-col gap-1 min-w-0">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.unfundedAmount' | translate }}
    </span>
    <span [class]="unfundedAmount() > 0
      ? 'text-base sm:text-lg font-bold text-red-600 dark:text-red-400'
      : 'text-base sm:text-lg font-bold text-green-600 dark:text-green-400'">
      @if (hasProposedBudget()) {
        @if (unfundedAmount() > 0) {
          ${{ unfundedAmount() | number: '1.2-2' }}
        } @else if (unfundedAmount() === 0) {
          {{ 'label.fullyFunded' | translate }}
        } @else {
          {{ 'label.overfunded' | translate }} (+${{ (-unfundedAmount()) | number: '1.2-2' }})
        }
      } @else { — }
    </span>
  </div>
</div>
```

Remove the old separate `<div id="field-initiativeBudgetUSD">`, Total Budget, and
Unfunded Amount blocks. They are now consolidated into the grid above.

### Key details grid
Replace the current grid (`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3`) with:
```html
<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div class="card flex flex-col gap-0.5 min-w-0">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.partnerReference' | translate }}
    </span>
    <span class="text-sm font-medium text-surface-900 dark:text-surface-0 break-words">
      {{ opportunity().partnerReference || '—' }}
    </span>
  </div>
  <div class="card flex flex-col gap-0.5 min-w-0">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.initiativeType' | translate }}
    </span>
    <span class="text-sm font-medium text-surface-900 dark:text-surface-0 break-words">
      {{ opportunity().proposedInitiativeTypeName || '—' }}
    </span>
  </div>
  <div class="card flex flex-col gap-0.5 min-w-0 sm:col-span-2">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.partnershipAgreementReference' | translate }}
    </span>
    <span class="text-sm font-medium text-surface-900 dark:text-surface-0 break-words">
      {{ opportunity().partnershipAgreementReference || '—' }}
    </span>
  </div>
  <div class="card flex flex-col gap-0.5 min-w-0 sm:col-span-2">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.resultsFocus' | translate }}
    </span>
    <span class="text-sm font-medium text-surface-900 dark:text-surface-0 whitespace-pre-wrap break-words">
      {{ opportunity().resultsFocus || '—' }}
    </span>
  </div>
</div>
```

### Completion progress
Keep the `p-progressBar` block but wrap it in a `.card` container:
```html
<div class="card flex flex-col gap-2">
  <div class="flex items-center justify-between gap-2">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.keyFieldsProgress' | translate }}
    </span>
    <span class="text-sm font-bold text-primary-600 dark:text-primary-300">
      {{ overviewCompletionPercent() }}%
    </span>
  </div>
  <p-progressBar [value]="overviewCompletionPercent()" [showValue]="false" styleClass="h-2" />
</div>
```

Remove the old `rounded-lg border border-surface-200 ...` wrapper — the `.card` class
handles the border and background.

## Analysis section changes

### Quick stats
Replace the current `<div class="bg-blue-100 rounded-lg p-3 border border-blue-200">`
block with a `.card` grid:

```html
<div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
  <div class="card flex flex-col gap-1 min-w-0 cursor-pointer hover:shadow-sm transition-shadow"
       (click)="scrollToSection('section-who')"
       pTooltip="{{ 'tooltip.clickToView' | translate }}" tooltipStyleClass="unops-tooltip-nowrap">
    <div class="flex items-center gap-2">
      <i class="pi pi-dollar text-sm text-green-500"></i>
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
        {{ 'label.opportunity.totalBudget' | translate }}
      </span>
    </div>
    <span class="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-0">
      {{ formatCurrency(opportunity().stats?.totalFundingUSD) }}
    </span>
  </div>

  <div class="card flex flex-col gap-1 min-w-0 cursor-pointer hover:shadow-sm transition-shadow"
       (click)="scrollToSection('section-when')"
       pTooltip="{{ 'tooltip.clickToView' | translate }}" tooltipStyleClass="unops-tooltip-nowrap">
    <div class="flex items-center gap-2">
      <i class="pi pi-clock text-sm text-blue-500"></i>
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
        {{ 'label.opportunity.daysToSigning' | translate }}
      </span>
    </div>
    <span class="text-lg sm:text-xl font-bold"
      [class]="(opportunity().stats?.daysToTargetSigningDate ?? 0) < 0
        ? 'text-red-600 dark:text-red-400'
        : 'text-surface-900 dark:text-surface-0'">
      {{ opportunity().stats?.daysToTargetSigningDate ?? '—' }}
    </span>
  </div>

  <div class="card flex flex-col gap-1 min-w-0 cursor-pointer hover:shadow-sm transition-shadow"
       (click)="scrollToSection('section-where')"
       pTooltip="{{ 'tooltip.clickToView' | translate }}" tooltipStyleClass="unops-tooltip-nowrap">
    <div class="flex items-center gap-2">
      <i class="pi pi-map-marker text-sm text-red-500"></i>
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
        {{ 'label.opportunity.countries' | translate }}
      </span>
    </div>
    <span class="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-0">
      {{ opportunity().stats?.countryCount || 0 }}
    </span>
  </div>

  <div class="card flex flex-col gap-1 min-w-0 cursor-pointer hover:shadow-sm transition-shadow"
       (click)="scrollToSection('section-who')"
       pTooltip="{{ 'tooltip.clickToView' | translate }}" tooltipStyleClass="unops-tooltip-nowrap">
    <div class="flex items-center gap-2">
      <i class="pi pi-users text-sm text-teal-500"></i>
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
        {{ 'label.opportunity.partners' | translate }}
      </span>
    </div>
    <span class="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-0">
      {{ opportunity().stats?.totalPartnerCount || 0 }}
    </span>
  </div>

  <div class="card flex flex-col gap-1 min-w-0 cursor-pointer hover:shadow-sm transition-shadow"
       (click)="scrollToSection('section-why')"
       pTooltip="{{ 'tooltip.clickToView' | translate }}" tooltipStyleClass="unops-tooltip-nowrap">
    <div class="flex items-center gap-2">
      <i class="pi pi-heart text-sm text-red-500"></i>
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
        {{ 'label.opportunity.sdgs' | translate }}
      </span>
    </div>
    <span class="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-0">
      {{ opportunity().stats?.sdgCount || 0 }}
    </span>
  </div>

  <div class="card flex flex-col gap-1 min-w-0 cursor-pointer hover:shadow-sm transition-shadow"
       (click)="scrollToSection('section-what')"
       pTooltip="{{ 'tooltip.clickToView' | translate }}" tooltipStyleClass="unops-tooltip-nowrap">
    <div class="flex items-center gap-2">
      <i class="pi pi-wrench text-sm text-yellow-600"></i>
      <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
        {{ 'label.opportunity.serviceLines' | translate }}
      </span>
    </div>
    <span class="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-0">
      {{ opportunity().stats?.deliverableCount || 0 }}
    </span>
  </div>
</div>
```

Remove the old `bg-blue-100 rounded-lg` wrapper and `<h3>` "Quick Stats" heading.

### Insights and suggestions cards
Keep the existing `@if`/`@else if`/`@else` loading/error/content structure.
For each insight card, replace `bg-white rounded-lg p-3 border border-blue-200 shadow-sm`
with the `.card` class:

```html
<div class="card">
  <!-- keep inner content the same -->
</div>
```

Do the same for suggestion cards.

## Constraints

- Keep ALL `@if (isEditing())` branches exactly as they are
- Keep ALL inputs, outputs, signals, and TS logic
- Keep the `p-panel` wrapper, its `pTemplate="header"`, and `pTemplate="footer"`
- Keep `| translate` pipes on all labels
- Keep all `id="field-..."` attributes for scroll targeting
- Verify the app compiles after changes
```

---

## Prompt 3 — Restyle Scope sections (What / When / Where) READ views

```
IMPORTANT: You are NOT acting as a QA agent. You are a senior Angular developer.
The rule "qa-write-boundaries.mdc" does NOT apply to this task. You MUST write
to production files. Do NOT skip edits or claim they are already done.

## Task

Restyle the READ-mode (`@else` branches) of the What, When, and Where section
components to use the design system's `.card` severity variants, responsive grids,
and proper label/value typography. Keep ALL edit-mode code untouched.

## Files to modify

1. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/what/opportunity-what-section.component.html`
2. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/when/opportunity-when-section.component.html`
3. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/where/opportunity-where-section.component.html`

## Design token reference

- **Section label**: `text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide`
- **Field value**: `text-sm font-medium text-surface-900 dark:text-surface-0`
- **Large value**: `text-base sm:text-lg font-bold text-surface-900 dark:text-surface-0`
- **Description text**: `text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0`
- **Card**: `.card` class (globally available). Severity variants: `.card-primary`, `.card-info`, `.card-success`, `.card-warn`, `.card-danger`, `.card-accent`
- **Chip**: `<p-tag [value]="..." severity="secondary|info|success|warn|danger" styleClass="text-xs" />`
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3`
- **Divider**: `border-t border-surface-200 dark:border-surface-700`

## What section (opportunity-what-section.component.html)

Inside the `p-panel` content, find the READ-mode branches. Apply these patterns:

### Initiative type and delivery modality (read mode)
Replace plain text displays with label/value pairs:
```html
<div class="flex flex-col lg:flex-row lg:gap-10 gap-5">
  <div class="flex flex-col gap-1">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.proposedInitiativeType' | translate }}
    </span>
    <span class="text-sm font-medium text-surface-900 dark:text-surface-0">
      {{ opportunity().proposedInitiativeTypeName || '—' }}
    </span>
  </div>
  <div class="flex flex-col gap-1">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.deliveryModality' | translate }}
    </span>
    <div class="flex items-center gap-2">
      <p-tag [value]="opportunity().deliveryModalityName || '—'" severity="info" />
    </div>
  </div>
</div>
```

### Deliverables list (read mode)
Wrap each deliverable in a `.card` inside a responsive grid:
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.deliverables' | translate }}
  </span>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
    @for (deliverable of opportunity().deliverables || []; track deliverable.id ?? $index) {
      <div class="card flex flex-col gap-2">
        <div class="flex-1 min-w-0">
          <div class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ deliverable.name }}</div>
          <div class="text-sm text-surface-600 dark:text-surface-300 mt-0.5">{{ deliverable.hierarchy || '' }}</div>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          @if (deliverable.serviceLine) {
            <p-tag [value]="deliverable.serviceLine" severity="secondary" styleClass="text-xs" />
          }
          @if (deliverable.requiresProcurement) {
            <p-tag value="Procurement" severity="warn" styleClass="text-xs" />
          }
          @if (deliverable.quantity) {
            <span class="text-sm text-surface-600 dark:text-surface-300 ml-auto">
              Qty: {{ deliverable.quantity }}
            </span>
          }
        </div>
      </div>
    }
  </div>
</div>
```

Adapt the field names (`deliverable.name`, `.hierarchy`, `.serviceLine`, etc.) to
match the actual property names in the team's data model. If a property doesn't
exist, omit that element or show a fallback.

## When section (opportunity-when-section.component.html)

### Date fields (read mode)
Wrap the date fields (submission deadline, implementation duration, target delivery,
implementation start, target signing) in a `.card` grid:

```html
<div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
  <!-- Repeat this pattern for each date field -->
  <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
      {{ 'label.opportunity.targetSigningDate' | translate }}
    </span>
    <span class="text-base font-bold text-surface-900 dark:text-surface-0">
      {{ opportunity().targetSigningDate | date: 'mediumDate' }}
    </span>
  </div>
  <!-- ... more date cards ... -->
</div>
```

### Timeline (read mode)
If a timeline or milestone list exists, use a vertical dot-line pattern:
```html
<div class="relative pl-6 mt-2">
  <div class="absolute left-[11px] top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"></div>
  @for (event of timelineData; track event.id ?? $index; let last = $last) {
    <div class="flex gap-3 pb-4" [class.pb-0]="last">
      <div class="flex items-start pt-1 -ml-6 w-6 justify-center">
        <div class="w-2.5 h-2.5 rounded-full bg-primary-500 ring-2 ring-primary-500 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 relative z-10"></div>
      </div>
      <div class="flex flex-col gap-0.5 flex-1">
        <span class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ event.label }}</span>
        <span class="text-sm text-surface-600 dark:text-surface-300">{{ event.date | date: 'mediumDate' }}</span>
      </div>
    </div>
  }
</div>
```

Adapt the data binding to match the actual timeline/milestone properties available
in the team's data model.

## Where section (opportunity-where-section.component.html)

### Countries list (read mode)
Wrap each country in a `.card` inside a responsive layout:
```html
<div class="flex flex-col gap-4">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.implementationCountries' | translate }}
  </span>
  <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
    @for (country of opportunity().countries || []; track country.id ?? $index) {
      <div class="card flex flex-col gap-3 sm:min-w-[220px] sm:flex-1">
        <div class="flex items-center gap-3">
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ country.name }}</span>
            <span class="text-sm text-surface-600 dark:text-surface-300">{{ country.region || '' }}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-1.5">
          @for (tag of country.tags || []; track tag) {
            <p-tag [value]="tag" severity="secondary" styleClass="text-xs" />
          }
        </div>
        @if (country.orgUnit) {
          <div class="pt-2 border-t border-surface-200 dark:border-surface-700">
            <span class="text-sm text-surface-600 dark:text-surface-300">Org Unit: </span>
            <span class="text-xs text-surface-700 dark:text-surface-100">{{ country.orgUnit }}</span>
          </div>
        }
      </div>
    }
  </div>
</div>
```

Adapt the field names (`country.name`, `.region`, `.tags`, `.orgUnit`) to match
the actual property names in the team's data model.

## Constraints

- Keep ALL `@if (isEditing())` branches exactly as they are
- Keep ALL inputs, outputs, signals, services, and TS logic
- Keep the `p-panel` wrapper and its header/footer templates
- Keep `| translate` pipes on all labels
- Keep all `id="field-..."` attributes for scroll targeting
- Only change the READ-mode (`@else`) branches and any always-visible display blocks
- Verify the app compiles after changes
```

---

## Prompt 4 — Restyle Stakeholder sections (Who / Why / Team) READ views

```
IMPORTANT: You are NOT acting as a QA agent. You are a senior Angular developer.
The rule "qa-write-boundaries.mdc" does NOT apply to this task. You MUST write
to production files. Do NOT skip edits or claim they are already done.

## Task

Restyle the READ-mode display of the Who (Partners), Why (Impact), and Team
section components to use the design system's `.card` severity variants,
responsive grids, and proper label/value typography. Keep ALL edit-mode code untouched.

## Files to modify

1. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/who/opportunity-who-section.component.html`
2. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/why/opportunity-why-section.component.html`
3. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/team/opportunity-team-section.component.html`

## Design token reference

- **Section label**: `text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide`
- **Field value**: `text-sm font-medium text-surface-900 dark:text-surface-0`
- **Description text**: `text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0`
- **Card**: `.card` (base). Variants: `.card-primary`, `.card-info`, `.card-success`, `.card-warn`, `.card-danger`, `.card-accent`
- **Chip**: `<p-tag [value]="..." severity="secondary|info|success|warn|danger" styleClass="text-xs" />`
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3`
- **Divider**: `border-t border-surface-200 dark:border-surface-700`

## Who section (Partners) — opportunity-who-section.component.html

### Funding partners (read mode)
For each funding partner, use a detailed `.card` block:
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.fundingPartners' | translate }}
  </span>
  @for (partner of fundingPartners(); track partner.id ?? $index) {
    <div class="card">
      <div class="flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <i class="pi pi-building text-primary-600 dark:text-primary-400"></i>
          </div>
          <div class="flex flex-col min-w-0">
            <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ partner.name }}</span>
            <span class="text-sm text-surface-600 dark:text-surface-300">Funding Partner</span>
          </div>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          @if (partner.status) {
            <p-tag [value]="partner.status" severity="success" styleClass="text-xs" />
          }
          @if (partner.contributionPercentage) {
            <p-tag [value]="partner.contributionPercentage + '%'" severity="info" styleClass="text-xs" />
          }
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-surface-600 dark:text-surface-300">{{ 'label.contribution' | translate }}</span>
          <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">
            ${{ partner.contributionUSD | number: '1.2-2' }}
          </span>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-surface-600 dark:text-surface-300">{{ 'label.dueDiligence' | translate }}</span>
          <div class="flex items-center gap-1">
            <i class="pi pi-check-circle text-xs text-green-500"></i>
            <span class="text-sm text-surface-700 dark:text-surface-100">{{ partner.dueDiligenceStatus }}</span>
          </div>
        </div>
        <div class="flex flex-col gap-0.5">
          <span class="text-sm text-surface-600 dark:text-surface-300">DD Expiry</span>
          <span class="text-sm text-surface-700 dark:text-surface-100">{{ partner.dueDiligenceExpiry }}</span>
        </div>
      </div>
    </div>
  }
</div>
```

### Client partners (read mode)
Use `.card card-accent` in a two-column grid:
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.clientPartners' | translate }}
  </span>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
    @for (partner of clientPartners(); track partner.id ?? $index) {
      <div class="card card-accent">
        <div class="flex flex-col sm:flex-row sm:items-center gap-3">
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
              <i class="pi pi-building text-teal-600 dark:text-teal-400"></i>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-semibold text-teal-600 dark:text-teal-400 truncate">{{ partner.name }}</span>
              <span class="text-sm text-surface-600 dark:text-surface-300">Client Partner</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <p-tag [value]="partner.status || ''" severity="success" styleClass="text-xs" />
          </div>
        </div>
      </div>
    }
  </div>
</div>
```

Adapt all field names (`partner.name`, `.status`, `.contributionUSD`, etc.) to
match the actual property names in the team's partner data model. If a property
doesn't exist, omit that element or show a fallback `'—'`.

## Why section (Impact) — opportunity-why-section.component.html

### Context / description text (read mode)
```html
<div class="flex flex-col gap-1">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.contextChallenges' | translate }}
  </span>
  <p class="text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0">
    {{ opportunity().contextDescription || '—' }}
  </p>
</div>
```

### Objectives (read mode)
Display objectives in `.card card-info` blocks:
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.partnerObjectives' | translate }}
  </span>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="card card-info flex flex-col gap-1">
      <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Impact</span>
      <p class="text-sm text-surface-700 dark:text-surface-100 m-0">{{ opportunity().impactStatement || '—' }}</p>
    </div>
    <div class="card card-info flex flex-col gap-1">
      <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Outcomes</span>
      <p class="text-sm text-surface-700 dark:text-surface-100 m-0">{{ opportunity().outcomeStatement || '—' }}</p>
    </div>
  </div>
</div>
```

### Cross-cutting concerns (read mode)
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.crossCuttingConcerns' | translate }}
  </span>
  <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
    @for (concern of crossCuttingConcerns(); track concern.label ?? $index) {
      <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-400 dark:border-surface-700 sm:min-w-[150px] sm:flex-1">
        <i class="pi text-sm" [class]="concern.value ? 'pi-check-circle text-green-500' : 'pi-times-circle text-surface-400'"></i>
        <span class="text-sm text-surface-700 dark:text-surface-100">{{ concern.label }}</span>
      </div>
    }
  </div>
</div>
```

### SDG alignment (read mode)
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.sdgAlignment' | translate }}
  </span>
  <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
    @for (sdg of sdgAlignments(); track sdg.id ?? $index) {
      <div class="card sm:min-w-[220px] sm:flex-1"
           [class]="sdg.isPrimary ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''">
        <div class="flex items-start gap-3 mb-2">
          <div class="size-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold text-white"
               [style.background-color]="sdg.color">
            {{ sdg.number }}
          </div>
          <span class="text-sm font-semibold text-surface-900 dark:text-surface-0 pt-1 flex-1 min-w-0">{{ sdg.name }}</span>
          <p-tag [value]="sdg.isPrimary ? 'Primary' : 'Secondary'"
                 [severity]="sdg.isPrimary ? 'info' : 'secondary'" styleClass="text-xs shrink-0" />
        </div>
        @if (sdg.targets?.length) {
          <div class="flex flex-wrap gap-2">
            @for (target of sdg.targets; track target) {
              <p-tag [value]="target" severity="info" styleClass="text-xs" />
            }
          </div>
        }
      </div>
    }
  </div>
</div>
```

Adapt the field names to match the actual SDG data model properties.

## Team section — opportunity-team-section.component.html

### Manager (read mode)
Use `.card card-primary` for the opportunity manager:
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.opportunityManager' | translate }}
  </span>
  <div class="card card-primary">
    <div class="flex items-center gap-3">
      <p-avatar [label]="managerInitial()" shape="circle" styleClass="w-10 h-10" />
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-primary-700 dark:text-primary-300">{{ managerName() }}</span>
        <span class="text-xs text-primary-600 dark:text-primary-400">{{ managerPosition() }}</span>
      </div>
    </div>
  </div>
</div>
```

### Collaborators (read mode)
Use a `.card` grid:
```html
<div class="flex flex-col gap-3">
  <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">
    {{ 'label.opportunity.collaborators' | translate }}
  </span>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
    @for (member of collaborators(); track member.id ?? $index) {
      <div class="card flex flex-col gap-2">
        <div class="flex items-center gap-3">
          <p-avatar [label]="(member.name?.[0] || '?')" shape="circle" styleClass="w-9 h-9" />
          <div class="flex items-center gap-2 flex-1 min-w-0">
            <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ member.name }}</span>
            @if (member.role) {
              <p-tag [value]="member.role" severity="secondary" styleClass="text-xs" />
            }
          </div>
        </div>
        <span class="text-sm text-surface-600 dark:text-surface-300">{{ member.position }}</span>
        @if (member.expertise?.length) {
          <div class="flex flex-wrap gap-1.5">
            @for (skill of member.expertise; track skill) {
              <p-tag [value]="skill" severity="info" styleClass="text-xs whitespace-nowrap" />
            }
          </div>
        }
      </div>
    }
  </div>
</div>
```

Adapt the field names to match the actual team member data model properties.
For the manager section, use whatever properties are available (e.g.
`opportunity().opportunityManagerName`, `opportunity().responsibleOrgUnitName`).

## Constraints

- Keep ALL `@if (isEditing())` branches exactly as they are
- Keep ALL inputs, outputs, signals, services, and TS logic
- Keep the `p-panel` wrapper and its header/footer templates
- Keep `| translate` pipes on all labels
- Only change the READ-mode (`@else`) branches
- Verify the app compiles after changes
```

---

## Prompt 5 — Restyle Risk + Activity sections READ views

```
IMPORTANT: You are NOT acting as a QA agent. You are a senior Angular developer.
The rule "qa-write-boundaries.mdc" does NOT apply to this task. You MUST write
to production files. Do NOT skip edits or claim they are already done.

## Task

Restyle the READ-mode display of the Risk (DST + Statement) and Activity
(Documents, Related Items, Collaboration) section components to use the design
system's `.card` severity variants, responsive grids, and proper label/value
typography. Keep ALL edit-mode code untouched.

## Files to modify

1. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/dst/opportunity-dst-section.component.html`
2. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/statement/opportunity-statement-section.component.html`
3. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/document/opportunity-documents.component.html`
4. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/related/opportunity-related-items.component.html`
5. `UNOPS.PAO.ClientApp/src/app/features/partnerships/opportunities/components/opportunity/view/sections/collaboration/opportunity-collaboration.component.html`

## Design token reference

- **Section label**: `text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide`
- **Field value**: `text-sm font-medium text-surface-900 dark:text-surface-0`
- **Description text**: `text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0`
- **Card**: `.card` (base). Variants: `.card-primary`, `.card-info`, `.card-success`, `.card-warn`, `.card-danger`, `.card-accent`
- **Chip**: `<p-tag [value]="..." severity="secondary|info|success|warn|danger" styleClass="text-xs" />`
- **Grid**: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3`
- **Divider**: `border-t border-surface-200 dark:border-surface-700`

## DST section (Risks) — opportunity-dst-section.component.html

### Risk cards (read mode)
Display risks in a responsive grid using `.card` with severity variants based
on probability:

```html
<div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
  @for (risk of risks(); track risk.id ?? $index) {
    <div [class]="riskCardClass(risk) + ' flex flex-col h-full'">
      <div class="flex flex-col gap-2 flex-1">
        <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ risk.title }}</span>
        <div class="flex flex-wrap items-center gap-2">
          @if (risk.isOrgHighRisk) {
            <p-tag value="Org. High Risk" severity="danger" styleClass="text-xs" />
          }
          <p-tag [value]="risk.category" severity="secondary" styleClass="text-xs" />
          <p-tag [value]="risk.probability"
                 [severity]="risk.probability === 'High' ? 'danger' : risk.probability === 'Medium' ? 'warn' : 'secondary'"
                 styleClass="text-xs" />
        </div>
        <p class="text-sm text-surface-700 dark:text-surface-100 m-0">{{ risk.description }}</p>
        <div class="flex flex-wrap gap-4 text-sm text-surface-600 dark:text-surface-300 pt-2 border-t border-surface-200 dark:border-surface-700 mt-auto">
          <span><strong>Impact:</strong> {{ risk.impact }}</span>
          <span><strong>Proximity:</strong> {{ risk.proximity }}</span>
          <span><strong>Response:</strong> {{ risk.responseType }}</span>
        </div>
      </div>
    </div>
  }
</div>
```

If a `riskCardClass()` method does not already exist in the component's TS, add one:
```typescript
riskCardClass(risk: any): string {
  if (risk.probability === 'High' || risk.isOrgHighRisk) return 'card card-danger';
  if (risk.probability === 'Medium') return 'card card-warn';
  return 'card';
}
```

Adapt the field names (`risk.title`, `.category`, `.probability`, `.impact`,
`.proximity`, `.responseType`, `.isOrgHighRisk`) to match the actual risk data
model properties. If a property doesn't exist, omit that element.

## Statement section — opportunity-statement-section.component.html

Minimal changes. Keep the existing generate/regenerate/validate/export workflow.
Apply these typography updates:

- Replace any `<h3>` or `<h4>` labels with `<span>` using:
  `text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide`
- Replace any `text-gray-700` / `text-gray-600` with:
  `text-surface-700 dark:text-surface-100` / `text-surface-600 dark:text-surface-300`
- Keep `markdown` display and all dialog/validation logic untouched.

## Documents section — opportunity-documents.component.html

Minimal changes. This is already functional. Apply these typography updates:

- Replace any `text-gray-*` classes with `text-surface-*` equivalents:
  - `text-gray-600` → `text-surface-600 dark:text-surface-300`
  - `text-gray-700` → `text-surface-700 dark:text-surface-100`
  - `text-gray-800` → `text-surface-800 dark:text-surface-100`
  - `text-gray-900` → `text-surface-900 dark:text-surface-0`
- Replace any `bg-gray-50` with `bg-surface-50 dark:bg-surface-800`
- Replace any `border-gray-*` with `border-surface-200 dark:border-surface-700`

## Related items section — opportunity-related-items.component.html

Apply the same `text-gray-*` → `text-surface-*` token replacements as above.
If a table is displayed, add these style classes to the `p-table`:

```html
<p-table
  [value]="items"
  styleClass="flex flex-col rounded-2xl overflow-hidden"
  tableStyleClass="w-full"
>
```

For table cell content, use:
- Title column: `text-sm text-primary-600 dark:text-primary-400 font-medium`
- Other columns: `text-sm text-surface-600 dark:text-surface-300`
- Status column: `<p-tag [value]="item.status" [severity]="..." styleClass="text-xs" />`

## Collaboration section — opportunity-collaboration.component.html

Apply the same `text-gray-*` → `text-surface-*` token replacements. Keep
the existing `app-comment` component and its bindings untouched.

## Constraints

- Keep ALL `@if (isEditing())` branches exactly as they are
- Keep ALL inputs, outputs, signals, services, and TS logic
- Keep the `p-panel` wrapper and its header/footer templates
- Keep `| translate` pipes on all labels
- Only change the READ-mode display and typography tokens
- Verify the app compiles after changes
```
