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
import { Router } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft, MENU_MODEL, TOPBAR_PROFILE_MENU_CONFIG, LayoutService } from '@unopsitg/ux';
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
    },
    {
      provide: TOPBAR_PROFILE_MENU_CONFIG,
      useFactory: (router: Router) => ({
        items: [
          { id: 'profile', label: 'Profile', icon: 'pi pi-user', command: () => router.navigate(['/profile']) },
          { id: 'logout', label: 'Log out', icon: 'pi pi-power-off', separator: true, command: () => router.navigate(['/logout']) },
        ],
      }),
      deps: [Router],
    }
  ]
};
```

## Styles and assets

Reference library SCSS/Tailwind and copy bundled logos into your app output:

### PostCSS configuration

Angular 21's `application` builder (esbuild) only loads JSON-format PostCSS configs. Create `.postcssrc.json` in the project root:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

> **Warning:** `.mjs` configs (`postcss.config.mjs`) are silently ignored by esbuild. If Tailwind directives pass through unprocessed, check the config format first.

### angular.json styles and assets

```json
"styles": [
  "node_modules/@unopsitg/ux/assets/styles.scss",
  "src/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
],
"assets": [
  { "glob": "**/*", "input": "public" },
  { "glob": "**/*", "input": "node_modules/@unopsitg/ux/assets/opp", "output": "assets/opp" }
]
```

### Tailwind content scan

Library components use Tailwind utility classes. Tailwind 4 only generates utilities for classes it finds in scanned sources. The library's `assets/tailwind.css` contains a `@source "../fesm2022"` directive, but Angular resolves this relative to the **project root** — not the package directory. To fix path resolution, create a thin wrapper CSS file:

```css
/* src/tailwind.css */
@import "../node_modules/@unopsitg/ux/assets/tailwind.css";
@source "../node_modules/@unopsitg/ux/fesm2022";
```

Reference `src/tailwind.css` in `angular.json` styles (as shown above) instead of the library file directly. The `@source` in your wrapper resolves from the project root where Angular actually runs PostCSS.

> **Do not** put `@source` directives in `.scss` files — Sass copies them as inert text and PostCSS/Tailwind never processes them.

**Verify:** after `ng serve`, check the compiled CSS for `.flex { display: flex }`. If missing, the `@source` path is wrong.

When developing **inside this monorepo**, use paths under `projects/unops-ux/src/assets/` instead of `node_modules`.

## Tokens

- `MENU_MODEL` — injectable menu tree (`MenuItem[]`).
- `SIDEBAR_LOGO` — expanded/compact logo URLs and `alt` text (defaults match UNOPS assets).
- `TOPBAR_MOBILE_LOGO` — light/dark mobile header logos.
- `TOPBAR_PROFILE_MENU_CONFIG` — profile dropdown menu items (array of `{ id, label, icon, command?, separator? }`).

## Theme initialization

`LayoutService` defaults to `darkTheme: true`. The internal effect that applies `.app-dark` to `<html>` may be skipped on first render, causing a flash of light mode. Use an `APP_INITIALIZER` to synchronize the theme at startup:

```typescript
import { APP_INITIALIZER } from '@angular/core';
import { LayoutService } from '@unopsitg/ux';

function initUxTheme(layoutService: LayoutService): () => void {
  return () => {
    layoutService.toggleDarkMode();
  };
}

// Add to providers:
{ provide: APP_INITIALIZER, useFactory: initUxTheme, deps: [LayoutService], multi: true }
```

If your app should start in light mode, set the config before toggling:

```typescript
function initUxTheme(layoutService: LayoutService): () => void {
  return () => {
    layoutService.layoutConfig.update(c => ({ ...c, darkTheme: false }));
    layoutService.toggleDarkMode();
  };
}
```
