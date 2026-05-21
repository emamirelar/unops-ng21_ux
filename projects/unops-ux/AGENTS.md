# @unopsitg/ux — AI Agent Integration Guide

This file is for AI coding assistants (Cursor, Claude Code, Copilot, etc.) working in projects that depend on `@unopsitg/ux`.

## What this library provides

- **Layout shell** — full application chrome (sidebar, topbar, breadcrumb, configurator)
- **Brand theme** — PrimeNG / PrimeUIX preset (`BrandSoft`) with UNOPS brand colors
- **Tailwind CSS** — design tokens, custom utilities, and component animations (Tailwind v4 source file)
- **Shared types** — demo data interfaces

## Quick setup (or run `ng add @unopsitg/ux`)

1. Create `.postcssrc.json` (not `.mjs` — Angular 21 esbuild ignores `.mjs`):
   ```json
   { "plugins": { "@tailwindcss/postcss": {} } }
   ```

2. Create `src/tailwind.css`:
   ```css
   @import "tailwindcss";
   @import "@unopsitg/ux/tailwind";
   ```

3. In `angular.json` styles:
   ```json
   ["node_modules/@unopsitg/ux/assets/styles.scss", "src/tailwind.css", "node_modules/primeicons/primeicons.css", "src/styles.scss"]
   ```

4. In `angular.json` assets:
   ```json
   { "glob": "**/*", "input": "node_modules/@unopsitg/ux/assets/opp", "output": "assets/opp" }
   ```

5. Install dev dependencies:
   ```bash
   npm install -D @tailwindcss/postcss tailwindcss postcss
   ```

6. In `app.config.ts` providers:
   ```typescript
   import { providePrimeNG } from 'primeng/config';
   import { BrandSoft, TOPBAR_PROFILE_MENU_CONFIG, LayoutService } from '@unopsitg/ux';

   providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } })
   ```

## Critical rules

- **NEVER** add `node_modules/@unopsitg/ux/assets/tailwind.css` directly to `angular.json` styles — Angular's esbuild does NOT run PostCSS on node_modules CSS, so all directives pass through as raw text and zero utilities are generated.
- **ALWAYS** use `src/tailwind.css` with `@import "@unopsitg/ux/tailwind"` — this lives in the source tree where PostCSS processes it.
- **NEVER** put `@source` directives in `.scss` files — Sass passes them through as inert text.
- **NEVER** use `postcss.config.mjs` — Angular 21 esbuild silently ignores it.
- Shell-critical utilities (`.hidden`, `.animate-scalein`, `.animate-fadeout`) ship as real CSS. Do not redefine them.

## Package exports

| Import path | Resolves to |
|-------------|-------------|
| `@unopsitg/ux` | `fesm2022/unopsitg-ux.mjs` (Angular library) |
| `@unopsitg/ux/tailwind` | `assets/tailwind.css` (Tailwind v4 source) |
| `@unopsitg/ux/styles` | `assets/styles.scss` (layout SCSS) |

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
