import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, signal, computed, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ContactEditDialogComponent } from '../edit-dialog/contact-edit-dialog.component';
import { BusinessCardScannerComponent } from './business-card-scanner/business-card-scanner.component';
import { ContactService } from '../../../services/contact.service';
import { FeedbackDialogService } from '@shared/services/ui';
import { Contact } from '../../../models/contact.model';
import { ImportDialogService } from '@features/import-export/components/import/dialog/import-dialog.service';
import { PermissionUtilityService } from '@core/services/auth';
import { PageContextService } from '@shared/services/utils';
import { HttpClient } from '@angular/common/http';

interface FilterTag {
  group: 'status' | 'type';
  label: string;
  value: string;
}

/**
 * @uiEntity Contact
 * @route /partnerships/contacts
 * @description Browse and manage contact persons within partner organizations.
 */
@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    TranslateModule,
    MenuModule,
    DataViewModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectButtonModule,
    SkeletonModule,
    BusinessCardScannerComponent,
  ],
  providers: [DialogService, ConfirmationService]
})
export class ContactListComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  router = inject(Router);
  route = inject(ActivatedRoute);
  contactService = inject(ContactService);
  feedbackDialogService = inject(FeedbackDialogService);
  dialogService = inject(DialogService);
  importDialogService = inject(ImportDialogService);
  permissionUtilityService = inject(PermissionUtilityService);
  translateService = inject(TranslateService);
  cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);
  private pageContextService = inject(PageContextService);

  private permissionUtils = this.permissionUtilityService.createEntityPermissions('Contact');
  entityPermissions = this.permissionUtils.entityPermissions;
  permissionsLoading = this.permissionUtils.permissionsLoading;

  contacts = signal<Contact[]>([]);
  isLoading = signal(true);
  layout: 'list' | 'grid' = 'list';
  layoutOptions = ['list', 'grid'];

  searchQuery = signal('');
  activeStatusFilters = signal<Set<string>>(new Set());
  activeTypeFilters = signal<Set<string>>(new Set());

  filterTags = computed<FilterTag[]>(() => {
    const contacts = this.contacts();
    const statuses = [...new Set(contacts.map(c => c.status).filter((s): s is string => !!s))];
    const types = [...new Set(contacts.map(c => c.department).filter((t): t is string => !!t))];
    return [
      ...statuses.map(s => ({ group: 'status' as const, label: s, value: s })),
      ...types.map(t => ({ group: 'type' as const, label: t, value: t }))
    ];
  });

  filteredContacts = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const statusFilters = this.activeStatusFilters();
    const typeFilters = this.activeTypeFilters();

    return this.contacts().filter(c => {
      if (query) {
        const searchable = [
          c.firstName,
          c.lastName,
          c.email,
          c.title,
          c.partnerName,
          c.department,
          c.mailingCity,
          c.mailingCountry,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      if (statusFilters.size > 0 && (!c.status || !statusFilters.has(c.status))) return false;
      if (typeFilters.size > 0 && (!c.department || !typeFilters.has(c.department))) return false;
      return true;
    });
  });

  totalCount = computed(() => this.filteredContacts().length);
  activeCount = computed(() => this.filteredContacts().filter(c => c.status === 'Active').length);
  hasActiveFilters = computed(() =>
    this.searchQuery().length > 0 ||
    this.activeStatusFilters().size > 0 ||
    this.activeTypeFilters().size > 0
  );

  showBusinessCardScanner = signal(false);

  ngOnInit() {
    this.permissionUtils.loadPermissions(this.router, this.cdr);
    this.loadContacts();

    window.addEventListener('refresh-listview', this.refreshHandler);

    this.route.queryParams
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['openNewDialog'] === 'true') {
          const state = history.state;
          const emptyContact: Contact = {};
          this.openContactEditDialog(state?.data || emptyContact);
        }
      });
  }

  private loadContacts() {
    this.isLoading.set(true);
    this.http.get<any>('/api/contact').subscribe({
      next: (data) => {
        if (data && Array.isArray(data.records)) {
          this.contacts.set(data.records);
        } else if (data && Array.isArray(data)) {
          this.contacts.set(data);
        }
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  getFullName(contact: Contact): string {
    return [contact.firstName, contact.middleName, contact.lastName].filter(Boolean).join(' ').trim() || '?';
  }

  getInitials(contact: Contact): string {
    const first = contact.firstName?.charAt(0) ?? '';
    const last = contact.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || '?';
  }

  isTagActive(tag: FilterTag): boolean {
    const set = tag.group === 'status' ? this.activeStatusFilters() : this.activeTypeFilters();
    return set.has(tag.value);
  }

  toggleTag(tag: FilterTag) {
    const signalRef = tag.group === 'status' ? this.activeStatusFilters : this.activeTypeFilters;
    const current = signalRef();
    const next = new Set(current);
    if (next.has(tag.value)) {
      next.delete(tag.value);
    } else {
      next.add(tag.value);
    }
    signalRef.set(next);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.activeStatusFilters.set(new Set());
    this.activeTypeFilters.set(new Set());
  }

  private refreshHandler = () => {
    this.loadContacts();
  };

  ngOnDestroy() {
    this.pageContextService.clearComponentData();
    window.removeEventListener('refresh-listview', this.refreshHandler);
  }

  _handleOnRecordCreation(newRecordData: Contact) {
    if (newRecordData && newRecordData.id !== undefined && newRecordData.id !== null) {
      window.dispatchEvent(new CustomEvent('refresh-listview'));
      this.loadContacts();
      this.router.navigate(['partnerships/contacts', newRecordData.id.toString()]);
    }
  }

  openContactEditDialog(contactData: Contact = {}) {
    if (contactData.id && !this.permissionUtilityService.canUpdate(this.entityPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'message.noPermissionToEdit',
        summary: 'message.permissionDenied'
      });
      return;
    } else if (!contactData.id && !this.permissionUtilityService.canCreate(this.entityPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'message.noPermissionToCreate',
        summary: 'message.permissionDenied'
      });
      return;
    }

    const ref = this.dialogService.open(ContactEditDialogComponent, {
      header: contactData.id ? this.translateService.instant('title.editContact') : this.translateService.instant('title.newContact'),
      width: '40vw',
      breakpoints: { '960px': '95vw' },
      closable: true,
      data: {
        mode: contactData.id ? 'edit' : 'new',
        record: contactData,
      }
    });

    if (!ref) return;

    const refSub = ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this._handleOnRecordCreation(result);
      }
      refSub.unsubscribe();
    });
  }

  openBusinessCardScanner() {
    if (!this.permissionUtilityService.canCreate(this.entityPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'message.noPermissionToCreate',
        summary: 'message.permissionDenied'
      });
      return;
    }
    this.showBusinessCardScanner.set(true);
  }

  closeBusinessCardScanner() {
    this.showBusinessCardScanner.set(false);
  }

  handleScannedContact(contact: Contact) {
    this.closeBusinessCardScanner();
    if (contact) {
      this.openContactEditDialog(contact);
    }
  }

  importMenuItems = signal<MenuItem[]>([
    {
      label: 'Select from Google Drive',
      icon: 'pi pi-google',
      command: () => this.openGooglePickerImport(),
      title: 'Select a Google Sheet from your Drive.'
    },
    {
      label: 'Manual Entry',
      icon: 'pi pi-link',
      command: () => this.openManualEntryImport(),
      title: 'Paste a Google Sheet URL directly and specify the sheet name'
    }
  ]);

  openGooglePickerImport() {
    if (!this.permissionUtilityService.canCreate(this.entityPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'message.noPermissionToImport',
        summary: 'message.permissionDenied'
      });
      return;
    }
    this.importDialogService.openGoogleSheetPicker('contact');
  }

  openManualEntryImport() {
    if (!this.permissionUtilityService.canCreate(this.entityPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'message.noPermissionToImport',
        summary: 'message.permissionDenied'
      });
      return;
    }
    this.importDialogService.openManualEntryDialog('contact');
  }
}
