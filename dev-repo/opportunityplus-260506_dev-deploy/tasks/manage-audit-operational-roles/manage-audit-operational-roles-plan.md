# Plan: Manage, Audit, and Synchronize Operational Office Roles

**Folder:** `tasks/manage-audit-operational-roles`  
**Primary UI entry point:** `UNOPS.PAO.ClientApp/src/app/features/offices/components/office-operational-roles-table/`  
**Meeting context:** `Meeting notes` (Sprint Planning #38, 17 Apr 2026)  
**Integration coordination:** Roz BECKETT (ERP and oneUNOPS Projects / oUP data flows and structure differences)

---

## 1. Goal

Enable UNOPS personnel to **manage operational roles** for their organizational unit (office) in Opportunity+ with **validation, effective dating, auditing**, and **immediate propagation** to linked opportunities—without a complex approval workflow. Opportunity+ becomes the **source of truth** for the designated operational roles; data is then reflected in **ERP** and **oUP**, accounting for differing payloads and integration complexity.

---

## 2. User story

As UNOPS personnel, I want to manage operational roles for my organizational unit with built-in data validation and auditing, so that our office records are accurate, up-to-date, and transparent without requiring complex approval workflows.

---

## 3. Acceptance criteria (authoritative checklist)

| # | Criterion | Notes |
|---|-----------|--------|
| **AC1** | **Editing permissions** | Users may **edit** only when their **“works at”** organizational unit **matches** the office record being viewed. Users who no longer work at that office **must not** edit. Server-side enforcement required (client checks are not sufficient). |
| **AC2** | **Personnel selection** | Editable fields allow selecting **any active personnel** (appropriate typeahead/search; validate “active” with product/HR rules). |
| **AC3** | **Effective dating** | Changes apply with an **effective date ≥ today** (UTC or agreed policy). **Past (retrospective) dates blocked** to avoid disrupting stakeholder notifications on related opportunities. |
| **AC4** | **Dynamic synchronization** | On successful update of an operational role for an office, **opportunity records** tied to that office **update immediately** to show the new role values (no batch-only lag if product requires “immediate”). |
| **AC5** | **Audit trail** | Each change to the managed operational roles logs: **who** (user), **when** (timestamp), **effective date** of the change, and sufficient context to identify **which role** and **which office**. |
| **AC6** | **Mismatch flag** | If the listed **Director Manager**’s **“works at”** unit **does not match** the office record, show a **visual alert** (e.g. exclamation mark) — **warn**, do not necessarily block save (align with meeting: selection not blocked). |
| **AC7** | **Integration** | Use office data in Opportunity+ as **source of truth** for the **three core roles** (Director Manager, Deputy Director Manager, HSSE Coordinator); **push/sync** to **ERP** and **oUP** with explicit mapping for structural differences. **Owner:** coordinate with **Roz BECKETT**. |
| **AC8** | **Regional-only roles** | **HSSE Regional Specialist** and **HSSE Regional Specialist OiC** visible **only** when the office’s organisational entity type is **Regional Office** (change request; confirm exact enum/value with domain data). |
| **AC9** | **Remove Head of Programme** | **Head of Programme** removed from office operational roles (not maintained in Opportunity+; applies to initiatives, not org offices). Clean up UI, seeds, and any sync references as needed. |
| **AC10** | **Regional Management Oversight Advisors** | For **Regional Office** only: add **Regional Management Oversight Advisor** role(s). **One-time import** of assignees from a list to be provided (e.g. Francisco MARTINEZ LOPEZ / regional naming — per meeting). After import, **editable under same rules as AC1**. |

---

## 4. Alignment with meeting notes (Sprint #38)

- **Source of truth** moves from ERP toward **Opportunity+** for these operational roles; **EIP** screens become redundant for updates; **permissions to EIP role management** to be removed when O+ is ready (separate task — Lars JUNGSBERG).
- **Five story points** discussed for the operational roles management story; scope includes permissions, effective dating, sync to opportunities, audit, mismatch flag, and integration direction.
- **Francisco MARTINEZ LOPEZ:** provide list of **5 regions** and names for **Regional Management Oversight Advisor** (feeds AC10).
- **Design:** entity templates and offices module enhancements run in parallel; this feature should still follow **design system** and existing office patterns (see `tasks/ui-technical-cleanup/` guardrails where relevant).

---

## 5. Current implementation snapshot

- **Frontend:** `OfficeOperationalRolesTableComponent` is **read-only**: displays role name, holder, position, org unit, status. Deputy Director label maps a specific `Organizational_Deputy_Director_OrganizationHierarchy` code.
- **Model:** `OfficeOperationalRoleModel` (Angular + .NET) includes `entityRoleCode`, `roleName`, `holderName`, `positionTitle`, `orgUnitWorksAt`, `isActive`.
- **Backend:** `OfficeService.LoadOperationalRolesAsync` builds operational role rows for office detail (extend for edit APIs, auditing, effective dates, and opportunity updates).

---

## 6. Scope boundaries

**In scope**

- Permission model tied to **“works at”** vs office.
- CRUD/update flows for designated roles with **effective date** and **audit**.
- **Mismatch** indicator for Director Manager vs office.
- **Conditional visibility** by **Organisational Entity Type** (Regional Office).
- **Removal** of Head of Programme from office context.
- **Import** path for Regional Management Oversight Advisor assignees + ongoing editability.
- **Downstream sync** design and implementation for ERP and oUP (phased if necessary, but AC7 must be traceable to deliverables).

**Out of scope / separate items**

- Complex multi-step **approval workflows** (explicitly excluded by story).
- **EIP permission removal** (tracked as follow-up in meeting notes).
- **Opportunity Statement** workflow and **document versioning** stories mentioned in the same meeting.

---

## 7. Technical workstreams

### 7.1 Permissions and validation

- Server-side rule: **canEditOperationalRoles** iff current user’s **works-at** org unit matches **this office’s** org hierarchy (define ID comparison: office entity vs HR “works at” field).
- Reject edits from users who do not qualify; return **403** or domain-appropriate error.

### 7.2 Data model and persistence

- Store **effective-dated** assignments (new table or extension of `EntityUserRole` / office-role assignment — to be decided in design spike).
- Persist **audit** rows (append-only): user id, UTC timestamp, effective date, office id, role code, previous/new personnel ids or snapshots as required for compliance.

### 7.3 Opportunities synchronization

- On commit: resolve **all opportunities** linked to the office and **refresh denormalized role fields** or **re-query** from source so UI/API reflect changes immediately (define current storage of “operational contact” fields on opportunity).

### 7.4 Integration (ERP / oUP)

- Document **field mapping** and **direction**: O+ → ERP, O+ → oUP.
- Handle **frequency** (event-driven vs scheduled) — meeting asked for **dynamic/immediate** on O+ side; integration may be **near-real-time** within platform constraints.
- **Roz BECKETT:** sign-off on contracts and test evidence.

### 7.5 UI/UX

- Extend `office-operational-roles-table` (or companion components) with **edit mode**, **personnel picker**, **effective date** control, **mismatch** icon with tooltip/aria text.
- **Regional Office** gating for HSSE Regional roles and Regional Management Oversight Advisors.
- Remove **Head of Programme** row/seed from office operational context.

### 7.6 One-time import

- Scripted import or admin-only bulk load from **provided list**; idempotent where possible; log import batch in audit.

---

## 8. Dependencies

| Dependency | Owner / action |
|------------|----------------|
| List of Regional Management Oversight Advisor assignments (regions/names) | Francisco MARTINEZ LOPEZ (per meeting) |
| ERP / oUP API contracts and environments | Roz BECKETT + integration team |
| Canonical **Organisational Entity Type** value for “Regional Office” | Data/BA confirmation |
| “Active personnel” definition | HR / existing personnel API |

---

## 9. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Effective dating vs existing notifications | Block past dates (AC3); document edge cases for same-day changes. |
| Stale opportunity display | Transactional or post-commit job with clear UX refresh; API returns updated snapshots. |
| Integration drift between ERP and oUP | Versioned DTOs, integration tests, feature flags if needed. |
| Performance on large opportunity sets | Batch update with progress or async with “processing” state if immediate full sync is costly — confirm with PO if async is acceptable vs AC4 “immediate”. |

---

## 10. Success metrics

- Editors without matching “works at” cannot mutate data (verified by tests).
- Audit log complete for every role change.
- Opportunities consuming office operational data show updated values after edit within agreed SLA.
- Regional-only roles hidden on non-regional offices.
- Head of Programme absent from office operational UI and seeds.
- Import completed once; subsequent edits use standard flow.

---

## 11. Related documentation

- Task breakdown: [`manage-audit-operational-roles-tasks.md`](manage-audit-operational-roles-tasks.md)
- Prior related work: `tasks/entity-user-roles-operational-doa/` (entity roles, seeds, EDS)
- Offices module: `tasks/manage-office/`

---

## 12. Revision history

| Date | Change |
|------|--------|
| 2026-04-20 | Initial plan from user story, AC, meeting notes, and current `office-operational-roles-table` snapshot |
