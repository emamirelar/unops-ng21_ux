# Task List: Manage, Audit, and Synchronize Operational Office Roles

**Generated from:** [`manage-audit-operational-roles-plan.md`](manage-audit-operational-roles-plan.md)  
**Generated on:** 2026-04-20

---

## Relevant files (starting points)

### Frontend (Angular)

- `UNOPS.PAO.ClientApp/src/app/features/offices/components/office-operational-roles-table/office-operational-roles-table.component.ts` — MODIFY (read-only → edit UX, flags)
- `UNOPS.PAO.ClientApp/src/app/features/offices/components/office-operational-roles-table/office-operational-roles-table.component.html` — MODIFY
- `UNOPS.PAO.ClientApp/src/app/features/offices/components/office-operational-roles-table/office-operational-roles-table.component.scss` — MODIFY (minimal; follow design tokens)
- `UNOPS.PAO.ClientApp/src/app/features/offices/models/office.model.ts` — MODIFY (`OfficeOperationalRoleModel` extensions: effective date, mismatch, edit metadata as needed)
- Office feature services / office detail container — MODIFY (load permissions, save handlers, refresh)
- `public/assets/i18n/en.json` (and `fr`, `es`, `pt`) — MODIFY (new strings for edit, validation, mismatch tooltip, regional roles)

### Backend (.NET)

- `UNOPS.PAO.UNOPSBusiness/Services/OfficeService.cs` — MODIFY (`LoadOperationalRolesAsync`, new update paths, opportunity refresh hooks)
- `UNOPS.PAO.Models/Offices/OfficeOperationalRoleModel.cs` — MODIFY
- `UNOPS.PAO.Models/Offices/OfficeDetailModel.cs` — REVIEW
- Office-related API controller(s) — MODIFY (GET permissions, PATCH/PUT operational roles)
- Domain: `EntityUserRole` / office linkage — MODIFY or NEW persistence for effective-dated assignments + audit
- `UNOPS.PAO.UNOPSDataAccess/` — Migrations NEW
- Authorization: permission handlers / “works at” check — NEW or MODIFY
- Integration clients or sync services for ERP / oUP — NEW or MODIFY (coordinate with Roz BECKETT)

### Data / external

- Entity role seeds — MODIFY (remove Head of Programme from office context; add Regional Management Oversight Advisor codes if new)
- EDS / sync YAML (if roles still sync from BigQuery for some fields) — REVIEW vs “O+ source of truth” decision
- One-time import script or admin endpoint — NEW

### QA

- `QA Tests/` — integration/API tests for permissions, effective date validation, audit records, opportunity refresh (per project test rules)

---

## Critical testing notes

- Server must enforce **works-at match**; add automated tests that **403** (or equivalent) when mismatch.
- **Never** weaken tests to match incorrect production behavior (see project defect-testing rules).
- Add tests for **blocked retrospective** effective dates and for **regional-only** role visibility.

---

## Tasks

- [ ] **0.0 Discovery and alignment**
  - [ ] 0.1 Confirm canonical value for **Organisational Entity Type: Regional Office** in DB/API
  - [ ] 0.2 Confirm how **“works at”** is represented for the current user and for personnel pickers (IDs, codes)
  - [ ] 0.3 Document where opportunity records store **operational role** display fields and how they resolve from office
  - [ ] 0.4 Workshop with **Roz BECKETT**: ERP and oUP **payloads**, ordering, error handling, retry (output a short **integration spec** in this folder or `docs/`)
  - [ ] 0.5 Receive **Regional Management Oversight Advisor** list (regions/names) from stakeholder (meeting: Francisco MARTINEZ LOPEZ)
  - [ ] 0.6 Spike: **audit** table design vs append-only log; align with existing `AuditableDbContext` patterns

- [ ] **1.0 Backend: Permissions**
  - [ ] 1.1 Implement server rule: edit allowed only if user’s **works-at** org unit matches **target office** org hierarchy
  - [ ] 1.2 Expose read-only **canEditOperationalRoles** (or equivalent) on office detail or dedicated endpoint for UI
  - [ ] 1.3 Unit/integration tests: allowed vs denied users

- [ ] **2.0 Backend: Data model, effective dating, audit**
  - [ ] 2.1 Design persistence for role assignments with **effective date** (≥ today) and history if required
  - [ ] 2.2 Implement **audit trail** entries: user, timestamp, effective date, office, role, before/after identifiers
  - [ ] 2.3 Migration(s) with defensive patterns per project standards
  - [ ] 2.4 API: update operational role assignment(s) with validation (no past effective dates)
  - [ ] 2.5 Tests: audit row created per change; retrospective date rejected

- [ ] **3.0 Backend: Mismatch flag (Director Manager)**
  - [ ] 3.1 Compute whether Director Manager’s **works-at** differs from office org unit
  - [ ] 3.2 Return flag on office/role DTO for UI (e.g. `worksAtMismatch: true`)
  - [ ] 3.3 Tests: mismatch vs match scenarios

- [ ] **4.0 Backend: Opportunity synchronization**
  - [ ] 4.1 On successful role update, **update or invalidate** cached fields on related opportunities
  - [ ] 4.2 Verify **read APIs** for opportunities return fresh operational role data (define SLA vs AC4 “immediate”)
  - [ ] 4.3 Tests: opportunity reflects new assignment after office update

- [ ] **5.0 Backend: Role matrix — regional gating and removals**
  - [ ] 5.1 **Omit or hide** HSSE Regional Specialist and HSSE Regional Specialist OiC unless office is **Regional Office**
  - [ ] 5.2 **Remove Head of Programme** from office operational roles (seeds, queries, UI)
  - [ ] 5.3 Add **Regional Management Oversight Advisor** role(s) for Regional Office; wire to same edit/audit rules
  - [ ] 5.4 Tests: regional vs non-regional office payloads

- [ ] **6.0 One-time import**
  - [ ] 6.1 Import **Regional Management Oversight Advisor** assignees from approved list (script or secured bulk)
  - [ ] 6.2 Idempotency and audit note for import batch
  - [ ] 6.3 Verify post-import editability per AC1

- [ ] **7.0 Integration: ERP and oUP**
  - [ ] 7.1 Map O+ office operational fields to **ERP** structures (handle differences explicitly)
  - [ ] 7.2 Map O+ fields to **oUP** structures
  - [ ] 7.3 Implement push/sync on change (or queued with documented latency if agreed)
  - [ ] 7.4 Integration tests or sandbox verification with **Roz BECKETT** sign-off criteria

- [ ] **8.0 Frontend: Office operational roles UI**
  - [ ] 8.1 **Personnel picker** (active personnel) for editable roles; disabled state when `canEditOperationalRoles` is false
  - [ ] 8.2 **Effective date** control (min = today); validation messages i18n
  - [ ] 8.3 **Mismatch** exclamation indicator for Director Manager (accessible label + tooltip)
  - [ ] 8.4 Conditional rows for **Regional Office** only (HSSE Regional, HSSE Regional OiC, Regional Management Oversight Advisors)
  - [ ] 8.5 Remove **Head of Programme** from table if present
  - [ ] 8.6 Save/cancel flows; refresh table and parent office detail after success
  - [ ] 8.7 Align with **PrimeNG / design system** (no unauthorized global style edits)

- [ ] **9.0 QA and documentation**
  - [ ] 9.1 Test plan covering AC1–AC10
  - [ ] 9.2 Update epic/story links in Azure DevOps/Jira per team process
  - [ ] 9.3 Handover notes for support: how audit is queried and what integration errors look like

---

## Optional follow-ups (from meeting, not blocking this story’s AC)

- [ ] Remove permissions to **EIP role management** when Opportunity+ is confirmed as master (Lars JUNGSBERG)
- [ ] Story title spelling fix (“template” vs “L template”) if still applicable

---

## Completion checklist

- [ ] All AC1–AC10 traceable to tests or signed integration evidence
- [ ] No retrospective effective dates in production paths
- [ ] Audit entries verified for each role change type
- [ ] Regional-only roles verified in UI and API
- [ ] Head of Programme absent from office operational surfaces
- [ ] ERP/oUP sync documented and verified with Roz BECKETT
