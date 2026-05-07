/**
 * @fileoverview Roles & DoA tab container with Operational Roles and DoA Holders cards.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, inject, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { PanelModule } from 'primeng/panel';

import { OfficeOperationalRolesTableComponent } from '../office-operational-roles-table/office-operational-roles-table.component';
import { OfficeDoAHoldersTableComponent } from '../office-doa-holders-table/office-doa-holders-table.component';
import { EditOfficeOperationalRoleDialogComponent } from '../edit-office-operational-role-dialog/edit-office-operational-role-dialog.component';

import type { OfficeDetailModel, OfficeOperationalRoleModel } from '../../models/office.model';

@Component({
  selector: 'app-office-roles-doa',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PanelModule,
    OfficeOperationalRolesTableComponent,
    OfficeDoAHoldersTableComponent,
    EditOfficeOperationalRoleDialogComponent
  ],
  templateUrl: './office-roles-doa.component.html',
  styleUrl: './office-roles-doa.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeRolesDoaComponent {
  private readonly translate = inject(TranslateService);

  readonly office = input.required<OfficeDetailModel>();
  readonly officeRefreshed = output<OfficeDetailModel>();

  /** Role row opened in the edit dialog (stable while dialog is open). */
  readonly operationalRoleBeingEdited = signal<OfficeOperationalRoleModel | null>(null);
  readonly operationalRoleEditDialogVisible = signal(false);

  /** Bumped after assign succeeds so per-role history dialog reloads. */
  readonly assignmentHistoryRefreshTrigger = signal(0);

  readonly operationalRoles = computed(() => this.office().operationalRoles ?? []);
  readonly canEditOperationalRoles = computed(
    () => this.office().permissions?.canEditOperationalRoles === true
  );
  readonly doaHolders = computed(() => this.office().doAHolders ?? []);
  readonly operationalRolesLastSyncedAt = computed(() => this.office().syncMetadata?.operationalRolesLastSyncedAt ?? null);
  readonly doaHoldersLastSyncedAt = computed(() => this.office().syncMetadata?.doAHoldersLastSyncedAt ?? null);

  /** Cost centre (B-code) or office key code — used to optionally narrow personnel search in the assign dialog. */
  readonly officeStaffDirectoryToken = computed(() => {
    const o = this.office();
    const cc = o.financialInformation?.costCentreId?.trim();
    if (cc) return cc;
    return o.keyInformation?.code?.trim() ?? null;
  });

  formatDate(value: string | null | undefined): string {
    if (value == null) return '—';
    try {
      const d = new Date(value);
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return '—';
    }
  }

  getTranslatedOperationalRoleLabel(role: OfficeOperationalRoleModel): string {
    const code = role.entityRoleCode;
    if (code) {
      const key = `role.${code}`;
      const translated = this.translate.instant(key);
      if (translated && translated !== key) {
        return translated;
      }
    }
    return role.roleName || '';
  }

  onRequestEditOperationalRole(role: OfficeOperationalRoleModel): void {
    this.operationalRoleBeingEdited.set(role);
    this.operationalRoleEditDialogVisible.set(true);
  }

  onOperationalRoleEditDialogVisibleChange(open: boolean): void {
    this.operationalRoleEditDialogVisible.set(open);
    if (!open) {
      this.operationalRoleBeingEdited.set(null);
    }
  }

  operationalRoleEditLabel(role: OfficeOperationalRoleModel): string {
    const code = role.entityRoleCode;
    if (code === 'Organizational_Deputy_Director_OrganizationHierarchy') {
      return this.translate.instant('office.rolesDoa.labelDeputyDirectorManager');
    }
    return this.getTranslatedOperationalRoleLabel(role);
  }

  onOperationalRoleUpdated(detail: OfficeDetailModel): void {
    this.assignmentHistoryRefreshTrigger.update((n) => n + 1);
    this.officeRefreshed.emit(detail);
  }
}
