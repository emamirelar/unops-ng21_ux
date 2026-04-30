---
name: Breadcrumb hover animation
overview: Add a sliding highlight hover animation to breadcrumb links using a `::before` pseudo-element that scales horizontally on hover, implemented in `_breadcrumb.scss` with minor template adjustments in `app.breadcrumb.ts`.
todos:
  - id: scss-animation
    content: Add `::before` sliding highlight animation rules to `_breadcrumb.scss` inside `.layout-breadcrumb ol li a`
    status: completed
  - id: template-cleanup
    content: Remove conflicting Tailwind hover classes (`hover:text-primary-500`, `no-underline`, `hover:underline`) from the `<a>` tag in `app.breadcrumb.ts` inline template
    status: completed
isProject: false
---

# Breadcrumb Link Hover Animation

## Current State

- **Component:** [`app.breadcrumb.ts`](projects/unops-ux/src/lib/layout/components/app.breadcrumb.ts) -- inline template with `<a>` tags using Tailwind classes for hover (`hover:text-primary-500 no-underline hover:underline`)
- **Styles:** [`_breadcrumb.scss`](projects/unops-ux/src/assets/_breadcrumb.scss) -- layout-level styles for `.layout-breadcrumb` (flex, gaps, ellipsis)

## Changes

### 1. Update `_breadcrumb.scss` -- add the `::before` hover animation

Add scoped rules inside `.layout-breadcrumb ol li a` for the sliding highlight effect:

```scss
.layout-breadcrumb {
  // ... existing flex/gap rules ...

  ol li a {
    color: var(--p-text-color);
    position: relative;
    text-decoration: none;

    &::before {
      background: hsl(45 100% 70%);
      content: "";
      inset: 0;
      position: absolute;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s ease-in-out;
      z-index: -1;
    }

    &:hover::before {
      transform: scaleX(1);
      transform-origin: left;
    }
  }
}
```

**Notes:**
- Uses `var(--p-text-color)` instead of `#000` so it adapts to dark mode automatically.
- The `hsl(45 100% 70%)` highlight color is a golden amber. If you'd prefer a brand color (e.g. `var(--p-primary-200)` for light / `var(--p-primary-800)` for dark), let me know and I'll adjust.
- Consider wrapping the transition in a `prefers-reduced-motion` guard consistent with the existing `_animations.scss` pattern.

### 2. Update `app.breadcrumb.ts` template -- remove conflicting Tailwind hover classes

The current `<a>` tag has Tailwind classes that will conflict with the new SCSS animation:

```
text-surface-700 dark:text-surface-100 hover:text-primary-500 no-underline hover:underline cursor-pointer
```

Remove `hover:text-primary-500`, `no-underline`, and `hover:underline` from the class list since:
- Text color on hover should remain the same (the highlight band provides visual feedback instead)
- `text-decoration: none` is now set in SCSS
- `hover:underline` conflicts with the `::before` highlight effect

The cleaned-up `<a>` class list becomes:

```
text-surface-700 dark:text-surface-100 cursor-pointer
```

## Files Modified

- [`projects/unops-ux/src/assets/_breadcrumb.scss`](projects/unops-ux/src/assets/_breadcrumb.scss) -- add `::before` animation rules
- [`projects/unops-ux/src/lib/layout/components/app.breadcrumb.ts`](projects/unops-ux/src/lib/layout/components/app.breadcrumb.ts) -- clean up conflicting Tailwind hover classes
