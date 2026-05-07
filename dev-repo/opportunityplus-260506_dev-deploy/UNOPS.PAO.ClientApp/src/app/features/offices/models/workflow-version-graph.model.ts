/**
 * Client models for UNOPS.Workflow.Models.WorkflowVersionAdmin graph DTOs (camelCase JSON).
 */

/** Matches workflow StepConditionCombineMode.Any (OR). */
export const WORKFLOW_EDITOR_CONDITION_COMBINE_OR = 1;

/** Opportunity+ does not use external stakeholders; persisted transitions are always internal-only. */
export const WORKFLOW_EDITOR_TRANSITION_INTERNAL_ONLY = {
  internal: true,
  external: false
} as const;

export interface WorkflowRoleConditionDraft {
  fieldKey: string;
  fieldType: string;
  operator: string;
  valueText: string;
}

export interface WorkflowRoleDelegateDraft {
  roleId: number;
  roleName: string;
}

export interface WorkflowStageChangeRoleDraft {
  roleId: number;
  roleName: string;
  sequence: number;
  conditionCombineMode: number;
  canTrigger: boolean;
  canApprove: boolean;
  conditions: WorkflowRoleConditionDraft[];
  delegates: WorkflowRoleDelegateDraft[];
}

export interface WorkflowStageChangeDraft {
  fromStage: string;
  toStage: string;
  name: string;
  sequence: number;
  commentRequired: boolean;
  commentOptional: boolean;
  approvalRequired: boolean;
  internal: boolean;
  external: boolean;
  roles: WorkflowStageChangeRoleDraft[];
}

export interface WorkflowStageDraft {
  stageCode: string;
  displayName?: string | null;
  sequence: number;
  facing: number;
  internalDisplayName?: string | null;
  internalSequence?: number | null;
  externalDisplayName?: string | null;
  externalSequence?: number | null;
}

export interface WorkflowVersionGraphDraft {
  stages: WorkflowStageDraft[];
  stageChanges: WorkflowStageChangeDraft[];
}

export function cloneWorkflowGraphFromApi(raw: unknown): WorkflowVersionGraphDraft {
  const g = raw as {
    stages?: WorkflowStageDraft[];
    stageChanges?: WorkflowStageChangeDraft[];
  };
  const stages = (g.stages ?? []).map((s) => ({
    stageCode: s.stageCode,
    displayName: s.displayName ?? null,
    sequence: s.sequence,
    facing: s.facing,
    internalDisplayName: s.internalDisplayName ?? null,
    internalSequence: s.internalSequence ?? null,
    externalDisplayName: s.externalDisplayName ?? null,
    externalSequence: s.externalSequence ?? null
  }));
  const stageChanges = (g.stageChanges ?? []).map((c) => ({
    fromStage: c.fromStage,
    toStage: c.toStage,
    name: c.name,
    sequence: c.sequence,
    commentRequired: !!c.commentRequired,
    commentOptional: !c.commentRequired,
    approvalRequired: !!c.approvalRequired,
    internal: WORKFLOW_EDITOR_TRANSITION_INTERNAL_ONLY.internal,
    external: WORKFLOW_EDITOR_TRANSITION_INTERNAL_ONLY.external,
    roles: (c.roles ?? []).map((r) => ({
      roleId: r.roleId,
      roleName: r.roleName ?? '',
      sequence: r.sequence,
      conditionCombineMode: WORKFLOW_EDITOR_CONDITION_COMBINE_OR,
      canTrigger: !!r.canTrigger,
      canApprove: !!r.canApprove,
      conditions: (r.conditions ?? []).map((x) => ({
        fieldKey: x.fieldKey ?? '',
        fieldType: x.fieldType ?? 'text',
        operator: x.operator ?? '',
        valueText: x.valueText ?? ''
      })),
      delegates: (r.delegates ?? []).map((d) => ({
        roleId: d.roleId,
        roleName: d.roleName ?? ''
      }))
    }))
  }));
  return { stages, stageChanges };
}

export function graphDraftToSavePayload(draft: WorkflowVersionGraphDraft): WorkflowVersionGraphDraft {
  const copy = JSON.parse(JSON.stringify(draft)) as WorkflowVersionGraphDraft;
  for (const c of copy.stageChanges) {
    c.internal = WORKFLOW_EDITOR_TRANSITION_INTERNAL_ONLY.internal;
    c.external = WORKFLOW_EDITOR_TRANSITION_INTERNAL_ONLY.external;
    c.commentOptional = !c.commentRequired;
  }
  return copy;
}
