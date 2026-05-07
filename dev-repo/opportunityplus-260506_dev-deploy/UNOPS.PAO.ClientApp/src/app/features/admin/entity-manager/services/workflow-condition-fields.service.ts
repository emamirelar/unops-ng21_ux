import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/** Mirrors UNOPS.PAO.Models.EntityConfiguration.WorkflowConditionFieldDto. */
export interface WorkflowConditionFieldDto {
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

/** Mirrors UNOPS.PAO.Models.EntityConfiguration.WorkflowConditionFieldUsageDto. */
export interface WorkflowConditionFieldUsageDto {
  stateMachineVersionId: number;
  scopeEntityName?: string | null;
  scopeEntityId?: string | null;
  scopeDisplayName?: string | null;
}

/** Mirrors UNOPS.PAO.Models.EntityConfiguration.SaveWorkflowConditionFieldsRequest. */
export interface SaveWorkflowConditionFieldsRequest {
  entityName: string;
  fields: WorkflowConditionFieldUpsertDto[];
}

/** Mirrors UNOPS.PAO.Models.EntityConfiguration.WorkflowConditionFieldUpsertDto. */
export interface WorkflowConditionFieldUpsertDto {
  fieldKey: string;
  isAllowed: boolean;
  labelOverride?: string | null;
  displayOrder: number;
}

@Injectable({ providedIn: 'root' })
export class WorkflowConditionFieldsService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/entity-configuration';

  list(entityName: string): Observable<WorkflowConditionFieldDto[]> {
    return this.http.get<WorkflowConditionFieldDto[]>(
      `${this.base}/${encodeURIComponent(entityName)}/workflow-condition-fields`,
    );
  }

  getUsages(
    entityName: string,
    fieldKey: string,
  ): Observable<WorkflowConditionFieldUsageDto[]> {
    return this.http.get<WorkflowConditionFieldUsageDto[]>(
      `${this.base}/${encodeURIComponent(entityName)}/workflow-condition-fields/${encodeURIComponent(
        fieldKey,
      )}/usages`,
    );
  }

  save(
    entityName: string,
    request: SaveWorkflowConditionFieldsRequest,
  ): Observable<WorkflowConditionFieldDto[]> {
    return this.http.put<WorkflowConditionFieldDto[]>(
      `${this.base}/${encodeURIComponent(entityName)}/workflow-condition-fields`,
      request,
    );
  }
}
