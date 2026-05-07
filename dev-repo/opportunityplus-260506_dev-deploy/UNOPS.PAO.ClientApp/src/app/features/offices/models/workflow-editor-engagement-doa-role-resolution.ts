import { WORKFLOW_EDITOR_ENGAGEMENT_DOA_ROLE_OPTIONS } from '../config/workflow-editor-engagement-doa-roles.config';
import type { WorkflowVersionGraphDraft } from './workflow-version-graph.model';

/** Entity type for PAO EntityRole rows that hold DoA1–DoA4 Engagement Acceptance. */
export const WORKFLOW_EDITOR_ORG_HIERARCHY_ENTITY_TYPE = 'OrganizationHierarchy';

function normalizeRoleNameForMatching(roleName: string): string {
  return roleName
    .trim()
    .replace(/\u2013|\u2014/g, '-') // en-dash, em-dash → hyphen
    .replace(/\s+/g, ' ');
}

/**
 * Maps display / EntityRole.Name values to DoA{n}_Engagement_Acceptance codes.
 * Accepts typical PAO seed names and minor punctuation variants.
 */
export function engagementDoaCodeFromRoleName(roleName: string): string | null {
  const normalized = normalizeRoleNameForMatching(roleName);
  let m = /^DoA([1-9]\d*)\s*-\s*Engagement Acceptance$/i.exec(normalized);
  if (m) {
    return `DoA${m[1]}_Engagement_Acceptance`;
  }
  if (/Engagement Acceptance/i.test(normalized)) {
    m = /\bDoA([1-9]\d*)\b/i.exec(normalized);
    if (m) {
      return `DoA${m[1]}_Engagement_Acceptance`;
    }
  }
  return null;
}

export function syntheticEngagementDoaRoleName(code: string): string {
  const m = /^DoA([1-9]\d*)_Engagement_Acceptance$/i.exec(code.trim());
  if (!m) {
    return code;
  }
  return `DoA${m[1]} - Engagement Acceptance`;
}

/** Maps Engagement Acceptance DoA codes to EntityRole id + name as seen in the source graph. */
export function buildEngagementDoaCodeMapFromGraph(
  graph: WorkflowVersionGraphDraft
): Map<string, { roleId: number; roleName: string }> {
  const map = new Map<string, { roleId: number; roleName: string }>();

  const upsert = (roleId: number, roleName: string) => {
    const code = engagementDoaCodeFromRoleName(roleName);
    if (code && !map.has(code)) {
      map.set(code, { roleId, roleName: normalizeRoleNameForMatching(roleName) });
    }
  };

  for (const c of graph.stageChanges) {
    for (const r of c.roles) {
      upsert(r.roleId, r.roleName);
      for (const d of r.delegates ?? []) {
        upsert(d.roleId, d.roleName);
      }
    }
  }

  return map;
}

export type EntityRoleLookupRow = Readonly<{
  id: number;
  name: string;
  code?: string | null;
}>;

/**
 * Full map: graph-derived rows first (workflow display names), then PAO EntityRole API for any missing codes,
 * then per-option fallbackRoleId from config.
 */
export function buildFullEngagementDoaCodeMap(
  graph: WorkflowVersionGraphDraft,
  entityRoles: ReadonlyArray<EntityRoleLookupRow>
): Map<string, { roleId: number; roleName: string }> {
  const map = buildEngagementDoaCodeMapFromGraph(graph);

  for (const opt of WORKFLOW_EDITOR_ENGAGEMENT_DOA_ROLE_OPTIONS) {
    if (map.has(opt.code)) {
      continue;
    }
    const er = entityRoles.find((r) => r.code === opt.code);
    if (er) {
      map.set(opt.code, {
        roleId: er.id,
        roleName: er.name?.trim() ? normalizeRoleNameForMatching(er.name) : syntheticEngagementDoaRoleName(opt.code)
      });
      continue;
    }
    if (opt.fallbackRoleId != null) {
      map.set(opt.code, {
        roleId: opt.fallbackRoleId,
        roleName: syntheticEngagementDoaRoleName(opt.code)
      });
    }
  }

  return map;
}

export function resolveEngagementDoaRoleForGraph(
  graph: WorkflowVersionGraphDraft,
  code: string,
  fallbackRoleId?: number
): { roleId: number; roleName: string } | null {
  return resolveEngagementDoaRoleFromMap(buildEngagementDoaCodeMapFromGraph(graph), code, fallbackRoleId);
}

export function resolveEngagementDoaRoleFromMap(
  map: Map<string, { roleId: number; roleName: string }>,
  code: string,
  fallbackRoleId?: number
): { roleId: number; roleName: string } | null {
  const fromGraph = map.get(code);
  if (fromGraph) {
    return fromGraph;
  }
  if (fallbackRoleId != null) {
    return { roleId: fallbackRoleId, roleName: syntheticEngagementDoaRoleName(code) };
  }
  return null;
}
