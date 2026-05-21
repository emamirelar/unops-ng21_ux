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

### Automated setup

```bash
ng add @unopsitg/ux
```

This creates all required files and patches `angular.json` + `app.config.ts` automatically. The rest of this section documents the manual equivalent.

### Understanding `assets/tailwind.css`

The library ships `assets/tailwind.css` as a **Tailwind v4 source file** — it contains `@plugin`, `@source`, `@theme`, and `@utility` directives that must be processed by `@tailwindcss/postcss` to generate utility classes.

> **Do NOT add `assets/tailwind.css` directly to angular.json styles.** Angular's esbuild/Vite builder does not run PostCSS on CSS files referenced from `node_modules` — it inlines them as raw text. All directives will appear literally in the browser output and zero utilities will be generated.

### Manual setup

#### 1. PostCSS configuration

Angular 21's `application` builder only loads JSON-format PostCSS configs. Create `.postcssrc.json` in the project root:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

> **Warning:** `.mjs` configs (`postcss.config.mjs`) are silently ignored by esbuild.

#### 2. Tailwind entry point

Create `src/tailwind.css` — this lives in your source tree so Angular **will** run PostCSS on it:

```css
@import "tailwindcss";
@import "@unopsitg/ux/tailwind";
```

The `@unopsitg/ux/tailwind` export resolves to the library's `assets/tailwind.css` via the package `exports` field. The file includes brand tokens, custom utilities, and a `@source` directive that scans the library's compiled JS for class references.

#### 3. angular.json styles and assets

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

#### 4. Dev dependencies

```bash
npm install -D @tailwindcss/postcss tailwindcss postcss
```

### Troubleshooting

- **Tailwind directives appear as raw text in browser CSS** — you added the library's CSS directly to `angular.json` instead of using `src/tailwind.css`.
- **"The path './assets/tailwind.css' is not exported"** — upgrade to `@unopsitg/ux@21.2.0+` which adds the `./tailwind` export.
- **Zero utilities generated** — verify `.postcssrc.json` exists (not `.mjs`) and `src/tailwind.css` is in the styles array.
- **Do not** put `@source` directives in `.scss` files — Sass copies them as inert text.

**Verify:** after `ng serve`, inspect the compiled CSS for `.flex { display: flex }`. If missing, PostCSS is not running on your tailwind entry point.

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
