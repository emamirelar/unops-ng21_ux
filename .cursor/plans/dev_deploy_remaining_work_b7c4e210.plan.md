---
name: "dev-deploy: Remaining Adoption Work"
overview: "Checklist for the OpportunityPlus team to complete design library adoption on the dev-deploy branch. Phase 1 foundation swap is ~80% done — BrandSoft preset is live, Tailwind v4 is wired, and the old 5200-line Material preset is unused. What remains: delete dead files, migrate ~60 templates from unops-* classes to library palette, remove the compat bridge, swap the layout shell, and trim styles.scss."
todos:
  - id: delete-dead-files
    content: "Delete 6 legacy files that are no longer imported: unops.preset.ts, unops-design-tokens.css/.scss, primeng-unops-theme.scss, global-filters-dialog-theme.scss, unops-utilities.scss (~9K dead lines)"
    status: pending
  - id: migrate-templates
    content: "Migrate ~60 component templates from unops-* Tailwind classes to library native palette (bg-unops-primary → bg-blue-500, text-unops-neutral-600 → text-gray-600, etc.)"
    status: pending
  - id: remove-compat-bridge
    content: "Remove the @theme compat block and @utility badge definitions from src/tailwind.css (lines 9-269), leaving only the library import"
    status: pending
  - id: replace-layout
    content: "Replace public/layout/ (old Sakai-based shell) with the library's layout partials (sidebar themes, animations, tags, paginator)"
    status: pending
  - id: trim-styles
    content: "Remove recordPage.scss, detail-fields.scss, data-table.scss, info-callout.scss from styles.scss — migrate any still-needed rules into component SCSS first"
    status: pending
  - id: fix-import-path
    content: "Change tailwind.css library import from raw node_modules filesystem path to proper package asset path"
    status: pending
  - id: update-readme
    content: "Update src/styles/README.md — still references deleted unops.preset.ts and unops-design-tokens.css as active"
    status: pending
isProject: false
---

# dev-deploy: Remaining Adoption Work

## Current State (April 2026)

The `dev-deploy` branch has completed the bulk of Phase 1 from the [Design Library Adoption Advisory](design_library_adoption_advisory_1acff5a0.plan.md). Here is what is already done:

| Step | Status |
|---|---|
| Tailwind v3 → v4 upgrade (`^4.2.4`) | Done |
| `tailwind.config.js` deleted | Done |
| `@tailwindcss/postcss` + `.postcssrc.json` | Done |
| `tailwindcss-primeui` upgraded to `^0.6.1` | Done |
| Library installed (`unops-ng_ux` from GitHub) | Done |
| `BrandSoft` preset wired in `app.config.ts` | Done |
| `darkModeSelector: '.app-dark'` | Done |
| Library `styles.scss` added to `angular.json` build styles | Done |
| `border-style: none` global reset removed | Done |
| `var(--unops-*)` removed from `styles.scss` | Done |
| `var(--unops-*)` migrated in TS/HTML inline styles | Done |
| Legacy SCSS imports removed from `styles.scss` | Done (6 of 8 removed) |

**Net diff vs `development`:** -14,701 / +5,369 lines (226 files changed).

---

## What Remains

### Step 1: Delete dead legacy files (5 minutes)

These files exist on disk but **nothing imports them**. They are dead code:

```bash
git rm src/styles/themes/unops.preset.ts       # 5,212 lines — old Material preset
git rm src/styles/unops-design-tokens.css       #   885 lines — old :root CSS vars
git rm src/styles/unops-design-tokens.scss      #   345 lines — SCSS aliases
git rm src/styles/primeng-unops-theme.scss      # 1,558 lines — old PrimeNG overrides
git rm src/styles/global-filters-dialog-theme.scss # 643 lines — old dialog theme
git rm src/styles/unops-utilities.scss          #   418 lines — old .unops-* helpers
git rm src/unops-design-tokens.json             #   303 lines — JSON export
```

Verify with: `grep -r "unops\.preset\|unops-design-tokens\|primeng-unops-theme\|global-filters-dialog-theme\|unops-utilities" src/ --include="*.scss" --include="*.ts" --include="*.css"` — should return zero hits (only `README.md` mentions them).

---

### Step 2: Migrate `unops-*` Tailwind classes (~60 files)

The `src/tailwind.css` has a `@theme` compatibility bridge that defines `--color-unops-*` tokens so legacy `bg-unops-primary`, `text-unops-neutral-600`, etc. still resolve. ~60 component files and ~1,800 class occurrences need updating to the library's native palette.

#### Color mapping table

The library's brand primitives are defined in `brand-theme.ts`. Use this mapping for find-and-replace:

| Legacy `unops-*` class | Library class | Hex (for reference) |
|---|---|---|
| `*-unops-primary` | `*-blue-500` | #0092d1 |
| `*-unops-primary-light` | `*-blue-400` | #26a2d8 |
| `*-unops-primary-lighter` | `*-ocean-500` | #4ec3e0 |
| `*-unops-primary-dark` | `*-blue-600` | #007cb2 |
| `*-unops-primary-darker` | `*-blue-700` | #006692 |
| `*-unops-primary-on` | `*-white` or `text-white` | #ffffff |
| `*-unops-primary-container` | `*-blue-100` | #C9E8FF |
| `*-unops-primary-container-soft` | `*-blue-50` | #DEEFFF |
| `*-unops-primary-50` through `-900` | `*-blue-50` through `*-blue-900` | (see brand-theme.ts) |
| `*-unops-secondary` | `*-midnight-500` | #004976 |
| `*-unops-secondary-light` | `*-midnight-400` | #26648b |
| `*-unops-secondary-dark` | `*-midnight-600` | #003e64 |
| `*-unops-secondary-darker` | `*-midnight-700` | #003353 |
| `*-unops-secondary-50` through `-900` | `*-midnight-50` through `*-midnight-900` | (see brand-theme.ts) |
| `*-unops-neutral-50` through `-900` | `*-gray-50` through `*-gray-900` | (see brand-theme.ts) |
| `*-unops-neutral-grey` | `*-gray-500` | #808393 |
| `*-unops-neutral-grey-light` | `*-gray-400` | #858c99 |
| `*-unops-neutral-grey-dark` | `*-gray-600` | #808284 |
| `*-unops-neutral-black` | `*-gray-950` | #262627 |
| `*-unops-neutral-white` | `*-white` | #ffffff |
| `*-unops-error` | `*-cherry-500` | #991e66 |
| `*-unops-error-light` | `*-cherry-400` | #a8407d |
| `*-unops-error-dark` | `*-cherry-600` | #821a57 |
| `*-unops-success` | `*-green-500` | #4c9f38 |
| `*-unops-success-light` | `*-green-400` | #67ad56 |
| `*-unops-success-dark` | `*-green-600` | #418730 |
| `*-unops-warning` | `*-yellow-500` | #ffc215 |
| `*-unops-warning-dark` | `*-yellow-600` | #d9a512 |
| `*-unops-info` | `*-ocean-500` | #4ec3e0 |
| `*-unops-info-dark` | `*-ocean-600` | #42a6be |
| `*-unops-accent-teal` | `*-teal-500` | #00a997 |
| `*-unops-accent-teal-soft` | `*-teal-50` | #bfeae5 |
| `*-unops-accent-orange` | `*-orange-500` | #e85c0e |
| `*-unops-accent-cherry` | `*-cherry-500` | #991e66 |
| `*-unops-accent-lime` | `*-lime-500` | #c4d600 |
| `*-unops-accent-yellow` | `*-lemon-500` | #f8ea44 |
| `*-unops-accent-ocean` | `*-ocean-500` | #4ec3e0 |
| `*-unops-surface-primary` | `*-surface-0` or `*-white` | #ffffff |
| `*-unops-surface-secondary` | `*-surface-50` | (deepsea.50) |
| `*-unops-surface-elevated` | `*-white shadow-md` | #ffffff |
| `*-unops-midnight-blue` | `*-midnight-500` | #004976 |
| `*-unops-deep-sea` | `*-deepsea-800` | #0F172A |
| `rounded-unops-xs` through `-full` | `rounded-xs` through `rounded-full` | (standard Tailwind) |
| `shadow-unops-sm` through `-xl` | `shadow-sm` through `shadow-xl` | (standard Tailwind) |
| `font-unops-body` / `font-unops-display` | (drop — "Noto Sans" is already the default font) | |

#### Heaviest files (tackle first)

These files have the most `unops-*` occurrences:

1. `opportunity-view.component.html` + section components (~10 files, 40-130+ hits each)
2. `listview.component.html` + `listview-card.component.html`
3. `partner-tree.component.html` + `partner-view.component.html`
4. `office-detail.component.html` + office sub-components
5. `home-dashboard.component.scss`
6. `ai-prompt.component.html`
7. `login.component.html` + `sign-up.component.html`
8. Shared: `workflow.component.html`, `comment.component.html`, `document.component.html`
9. Base classes: `base-engagement-view.component.ts`, `base-engagement-list.component.ts`

#### Other token mappings

| Legacy token | Library equivalent |
|---|---|
| `spacing-unops-xs` | `1` (0.25rem) |
| `spacing-unops-sm` | `2` (0.5rem) |
| `spacing-unops-md` | `4` (1rem) |
| `spacing-unops-lg` | `6` (1.5rem) |
| `spacing-unops-xl` | `8` (2rem) |
| `text-unops-xs` | `text-xs` |
| `text-unops-sm` | `text-sm` |
| `text-unops-base` | `text-base` |
| `font-weight-unops-medium` | `font-medium` |
| `font-weight-unops-semibold` | `font-semibold` |
| `font-weight-unops-bold` | `font-bold` |
| `ease-unops-smooth` | `ease-in-out` (or use `transition` default) |
| `duration-unops-short` | `duration-200` |
| `duration-unops-medium` | `duration-300` |

---

### Step 3: Remove the compat bridge from `tailwind.css`

Once step 2 is done, `src/tailwind.css` should shrink to:

```css
@import "../node_modules/unops-ng_ux/projects/unops-ux/src/assets/tailwind.css";
```

Delete the entire `@theme { ... }` block (lines 9-226), the `@custom-variant` breakpoint aliases (lines 228-231), and the `@utility` badge definitions (lines 233-269).

The badge utilities (`bg-badge-success`, `text-badge-warn`, etc.) should be moved to Tailwind `@utility` definitions in the library's `tailwind.css` if they are still needed, or replaced with PrimeNG `p-tag` severity styling.

---

### Step 4: Replace `public/layout/`

The `public/layout/` directory still contains the old Sakai-based layout shell:

```
public/layout/
├── _core.scss, _footer.scss, _main.scss, _menu.scss
├── _mixins.scss, _preloading.scss, _responsive.scss
├── _topbar.scss, _typography.scss, _utils.scss
├── layout.scss
└── variables/ (_common.scss, _light.scss, _dark.scss)
```

The library's layout partials (already in the build via `angular.json`) include everything above plus:
- Sidebar theme system (`_primary.scss`, `_dark.scss`, `_light.scss`, `_sidebar_theme_core.scss`)
- `_tags.scss` — shared tag variants
- `_paginator.scss` — single-row paginator
- `_animations.scss` — page entrance + card hover
- `_card.scss` — `.card` base
- `_breadcrumb.scss`

Remove the old `public/layout/` and its `@use` from `styles.scss` (if still referenced). The library's layout is already loaded via the `angular.json` styles array entry `node_modules/unops-ng_ux/projects/unops-ux/src/assets/styles.scss`.

---

### Step 5: Trim `styles.scss`

Current `styles.scss` still imports 4 small SCSS files:

```scss
@use './styles/themes/styles/recordPage.scss';
@use './styles/detail-fields.scss';
@use './styles/data-table.scss';
@use './styles/info-callout.scss';
```

For each file:
1. Check if any selector is still used in templates (`grep -r "record-page-\|detail-label\|detail-value\|data-table\|info-callout" src/app/`)
2. If used: migrate rules into the relevant component's `.component.scss` using `:host` scoping
3. If unused: delete
4. Remove the `@use` from `styles.scss`

**Target state** — `styles.scss` has only global resets (scrollbar, body font) and the `@reference` to tailwind. Layout + primeicons come from `angular.json`.

---

### Step 6: Fix the library import path

`src/tailwind.css` currently imports via a raw filesystem path:

```css
@import "../node_modules/unops-ng_ux/projects/unops-ux/src/assets/tailwind.css";
```

This bypasses ng-packagr and reaches into the library source. Once the library publishes assets via its `ng-package.json`, change to the package path (the exact path depends on how the library publishes — check `node_modules/@emamirelar/ux/` after install).

---

### Step 7: Update `src/styles/README.md`

The README still says:
- "PrimeNG component appearance is driven primarily by `unops.preset.ts` (Material-based preset)" — **wrong**, it's now `BrandSoft` from the library
- References `unops-design-tokens.css` — **deleted**
- References `unops-utilities.scss` — **deleted**

Update to reflect the current `BrandSoft` + library tailwind + library layout architecture.

---

## Verification checklist

After completing all steps, run these checks:

```bash
# No unops-* Tailwind classes remain in templates
grep -r "unops-primary\|unops-secondary\|unops-neutral\|unops-error\|unops-success\|unops-warning\|unops-info\|unops-surface\|unops-accent" src/app/ --include="*.html" --include="*.ts" --include="*.scss"
# Expected: zero hits

# No dead legacy files
ls src/styles/themes/unops.preset.ts src/styles/unops-design-tokens.* src/styles/primeng-unops-theme.scss src/styles/global-filters-dialog-theme.scss src/styles/unops-utilities.scss 2>&1
# Expected: "No such file or directory" for all

# No --unops-* CSS custom properties
grep -r "\-\-unops-" src/ --include="*.css" --include="*.scss" --include="*.ts" --include="*.html"
# Expected: zero hits

# tailwind.css is just the library import
wc -l src/tailwind.css
# Expected: 1 line

# styles.scss has ≤3 @use imports (primeicons, tailwind ref, maybe 1 app-specific)
grep "@use\|@import\|@reference" src/styles.scss
# Expected: ≤3 lines

# Build succeeds
ng build --configuration development
```

---

## Timeline estimate

| Step | Effort | Risk |
|---|---|---|
| 1. Delete dead files | 5 min | Zero — files are not imported |
| 2. Migrate templates | 2-3 days | Low — mechanical find-replace, but verify visually |
| 3. Remove compat bridge | 10 min | Zero — depends on step 2 |
| 4. Replace layout | 0.5-1 day | Medium — test sidebar, responsive, dark mode |
| 5. Trim styles.scss | 2 hours | Low — check grep, move to component SCSS |
| 6. Fix import path | 10 min | Low |
| 7. Update README | 15 min | Zero |

**Total: ~3-4 days of focused work** to complete Phase 1 and enter Phase 2 (page-by-page rebuilds).
