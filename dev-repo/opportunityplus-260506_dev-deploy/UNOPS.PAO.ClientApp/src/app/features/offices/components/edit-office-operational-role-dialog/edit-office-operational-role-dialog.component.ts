/**
 * @fileoverview Dialog to assign personnel and effective date for an office operational role.
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  input,
  output,
  signal,
  computed,
  effect,
  untracked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MessageModule } from 'primeng/message';

import {
  UserSearchService,
  type UserSearchResult
} from '@shared/services/user/user-search.service';
import { OfficeService } from '../../services/office.service';
import { FeedbackDialogService } from '@shared/services/ui';
import type { OfficeDetailModel, OfficeOperationalRoleModel } from '../../models/office.model';

/** One row in the personnel select (rich display + filter text). */
export type PersonnelOption = {
  value: number;
  label: string;
  email: string;
  position: string;
  orgUnit: string;
  filterBlob: string;
};

@Component({
  selector: 'app-edit-office-operational-role-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    FloatLabelModule,
    ToggleSwitchModule,
    MessageModule
  ],
  templateUrl: './edit-office-operational-role-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditOfficeOperationalRoleDialogComponent {
  private static readonly directorRoleCode = 'Organizational_Director_OrganizationHierarchy';
  private static readonly deputyRoleCode = 'Organizational_Deputy_Director_OrganizationHierarchy';

  private readonly userSearch = inject(UserSearchService);
  private readonly officeService = inject(OfficeService);
  private readonly feedback = inject(FeedbackDialogService);
  private readonly translate = inject(TranslateService);

  readonly visible = model(false);
  readonly officeId = input.required<number>();
  /** Role row being edited (entityRoleCode + display context). */
  readonly role = input.required<OfficeOperationalRoleModel>();
  /** Translated role title for the dialog header/body. */
  readonly roleLabel = input.required<string>();
  /** All operational role rows for this office (for Director vs Deputy validation). */
  readonly allOperationalRoles = input<OfficeOperationalRoleModel[]>([]);
  /**
   * Cost centre / office code used to optionally narrow the personnel list (matches "Works at" text server-side).
   */
  readonly officeStaffDirectoryToken = input<string | null>(null);

  readonly officeUpdated = output<OfficeDetailModel>();

  readonly personnelOptions = signal<PersonnelOption[]>([]);
  readonly selectedUserId = signal<number | null>(null);
  readonly effectiveDate = signal<Date | null>(null);
  readonly submitting = signal(false);
  readonly loadingPersonnel = signal(false);
  /** Last filter string from the personnel dropdown (for refresh on open). */
  readonly lastPersonnelFilter = signal('');
  /** Narrow list to people whose directory "Works at" matches the office token (server-side on reload). */
  readonly restrictToOfficeStaffDirectory = signal(false);

  readonly minEffectiveDate = computed(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  /** Selected personnel matches the holder of the paired Director/Deputy role. */
  readonly directorDeputySamePerson = computed(() => {
    const roles = this.allOperationalRoles();
    const code = this.role().entityRoleCode;
    const sel = this.selectedUserId();
    if (sel == null || sel <= 0 || !code) return false;

    let peerCode: string | null = null;
    if (code === EditOfficeOperationalRoleDialogComponent.directorRoleCode) {
      peerCode = EditOfficeOperationalRoleDialogComponent.deputyRoleCode;
    } else if (code === EditOfficeOperationalRoleDialogComponent.deputyRoleCode) {
      peerCode = EditOfficeOperationalRoleDialogComponent.directorRoleCode;
    } else {
      return false;
    }

    return roles.some(
      (r) => r.entityRoleCode === peerCode && r.holderUserId != null && r.holderUserId === sel
    );
  });

  readonly canSubmit = computed(() => {
    const uid = this.selectedUserId();
    const ed = this.effectiveDate();
    return (
      uid != null &&
      uid > 0 &&
      ed != null &&
      !this.submitting() &&
      !this.directorDeputySamePerson()
    );
  });

  readonly showOfficeStaffFilterToggle = computed(() => {
    const t = (this.officeStaffDirectoryToken() ?? '').trim();
    return t.length > 0;
  });

  constructor() {
    effect(() => {
      if (!this.visible()) return;
      this.role();
      untracked(() => this.resetFormFromRole());
    });
  }

  private resetFormFromRole(): void {
    const r = this.role();
    this.selectedUserId.set(r.holderUserId ?? null);
    this.effectiveDate.set(this.minEffectiveDate());
    this.lastPersonnelFilter.set('');
    this.restrictToOfficeStaffDirectory.set(false);
    this.personnelOptions.set([]);
    this.loadPersonnelList('');
  }

  private mapUserToOption(u: UserSearchResult): PersonnelOption {
    const pos = u.userProfile?.position?.trim() ?? '';
    const org =
      u.userProfile?.orgUnitWorksAtDisplay?.trim() ||
      u.userProfile?.orgUnit?.trim() ||
      '';
    const email = u.email ?? '';
    const label = (u.name ?? '').trim() || email;
    const filterBlob = [label, email, pos, org].filter(Boolean).join(' ').toLowerCase();
    return {
      value: u.id,
      label,
      email,
      position: pos,
      orgUnit: org,
      filterBlob
    };
  }

  private applyOptions(users: UserSearchResult[]): void {
    this.personnelOptions.set(users.map((u) => this.mapUserToOption(u)));
  }

  /**
   * Loads dropdown options. Empty filter: paged "initial" list. Length ≥ 2: typeahead search API.
   */
  loadPersonnelList(filterInput: string): void {
    const q = filterInput.trim();
    const sel = this.selectedUserId();
    const selectedIds = sel != null && sel > 0 ? [sel] : undefined;
    const token = (this.officeStaffDirectoryToken() ?? '').trim();
    const narrow = this.restrictToOfficeStaffDirectory() && token.length > 0;

    this.loadingPersonnel.set(true);

    if (q.length >= 2) {
      this.userSearch.searchUsers(q, 50, selectedIds).subscribe({
        next: (users) => {
          this.applyOptions(users);
          this.loadingPersonnel.set(false);
        },
        error: () => this.loadingPersonnel.set(false)
      });
      return;
    }

    this.userSearch.getInitialUsers(selectedIds, narrow ? token : undefined).subscribe({
      next: (users) => {
        this.applyOptions(users);
        this.loadingPersonnel.set(false);
      },
      error: () => this.loadingPersonnel.set(false)
    });
  }

  onPersonnelDropdownShow(): void {
    this.loadPersonnelList(this.lastPersonnelFilter());
  }

  onPersonnelFilter(event: { filter: string } | string): void {
    const q = (typeof event === 'string' ? event : (event?.filter ?? '')).trim();
    this.lastPersonnelFilter.set(q);
    this.loadPersonnelList(q);
  }

  onRestrictToOfficeStaffChange(checked: boolean): void {
    this.restrictToOfficeStaffDirectory.set(checked);
    this.loadPersonnelList(this.lastPersonnelFilter());
  }

  onCancel(): void {
    if (this.submitting()) return;
    this.visible.set(false);
  }

  onSave(): void {
    const oid = this.officeId();
    const r = this.role();
    const uid = this.selectedUserId();
    const ed = this.effectiveDate();
    if (uid == null || ed == null || !r.entityRoleCode) return;

    if (this.directorDeputySamePerson()) {
      this.feedback.showErrorToast({
        summary: this.translate.instant('office.rolesDoa.editRole.directorDeputyConflictSummary'),
        detail: this.translate.instant('office.rolesDoa.editRole.directorDeputyConflictDetail')
      });
      return;
    }

    const y = ed.getFullYear();
    const m = String(ed.getMonth() + 1).padStart(2, '0');
    const day = String(ed.getDate()).padStart(2, '0');
    const effectiveDateIso = `${y}-${m}-${day}`;

    this.submitting.set(true);
    this.officeService
      .updateOperationalRole(oid, {
        entityRoleCode: r.entityRoleCode,
        userId: uid,
        effectiveDate: effectiveDateIso
      })
      .subscribe({
        next: (detail) => {
          this.submitting.set(false);
          this.feedback.showSuccessToast({
            summary: this.translate.instant('office.rolesDoa.editRole.successSummary'),
            detail: this.translate.instant('office.rolesDoa.editRole.successDetail')
          });
          this.officeUpdated.emit(detail);
          this.visible.set(false);
        },
        error: () => {
          this.submitting.set(false);
        }
      });
  }
}
