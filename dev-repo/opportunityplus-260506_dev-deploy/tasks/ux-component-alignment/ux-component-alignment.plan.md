# UX Component Alignment — Task Plan

> Replace local shims with real UX library components, align AI card behavior, upgrade documents-card to a shared library component with outputs for backend integration, and add Cursor rules to prevent future divergence.

## Checklist

- [ ] Replace local `ux-ai-card-bg` shim: update `tsconfig.json` path alias, delete local shim files, update imports in all consuming files
- [ ] Add rule to `component-development.mdc`: always import UX components from `@emamirelar/ux`, never create local shims
- [ ] Add collapse/expand header row with chevron toggle and `isAiCardExpanded` signal to partner-view (and contact-view, opportunity-view)
- [ ] Add subtitle showing total insight count below the AI card title
- [ ] Wrap AI card body in `.expand-body` / `.expand-body--open` classes, default collapsed
- [ ] Remove `max-h-[min(24rem,50vh)]` from insight list div so it fills available vertical space
- [ ] Verify `.expand-body` CSS in `styles.scss` includes opacity transition matching reference app
- [ ] Upgrade `documents-card`: add output events (download, delete, upload, menuAction), loading input, read-only input, toolbar content projection slot, i18n support
- [ ] Move `documents-card` into the UX library (`projects/unops-ux/src/lib/components/`) and export from `public-api`
- [ ] Document how the team replaces their `app-document` with `app-documents-card`: bind inputs/outputs, handle backend in parent

---

## Part 1: Replace Local Shim with Real UX Component

## Part 1: Replace Local Shim with Real UX Component

The team created a local shim for `ux-ai-card-bg` at `src/app/ux/unopsitg/` instead of using the real component from the `unops-ng_ux` package. The shim is a simplified gradient wrapper; the real component has animated SVG blobs, blur filters, dark mode, and reduced-motion support.

### How the shim works today

`tsconfig.json` line 41 maps `@unopsitg/ux` to the local shim:
```
"@unopsitg/ux": ["src/app/ux/unopsitg/index"]
```

The real package is already installed and aliased under `@emamirelar/ux` paths (lines 37-40) but `AiCardBgComponent` is only exported from the package's `public-api.ts` via `export * from './lib/components'` — which is the barrel that the `@emamirelar/ux` base alias does NOT reach (it currently points only to `brand-theme`).

### Fix

1. **Add a new tsconfig path alias** for the components barrel:
   ```
   "@emamirelar/ux/components": ["node_modules/unops-ng_ux/projects/unops-ux/src/lib/components/index"]
   ```

2. **Update the `@unopsitg/ux` alias** to point to the package instead of the local shim (or remove it and switch imports to `@emamirelar/ux/components`).

3. **Delete the local shim files:**
   - `src/app/ux/unopsitg/ai-card-bg.component.ts`
   - `src/app/ux/unopsitg/index.ts`
   - `src/app/ux/` folder (if empty)

4. **Update imports** in all 5 consuming files:
   - `partner-view.component.ts`
   - `contact-view.component.ts`
   - `opportunity-view.component.ts`
   - `ai-panel.component.ts`
   - Any other file importing from `@unopsitg/ux`

   Change: `import { AiCardBgComponent } from '@unopsitg/ux'`
   To: `import { AiCardBgComponent } from '@emamirelar/ux/components'`

### Cursor rule addition

Add to `component-development.mdc` under a new section:

> **UX Library Components — No Local Shims**
>
> Always import shared UX components from the `@emamirelar/ux` package paths. Never create local copies or shims of components that exist in the UX library. If a component is missing from the package, request it from the UX team.
>
> Import paths:
> - Theme/presets: `@emamirelar/ux`
> - Layout shell: `@emamirelar/ux/layout`
> - Layout service: `@emamirelar/ux/layout-service`
> - Tokens: `@emamirelar/ux/tokens`
> - Components: `@emamirelar/ux/components`

---

## Part 2: AI Insights Card Behavior

The partner-view AI insights card is missing 4 behaviors from the UX reference app's `partner-detail.ts`:

### (a) Default state should be collapsed

- **Reference app**: `isAiCardExpanded = signal(false)` with a clickable header row containing a chevron toggle. Body wrapped in `.expand-body` / `.expand-body--open` (CSS grid `0fr` to `1fr` with opacity transition).
- **Team dev**: Card is always expanded, no collapse header or chevron.

**Fix**: Add collapse/expand header row with chevron, wrap body in `.expand-body` / `.expand-body--open`, default `isAiCardExpanded = signal(false)`.

### (b) On expand, take available vertical space

- **Reference app**: Outer `max-h-[calc(100dvh-12rem)]`, inner `flex-1 min-h-0`, no fixed height cap on list.
- **Team dev**: Extra `max-h-[min(24rem,50vh)]` caps the list.

**Fix**: Remove `max-h-[min(24rem,50vh)]` from the list div. Rely on parent max-height + flex.

### (c) No vertical scroll inside

- **Reference app**: `overflow-y-auto` within full available height; scroll only appears if content exceeds viewport.
- **Team dev**: `overflow-y-auto` with fixed `24rem/50vh` cap causes visible inner scrollbar.

**Fix**: Same as (b) — removing the cap means scroll only activates when genuinely needed.

### (d) Pagination count display

- **Reference app**: Subtitle `{{ aiInsights.length }} insights available for your review`. Dynamic `aiInsightsPerPage()` from viewport.
- **Team dev**: No count text. Fixed `aiPageSize = 3`.

**Fix**: Add subtitle with count. Switch to viewport-based page size via `calcInsightsPerPage()`.

### Files to change

**Template** — `partner-view.component.html` (lines ~505-553):
- Replace header with clickable collapse row + chevron + insight count subtitle
- Wrap body in `.expand-body` / `.expand-body--open`
- Remove `max-h-[min(24rem,50vh)]` from insight list div

**TypeScript** — `partner-view.component.ts`:
- Add `isAiCardExpanded = signal(false)`
- Replace `aiPageSize = 3` with viewport-based `aiInsightsPerPage()` computed signal

**Styles** — `src/styles.scss` (lines 248-261):
- Add `opacity: 0` / `opacity: 1` to `.expand-body` / `.expand-body--open` to match reference app's `_animations.scss`

**Apply same changes** to `contact-view` and `opportunity-view` if they use the same AI card pattern.

---

## Part 3: Documents Card — Upgrade to Shared Library Component

The UX reference app has `app-documents-card` (`src/app/apps/documents/documents-card.ts`) — a presentational card with pill filters, search, paginated sorted table, type tags, and drag-and-drop upload. The team built their own `app-document` from scratch with real backend CRUD but a simpler UI (no filters, no search, no tags, no pagination, scrollable table, upload behind a dialog).

**Strategy**: Upgrade `documents-card` to support real backend usage via outputs (Option A — least work for the team), publish it from the UX library, and let the team adopt it.

### Step 1: Upgrade documents-card in the UX library

Move `src/app/apps/documents/documents-card.ts` to `projects/unops-ux/src/lib/components/documents-card/documents-card.ts` and add:

**New inputs:**
- `loading = input(false)` — show skeleton/spinner while data loads
- `readOnly = input(false)` — hide upload area and action buttons when true
- `emptyMessage = input('No documents to show')` — customizable empty state text
- `uploadLabel = input('Upload File')` — customizable upload button label
- `searchPlaceholder = input('Search documents')` — customizable search placeholder

**New outputs (this is what makes it work with a real backend):**
- `documentDownload = output<DocumentItem>()` — emitted when download button clicked
- `documentDelete = output<DocumentItem>()` — emitted when Delete menu item clicked
- `documentPreview = output<DocumentItem>()` — emitted when Preview menu item clicked
- `documentShare = output<DocumentItem>()` — emitted when Share menu item clicked
- `filesSelected = output<File[]>()` — emitted when files are chosen via the upload area
- `menuAction = output<{ action: string; document: DocumentItem }>()` — generic catch-all for custom menu actions

**Content projection slot:**
- `<ng-content select="[documentsToolbar]" />` — slot for team to inject their Google Drive button or any extra toolbar actions

**Wire existing hardcoded menu items to outputs:**
- Download button: `(onClick)="documentDownload.emit(doc)"`
- Menu items: each emits the corresponding output instead of being no-ops

**i18n:** Replace hardcoded strings ("Documents", "No documents to show", "File Name", "Type", "Actions", etc.) with inputs or keep as-is and let the team override via inputs where needed.

### Step 2: Export from library

Update `projects/unops-ux/src/lib/components/index.ts`:
```typescript
export * from './ai-card-bg/ai-card-bg';
export * from './documents-card/documents-card';
```

The `DocumentsCard` class and `DocumentItem` interface will both be available via `@emamirelar/ux/components`.

### Step 3: Team adoption (least work)

The team replaces their `app-document` usage with `app-documents-card`. Example for partner view:

```html
<app-documents-card
    [documents]="documentService.documents()"
    [loading]="documentService.isLoading()"
    [readOnly]="!canUploadDocuments()"
    (documentDownload)="documentService.download($event)"
    (documentDelete)="documentService.confirmDelete($event)"
    (documentPreview)="documentService.preview($event)"
    (filesSelected)="documentService.upload($event)"
>
    <div documentsToolbar>
        <app-document-gdrive
            [entityId]="entityId()"
            [entityName]="'partner'"
            (fileLinked)="documentService.refresh()"
        />
    </div>
</app-documents-card>
```

The team keeps:
- Their `DocumentService` (backend CRUD) — unchanged
- Their `app-document-gdrive` — injected via the toolbar slot
- Their `app-upload-document` dialog — can be triggered from the `filesSelected` output handler if they want a type-assignment step before upload

The team deletes:
- `app-document` component (replaced by `app-documents-card`)
- `app-document-list` (if it's only used where `app-documents-card` replaces it)

They keep `app-opportunity-documents` as-is — it's a fundamentally different layout (sidebar + card grid + AI features) that doesn't map to the documents card pattern.
