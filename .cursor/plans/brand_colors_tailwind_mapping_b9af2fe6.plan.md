---
name: Brand Colors Tailwind Mapping
overview: Map all 17 UNOPS brand color families from Figma into Tailwind CSS v4's 50-950 scale, replace default colors in the codebase, update PrimeNG theming, and reorganize Figma with proper naming.
todos:
  - id: tailwind-theme
    content: "Update src/assets/tailwind.css: disable default colors with --color-*: initial, register all 17 UNOPS brand color families (11 shades each) as @theme variables"
    status: completed
  - id: primeng-preset
    content: "Update src/app.config.ts: change MyPreset primary palette from {blue.*} to UNOPS brand blue values"
    status: completed
  - id: configurator
    content: "Update src/app/layout/components/app.configurator.ts: replace primaryColors list and surfaces array with brand palettes"
    status: completed
  - id: figma-update
    content: "Update Figma file: rename color frames with Tailwind 50-950 labels and create Figma variables for each brand color"
    status: completed
  - id: verify-integration
    content: Verify tailwindcss-primeui plugin, surface utilities, and base border-color still work with the new palette
    status: pending
isProject: false
---

# Map UNOPS Brand Colors to Tailwind System

## Context

The project uses **Tailwind CSS v4** (CSS-first, no `tailwind.config.js`), **PrimeNG 21** with `@primeuix/themes` (Aura preset), and the **`tailwindcss-primeui`** plugin. Colors are configured in three places:

- [`src/assets/tailwind.css`](src/assets/tailwind.css) -- Tailwind theme (`@theme` block)
- [`src/app.config.ts`](src/app.config.ts) -- PrimeNG preset (primary = blue)
- [`src/app/layout/components/app.configurator.ts`](src/app/layout/components/app.configurator.ts) -- runtime palette switcher (primary colors + surface palettes)

## Extracted Brand Colors (from Figma node 2082:3408)

17 color families, each with 11 shades mapping to the Tailwind 50-950 scale:

- **deepsea** -- #c3c7cb (50) ... #0d1e2f (500) ... #03080c (950)
- **gray** -- #e5e6e6 (50) ... #97999b (500) ... #262627 (950)
- **red** -- #f6cac6 (50) ... #da291c (500) ... #370a07 (950)
- **orange** -- #f9d6c3 (50) ... #e85c0e (500) ... #3a1704 (950)
- **gold** -- #fff0c5 (50) ... #ffc215 (500) ... #403105 (950)
- **yellow** -- #fdfad0 (50) ... #f8ea44 (500) ... #3e3b11 (950)
- **lime** -- #f0f5bf (50) ... #c4d600 (500) ... #313600 (950)
- **chartreuse** -- #e5f2cf (50) ... #96c93d (500) ... #26320f (950)
- **green** -- #d2e7cd (50) ... #67ad56 (400) ... #13280e (950) *(base label may have a Figma error -- needs verification)*
- **forest** -- #d1e0d5 (50) ... #458257 (500) ... #112116 (950)
- **teal** -- #bfeae5 (50) ... #00a997 (500) ... #002a26 (950)
- **cyan** -- #d3f0f7 (50) ... #4ec3e0 (500) ... #143138 (950)
- **blue** -- #bfe4f4 (50) ... #0092d1 (500) ... #002534 (950)
- **cerulean** -- #bfd9e6 (50) ... #00669a (500) ... #001a27 (950)
- **midnight** -- #bfd2dd (50) ... #004976 (500) ... #00121e (950)
- **magenta** -- #e6c7d9 (50) ... #991e66 (500) ... #26081a (950)
- **neutral** -- special case, only 4 light backgrounds (#f6f9fc, #f5fbfd, #fcfdf3, #fefaf7) plus #00070a base

## Plan

### 1. Update Tailwind CSS theme -- replace all default colors

In [`src/assets/tailwind.css`](src/assets/tailwind.css), inside the `@theme` block:
- Add `--color-*: initial;` to disable **all** default Tailwind colors
- Keep `--color-black: #000; --color-white: #fff;`
- Register each UNOPS brand family as `--color-{name}-{50..950}` variables

```css
@theme {
  --color-*: initial;
  --color-black: #000;
  --color-white: #fff;

  --color-deepsea-50: #c3c7cb;
  --color-deepsea-100: #9ea5ac;
  /* ... all 17 families x 11 shades ... */
}
```

### 2. Update PrimeNG preset -- wire brand primary

In [`src/app.config.ts`](src/app.config.ts), change the `MyPreset` semantic primary from `{blue.*}` to `{blue.*}` mapped to the brand blue values (or whichever brand family is the primary). The Aura preset's `primitive` palette also needs overriding with the brand colors.

### 3. Update configurator palettes

In [`src/app/layout/components/app.configurator.ts`](src/app/layout/components/app.configurator.ts):
- Replace the `primaryColors` list to only include the brand color families
- Replace the `surfaces` array with brand-appropriate surface palettes (e.g., `deepsea` and `gray` as surface options)

### 4. Update Figma -- reorganize brand swatches

Using the Figma MCP `use_figma` tool:
- Rename the color frames with Tailwind-scale labels (50, 100, ... 950)
- Create Figma variables for each brand color in the `--color-{name}-{shade}` format so they can be referenced across the design file

### 5. Verify surface/neutral fallback

The default Tailwind border color in the base layer currently references `var(--color-gray-200)`. After replacing defaults, ensure the brand `gray` palette covers this. Also verify that `tailwindcss-primeui` plugin's `text-surface-*` and `bg-surface-*` utilities still work since they read from PrimeNG's `--p-surface-*` variables.

## Data note

The "Green" family (Figma Group 18) has a base label of `#ffc215` which appears to be a copy-paste error from the Gold family. The actual colors in that group are green. The plan will use the existing 10 lighter/darker shades and flag the missing 500 for manual confirmation.
