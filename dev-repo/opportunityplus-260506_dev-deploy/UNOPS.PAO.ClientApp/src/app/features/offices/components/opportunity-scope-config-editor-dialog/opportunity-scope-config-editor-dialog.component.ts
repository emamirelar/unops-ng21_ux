/**
 * @fileoverview Opportunity Go/No-Go scoped workflow version editor (IDENTIFY & PROFILE → GO only).
 * Does not use workflow-scope / engagement DoA UI config modules — DoA2/DoA3 are fixed for this flow.
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';

import { ValuesService } from '@app/shared/services/api/values.service';
import {
  buildEngagementDoaCodeMapFromGraph,
  engagementDoaCodeFromRoleName,
  syntheticEngagementDoaRoleName,
  WORKFLOW_EDITOR_ORG_HIERARCHY_ENTITY_TYPE
} from '../../models/workflow-editor-engagement-doa-role-resolution';
import {
  cloneWorkflowGraphFromApi,
  graphDraftToSavePayload,
  WORKFLOW_EDITOR_CONDITION_COMBINE_OR,
  type WorkflowRoleConditionDraft,
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
import { WorkflowConditionValueInputComponent } from '../workflow-condition-value-input/workflow-condition-value-input.component';

const IP_TO_GO_FROM = 'IDENTIFY & PROFILE';
const IP_TO_GO_TO = 'GO';
const DOA2_CODE = 'DoA2_Engagement_Acceptance';
const DOA3_CODE = 'DoA3_Engagement_Acceptance';

@Component({
  selector: 'app-opportunity-scope-config-editor-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    ProgressSpinnerModule,
    MessageModule,
    ToastModule,
    WorkflowConditionValueInputComponent
  ],
  templateUrl: './opportunity-scope-config-editor-dialog.component.html'
})
export class OpportunityScopeConfigEditorDialogComponent {
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

  protected context: WorkflowScopeEditorContext | null = null;
  protected readonlyMode = false;

  graph: WorkflowVersionGraphDraft | null = null;
  protected ipToGoChange: WorkflowStageChangeDraft | null = null;
  private doaRoleByCode: Map<string, { roleId: number; roleName: string }> = new Map();

  /** DoA2 row on I&P → GO (approver). */
  protected doa2Role: WorkflowStageChangeRoleDraft | null = null;
  /** Optional sequential DoA3 approver (conditions apply to this step). */
  protected doa3SequentialRole: WorkflowStageChangeRoleDraft | null = null;

  versionDisplayName = '';
  effectiveFrom: Date | null = OpportunityScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
  activateImmediately = false;

  readonly opportunityConditionFieldOptions = this.opportunityConditionCatalog.options;

  protected get minEffectiveFromUtcDate(): Date {
    return OpportunityScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
  }

  private static startOfUtcCalendarDay(d: Date): Date {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
  }

  private static effectiveFromSelectionToUtcMidnight(d: Date): Date {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0));
  }

  /** Office display name for dialog header line 2 (from scope context). */
  protected headerOfficeName(): string {
    return this.context?.scopeOfficeDisplayName?.trim() ?? '';
  }

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

  /** DoA3 delegate rows on the DoA2 approver (org fallback when no DoA2 holder). */
  protected doa3DelegatesOnDoa2(): WorkflowStageChangeRoleDraft['delegates'] {
    return this.doa2Role?.delegates?.filter((d) => engagementDoaCodeFromRoleName(d.roleName) === DOA3_CODE) ?? [];
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
    this.ipToGoChange = null;
    this.doaRoleByCode = new Map();
    this.doa2Role = null;
    this.doa3SequentialRole = null;
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
    this.ipToGoChange = null;
    this.doa2Role = null;
    this.doa3SequentialRole = null;

    forkJoin({
      raw: this.api.getWorkflowGraph(ctx.scopeEntityName, ctx.scopeEntityId, ctx.sourceVersionId, ctx.entityType),
      orgRoles: this.valuesService.getEntityRoles(WORKFLOW_EDITOR_ORG_HIERARCHY_ENTITY_TYPE).pipe(
        catchError(() => of([]))
      ),
      conditionCatalog: this.opportunityConditionCatalog.ensureLoaded()
    }).subscribe({
      next: ({ raw, orgRoles }) => {
        if (!this.visible || this.context?.sourceVersionId !== ctx.sourceVersionId) {
          return;
        }
        const graph = cloneWorkflowGraphFromApi(raw);
        this.graph = graph;
        this.doaRoleByCode = this.buildDoaCodeMap(graph, orgRoles);
        const change = this.findIpToGoChange(graph);
        this.ipToGoChange = change;
        if (!change) {
          this.loadError = 'office.workflowConfig.opportunityEditor.missingGoTransition';
          this.loading.set(false);
          return;
        }
        this.bindDoaRoles(change);
        if (!this.doa2Role) {
          this.loadError = 'office.workflowConfig.opportunityEditor.missingDoa2';
          this.loading.set(false);
          return;
        }
        this.opportunityConditionCatalog.mergeAdHocFieldKeys(this.collectDoa3ConditionKeys());
        this.syncConditionMetadataFromCatalog();
        this.versionDisplayName = '';
        this.effectiveFrom = OpportunityScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
        this.loading.set(false);
      },
      error: () => {
        this.loadError = 'office.workflowConfig.editor.loadFailed';
        this.loading.set(false);
      }
    });
  }

  private buildDoaCodeMap(
    graph: WorkflowVersionGraphDraft,
    orgRoles: { id: number; name: string; code?: string | null }[]
  ): Map<string, { roleId: number; roleName: string }> {
    const map = new Map(buildEngagementDoaCodeMapFromGraph(graph));
    for (const code of [DOA2_CODE, DOA3_CODE]) {
      if (map.has(code)) {
        continue;
      }
      const er = orgRoles.find((r) => r.code === code);
      if (er) {
        map.set(code, {
          roleId: er.id,
          roleName: er.name?.trim() ? er.name.trim() : syntheticEngagementDoaRoleName(code)
        });
      }
    }
    return map;
  }

  private findIpToGoChange(graph: WorkflowVersionGraphDraft): WorkflowStageChangeDraft | null {
    const c = graph.stageChanges.find(
      (x) => x.fromStage === IP_TO_GO_FROM && x.toStage === IP_TO_GO_TO
    );
    return c ?? null;
  }

  private bindDoaRoles(change: WorkflowStageChangeDraft): void {
    const doa2Idx = change.roles.findIndex(
      (r) => r.canApprove && engagementDoaCodeFromRoleName(r.roleName) === DOA2_CODE
    );
    this.doa2Role = doa2Idx >= 0 ? change.roles[doa2Idx] : null;

    const doa3Idx = change.roles.findIndex(
      (r) => r.canApprove && engagementDoaCodeFromRoleName(r.roleName) === DOA3_CODE
    );
    this.doa3SequentialRole = doa3Idx >= 0 ? change.roles[doa3Idx] : null;
  }

  addOptionalDoa3Step(): void {
    if (this.readonlyMode || !this.ipToGoChange || !this.doa2Role || this.doa3SequentialRole) {
      return;
    }
    const resolved = this.doaRoleByCode.get(DOA3_CODE);
    if (!resolved) {
      this.saveError = this.translate.instant('office.workflowConfig.opportunityEditor.doa3RoleUnavailable');
      return;
    }
    const change = this.ipToGoChange;
    const maxSeq =
      change.roles.length === 0 ? 0 : Math.max(...change.roles.filter((r) => r.canApprove).map((r) => r.sequence));
    const row: WorkflowStageChangeRoleDraft = {
      roleId: resolved.roleId,
      roleName: resolved.roleName,
      sequence: maxSeq + 1,
      conditionCombineMode: WORKFLOW_EDITOR_CONDITION_COMBINE_OR,
      canTrigger: false,
      canApprove: true,
      conditions: [],
      delegates: []
    };
    change.roles.push(row);
    this.normalizeApproveSequences(change);
    this.doa3SequentialRole = row;
    this.saveError = null;
    this.opportunityConditionCatalog.mergeAdHocFieldKeys(this.collectDoa3ConditionKeys());
    this.syncConditionMetadataFromCatalog();
  }

  /** Removes only the optional sequential DoA3 approver; DoA2 delegates (e.g. DoA3 fallback) are left unchanged. */
  removeOptionalDoa3Step(): void {
    if (this.readonlyMode || !this.ipToGoChange || !this.doa2Role || !this.doa3SequentialRole) {
      return;
    }
    const change = this.ipToGoChange;
    const idx = change.roles.indexOf(this.doa3SequentialRole);
    if (idx >= 0) {
      change.roles.splice(idx, 1);
    }
    this.doa3SequentialRole = null;
    this.normalizeApproveSequences(change);
    this.saveError = null;
  }

  private normalizeApproveSequences(change: WorkflowStageChangeDraft): void {
    const approve = change.roles.filter((r) => r.canApprove).sort((a, b) => a.sequence - b.sequence);
    approve.forEach((r, i) => {
      r.sequence = i + 1;
    });
  }

  addCondition(role: WorkflowStageChangeRoleDraft): void {
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

  private collectDoa3ConditionKeys(): string[] {
    const r = this.doa3SequentialRole;
    if (!r) {
      return [];
    }
    return r.conditions.map((c) => c.fieldKey?.trim()).filter((k): k is string => !!k);
  }

  private syncConditionMetadataFromCatalog(): void {
    const r = this.doa3SequentialRole;
    if (!r) {
      return;
    }
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

  save(): void {
    if (this.readonlyMode) {
      return;
    }
    const ctx = this.context;
    const g = this.graph;
    if (!ctx || !g || !this.doa2Role) {
      return;
    }
    if (!this.activateImmediately) {
      if (!this.effectiveFrom) {
        this.saveError = this.translate.instant('office.workflowConfig.editor.effectiveFromRequired');
        return;
      }
      const effectiveUtcMidnight = OpportunityScopeConfigEditorDialogComponent.effectiveFromSelectionToUtcMidnight(
        this.effectiveFrom
      );
      const minUtc = OpportunityScopeConfigEditorDialogComponent.startOfUtcCalendarDay(new Date());
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
        : OpportunityScopeConfigEditorDialogComponent.effectiveFromSelectionToUtcMidnight(
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
}
