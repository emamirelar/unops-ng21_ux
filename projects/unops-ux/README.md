# @emamirelar/ux

Angular 21 library: UNOPS brand theme (PrimeNG / PrimeUIX), application layout shell, and shared demo types.

## Install

```bash
npm install @emamirelar/ux
```

## Bootstrap

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft, MENU_MODEL, LayoutService } from '@emamirelar/ux';
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
  "node_modules/@emamirelar/ux/assets/styles.scss",
  "node_modules/@emamirelar/ux/assets/tailwind.css",
  "src/styles.scss"
],
"assets": [
  { "glob": "**/*", "input": "node_modules/@emamirelar/ux/assets/opp", "output": "assets/opp" }
]
```

When developing **inside this monorepo**, use paths under `projects/unops-ux/src/assets/` instead of `node_modules`.

## Tokens

- `MENU_MODEL` — injectable menu tree (`MenuItem[]`).
- `SIDEBAR_LOGO` — expanded/compact logo URLs and `alt` text (defaults match UNOPS assets).
- `TOPBAR_MOBILE_LOGO` — light/dark mobile header logos.
