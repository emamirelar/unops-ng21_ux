/**
 * Controls which parts of the workflow scope editor are shown. Hidden sections still exist on the
 * in-memory graph and are included when saving — only the UI is filtered.
 *
 * Transition keys are matched with trim + case-insensitive comparison on fromStage, toStage, and name.
 */

export interface WorkflowScopeEditorHiddenTransition {
  fromStage: string;
  toStage: string;
  /** Transition display / action name (e.g. "Reopen"). */
  name: string;
}

export const WORKFLOW_SCOPE_EDITOR_UI_VISIBILITY = {
  /** When true, the read-only Stages table is not rendered. */
  hideStagesSection: true,

  /**
   * Transitions to omit from the editor UI (still cloned in the saved payload).
   */
  hiddenTransitions: [
    { fromStage: 'CANCELLED', toStage: 'IDENTIFY & PROFILE', name: 'Reopen' },
    { fromStage: 'IDENTIFY & PROFILE', toStage: 'CANCELLED', name: 'Cancel' },
    { fromStage: 'IDENTIFY & PROFILE', toStage: 'NO GO', name: 'Submit for No Go' },
    { fromStage: 'NO GO', toStage: 'IDENTIFY & PROFILE', name: 'Reopen' }
  ] as const satisfies readonly WorkflowScopeEditorHiddenTransition[],

  /**
   * Approval role display names (trim, case-insensitive) shown read-only: no edits, remove, or reorder
   * (swaps involving this row are blocked).
   */
  readOnlyApprovalRoleNames: ['Opportunity Manager'] as const satisfies readonly string[]
};
