import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnChanges, OnDestroy, SimpleChanges, OnInit, output, signal, computed, Input, ViewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CachedDataService } from '@shared/services/utils';

import { TooltipModule } from 'primeng/tooltip';

import { FeedbackDialogService } from '@shared/services/ui';
import { DocumentService } from '@shared/services/api/document.service';
import { ParentEntityType } from '@shared/interfaces/types';
import { DocumentLinkModel } from '@shared/interfaces/document.interface';
import { DocumentComponent } from '@shared/components/documents/document/document.component';
import { GDriveDocumentComponent } from '@shared/components/documents/gdrive/document-gdrive.component';


//Language translation import
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@shared/services/utils';
import { Subscription } from 'rxjs/internal/Subscription';

import { DividerModule } from 'primeng/divider';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { PartnerService } from '@partnerships/partners/services/partner.service';
import { PartnerContactsComponent } from '../contacts/partner-contacts.component';
import { LinkListComponent } from '@shared/components/links/link/list/link-list.component';
import { EntityType } from '@shared/models/link.model';
import { DialogService } from 'primeng/dynamicdialog';
import { Partner, getPrimaryOrganizationUnit } from '@partnerships/partners/models/partner.model';
import { PermissionUtilityService } from '@core/services/auth';
import { AiCardBgComponent } from '@unopsitg/ux';
import { AiPanelComponent } from '@features/ai/components/ai-panel/ai-panel.component';
import { GeminiService } from '@ai/services/gemini.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PageContextService } from '@shared/services/utils';
import { PartnerEditDialogComponent } from '../edit-dialog/partner-edit-dialog.component';
import { PartnerEditDialogFooterComponent } from '../edit-dialog/footer/partner-edit-dialog-footer.component';
import { PartnerApprovalDialogComponent } from '../approval-dialog/partner-approval-dialog.component';
import { AuthService } from '@core/services/auth';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BaseEngagementListComponent } from '@shared/base-classes/base-engagement-list.component';

/**
 * @uiEntity Partner
 * @route /partnerships/partners/:id
 * @description View and edit detailed partner information including contact details, address, organizational data, and associated documents. Central place for managing all aspects of a partner organization.
 * @capabilities view_partner_details, edit_partner_info, upload_logo, manage_documents, view_contacts, create_interactions, edit_address, update_status
 * @synonyms organization_details, partner_profile, entity_view, collaborator_info
 * @mandatoryFields name, partnerType, status, partnerOfficeId
 * @help_when_stuck This page shows complete partner information. Click Edit to modify details, use tabs to navigate between sections, or click the logo area to upload a new partner logo. All fields are organized by category for easy access.
 * @common_tasks
 *   - Editing partner info: Click the Edit button and modify the form fields
 *   - Uploading logo: Click on the logo/image area to upload a new partner logo
 *   - Viewing contacts: Go to the Contacts tab to see people associated with this partner
 *   - Adding interactions: Go to Interactions tab and click 'Add Interaction'
 *   - Managing documents: Scroll down to the Documents section to upload or view files
 *   - Updating address: Edit the address fields in the Contact Information section
 * @tabs Details:/partnerships/partners/:id, Contacts:/partnerships/partners/:id/contacts, Interactions:/partnerships/partners/:id/interactions, Data:/partnerships/partners/:id/data
 */
@Component({
  selector: 'app-partner-view',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    DocumentComponent,
    GDriveDocumentComponent,
    ButtonModule,
    DialogModule,
    DividerModule,
    PaginatorModule,
    PartnerContactsComponent,
    LinkListComponent,
    TooltipModule,
    AiCardBgComponent,
    AiPanelComponent,
    RouterModule,
    ConfirmDialogModule,
    BaseEngagementListComponent,
    TagModule,
    InputTextModule,
  ],
  templateUrl: './partner-view.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, ConfirmationService],
})
export class PartnerViewComponent implements OnInit, OnChanges, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  documentService = inject(DocumentService);
  dialogService = inject(DialogService);

  cachedDataService = inject(CachedDataService);
  feedbackDialogService = inject(FeedbackDialogService);
  partnerService = inject(PartnerService);
  geminiService = inject(GeminiService);
  translateService = inject(TranslateService);
  languageService = inject(LanguageService);
  cdr = inject( ChangeDetectorRef);
  permissionService = inject(PermissionUtilityService);
  authService = inject(AuthService);
  confirmationService = inject(ConfirmationService);
  messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private pageContextService = inject(PageContextService);

  // Permission management using utility service
  private permissionUtils = this.permissionService.createInstancePermissions('Partner');
  recordPermissions = this.permissionUtils.recordPermissions;

  private langChangeSubscription: Subscription = new Subscription();
  onRecordCreationSuccess = output();

  // Input property for recordId when used in AI layout
  @Input() recordId: string = '';


  showValidationFailedError = signal<boolean>(false);
  recordData = signal<Partner>({});
  showCommentDialog = false;
  entityTypePartner = EntityType.Partner;
  infoLoading = signal<boolean>(false);

  // Computed property for Due Diligence expiry warning
  dueDiligenceExpiryWarning = computed(() => {
    const expiryDate = this.recordData().dueDiligenceExpiryDate;
    if (!expiryDate) return null;

    // Normalize today to start of day (midnight) in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Ensure expiry is a Date object and normalize to start of day
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    // Calculate 6 months from today
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    // Only show warning if expiry is within the next 6 months and not in the past
    if (expiry > sixMonthsFromNow || expiry < today) {
      return null;
    }

    // Calculate total difference in days
    const diffTime = expiry.getTime() - today.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Calculate months and remaining days
    let months = 0;
    let days = totalDays;
    
    // Count full months
    const tempDate = new Date(today);
    while (true) {
      const nextMonth = new Date(tempDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      
      // Check if adding another month would exceed the expiry date
      if (nextMonth > expiry) {
        break;
      }
      
      months++;
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
    
    // Calculate remaining days after full months
    if (months > 0) {
      const afterMonthsDate = new Date(today);
      afterMonthsDate.setMonth(afterMonthsDate.getMonth() + months);
      const remainingMs = expiry.getTime() - afterMonthsDate.getTime();
      days = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
    }

    return {
      months,
      days,
      totalDays
    };
  });

  // ViewChild reference for link list component
  @ViewChild('linkListComponent') linkListComponent!: LinkListComponent;
  
  // ViewChild reference for document component
  @ViewChild('appDocument') documentComponent!: DocumentComponent;
  
  // ViewChild reference for GDrive document component
  @ViewChild('gdriveComponent') gdriveComponent!: GDriveDocumentComponent;

  //To be handled by permissions later so that only PRM Admin has this value set to true
  showAdditionalInfo = signal<boolean>(true);

  // Expandable section signals

  // See More functionality for Partner Information
  showFullContent = signal<boolean>(false);

  // Computed values for See More functionality
  shouldShowSeeMoreButton = computed(() => {
    return this.showAdditionalInfo() && !this.showFullContent();
  });

  shouldShowSeeLessButton = computed(() => {
    return this.showAdditionalInfo() && this.showFullContent();
  });

  // AI Insights
  private static readonly AI_INSIGHTS = [
    { icon: 'pi pi-chart-line', iconBg: 'bg-red-100 text-red-600', title: 'Engagement Declining', description: 'Interaction frequency dropped 40% vs last quarter. Schedule a follow-up.', action: 'Schedule Meeting' },
    { icon: 'pi pi-heart', iconBg: 'bg-green-100 text-green-600', title: 'Relationship Strength', description: 'Strong engagement with 15 interactions this year. Recommend expanding scope.', action: 'View History' },
    { icon: 'pi pi-exclamation-circle', iconBg: 'bg-amber-100 text-amber-600', title: 'Missing Details', description: 'Partner address, category group, and focal point details are incomplete.', action: 'Edit Partner' },
    { icon: 'pi pi-dollar', iconBg: 'bg-purple-100 text-purple-600', title: 'Revenue Potential', description: 'This partner is linked to 5 active opportunities worth $2.3M total.', action: 'View Opportunities' },
    { icon: 'pi pi-copy', iconBg: 'bg-orange-100 text-orange-600', title: 'Duplicate Risk', description: 'A similar partner record exists with matching name pattern. Review.', action: 'Review Duplicates' },
    { icon: 'pi pi-shield', iconBg: 'bg-blue-100 text-blue-600', title: 'Due Diligence Expiring', description: 'Due diligence approval expires in 60 days. Initiate renewal process.', action: 'Start Renewal' },
    { icon: 'pi pi-users', iconBg: 'bg-teal-100 text-teal-600', title: 'Contact Coverage', description: '3 contacts linked but none have had interactions in 90 days.', action: 'View Contacts' },
    { icon: 'pi pi-globe', iconBg: 'bg-pink-100 text-pink-600', title: 'Geographic Expansion', description: 'Partner operates in 4 countries where UNOPS has active programs.', action: 'Explore Synergies' },
  ];

  aiInsights = PartnerViewComponent.AI_INSIGHTS;
  aiSearchQuery = signal('');
  aiCurrentPage = signal(0);
  readonly aiPageSize = 3;

  filteredAiInsights = computed(() => {
    const query = this.aiSearchQuery().toLowerCase().trim();
    if (!query) return this.aiInsights;
    return this.aiInsights.filter(i =>
      i.title.toLowerCase().includes(query) || i.description.toLowerCase().includes(query)
    );
  });

  paginatedAiInsights = computed(() => {
    const all = this.filteredAiInsights();
    const start = this.aiCurrentPage() * this.aiPageSize;
    return all.slice(start, start + this.aiPageSize);
  });

  notesText = signal('');

  // Helper method to get primary organization unit
  getPrimaryOrganizationUnit = getPrimaryOrganizationUnit;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordId']) {
      this._loadRecordDetails();
    }
  }

  ngOnDestroy(): void {
    this.pageContextService.clearComponentData();
    this.langChangeSubscription?.unsubscribe();
  }

  ngOnInit() {
    // Register component data for AI Assistant
    this.pageContextService.setComponentData(this);
    
    // Check admin role
    this.authService.isAdmin().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (isAdmin) => {
        this.isAdmin.set(isAdmin);
      },
      error: (error) => {
        console.error('Error checking admin role:', error);
        this.isAdmin.set(false);
      }
    });

    // Load initial data if recordId is already set
    if (this.recordId) {
      this._loadRecordDetails();
    }
    
    // ALWAYS subscribe to route parameter changes, regardless of initial recordId
    // Note: recordId is on the parent route, not the child route
    // So we need to subscribe to parent.paramMap, not paramMap
    const parent = this.activatedRoute.parent;
    if (parent) {
      parent.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (paramMap) => {
          const newRecordId = paramMap.get("recordId") || '';
          
          // ALWAYS reload when recordId changes
          if (newRecordId && newRecordId !== this.recordId) {
            this.recordId = newRecordId;
            this._loadRecordDetails();
          } else if (newRecordId && !this.recordId) {
            // First load when recordId is empty
            this.recordId = newRecordId;
            this._loadRecordDetails();
          }
        }
      });
    }

    this.activatedRoute.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (paramMap) => {
        if (this.recordId != '' && paramMap.get('show-contacts')?.toLowerCase() == 'true') {
          this._handleOnViewContacts();
        } else {
          this.showCommentDialog = false;
        }
      },
    });
  }

  _loadRecordDetails() {
    //fetch record details
    this.infoLoading.set(true);
    this.partnerService.getPartnerById(this.recordId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: any) => {
        this.recordData.set(data);

        // Extract permissions from the response if they exist
        if (data.permissions) {
          this.recordPermissions.set({
            entity: 'Partner',
            hasAccess: true,
            permissions: data.permissions
          });
        }

        this.infoLoading.set(false);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading partner details:', error);
        this.infoLoading.set(false);
      }
    });
  }

  handleOnCancelClick(event: MouseEvent) {
    this.router.navigate(['partners']);
  }

  // AI Panel Event Handlers
  onSummaryRefresh() {

  }

  onSummaryLoaded(data: string) {

  }

  onSummaryError(error: Error) {
    console.error('Summary error:', error);
  }

  onNewsRefresh() {

  }

  onNewsLoaded(data: string) {

  }

  onNewsError(error: Error) {
    console.error('News error:', error);
  }

  _handleOnViewContacts() {
    this.showCommentDialog = true;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        'show-contacts': true,
      },
    });
  }

  _handleOnViewContactsDaialogClose() {
    this.showCommentDialog = false;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {},
    });
  }

  get acceptedMiMIETypesForgDrive() {
    return 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet';
  }

  onFileUploaded(response: any) {
    const formData = new FormData();
    for (let file of response.files) {
      formData.append('file', file);
      formData.append('parentEntityType', ParentEntityType.Partner.toString());
      formData.append('parentEntityId', this.recordId);
      formData.append('name', file.name);
      formData.append('documentTypeId', '1');
    }

    this.documentService.uploadUnopsFiles(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: any) => {
        this.feedbackDialogService.showSuccessToast({ 
          detail: this.translateService.instant('partner.view.upload.successMessage', { fileName: response.name })
        });
      },
      error: (error) => {
        this.feedbackDialogService.showErrorDialog({ 
          detail: this.translateService.instant('partner.view.upload.errorMessage')
        });
      },
    });
  }

  onDriveFileUploaded(response: any) {
    // TODO: allow more than one file to be uploaded if multiple is set to true
    const file = response[0];
    const req: DocumentLinkModel = {
      link: file.url,
      googleId: file.id,
      name: file.name,
      type: file.mimeType,
      documentTypeId: 0,  // Default document type
      parentEntityName: 'Partner',  // Backend expects entity type name as string
      parentEntityId: parseInt(this.recordId),
    };

    this.documentService.linkUnopsFiles(req).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response: any) => {
        this.feedbackDialogService.showSuccessToast({ 
          detail: this.translateService.instant('partner.view.upload.successMessage', { fileName: response.name })
        });
      },
      error: (error) => {
        this.feedbackDialogService.showErrorDialog({ 
          detail: this.translateService.instant('partner.view.upload.errorMessage')
        });
      },
    });
  }

  onFileSelected(event: any) {

  }

  onFileRemoved(event: any) {

  }

  onFilesCleared() {

  }

  /**
   * @uiButton edit_partner
   * @description Opens the partner editing dialog with form fields for modifying partner organization information
   * @label Edit Partner
   * @icon pi pi-pencil
   * @when_to_use When partner information needs updating, correcting partner details, or adding new organizational information
   * @permissions PARTNER_UPDATE
   */
  handleEditClick() {
    // Check if user has update permission
    if (!this.permissionService.canUpdate(this.recordPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: this.translateService.instant('partner.view.error.editPermissionDenied'),
        summary: this.translateService.instant('common.error.permissionDenied')
      });
      return;
    }

    const requestingSaveSignal = signal<boolean>(false);
    const isSaving = signal<boolean>(false);
    const isLoading = signal<boolean>(false);

    const ref = this.dialogService.open(PartnerEditDialogComponent, {
      header: this.translateService.instant('partner.view.modal.editHeader'),
      width: '90vw',
      style: { maxWidth: '800px' },
      closable: true,
      templates: {
        footer: PartnerEditDialogFooterComponent
      },
      data: {
        mode: 'edit',
        record: this.recordData(),
        requestingSaveSignal,
        isSaving,
        isLoading
      }
    });

    if (!ref) {
      return;
    }

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        this._loadRecordDetails();
      }
    });
  }

  getUploadLogoUrl() {
    return this.partnerService.getUploadLogoUrl(this.recordId);
  }

  /**
   * Check if current user is admin (Partnership Global Admin)
   */
  isAdmin = signal<boolean>(false);

  /**
   * Check if current user can edit the partner
   * Rules:
   * - User must have update permissions
   * - If partner is approved, only admin users can edit
   * - If partner is not approved, regular users with permissions can edit
   */
  canEditPartner = computed(() => {
    const hasUpdatePermission = this.recordPermissions().permissions.canUpdate;
    const isApproved = this.recordData().partnerApprovalStatus === 'Approved';

    if (!hasUpdatePermission) {
      return false;
    }

    // If partner is approved, only admin can edit
    if (isApproved) {
      return this.isAdmin();
    }

    // If partner is not approved, any user with update permission can edit
    return true;
  });

  /**
   * @uiButton approve_partner
   * @description Opens approval confirmation dialog and then approval dialog for users to approve partners
   * @label Approve
   * @icon pi pi-check-circle
   * @when_to_use When partner needs to be approved and user has approval privileges
   * @permissions canApprove
   */
  handleApprovalClick() {
    // Show confirmation dialog
    this.confirmationService.confirm({
      message: this.translateService.instant('partner.view.approval.confirmMessage', { partnerName: this.recordData().name }),
      header: this.translateService.instant('partner.view.approval.confirmHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.openApprovalDialog();
      },
      reject: () => {
      }
    });
  }

  /**
   * Opens the approval dialog with approval-related fields
   */
  private openApprovalDialog() {
    const ref = this.dialogService.open(PartnerApprovalDialogComponent, {
      header: this.translateService.instant('partner.view.approval.modalHeader'),
      width: '90vw',
      style: { maxWidth: '800px' },
      closable: true,
      data: {
        partner: this.recordData()
      }
    });

    if (!ref) {
      return;
    }

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      if (result) {
        // Reload partner details to show updated approval status
        this._loadRecordDetails();
      }
    });
  }
  
  /**
 * @uiButton unapprove_partner
 * @description Shows unapproval confirmation dialog for approved partners
 * @label Unapprove
 * @icon pi pi-times
 * @when_to_use When approved partner needs to be unapproved and user has admin privileges
 * @permissions canUnapprove
 */
  handleUnapprovalClick() {
    console.log('Unapproval button clicked for partner:', this.recordData().name);
    
    const message = this.translateService.instant('partner.view.unapproval.confirmMessage', { 
      partnerName: this.recordData().name 
    });
    
    // Show confirmation dialog with HTML message
    this.confirmationService.confirm({
      message: message.replace(/\n\n/g, '<br><br>'),
      header: this.translateService.instant('partner.view.unapproval.confirmHeader'),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-warn',
      rejectButtonStyleClass: 'p-button-secondary',
      accept: () => {
        console.log('Unapproval confirmed, proceeding with unapproval');
        this.performUnapproval();
      },
      reject: () => {
        console.log('Unapproval cancelled');
      }
    });
  }

  /**
   * Performs the actual unapproval API call
   */
  private performUnapproval() {
    const requestPayload = {
      id: this.recordData().id,
      notes: `Partner unapproved via UI on ${new Date().toISOString()}`
    };

    this.partnerService.unapprovePartner(requestPayload).subscribe({
      next: (data: any) => {
        console.log('Partner unapproved successfully:', data);
        // Show success message
        this.feedbackDialogService.showSuccessToast({ 
          detail: this.translateService.instant('partner.view.unapproval.successMessage', { 
            partnerName: this.recordData().name 
          })
        });
        // Reload partner details to show updated status
        this._loadRecordDetails();
      },
      error: (error) => {
        console.error('Failed to unapprove partner:', error);
        // Show error message
        this.feedbackDialogService.showErrorToast({ 
          detail: this.translateService.instant('partner.view.unapproval.errorMessage')
        });
      }
    });
  }

  /**
   * @uiButton activate_partner
   * @description Opens activation confirmation dialog and activates the partner
   * @label Activate
   * @icon pi pi-power-off
   * @when_to_use When partner needs to be activated and user has activation privileges
   * @permissions canActivate
   */
  handleActivateClick() {
    // Check if required fields are missing before proceeding
    const partner = this.recordData();
    const missingFields = this.checkRequiredFieldsForActivation(partner);

    if (missingFields.length > 0) {
      // Open edit dialog with activation validation mode
      this.openEditDialogForActivation();
      return;
    }

    // Show confirmation dialog
    this.confirmationService.confirm({
      message: this.translateService.instant('message.confirmPartnerActivation', {
        partnerName: this.recordData().name
      }),
      header: this.translateService.instant('message.confirmActivation'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.activatePartner();
      },
      reject: () => {
        console.log('Activation cancelled');
      }
    });
  }

  /**
   * Calls the activate API endpoint
   */
  private activatePartner() {
    this.partnerService.activatePartner(this.recordId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (result) => {
        this.feedbackDialogService.showSuccessToast({
          detail: this.translateService.instant('message.partnerActivatedSuccessfully', {
            partnerName: this.recordData().name
          })
        });
        // Reload partner details to show updated status and permissions
        this._loadRecordDetails();
      },
      error: (error) => {
        console.error('Error activating partner:', error);
        this.feedbackDialogService.showErrorToast({
          detail: this.translateService.instant('message.failedToActivatePartner')
        });
      }
    });
  }

  /**
   * @uiButton close_partner
   * @description Opens close confirmation dialog and closes the partner
   * @label Close
   * @icon pi pi-times-circle
   * @when_to_use When partner needs to be closed and user has close privileges
   * @permissions canClose
   */
  handleCloseClick() {
    const message = this.translateService.instant('partner.view.close.confirmMessage', {
      partnerName: this.recordData().name
    });
    
    // Show confirmation dialog with HTML message
    this.confirmationService.confirm({
      message: message.replace(/\n\n/g, '<br><br>'),
      header: this.translateService.instant('message.confirmClose'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performClose();
      },
      reject: () => {
        console.log('Close cancelled');
      }
    });
  }

  /**
   * Performs the actual close API call
   */
  private performClose() {
    const requestPayload = {
      id: this.recordData().id,
      notes: `Partner closed via UI on ${new Date().toISOString()}`
    };

    this.partnerService.closePartner(requestPayload).subscribe({
      next: (data: any) => {
        console.log('Partner closed successfully:', data);
        // Show success message
        this.feedbackDialogService.showSuccessToast({ 
          detail: this.translateService.instant('partner.view.close.successMessage', { 
            partnerName: this.recordData().name 
          })
        });
        // Reload partner details to show updated status
        this._loadRecordDetails();
      },
      error: (error) => {
        console.error('Failed to close partner:', error);
        // Show error message
        this.feedbackDialogService.showErrorToast({ 
          detail: this.translateService.instant('partner.view.close.errorMessage')
        });
      }
    });
  }

  /**
   * @uiButton archive_partner
   * @description Opens archive confirmation dialog and archives the partner
   * @label Archive
   * @icon pi pi-archive
   * @when_to_use When partner needs to be archived and user has archive privileges
   * @permissions canArchive
   */
  handleArchiveClick() {
    const message = this.translateService.instant('partner.view.archive.confirmMessage', {
      partnerName: this.recordData().name
    });
    
    // Show confirmation dialog with HTML message
    this.confirmationService.confirm({
      message: message.replace(/\n\n/g, '<br><br>'),
      header: this.translateService.instant('message.confirmArchive'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.performArchive();
      },
      reject: () => {
        console.log('Archive cancelled');
      }
    });
  }

  /**
   * Performs the actual archive API call
   */
  private performArchive() {
    const requestPayload = {
      id: this.recordData().id,
      notes: `Partner archived via UI on ${new Date().toISOString()}`
    };

    this.partnerService.archivePartner(requestPayload).subscribe({
      next: (data: any) => {
        console.log('Partner archived successfully:', data);
        // Show success message
        this.feedbackDialogService.showSuccessToast({ 
          detail: this.translateService.instant('partner.view.archive.successMessage', { 
            partnerName: this.recordData().name 
          })
        });
        // Reload partner details to show updated status
        this._loadRecordDetails();
      },
      error: (error) => {
        console.error('Failed to archive partner:', error);
        // Show error message
        this.feedbackDialogService.showErrorToast({ 
          detail: this.translateService.instant('partner.view.archive.errorMessage')
        });
      }
    });
  }

  /*selectOrganizationalStructure(type: 'summary' | 'risk' | 'news') {


    const ref = this.dialogService.open(OrgStructureDialogComponent, {
      header: 'Select Organizational Structure',
      width: '95vw',
      height: '95vh',
      style: {
        maxWidth: '1400px',
        maxHeight: '900px',
        backgroundColor: 'white',
        padding: '0'
      },
      contentStyle: {
        padding: '0',
        overflow: 'hidden',
        backgroundColor: 'white'
      },
      dismissableMask: true,
      closeOnEscape: true,
      closable: true,
      data: {
        type: type,
        partnerId: this.recordId
      }
    });

    ref.onClose.subscribe((result) => {
      if (result) {

        // Refresh the corresponding panel based on type
        switch (type) {
          case 'summary':
            this.refreshSummaryOfInteractions();
            break;
          case 'risk':
            this.refreshRiskProfile();
            break;
          case 'news':
            this.refreshPartnerNews();
            break;
        }
      }
    });
  }*/

  toggleFullContent() {
    this.showFullContent.set(!this.showFullContent());
  }

  /**
   * Opens the add link dialog by calling the link list component's openEditDialog method
   */
  openAddLinkDialog() {
    if (this.linkListComponent) {
      this.linkListComponent.openEditDialog();
    }
  }

  /**
   * Opens the upload document dialog by calling the document component's openUploadDialog method
   */
  openUploadDialog() {
    if (this.documentComponent) {
      this.documentComponent.openUploadDialog();
    }
  }

  /**
   * Opens the Google Drive picker by calling the GDrive component's openGoogleDrivePicker method
   */
  openGoogleDriveDialog() {
    if (this.gdriveComponent) {
      this.gdriveComponent.openGoogleDrivePicker();
    }
  }



  // Note: To document buttons/actions, add @uiButton JSDoc comments above existing methods
  // Example for documenting existing methods:
  // /**
  //  * @uiButton edit_partner
  //  * @description Switches to edit mode for partner information
  //  * @label Edit Partner
  //  * @icon pi pi-pencil
  //  * @when_to_use When partner information needs updating, correcting details, adding new information
  //  * @permissions PARTNER_UPDATE
  //  */
  // existingEditMethod() { ... }

  /**
   * Check if required fields for activation are missing
   */
  private checkRequiredFieldsForActivation(partner: any): string[] {
    const missingFields: string[] = [];

    if (!partner.name) {
      missingFields.push('name');
    }
    if (!partner.partnerShortDescription) {
      missingFields.push('partnerShortDescription');
    }
    if (!partner.partnerCategoryId) {
      missingFields.push('partnerCategoryId');
    }
    if (!partner.partnerGroupId) {
      missingFields.push('partnerGroupId');
    }
    if (!partner.liaisonOfficeId) {
      missingFields.push('liaisonOfficeId');
    }

    return missingFields;
  }

  /**
   * Opens the edit dialog in activation validation mode
   */
  private openEditDialogForActivation() {
    const requestingSaveSignal = signal<boolean>(false);
    const isSaving = signal<boolean>(false);
    const isLoading = signal<boolean>(false);

    const ref = this.dialogService.open(PartnerEditDialogComponent, {
      header: this.translateService.instant('title.partnerTitles.completeRequiredFields'),
      width: '90vw',
      style: { maxWidth: '800px' },
      closable: true,
      templates: {
        footer: PartnerEditDialogFooterComponent
      },
      data: {
        mode: 'edit',
        record: this.recordData(),
        validationMode: 'activate',
        requestingSaveSignal,
        isSaving,
        isLoading
      }
    });

    if (!ref) {
      return;
    }

    ref.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result: any) => {
      if (result === "saved" || (result && result.id)) {
        // Partner was updated, refresh the data and try activation again
        this._loadRecordDetails();
      }
    });
  }


  
  /**
   * Convert recordId string to number for use with BaseEngagementListComponent
   */
  get partnerIdAsNumber(): number | undefined {
    return this.recordId ? parseInt(this.recordId, 10) : undefined;
  }

  /**
   * Format date for audit information display
   */
  formatDate(date: Date | string | null | undefined): string {
    if (!date) return 'Not available';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
  }

  onAiInsightsPageChange(event: PaginatorState): void {
    const rows = event.rows ?? this.aiPageSize;
    if (rows <= 0) {
      return;
    }
    this.aiCurrentPage.set(Math.floor((event.first ?? 0) / rows));
  }

  private static readonly STATUS_CLASSES: Record<string, string> = {
    'Active': 'tag-status-active',
    'Inactive': 'tag-status-closed',
    'Closed': 'tag-status-closed',
    'Draft': 'tag-status-draft',
    'Archived': 'tag-status-archived',
  };

  private static readonly APPROVAL_CLASSES: Record<string, string> = {
    Approved: 'tag-approval-approved',
    NotApproved: 'tag-approval-not-approved',
    'Not Approved': 'tag-approval-not-approved',
    Pending: 'tag-status-draft',
    Rejected: 'tag-approval-not-approved',
  };

  getStatusClass(status: string): string {
    return PartnerViewComponent.STATUS_CLASSES[status] ?? 'tag-status-draft';
  }

  getApprovalClass(status: string): string {
    return PartnerViewComponent.APPROVAL_CLASSES[status] ?? 'tag-status-draft';
  }


  /**
   * @uiButton delete_partner
   * @description Permanently deletes a partner record after confirmation dialog
   * @label Delete
   * @icon pi pi-trash
   * @when_to_use When a partner was recorded incorrectly or is no longer relevant (use with caution)
   * @permissions PARTNER_DELETE
   */
  deletePartner(): void {
    // Check if user has delete permission
    if (!this.permissionService.canDelete(this.recordPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: this.translateService.instant('partner.detail.error.deletePermissionDenied'),
        summary: this.translateService.instant('common.error.permissionDenied')
      });
      return;
    }

    this.confirmationService.confirm({
      message: this.translateService.instant('partner.detail.confirmation.deleteMessage'),
      header: this.translateService.instant('partner.detail.confirmation.deleteHeader'),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.partnerService.deletePartnerById(this.recordId).subscribe({
          next: () => {
            this.feedbackDialogService.showSuccessToast({
              detail: this.translateService.instant('partner.detail.success.deleted')
            });
            this.router.navigate(['/partnerships/partners']);
          },
          error: (error) => {
            console.error('Error deleting partner:', error);
            this.feedbackDialogService.showErrorToast({
              detail: this.translateService.instant('partner.detail.error.deleteFailed')
            });
          }
        });
      }
    });
  }

}
