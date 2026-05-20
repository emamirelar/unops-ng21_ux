# Integrating `@unopsitg/ux` in an Angular Application

This guide documents how to wire the UNOPS shared UX package into an Angular + PrimeNG app. It is based on the FieldCore **Glass** integration (`src/glass/`) and lessons from debugging a broken topbar (missing Tailwind utilities).

**Package:** [@unopsitg/ux on npm](https://www.npmjs.com/package/@unopsitg/ux)  
**Repository:** [opp_plus/unops-ng21_ux](https://github.com/opp_plus/unops-ng21_ux)

---

## What you get

| Layer | Exports | Purpose |
|-------|---------|---------|
| Theme | `BrandSoft`, `BrandCrisp`, `BrandContrast` | PrimeUIX presets with UNOPS colour primitives |
| Layout shell | `AppLayout`, `AuthLayout`, `LayoutService` | Sidebar + topbar + content area (Sakai-style) |
| Menu | `MENU_MODEL`, `MenuItem` | Injectable sidebar navigation tree |
| Branding tokens | `SIDEBAR_LOGO`, `TOPBAR_MOBILE_LOGO` | Optional logo overrides |
| Page patterns | `DetailLayoutComponent`, `UxSelectComponent`, … | Optional; use where they fit product screens |

`BrandSoft` is the default UNOPS look (Aura-based). Use `BrandCrisp` (Lara) or `BrandContrast` (Nora) if product design requires it.

---

## Requirements

Align **major versions** across the stack. Mismatches cause peer dependency warnings or subtle runtime issues.

| Dependency | Version |
|------------|---------|
| `@angular/*` | **^21** |
| `primeng` | **^21.0.4** |
| `@primeuix/themes` | **^2** |
| `primeicons` | **^7** |
| `tailwindcss` | **^4** (with PostCSS pipeline) |
| `tailwindcss-primeui` | Required by library `tailwind.css` |
| `@tailwindcss/postcss` | PostCSS plugin for Tailwind 4 |

Angular 19/20 apps must upgrade to Angular 21 before installing `@unopsitg/ux` (upgrade one major at a time: `ng update @angular/core@20` then `@21`).

---

## 1. Install packages

From your Angular app directory (e.g. `src/glass/`):

```bash
npm install @unopsitg/ux primeng primeicons @primeuix/themes \
  tailwindcss @tailwindcss/postcss tailwindcss-primeui
```

Ensure `@angular/animations` is installed (PrimeNG overlays need it).

---

## 2. PostCSS (Tailwind 4)

Create `postcss.config.mjs` at the app root:

```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

Angular’s application builder picks this up automatically; no extra `angular.json` entry is required for PostCSS itself.

---

## 3. Global styles and assets (`angular.json`)

Add library styles **before** your app `styles.scss`. Order matters: layout SCSS, then Tailwind entry, then PrimeIcons, then app overrides.

```json
"styles": [
  "node_modules/@unopsitg/ux/assets/styles.scss",
  "node_modules/@unopsitg/ux/assets/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
],
"assets": [
  { "glob": "**/*", "input": "public" },
  {
    "glob": "**/*",
    "input": "node_modules/@unopsitg/ux/assets/opp",
    "output": "assets/opp"
  }
]
```

Mirror the same `styles` and `assets` blocks on the **test** target if you run `ng test`.

Copy the `assets/opp` entry unless you override `SIDEBAR_LOGO` / `TOPBAR_MOBILE_LOGO` with your own URLs.

---

## 4. Host `styles.scss` — critical Tailwind content scan

The library’s layout shell (topbar dropdowns, flyouts, Tailwind layout utilities) uses classes such as `hidden`, `flex`, `fixed`, `animate-scalein`, `bg-surface-0`, `dark:bg-surface-900`. Those utilities are **not** all shipped pre-built in `tailwind.css`; Tailwind 4 generates them only for classes found in scanned sources.

**If you skip this step**, notification/language/profile panels stay visible in the document flow and the header looks broken (plain stacked text across the top of the page).

In your app `src/styles.scss` (loaded **after** the library `tailwind.css` in `angular.json`):

```scss
/* Scan the UX package so Tailwind emits utilities used in its components */
@source "../../node_modules/@unopsitg/ux";

/* Optional: scan your own templates too */
@source "../**/*.{html,ts}";

*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
```

Adjust the `@source` path to match your folder depth (path is relative to `styles.scss`). From `src/glass/src/styles.scss`, `../../node_modules/@unopsitg/ux` is correct.

**Verify:** After `ng build` or `ng serve`, open compiled `styles.css` and confirm rules exist for `.hidden` (e.g. `display: none`). If `.hidden` is missing, topbar flyouts will not collapse.

Do **not** re-import `@import "tailwindcss"` in app `styles.scss` if you already load `node_modules/@unopsitg/ux/assets/tailwind.css` in `angular.json` — that duplicates Tailwind and can confuse token order.

---

## 5. Typography (`index.html`)

Layout CSS expects **Noto Sans**. Add to `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

Remove conflicting app fonts (e.g. Inter) unless you intentionally override `--font-sans`.

---

## 6. Bootstrap PrimeNG theme (`app.config.ts`)

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft, MENU_MODEL, LayoutService } from '@unopsitg/ux';
import { createAppMenu } from './config/app-menu';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: BrandSoft,
        options: { darkModeSelector: '.app-dark' },
      },
    }),
    {
      provide: MENU_MODEL,
      useFactory: (layoutService: LayoutService) => createAppMenu(layoutService),
      deps: [LayoutService],
    },
    // ... router, http, etc.
  ],
};
```

Dark mode is toggled by adding/removing `.app-dark` on `<html>`. The topbar control and `LayoutService.toggleDarkMode()` use the same contract.

### Optional: sync theme on startup

`LayoutService` defaults to `darkTheme: true`, but the first internal effect can skip applying `.app-dark` to `<html>`. Until the user toggles theme, PrimeNG may stay light while config says dark.

For a predictable first paint, add an initializer:

```typescript
import { APP_INITIALIZER, inject } from '@angular/core';
import { LayoutService } from '@unopsitg/ux';

function initUxTheme(): () => void {
  const layout = inject(LayoutService);
  return () => {
    // Light shell on first load:
    layout.layoutConfig.update((c) => ({ ...c, darkTheme: false }));
    layout.toggleDarkMode({ ...layout.layoutConfig(), darkTheme: false });
    // Or for dark-first: layout.toggleDarkMode({ ...layout.layoutConfig(), darkTheme: true });
  };
}

// In providers:
{ provide: APP_INITIALIZER, useFactory: initUxTheme, multi: true },
```

---

## 7. Application shell

### Root component

`AppLayout` includes an internal `<router-outlet>`. Host it for all authenticated routes; use a bare outlet only for routes that must not show the shell (e.g. account locked).

```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayout } from '@unopsitg/ux';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppLayout],
  template: `
    @if (useBareOutlet()) {
      <router-outlet />
    } @else {
      <app-layout />
    }
  `,
})
export class AppComponent {
  // e.g. signal updated from router events when url starts with '/locked'
}
```

### Menu model

Create `src/app/config/app-menu.ts`:

```typescript
import type { LayoutService, MenuItem } from '@unopsitg/ux';

export function createAppMenu(_layoutService: LayoutService): MenuItem[] {
  return [
    { label: 'Home', icon: 'pi pi-home', routerLink: ['/'] },
    {
      label: 'Admin',
      icon: 'pi pi-cog',
      items: [
        { label: 'Settings', icon: 'pi pi-sliders-h', routerLink: ['/admin/settings'] },
      ],
    },
  ];
}
```

Use `routerLink: ['/path']` (array form). Nested `items` become submenu groups in the sidebar.

### Auth / minimal chrome routes

`AuthLayout` is a route wrapper with its own `<router-outlet>` (no sidebar). Use for login, locked account, password reset, etc.

```typescript
import { Routes } from '@angular/router';
import { AuthLayout } from '@unopsitg/ux';

export const routes: Routes = [
  {
    path: 'locked',
    component: AuthLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/auth/locked.component').then((m) => m.LockedComponent),
      },
    ],
  },
  // ... main app routes (render inside AppLayout outlet)
];
```

### Alternative: `AppLayout` as route parent

Some teams prefer:

```typescript
{
  path: '',
  component: AppLayout,
  children: [ /* all feature routes */ ],
}
```

with `app-root` template `<router-outlet />` only. Both patterns are valid; FieldCore uses static `<app-layout />` plus child routes targeting the layout’s internal outlet.

---

## 8. Optional branding tokens

Defaults use bundled assets under `assets/opp/`. Override in `app.config.ts`:

```typescript
import { SIDEBAR_LOGO, TOPBAR_MOBILE_LOGO } from '@unopsitg/ux';

{
  provide: SIDEBAR_LOGO,
  useValue: {
    expanded: 'assets/opp/AppLogo/AppLogo-onLight_H.svg',
    compact: 'assets/opp/AppLogo/AppLogo-onDark_compact.svg',
    alt: 'My Application',
  },
},
```

---

## 9. Bundle size

The UX shell adds roughly **700KB–1MB** to the initial JS bundle (layout, configurator, demo topbar widgets). Adjust `angular.json` budgets, e.g.:

```json
{
  "type": "initial",
  "maximumWarning": "1.5MB",
  "maximumError": "2MB"
}
```

---

## 10. Verification checklist

After `ng serve`:

| Check | Expected |
|-------|----------|
| Sidebar visible with menu items from `MENU_MODEL` | Records / your labels |
| Topbar shows icons only; **no** stacked notification/language/profile text | Panels hidden until clicked |
| Compiled `styles.css` contains `.hidden` | `display: none` rule present |
| `<html>` class | `.app-dark` when dark mode selected |
| Logos | No 404 on `assets/opp/...` |
| Feature route | Content inside `.layout-content` (e.g. tables, forms) |
| Console | No `MENU_MODEL is not provided` error |

**Broken topbar symptom:** notification list, language flags, and profile links visible as plain text at the top → missing `@source` scan (Section 4).

---

## 11. FieldCore reference implementation

| File | Role |
|------|------|
| [src/glass/package.json](../../src/glass/package.json) | Dependency versions |
| [src/glass/angular.json](../../src/glass/angular.json) | Styles, assets, budgets |
| [src/glass/src/styles.scss](../../src/glass/src/styles.scss) | App global CSS (add `@source` here if not present yet) |
| [src/glass/src/app/app.config.ts](../../src/glass/src/app/app.config.ts) | `BrandSoft`, `MENU_MODEL` |
| [src/glass/src/app/app.component.ts](../../src/glass/src/app/app.component.ts) | `AppLayout` shell |
| [src/glass/src/app/app.routes.ts](../../src/glass/src/app/app.routes.ts) | `AuthLayout` for `/locked` |
| [src/glass/src/app/config/fieldcore-menu.ts](../../src/glass/src/app/config/fieldcore-menu.ts) | Sidebar menu tree |

---

## 12. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| Topbar flyouts always visible, overlapping text | Tailwind utilities not generated | Section 4: `@source` for `@unopsitg/ux` |
| Sidebar OK, empty main area | Router outlet not under `AppLayout` | Section 7 routing |
| `MENU_MODEL is not provided` | Missing provider | Section 6 |
| Wrong logo on light background | `darkTheme: true` but no `.app-dark` on `<html>` | Section 6 initializer |
| Fonts look wrong | Noto Sans not loaded | Section 5 |
| 404 on `demo/images/...` | Demo notification avatars in shell | Expected; replace or hide demo topbar later |
| Peer dependency errors | Angular/PrimeNG too old | Upgrade to 21.x |
| Huge production bundle failure | Default 500kB budget | Section 9 |

---

## 13. What to customize later

- **Demo chrome:** `AppTopbar` includes search, notifications, language picker, and `AppConfigurator` — fine for internal tools; trim or hide for production FieldCore-style apps.
- **Feature pages:** Prefer `var(--p-*)` tokens over hardcoded `#fff` cards so content matches shell light/dark mode.
- **`ux-detail-layout`:** Use for entity/detail screens with tabs and optional right sidebar (see package types / npm readme).

---

## Quick copy-paste checklist

1. `npm install @unopsitg/ux primeng @primeuix/themes tailwindcss @tailwindcss/postcss tailwindcss-primeui`
2. `postcss.config.mjs` with `@tailwindcss/postcss`
3. `angular.json` styles + `assets/opp`
4. `styles.scss` → **`@source` path to `@unopsitg/ux`** (required)
5. `index.html` → Noto Sans
6. `app.config.ts` → `providePrimeNG({ preset: BrandSoft })` + `MENU_MODEL`
7. `app.component` → `<app-layout />` + menu factory
8. Verify `.hidden` in built CSS and topbar flyouts collapse
