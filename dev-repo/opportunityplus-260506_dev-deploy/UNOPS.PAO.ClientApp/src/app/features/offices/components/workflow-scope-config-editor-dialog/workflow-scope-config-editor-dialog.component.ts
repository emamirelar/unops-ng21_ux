/**
 * @fileoverview Generic scoped workflow graph editor (fork/edit) — structured form, not raw JSON.
 *
 * <p><b>Usage:</b> Office workflow configuration uses this dialog for non-Opportunity entity types only.
 * Opportunity Go/No-Go uses the dedicated <code>OpportunityScopeConfigEditorDialogComponent</code> instead.
 * This component remains the generic admin-style editor for other workflows.</p>
 */

import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  output,
  signal
} from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { WORKFLOW_EDITOR_ENGAGEMENT_DOA_ROLE_OPTIONS } from '../../config/workflow-editor-engagement-doa-roles.config';
import { WORKFLOW_SCOPE_EDITOR_UI_VISIBILITY } from '../../config/workflow-scope-editor-ui-visibility.config';
import {
  buildFullEngagementDoaCodeMap,
  resolveEngagementDoaRoleFromMap,
  WORKFLOW_EDITOR_ORG_HIERARCHY_ENTITY_TYPE
} from '../../models/workflow-editor-engagement-doa-role-resolution';
import { ValuesService, type SimpleValue } from '@app/shared/services/api/values.service';
import {
  cloneWorkflowGraphFromApi,
  graphDraftToSavePayload,
  WORKFLOW_EDITOR_CONDITION_COMBINE_OR,
  type WorkflowStageChangeDraft,
  type WorkflowStageChangeRoleDraft,
  type WorkflowVersionGraphDraft
} from '../../models/workflow-version-graph.model';
import {
  type WorkflowScopeEditorContext,
  WorkflowScopeConfigService
} from '../../services/workflow-scope-config.service';
import {
  OpportunityWorkflowConditionCatalogService,
  type WorkflowConditionOperatorOption
} from '../../services/opportunity-workflow-condition-catalog.service';
import type { WorkflowRoleConditionDraft } from '../../models/workflow-version-graph.model';
import { WorkflowConditionValueInputComponent } from '../workflow-condition-value-input/workflow-condition-value-input.component';

@Component({
  selector: 'app-workflow-scope-config-editor-dialog',
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    DatePickerModule,
    CheckboxModule,
    SelectModule,
    PanelModule,
    TableModule,
    ProgressSpinnerModule,
    MessageModule,
    ToastModule,
    WorkflowConditionValueInputComponent
  ],
  templateUrl: './workflow-scope-config-editor-dialog.component.html',
})
export class WorkflowScopeConfigEditorDialogComponent {
  private readonly api = inject(WorkflowScopeConfigService);
  private readonly valuesService = inject(ValuesService);
  private readonly opportunityConditionCatalog = inject(OpportunityWorkflowConditionCatalogService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  readonly saved = output<void>();

  visible = false;
  loading = signal(false);
  saving = signal(false);
  loadError: string | null = null;
  saveError: string | null = null;

  /** Exposed for template (subtitle). Cleared in <code>onDialogHide</code>. */
  protected context: WorkflowScopeEditorContext | null = null;

  /** When true, fork/save controls are hidden and fields are non-interactive. */
  protected readonlyMode = false;

  graph: WorkflowVersionGraphDraft | null = null;
  /** Cached DoA code → EntityRole id/name from the source graph (plus used for add-role resolution). */
  private engagementDoaCodeMap: Map<string, { roleId: number; roleName: string }> | null = null;
  /** Per transition index: selected Engagement DoA code to add, or null. */
  addRolePicks: (string | null)[] = [];

  versionDisplayName = '';
  effectiveFrom: Date | null = WorkflowScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());

  /** When true, save uses server UtcNow and ends other active/upcoming versions for this office. */
  activateImmediately = false;

  /** Inclusive minimum selectable date: start of today's UTC calendar day (for "UTC date" field). */
  protected get minEffectiveFromUtcDate(): Date {
    return WorkflowScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
  }

  readonly facingOptions = [
    { label: 'Two-face', value: 0 },
    { label: 'Internal', value: 1 },
    { label: 'External', value: 2 }
  ];

  /** Opportunity field + operator metadata for condition rows (same order as search-fields API). */
  readonly opportunityConditionFieldOptions = this.opportunityConditionCatalog.options;

  /** UI-only: sections/transitions hidden here remain on <code>graph</code> and in save payload. */
  protected readonly editorUiVisibility = WORKFLOW_SCOPE_EDITOR_UI_VISIBILITY;

  facingLabel(facing: number): string {
    return this.facingOptions.find((o) => o.value === facing)?.label ?? String(facing);
  }

  /** Start of UTC day for the given instant (00:00:00.000 UTC). */
  private static startOfUtcCalendarDay(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  }

  /**
   * Maps the datepicker value to UTC midnight for the calendar day the user selected
   * (local Y/M/D from the control, stored as that calendar date in UTC).
   */
  private static effectiveFromSelectionToUtcMidnight(d: Date): Date {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
  }

  /** Regional save warning: edit mode only, when this office impacts descendant workflow config. */
  protected showSaveImpactBanner(): boolean {
    return (
      !this.readonlyMode &&
      this.graph != null &&
      (this.context?.impactedDescendantOfficeCount ?? 0) > 0
    );
  }

  protected saveImpactBannerParams(): { count: number; officeName: string } {
    const c = this.context;
    return {
      count: c?.impactedDescendantOfficeCount ?? 0,
      officeName: c?.scopeOfficeDisplayName ?? ''
    };
  }

  /**
   * Transitions shown in the UI (excludes {@link WORKFLOW_SCOPE_EDITOR_UI_VISIBILITY.hiddenTransitions}).
   * <code>changeIndex</code> is the index in <code>graph.stageChanges</code> for <code>addRolePicks</code> and ids.
   */
  protected visibleStageChangeRows(): { change: WorkflowStageChangeDraft; changeIndex: number }[] {
    const g = this.graph;
    if (!g) {
      return [];
    }
    return g.stageChanges
      .map((change, changeIndex) => ({ change, changeIndex }))
      .filter(({ change }) => !this.isTransitionHiddenInEditorUi(change));
  }

  private isTransitionHiddenInEditorUi(c: WorkflowStageChangeDraft): boolean {
    const hidden = this.editorUiVisibility.hiddenTransitions;
    if (!hidden.length) {
      return false;
    }
    const from = (c.fromStage ?? '').trim();
    const to = (c.toStage ?? '').trim();
    const name = (c.name ?? '').trim();
    return hidden.some(
      (h) =>
        h.fromStage.trim().toUpperCase() === from.toUpperCase() &&
        h.toStage.trim().toUpperCase() === to.toUpperCase() &&
        h.name.trim().toUpperCase() === name.toUpperCase()
    );
  }

  /**
   * IDENTIFY & PROFILE → GO — Submit for Go: open by default; other transition panels start collapsed.
   * Keys matched with trim + case-insensitive comparison (same as hidden-transition config).
   */
  protected isTransitionPanelExpandedByDefault(change: WorkflowStageChangeDraft): boolean {
    const from = (change.fromStage ?? '').trim().toUpperCase();
    const to = (change.toStage ?? '').trim().toUpperCase();
    const name = (change.name ?? '').trim().toUpperCase();
    return from === 'IDENTIFY & PROFILE' && to === 'GO' && name === 'SUBMIT FOR GO';
  }

  /** Configured read-only roles (e.g. Opportunity Manager): no field edits, remove, or swap. */
  protected isApprovalRoleReadOnlyInEditor(role: WorkflowStageChangeRoleDraft): boolean {
    const names = this.editorUiVisibility.readOnlyApprovalRoleNames;
    if (!names.length) {
      return false;
    }
    const rn = (role.roleName ?? '').trim().toUpperCase();
    return names.some((n) => n.trim().toUpperCase() === rn);
  }

  protected canEditApprovalRoleRow(role: WorkflowStageChangeRoleDraft): boolean {
    return !this.readonlyMode && !this.isApprovalRoleReadOnlyInEditor(role);
  }

  /** True when the role at lowerIndex may swap with the next row (neither row is config read-only). */
  protected canSwapApprovalRolesAt(change: WorkflowStageChangeDraft, lowerIndex: number): boolean {
    if (this.readonlyMode || lowerIndex < 0 || lowerIndex >= change.roles.length - 1) {
      return false;
    }
    const a = change.roles[lowerIndex];
    const b = change.roles[lowerIndex + 1];
    return !this.isApprovalRoleReadOnlyInEditor(a) && !this.isApprovalRoleReadOnlyInEditor(b);
  }

  moveApprovalRoleUp(change: WorkflowStageChangeDraft, roleIndex: number): void {
    if (roleIndex <= 0 || !this.canSwapApprovalRolesAt(change, roleIndex - 1)) {
      return;
    }
    const roles = change.roles;
    [roles[roleIndex - 1], roles[roleIndex]] = [roles[roleIndex], roles[roleIndex - 1]];
    this.normalizeApprovalRoleSequences(change);
  }

  moveApprovalRoleDown(change: WorkflowStageChangeDraft, roleIndex: number): void {
    if (roleIndex >= change.roles.length - 1 || !this.canSwapApprovalRolesAt(change, roleIndex)) {
      return;
    }
    const roles = change.roles;
    [roles[roleIndex], roles[roleIndex + 1]] = [roles[roleIndex + 1], roles[roleIndex]];
    this.normalizeApprovalRoleSequences(change);
  }

  removeApprovalRoleFromTransition(change: WorkflowStageChangeDraft, roleIndex: number): void {
    const role = change.roles[roleIndex];
    if (!role || this.readonlyMode || this.isApprovalRoleReadOnlyInEditor(role)) {
      return;
    }
    change.roles.splice(roleIndex, 1);
    this.normalizeApprovalRoleSequences(change);
  }

  private normalizeApprovalRoleSequences(change: WorkflowStageChangeDraft): void {
    change.roles.forEach((r, i) => {
      r.sequence = i + 1;
    });
  }

  open(ctx: WorkflowScopeEditorContext): void {
    this.opportunityConditionCatalog.resetForEditorSession();
    this.context = ctx;
    this.readonlyMode = ctx.readonly === true;
    this.saveError = null;
    this.loadError = null;
    this.visible = true;
    this.fetchGraph();
  }

  close(): void {
    this.visible = false;
  }

  onDialogHide(): void {
    this.graph = null;
    this.engagementDoaCodeMap = null;
    this.addRolePicks = [];
    this.opportunityConditionCatalog.resetForEditorSession();
    this.context = null;
    this.readonlyMode = false;
    this.loadError = null;
    this.saveError = null;
    this.activateImmediately = false;
    this.loading.set(false);
    this.saving.set(false);
  }

  private fetchGraph(): void {
    const ctx = this.context;
    if (!ctx) {
      return;
    }
    this.loading.set(true);
    this.graph = null;
    forkJoin({
      raw: this.api.getWorkflowGraph(ctx.scopeEntityName, ctx.scopeEntityId, ctx.sourceVersionId, ctx.entityType),
      orgRoles: this.valuesService.getEntityRoles(WORKFLOW_EDITOR_ORG_HIERARCHY_ENTITY_TYPE).pipe(
        catchError(() => of([] as SimpleValue[]))
      ),
      conditionCatalog: this.opportunityConditionCatalog.ensureLoaded()
    }).subscribe({
      next: ({ raw, orgRoles }) => {
        if (!this.visible || this.context?.sourceVersionId !== ctx.sourceVersionId) {
          return;
        }
        this.graph = cloneWorkflowGraphFromApi(raw);
        this.engagementDoaCodeMap = buildFullEngagementDoaCodeMap(this.graph, orgRoles);
        this.addRolePicks = this.graph.stageChanges.map(() => null);
        this.opportunityConditionCatalog.mergeAdHocFieldKeys(this.collectConditionFieldKeys());
        this.syncConditionFieldMetadataFromCatalog();
        this.versionDisplayName = '';
        this.effectiveFrom = WorkflowScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
        this.loading.set(false);
      },
      error: () => {
        this.loadError = 'office.workflowConfig.editor.loadFailed';
        this.loading.set(false);
      }
    });
  }

  addCondition(_change: WorkflowStageChangeDraft, role: WorkflowStageChangeRoleDraft): void {
    role.conditions.push({
      fieldKey: '',
      fieldType: 'text',
      operator: '=',
      valueText: ''
    });
  }

  removeCondition(role: WorkflowStageChangeRoleDraft, index: number): void {
    role.conditions.splice(index, 1);
  }

  operatorsForCondition(cond: WorkflowRoleConditionDraft): WorkflowConditionOperatorOption[] {
    return this.opportunityConditionCatalog.operatorsForFieldKey(cond.fieldKey);
  }

  onWorkflowConditionFieldChange(cond: WorkflowRoleConditionDraft, fieldKey: string): void {
    cond.fieldKey = fieldKey;
    const meta = this.opportunityConditionCatalog.getMeta(fieldKey);
    if (meta) {
      cond.fieldType = meta.workflowFieldType;
      const ops = meta.operators;
      if (!ops.some((o) => o.value === cond.operator)) {
        cond.operator = ops[0]?.value ?? '=';
      }
    } else {
      cond.fieldType = 'text';
      const fallback = this.opportunityConditionCatalog.operatorsForFieldKey('');
      if (!fallback.some((o) => o.value === cond.operator)) {
        cond.operator = fallback[0]?.value ?? '=';
      }
    }
  }

  private syncConditionFieldMetadataFromCatalog(): void {
    const g = this.graph;
    if (!g) {
      return;
    }
    for (const c of g.stageChanges) {
      for (const r of c.roles) {
        for (const cond of r.conditions) {
          if (!cond.fieldKey?.trim()) {
            continue;
          }
          const meta = this.opportunityConditionCatalog.getMeta(cond.fieldKey);
          if (meta) {
            cond.fieldType = meta.workflowFieldType;
            const ops = meta.operators;
            if (!ops.some((o) => o.value === cond.operator)) {
              cond.operator = ops[0]?.value ?? '=';
            }
          }
        }
      }
    }
  }

  private collectConditionFieldKeys(): string[] {
    const g = this.graph;
    if (!g) {
      return [];
    }
    const keys: string[] = [];
    for (const c of g.stageChanges) {
      for (const r of c.roles) {
        for (const cond of r.conditions) {
          const k = cond.fieldKey?.trim();
          if (k) {
            keys.push(k);
          }
        }
      }
    }
    return keys;
  }

  engagementDoaAddOptions(
    c: WorkflowStageChangeDraft
  ): { label: string; code: string }[] {
    const map = this.engagementDoaCodeMap;
    if (!map) {
      return [];
    }
    const used = new Set(c.roles.map((r) => r.roleId));
    const out: { label: string; code: string }[] = [];
    for (const opt of WORKFLOW_EDITOR_ENGAGEMENT_DOA_ROLE_OPTIONS) {
      const resolved = resolveEngagementDoaRoleFromMap(map, opt.code, opt.fallbackRoleId);
      if (!resolved || used.has(resolved.roleId)) {
        continue;
      }
      out.push({ label: opt.label, code: opt.code });
    }
    return out;
  }

  addSelectedEngagementDoaRole(c: WorkflowStageChangeDraft, changeIndex: number): void {
    const code = this.addRolePicks[changeIndex];
    const map = this.engagementDoaCodeMap;
    if (!code || !map) {
      return;
    }
    const opt = WORKFLOW_EDITOR_ENGAGEMENT_DOA_ROLE_OPTIONS.find((o) => o.code === code);
    if (!opt) {
      return;
    }
    const resolved = resolveEngagementDoaRoleFromMap(map, opt.code, opt.fallbackRoleId);
    if (!resolved) {
      return;
    }
    if (c.roles.some((r) => r.roleId === resolved.roleId)) {
      return;
    }
    const maxSeq = c.roles.length === 0 ? 0 : Math.max(...c.roles.map((r) => r.sequence));
    c.roles.push({
      roleId: resolved.roleId,
      roleName: resolved.roleName,
      sequence: maxSeq + 1,
      conditionCombineMode: WORKFLOW_EDITOR_CONDITION_COMBINE_OR,
      canTrigger: false,
      canApprove: true,
      conditions: [],
      delegates: []
    });
    this.engagementDoaCodeMap?.set(opt.code, {
      roleId: resolved.roleId,
      roleName: resolved.roleName
    });
    this.addRolePicks[changeIndex] = null;
  }

  save(): void {
    if (this.readonlyMode) {
      return;
    }
    const ctx = this.context;
    const g = this.graph;
    if (!ctx || !g) {
      return;
    }
    if (!this.activateImmediately) {
      if (!this.effectiveFrom) {
        this.saveError = this.translate.instant('office.workflowConfig.editor.effectiveFromRequired');
        return;
      }
      const effectiveUtcMidnight = WorkflowScopeConfigEditorDialogComponent.effectiveFromSelectionToUtcMidnight(
        this.effectiveFrom
      );
      const minUtc = WorkflowScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
      if (effectiveUtcMidnight.getTime() < minUtc.getTime()) {
        this.saveError = this.translate.instant('office.workflowConfig.editor.effectiveFromPast');
        return;
      }
    }

    this.saving.set(true);
    this.saveError = null;
    const payload = {
      entityType: ctx.entityType,
      sourceVersionId: ctx.sourceVersionId,
      activateImmediately: this.activateImmediately,
      effectiveFromUtc: this.activateImmediately
        ? null
        : WorkflowScopeConfigEditorDialogComponent.effectiveFromSelectionToUtcMidnight(
            this.effectiveFrom as Date
          ).toISOString(),
      versionDisplayName: this.versionDisplayName.trim() || null,
      graph: graphDraftToSavePayload(g)
    };
    this.api.saveWorkflowVersion(ctx.scopeEntityName, ctx.scopeEntityId, payload).subscribe({
      next: (result) => {
        this.saving.set(false);
        if (!result.success) {
          this.saveError =
            result.errorMessage ?? this.translate.instant('office.workflowConfig.editor.saveFailed');
          return;
        }
        if (result.noChanges) {
          this.messageService.add({
            severity: 'info',
            summary: this.translate.instant('office.workflowConfig.editor.noChangesTitle'),
            detail: this.translate.instant('office.workflowConfig.editor.noChangesDetail')
          });
        } else {
          this.messageService.add({
            severity: 'success',
            summary: this.translate.instant('office.workflowConfig.editor.saveSuccessTitle'),
            detail: this.translate.instant('office.workflowConfig.editor.saveSuccessDetail', {
              id: result.stateMachineVersionId ?? ''
            })
          });
        }
        this.saved.emit();
        this.close();
      },
      error: (err: HttpErrorResponse) => {
        this.saving.set(false);
        const body = err.error as { errorMessage?: string } | undefined;
        this.saveError =
          body?.errorMessage ?? this.translate.instant('office.workflowConfig.editor.saveFailed');
      }
    });
  }

  trackRole = (_: number, r: WorkflowStageChangeRoleDraft) => `${r.roleId}-${r.sequence}`;
}
