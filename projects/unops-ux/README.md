# @unopsitg/ux

Angular 21 library: UNOPS brand theme (PrimeNG / PrimeUIX), application layout shell, and shared demo types.

## Install

```bash
npm install @unopsitg/ux
```

## Bootstrap

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft, MENU_MODEL, LayoutService } from '@unopsitg/ux';
import { createDemoAppMenu } from './app/config/app-menu';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } }),
    {
      provide: MENU_MODEL,
      useFactory: (layoutService: LayoutService) =>
        createDemoAppMenu(layoutService, environment.storybookBaseUrl),
      deps: [LayoutService]
    }
  ]
};
```

## Styles and assets

Reference library SCSS/Tailwind and copy bundled logos into your app output:

```json
// angular.json — styles (library bundles layout SCSS via `assets/styles.scss`)
"styles": [
  "node_modules/@unopsitg/ux/assets/styles.scss",
  "node_modules/@unopsitg/ux/assets/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
],
"assets": [
  { "glob": "**/*", "input": "public" },
  { "glob": "**/*", "input": "node_modules/@unopsitg/ux/assets/opp", "output": "assets/opp" }
]
```

### Critical: Tailwind content scan

Library components use Tailwind utility classes (`flex`, `items-center`, `gap-2`, `bg-surface-0`, etc.). Tailwind 4 only generates utilities for classes it finds in scanned sources. **You must add a `@source` directive** in your app's `styles.scss` so Tailwind scans the library:

```scss
/* src/styles.scss */
@source "../../node_modules/@unopsitg/ux";
```

Adjust the relative path to match your folder depth. Without this, layout utilities like positioning, spacing, and backgrounds will be missing and the topbar/shell will render incorrectly.

**Verify:** after `ng serve`, check the compiled CSS for `.flex { display: flex }`. If missing, the `@source` path is wrong.

When developing **inside this monorepo**, use paths under `projects/unops-ux/src/assets/` instead of `node_modules`.

## Tokens

- `MENU_MODEL` — injectable menu tree (`MenuItem[]`).
- `SIDEBAR_LOGO` — expanded/compact logo URLs and `alt` text (defaults match UNOPS assets).
- `TOPBAR_MOBILE_LOGO` — light/dark mobile header logos.
