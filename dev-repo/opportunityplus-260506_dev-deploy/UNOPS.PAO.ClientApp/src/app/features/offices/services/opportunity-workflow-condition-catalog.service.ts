/**
 * @fileoverview Loads Opportunity search-field metadata for workflow step conditions (field + operator UI).
 */

import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/** Backend SearchFieldInfo (camelCase JSON). */
interface OpportunitySearchFieldDto {
  field: string;
  displayName: string;
  fieldType: string;
  isNavigationProperty?: boolean;
  allowedOperators: string[];
  dropdownOptions?: { value: string; label: string }[];
}

/**
 * Backend WorkflowConditionFieldDto returned by the admin allow-list endpoint.
 * Includes the admin label override and display order; only IsAllowed=true rows
 * should appear in the workflow condition dropdown.
 */
interface WorkflowConditionFieldAdminDto {
  fieldKey: string;
  defaultDisplayName: string;
  effectiveDisplayName: string;
  labelOverride?: string | null;
  fieldType: string;
  isNavigationProperty: boolean;
  allowedOperators: string[];
  isAllowed: boolean;
  isLocked: boolean;
  displayOrder: number;
  inUseVersionCount: number;
  inUseOfficeCount: number;
  lockSummary?: string | null;
}

export interface WorkflowConditionOperatorOption {
  readonly label: string;
  readonly value: string;
}

export interface WorkflowConditionFieldOption {
  readonly fieldKey: string;
  /** Full row label for the dropdown (includes group context). */
  readonly label: string;
  readonly workflowFieldType: string;
  readonly operators: WorkflowConditionOperatorOption[];
}

/** Maps entityCards.operators.* keys (and legacy short keys) to workflow evaluator operators. */
const entityCardOpToWorkflowOperator: Readonly<Record<string, string | undefined>> = {
  'entityCards.operators.eq': '=',
  'entityCards.operators.neq': '!=',
  'entityCards.operators.like': 'contains',
  'entityCards.operators.equals': '=',
  'entityCards.operators.notEquals': '!=',
  'entityCards.operators.contains': 'contains',
  'entityCards.operators.notContains': undefined,
  'entityCards.operators.gt': '>',
  'entityCards.operators.lt': '<',
  'entityCards.operators.gte': '>=',
  'entityCards.operators.lte': '<=',
  'entityCards.operators.greaterThan': '>',
  'entityCards.operators.lessThan': '<',
  'entityCards.operators.greaterThanOrEqual': '>=',
  'entityCards.operators.lessThanOrEqual': '<=',
  'entityCards.operators.on': '=',
  'entityCards.operators.notOn': '!=',
  'entityCards.operators.after': '>',
  'entityCards.operators.before': '<',
  'entityCards.operators.between': undefined,
  eq: '=',
  neq: '!=',
  like: 'contains'
};

const defaultTextOperators: WorkflowConditionOperatorOption[] = [
  { label: 'entityCards.operators.eq', value: '=' },
  { label: 'entityCards.operators.neq', value: '!=' },
  { label: 'entityCards.operators.contains', value: 'contains' }
];

/** Field keys where opportunity workflow supplies comma-separated numeric IDs (membership / multi-select). */
const MULTI_VALUE_WORKFLOW_FIELD_KEYS = new Set<string>([
  'countries.countryId',
  'sdGs.sdgId',
  'sdgTargets.sdgTargetId',
  'sdgIndicators.sdgIndicatorId',
  'deliverables.outputId',
  'fundingPartners.partnerId',
  'clientPartners.partnerId',
  'stakeholders.userId',
  'stakeholders.entityRoleId',
  'externalStakeholders.contactId'
]);

const defaultMultiValueOperators: WorkflowConditionOperatorOption[] = [
  { label: 'entityCards.operators.contains', value: 'contains' }
];

export type WorkflowConditionPickerKind =
  | 'partner'
  | 'user'
  | 'country'
  | 'sdg'
  | 'sdgTarget'
  | 'sdgIndicator'
  | 'output'
  | 'contact'
  | 'entityRole';

/** Resolves searchable picker UX for multi-value workflow condition fields (PAO-specific). */
export function workflowConditionPickerKind(fieldKey: string): WorkflowConditionPickerKind | null {
  switch (fieldKey) {
    case 'fundingPartners.partnerId':
    case 'clientPartners.partnerId':
      return 'partner';
    case 'stakeholders.userId':
      return 'user';
    case 'countries.countryId':
      return 'country';
    case 'sdGs.sdgId':
      return 'sdg';
    case 'sdgTargets.sdgTargetId':
      return 'sdgTarget';
    case 'sdgIndicators.sdgIndicatorId':
      return 'sdgIndicator';
    case 'deliverables.outputId':
      return 'output';
    case 'externalStakeholders.contactId':
      return 'contact';
    case 'stakeholders.entityRoleId':
      return 'entityRole';
    default:
      return null;
  }
}

export function useWorkflowReferencePicker(workflowFieldType: string, fieldKey: string): boolean {
  return workflowFieldType === 'multiValueNumber' && workflowConditionPickerKind(fieldKey) !== null;
}

function workflowFieldTypeForCatalog(fieldKey: string, apiFieldType: string): string {
  if (MULTI_VALUE_WORKFLOW_FIELD_KEYS.has(fieldKey)) {
    return 'multiValueNumber';
  }
  return normalizeWorkflowFieldType(apiFieldType);
}

function normalizeWorkflowFieldType(apiType: string): string {
  switch (apiType.trim().toLowerCase()) {
    case 'number':
    case 'int':
    case 'integer':
    case 'decimal':
      return 'number';
    case 'date':
    case 'datetime':
      return 'date';
    case 'boolean':
    case 'bool':
      return 'boolean';
    default:
      return 'text';
  }
}

function mapAllowedOperatorsToWorkflow(
  allowed: string[] | undefined,
  translate: TranslateService
): WorkflowConditionOperatorOption[] {
  const raw = allowed?.length ? allowed : ['entityCards.operators.eq', 'entityCards.operators.neq'];
  const seen = new Set<string>();
  const out: WorkflowConditionOperatorOption[] = [];
  for (const key of raw) {
    const wf = entityCardOpToWorkflowOperator[key.trim()];
    if (!wf || seen.has(wf)) {
      continue;
    }
    seen.add(wf);
    const labelKey = key.startsWith('entityCards.') ? key : `entityCards.operators.${key}`;
    const translated =
      translate.instant(labelKey) !== labelKey ? translate.instant(labelKey) : wf;
    out.push({ label: translated, value: wf });
  }
  return out.length > 0 ? out : translateOperatorList(defaultTextOperators, translate);
}

function translateOperatorList(
  ops: WorkflowConditionOperatorOption[],
  translate: TranslateService
): WorkflowConditionOperatorOption[] {
  return ops.map((o) => ({
    value: o.value,
    label:
      translate.instant(o.label) !== o.label ? translate.instant(o.label) : o.value
  }));
}

function humanizeChildTableName(segment: string): string {
  if (!segment) {
    return segment;
  }
  const withSpaces = segment.replace(/([A-Z])/g, ' $1').trim();
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

/** Child segment -> i18n key for workflow condition group title (avoids "Sd Gs" style humanization). */
const childGroupLabelTranslationKey: Readonly<Record<string, string>> = {
  sdGs: 'label.opportunity.sdgs',
  sdgTargets: 'label.opportunity.sdgTargets',
  sdgIndicators: 'label.opportunity.sdgIndicators',
  risks: 'label.opportunity.risks',
  deliverables: 'label.opportunity.deliverables',
};

function opportunityFieldGroup(
  fieldKey: string,
  translate: TranslateService
): { groupKey: string; groupLabel: string } {
  const dot = fieldKey.indexOf('.');
  if (dot <= 0) {
    return { groupKey: '_opportunity', groupLabel: 'Opportunity' };
  }
  const child = fieldKey.slice(0, dot);
  const labelKey = childGroupLabelTranslationKey[child];
  if (labelKey) {
    const translated = translate.instant(labelKey);
    return {
      groupKey: child,
      groupLabel: translated !== labelKey ? translated : humanizeChildTableName(child),
    };
  }
  return { groupKey: child, groupLabel: humanizeChildTableName(child) };
}

/** Trailing "(detail)" on display names, for redundancy checks and compact labels. */
function splitFieldLabelParenthetical(fieldLabel: string): { main: string; paren: string | null } {
  const m = /^(.*?)\s*\(([^)]*)\)\s*$/.exec(fieldLabel.trim());
  if (!m) {
    return { main: fieldLabel.trim(), paren: null };
  }
  const inner = m[2].trim();
  return { main: m[1].trim(), paren: inner.length > 0 ? inner : null };
}

function normalizeComparableLabel(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** English-oriented plural last-token match (group = plural-ish, field = singular-ish). */
function lastTokenPluralPair(pluralToken: string, singularToken: string): boolean {
  const p = pluralToken.toLowerCase();
  const s = singularToken.toLowerCase();
  if (p === s) {
    return true;
  }
  if (p === s + 's' || p === s + 'es') {
    return true;
  }
  if (s.endsWith('y') && p === `${s.slice(0, -1)}ies`) {
    return true;
  }
  if (p.endsWith('s') && p.length > 1 && p.slice(0, -1) === s) {
    return true;
  }
  const irregularPluralToSingular: Readonly<Record<string, string>> = {
    countries: 'country'
  };
  return irregularPluralToSingular[p] === s;
}

function isRedundantGroupAndFieldMain(groupTitle: string, fieldMain: string): boolean {
  const g = normalizeComparableLabel(groupTitle);
  const f = normalizeComparableLabel(fieldMain);
  if (g === f) {
    return true;
  }
  const gParts = g.split(' ').filter(Boolean);
  const fParts = f.split(' ').filter(Boolean);
  if (gParts.length === 0 || fParts.length === 0 || gParts.length !== fParts.length) {
    return false;
  }
  for (let i = 0; i < gParts.length - 1; i++) {
    if (gParts[i] !== fParts[i]) {
      return false;
    }
  }
  return lastTokenPluralPair(gParts[gParts.length - 1], fParts[fParts.length - 1]);
}

/**
 * Dropdown label only (fieldKey is unchanged). Drops "Group · Singular" when the field name repeats the group.
 */
function formatConditionOptionLabel(groupTitle: string, fieldLabel: string): string {
  const { main, paren } = splitFieldLabelParenthetical(fieldLabel);
  if (isRedundantGroupAndFieldMain(groupTitle, main)) {
    return paren ? `${groupTitle} (${paren})` : groupTitle;
  }
  return `${groupTitle} · ${fieldLabel}`;
}

@Injectable({ providedIn: 'root' })
export class OpportunityWorkflowConditionCatalogService {
  private readonly http = inject(HttpClient);
  private readonly translate = inject(TranslateService);

  private readonly fieldOptions = signal<WorkflowConditionFieldOption[]>([]);
  private readonly metaByKey = signal<Map<string, WorkflowConditionFieldOption>>(new Map());
  private loaded = false;

  /** Call when closing the workflow editor so the next open refetches labels and fields. */
  resetForEditorSession(): void {
    this.loaded = false;
  }

  /** Flat list: Opportunity fields first, then child-table fields, alphabetically within groups. */
  readonly options = this.fieldOptions.asReadonly();

  getMeta(fieldKey: string): WorkflowConditionFieldOption | undefined {
    return this.metaByKey().get(fieldKey);
  }

  /**
   * Ensures saved workflow conditions whose field keys are not in search-fields still appear in the dropdown.
   */
  mergeAdHocFieldKeys(fieldKeys: readonly string[]): void {
    const translate = this.translate;
    const byKey = new Map(this.metaByKey());
    const existing = this.fieldOptions();
    const additions: WorkflowConditionFieldOption[] = [];
    for (const raw of fieldKeys) {
      const key = raw?.trim();
      if (!key || byKey.has(key)) {
        continue;
      }
      const wfAdHoc = workflowFieldTypeForCatalog(key, 'text');
      const opSrc = wfAdHoc === 'multiValueNumber' ? defaultMultiValueOperators : defaultTextOperators;
      const ops = translateOperatorList(opSrc, translate);
      const opt: WorkflowConditionFieldOption = {
        fieldKey: key,
        label: key,
        workflowFieldType: wfAdHoc,
        operators: ops
      };
      byKey.set(key, opt);
      additions.push(opt);
    }
    if (additions.length === 0) {
      return;
    }
    const merged = [...existing, ...additions].sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
    );
    this.fieldOptions.set(merged);
    this.metaByKey.set(byKey);
  }

  operatorsForFieldKey(fieldKey: string): WorkflowConditionOperatorOption[] {
    return this.getMeta(fieldKey)?.operators ?? translateOperatorList(defaultTextOperators, this.translate);
  }

  /**
   * Loads from GET /api/entity-configuration/Opportunity/workflow-condition-fields (cached).
   * The admin endpoint already filters to allowed fields and applies label overrides; ordering
   * uses the admin's DisplayOrder. Falls back to /api/opportunity/search-fields (unfiltered)
   * only if the admin endpoint fails so workflow editing keeps working without entity-manager
   * data (e.g. fresh DB before seeders run).
   */
  ensureLoaded(): Observable<void> {
    if (this.loaded) {
      return of(undefined);
    }
    return this.http
      .get<WorkflowConditionFieldAdminDto[]>('/api/entity-configuration/Opportunity/workflow-condition-fields')
      .pipe(
        map((rows) => this.buildCatalogFromAdmin(rows)),
        catchError(() =>
          this.http
            .get<OpportunitySearchFieldDto[]>('/api/opportunity/search-fields')
            .pipe(
              catchError(() => of<OpportunitySearchFieldDto[]>([])),
              map((rows) => this.buildCatalog(rows))
            )
        ),
        tap(({ options, byKey }) => {
          this.fieldOptions.set(options);
          this.metaByKey.set(byKey);
          this.loaded = true;
        }),
        map(() => undefined)
      );
  }

  private buildCatalogFromAdmin(rows: WorkflowConditionFieldAdminDto[]): {
    options: WorkflowConditionFieldOption[];
    byKey: Map<string, WorkflowConditionFieldOption>;
  } {
    const allowedRows = (rows ?? []).filter((r) => r.isAllowed);
    const adapted: OpportunitySearchFieldDto[] = allowedRows.map((r) => ({
      field: r.fieldKey,
      displayName: r.effectiveDisplayName ?? r.defaultDisplayName,
      fieldType: r.fieldType,
      isNavigationProperty: r.isNavigationProperty,
      allowedOperators: r.allowedOperators ?? []
    }));
    const built = this.buildCatalog(adapted);

    // Preserve admin DisplayOrder instead of alphabetical when ordering is supplied.
    const orderByKey = new Map(allowedRows.map((r) => [r.fieldKey, r.displayOrder ?? 0]));
    built.options.sort((a, b) => {
      const oa = orderByKey.get(a.fieldKey) ?? 0;
      const ob = orderByKey.get(b.fieldKey) ?? 0;
      if (oa !== ob) {
        return oa - ob;
      }
      return a.label.localeCompare(b.label, undefined, { sensitivity: 'base' });
    });
    return built;
  }

  private buildCatalog(rows: OpportunitySearchFieldDto[]): {
    options: WorkflowConditionFieldOption[];
    byKey: Map<string, WorkflowConditionFieldOption>;
  } {
    const translate = this.translate;
    const byKey = new Map<string, WorkflowConditionFieldOption>();
    const opportunityLabel = translate.instant('office.workflowConfig.editor.conditionGroupOpportunity');
    const groupDisplay =
      opportunityLabel !== 'office.workflowConfig.editor.conditionGroupOpportunity'
        ? opportunityLabel
        : 'Opportunity';

    const built: WorkflowConditionFieldOption[] = [];

    for (const row of rows) {
      const fieldKey = row.field?.trim();
      if (!fieldKey) {
        continue;
      }
      const wfType = workflowFieldTypeForCatalog(fieldKey, row.fieldType ?? 'text');
      const operators = mapAllowedOperatorsToWorkflow(row.allowedOperators, translate);
      const fieldLabel =
        translate.instant(row.displayName) !== row.displayName
          ? translate.instant(row.displayName)
          : row.displayName;
      const { groupLabel } = opportunityFieldGroup(fieldKey, translate);
      const groupTitle = fieldKey.includes('.') ? groupLabel : groupDisplay;
      const label = formatConditionOptionLabel(groupTitle, fieldLabel);

      const opt: WorkflowConditionFieldOption = {
        fieldKey,
        label,
        workflowFieldType: wfType,
        operators
      };
      built.push(opt);
      byKey.set(fieldKey, opt);
    }

    built.sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }));

    return { options: built, byKey };
  }
}
