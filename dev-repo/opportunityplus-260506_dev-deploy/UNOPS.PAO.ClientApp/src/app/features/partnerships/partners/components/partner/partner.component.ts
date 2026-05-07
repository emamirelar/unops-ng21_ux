import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ElementRef, inject, OnDestroy, OnInit, signal, computed, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '@shared/services/utils';
import { Subscription } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PartnerNewComponent } from './new/partner-new.component';
import { Partner } from '../../models/partner.model';
import { PartnerEditDialogFooterComponent } from './edit-dialog/footer/partner-edit-dialog-footer.component';
import { PartnerEditDialogComponent } from './edit-dialog/partner-edit-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ImportDialogService } from '@features/import-export/components/import/dialog/import-dialog.service';
import { PermissionUtilityService } from '@core/services/auth';
import { CachedDataService } from '@shared/services/utils';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { PageContextService } from '@shared/services/utils';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

const STATUS_CLASSES: Record<string, string> = {
  Active: 'tag-status-active',
  Draft: 'tag-status-draft',
  Closed: 'tag-status-closed',
  Archived: 'tag-status-archived'
};

const APPROVAL_CLASSES: Record<string, string> = {
  Approved: 'tag-approval-approved',
  NotApproved: 'tag-approval-not-approved'
};

const FALLBACK_CLASS = 'tag-status-archived';

const COUNTRY_TO_FLAG: Record<string, string> = {
  'afghanistan': 'af', 'albania': 'al', 'algeria': 'dz', 'angola': 'ao', 'argentina': 'ar',
  'armenia': 'am', 'australia': 'au', 'austria': 'at', 'azerbaijan': 'az', 'bahrain': 'bh',
  'bangladesh': 'bd', 'belarus': 'by', 'belgium': 'be', 'benin': 'bj', 'bhutan': 'bt',
  'bolivia': 'bo', 'bosnia and herzegovina': 'ba', 'botswana': 'bw', 'brazil': 'br',
  'burkina faso': 'bf', 'burundi': 'bi', 'cambodia': 'kh', 'cameroon': 'cm', 'canada': 'ca',
  'central african republic': 'cf', 'chad': 'td', 'chile': 'cl', 'china': 'cn', 'colombia': 'co',
  'comoros': 'km', 'congo': 'cg', 'costa rica': 'cr', 'croatia': 'hr', 'cuba': 'cu',
  'cyprus': 'cy', 'czech republic': 'cz', 'czechia': 'cz',
  "côte d'ivoire": 'ci', 'ivory coast': 'ci', "cote d'ivoire": 'ci',
  'democratic republic of the congo': 'cd', 'denmark': 'dk', 'djibouti': 'dj',
  'dominican republic': 'do', 'ecuador': 'ec', 'egypt': 'eg', 'el salvador': 'sv',
  'eritrea': 'er', 'estonia': 'ee', 'eswatini': 'sz', 'ethiopia': 'et', 'fiji': 'fj',
  'finland': 'fi', 'france': 'fr', 'gabon': 'ga', 'gambia': 'gm', 'georgia': 'ge',
  'germany': 'de', 'ghana': 'gh', 'greece': 'gr', 'guatemala': 'gt', 'guinea': 'gn',
  'guinea-bissau': 'gw', 'haiti': 'ht', 'honduras': 'hn', 'hungary': 'hu', 'india': 'in',
  'indonesia': 'id', 'iran': 'ir', 'iraq': 'iq', 'ireland': 'ie', 'israel': 'il',
  'italy': 'it', 'jamaica': 'jm', 'japan': 'jp', 'jordan': 'jo', 'kazakhstan': 'kz',
  'kenya': 'ke', 'kosovo': 'xk', 'kuwait': 'kw', 'kyrgyzstan': 'kg', 'laos': 'la',
  'latvia': 'lv', 'lebanon': 'lb', 'lesotho': 'ls', 'liberia': 'lr', 'libya': 'ly',
  'lithuania': 'lt', 'luxembourg': 'lu', 'madagascar': 'mg', 'malawi': 'mw', 'malaysia': 'my',
  'mali': 'ml', 'mauritania': 'mr', 'mauritius': 'mu', 'mexico': 'mx', 'moldova': 'md',
  'mongolia': 'mn', 'montenegro': 'me', 'morocco': 'ma', 'mozambique': 'mz', 'myanmar': 'mm',
  'namibia': 'na', 'nepal': 'np', 'netherlands': 'nl', 'new zealand': 'nz', 'nicaragua': 'ni',
  'niger': 'ne', 'nigeria': 'ng', 'north korea': 'kp', 'north macedonia': 'mk', 'norway': 'no',
  'oman': 'om', 'pakistan': 'pk', 'palestine': 'ps', 'panama': 'pa', 'papua new guinea': 'pg',
  'paraguay': 'py', 'peru': 'pe', 'philippines': 'ph', 'poland': 'pl', 'portugal': 'pt',
  'qatar': 'qa', 'romania': 'ro', 'russia': 'ru', 'rwanda': 'rw', 'saudi arabia': 'sa',
  'senegal': 'sn', 'serbia': 'rs', 'sierra leone': 'sl', 'singapore': 'sg', 'slovakia': 'sk',
  'slovenia': 'si', 'somalia': 'so', 'south africa': 'za', 'south korea': 'kr',
  'south sudan': 'ss', 'spain': 'es', 'sri lanka': 'lk', 'sudan': 'sd', 'suriname': 'sr',
  'sweden': 'se', 'switzerland': 'ch', 'syria': 'sy', 'tajikistan': 'tj', 'tanzania': 'tz',
  'thailand': 'th', 'timor-leste': 'tl', 'togo': 'tg', 'trinidad and tobago': 'tt',
  'tunisia': 'tn', 'turkey': 'tr', 'turkmenistan': 'tm', 'uganda': 'ug', 'ukraine': 'ua',
  'united arab emirates': 'ae', 'united kingdom': 'gb', 'united states': 'us',
  'united states of america': 'us', 'uruguay': 'uy', 'uzbekistan': 'uz', 'venezuela': 've',
  'vietnam': 'vn', 'yemen': 'ye', 'zambia': 'zm', 'zimbabwe': 'zw',
  'united nations': 'un',
};

interface FilterTag {
  group: 'status' | 'category';
  label: string;
  value: string;
}


/**
 * @uiEntity Partner
 * @route /partnerships/partners
 * @description Browse and manage partner organizations with comprehensive search, filtering, and CRUD operations. Central hub for all partner-related activities.
 * @capabilities search_partners, filter_partners, create_partner, edit_partner, delete_partner, export_partners, import_partners, bulk_operations
 * @synonyms organization, collaborator, entity, associate, vendor, supplier, contractor
 * @mandatoryFields name, partnerType, status, partnerOfficeId
 * @help_when_stuck Use the search bar to find specific partners by name, type, or location. Click the + button to create new partners if you have permissions. Use filters to narrow down results by partner type, status, or organizational unit.
 * @common_tasks
 *   - Finding a partner: Use the global search bar or entity-specific filters
 *   - Creating a partner: Click 'Create Partner' button (requires PARTNER_CREATE permission)
 *   - Editing a partner: Click on any partner row to open details, then click Edit
 *   - Filtering partners: Use the advanced search and filter options in the left panel
 *   - Exporting data: Use the Export button to download partner lists in Excel format
 *   - Importing partners: Use the Import button to bulk upload partner data
 * @tabs Details:/partnerships/partners/:id, Contacts:/partnerships/partners/:id/contacts, Interactions:/partnerships/partners/:id/interactions, Data:/partnerships/partners/:id/data
 */
@Component({
  selector: 'app-partner',
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    PartnerNewComponent,
    TranslateModule,
    MenuModule,
    DataViewModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectButtonModule,
    SkeletonModule,
  ],
  providers: [DialogService]
})
export class PartnerComponent implements AfterViewInit, OnDestroy, OnInit {
  private langChangeSubscription: Subscription = new Subscription;
  private destroyRef = inject(DestroyRef);
  private http = inject(HttpClient);
  @ViewChild('loadMoreSentinel') private loadMoreSentinel?: ElementRef<HTMLDivElement>;

  /** Backend page size (must match server default expectations). */
  private readonly PAGE_SIZE = 20;
  private pageIndex = signal(1);
  /** Total partner count from the API (all pages), not affected by client-side filters. */
  serverTotalCount = signal(0);
  isLoadingMore = signal(false);
  readonly hasMorePartners = computed(
    () => this.partners().length < this.serverTotalCount() && this.serverTotalCount() > 0
  );

  private intersectionObserver?: IntersectionObserver;
  private lastLoadMoreAt = 0;
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  dialogService = inject(DialogService);
  importDialogService = inject(ImportDialogService);
  permissionUtilityService = inject(PermissionUtilityService);
  cachedDataService = inject(CachedDataService);
  translateService = inject(TranslateService);
  private pageContextService = inject(PageContextService);

  newPartnerData = signal<Partner|null>(null);

  // Permission management using utility service
  private permissionUtils = this.permissionUtilityService.createEntityPermissions('Partner');
  entityPermissions = this.permissionUtils.entityPermissions;
  permissionsLoading = this.permissionUtils.permissionsLoading;

  // DataView state
  partners = signal<Partner[]>([]);
  isLoading = signal(true);
  layout: 'list' | 'grid' = 'list';
  layoutOptions = ['list', 'grid'];

  // Search and filter state
  searchQuery = signal('');
  activeStatusFilters = signal<Set<string>>(new Set());
  activeCategoryFilters = signal<Set<string>>(new Set());

  filterTags = computed<FilterTag[]>(() => {
    const partners = this.partners();
    const statuses = [...new Set(partners.map(p => p.status).filter((s): s is string => !!s))];
    const categories = [...new Set(partners.map(p => p.partnerCategoryName).filter((c): c is string => !!c))];
    return [
      ...statuses.map(s => ({ group: 'status' as const, label: s, value: s })),
      ...categories.map(c => ({ group: 'category' as const, label: c, value: c }))
    ];
  });

  filteredPartners = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const statusFilters = this.activeStatusFilters();
    const categoryFilters = this.activeCategoryFilters();

    return this.partners().filter(p => {
      if (query) {
        const searchable = [p.name, p.shortName, p.address1Country, p.address1City, p.partnerCategoryName, p.partnerFocalPointName, p.liaisonOfficeName]
          .filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      if (statusFilters.size > 0 && (!p.status || !statusFilters.has(p.status))) return false;
      if (categoryFilters.size > 0 && (!p.partnerCategoryName || !categoryFilters.has(p.partnerCategoryName))) return false;
      return true;
    });
  });

  activeCount = computed(() => this.filteredPartners().filter(p => p.status === 'Active').length);
  keyGlobalCount = computed(() => this.filteredPartners().filter(p => p.keyGlobalPartner).length);
  /** Rows matching current client-side search/filters (subset of loaded pages). */
  filteredPartnersCount = computed(() => this.filteredPartners().length);
  hasActiveFilters = computed(() =>
    this.searchQuery().length > 0 ||
    this.activeStatusFilters().size > 0 ||
    this.activeCategoryFilters().size > 0
  );

  constructor(private languageService: LanguageService, private cdr: ChangeDetectorRef) {
    this.setNewPartnerFromAIAssistant();

    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateDynamicTranslations();
    });
  }

  ngOnInit() {
    this.pageContextService.setComponentData(this);

    this.permissionUtils.loadPermissions(this.router, this.cdr);
    this.loadPartners(false);

    window.addEventListener('refresh-listview', this.refreshPartnerCacheHandler);

    this.activatedRoute.queryParams
      .subscribe(params => {
        if (params['openNewDialog'] === 'true') {
          const state = history.state;
          const emptyPartner: Partner = {};
          this.openPartnerEditDialog(state?.data || emptyPartner);
        }
      });
  }

  private setNewPartnerFromAIAssistant() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['openNewDialog'] === 'true') {
        const state = history.state;
        if (state?.data) {
          this.newPartnerData.set(state.data);
        }
        this.removeOpenNewDialogFromUrl();
      }
    });
  }

  private removeOpenNewDialogFromUrl() {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {openNewDialog: null},
      queryParamsHandling: 'merge'
    });
  }

  ngAfterViewInit(): void {
    this.scheduleObserveLoadMoreSentinel();
  }

  /**
   * Loads partner pages from the API. When append is false, resets to page 1 and replaces the list.
   */
  private loadPartners(append: boolean): void {
    if (!append) {
      this.isLoading.set(true);
      this.pageIndex.set(1);
    } else {
      this.isLoadingMore.set(true);
    }

    const params = new HttpParams()
      .set('pageIndex', this.pageIndex().toString())
      .set('pageSize', String(this.PAGE_SIZE))
      .set('orderBy', 'Name')
      .set('ascending', 'true')
      .set('filterActive', 'true');

    this.http
      .get<{ records?: Partner[]; totalCount?: number } | Partner[]>('/api/partner', { params })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          let records: Partner[] = [];
          let total = 0;
          if (Array.isArray(data)) {
            records = data;
            total = data.length;
          } else if (data?.records && Array.isArray(data.records)) {
            records = data.records;
            total = data.totalCount ?? data.records.length;
          }

          if (append) {
            if (records.length === 0) {
              this.pageIndex.update(p => Math.max(1, p - 1));
              this.isLoadingMore.set(false);
              this.cdr.detectChanges();
              this.scheduleObserveLoadMoreSentinel();
              this.cdr.markForCheck();
              return;
            }
            this.partners.update(current => {
              const existingIds = new Set(
                current.map(p => p.id).filter((id): id is string => id != null && id !== '')
              );
              const merged = [...current];
              for (const r of records) {
                const rid = r.id;
                if (rid != null && rid !== '' && existingIds.has(rid)) {
                  continue;
                }
                if (rid != null && rid !== '') {
                  existingIds.add(rid);
                }
                merged.push(r);
              }
              return merged;
            });
            this.cdr.detectChanges();
          } else {
            this.partners.set(records);
          }
          this.serverTotalCount.set(total);
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
          // Ensure #loadMoreSentinel exists in the DOM before observing (OnPush + nested *ngIf).
          this.cdr.detectChanges();
          this.scheduleObserveLoadMoreSentinel();
          this.cdr.markForCheck();
        },
        error: () => {
          if (append) {
            this.pageIndex.update(p => Math.max(1, p - 1));
          }
          this.isLoading.set(false);
          this.isLoadingMore.set(false);
          this.cdr.markForCheck();
        }
      });
  }

  loadMore(): void {
    if (!this.hasMorePartners() || this.isLoadingMore() || this.isLoading()) {
      return;
    }
    const now = Date.now();
    if (now - this.lastLoadMoreAt < 400) {
      return;
    }
    this.lastLoadMoreAt = now;
    this.pageIndex.update(p => p + 1);
    this.loadPartners(true);
  }

  private scheduleObserveLoadMoreSentinel(): void {
    // Defer past Angular/Cascade so *ngIf renders the sentinel and @ViewChild is populated.
    setTimeout(() => this.observeLoadMoreSentinel(), 0);
  }

  /**
   * Nearest scrollable ancestor (app shell uses layout-content-wrapper, not window).
   * IntersectionObserver must use this as `root` so scroll events trigger intersection updates.
   */
  private getOverflowScrollParent(el: HTMLElement | null): Element | null {
    if (!el) return null;
    let parent = el.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = getComputedStyle(parent);
      const oy = style.overflowY;
      if (
        (oy === 'auto' || oy === 'scroll' || oy === 'overlay') &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  private observeLoadMoreSentinel(): void {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;

    const el = this.loadMoreSentinel?.nativeElement;
    if (!el || !this.hasMorePartners() || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const scrollRoot = this.getOverflowScrollParent(el);
    const rootOptions: IntersectionObserverInit = {
      root: scrollRoot,
      rootMargin: '800px',
      threshold: 0
    };

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (
            entry.isIntersecting &&
            this.hasMorePartners() &&
            !this.isLoadingMore() &&
            !this.isLoading()
          ) {
            this.loadMore();
          }
        }
      },
      rootOptions
    );
    this.intersectionObserver.observe(el);
  }

  /**
   * Resets accumulated pages and reloads from the server (page 1). Used after global refresh,
   * record creation, and when the user clears all filters.
   */
  private reloadPartnerListFromStart(): void {
    this.teardownLoadMoreObserver();
    this.partners.set([]);
    this.serverTotalCount.set(0);
    this.loadPartners(false);
  }

  private teardownLoadMoreObserver(): void {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;
  }

  isTagActive(tag: FilterTag): boolean {
    const set = tag.group === 'status' ? this.activeStatusFilters() : this.activeCategoryFilters();
    return set.has(tag.value);
  }

  toggleTag(tag: FilterTag) {
    const signalRef = tag.group === 'status' ? this.activeStatusFilters : this.activeCategoryFilters;
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
    this.activeCategoryFilters.set(new Set());
    this.reloadPartnerListFromStart();
  }

  /**
   * Updates the search query. Clearing the search reloads the list from the server so pagination resets;
   * non-empty search filters the already-loaded pages on the client.
   */
  onSearchInput(value: string): void {
    this.searchQuery.set(value);
    if (value.trim() === '') {
      this.reloadPartnerListFromStart();
    }
  }

  getStatusClass(status: string): string {
    return STATUS_CLASSES[status] ?? FALLBACK_CLASS;
  }

  getApprovalClass(status: string): string {
    return APPROVAL_CLASSES[status] ?? FALLBACK_CLASS;
  }

  getFilterTagClass(tag: FilterTag): string {
    const base = 'cursor-pointer transition-colors px-2 py-1';
    if (tag.group === 'status') {
      return `${base} ${this.getStatusClass(tag.value)}`;
    }
    return base;
  }

  getApprovalLabel(status: string): string {
    const keys: Record<string, string> = {
      Approved: 'enums.partnerApprovalStatus.approved',
      NotApproved: 'enums.partnerApprovalStatus.notApproved'
    };
    const key = keys[status];
    return key ? this.translateService.instant(key) : status;
  }

  getFlagCode(partner: Partner): string {
    const country = partner.address1Country?.trim().toLowerCase();
    if (!country) return 'globe';
    return COUNTRY_TO_FLAG[country] ?? 'globe';
  }

  private refreshPartnerCacheHandler = () => {
    this.cachedDataService.refreshPartners();
    this.reloadPartnerListFromStart();
  };

  private updateDynamicTranslations() {
    // Trigger change detection to update computed values that use translations
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    // Clear component data for AI Assistant
    this.pageContextService.clearComponentData();

    this.teardownLoadMoreObserver();

    this.langChangeSubscription?.unsubscribe();
    // Clean up event listener
    window.removeEventListener('refresh-listview', this.refreshPartnerCacheHandler);
  }

  _handleOnRecordCreation(newRecordData: any) {
    if (newRecordData && newRecordData.id !== undefined && newRecordData.id !== null) {
      this.cachedDataService.refreshPartners();
      this.reloadPartnerListFromStart();
      this.router.navigate(['partnerships/partners', newRecordData.id.toString()]);
    }
  }

  /**
   * @uiButton create_partner,edit_partner
   * @description Opens the partner creation or editing dialog with comprehensive form fields for managing partner organization information
   * @label New Partner | Edit Partner
   * @icon pi pi-plus | pi pi-pencil
   * @when_to_use When creating a new partner organization or editing existing partner details, including organizational information, contacts, and business relationships
   * @permissions PARTNER_CREATE, PARTNER_UPDATE
   */
  openPartnerEditDialog(partnerData: Partner = {}) {
    const ref = this.dialogService.open(PartnerEditDialogComponent, {
      header: partnerData.id ? 
        this.translateService.instant('dialog.header.editPartner') : 
        this.translateService.instant('dialog.header.newPartner'),
      width: '40vw',
      breakpoints: { '960px': '95vw' },
      closable: true,
      templates: {
        footer: PartnerEditDialogFooterComponent
      },
      data: {
        mode: partnerData.id ? 'edit' : 'new',
        record: partnerData,
        requestingSaveSignal: signal<boolean>(false)
      }
    });

    if (!ref) {
      return;
    }

    const refSub = ref.onClose.subscribe((result: any) => {
      if (result) {
        this._handleOnRecordCreation(result);
      }
      refSub.unsubscribe();
    });
  }

  // Import menu items - computed to support language changes
  importMenuItems = computed<MenuItem[]>(() => [
    {
      label: this.translateService.instant('importMenu.selectFromGoogleDrive'),
      icon: 'pi pi-google',
      command: () => this.openGooglePickerImport(),
      title: this.translateService.instant('importMenu.googleDriveTooltip')
    },
    {
      label: this.translateService.instant('importMenu.manualEntry'),
      icon: 'pi pi-link',
      command: () => this.openManualEntryImport(),
      title: this.translateService.instant('importMenu.manualEntryTooltip')
    }
  ]);

  /**
   * @uiButton import_partners
   * @description Opens the import dialog to bulk import partner organizations from Google Sheets or CSV files
   * @label Import Partners
   * @icon pi pi-file-import
   * @when_to_use When you need to add multiple partner organizations at once from external sources, ideal for bulk data migration or initial system setup
   * @permissions PARTNER_CREATE
   */
  openImportDialog() {
    // This method now shows the import menu instead of directly opening the picker
    // The actual menu is handled in the template via p-menu
  }

  /**
   * Open Google Picker for import (original flow)
   */
  openGooglePickerImport() {
    // Use the Google Sheet picker directly which will show loading indicators
    this.importDialogService.openGoogleSheetPicker('partner');
  }

  /**
   * Open manual entry dialog for import
   */
  openManualEntryImport() {
    this.importDialogService.openManualEntryDialog('partner');
  }

}
