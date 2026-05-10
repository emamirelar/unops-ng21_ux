---
name: Tailwind-to-Component Audit
overview: Comprehensive audit of styled divs using Tailwind classes that duplicate existing PrimeNG or unops-ux library components, with file locations, line numbers, and recommended replacements.
todos:
  - id: pill-tabs
    content: "Step 1: Replace hand-coded pill-tab rows with ux-pill-tabs in 4 files (no preset work needed)"
    status: completed
  - id: dividers-preset
    content: "Step 2a: Add divider overrides to brand-theme.ts (border color, zero spacing)"
    status: completed
  - id: dividers-swap
    content: "Step 2b: Swap border-t divider divs with p-divider across 20+ files (~60 instances)"
    status: completed
  - id: tags-badges
    content: "Step 3: Swap styled tag/badge/chip spans with p-tag/p-badge/p-chip (preset already exists for tag)"
    status: completed
  - id: avatars
    content: "Step 4: Add avatar overrides to brand-theme.ts, then swap rounded-full containers with p-avatar (7 files)"
    status: completed
  - id: cards
    content: "Step 5: Add card overrides to brand-theme.ts, then swap 4 grid entity tiles to p-card (strong candidates only)"
    status: completed
  - id: messages
    content: "Step 6: Add message overrides to brand-theme.ts, then swap colored callout boxes with p-message (3 files)"
    status: completed
  - id: panels
    content: "Step 7: Add panel overrides to brand-theme.ts, then convert collapsible sections to p-panel [toggleable] (5 files)"
    status: completed
  - id: progress
    content: "Step 8: Add progressbar overrides to brand-theme.ts, then swap custom meter divs (4 files)"
    status: completed
  - id: buttons-toolbars-overlays
    content: "Step 9: Add toolbar overrides, swap buttons/toolbars/overlays on case-by-case basis"
    status: completed
  - id: detail-layouts
    content: "Step 10: Refactor hand-built page shells to ux-detail-layout (10 remaining, one page at a time)"
    status: completed
isProject: false
---

# Tailwind-to-Component Replacement Audit

All templates are **inline** (inside `.ts` files). The `src/app/pages/uikit/` demo folder is excluded from this audit.

## Key Decisions

- **Scope:** Both `src/app/apps/` and `src/app/pages/` (full codebase, excluding `uikit`)
- **Cards:** Strong candidates only -- swap the 4 grid entity tiles to `p-card`, leave the rest using the `card` CSS utility class
- **Collapsible sections:** Convert to `p-panel` with `[toggleable]="true"`, styled to match current look
- **Visual parity:** All component swaps must preserve current styling. Use `styleClass`, `pt` (passthrough), and Tailwind utilities on PrimeNG components to match existing appearance. No visible regressions.

---

## Category 1: Pill-Tab Rows -- replace with `ux-pill-tabs`

The library provides `ux-pill-tabs` (selector: `<ux-pill-tabs [items]="..." [(activeValue)]="...">`) which renders a horizontal row of pill-shaped tab buttons with `role="tablist"`. The following files hand-code nearly identical markup:

- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** lines 813-830 -- Task filter pill row (`rounded-full`, `role="tablist"`, `(click)` toggle). Already uses `ux-pill-tabs` elsewhere in the same file, but the task filter section is hand-coded.
- **[documents-card.ts](src/app/apps/documents/documents-card.ts)** lines 56-67 -- Document type filter pills (`rounded-full`, `role="tablist"`).
- **[partners-team.ts](src/app/apps/partners/partners-team.ts)** lines 100-118 -- Filter tag pills (`rounded-full`, toggle active class).
- **[files.ts](src/app/apps/files/files.ts)** lines 198-210 -- File type filter buttons (`rounded-xl` variant, same interaction pattern).

---

## Category 2: Card-like Divs -- replace with `p-card`

**Status after recent refactoring:** `opportunity.ts` was heavily restructured to use `ux-detail-layout`, `DetailTabDirective`, and `AiInsightsCardComponent`. The old collapsible `expand-body` sections were replaced with tab navigation. However, **no `p-card` conversions have been done** anywhere in `apps/` or `pages/` (excl. `uikit`). The `card` CSS utility class is used extensively as a surface wrapper.

PrimeNG provides `<p-card>` with header/content/footer templates. Current card-like patterns fall into three tiers:

### Strong `p-card` candidates (grid entity tiles with consistent structure)
- **[partners.ts](src/app/apps/partners/partners.ts)** -- Line 217 (`p-5 border rounded-xl` grid tile)
- **[contacts.ts](src/app/apps/contacts/contacts.ts)** -- Line 133 (same grid pattern)
- **[opportunities.ts](src/app/apps/opportunities/opportunities.ts)** -- Line 131 (same grid pattern)
- **[partners-team.ts](src/app/apps/partners/partners-team.ts)** -- Line 214 (same grid pattern)

### Marginal candidates (card utility + custom content -- could use `p-card` but not always better)
- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** -- Now uses `card`, `card-info`, `card-accent`, `card-primary`, `card-danger` variant classes:
  - Lines 197-205: Budget stat tiles (KPI tiles -- too small for `p-card`)
  - Lines 255: Deliverable tiles
  - Lines 280-296: Timeline stat tiles
  - Lines 350: Country tiles
  - Lines 398-402: `card-info` callout boxes
  - Lines 465, 515: Funding/client partner rows
  - Lines 561: `card-primary` manager highlight
  - Lines 577: Collaborator tiles
  - Lines 602: Decision pathway stepper
  - Lines 635-643: Beneficiary count tiles
  - Lines 666: `riskCardClass()` dynamic risk tiles
  - Lines 697, 742, 775, 806: Large section `card` blocks (activity, table, comments, tasks)
- **[partner-detail.ts](src/app/apps/partners/partner-detail.ts)** -- Lines 109, 143, 203, 250, 275 (section cards with `card` class)
- **[contact-detail.ts](src/app/apps/contacts/contact-detail.ts)** -- Lines 100, 155, 198, 263, 316, 338 (collapsible `card` sections)
- **[documents-card.ts](src/app/apps/documents/documents-card.ts)** -- Line 38 (`card flex flex-col`)
- **[files.ts](src/app/apps/files/files.ts)** -- Lines 68 (page shell), 172 (pinned file tile), 314 (drawer metadata)
- **[agreements.ts](src/app/apps/agreements/agreements.ts)** -- Lines 92, 143, 204, 209, 230, 265, 299
- **[mail-detail.ts](src/app/apps/mail/mail-detail.ts)** -- Lines 27, 56, 150
- **[cms/list.ts](src/app/apps/cms/list.ts)** -- Lines 33, 93-185 (article cards in grid)
- **[cms/edit.ts](src/app/apps/cms/edit.ts)** -- Lines 29, 39
- **[cms/detail.ts](src/app/apps/cms/detail.ts)** -- Lines 16, 85
- **[cms/detail2.ts](src/app/apps/cms/detail2.ts)** -- Lines 15, 36, 99

### Not `p-card` candidates (page shells, layout wrappers, chat UI)
- **Page-level `card` wrappers** in `chat/index.ts` (83), `mail-inbox.ts` (31), `tasklist/index.ts` (40) -- these are full-page layout shells, not content cards
- **Chat bubbles** in `chatbox.ts` (71, 82) -- message UI, not cards
- **[ordersummary.ts](src/app/pages/ecommerce/ordersummary.ts)** -- Lines 60, 83
- **[blocks.ts](src/app/pages/blocks/blocks.ts)** -- Lines 21, 145, 190, 218, 250, 360+, 619+
- **Dashboard widgets** (`opportunitystatcardwidget.ts`, `pipelinehealthwidget.ts`, `spendinglimitwidget.ts`, `creditscorewidget.ts`) -- Host-level `card` wrappers
- **Auth pages** (`login.ts`, `register.ts`, `forgotpassword.ts`, `newpassword.ts`, `verification.ts`, `lockscreen.ts`) -- Outer card shells
- **Landing page** (`testimonialcardwidget.ts`, `ctawidget.ts`, `faqwidget.ts`, `contactherowidget.ts`)

---

## Category 3: Tag / Badge / Chip-like Elements -- replace with `p-tag`, `p-badge`, or `p-chip`

- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** -- Line 438 (skill chips), 589 (skills list), 780 (`rounded-full` count badge)
- **[documents-card.ts](src/app/apps/documents/documents-card.ts)** -- Line 61
- **[mail-inbox.ts](src/app/apps/mail/mail-inbox.ts)** -- Lines 55-56, 85-86, 225-226, 255-256 (`px-2 py-1 rounded-sm text-xs` badges)
- **[tasklist/index.ts](src/app/apps/tasklist/index.ts)** -- Lines 58-59, 86-87 (count badges on filter buttons)
- **[pipelinehealthwidget.ts](src/app/pages/dashboards/dashboard/components/pipelinehealthwidget.ts)** -- Line 27
- **[creditscorewidget.ts](src/app/pages/dashboards/banking/components/creditscorewidget.ts)** -- Line 28
- **[documentation.ts](src/app/pages/documentation/documentation.ts)** -- Lines 23, 41-43, 49, 59 (`bg-highlight rounded-border`)
- **[blocks.ts](src/app/pages/blocks/blocks.ts)** -- Line 23
- **[orderhistory.ts](src/app/pages/ecommerce/orderhistory.ts)** -- Lines 50-94 (pill filter buttons -- could also be `p-selectbutton`)

---

## Category 4: Divider-like Elements -- replace with `p-divider`

Empty `div`s or styled borders acting as section separators:

- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** -- Lines 366, 373, 481, 499, 530, 680, 794, 857, 877, 970 (some dashed)
- **[chatbox.ts](src/app/apps/chat/chatbox.ts)** -- Line 92
- **[files.ts](src/app/apps/files/files.ts)** -- Lines 341, 350, 369, 379
- **[agreements.ts](src/app/apps/agreements/agreements.ts)** -- Lines 326, 335, 354, 364
- **[cms/edit.ts](src/app/apps/cms/edit.ts)** -- Lines 82, 157, 171, 178, 196, 269, 283, 290 (dashed)
- **[cms/list.ts](src/app/apps/cms/list.ts)** -- Lines 113, 149, 185 (dashed)
- **[partner-detail.ts](src/app/apps/partners/partner-detail.ts)** -- Line 390
- **[partners-team.ts](src/app/apps/partners/partners-team.ts)** -- Line 244
- **[partners.ts](src/app/apps/partners/partners.ts)** -- Line 249
- **[contacts.ts](src/app/apps/contacts/contacts.ts)** -- Line 164
- **[opportunities.ts](src/app/apps/opportunities/opportunities.ts)** -- Line 155
- **[mail-inbox.ts](src/app/apps/mail/mail-inbox.ts)** -- Line 196
- **[mail-detail.ts](src/app/apps/mail/mail-detail.ts)** -- Lines 166, 182
- **[compose-dialog.ts](src/app/apps/mail/compose-dialog.ts)** -- Line 61
- **[task-drawer.ts](src/app/apps/tasklist/task-drawer.ts)** -- Line 116
- **[blocks.ts](src/app/pages/blocks/blocks.ts)** -- Lines 480, 493, 509, 521, 533, 545, 995, 1008, 1024, 1036, 1048, 1060
- **[ordersummary.ts](src/app/pages/ecommerce/ordersummary.ts)** -- Lines 269, 279, 300
- **[orderhistory.ts](src/app/pages/ecommerce/orderhistory.ts)** -- Line 151
- **[productoverview.ts](src/app/pages/ecommerce/productoverview.ts)** -- Lines 309, 372
- **[shoppingcart.ts](src/app/pages/ecommerce/shoppingcart.ts)** -- Line 172
- **[footerwidget.ts](src/app/pages/landing/components/footerwidget.ts)** -- Line 11

---

## Category 5: Message / Alert-like Elements -- replace with `p-message`

Colored callout boxes with tinted backgrounds and left borders:

- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)**:
  - Lines 398-402: Blue objective box (`bg-blue-50`)
  - Line 515: Teal border-left info box
  - Line 561: Primary callout (`bg-primary-50`)
  - Lines 666-667: Risk cards with `border-l` + severity-tinted background via `riskCardClass()`
- **[ordersummary.ts](src/app/pages/ecommerce/ordersummary.ts)** -- Line 35 (success banner `bg-emerald-50 border-b`)

---

## Category 6: Button-like Divs -- replace with `p-button`

Clickable `div`s or heavily-styled native `button`s that should use PrimeNG button variants:

- **[documents-card.ts](src/app/apps/documents/documents-card.ts)** -- Lines 40, 48 (icon circle buttons)
- **[files.ts](src/app/apps/files/files.ts)** -- Line 281 (`(click)="triggerFileUpload()"`)
- **[agreements.ts](src/app/apps/agreements/agreements.ts)** -- Line 266
- **[cms/edit.ts](src/app/apps/cms/edit.ts)** -- Line 48
- **[chat-menu.ts](src/app/apps/chat/chat-menu.ts)** -- Lines 77, 107-123 (tab divs with click)
- **[contact-detail.ts](src/app/apps/contacts/contact-detail.ts)** -- Lines 101, 156, 199, 264, 317, 339 (collapsible section headers)
- **[cms/list.ts](src/app/apps/cms/list.ts)** -- Lines 70, 76 (carousel nav buttons)
- **[blockviewer.ts](src/app/pages/blocks/components/blockviewer.ts)** -- Lines 25, 34, 51
- **[productlist.ts](src/app/pages/ecommerce/productlist.ts)** -- Lines 52, 64-67
- **[shoppingcart.ts](src/app/pages/ecommerce/shoppingcart.ts)** -- Lines 177-191
- **[newproduct.ts](src/app/pages/ecommerce/newproduct.ts)** -- Lines 219, 231, 243-246, 267
- **[faq.ts](src/app/pages/faq/faq.ts)** -- Lines 21-31

---

## Category 7: Toolbar-like Divs -- replace with `p-toolbar`

Flex rows at page/section tops with title + actions:

- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** -- Lines 809-811
- **[tasklist/index.ts](src/app/apps/tasklist/index.ts)** -- Lines 43-45, 99+
- **[mail-inbox.ts](src/app/apps/mail/mail-inbox.ts)** -- Line 196

---

## Category 8: Panel-like / Collapsible Sections -- replace with `p-panel` or `p-fieldset`

- **[documents-card.ts](src/app/apps/documents/documents-card.ts)** -- Lines 40-48 (expandable header)
- **[contact-detail.ts](src/app/apps/contacts/contact-detail.ts)** -- Multiple collapsible section headers with cursor-pointer flex rows
- **[creditscorewidget.ts](src/app/pages/dashboards/banking/components/creditscorewidget.ts)** -- Lines 16-42
- **[pipelinehealthwidget.ts](src/app/pages/dashboards/dashboard/components/pipelinehealthwidget.ts)** -- Lines 15-26
- **[faq.ts](src/app/pages/faq/faq.ts)** -- Lines 20-33 (left nav card)

---

## Category 9: Avatar-like Elements -- replace with `p-avatar`

Circular image/icon containers:

- **[cms/detail.ts](src/app/apps/cms/detail.ts)** -- Lines 112-113, 148-149, 168-169, 219
- **[cms/detail2.ts](src/app/apps/cms/detail2.ts)** -- Lines 28, 164-165, 200-201, 220-221, 240
- **[cms/list.ts](src/app/apps/cms/list.ts)** -- Lines 55-56
- **[task-drawer.ts](src/app/apps/tasklist/task-drawer.ts)** -- Lines 102, 107 (already imports AvatarModule but uses styled img)
- **[files.ts](src/app/apps/files/files.ts)** -- Line 283 (`w-12 h-12 rounded-full`)
- **[agreements.ts](src/app/apps/agreements/agreements.ts)** -- Line 268
- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** -- Lines 606-607 (numbered circle)

---

## Category 10: Progress / Meter-like Divs -- replace with `p-progressbar` or `p-metergroup`

- **[opportunity.ts](src/app/apps/opportunity/opportunity.ts)** -- Lines 310-313 (stacked colored bar segments in flex `h-3` row)
- **[files.ts](src/app/apps/files/files.ts)** -- Lines 142, 146, 158
- **[agreements.ts](src/app/apps/agreements/agreements.ts)** -- Lines 242-246
- **[meterchart.ts](src/app/pages/dashboards/charts/meterchart.ts)** -- Lines 24-37 (project already has a `custommeter` component using `p-metergroup`)

---

## Category 11: Detail-Layout Shells -- replace with `ux-detail-layout`

**Status after recent refactoring:** `opportunity.ts` has been **converted** to use `ux-detail-layout` with `DetailTabDirective` for tab-based navigation. It now uses `ux-detail-header`, `ux-detail-header-meta`, and `<ng-template uxDetailTab="...">` content projection. The old collapsible `expand-body` sections and hand-coded `flex-col xl:flex-row` two-column layout have been removed.

Remaining hand-built page layouts (not yet converted):

- **[partner-detail.ts](src/app/apps/partners/partner-detail.ts)** -- Lines 102-241 (main + 380px right rail with `ux-ai-insights-card`)
- **[contact-detail.ts](src/app/apps/contacts/contact-detail.ts)** -- Lines 95-253 (same pattern)
- **[agreements.ts](src/app/apps/agreements/agreements.ts)** -- Lines 76-197 (same pattern)
- **[files.ts](src/app/apps/files/files.ts)** -- Lines 77-193 (`grid-cols-12` two-column)
- **[cms/detail.ts](src/app/apps/cms/detail.ts)** -- Lines 16-184 (hero + `grid-cols-12` article + right column)
- **[cms/detail2.ts](src/app/apps/cms/detail2.ts)** -- Lines 15-236 (scrollable main + sticky right TOC)
- **[cms/edit.ts](src/app/apps/cms/edit.ts)** -- Lines 29-75 (header bar + main editor + `w-[309px]` right sidebar)
- **[mail-inbox.ts](src/app/apps/mail/mail-inbox.ts)** -- Lines 31-33 (sidebar + main split)
- **[mail-detail.ts](src/app/apps/mail/mail-detail.ts)** -- Lines 27-52 (header strip + scrolling body)
- **[chat/index.ts](src/app/apps/chat/index.ts)** -- Lines 83-141 (three-region chat shell)

---

## Category 12: Overlay / Sidebar-like Divs -- replace with `p-dialog` or `p-drawer`

- **[chatsidebar.ts](src/app/apps/chat/chatsidebar.ts)** -- Lines 71, 110 (`fixed z-50` side panels)
- **[blocks.ts](src/app/pages/blocks/blocks.ts)** -- Lines 60-61, 602-603 (mobile overlay with `absolute inset-0 bg-surface-900/60`)

---

## Summary by Priority (updated after recent refactoring)

| Priority | Category | Status | Count remaining | Effort |
|----------|----------|--------|-----------------|--------|
| High | Pill-tab rows -> `ux-pill-tabs` | Pending | 4 files | Low |
| High | Detail-layout shells -> `ux-detail-layout` | **1 done** (opportunity.ts) | 10 files remaining | Medium-High |
| High | Dividers -> `p-divider` | Pending | 20+ files, 60+ instances | Low |
| Medium | Cards -> `p-card` (strong only) | Pending (0 converted) | 4 grid entity tiles | Low-Medium |
| Medium | Tags/badges/chips -> `p-tag`/`p-badge`/`p-chip` | Pending | 10+ files | Low-Medium |
| Medium | Messages/alerts -> `p-message` | Pending | 3 files, 6 instances | Low |
| Medium | Avatars -> `p-avatar` | Pending | 7 files | Low |
| Medium | Panels -> `p-panel` (collapsible sections) | Pending | 5 files | Medium |
| Medium | Progress bars -> `p-progressbar`/`p-metergroup` | Pending | 4 files | Low |
| Low | Button-like divs -> `p-button` | Pending | 12+ files | Medium |
| Low | Toolbar divs -> `p-toolbar` | Pending | 3 files | Low |
| Low | Overlays -> `p-dialog`/`p-drawer` | Pending | 2 files | Medium |

---

## Recommended Execution Order

Each category follows a **preset-first** workflow:
1. Add component overrides to `brandOverrides.components` in `brand-theme.ts` to match the current Tailwind look
2. Then swap the templates -- components automatically inherit the brand styling
3. Only use `styleClass` for layout utilities (`flex`, `gap`, `mt-*`, `w-full`) that are context-specific

### Phase 1: Low-risk, high-impact swaps

**Step 1 -- Pill-tab rows** (4 files)
- No preset work needed (uses the existing `ux-pill-tabs` library component which is already styled)
- Direct template swap in `opportunity.ts`, `documents-card.ts`, `partners-team.ts`, `files.ts`

**Step 2 -- Dividers** (20+ files, ~60 instances)
- Add `divider` overrides to `brand-theme.ts`: match current `border-surface-200` / `dark:border-surface-700` color, set spacing to `0` (current dividers have no margin -- spacing comes from parent layout)
- Swap `<div class="border-t border-surface-200 dark:border-surface-700"></div>` with `<p-divider />`
- For dashed variants (cms/edit, cms/list): use `<p-divider [pt]="{ root: { class: 'border-dashed' } }" />`

**Step 3 -- Tags/badges/chips** (10+ files)
- Tag overrides already exist in `brand-theme.ts` (padding, font-weight, severity colors) -- verify they match current hand-coded badges
- Swap styled `<span class="px-2 py-1 rounded-sm text-xs ...">` with `<p-tag [value]="..." [severity]="..." />`
- For count badges on buttons: use `<p-badge [value]="count" />`

### Phase 2: Medium-effort swaps

**Step 4 -- Avatars** (7 files)
- Add `avatar` overrides to `brand-theme.ts`: match current sizing and `rounded-full` border styling
- Swap `<img class="w-10 h-10 rounded-full ...">` with `<p-avatar [image]="..." shape="circle" />`

**Step 5 -- Cards** (4 grid entity tiles only)
- Add `card` overrides to `brand-theme.ts`: match current `card` utility look (background, border, border-radius, shadow, padding) for both light/dark
- Swap grid tiles in `partners.ts`, `contacts.ts`, `opportunities.ts`, `partners-team.ts` with `<p-card>`
- Use `p-card` header/content/footer slots for structure, `styleClass` for layout-only utilities

**Step 6 -- Messages/alerts** (3 files, 6 instances)
- Add `message` overrides to `brand-theme.ts`: match current callout box look (tinted bg, left border, padding)
- Verify severity colors (info=blue, warn=orange, error=red, success=green) match existing hand-coded tints
- Swap colored `<div class="bg-blue-50 border-l ...">` with `<p-message [severity]="'info'" />`

**Step 7 -- Panels / collapsible sections** (5 files)
- Add `panel` overrides to `brand-theme.ts`: transparent header background, match current expand/collapse icon style, remove default header border, match current `card` surface look for the body
- Swap collapsible `<div class="card">` + click-to-toggle in `contact-detail.ts` with `<p-panel [toggleable]="true" [collapsed]="..." header="...">`
- Use `pt` for header icon if needed

### Phase 3: Lower priority

**Step 8 -- Progress bars** (4 files)
- Add `progressbar` overrides to `brand-theme.ts`: match current `h-3 rounded-lg` bar styling
- For stacked segments (opportunity.ts): use `<p-metergroup>` with value array

**Step 9 -- Buttons, toolbars, overlays**
- Button overrides already exist in `brand-theme.ts`
- Add `toolbar` overrides: transparent background, no border (match current flex header rows)
- Swap on a case-by-case basis -- some hand-coded buttons are intentional (e.g. router links styled as cards)

**Step 10 -- Detail-layout shells** (10 remaining files)
- Largest structural refactors, one page at a time
- Each page needs its own assessment of how content maps to `ux-detail-layout` tabs/slots

### Visual Parity Strategy

- **Preset-first:** All visual tokens (colors, borders, radii, padding, backgrounds, hover/active states) go into `brandOverrides.components` in `brand-theme.ts`
- **`styleClass` for layout only:** `flex`, `gap-*`, `mt-*`, `w-full`, `col-span-*`, `grid` -- context-specific layout utilities
- **`pt` (passthrough) sparingly:** Only when a component internal element needs a class not exposed by preset tokens (e.g. dashed border on divider)
- **Dark mode:** Handled centrally via `colorScheme.light` / `colorScheme.dark` in the preset -- no `dark:` classes needed on individual components
- **Theme switching:** All three presets (Soft/Crisp/Contrast) share `brandOverrides`, so changes apply everywhere
- **Log changes:** Every preset addition gets an entry in the Design-System Maintenance Ledger
