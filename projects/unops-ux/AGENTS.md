# @unopsitg/ux — AI Agent Integration Guide

This file is for AI coding assistants (Cursor, Claude Code, Copilot, etc.) working in projects that depend on `@unopsitg/ux`.

## What this library provides

- **Layout shell** — full application chrome (sidebar, topbar, breadcrumb, configurator)
- **Brand theme** — PrimeNG / PrimeUIX preset (`BrandSoft`) with UNOPS brand colors
- **Tailwind CSS** — design tokens, custom utilities, and component animations
- **Shared types** — demo data interfaces

## Quick setup (or run `ng add @unopsitg/ux`)

1. Create `.postcssrc.json` (not `.mjs` — Angular 21 esbuild ignores `.mjs`):
   ```json
   { "plugins": { "@tailwindcss/postcss": {} } }
   ```

2. Create `src/tailwind.css`:
   ```css
   @import "../node_modules/@unopsitg/ux/assets/tailwind.css";
   @source "../node_modules/@unopsitg/ux/fesm2022";
   ```

3. In `angular.json` styles:
   ```json
   ["node_modules/@unopsitg/ux/assets/styles.scss", "src/tailwind.css", "node_modules/primeicons/primeicons.css", "src/styles.scss"]
   ```

4. In `angular.json` assets:
   ```json
   { "glob": "**/*", "input": "node_modules/@unopsitg/ux/assets/opp", "output": "assets/opp" }
   ```

5. In `app.config.ts` providers:
   ```typescript
   import { providePrimeNG } from 'primeng/config';
   import { BrandSoft, TOPBAR_PROFILE_MENU_CONFIG, LayoutService } from '@unopsitg/ux';

   providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } })
   ```

## Critical rules

- **NEVER** put `@source` directives in `.scss` files — Sass passes them through as inert text.
- **NEVER** use `postcss.config.mjs` — Angular 21 esbuild silently ignores it.
- **NEVER** reference `node_modules/@unopsitg/ux/assets/tailwind.css` directly in `angular.json` — use the `src/tailwind.css` wrapper for correct `@source` path resolution.
- Shell-critical utilities (`.hidden`, `.animate-scalein`, `.animate-fadeout`) ship as real CSS. Do not redefine them.

## Injection tokens

| Token | Purpose | Shape |
|-------|---------|-------|
| `MENU_MODEL` | Sidebar menu tree | `MenuItem[]` |
| `SIDEBAR_LOGO` | Expanded/compact logo URLs | `{ expanded, compact, alt }` |
| `TOPBAR_MOBILE_LOGO` | Mobile header logos | `{ light, dark }` |
| `TOPBAR_PROFILE_MENU_CONFIG` | Profile dropdown items | `{ items: { id, label, icon, command?, separator? }[] }` |

## Theme initialization

`LayoutService` defaults to `darkTheme: true`. To avoid a flash of light mode, add an `APP_INITIALIZER`:

```typescript
import { APP_INITIALIZER } from '@angular/core';
import { LayoutService } from '@unopsitg/ux';

{ provide: APP_INITIALIZER, useFactory: (ls: LayoutService) => () => ls.toggleDarkMode(), deps: [LayoutService], multi: true }
```

## Full documentation

See `README.md` in this package for complete configuration reference.
