/**
 * @fileoverview Office Financial tab with cost centre, funding, and performance targets.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { PanelModule } from 'primeng/panel';

import type { OfficeDetailModel } from '../../models/office.model';

@Component({
  selector: 'app-office-financial-tab',
  standalone: true,
  imports: [CommonModule, TranslateModule, PanelModule],
  templateUrl: './office-financial-tab.component.html',
  styleUrl: './office-financial-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeFinancialTabComponent {
  readonly office = input.required<OfficeDetailModel>();

  readonly financial = computed(() => this.office().financialInformation ?? null);
  readonly lastSyncedAt = computed(() => this.office().syncMetadata?.financialLastSyncedAt ?? null);

  /** Fiscal year for heading: first available from nerTargetPeriod or eaTargetPeriod. */
  readonly fiscalYearForHeading = computed(() => {
    const fin = this.financial();
    if (!fin) return null;
    return this.extractYear(fin.nerTargetPeriod) ?? this.extractYear(fin.eaTargetPeriod) ?? null;
  });

  /** Extract 4-digit year from period string (e.g. "2026", "FY 2026", "FY2026"). */
  extractYear(period: string | null | undefined): string | null {
    if (!period) return null;
    const match = period.match(/\d{4}/);
    return match ? match[0] : null;
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

  formatDate(value: string | null | undefined): string {
    if (value == null) return '—';
    try {
      const d = new Date(value);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  }
}
