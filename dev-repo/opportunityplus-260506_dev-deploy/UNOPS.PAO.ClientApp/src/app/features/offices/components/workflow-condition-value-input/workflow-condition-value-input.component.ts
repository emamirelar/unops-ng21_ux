/**
 * @fileoverview Value editor for opportunity workflow step conditions — pickers for multi-ID fields, plain input otherwise.
 */

import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { catchError, map, of } from 'rxjs';

import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';

import { Output, ValuesService } from '@app/shared/services/api/values.service';
import { PartnerSearchResult, PartnerSearchService } from '@app/shared/services/partner/partner-search.service';
import { UserSearchResult, UserSearchService } from '@app/shared/services/user/user-search.service';

import {
  type WorkflowConditionPickerKind,
  useWorkflowReferencePicker,
  workflowConditionPickerKind
} from '../../services/opportunity-workflow-condition-catalog.service';

@Component({
  selector: 'app-workflow-condition-value-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    AutoCompleteModule,
    SelectModule,
    InputTextModule
  ],
  templateUrl: './workflow-condition-value-input.component.html'
})
export class WorkflowConditionValueInputComponent {
  private readonly http = inject(HttpClient);
  private readonly valuesService = inject(ValuesService);
  private readonly partnerSearch = inject(PartnerSearchService);
  private readonly userSearch = inject(UserSearchService);
  private readonly destroyRef = inject(DestroyRef);

  readonly fieldKey = input<string>('');
  readonly workflowFieldType = input<string>('text');
  readonly disabled = input(false);

  readonly valueText = model<string>('');

  readonly pickerKind = computed<WorkflowConditionPickerKind | null>(() =>
    workflowConditionPickerKind(this.fieldKey())
  );

  readonly usePicker = computed(() =>
    useWorkflowReferencePicker(this.workflowFieldType(), this.fieldKey())
  );

  readonly partnerSuggestions = signal<PartnerSearchResult[]>([]);
  readonly userSuggestions = signal<UserSearchResult[]>([]);
  readonly contactSuggestions = signal<{ id: number; label: string }[]>([]);

  readonly selectedPartner = signal<PartnerSearchResult | null>(null);
  readonly selectedUser = signal<UserSearchResult | null>(null);
  readonly selectedContact = signal<{ id: number; label: string } | null>(null);

  readonly selectOptions = signal<{ label: string; value: string }[]>([]);

  private readonly selectOptionCache = new Map<WorkflowConditionPickerKind, { label: string; value: string }[]>();

  constructor() {
    effect(() => {
      const v = this.valueText();
      const key = this.fieldKey();
      const wf = this.workflowFieldType();
      if (!useWorkflowReferencePicker(wf, key)) {
        return;
      }
      const kind = workflowConditionPickerKind(key);
      if (!kind) {
        return;
      }

      untracked(() => {
        if (kind === 'partner') {
          const id = Number(v);
          if (!Number.isFinite(id) || id <= 0) {
            this.selectedPartner.set(null);
          } else {
            const cur = this.selectedPartner();
            if (cur?.id !== id) {
              this.selectedPartner.set({ id, name: v.trim() });
            }
          }
          return;
        }
        if (kind === 'user') {
          const id = Number(v);
          if (!Number.isFinite(id) || id <= 0) {
            this.selectedUser.set(null);
          } else {
            const cur = this.selectedUser();
            if (cur?.id !== id) {
              this.selectedUser.set({ id, email: '', name: v.trim() });
            }
          }
          return;
        }
        if (kind === 'contact') {
          const id = Number(v);
          if (!Number.isFinite(id) || id <= 0) {
            this.selectedContact.set(null);
          } else {
            const cur = this.selectedContact();
            if (cur?.id !== id) {
              this.selectedContact.set({ id, label: v.trim() });
            }
          }
        }
      });
    });

    effect(() => {
      const key = this.fieldKey();
      const wf = this.workflowFieldType();
      if (!useWorkflowReferencePicker(wf, key)) {
        untracked(() => this.selectOptions.set([]));
        return;
      }
      const kind = workflowConditionPickerKind(key);
      if (
        !kind ||
        kind === 'partner' ||
        kind === 'user' ||
        kind === 'contact'
      ) {
        untracked(() => this.selectOptions.set([]));
        return;
      }

      untracked(() => this.loadSelectOptions(kind));
    });
  }

  onPartnerComplete(event: AutoCompleteCompleteEvent): void {
    this.partnerSearch.searchPartners(event.query, 20).subscribe((r) => this.partnerSuggestions.set(r));
  }

  onUserComplete(event: AutoCompleteCompleteEvent): void {
    this.userSearch.searchUsers(event.query, 20).subscribe((r) => this.userSuggestions.set(r));
  }

  onContactComplete(event: AutoCompleteCompleteEvent): void {
    const q = event.query?.trim() ?? '';
    if (q.length < 2) {
      this.contactSuggestions.set([]);
      return;
    }
    const params = new HttpParams()
      .set('query', q)
      .set('pageIndex', '1')
      .set('pageSize', '20');
    this.http
      .get<{ records?: Record<string, unknown>[] }>('/api/contact/search', { params })
      .pipe(
        map((res) => {
          const rows = res.records ?? [];
          return rows.map((c) => {
            const id = Number(c['id']);
            const first = String(c['firstName'] ?? '').trim();
            const last = String(c['lastName'] ?? '').trim();
            const email = String(c['email'] ?? '').trim();
            const label =
              [first, last].filter(Boolean).join(' ').trim() || email || String(id);
            return { id, label };
          });
        }),
        catchError(() => of([]))
      )
      .subscribe((r) => this.contactSuggestions.set(r));
  }

  onPartnerSelect(v: PartnerSearchResult | null): void {
    this.selectedPartner.set(v);
    this.valueText.set(v ? String(v.id) : '');
  }

  onUserSelect(v: UserSearchResult | null): void {
    this.selectedUser.set(v);
    this.valueText.set(v ? String(v.id) : '');
  }

  onContactSelect(v: { id: number; label: string } | null): void {
    this.selectedContact.set(v);
    this.valueText.set(v ? String(v.id) : '');
  }

  private loadSelectOptions(kind: WorkflowConditionPickerKind): void {
    if (kind === 'partner' || kind === 'user' || kind === 'contact') {
      return;
    }

    const cached = this.selectOptionCache.get(kind);
    if (cached) {
      this.selectOptions.set(cached);
      return;
    }

    const apply = (opts: { label: string; value: string }[]) => {
      const sorted = [...opts].sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
      );
      this.selectOptionCache.set(kind, sorted);
      if (
        workflowConditionPickerKind(this.fieldKey()) === kind &&
        useWorkflowReferencePicker(this.workflowFieldType(), this.fieldKey())
      ) {
        this.selectOptions.set(sorted);
      }
    };

    switch (kind) {
      case 'country':
        this.valuesService
          .getCountries()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((rows) =>
            apply(rows.map((c) => ({ label: c.name, value: String(c.id) })))
          );
        break;
      case 'sdg':
        this.valuesService
          .getSDGs()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((rows) =>
            apply(
              rows.map((s) => ({
                label: s.name ? `${s.name} (${s.id})` : String(s.id),
                value: String(s.id)
              }))
            )
          );
        break;
      case 'sdgTarget':
        this.valuesService
          .getSDGTargets()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((rows) =>
            apply(
              rows.map((t) => ({
                label: t.name
                  ? `${t.name} (${t.sdgTargetId})`
                  : t.sdgTargetId,
                value: String(t.id)
              }))
            )
          );
        break;
      case 'sdgIndicator':
        this.valuesService
          .getSDGIndicators()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((rows) =>
            apply(
              rows.map((i) => ({
                label: i.name
                  ? `${i.name} (${i.sdgIndicatorId})`
                  : i.sdgIndicatorId,
                value: String(i.id)
              }))
            )
          );
        break;
      case 'output':
        this.valuesService
          .getOutputs()
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((rows) => apply(this.mapOutputsToOptions(rows)));
        break;
      case 'entityRole':
        this.valuesService
          .getEntityRoles('Opportunity')
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((rows) =>
            apply(rows.map((r) => ({ label: r.name, value: String(r.id) })))
          );
        break;
      default:
        break;
    }
  }

  private mapOutputsToOptions(outputs: Output[]): { label: string; value: string }[] {
    return outputs.map((o) => {
      const name = (o.name ?? '').trim();
      const value = String(o.id);
      const label = name ? `${name} (${value})` : value;
      return { label, value };
    });
  }
}
