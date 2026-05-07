# Task 11.0 Completion Report — i18n Translation Keys

**Date:** 2026-03-10  
**Task:** 11.0 Frontend: i18n — Translation Keys  
**Status:** ✅ Complete

---

## Summary

Verified that all Office UI translation keys are present in all four language files and that all Office components use `| translate` for user-facing text. No new keys were required; the implementation from prior tasks already satisfied the requirements.

---

## Deliverables

### 11.1 Office Keys in `en.json` — Verified

**Location:** `UNOPS.PAO.ClientApp/src/assets/i18n/en.json`

All required Office keys are present:

| Namespace | Keys | Count |
|-----------|------|-------|
| office.list.* | title, searchPlaceholder, showingCount, columnName, columnCode, columnType, columnParent, columnStatus, statusActive, statusInactive, noOffices | 11 |
| office.detail.* | backToOffices, breadcrumb, level, effective | 4 |
| office.tabs.* | details, financial, scope, rolesDoA, relatedOpportunities, relatedPartners, documents, *Placeholder (7) | 14 |
| office.documents.* | title, infoCallout | 2 |
| office.rolesDoa.* | operationalRoles, doaHolders, badgeReadOnlySource, footerOperationalRoles, footerDoAHolders, doaInfoCallout, column*, notAssigned, statusActive, noRoles, noDoAHolders | 21 |
| office.details.* | keyInformation, id, costCentre, internalName, externalName, alias, organisationalEntityType, hierarchyLevel, effectiveDate, parentOffices, childOffices | 11 |
| office.financial.* | title, readOnly, costCentreId, financialCentreType, funding, performanceTargets, nerTarget, eaTarget, footer, noData | 10 |
| office.scope.* | title, readOnly, scopeType, geographicScope, columnCountry, columnCode, noCountries, noData | 8 |
| office.opportunities.* | title, includesChildOffices, searchPlaceholder, showingCount, columnOpportunity, columnStage, columnPartner, columnValue, columnTargetSigning, noOpportunities | 10 |
| office.partners.* | title, includesChildOffices, searchPlaceholder, showingCount, columnPartner, noPartners | 6 |

**Total:** 97 Office keys in en.json

### 11.2 Same Keys in fr.json, pt.json, span.json — Verified

**Note:** The task list references `es.json`; the project uses `span.json` for Spanish.

- **fr.json** — All 97 Office keys present with French translations
- **pt.json** — All 97 Office keys present with Portuguese translations  
- **span.json** — All 97 Office keys present with Spanish translations

### 11.3 Components Use `| translate` — Verified

All Office components use the translate pipe for user-facing text:

| Component | Translation Usage |
|-----------|-------------------|
| office-list | office.list.* for title, search, columns, status, empty state |
| office-detail | office.detail.*, office.list.statusActive for header, badges, meta |
| office-detail-tabs | office.tabs.* for all tab labels |
| office-details-tab | office.details.* for key info, parent/child offices |
| office-financial-tab | office.financial.* for all labels |
| office-scope-tab | office.scope.* for scope type, geographic scope |
| office-roles-doa | office.rolesDoa.* for cards, footers, callout |
| office-operational-roles-table | office.rolesDoa.column*, notAssigned, statusActive, noRoles |
| office-doa-holders-table | office.rolesDoa.column*, notAssigned, noDoAHolders |
| office-opportunities-tab | office.opportunities.* for title, search, columns, empty |
| office-partners-tab | office.partners.* for title, search, columns, empty |
| office-documents-tab | office.documents.* for title, info callout |

**Dynamic keys:** `office-list` uses `getStatusLabel(status)` which returns `office.list.statusActive` or `office.list.statusInactive`; the template passes the result through `| translate`.

### 11.4 Review — FR-9

- All Office UI text uses translation keys
- No hardcoded English (or other) strings in templates
- Interpolation (`{{ count }}`) used correctly in keys like `office.list.showingCount`
- All four languages have complete Office coverage

---

## Verification

- ✅ en.json: 97 Office keys
- ✅ fr.json: 97 Office keys (French)
- ✅ pt.json: 97 Office keys (Portuguese)
- ✅ span.json: 97 Office keys (Spanish)
- ✅ All Office components use `| translate` for user-facing text
- ✅ No hardcoded user-facing strings found
