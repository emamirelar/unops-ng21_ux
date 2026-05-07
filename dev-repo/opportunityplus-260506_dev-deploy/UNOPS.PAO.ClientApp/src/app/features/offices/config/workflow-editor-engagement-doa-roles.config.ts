/**
 * Addable Engagement Acceptance DoA roles for the workflow scope editor.
 * RoleIds are resolved from the loaded source graph (roles + delegates) when present;
 * use optional fallbackRoleId when a code never appears in the graph (environment-specific).
 */
export interface WorkflowEditorEngagementDoaRoleOption {
  readonly code: string;
  readonly label: string;
  readonly fallbackRoleId?: number;
}

export const WORKFLOW_EDITOR_ENGAGEMENT_DOA_ROLE_OPTIONS: readonly WorkflowEditorEngagementDoaRoleOption[] = [
  { code: 'DoA1_Engagement_Acceptance', label: 'DoA1 Engagement Acceptance' },
  { code: 'DoA2_Engagement_Acceptance', label: 'DoA2 Engagement Acceptance' },
  { code: 'DoA3_Engagement_Acceptance', label: 'DoA3 Engagement Acceptance' },
  { code: 'DoA4_Engagement_Acceptance', label: 'DoA4 Engagement Acceptance' }
];
