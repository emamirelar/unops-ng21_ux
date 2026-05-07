/**
 * @fileoverview Office Scope tab with scope type and geographic scope.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';

import type { OfficeDetailModel } from '../../models/office.model';

@Component({
  selector: 'app-office-scope-tab',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, TableModule, PanelModule],
  templateUrl: './office-scope-tab.component.html',
  styleUrl: './office-scope-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeScopeTabComponent {
  readonly office = input.required<OfficeDetailModel>();

  readonly scope = computed(() => this.office().scope ?? null);
  readonly geographicScope = computed(() => this.office().scope?.geographicScope ?? []);
  readonly locationsLastSyncedAt = computed(() => this.office().syncMetadata?.locationsLastSyncedAt ?? null);

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
}
