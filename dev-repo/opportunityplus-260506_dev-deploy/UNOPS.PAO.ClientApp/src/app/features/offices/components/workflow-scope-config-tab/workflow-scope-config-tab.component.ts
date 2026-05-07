/**
 * @fileoverview Scoped workflow configuration: all entity types, version tables, structured editor.
 */

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MessageModule } from 'primeng/message';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';

import {
  WORKFLOW_CONFIG_SUPPORTED_SCOPE_ENTITY_NAME,
  WorkflowScopeConfigService,
  type OfficeWorkflowEntityTypeOverviewDto,
  type WorkflowVersionSummaryDto
} from '../../services/workflow-scope-config.service';
import { OpportunityScopeConfigEditorDialogComponent } from '../opportunity-scope-config-editor-dialog/opportunity-scope-config-editor-dialog.component';
import { WorkflowScopeConfigEditorDialogComponent } from '../workflow-scope-config-editor-dialog/workflow-scope-config-editor-dialog.component';

/** Matches <c>OpportunityWorkflow.EntityName</c> — office overview uses this for the Opportunity row. */
const OFFICE_WORKFLOW_OPPORTUNITY_ENTITY_TYPE = 'Opportunity';

@Component({
  selector: 'app-workflow-scope-config-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TranslateModule,
    MessageModule,
    ButtonModule,
    TableModule,
    ProgressSpinnerModule,
    PanelModule,
    WorkflowScopeConfigEditorDialogComponent,
    OpportunityScopeConfigEditorDialogComponent
  ],
  templateUrl: './workflow-scope-config-tab.component.html',
  styleUrl: './workflow-scope-config-tab.component.scss'
})
export class WorkflowScopeConfigTabComponent {
  @ViewChild('scopeWorkflowEditor') private scopeWorkflowEditor?: WorkflowScopeConfigEditorDialogComponent;
  @ViewChild('opportunityScopeEditor') private opportunityScopeEditor?: OpportunityScopeConfigEditorDialogComponent;

  private readonly workflowConfig = inject(WorkflowScopeConfigService);
  private loadOverviewGeneration = 0;

  /** Workflow scope kind (e.g. Office). Only {@link WORKFLOW_CONFIG_SUPPORTED_SCOPE_ENTITY_NAME} is supported today. */
  readonly scopeEntityName = input<string>(WORKFLOW_CONFIG_SUPPORTED_SCOPE_ENTITY_NAME);

  /** Primary key of the scope instance (e.g. office id when scope is Office). */
  readonly scopeEntityId = input.required<number>();

  /** Office name for regional workflow impact messaging. */
  readonly scopeOfficeDisplayName = input('');

  readonly canEditScopedWorkflow = input(false);

  /** Optional: descendant scope count for impact messaging (office workflow regional impact). */
  readonly impactedDescendantScopeCount = input(0);

  readonly overview = signal<OfficeWorkflowEntityTypeOverviewDto[]>([]);

  readonly loadingOverview = signal(false);
  readonly errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const name = this.scopeEntityName();
      const id = this.scopeEntityId();
      untracked(() => {
        this.loadOverview(name, id);
      });
    });
  }

  /** Instance-scoped row defines workflow for another office in the hierarchy (e.g. regional parent). */
  isInheritedInstanceWorkflowVersion(v: WorkflowVersionSummaryDto): boolean {
    if (v.scopeClassification !== 'InstanceScoped') {
      return false;
    }
    const sid = v.scopeEntityId?.trim();
    if (!sid) {
      return false;
    }
    return sid !== this.scopeEntityId().toString();
  }

  inheritedOfficeDisplayName(v: WorkflowVersionSummaryDto): string {
    const n = v.scopeInstanceName?.trim();
    if (n) {
      return n;
    }
    const sid = v.scopeEntityId?.trim();
    return sid ? `#${sid}` : '';
  }

  scopeClassificationTranslateKey(
    c: WorkflowVersionSummaryDto['scopeClassification']
  ): string | null {
    if (c == null) {
      return null;
    }
    const map = {
      InstanceScoped: 'office.workflowConfig.scopeClassification.instanceScoped',
      ScopeKindDefault: 'office.workflowConfig.scopeClassification.scopeKindDefault',
      SubjectDefault: 'office.workflowConfig.scopeClassification.subjectDefault'
    } as const;
    return map[c];
  }

  private loadOverview(scopeEntityName: string, scopeEntityId: number): void {
    const generation = ++this.loadOverviewGeneration;
    this.loadingOverview.set(true);
    this.errorMessage.set(null);
    this.overview.set([]);

    this.workflowConfig.getWorkflowConfigurationOverview(scopeEntityName, scopeEntityId).subscribe({
      next: (rows) => {
        if (generation !== this.loadOverviewGeneration) {
          return;
        }
        this.overview.set(rows);
        this.loadingOverview.set(false);
      },
      error: () => {
        if (generation !== this.loadOverviewGeneration) {
          return;
        }
        this.loadingOverview.set(false);
        this.errorMessage.set('office.workflowConfig.loadError');
      }
    });
  }

  onWorkflowEditorSaved(): void {
    this.loadOverview(this.scopeEntityName(), this.scopeEntityId());
  }

  startEditVersion(entityType: string, versionId: number): void {
    if (!this.canEditScopedWorkflow()) {
      return;
    }
    const ctx = {
      scopeEntityName: this.scopeEntityName(),
      scopeEntityId: this.scopeEntityId(),
      entityType,
      sourceVersionId: versionId,
      readonly: false as const,
      impactedDescendantOfficeCount: this.impactedDescendantScopeCount(),
      scopeOfficeDisplayName: this.scopeOfficeDisplayName()
    };
    if (entityType === OFFICE_WORKFLOW_OPPORTUNITY_ENTITY_TYPE) {
      this.opportunityScopeEditor?.open(ctx);
    } else {
      this.scopeWorkflowEditor?.open(ctx);
    }
  }

  /** Read-only structured view of a specific workflow version (row Actions). */
  viewVersion(entityType: string, versionId: number): void {
    const ctx = {
      scopeEntityName: this.scopeEntityName(),
      scopeEntityId: this.scopeEntityId(),
      entityType,
      sourceVersionId: versionId,
      readonly: true as const,
      scopeOfficeDisplayName: this.scopeOfficeDisplayName()
    };
    if (entityType === OFFICE_WORKFLOW_OPPORTUNITY_ENTITY_TYPE) {
      this.opportunityScopeEditor?.open(ctx);
    } else {
      this.scopeWorkflowEditor?.open(ctx);
    }
  }
}
