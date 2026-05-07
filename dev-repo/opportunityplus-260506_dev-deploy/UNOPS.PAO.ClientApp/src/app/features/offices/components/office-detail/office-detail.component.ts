/**
 * @fileoverview Office detail component with page header and tabbed layout.
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { GoBackComponent } from '@shared/components/navigation/go-back/go-back.component';
import { OfficeService } from '../../services/office.service';
import { OfficeDetailTabsComponent } from '../office-detail-tabs/office-detail-tabs.component';
import type { OfficeDetailModel } from '../../models/office.model';

@Component({
  selector: 'app-office-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    ProgressSpinnerModule,
    GoBackComponent,
    OfficeDetailTabsComponent
  ],
  templateUrl: './office-detail.component.html',
  styleUrl: './office-detail.component.scss'
})
export class OfficeDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly officeService = inject(OfficeService);
  private readonly destroyRef = inject(DestroyRef);

  readonly office = signal<OfficeDetailModel | null>(null);
  readonly loading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly opportunitiesCount = signal<number>(0);
  readonly partnersCount = signal<number>(0);

  readonly officeId = signal<number>(0);

  readonly effectiveDate = computed(() => {
    const ki = this.office()?.keyInformation;
    if (!ki?.effectiveDate) return null;
    try {
      const d = new Date(ki.effectiveDate);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return ki.effectiveDate;
    }
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const idParam = params.get('id');
      const id = idParam ? parseInt(idParam, 10) : 0;
      this.officeId.set(id);
      if (!id || isNaN(id)) {
        this.loading.set(false);
        this.error.set('Invalid office ID');
        this.office.set(null);
        return;
      }
      this.loadOffice(id);
    });
  }

  private loadOffice(id: number): void {
    this.loading.set(true);
    this.error.set(null);
    this.officeService.getOfficeDetail(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (detail) => {
        this.office.set(detail);
        this.loading.set(false);
        this.loadTabCounts(id);
      },
      error: (err) => {
        this.office.set(null);
        this.loading.set(false);
        this.error.set(err?.message ?? 'Failed to load office');
      }
    });
  }

  onOfficeRefreshed(detail: OfficeDetailModel): void {
    this.office.set(detail);
  }

  private loadTabCounts(id: number): void {
    this.officeService
      .getRelatedOpportunities(id, { pageIndex: 1, pageSize: 1 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.opportunitiesCount.set(res.totalCount),
        error: () => this.opportunitiesCount.set(0)
      });
    this.officeService
      .getRelatedPartners(id, { pageIndex: 1, pageSize: 1 })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => this.partnersCount.set(res.totalCount),
        error: () => this.partnersCount.set(0)
      });
  }

}
