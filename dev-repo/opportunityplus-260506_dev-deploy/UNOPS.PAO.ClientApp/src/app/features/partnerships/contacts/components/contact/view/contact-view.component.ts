import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit, OnChanges, AfterViewInit, signal, computed, Input, ViewChild, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FeedbackDialogService } from '@shared/services/ui';
import { DocumentService } from '@shared/services/api/document.service';
import { ParentEntityType } from '@shared/interfaces/types';
import { DocumentLinkModel } from '@app/shared';
import { DocumentComponent } from '@shared/components/documents/document/document.component';
import { GDriveDocumentComponent } from '@shared/components/documents/gdrive/document-gdrive.component';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ContactService } from '@partnerships/contacts/services/contact.service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LinkListComponent } from '@shared/components/links/link/list/link-list.component';
import { EntityType } from '@shared/models/link.model';
import { ContactEditDialogFooterComponent } from '../edit-dialog/footer/contact-edit-dialog-footer.component';
import { ContactEditDialogComponent } from '../edit-dialog/contact-edit-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Contact, getPrimaryOrganizationUnit } from '../../../models/contact.model';
import { PermissionUtilityService } from '@core/services/auth';
import { PageContextService } from '@shared/services/utils';
import { AiCardBgComponent } from '@unopsitg/ux';

interface AiInsight {
  icon: string;
  iconBg: string;
  title: string;
  description: string;
  action: string;
}

const AI_INSIGHTS: AiInsight[] = [
  { icon: 'pi pi-chart-line', iconBg: 'bg-red-100 text-red-600', title: 'Engagement Declining', description: 'No interactions recorded in the past 90 days. Consider scheduling a touchpoint.', action: 'Schedule Meeting' },
  { icon: 'pi pi-heart', iconBg: 'bg-green-100 text-green-600', title: 'Relationship Strength', description: 'Strong relationship based on 12 interactions this year. Recommend maintaining current cadence.', action: 'View History' },
  { icon: 'pi pi-exclamation-circle', iconBg: 'bg-amber-100 text-amber-600', title: 'Missing Details', description: 'Mobile number, department, and mailing address are incomplete. Update to improve outreach.', action: 'Edit Contact' },
  { icon: 'pi pi-star', iconBg: 'bg-purple-100 text-purple-600', title: 'Decision-Maker', description: 'This contact is linked to 3 approved opportunities. High influence in partner organization.', action: 'View Opportunities' },
  { icon: 'pi pi-copy', iconBg: 'bg-orange-100 text-orange-600', title: 'Duplicate Risk', description: 'A similar contact exists with matching email domain. Review and merge if appropriate.', action: 'Review Duplicates' },
  { icon: 'pi pi-globe', iconBg: 'bg-blue-100 text-blue-600', title: 'Language Mismatch', description: 'Contact preferred language differs from the liaison office default. Ensure communications match.', action: 'Update Preferences' },
  { icon: 'pi pi-calendar', iconBg: 'bg-teal-100 text-teal-600', title: 'Contract Renewal', description: 'Associated partner agreement expires in 45 days. Initiate renewal discussion.', action: 'View Agreement' },
  { icon: 'pi pi-comments', iconBg: 'bg-pink-100 text-pink-600', title: 'Sentiment Analysis', description: 'Recent interaction notes suggest positive sentiment. Good time for new proposals.', action: 'Create Opportunity' },
];

@Component({
  selector: 'app-contact-view',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DocumentComponent,
    GDriveDocumentComponent,
    ButtonModule,
    TagModule,
    InputTextModule,
    PaginatorModule,
    AiCardBgComponent,
    LinkListComponent,
    RouterModule,
    ConfirmDialogModule
  ],
  templateUrl: './contact-view.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, ConfirmationService],
})
export class ContactViewComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  documentService = inject(DocumentService);
  contactService = inject(ContactService);
  permissionUtilityService = inject(PermissionUtilityService);
  translateService = inject(TranslateService);
  cdr = inject(ChangeDetectorRef);
  feedbackDialogService = inject(FeedbackDialogService);
  dialogService = inject(DialogService);
  confirmationService = inject(ConfirmationService);
  private pageContextService = inject(PageContextService);

  private permissionUtils = this.permissionUtilityService.createInstancePermissions('Contact');
  recordPermissions = this.permissionUtils.recordPermissions;

  private langChangeSubscription: Subscription = new Subscription();

  @Input() recordId: string = '';

  recordData = signal<Contact>({});
  infoLoading = signal<boolean>(false);

  readonly entityTypeContact = EntityType.Contact;

  @ViewChild('linkListComponent') linkListComponent!: LinkListComponent;
  @ViewChild('gdriveComponent') gdriveComponent!: GDriveDocumentComponent;

  // Expandable sections
  contactInfoExpanded = signal(true);
  orgLocationExpanded = signal(true);
  interactionsExpanded = signal(true);

  // AI Insights
  aiInsights = AI_INSIGHTS;
  aiSearchQuery = signal('');
  aiCurrentPage = signal(0);
  readonly aiPageSize = 3;
  aiInsightsExpanded = signal(true);

  filteredInsights = computed(() => {
    const query = this.aiSearchQuery().toLowerCase().trim();
    if (!query) return this.aiInsights;
    return this.aiInsights.filter(i =>
      i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query)
    );
  });

  paginatedInsights = computed(() => {
    const all = this.filteredInsights();
    const start = this.aiCurrentPage() * this.aiPageSize;
    return all.slice(start, start + this.aiPageSize);
  });

  // Notes
  notesText = signal('');

  ngAfterViewInit() {}

  ngOnDestroy(): void {
    this.pageContextService.clearComponentData();
    this.langChangeSubscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordId']) {
      this._loadRecordDetails();
    }
  }

  ngOnInit() {
    this.pageContextService.setComponentData(this);

    if (this.recordId) {
      this._loadRecordDetails();
    }

    const parent = this.activatedRoute.parent;
    if (parent) {
      parent.paramMap.subscribe({
        next: (paramMap) => {
          const newRecordId = paramMap.get('recordId') || '';
          if (newRecordId && newRecordId !== this.recordId) {
            this.recordId = newRecordId;
            this._loadRecordDetails();
          } else if (newRecordId && !this.recordId) {
            this.recordId = newRecordId;
            this._loadRecordDetails();
          }
        }
      });
    }
  }

  _loadRecordDetails() {
    this.infoLoading.set(true);
    this.contactService.getContactById(this.recordId).subscribe({
      next: (data: any) => {
        this.recordData.set(data);
        if (data.permissions) {
          this.recordPermissions.set({
            entity: 'Contact',
            hasAccess: true,
            permissions: data.permissions
          });
        }
        if (data.description) {
          this.notesText.set(data.description);
        }
        this.infoLoading.set(false);
        this.cdr.markForCheck();
      },
      error: () => {
        this.infoLoading.set(false);
        this.cdr.markForCheck();
      }
    });
  }

  getFullName(): string {
    const d = this.recordData();
    return [d.salutation, d.firstName, d.middleName, d.lastName, d.suffix].filter(Boolean).join(' ').trim() || '?';
  }

  getInitials(): string {
    const d = this.recordData();
    const first = d.firstName?.charAt(0) ?? '';
    const last = d.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase() || '?';
  }

  handleEditClick() {
    if (!this.permissionUtilityService.canUpdate(this.recordPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'You do not have permission to edit this contact',
        summary: 'Permission Denied'
      });
      return;
    }

    const ref = this.dialogService.open(ContactEditDialogComponent, {
      header: 'Edit Contact',
      width: '90vw',
      style: { maxWidth: '800px' },
      closable: true,
      templates: { footer: ContactEditDialogFooterComponent },
      data: {
        mode: 'edit',
        record: this.recordData(),
        requestingSaveSignal: signal<boolean>(false)
      }
    });

    if (!ref) return;
    ref.onClose.subscribe((result) => {
      if (result) this._loadRecordDetails();
    });
  }

  deleteContact(): void {
    if (!this.permissionUtilityService.canDelete(this.recordPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: this.translateService.instant('contact.detail.error.deletePermissionDenied'),
        summary: this.translateService.instant('common.error.permissionDenied')
      });
      return;
    }

    this.confirmationService.confirm({
      message: this.translateService.instant('contact.detail.confirmation.deleteMessage'),
      header: this.translateService.instant('contact.detail.confirmation.deleteHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.contactService.deleteContactById(this.recordId).subscribe({
          next: () => {
            this.feedbackDialogService.showSuccessToast({
              detail: this.translateService.instant('contact.detail.success.deleted')
            });
            this.router.navigate(['/partnerships/contacts']);
          },
          error: () => {
            this.feedbackDialogService.showErrorToast({
              detail: this.translateService.instant('contact.detail.error.deleteFailed')
            });
          }
        });
      }
    });
  }

  onFileUploaded(response: any) {
    if (!this.permissionUtilityService.canUpdate(this.recordPermissions())) return;
    const formData = new FormData();
    for (const file of response.files) {
      formData.append('file', file);
      formData.append('parentEntityName', ParentEntityType.Contact.toString());
      formData.append('parentEntityId', this.recordId);
      formData.append('name', file.name);
      formData.append('documentTypeId', '1');
    }
    this.documentService.uploadUnopsFiles(formData).subscribe({
      next: (res: any) => this.feedbackDialogService.showSuccessToast({ detail: `File ${res.name} uploaded successfully!` }),
    });
  }

  onDriveFileUploaded(response: any) {
    if (!this.permissionUtilityService.canUpdate(this.recordPermissions())) return;
    const file = response[0];
    const req: DocumentLinkModel = {
      link: file.url,
      googleId: file.id,
      name: file.name,
      type: file.mimeType,
      documentTypeId: 0,
      parentEntityName: 'Contact',
      parentEntityId: parseInt(this.recordId),
    };
    this.documentService.linkUnopsFiles(req).subscribe({
      next: (res: any) => this.feedbackDialogService.showSuccessToast({ detail: `File ${res.name} uploaded successfully!` }),
    });
  }

  get acceptedMiMIETypesForgDrive() {
    return 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet';
  }

  getUploadProfilePictureUrl() {
    return this.contactService.getUploadProfilePictureUrl(this.recordId);
  }

  openAddLinkDialog() {
    if (this.linkListComponent) this.linkListComponent.openEditDialog();
  }

  openGoogleDriveDialog() {
    if (this.gdriveComponent) this.gdriveComponent.openGoogleDrivePicker();
  }

  getPrimaryOrganizationUnit = getPrimaryOrganizationUnit;

  onContactAiPageChange(event: PaginatorState): void {
    const rows = event.rows ?? this.aiPageSize;
    if (rows <= 0) {
      return;
    }
    this.aiCurrentPage.set(Math.floor((event.first ?? 0) / rows));
  }
}
