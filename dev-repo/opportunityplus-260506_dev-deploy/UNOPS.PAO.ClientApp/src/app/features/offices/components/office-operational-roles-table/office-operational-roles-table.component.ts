/**
 * @fileoverview Operational roles table for office detail.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { OfficeOperationalRoleHistoryDialogComponent } from '../office-operational-role-history-dialog/office-operational-role-history-dialog.component';

import type { OfficeOperationalRoleModel } from '../../models/office.model';

@Component({
  selector: 'app-office-operational-roles-table',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    OfficeOperationalRoleHistoryDialogComponent
  ],
  templateUrl: './office-operational-roles-table.component.html',
  styleUrl: './office-operational-roles-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeOperationalRolesTableComponent {
  private readonly translate = inject(TranslateService);

  /** MASTER sheet Deputy Director / OiC column — show as Deputy Director/Manager in this table. */
  readonly organizationalDeputyDirectorRoleCode = 'Organizational_Deputy_Director_OrganizationHierarchy';

  /**
   * Director Manager, Deputy Director Manager, and HSSE Coordinator — managed in Opportunity+ when the user may edit.
   * Align with OfficeService OfficeMaster-only operational role codes.
   */
  private static readonly primaryManagedOperationalRoleCodes = new Set<string>([
    'Organizational_Director_OrganizationHierarchy',
    'Organizational_Deputy_Director_OrganizationHierarchy',
    'Organizational_HSSE_Coordinator_OrganizationHierarchy',
    'Regional_Management_Oversight_Advisor_OrganizationHierarchy'
  ]);

  readonly operationalRoles = input.required<OfficeOperationalRoleModel[]>();

  readonly officeId = input.required<number>();

  /** True when the user's Works At org unit matches this office (server: permissions.canEditOperationalRoles). */
  readonly canEditOperationalRoles = input(false);

  /** Bump after a successful assign so an open history dialog reloads. */
  readonly assignmentHistoryRefreshTrigger = input(0);

  /** Emitted when the user chooses to edit a row they are allowed to change in O+. */
  readonly requestEditRole = output<OfficeOperationalRoleModel>();

  readonly historyDialogOpen = signal(false);
  readonly historyEntityRoleCode = signal('');
  readonly historyRoleTitle = signal('');

  /**
   * Role column label: `role.{entityRoleCode}` when present, else API role name.
   */
  getTranslatedRoleLabel(role: OfficeOperationalRoleModel): string {
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

  hasPersonnel(role: OfficeOperationalRoleModel): boolean {
    return !!role.holderName?.trim();
  }

  isPrimaryManagedOperationalRole(role: OfficeOperationalRoleModel): boolean {
    const code = role.entityRoleCode;
    return !!code && OfficeOperationalRolesTableComponent.primaryManagedOperationalRoleCodes.has(code);
  }

  /** Row shows "you can edit" when this is a primary managed role and AC1 permission is true. */
  canEditRow(role: OfficeOperationalRoleModel): boolean {
    return this.canEditOperationalRoles() && this.isPrimaryManagedOperationalRole(role);
  }

  rowDisplayTitle(role: OfficeOperationalRoleModel): string {
    if (role.entityRoleCode === this.organizationalDeputyDirectorRoleCode) {
      const key = 'office.rolesDoa.labelDeputyDirectorManager';
      const t = this.translate.instant(key);
      if (t && t !== key) return t;
    }
    return this.getTranslatedRoleLabel(role);
  }

  openHistory(role: OfficeOperationalRoleModel): void {
    const code = role.entityRoleCode?.trim();
    if (!code) return;
    this.historyEntityRoleCode.set(code);
    this.historyRoleTitle.set(this.rowDisplayTitle(role));
    this.historyDialogOpen.set(true);
  }

  onHistoryVisible(open: boolean): void {
    this.historyDialogOpen.set(open);
    if (!open) {
      this.historyEntityRoleCode.set('');
      this.historyRoleTitle.set('');
    }
  }

  /** Applicability / effective-from for display (AC3). */
  formatEffectiveFrom(iso: string | null | undefined): string {
    if (iso == null || iso === '') return '—';
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return '—';
      return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return '—';
    }
  }
}
