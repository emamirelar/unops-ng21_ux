# Task 9.0 Completion Report — Documents Tab

**Date:** 2026-03-10  
**Task:** 9.0 Frontend: Documents Tab  
**Status:** ✅ Complete

---

## Summary

Implemented the Office Documents tab using the existing `DocumentComponent` and `GDriveDocumentComponent` for document list, upload, and Google Drive linking. The tab includes the info callout from the mockup and permission-based visibility for upload actions.

---

## Deliverables

### 9.1 `office-documents-tab` Component

**Location:** `UNOPS.PAO.ClientApp/src/app/features/admin/office-management/components/office-documents-tab/`

**Files created:**
- `office-documents-tab.component.ts` — Component with office input, entityId/computed, canEditDocuments (from permissions), acceptedMimeTypes
- `office-documents-tab.component.html` — Card layout with header, info callout, DocumentComponent, GDriveDocumentComponent in toolbar
- `office-documents-tab.component.scss` — Minimal (Tailwind-first)

**Implementation details:**
- Uses `DocumentComponent` with `entityName="office"` and `entityId` from office.id
- Uses `GDriveDocumentComponent` in document-toolbar for Google Drive linking (Strategy docs: PDF, Word, Excel)
- Info callout: "Document upload is restricted to the Regional Director/Manager or OiC of this office. Only Strategy documents are supported at this time."
- Upload/Edit disabled when `!permissions?.canEditWorkflowConfiguration` (proxy for document edit permission until backend adds `canUploadDocuments`)
- Accepted MIME types: PDF, Word, Excel, Google Docs/Sheets

### 9.2 Translation Keys

**Added to all 4 language files** (`en.json`, `fr.json`, `pt.json`, `span.json`):
- `office.documents.title` — "Documents"
- `office.documents.infoCallout` — Info callout text per mockup

---

## Integration

- `office-detail-tabs.component.ts` — Imported `OfficeDocumentsTabComponent`, added to imports array
- `office-detail-tabs.component.html` — Replaced Documents tab placeholder with `<app-office-documents-tab [office]="office()" />`

---

## Verification

- ✅ Angular build: `npx ng build --configuration=development` — Success
- ✅ No linter errors in new component
- ✅ Tailwind-first styling
- ✅ Translation keys in en, fr, pt, span

---

## Notes

1. **Backend document API:** The DocumentService calls `/api/document/office/{id}`. If the backend does not yet support "office" as an entity type for documents, the list will be empty. Document types are fetched via `/api/document-type/office` — backend must register Office document types (e.g., Strategy) when ready.
2. **Permission:** Currently uses `canEditWorkflowConfiguration` as a proxy for document upload permission. When the backend adds `canUploadDocuments` to `OfficePermissionsModel`, the component should be updated to use it.
3. **Mockup alignment:** Card header, info callout, and document list match the mockup (Screen 9: Office Detail — Documents).
