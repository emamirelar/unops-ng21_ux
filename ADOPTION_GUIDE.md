# Adopting `@unopsitg/ux` in the OpportunityPlus App

Step-by-step guide for the OpportunityPlus team to replace the legacy Material-based styling with the `@unopsitg/ux` design library.

**Time estimate:** ~30 minutes for Phase 1 (foundation swap). Phase 2 is page-by-page rebuild.

---

## Prerequisites

| Requirement | Version |
|---|---|
| Angular | ^21 |
| PrimeNG | ^21.0.4 |
| `@primeuix/themes` | ^2.0.0 |
| PrimeIcons | ^7.0.0 |
| RxJS | ~7.8.0 |
| Tailwind CSS | ^4 |

---

## Phase 1: Install and Wire Up

### 1. Install the package

The package is published publicly on npmjs — no registry configuration or auth tokens needed:

```bash
npm install @unopsitg/ux@21.0.0
```

### 2. Delete the legacy theme preset

```bash
rm src/styles/themes/unops.preset.ts
```

This is the ~5200-line Material-based PrimeNG preset. It is entirely replaced by `BrandSoft` from the library.

### 3. Update `app.config.ts`

Replace the old preset import with the library:

```typescript
// BEFORE
import { providePrimeNG } from 'primeng/config';
import { MyAppPreset } from './styles/themes/unops.preset';

// AFTER
import { providePrimeNG } from 'primeng/config';
import { BrandSoft, MENU_MODEL, LayoutService, type MenuItem } from '@unopsitg/ux';
```

Update the providers array:

```typescript
export const appConfig: ApplicationConfig = {
    providers: [
        // ... your existing providers (router, http, auth, i18n, etc.)

        // Theme: replaces the Material preset with Aura-based BrandSoft
        providePrimeNG({
            theme: {
                preset: BrandSoft,
                options: { darkModeSelector: '.app-dark' }
            }
        }),

        // Sidebar menu: provide your app's navigation tree
        {
            provide: MENU_MODEL,
            useFactory: (ls: LayoutService): MenuItem[] => [
                { label: 'Home', icon: 'pi pi-home', routerLink: ['/'] },
                { separator: true },
                {
                    label: 'Partnerships',
                    icon: 'pi pi-th-large',
                    path: '/partnerships',
                    items: [
                        { label: 'Partners', icon: 'pi pi-globe', routerLink: ['/partners'] },
                        { label: 'Contacts', icon: 'pi pi-users', routerLink: ['/contacts'] },
                        { label: 'Opportunities', icon: 'pi pi-briefcase', routerLink: ['/opportunities'] }
                    ]
                },
                // ... add your full menu tree here
            ],
            deps: [LayoutService]
        }

        // Optional: override logos (defaults are UNOPS logos, no action needed if fine)
        // { provide: SIDEBAR_LOGO, useValue: { expanded: '...', compact: '...', alt: 'OPP+' } }
    ]
};
```

### 4. Update `angular.json`

#### Styles — replace all legacy SCSS with library styles

```json
"styles": [
    "node_modules/@unopsitg/ux/assets/styles.scss",
    "node_modules/@unopsitg/ux/assets/tailwind.css",
    "src/styles.scss"
]
```

#### Assets — copy library logos into the build output

Add to the `assets` array:

```json
{
    "glob": "**/*",
    "input": "node_modules/@unopsitg/ux/assets/opp",
    "output": "assets/opp"
}
```

### 5. Simplify `src/styles.scss`

Replace the current 11-import file. Each removed import has a specific library replacement:

```scss
// BEFORE — 11 imports
@use './styles/unops-design-tokens.scss' as unops;      // REMOVE → replaced by --p-* tokens from BrandSoft
@use './tailwind.css';                                    // REMOVE → replaced by library's tailwind.css in angular.json
@use '../public/layout/layout.scss';                      // REMOVE → replaced by library's styles.scss in angular.json
@use 'primeicons/primeicons.css';                         // KEEP
@use './styles/primeng-unops-theme.scss';                 // REMOVE → replaced by BrandSoft component overrides
@use './styles/global-filters-dialog-theme.scss';         // REMOVE → replaced by BrandSoft p-dialog tokens
@use './styles/unops-utilities.scss';                     // REMOVE → replaced by library's Tailwind @utility defs
@use './styles/themes/styles/recordPage.scss';            // KEEP temporarily during Phase 2 (legacy pages need it)
@use './styles/detail-fields.scss';                       // KEEP temporarily during Phase 2
@use './styles/data-table.scss';                          // KEEP temporarily during Phase 2
@use './styles/info-callout.scss';                        // KEEP temporarily during Phase 2
```

**Immediate replacement** (Phase 1):

```scss
// AFTER — only PrimeIcons + legacy page styles kept during Phase 2
@use 'primeicons/primeicons.css';
@use './styles/themes/styles/recordPage.scss';
@use './styles/detail-fields.scss';
@use './styles/data-table.scss';
@use './styles/info-callout.scss';
```

The library's `styles.scss` and `tailwind.css` are already loaded via `angular.json` (step 4), so they don't appear in `styles.scss`. PrimeNG tokens come from `BrandSoft` via `providePrimeNG`.

**Final state** (after Phase 3 — all pages rebuilt):

```scss
// FINAL — only PrimeIcons remains
@use 'primeicons/primeicons.css';
```

The four `KEEP temporarily` imports are deleted in Phase 3 once every page that references them has been rebuilt.

### 6. Update route shells

In your `app.routes.ts`, import layout shells from the library:

```typescript
import { AppLayout, AuthLayout } from '@unopsitg/ux';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            // ... your feature routes
        ]
    },
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            // ... login, register, etc.
        ]
    }
];
```

### 7. Delete legacy layout components

The library provides the full app shell. Delete the old layout folder and every file in it:

```bash
rm -rf src/app/layouts/
```

This removes the prod app's local copies of all of these (now provided by `@unopsitg/ux`):

| Deleted file | Library replacement |
|---|---|
| `src/app/layouts/app-layout.component.ts` | `AppLayout` from `@unopsitg/ux` |
| `src/app/layouts/app-layout.component.html` | (inline template in library) |
| `src/app/layouts/app-sidebar.component.ts` | `AppSidebar` from `@unopsitg/ux` |
| `src/app/layouts/app-sidebar.component.html` | (inline template in library) |
| `src/app/layouts/app-topbar.component.ts` | `AppTopbar` from `@unopsitg/ux` |
| `src/app/layouts/app-topbar.component.html` | (inline template in library) |
| `src/app/layouts/app-menu.component.ts` | `AppMenu` from `@unopsitg/ux` |
| `src/app/layouts/app-menu.component.html` | (inline template in library) |
| `src/app/layouts/app-menuitem.component.ts` | `AppMenuitem` from `@unopsitg/ux` |
| `src/app/layouts/app-breadcrumb.component.ts` | `AppBreadcrumb` from `@unopsitg/ux` |
| `src/app/layouts/app-footer.component.ts` | `AppFooter` from `@unopsitg/ux` |
| `src/app/layouts/app-configurator.component.ts` | `AppConfigurator` from `@unopsitg/ux` |
| `src/app/layouts/app-right-menu.component.ts` | `AppRightMenu` from `@unopsitg/ux` |
| `src/app/layouts/app-search.component.ts` | `AppSearch` from `@unopsitg/ux` |
| `src/app/layouts/layout.service.ts` | `LayoutService` from `@unopsitg/ux` |
| Any `.scss` files in the folder | Library's built-in SCSS |
| Any `index.ts` / barrel file | Library barrel exports |

If the prod repo uses different filenames or a different folder name (e.g. `src/app/layout/` instead of `src/app/layouts/`), adjust accordingly — but delete **all** layout shell components and the layout service.

### 8. Delete `public/layout/` (the old layout SCSS)

```bash
rm -rf public/layout/
```

This removes all legacy layout SCSS partials. The library's `styles.scss` (referenced in `angular.json` step 4) already bundles the full layout SCSS including:

| Deleted file | Library replacement |
|---|---|
| `public/layout/layout.scss` | `node_modules/@unopsitg/ux/assets/styles.scss` (in `angular.json`) |
| `public/layout/variables/_common.scss` | Bundled in library |
| `public/layout/_sass_variables.scss` | Bundled in library |
| `public/layout/_card.scss` | Bundled in library |
| `public/layout/_animations.scss` | Bundled in library |
| `public/layout/sidebar/` (all files) | Bundled in library |
| `public/layout/_sidebar_compact.scss` | Bundled in library |
| `public/layout/_responsive.scss` | Bundled in library |
| Any other SCSS partials in the folder | Bundled in library |

### 9. Delete the prod app's local `tailwind.css`

```bash
rm src/tailwind.css
```

The library's `tailwind.css` (referenced in `angular.json` step 4 as `node_modules/@unopsitg/ux/assets/tailwind.css`) replaces it entirely with the UNOPS brand color scales, animation tokens, typography utilities, and dark mode configuration.

### 10. Verify

```bash
ng serve
```

The app shell (sidebar, topbar, breadcrumbs, configurator) should render with the UNOPS brand. Existing pages will look different — that's expected because the Material theme is gone. They'll be rebuilt in Phase 2.

---

## Phase 2: Page-by-Page Rebuild

Rebuild pages in priority order using library patterns as reference. The design library Storybook is the visual spec.

| Priority | Page | Library Archetype | Import Pattern |
|---|---|---|---|
| 1 | Partners List | `app-partners` | `p-dataview` + search + filter chips |
| 2 | Home Dashboard | `app-dashboard` | Stat cards + chart widgets |
| 3 | Opportunity Detail | `app-opportunity` | Timeline + table + accordion + AI sidebar |
| 4 | Contact List + Detail | `app-partners` / `app-partner-detail` | Same patterns, different fields |
| 5 | Interactions | `app-mail-inbox` / `app-mail-detail` | Three-pane communication layout |
| 6 | Agreements | `app-agreements` | Activity feed + table + drawer |
| 7 | Office Detail | `app-partner-detail-v2` | Tabbed detail |
| 8 | Admin Pages | `app-tasklist` + `app-files` | Filter sidebar + table + drawer |

### Rules for new pages

1. **No custom SCSS files** — use Tailwind utilities and the `.card` class only
2. **No `--unops-*` variables** — use `--p-*` tokens (auto-generated by PrimeNG from `BrandSoft`)
3. **No `::ng-deep`** — if a PrimeNG component needs styling, raise it to the library's `brand-theme.ts`
4. **No inline `style` with hard-coded values** — use design tokens
5. **Storybook is the spec** — if your page doesn't match the story, fix the page

### Using LayoutService from the library

```typescript
import { LayoutService } from '@unopsitg/ux';

export class MyComponent {
    private layoutService = inject(LayoutService);

    isDark = computed(() => this.layoutService.isDarkTheme());
}
```

---

## Phase 3: Legacy Cleanup

Once **all** pages are rebuilt using library patterns, delete every remaining legacy styling file. These files are only kept during Phase 2 because existing unrebuilt pages still reference them.

### Files to delete

Check off each file as you delete it. If a file has already been removed during Phase 1, skip it.

#### Legacy design tokens

```bash
rm src/styles/unops-design-tokens.css
rm src/styles/unops-design-tokens.scss
```

| File | What it contained | Library replacement |
|---|---|---|
| `src/styles/unops-design-tokens.css` | 900+ `--unops-*` CSS custom properties (primary, secondary, accent, neutral, surface, spacing, shadow, typography, animation) | PrimeNG auto-generated `--p-*` tokens from `BrandSoft` + Tailwind `@theme` color tokens from `tailwind.css` |
| `src/styles/unops-design-tokens.scss` | SCSS `@use` wrapper that re-exported the CSS tokens | Deleted with the CSS file |

#### Legacy PrimeNG overrides

```bash
rm src/styles/primeng-unops-theme.scss
rm src/styles/global-filters-dialog-theme.scss
```

| File | What it contained | Library replacement |
|---|---|---|
| `src/styles/primeng-unops-theme.scss` | Layer-3 PrimeNG component overrides (icon fields, overlays, tabs, spinners) | `brand-theme.ts` component overrides (button, tag) at the theme preset level |
| `src/styles/global-filters-dialog-theme.scss` | Custom `p-dialog` styling for global filter dialogs | Standard `p-dialog` styling from `BrandSoft` preset |

#### Legacy utility and page-specific SCSS

```bash
rm src/styles/unops-utilities.scss
rm src/styles/themes/styles/recordPage.scss
rm src/styles/detail-fields.scss
rm src/styles/data-table.scss
rm src/styles/info-callout.scss
```

| File | What it contained | Library replacement |
|---|---|---|
| `src/styles/unops-utilities.scss` | Custom utility classes (typography helpers, spacing shortcuts) | Tailwind `@utility` definitions in library's `tailwind.css` (typography, stagger, badge, button utilities) |
| `src/styles/themes/styles/recordPage.scss` | Record/detail page layout overrides | Tailwind utilities + `.card` class from library's `_card.scss` |
| `src/styles/detail-fields.scss` | Definition list / detail field styling | Tailwind utilities + PrimeNG `p-divider` / grid system |
| `src/styles/data-table.scss` | `p-table` customizations | `BrandSoft` preset's table tokens + Tailwind utilities |
| `src/styles/info-callout.scss` | Info/warning callout box styles | PrimeNG `p-message` / `p-inlinemessage` from `BrandSoft` |

#### Empty the styles folder (if now empty)

```bash
# Check if anything remains
ls src/styles/

# If empty, delete the folder
rmdir src/styles/
# Or if the themes subfolder is also empty:
rmdir src/styles/themes/styles/ src/styles/themes/ src/styles/
```

#### Already deleted in Phase 1 (confirm these are gone)

These should have been removed in Phase 1. Verify they no longer exist:

```bash
# Should all return "No such file or directory"
ls src/styles/themes/unops.preset.ts       # Deleted in Phase 1, step 2
ls src/app/layouts/                          # Deleted in Phase 1, step 7
ls public/layout/                            # Deleted in Phase 1, step 8
ls src/tailwind.css                          # Deleted in Phase 1, step 9
```

### Final verification

```bash
# 1. Grep for any remaining legacy --unops-* tokens
grep -rn '\-\-unops-' src/ --include='*.ts' --include='*.scss' --include='*.css' --include='*.html'

# 2. Grep for any remaining imports of deleted files
grep -rn "unops-design-tokens\|primeng-unops-theme\|global-filters-dialog\|unops-utilities\|recordPage\|detail-fields\|data-table\|info-callout" src/ --include='*.ts' --include='*.scss'

# 3. Grep for any remaining references to the old layout folder
grep -rn "public/layout\|../layout/layout" src/ --include='*.ts' --include='*.scss' --include='*.html'

# 4. Build to confirm no broken imports
ng build
```

All four commands must be clean (no matches, no build errors). If any remain, fix the references to use `@unopsitg/ux` imports or Tailwind utilities, then re-run.

---

## Quick Reference: What's Exported from `@unopsitg/ux`

### Theme

| Export | Purpose |
|---|---|
| `BrandSoft` | Default PrimeNG preset (Aura + UNOPS overrides) |
| `BrandCrisp` | Lara-based alternative |
| `BrandContrast` | Nora-based high-contrast alternative |
| `brandPresets` | Map of all three: `{ Soft, Crisp, Contrast }` |
| `brandPrimitives` | Raw color scales (17 families, 50-950) |

### Layout Components

| Export | Selector | Purpose |
|---|---|---|
| `AppLayout` | `app-layout` | Main app shell (sidebar + content + overlays) |
| `AuthLayout` | `auth-layout` | Auth pages shell (router-outlet + config button) |
| `AppSidebar` | `[app-sidebar]` | Sidebar navigation |
| `AppTopbar` | `[app-topbar]` | Top bar (search, notifications, profile) |
| `AppMenu` | `[app-menu]` | Menu tree (consumes `MENU_MODEL`) |
| `AppMenuitem` | `[app-menuitem]` | Recursive menu item |
| `AppBreadcrumb` | `[app-breadcrumb]` | Breadcrumb trail |
| `AppFooter` | `[app-footer]` | Footer |
| `AppSearch` | `[app-search]` | Search dialog |
| `AppRightMenu` | `[app-rightmenu]` | Right drawer |
| `AppConfigurator` | `app-configurator` | Theme/settings drawer |

### Services

| Export | Purpose |
|---|---|
| `LayoutService` | Layout state signals: dark mode, menu mode, sidebar state |
| `LayoutConfig` | Interface for layout configuration |

### Injection Tokens

| Token | Purpose | Default |
|---|---|---|
| `MENU_MODEL` | Sidebar menu tree (`MenuItem[]`) | **Required** — throws if not provided |
| `SIDEBAR_LOGO` | Sidebar logo paths (expanded/compact) + alt text | UNOPS logos |
| `TOPBAR_MOBILE_LOGO` | Mobile header logos (dark/light) + alt text | UNOPS logos |

### Types

All shared interfaces from the design library: `Partner`, `Customer`, `Country`, `Representative`, `Member`, `Metric`, `Mail`, `Message`, `User`, `Blog`, `Chat`, `Image`, `Folder`, `Product`, `File`, `DialogConfig`, `KanbanCardType`, `KanbanListType`, etc.
