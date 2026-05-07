/**
 * @fileoverview Office Related Opportunities tab with search and pagination.
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

import { OfficeService, type OfficeRelatedOpportunity } from '../../services/office.service';
import type { OfficeDetailModel, OfficeFilterRequest } from '../../models/office.model';

@Component({
  selector: 'app-office-opportunities-tab',
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
  templateUrl: './office-opportunities-tab.component.html',
  styleUrl: './office-opportunities-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeOpportunitiesTabComponent {
  readonly office = input.required<OfficeDetailModel>();

  private readonly officeService = inject(OfficeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  readonly opportunities = signal<OfficeRelatedOpportunity[]>([]);
  readonly totalRecords = signal<number>(0);
  readonly loading = signal<boolean>(false);
  readonly searchTerm = signal<string>('');
  readonly pageIndex = signal<number>(1);
  readonly pageSize = signal<number>(10);

  constructor() {
    effect(() => {
      const id = this.office().id;
      if (id) this.loadOpportunities();
    });
    this.searchSubject
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe((query) => {
        this.searchTerm.set(query);
        this.pageIndex.set(1);
        this.loadOpportunities();
      });
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value ?? '');
  }

  loadOpportunities(): void {
    const id = this.office().id;
    const request: OfficeFilterRequest = {
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
      searchTerm: this.searchTerm()?.trim() || undefined
    };
    this.loading.set(true);
    this.officeService
      .getRelatedOpportunities(id, request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.opportunities.set(res.records);
          this.totalRecords.set(res.totalCount);
          this.loading.set(false);
        },
        error: () => {
          this.opportunities.set([]);
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
    this.loadOpportunities();
  }

  formatCurrency(value: number | null | undefined): string {
    if (value == null) return '—';
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
}
