import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

import {
  WorkflowConditionFieldDto,
  WorkflowConditionFieldUsageDto,
  WorkflowConditionFieldsService,
} from '../../services/workflow-condition-fields.service';

/**
 * @uiComponent WorkflowConditionFieldsTab
 * @description Admin tab for managing the workflow condition "Field" dropdown allow-list.
 * Shows for entities that have a server-registered IWorkflowConditionFieldCatalog (e.g. Opportunity).
 * Lets the admin toggle which fields appear, override display labels, and reorder. Locked rows
 * cannot be deselected because they are referenced by an active workflow version.
 */
@Component({
  selector: 'app-workflow-condition-fields-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ProgressSpinnerModule,
    TableModule,
    TooltipModule,
  ],
  template: `
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="text-lg font-semibold text-unops-neutral-900">
            {{ 'entityManager.workflowConditionFields.title' | translate }}
          </div>
          <div class="text-sm text-unops-neutral-600">
            {{ 'entityManager.workflowConditionFields.subtitle' | translate }}
          </div>
        </div>
        <div class="flex gap-2">
          <p-button
            icon="pi pi-refresh"
            severity="secondary"
            text
            rounded
            [disabled]="loading()"
            (onClick)="reload()">
          </p-button>
          <p-button
            icon="pi pi-save"
            [label]="'entityManager.workflowConditionFields.save' | translate"
            [disabled]="!hasUnsavedChanges() || saving() || !canManage()"
            [loading]="saving()"
            (onClick)="save()">
          </p-button>
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-10">
          <p-progressSpinner styleClass="w-12 h-12"></p-progressSpinner>
        </div>
      } @else if (loadError()) {
        <div class="bg-unops-accent-cherry-soft text-unops-error-dark p-4 rounded">
          {{ loadError() }}
        </div>
      } @else {
        <p-table
          [value]="rows()"
          dataKey="fieldKey"
          styleClass="p-datatable-sm"
          [scrollable]="true"
          scrollHeight="500px">
          <ng-template pTemplate="header">
            <tr>
              <th style="width: 90px">
                {{ 'entityManager.workflowConditionFields.columns.allowed' | translate }}
              </th>
              <th>{{ 'entityManager.workflowConditionFields.columns.field' | translate }}</th>
              <th>
                {{ 'entityManager.workflowConditionFields.columns.label' | translate }}
              </th>
              <th style="width: 110px">
                {{ 'entityManager.workflowConditionFields.columns.order' | translate }}
              </th>
              <th style="width: 200px">
                {{ 'entityManager.workflowConditionFields.columns.usage' | translate }}
              </th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              <td>
                <p-checkbox
                  [binary]="true"
                  [(ngModel)]="row.isAllowed"
                  [disabled]="row.isLocked || !canManage()"
                  (onChange)="markChanged()"
                  [pTooltip]="row.isLocked ? row.lockSummary : null"
                  tooltipPosition="top">
                </p-checkbox>
              </td>
              <td>
                <div class="flex flex-col">
                  <span class="font-medium">{{ row.defaultDisplayName | translate }}</span>
                  <span class="text-xs text-unops-neutral-500 font-mono">{{ row.fieldKey }}</span>
                </div>
              </td>
              <td>
                <input
                  pInputText
                  type="text"
                  class="w-full"
                  [(ngModel)]="row.labelOverride"
                  [disabled]="!canManage()"
                  (ngModelChange)="markChanged()"
                  [placeholder]="row.defaultDisplayName | translate" />
              </td>
              <td>
                <p-inputNumber
                  [(ngModel)]="row.displayOrder"
                  [showButtons]="true"
                  [min]="0"
                  [max]="9999"
                  [step]="10"
                  [disabled]="!canManage()"
                  (onInput)="markChanged()"
                  inputStyleClass="w-20">
                </p-inputNumber>
              </td>
              <td>
                @if (row.isLocked) {
                  <button
                    type="button"
                    class="text-unops-primary-700 underline text-sm"
                    (click)="openUsageDialog(row)">
                    {{ row.lockSummary }}
                  </button>
                } @else {
                  <span class="text-xs text-unops-neutral-400">
                    {{ 'entityManager.workflowConditionFields.notInUse' | translate }}
                  </span>
                }
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5" class="text-center text-unops-neutral-500 py-6">
                {{ 'entityManager.workflowConditionFields.empty' | translate }}
              </td>
            </tr>
          </ng-template>
        </p-table>
      }

      <p-dialog
        [header]="usageDialogHeader()"
        [(visible)]="usageDialogVisible"
        [modal]="true"
        [style]="{ width: '520px' }"
        [dismissableMask]="true">
        @if (usagesLoading()) {
          <div class="flex justify-center py-6">
            <p-progressSpinner styleClass="w-10 h-10"></p-progressSpinner>
          </div>
        } @else {
          <ul class="list-disc pl-6 text-sm">
            @for (u of usages(); track u.stateMachineVersionId + '|' + (u.scopeEntityId ?? '')) {
              <li>
                {{ 'entityManager.workflowConditionFields.usage.versionPrefix' | translate }}
                <span class="font-mono">{{ u.stateMachineVersionId }}</span>
                <span class="text-unops-neutral-500"> — </span>
                @if (u.scopeEntityName) {
                  <span>{{ u.scopeDisplayName ?? u.scopeEntityId ?? u.scopeEntityName }}</span>
                } @else {
                  <span class="italic text-unops-neutral-500">
                    {{ 'entityManager.workflowConditionFields.usage.noScope' | translate }}
                  </span>
                }
              </li>
            }
            @if (usages().length === 0) {
              <li class="italic text-unops-neutral-500">
                {{ 'entityManager.workflowConditionFields.usage.none' | translate }}
              </li>
            }
          </ul>
        }
      </p-dialog>
    </div>
  `,
})
export class WorkflowConditionFieldsTabComponent {
  private readonly api = inject(WorkflowConditionFieldsService);
  private readonly messages = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  readonly entityName = input.required<string>();
  readonly canManage = input<boolean>(true);

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly loadError = signal<string | null>(null);
  readonly rows = signal<WorkflowConditionFieldRow[]>([]);
  readonly hasUnsavedChanges = signal<boolean>(false);

  readonly usageDialogVisible = signal<boolean>(false);
  readonly usagesLoading = signal<boolean>(false);
  readonly usages = signal<WorkflowConditionFieldUsageDto[]>([]);
  private readonly activeUsageRow = signal<WorkflowConditionFieldRow | null>(null);

  readonly usageDialogHeader = computed(() => {
    const r = this.activeUsageRow();
    return r ? r.defaultDisplayName : '';
  });

  constructor() {
    // Reload whenever the entity changes.
    effect(() => {
      const name = this.entityName();
      if (name) {
        this.load(name);
      }
    });
  }

  reload(): void {
    this.load(this.entityName());
  }

  markChanged(): void {
    this.hasUnsavedChanges.set(true);
  }

  openUsageDialog(row: WorkflowConditionFieldRow): void {
    this.activeUsageRow.set(row);
    this.usageDialogVisible.set(true);
    this.usagesLoading.set(true);
    this.usages.set([]);
    this.api
      .getUsages(this.entityName(), row.fieldKey)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (u) => {
          this.usages.set(u);
          this.usagesLoading.set(false);
        },
        error: () => {
          this.usagesLoading.set(false);
          this.messages.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load usage details',
          });
        },
      });
  }

  save(): void {
    if (!this.canManage() || this.saving()) return;

    this.saving.set(true);
    const payload = {
      entityName: this.entityName(),
      fields: this.rows().map((r) => ({
        fieldKey: r.fieldKey,
        isAllowed: r.isAllowed,
        labelOverride: this.normalizeLabel(r.labelOverride),
        displayOrder: r.displayOrder ?? 0,
      })),
    };

    this.api
      .save(this.entityName(), payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.rows.set(rows.map(toRow));
          this.hasUnsavedChanges.set(false);
          this.saving.set(false);
          this.messages.add({
            severity: 'success',
            summary: 'Saved',
            detail: 'Workflow condition fields updated',
          });
        },
        error: (err) => {
          this.saving.set(false);
          const detail =
            err?.error?.error ??
            err?.error?.message ??
            'Failed to save workflow condition fields';
          this.messages.add({ severity: 'error', summary: 'Error', detail });
        },
      });
  }

  private load(entityName: string): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.hasUnsavedChanges.set(false);
    this.api
      .list(entityName)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rows) => {
          this.rows.set(rows.map(toRow));
          this.loading.set(false);
        },
        error: (err) => {
          this.loading.set(false);
          this.rows.set([]);
          this.loadError.set(
            err?.status === 404
              ? 'No workflow condition catalog is registered for this entity.'
              : 'Failed to load workflow condition fields.',
          );
        },
      });
  }

  private normalizeLabel(value: string | null | undefined): string | null {
    const trimmed = (value ?? '').trim();
    return trimmed.length === 0 ? null : trimmed;
  }
}

/** Editable row state — mirrors {@link WorkflowConditionFieldDto} but mutable for ngModel. */
interface WorkflowConditionFieldRow {
  fieldKey: string;
  defaultDisplayName: string;
  effectiveDisplayName: string;
  labelOverride: string | null;
  fieldType: string;
  isNavigationProperty: boolean;
  allowedOperators: string[];
  isAllowed: boolean;
  isLocked: boolean;
  displayOrder: number;
  inUseVersionCount: number;
  inUseOfficeCount: number;
  lockSummary: string | null;
}

function toRow(dto: WorkflowConditionFieldDto): WorkflowConditionFieldRow {
  return {
    fieldKey: dto.fieldKey,
    defaultDisplayName: dto.defaultDisplayName,
    effectiveDisplayName: dto.effectiveDisplayName,
    labelOverride: dto.labelOverride ?? null,
    fieldType: dto.fieldType,
    isNavigationProperty: dto.isNavigationProperty,
    allowedOperators: dto.allowedOperators ?? [],
    isAllowed: dto.isAllowed,
    isLocked: dto.isLocked,
    displayOrder: dto.displayOrder ?? 0,
    inUseVersionCount: dto.inUseVersionCount,
    inUseOfficeCount: dto.inUseOfficeCount,
    lockSummary: dto.lockSummary ?? null,
  };
}
