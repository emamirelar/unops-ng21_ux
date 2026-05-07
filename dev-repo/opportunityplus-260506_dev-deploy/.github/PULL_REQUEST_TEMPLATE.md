## Summary

<!-- What does this PR change and why? -->

## How to test

<!-- Steps, environments, or “N/A” for docs-only -->

---

## Design system & PrimeNG (Opportunity+ ClientApp)

**Authors:** confirm the items that apply. **Reviewers:** flag violations before merge.

Reference: `tasks/ui-technical-cleanup/cleanup_primeng-overrides.plan.md` (Phase 4).

- [ ] **No new `.p-*` class overrides in feature `*.component.scss`** — PrimeNG appearance belongs in `src/styles/themes/unops.preset.ts` / `src/styles/unops-design-tokens.css`, or a scoped hook in `src/styles/primeng-unops-theme.scss` when the preset cannot express it (e.g. `appendTo="body"` overlays).
- [ ] **No new `::ng-deep`** — use `:host :deep …`, template APIs (`contentStyle`, `styleClass`, etc.), or a named global hook in `primeng-unops-theme.scss` instead. Exceptions need explicit tech-lead / maintainer approval and a short comment with ticket ID.
- [ ] **No `!important` on declarations that use PrimeNG theme variables (`var(--p-…)` values)** — fix via preset, `unops-design-tokens.css`, or UNOPS tokens (`var(--unops-…)`) without fighting `--p-*` with `!important`.
- [ ] **Design token value changes** go to `src/styles/unops-design-tokens.css` (single source) where applicable; avoid duplicating hex for colors already in the design system.

<!-- If this PR does not touch `UNOPS.PAO.ClientApp`, check "N/A" and delete the checklist above. -->

- [ ] N/A — ClientApp / styling unchanged
