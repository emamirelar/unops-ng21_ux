/**
 * @fileoverview API client for instance-scoped workflow version configuration.
 * Routes: <code>/api/scope/{scopeEntityName}/{scopeEntityId}/workflow-config/...</code>
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import type { WorkflowVersionGraphDraft } from '../models/workflow-version-graph.model';

/** Only this scope kind is supported by the API today; keep in sync with <c>OpportunityWorkflow.WorkflowScopeEntityName</c>. */
export const WORKFLOW_CONFIG_SUPPORTED_SCOPE_ENTITY_NAME = 'Office' as const;

/** Matches backend WorkflowVersionSummaryDto (camelCase JSON). */
export interface WorkflowVersionSummaryDto {
  id: number;
  entityType: string;
  scopeEntityName?: string | null;
  scopeEntityId?: string | null;
  effectiveFrom: string;
  effectiveTo?: string | null;
  status: number;
  /** JsonStringEnumConverter: InstanceScoped | ScopeKindDefault | SubjectDefault */
  scopeClassification?: 'InstanceScoped' | 'ScopeKindDefault' | 'SubjectDefault' | null;
  /** Defining office name when instance-scoped (overview API). */
  scopeInstanceName?: string | null;
  isCurrentlyApplicable?: boolean;
  /** Workflow row audit: PAO user id. */
  createdBy?: number;
  createdDate?: string | null;
}

/** JsonStringEnumConverter values for OfficeWorkflowApplicableContextKind. */
export type OfficeWorkflowApplicableContextKind =
  | 'None'
  | 'GlobalDefault'
  | 'OfficeScopeDefault'
  | 'ThisOffice'
  | 'InheritedFromParent'
  | 'OtherOfficeInstance';

/** Matches backend OfficeWorkflowEntityTypeOverviewDto. */
export interface OfficeWorkflowEntityTypeOverviewDto {
  entityType: string;
  applicableStateMachineVersionId: number | null;
  applicableContextKind: OfficeWorkflowApplicableContextKind;
  applicableContextDetail?: string | null;
  versions: WorkflowVersionSummaryDto[];
  /** Effective from in the future (UTC); same scope rules as <code>versions</code>. */
  upcomingVersions: WorkflowVersionSummaryDto[];
}

export interface WorkflowScopeApplicableVersionResponse {
  entityType: string;
  applicableStateMachineVersionId: number | null;
}

/** Full graph DTO — shape mirrors UNOPS.Workflow.Models.WorkflowVersionAdmin.WorkflowVersionGraphDto. */
export type WorkflowVersionGraphDto = Record<string, unknown>;

export interface WorkflowScopeVersionSaveRequest {
  entityType: string;
  sourceVersionId: number;
  effectiveFromUtc?: string | null;
  /** When true, server uses UtcNow and ends other active/upcoming rows for this office scope. */
  activateImmediately?: boolean;
  versionDisplayName?: string | null;
  graph: WorkflowVersionGraphDraft;
}

export interface WorkflowVersionSaveResultDto {
  success: boolean;
  stateMachineVersionId?: number | null;
  noChanges?: boolean;
  errorMessage?: string | null;
}

/** Context for opening the fork/edit dialog. */
export interface WorkflowScopeEditorContext {
  scopeEntityName: string;
  scopeEntityId: number;
  entityType: string;
  sourceVersionId: number;
  /** When true, UI is read-only (view applicable version; no save/fork fields). */
  readonly?: boolean;
  /** Descendant office count (excl. self) for regional workflow impact copy. */
  impactedDescendantOfficeCount?: number;
  /** Current scope office display name (e.g. regional office name). */
  scopeOfficeDisplayName?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkflowScopeConfigService {
  private readonly http = inject(HttpClient);
  private readonly apiPrefix = '/api/scope';

  private basePath(scopeEntityName: string, scopeEntityId: number): string {
    const name = encodeURIComponent(scopeEntityName);
    return `${this.apiPrefix}/${name}/${scopeEntityId}/workflow-config`;
  }

  getWorkflowEntityTypes(scopeEntityName: string, scopeEntityId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.basePath(scopeEntityName, scopeEntityId)}/entity-types`);
  }

  getWorkflowVersions(
    scopeEntityName: string,
    scopeEntityId: number,
    entityType: string
  ): Observable<WorkflowVersionSummaryDto[]> {
    const params = new HttpParams().set('entityType', entityType);
    return this.http.get<WorkflowVersionSummaryDto[]>(`${this.basePath(scopeEntityName, scopeEntityId)}/versions`, {
      params
    });
  }

  getApplicableWorkflowVersion(
    scopeEntityName: string,
    scopeEntityId: number,
    entityType: string
  ): Observable<WorkflowScopeApplicableVersionResponse> {
    const params = new HttpParams().set('entityType', entityType);
    return this.http.get<WorkflowScopeApplicableVersionResponse>(
      `${this.basePath(scopeEntityName, scopeEntityId)}/applicable-version`,
      { params }
    );
  }

  getWorkflowConfigurationOverview(
    scopeEntityName: string,
    scopeEntityId: number
  ): Observable<OfficeWorkflowEntityTypeOverviewDto[]> {
    return this.http.get<OfficeWorkflowEntityTypeOverviewDto[]>(
      `${this.basePath(scopeEntityName, scopeEntityId)}/overview`
    );
  }

  getWorkflowGraph(
    scopeEntityName: string,
    scopeEntityId: number,
    stateMachineVersionId: number,
    entityType: string
  ): Observable<WorkflowVersionGraphDto> {
    const params = new HttpParams().set('entityType', entityType);
    return this.http.get<WorkflowVersionGraphDto>(
      `${this.basePath(scopeEntityName, scopeEntityId)}/graph/${stateMachineVersionId}`,
      { params }
    );
  }

  saveWorkflowVersion(
    scopeEntityName: string,
    scopeEntityId: number,
    body: WorkflowScopeVersionSaveRequest
  ): Observable<WorkflowVersionSaveResultDto> {
    return this.http.post<WorkflowVersionSaveResultDto>(`${this.basePath(scopeEntityName, scopeEntityId)}/save`, body);
  }
}
