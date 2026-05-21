---
name: UX library upstream fixes
overview: "Fix five issues discovered during Consuming Apps integration so that consuming Angular apps get a working shell out of the box: PostCSS config format, Tailwind content scanning, missing shell utilities, undocumented tokens, and theme initialization."
todos:
  - id: postcss-config
    content: "Update README/docs: replace postcss.config.mjs recommendation with .postcssrc.json for Angular 21 esbuild compatibility"
    status: completed
  - id: shell-utilities
    content: Add @layer utilities block with .hidden, .animate-scalein, .animate-fadeout to assets/tailwind.css so shell works without @source scanning
    status: completed
  - id: source-wrapper
    content: "Update README: replace @source-in-scss advice with wrapper src/tailwind.css pattern (correct path resolution under Angular build)"
    status: completed
  - id: profile-token
    content: Document TOPBAR_PROFILE_MENU_CONFIG token in README Tokens section and Bootstrap example
    status: completed
  - id: theme-init
    content: Fix LayoutService theme initialization race (sync .app-dark on construction) or document APP_INITIALIZER workaround
    status: completed
isProject: false
---

# Fix @unopsitg/ux for Consuming Apps

These are the issues Consuming Apps hit when integrating `@unopsitg/ux@21.0.22`, and the upstream fixes needed in the library (repo `opp_plus/unops-ng21_ux`) so no other team repeats them.

---

## Issue 1: PostCSS config format -- Angular 21 esbuild ignores `.mjs`

**Problem:** The library README and integration docs tell consumers to create `postcss.config.mjs`. Angular 21's `application` builder (esbuild) **silently ignores** `.mjs` PostCSS configs. Only JSON-format configs are loaded: `.postcssrc.json`, `postcss.config.json`, or `.postcssrc`.

**Symptom:** Tailwind directives (`@import "tailwindcss"`, `@source`, `@plugin`) pass through unprocessed into the final CSS bundle. No utilities are generated.

**Fix in library:**

- **README.md** -- Replace the `postcss.config.mjs` example with `.postcssrc.json`:

```json
{
  "plugins": {
    "@tailwindcss/postcss": {}
  }
}
```

- **If the library ships a schematic or template in the future**, generate `.postcssrc.json`, not `.mjs`.

---

## Issue 2: `@source` path resolution fails under Angular's build pipeline

**Problem:** The library's [`assets/tailwind.css`](src/glass/node_modules/@unopsitg/ux/assets/tailwind.css) (line 5) contains:

```css
@source "../fesm2022";
```

This relative path is correct **within the package directory structure** (`assets/` -> `../fesm2022/`). However, when Angular processes this file as a style entry in `angular.json`, the working directory for path resolution is the **project root**, not `node_modules/@unopsitg/ux/assets/`. The `@source "../fesm2022"` resolves to a nonexistent path, Tailwind scans nothing, and zero utilities are generated.

The library README's fallback (`@source "../../node_modules/@unopsitg/ux"` in `styles.scss`) also fails because `.scss` files are preprocessed by Sass before PostCSS/Tailwind sees them -- Sass copies `@source` verbatim as an unknown at-rule, and by the time PostCSS runs, the directive is already inert CSS text.

**Symptom:** Shell layout renders broken -- topbar flyouts (notifications, language, profile) are always visible as plain text; `flex`, `gap-*`, `hidden`, `sm:absolute` etc. all missing from compiled CSS.

**Fix in library (two complementary approaches):**

### A. Ship shell-critical utilities as real CSS (not Tailwind-generated)

Add a `@layer utilities` block to `assets/tailwind.css` (or a new `assets/_shell-utilities.css` imported by it) that **hardcodes** the utilities the shell absolutely requires. This makes the shell work even when `@source` scanning fails:

```css
@layer utilities {
  .hidden {
    display: none !important;
  }
}

@keyframes scalein {
  0% { opacity: 0; transform: scaleY(0.8); }
  100% { opacity: 1; transform: scaleY(1); }
}
@keyframes fadeout {
  0% { opacity: 1; }
  100% { opacity: 0; }
}

@layer utilities {
  .animate-scalein {
    animation: scalein 0.15s linear;
  }
  .animate-fadeout {
    animation: fadeout 0.15s linear;
  }
}
```

These are the three classes that break the shell if missing. Including them as real CSS in the library means consumers never need to rediscover and copy them.

### B. Update README to recommend a wrapper `tailwind.css`

Since Angular's build pipeline breaks the `@source` relative path, instruct consumers to create a thin wrapper CSS file (`src/tailwind.css`) and reference that in `angular.json` instead of the library file directly:

```css
/* src/tailwind.css */
@import "../node_modules/@unopsitg/ux/assets/tailwind.css";
@source "../node_modules/@unopsitg/ux/fesm2022";
```

```json
"styles": [
  "node_modules/@unopsitg/ux/assets/styles.scss",
  "src/tailwind.css",
  "node_modules/primeicons/primeicons.css",
  "src/styles.scss"
]
```

The `@source` in the wrapper resolves from the project root, where Angular actually runs PostCSS.

---

## Issue 3: `TOPBAR_PROFILE_MENU_CONFIG` undocumented

**Problem:** The library exports a `TOPBAR_PROFILE_MENU_CONFIG` injection token that `AppTopbar` uses to render the profile dropdown. Neither the README nor the integration docs mention it. Without it, the profile menu either shows nothing or shows hardcoded demo items.

**Fix in library:**

- **README.md** -- Add `TOPBAR_PROFILE_MENU_CONFIG` to the "Tokens" section:

```markdown
- `TOPBAR_PROFILE_MENU_CONFIG` -- profile dropdown menu items (array of `{ id, label, icon, command?, separator? }`).
```

- **README.md** -- Add it to the Bootstrap example:

```typescript
import { TOPBAR_PROFILE_MENU_CONFIG, LayoutService } from '@unopsitg/ux';

{
  provide: TOPBAR_PROFILE_MENU_CONFIG,
  useFactory: (router: Router) => ({
    items: [
      { id: 'profile', label: 'Profile', icon: 'pi pi-user', command: () => router.navigate(['/profile']) },
      { id: 'logout', label: 'Log out', icon: 'pi pi-power-off', separator: true, command: () => router.navigate(['/logout']) },
    ],
  }),
  deps: [Router],
},
```

---

## Issue 4: `LayoutService` theme initialization race

**Problem:** `LayoutService` defaults `darkTheme: true`, but the first internal effect that would apply `.app-dark` to `<html>` can be skipped. Result: PrimeNG renders in light mode (no `.app-dark` on `<html>`) while `layoutConfig()` says dark. The user sees a light UI that snaps to dark on first toggle.

**Fix in library:**

- **Option A (preferred):** Fix `LayoutService.toggleDarkMode()` or its constructor to always synchronize `.app-dark` on `<html>` during initialization -- not just on subsequent toggles. This is a code fix in `projects/unops-ux/src/lib/layout/service/layout.service.ts`.

- **Option B (document the workaround):** If the timing issue is hard to fix without breaking other consumers, document the `APP_INITIALIZER` pattern in the README:

```typescript
import { APP_INITIALIZER } from '@angular/core';
import { LayoutService } from '@unopsitg/ux';

function initUxTheme(layoutService: LayoutService): () => void {
  return () => {
    const config = { ...layoutService.layoutConfig(), darkTheme: false };
    layoutService.layoutConfig.set(config);
    layoutService.toggleDarkMode(config);
  };
}

{ provide: APP_INITIALIZER, useFactory: initUxTheme, deps: [LayoutService], multi: true },
```

---

## Issue 5: README still recommends `@source` in `.scss` files

**Problem:** The README "Critical: Tailwind content scan" section tells consumers to put `@source "../../node_modules/@unopsitg/ux"` in `src/styles.scss`. This does not work because:
1. `.scss` files go through the Sass compiler first, which copies `@source` as inert text.
2. PostCSS/Tailwind never sees it as an actionable directive.
3. Even if it did work, the broad `@source` path scans all of `node_modules/@unopsitg/ux` (including `.scss`, `.json`, docs) instead of just the compiled JS where class strings live (`fesm2022/`).

**Fix in library:**

- Remove the `@source` in `.scss` recommendation entirely.
- Replace with the wrapper `tailwind.css` approach from Issue 2B, or rely on the hardcoded shell utilities from Issue 2A.

---

## Summary of changes by file (in `opp_plus/unops-ng21_ux`)

- **`README.md`** -- Fix PostCSS config format, `@source` instructions, document `TOPBAR_PROFILE_MENU_CONFIG`, add theme init workaround
- **`projects/unops-ux/src/assets/tailwind.css`** -- Add `@layer utilities` block with `.hidden`, `.animate-scalein`, `.animate-fadeout` so the shell works even without `@source` scanning
- **`projects/unops-ux/src/lib/layout/service/layout.service.ts`** -- (Optional) Fix theme initialization to sync `.app-dark` on `<html>` at construction time
