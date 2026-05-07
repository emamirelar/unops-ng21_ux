/**
 * @fileoverview Office Related Partners tab with search and pagination.
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  effect,
  DestroyRef,
  inject
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PanelModule } from 'primeng/panel';

import { OfficeService, type OfficeRelatedPartner } from '../../services/office.service';
import type { OfficeDetailModel, OfficeFilterRequest } from '../../models/office.model';

@Component({
  selector: 'app-office-partners-tab',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    TranslateModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    PanelModule
  ],
  templateUrl: './office-partners-tab.component.html',
  styleUrl: './office-partners-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficePartnersTabComponent {
  readonly office = input.required<OfficeDetailModel>();

  private readonly officeService = inject(OfficeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  readonly partners = signal<OfficeRelatedPartner[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly pageIndex = signal<number>(1);
  readonly pageSize = signal<number>(10);

  constructor() {
    effect(() => {
      const id = this.office().id;
      if (id) this.loadPartners();
    });
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.searchTerm.set(query);
        this.pageIndex.set(1);
        this.loadPartners();
      });
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value ?? '');
  }

  loadPartners(): void {
    const id = this.office().id;
    const request: OfficeFilterRequest = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      searchTerm: this.searchTerm()?.trim() || undefined
    };
    this.loading.set(true);
    this.officeService
      .getRelatedPartners(id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.partners.set(res.records);
          this.totalRecords.set(res.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.partners.set([]);
          this.totalRecords.set(0);
          this.loading.set(false);
        }
      });
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    this.pageIndex.set(Math.floor(first / rows) + 1);
    this.pageSize.set(rows);
    this.loadPartners();
  }

  /** EntityStatus: 0=Inactive, 1=Active, 2=OnHold, 3=Closed, 4=Draft, 5=Archived, 6=Open */
  getStatusLabel(status: number | undefined): string {
    if (status == null) return '—';
    const keys: Record<number, string> = {
      0: 'enums.entityStatus.inactive',
      1: 'enums.entityStatus.active',
      2: 'enums.entityStatus.onHold',
      3: 'enums.entityStatus.closed',
      4: 'enums.entityStatus.draft',
      5: 'enums.entityStatus.archived',
      6: 'enums.entityStatus.open'
    };
    return keys[status] ?? 'enums.entityStatus.unknown';
  }

  /**
   * Status badge classes aligned with Partner list (listview-card badge colors):
   * Draft = secondary, Archived = warn; Active uses success; Closed uses error tone.
   */
  getStatusClasses(status: number | undefined): string {
    if (status == null) return 'bg-gray-100 text-gray-700';
    switch (status) {
      case 0:
        return 'bg-gray-100 text-gray-700';
      case 1:
      case 6:
        return 'bg-green-500/10 text-green-500';
      case 2:
      case 5:
        return 'bg-yellow-600/10 text-yellow-600';
      case 3:
        return 'bg-cherry-500/10 text-cherry-500';
      case 4:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
