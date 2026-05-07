/**
 * @fileoverview Office Details tab with key information, parent hierarchy, and child offices.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PanelModule } from 'primeng/panel';

import { OfficeHierarchyTreeComponent } from '../office-hierarchy-tree/office-hierarchy-tree.component';
import type { OfficeDetailModel, OfficePhysicalDetailsModel } from '../../models/office.model';

@Component({
  selector: 'app-office-details-tab',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, PanelModule, OfficeHierarchyTreeComponent],
  templateUrl: './office-details-tab.component.html',
  styleUrl: './office-details-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeDetailsTabComponent {
  readonly office = input.required<OfficeDetailModel>();

  readonly keyInfo = computed(() => this.office().keyInformation ?? null);
  readonly parentChain = computed(() => this.office().parentChain ?? []);
  readonly children = computed(() => this.office().children ?? []);
  readonly physicalLocations = computed(() => this.office().physicalLocations ?? []);
  readonly locationsLastSyncedAt = computed(() => this.office().syncMetadata?.locationsLastSyncedAt ?? null);
  /** Sync config `offices` (oneUNOPS Projects) — same field as Financial Information. */
  readonly officesLastSyncedAt = computed(() => this.office().syncMetadata?.financialLastSyncedAt ?? null);

  formatDate(value: string | Date | null | undefined): string {
    if (value == null) return '—';
    try {
      const d = typeof value === 'string' ? new Date(value) : value;
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '—';
    }
  }

  /** Same display as Financial tab for sync timestamps. */
  formatLastSynced(value: string | null | undefined): string {
    if (value == null) return '—';
    try {
      const d = new Date(value);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '—';
    }
  }

  formatAddress(location: OfficePhysicalDetailsModel | null | undefined): string {
    if (!location) return '—';
    if (location.address) return location.address;
    const parts = [location.city, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : '—';
  }

  /**
   * Avoids duplicating the cost-centre code when `name` already starts with it (synced data often includes the code in `name`).
   */
  formatOfficeTreeLabel(code: string | undefined, name: string | undefined): string {
    const c = (code ?? '').trim();
    const n = (name ?? '').trim();
    if (!n) {
      return c || '—';
    }
    if (!c) {
      return n;
    }
    if (n.toLowerCase().startsWith(c.toLowerCase())) {
      return n;
    }
    return `${c} ${n}`;
  }
}
