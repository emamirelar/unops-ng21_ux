---
name: Rename theme presets
overview: Rename the three PrimeUIX theme presets from their codenames (Aura/Lara/Nora) to semantic names (Soft/Crisp/Contrast) across the codebase -- exports, registry keys, user-facing labels, config defaults, and Storybook.
todos:
  - id: brand-theme
    content: Rename imports, exports, and registry keys in brand-theme.ts
    status: completed
  - id: layout-service
    content: Update default preset name from 'Aura' to 'Soft' in layout.service.ts
    status: completed
  - id: app-config
    content: Update BrandAura to BrandSoft in app.config.ts
    status: completed
  - id: storybook
    content: Update BrandAura to BrandSoft in all 5 Storybook files
    status: completed
  - id: doc-comment
    content: Add upstream mapping comment in brand-theme.ts for maintenance
    status: pending
  - id: verify
    content: Verify topbar and configurator auto-propagate (no manual changes needed)
    status: completed
isProject: false
---

# Rename Theme Presets: Aura/Lara/Nora to Soft/Crisp/Contrast

## Mapping

- **Aura** -> **Soft** (contemporary, rounded, generous spacing)
- **Lara** -> **Crisp** (clean lines, flat, Material-adjacent)
- **Nora** -> **Contrast** (dense, enterprise, bold distinctions)

## Scope of Changes

The npm package imports (`@primeuix/themes/aura`, `/lara`, `/nora`) stay unchanged -- they are external packages. Everything else is renamed.

### 1. Central theme definition -- [brand-theme.ts](src/app/layout/service/brand-theme.ts)

- Alias imports: `import Aura ...` becomes `import SoftBase ...` (or similar), keeping the import path intact
- Rename exports: `BrandAura` -> `BrandSoft`, `BrandLara` -> `BrandCrisp`, `BrandNora` -> `BrandContrast`
- Rename registry keys:

```typescript
export const brandPresets = {
    Soft: BrandSoft,
    Crisp: BrandCrisp,
    Contrast: BrandContrast
} as const;
```

### 2. Layout service default -- [layout.service.ts](src/app/layout/service/layout.service.ts)

- Change default config `preset: 'Aura'` to `preset: 'Soft'` (line ~37)

### 3. App bootstrap -- [app.config.ts](src/app.config.ts)

- Change `BrandAura` import and usage to `BrandSoft`

### 4. Topbar user-facing labels -- [app.topbar.ts](src/app/layout/components/app.topbar.ts)

- Import `brandPresets` is unchanged (keys auto-propagate since it uses `Object.keys(brandPresets)`)
- No template changes needed -- `{{ preset }}` will render "Soft", "Crisp", "Contrast" automatically

### 5. Configurator -- [app.configurator.ts](src/app/layout/components/app.configurator.ts)

- Same as topbar -- uses `Object.keys(presets)` so keys auto-propagate
- No code changes needed here

### 6. Storybook files (4 files)

All use `BrandAura` for the theme provider. Update import and reference to `BrandSoft`:

- [.storybook/preview.ts](.storybook/preview.ts)
- [src/stories/pages/agreements.stories.ts](src/stories/pages/agreements.stories.ts)
- [src/stories/pages/detail-page.stories.ts](src/stories/pages/detail-page.stories.ts)
- [src/stories/pages/opportunity.stories.ts](src/stories/pages/opportunity.stories.ts)
- [src/stories/pages/document-management.stories.ts](src/stories/pages/document-management.stories.ts)

### 7. Maintenance comment in brand-theme.ts

Add a mapping comment at the top of `brand-theme.ts` so future developers can trace our names back to the upstream PrimeUIX presets (for docs, changelogs, debugging):

```typescript
/**
 * Brand theme presets built on top of PrimeUIX base presets.
 *
 * Upstream mapping (for PrimeNG docs, changelogs, and debugging):
 *   Soft     <- @primeuix/themes/aura
 *   Crisp    <- @primeuix/themes/lara
 *   Contrast <- @primeuix/themes/nora
 */
```

## Downsides / Risks

- **Documentation mismatch:** All PrimeNG/PrimeUIX docs, forums, and Stack Overflow answers reference "Aura", "Lara", "Nora". The in-code mapping comment (above) mitigates this for developers.
- **Upstream changelogs:** When upgrading `@primeuix/themes`, release notes use the original names. Developers must know which internal name corresponds to which upstream preset.
- **No persistence risk:** The preset value is only held in a runtime signal (`LayoutService.layoutConfig`) with a hardcoded default -- it is NOT stored in localStorage, sessionStorage, or a backend. So no migration is needed.

## Files NOT changed

- `@primeuix/themes/aura`, `/lara`, `/nora` -- external npm packages, import paths stay as-is
- `angular.json`, `package.json` -- no theme name references
- SCSS/HTML files -- no direct references to these names
