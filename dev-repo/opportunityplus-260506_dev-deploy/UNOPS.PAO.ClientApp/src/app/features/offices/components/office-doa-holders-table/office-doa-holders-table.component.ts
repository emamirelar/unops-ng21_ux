/**
 * @fileoverview DoA holders table for office detail.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';

import type { OfficeDoAHolderModel } from '../../models/office.model';

@Component({
  selector: 'app-office-doa-holders-table',
  standalone: true,
  imports: [CommonModule, TranslateModule, TableModule],
  templateUrl: './office-doa-holders-table.component.html',
  styleUrl: './office-doa-holders-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeDoAHoldersTableComponent {
  readonly doaHolders = input.required<OfficeDoAHolderModel[]>();

  formatApplicabilityPeriod(holder: OfficeDoAHolderModel): string {
    const start = holder.applicabilityPeriodStart;
    const end = holder.applicabilityPeriodEnd;
    if (!start && !end) return '—';
    const fmt = (s: string) => {
      try {
        const d = new Date(s);
        return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
      } catch {
        return s;
      }
    };
    if (start && end) return `${fmt(start)} — ${fmt(end)}`;
    if (start) return fmt(start);
    return end ? fmt(end) : '—';
  }
}
