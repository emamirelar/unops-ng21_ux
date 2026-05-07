# Styling Architecture

## Overview

All visual styling in Opportunity+ comes from the **`unops-ng_ux`** package.
The application itself contains only thin overrides for features the package
does not cover (data-tables, detail fields, Driver.js popovers).

## Style Loading Order (`angular.json`)

```
1. node_modules/unops-ng_ux/.../assets/styles.scss   ← UX package SCSS shell (layout, sidebar, topbar)
2. src/tailwind.css                                   ← Tailwind 4 entry; imports package @theme
3. node_modules/primeicons/primeicons.css             ← PrimeNG icon font
4. src/styles/detail-fields.scss                      ← Record-detail field layout
5. src/styles/data-table.scss                         ← Generic data-table tweaks
6. src/styles/info-callout.scss                       ← Info callout component
7. src/styles.scss                                    ← Global resets + Driver.js
```

## Sources of Truth

| Concern               | Source                                                      |
| --------------------- | ----------------------------------------------------------- |
| PrimeNG theme         | `BrandSoft` preset from `@emamirelar/ux` (Aura-based)      |
| Brand colours         | `unops-ng_ux/…/assets/tailwind.css` `@theme` block          |
| Layout shell          | `AppLayout` component from `@emamirelar/ux/layout`          |
| Design tokens (CSS)   | CSS vars from `@theme` (e.g. `--color-darkblue-500`)        |
| Responsive variants   | `unops-mobile`, `unops-tablet`, `unops-desktop` in `src/tailwind.css` |

## Key Colour Tokens (from package `@theme`)

| Token family   | Example utilities                    |
| -------------- | ------------------------------------ |
| `darkblue-*`   | `text-darkblue-500`, `bg-darkblue-600` |
| `deepsea-*`    | `text-deepsea-500`, `bg-deepsea-100`   |
| `gray-*`       | `text-gray-600`, `bg-gray-50`          |
| `green-*`      | `text-green-500`                       |
| `red-*`        | `text-red-500`                         |
| `amber-*`      | `text-amber-500`                       |

## Rules

1. **Never hardcode hex values** — use `var(--color-*)` or Tailwind utilities.
2. **Never create `unops-*` Tailwind utilities** — use the package's standard
   colour names (`darkblue`, `deepsea`, `gray`, etc.).
3. **Never override PrimeNG `--p-*` variables** in component SCSS — adjust
   the `BrandSoft` preset or use `styleClass` hooks.
4. **Avoid `::ng-deep`** — use `:host :deep`, sibling `:deep`, or
   `styleClass` on PrimeNG components.

## Local SCSS Partials

| File                 | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `detail-fields.scss` | Two-column label + value layout for records  |
| `data-table.scss`    | Density and alignment for `p-table`          |
| `info-callout.scss`  | Information callout styling                  |
| `recordPage.scss`    | Shared record-page wrapper styles            |

## PostCSS

`.postcssrc.json` uses `@tailwindcss/postcss` (Tailwind 4 plugin).
No other PostCSS plugins are configured.
