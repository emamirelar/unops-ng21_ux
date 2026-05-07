/**
 * @fileoverview Per-role operational assignment audit (paged, scroll to load more).
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  output,
  signal,
  untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { OfficeService } from '../../services/office.service';
import type { OfficeOperationalRoleAuditEntryModel } from '../../models/office.model';

@Component({
  selector: 'app-office-operational-role-history-dialog',
  standalone: true,
  imports: [CommonModule, TranslateModule, DialogModule, TableModule, ProgressSpinnerModule],
  templateUrl: './office-operational-role-history-dialog.component.html',
  styleUrl: './office-operational-role-history-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeOperationalRoleHistoryDialogComponent {
  private readonly officeService = inject(OfficeService);

  readonly visible = input(false);
  readonly visibleChange = output<boolean>();

  readonly officeId = input.required<number>();
  readonly entityRoleCode = input.required<string>();
  readonly roleTitle = input.required<string>();

  /** Increment (e.g. after a successful assign) to reload while the dialog stays open. */
  readonly refreshTrigger = input(0);

  readonly rows = signal<OfficeOperationalRoleAuditEntryModel[]>([]);
  /** First page / full refresh — overlay, does not change scroll extent. */
  readonly loadingInitial = signal(false);
  /** Infinite scroll append — compact footer strip. */
  readonly loadingMore = signal(false);
  readonly hasMore = signal(true);

  private pageIndex = 0;
  private readonly pageSize = 15;

  constructor() {
    effect(() => {
      const v = this.visible();
      const oid = this.officeId();
      const code = this.entityRoleCode();
      const _refresh = this.refreshTrigger();
      if (v && oid && code) {
        untracked(() => this.resetAndLoadFirstPage());
      } else if (!v) {
        untracked(() => {
          this.rows.set([]);
          this.hasMore.set(true);
          this.pageIndex = 0;
          this.loadingInitial.set(false);
          this.loadingMore.set(false);
        });
      }
    });
  }

  onVisibleChange(open: boolean): void {
    this.visibleChange.emit(open);
  }

  onScrollHostScroll(event: Event): void {
    const el = event.target as HTMLElement;
    if (el.scrollHeight - el.scrollTop - el.clientHeight > 80) return;
    this.fetchNextPage();
  }

  formatDateTimeUtc(value: string | null | undefined): string {
    if (value == null) return '—';
    try {
      const d = new Date(value);
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      });
    } catch {
      return '—';
    }
  }

  formatDateOnly(value: string | null | undefined): string {
    if (value == null || value === '') return '—';
    return value;
  }

  private resetAndLoadFirstPage(): void {
    this.rows.set([]);
    this.pageIndex = 0;
    this.hasMore.set(true);
    this.loadingInitial.set(false);
    this.loadingMore.set(false);
    this.fetchNextPage();
  }

  private fetchNextPage(): void {
    if (this.loadingInitial() || this.loadingMore()) return;
    if (this.pageIndex > 0 && !this.hasMore()) return;

    const oid = this.officeId();
    const code = this.entityRoleCode();
    const pi = this.pageIndex;
    const isFirstPage = pi === 0;

    if (isFirstPage) {
      this.loadingInitial.set(true);
    } else {
      this.loadingMore.set(true);
    }

    this.officeService.getOperationalRoleAssignmentHistory(oid, code, pi, this.pageSize).subscribe({
      next: (res) => {
        this.rows.update((existing) => (pi === 0 ? res.records : [...existing, ...res.records]));
        this.hasMore.set(res.hasMore);
        this.pageIndex = pi + 1;
        this.loadingInitial.set(false);
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingInitial.set(false);
        this.loadingMore.set(false);
      }
    });
  }
}
