# WHY Section Update — Cross-Cutting Concerns

## Overview

Add a new mandatory subsection **"Cross-cutting concerns to be considered in the project design"** to the WHY section of an Opportunity record, directly after the beneficiaries subsection. This subsection is mandatory for GO submission and must appear in the Opportunity Statement and AI transcription flows.

---

## 1. Data Model & Database

### 1.1 Storage Approach

**Option A (Recommended): Add columns to Opportunity entity**

Add 7 nullable boolean columns + 1 string column to the `Opportunity` entity:

- `CrossCuttingConcernPeopleBenefitting` (bool?)
- `CrossCuttingConcernGenderEquality` (bool?)
- `CrossCuttingConcernCreateJobs` (bool?)
- `CrossCuttingConcernSupplierCapacity` (bool?)
- `CrossCuttingConcernProcurementCapacity` (bool?)
- `CrossCuttingConcernEnvironmentalSafeguards` (bool?)
- `CrossCuttingConcernClimateChange` (bool?)
- `CrossCuttingConcernsOther` (string, max 150) — for "Other" when all items are No

**Option B: Lookup table + junction**

- Create `CrossCuttingConcernType` lookup table (7 rows)
- Create `OpportunityCrossCuttingConcern` junction table (OpportunityId, TypeId, Applies)
- Add `CrossCuttingConcernsOther` (string, max 150) to Opportunity

### 1.2 Migration

- Create EF migration for `UNOPSAppDbContext` (see `migration-creation.mdc` rule)
- If Option B: Create seeder for `CrossCuttingConcernType` lookup data

---

## 2. Backend Changes

### 2.1 Models

**`UNOPS.PAO.Models/Opportunities/WhySectionRequest.cs`**

- Add properties for the 7 Yes/No items and Other:
  - `CrossCuttingConcernPeopleBenefitting`, `CrossCuttingConcernGenderEquality`, etc.
  - `CrossCuttingConcernsOther` (string, max 150)

**`OpportunityModel`**

- Add same properties for API response

### 2.2 Manager

**`UNOPS.PAO.UNOPSBusiness/Managers/UNOPSOpportunityManager.cs`**

- `UpdateWhySectionAsync`: Map and persist new cross-cutting concern fields
- `GetOpportunityDetailsForAIAsync`: Add `crossCuttingConcerns` (or equivalent) to the dictionary passed to AI

### 2.3 GO Validation

**`UNOPS.PAO.Presentation/Controllers/WorkflowController.cs`**

- `ValidateOpportunityRequirementsAsync`: Add validation for cross-cutting concerns
  - Either all 7 items have Yes/No selected, OR
  - If all are No, `CrossCuttingConcernsOther` must be populated

**`UNOPS.PAO.Business/Workflow/StageRequirements/OpportunityStageRequirementsProvider.cs`**

- Add new requirement for cross-cutting concerns:
  - Name: `crossCuttingConcerns`
  - Description: `message.requirements.opportunity.crossCuttingConcernsRequired`
  - Place in WHY section (after beneficiaries)

### 2.4 API & Validation

- No new controller endpoint; `PATCH /api/opportunity/why` handles updates
- Add validation in `WhySectionRequest` for max 150 chars on `CrossCuttingConcernsOther`

---

## 3. Frontend Changes

### 3.1 WHY Section Component

**`opportunity-why-section.component.html`**

- Add new subsection **directly after** the beneficiaries block (around line 350)
- Match Delivery Modality styling (see `opportunity-what-section.component.html` lines 96–171):
  - Section header with icon: "Cross-cutting concerns to be considered in the project design"
  - Explanatory text: "Indicate the cross-cutting concerns which will be considered for inclusion in the development of this initiative."
- UI structure:
  - 7 rows: label + Yes/No radio buttons
  - "Other cross-cutting concerns (or reason for none of the above having been selected):" — free text box max 150 chars
- Edit vs view mode: radio buttons in edit; read-only display in view

**`opportunity-why-section.component.ts`**

- Add form controls for each Yes/No item and Other text
- Include in `buildWhySectionPayload()` and `patchFormFromOpportunity()`
- Validation: all 7 items must have Yes or No selected, OR if all No, Other must be populated

### 3.2 Translation Keys

Add to `en.json`, `fr.json`, `es.json`, `pt.json`:

- `label.crossCuttingConcerns.title`
- `message.crossCuttingConcerns.description`
- `label.crossCuttingConcerns.peopleBenefitting`
- `label.crossCuttingConcerns.genderEquality`
- `label.crossCuttingConcerns.createJobs`
- `label.crossCuttingConcerns.supplierCapacity`
- `label.crossCuttingConcerns.procurementCapacity`
- `label.crossCuttingConcerns.environmentalSafeguards`
- `label.crossCuttingConcerns.climateChange`
- `label.crossCuttingConcerns.other`
- `message.requirements.opportunity.crossCuttingConcernsRequired`

### 3.3 GO Requirements Dropdown

- `requirements-validation.component` uses the provider’s requirements
- No change needed once the new requirement is added to `OpportunityStageRequirementsProvider`

---

## 4. Opportunity Statement

### 4.1 Prompt Update

**`UNOPS.PAO.UNOPSDataAccess/Seed/Scripts/AiPrompts.sql`**

- `opportunity_generate_statement` prompt:
  - In section "## 2. Alignment with UN, global, and national goals and priorities", add:
    - **(e) Cross-cutting concerns:** [List items marked Yes if any; otherwise show “Other” if populated; otherwise [Information not available].]

### 4.2 AI Context Data

**`UNOPSOpportunityManager.GetOpportunityDetailsForAIAsync`**

- Add `crossCuttingConcerns` (or equivalent) to the dictionary passed to the statement generator
- Include items marked Yes and `CrossCuttingConcernsOther` when populated
- **Status:** ✅ Done in Phase 2 — context includes `crossCuttingConcerns`, `crossCuttingConcernsYesList`, per-item Yes/No/Not specified, and `crossCuttingConcernsOther`

---

## 4.3 opportunity_generate_insights

**`UNOPS.PAO.UNOPSDataAccess/Seed/Scripts/AiPrompts.sql`**

The `opportunity_generate_insights` prompt uses `GetOpportunityDetailsForAIAsync`, which already provides cross-cutting concern data. Update the prompt to:

- Add **Cross-cutting concerns** to analysis focus (e.g. under "Data Completeness & Quality" or new subsection):
  - Check if all 7 items have Yes/No selected (required for GO submission)
  - If all are No, verify `CrossCuttingConcernsOther` is populated
  - Flag incomplete cross-cutting concerns as a high-priority risk for approval
- Extend the "WHY" `actionTarget` in suggestion guidelines to include:
  - Cross-cutting concerns (7 Yes/No items + Other)
- Include `crossCuttingConcerns`, `crossCuttingConcernsYesList`, and per-item fields in the context the AI receives (via `GetOpportunityDetailsForAIAsync` — already included)

---

## 5. AI Transcription & Proposal Generation

### 5.1 `opportunity_document_transcribe`

**`AiPrompts.sql`**

- Add "Cross-cutting concerns" section to extraction instructions
- Include `crossCuttingConcerns` (object or array) with Yes/No per item
- Include `crossCuttingConcernsOther` (string, max 150)
- Map from document content (e.g. gender, jobs, climate, safeguards, capacity)

### 5.2 `opportunity_from_interactions`

**`AiPrompts.sql`**

- Add same cross-cutting concerns extraction to proposal generation instructions
- Include guidance on inferring from interaction themes and document content

### 5.3 Backend Mapping

**`AiContextualService` / `UNOPSGeminiManager`**

- Ensure `ApplyOpportunityAiChangesAsync` / `ApplyAiChanges` can map cross-cutting concern fields into the opportunity
- Add `CreateOpportunityFromProposalAsync` handling for `crossCuttingConcerns` and `crossCuttingConcernsOther` if used

### 5.4 `ApplyOpportunityAiChangesRequest`

**`UNOPS.PAO.Models/Opportunities/ApplyOpportunityAiChangesRequest.cs`**

- Add properties for the 7 Yes/No items and Other so AI changes can be applied

---

## 6. Documents & Related Items

**`opportunity-documents.component.ts`**

- Add `fieldPath` entries for the new fields:
  - `crossCuttingConcerns` (or equivalent) to the `fieldConfigs` array
  - `formatFn` to display selected items and Other text

---

## 7. Implementation Order

| Phase | Task | Files |
|-------|------|-------|
| 1 | Data model | Opportunity entity, migration, WhySectionRequest, OpportunityModel |
| 2 | Manager | `UpdateWhySectionAsync`, `GetOpportunityDetailsForAIAsync` |
| 3 | GO validation | `WorkflowController`, `OpportunityStageRequirementsProvider` |
| 4 | Frontend | `opportunity-why-section.component.ts/html`, i18n |
| 5 | Opportunity Statement | `opportunity_generate_statement` prompt, `GetOpportunityDetailsForAIAsync` |
| 5b | Insights prompt | `opportunity_generate_insights` prompt — add cross-cutting concerns to analysis focus and WHY actionTarget |
| 6 | AI transcription | `opportunity_document_transcribe`, `opportunity_from_interactions`, `ApplyOpportunityAiChangesRequest` |
| 7 | Documents | `opportunity-documents.component.ts` field config |

---

## 8. Cross-Cutting Concern Items (Reference)

| # | Label |
|---|-------|
| 1 | Account for people benefitting, including women and youth |
| 2 | Advance gender equality and/or social inclusion |
| 3 | Create jobs |
| 4 | Develop capacity for suppliers and/or implementing partners |
| 5 | Develop capacity for procurement and/or infrastructure institutions |
| 6 | Mainstream environmental and/or social safeguards |
| 7 | Mitigate and/or adapt to climate change |
| Other | Other cross-cutting concerns (or reason for none of the above having been selected) — max 150 chars |

---

## 9. Validation Rules

- **GO submission:** All 7 items must have Yes or No selected, OR if all are No, `CrossCuttingConcernsOther` must be populated
- **Other:** Max 150 characters
- **Opportunity Statement:** Display items marked Yes; if all No, show Other; otherwise [Information not available]

---

## 10. Testing

- **QA Tests** (per existing rules):
  - `CrossCuttingConcernsTests.cs` already exists; extend for new subsection
  - Integration tests for `UpdateWhySection` with cross-cutting concerns
  - `OpportunityStageRequirementsProviderTests` for new requirement
- **Frontend:** Unit tests for `opportunity-why-section.component`
- **E2E:** Playwright tests for new subsection and GO validation

---

## 11. Related Files

| Area | Path |
|------|------|
| WHY section | `UNOPS.PAO.ClientApp/.../why/opportunity-why-section.component.html` |
| WHY section | `UNOPS.PAO.ClientApp/.../why/opportunity-why-section.component.ts` |
| Delivery Modality (reference) | `UNOPS.PAO.ClientApp/.../what/opportunity-what-section.component.html` (lines 96–171) |
| WhySectionRequest | `UNOPS.PAO.Models/Opportunities/WhySectionRequest.cs` |
| UpdateWhySection | `UNOPS.PAO.UNOPSBusiness/Managers/UNOPSOpportunityManager.cs` (~line 1506) |
| GO validation | `UNOPS.PAO.Presentation/Controllers/WorkflowController.cs` (~line 1780) |
| Requirements provider | `UNOPS.PAO.Business/Workflow/StageRequirements/OpportunityStageRequirementsProvider.cs` |
| Statement prompt | `UNOPS.PAO.UNOPSDataAccess/Seed/Scripts/AiPrompts.sql` (~line 3621) |
| Insights prompt | `AiPrompts.sql` — `opportunity_generate_insights` (~line 2359) |
| Document transcribe | `AiPrompts.sql` (~line 1634) |
| From interactions | `AiPrompts.sql` (~line 2888) |
| Documents field config | `opportunity-documents.component.ts` (~line 350) |
