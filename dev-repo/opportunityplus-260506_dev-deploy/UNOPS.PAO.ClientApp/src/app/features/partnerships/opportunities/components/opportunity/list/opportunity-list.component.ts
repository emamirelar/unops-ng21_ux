/**
 * @fileoverview All Opportunities page — DataView layout aligned with All Partners
 * @author UNOPS Opportunity+ System Development Team
 */
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';

import { OpportunityService } from '../../../services/opportunity.service';
import { FeedbackDialogService } from '@shared/services/ui';
import { PermissionUtilityService } from '@core/services/auth';
import { PageContextService } from '@shared/services/utils';
import { CreateOpportunityFromInteractionsDialogComponent } from '@partnerships/interactions/components/dialogs/create-opportunity-from-interactions-dialog.component';
import { CreateOpportunityFromInteractionsConfig } from '@partnerships/interactions/models/interaction-selection.model';
import { ListviewExportService } from '@features/list-view/components/listview/listview-export.service';
import { SearchParams } from '@features/list-view/components/listview/listview.model';

const STATUS_CLASSES: Record<string, string> = {
  Active:
    '!bg-babygreen-100 !text-babygreen-900 dark:!bg-babygreen-900 dark:!text-babygreen-300',
  Draft: '!bg-yellow-100 !text-yellow-900 dark:!bg-yellow-900 dark:!text-yellow-300',
  Closed: '!bg-deepsea-100 !text-deepsea-500 dark:!bg-deepsea-800 dark:!text-deepsea-100',
  Archived: '!bg-gray-100 !text-gray-700 dark:!bg-gray-900 dark:!text-gray-300',
};

const FALLBACK_CLASS = '!bg-gray-100 !text-gray-700 dark:!bg-gray-900 dark:!text-gray-300';

/** Must stay within BaseController.ValidatePaginationParameters maxPageSize */
const LIST_PAGE_SIZE = 2000;

/** Lightweight row shape from GET /api/opportunity (OpportunityListModel) */
interface OpportunityListItem {
  id: number;
  name: string;
  descriptionPreview?: string | null;
  partnerReference?: string | null;
  status?: string | null;
  stage?: string | null;
  responsibleOrgUnitName?: string | null;
  proposedInitiativeTypeName?: string | null;
  initiativeBudgetUSD?: number | null;
  targetSigningDate?: string | null;
  lastModifiedDate?: string | null;
  opportunityThumbnail?: string | null;
  tags?: Array<{ tag: string; color: string }>;
}

interface FilterTag {
  group: 'status' | 'stage';
  label: string;
  value: string;
}

/**
 * @uiEntity Opportunity
 * @route /partnerships/opportunities
 * @description Browse and manage funding and partnership opportunities.
 */
@Component({
  selector: 'app-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  styleUrl: './opportunity-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RouterModule,
    TranslateModule,
    CreateOpportunityFromInteractionsDialogComponent,
    DataViewModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    SelectButtonModule,
    SkeletonModule,
  ],
})
export class OpportunityListComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  readonly router = inject(Router);
  readonly opportunityService = inject(OpportunityService);
  private readonly feedbackDialogService = inject(FeedbackDialogService);
  private readonly permissionUtilityService = inject(PermissionUtilityService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly pageContextService = inject(PageContextService);
  private readonly listviewExportService = inject(ListviewExportService);

  private readonly permissionUtils =
    this.permissionUtilityService.createEntityPermissions('Opportunity');
  readonly entityPermissions = this.permissionUtils.entityPermissions;
  readonly permissionsLoading = this.permissionUtils.permissionsLoading;

  readonly listPageSize = LIST_PAGE_SIZE;

  readonly opportunities = signal<OpportunityListItem[]>([]);
  readonly isLoading = signal(true);
  /** Total on server for current filter (may exceed what we loaded). */
  readonly serverTotalCount = signal(0);

  layout: 'list' | 'grid' = 'list';
  readonly layoutOptions = ['list', 'grid'];

  readonly searchQuery = signal('');
  readonly activeStatusFilters = signal<Set<string>>(new Set());
  readonly activeStageFilters = signal<Set<string>>(new Set());

  readonly filterTags = computed<FilterTag[]>(() => {
    const rows = this.opportunities();
    const statuses = [...new Set(rows.map((o) => o.status).filter((s): s is string => !!s))];
    const stages = [...new Set(rows.map((o) => o.stage).filter((s): s is string => !!s))];
    return [
      ...statuses.map((s) => ({ group: 'status' as const, label: s, value: s })),
      ...stages.map((s) => ({ group: 'stage' as const, label: s, value: s })),
    ];
  });

  readonly filteredOpportunities = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const statusFilters = this.activeStatusFilters();
    const stageFilters = this.activeStageFilters();

    return this.opportunities().filter((o) => {
      if (query) {
        const searchable = [
          o.name,
          o.descriptionPreview,
          o.partnerReference,
          o.status,
          o.stage,
          o.responsibleOrgUnitName,
          o.proposedInitiativeTypeName,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      if (statusFilters.size > 0 && (!o.status || !statusFilters.has(o.status))) return false;
      if (stageFilters.size > 0 && (!o.stage || !stageFilters.has(o.stage))) return false;
      return true;
    });
  });

  readonly activeCount = computed(
    () => this.filteredOpportunities().filter((o) => o.status === 'Active').length,
  );
  readonly draftCount = computed(
    () => this.filteredOpportunities().filter((o) => o.status === 'Draft').length,
  );
  readonly totalCount = computed(() => this.filteredOpportunities().length);
  readonly hasActiveFilters = computed(
    () =>
      this.searchQuery().length > 0 ||
      this.activeStatusFilters().size > 0 ||
      this.activeStageFilters().size > 0,
  );

  readonly showCreateDialog = signal(false);

  readonly dialogConfig = computed<CreateOpportunityFromInteractionsConfig>(() => ({
    partnerId: 0,
    partnerName: '',
    mode: 'list-view',
    preSelectedInteractionIds: [],
  }));

  private readonly refreshHandler = () => {
    this.loadOpportunities();
  };

  ngOnInit(): void {
    this.pageContextService.setComponentData(this);
    this.permissionUtils.loadPermissions(this.router, this.cdr);
    this.loadOpportunities();
    window.addEventListener('refresh-listview', this.refreshHandler);
  }

  ngOnDestroy(): void {
    this.pageContextService.clearComponentData();
    window.removeEventListener('refresh-listview', this.refreshHandler);
  }

  loadOpportunities(): void {
    this.isLoading.set(true);
    const params = new HttpParams()
      .set('pageIndex', '1')
      .set('pageSize', String(LIST_PAGE_SIZE))
      .set('orderBy', 'lastModifiedDate')
      .set('ascending', 'false')
      .set('filterActive', 'true');

    this.http
      .get<{ records?: OpportunityListItem[]; totalCount?: number }>(
        this.opportunityService.getUrl(),
        { params },
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          const records = data?.records ?? [];
          this.opportunities.set(records);
          this.serverTotalCount.set(data?.totalCount ?? records.length);
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
        error: () => {
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
      });
  }

  isTagActive(tag: FilterTag): boolean {
    const set =
      tag.group === 'status' ? this.activeStatusFilters() : this.activeStageFilters();
    return set.has(tag.value);
  }

  toggleTag(tag: FilterTag): void {
    const signalRef =
      tag.group === 'status' ? this.activeStatusFilters : this.activeStageFilters;
    const current = signalRef();
    const next = new Set(current);
    if (next.has(tag.value)) next.delete(tag.value);
    else next.add(tag.value);
    signalRef.set(next);
  }

  clearFilters(): void {
    this.searchQuery.set('');
    this.activeStatusFilters.set(new Set());
    this.activeStageFilters.set(new Set());
  }

  getStatusClass(status: string): string {
    return STATUS_CLASSES[status] ?? FALLBACK_CLASS;
  }

  getThumbnailSrc(item: OpportunityListItem): string | null {
    const raw = item.opportunityThumbnail?.trim();
    if (!raw) return null;
    if (raw.startsWith('http') || raw.startsWith('data:')) return raw;
    return `data:image/png;base64,${raw}`;
  }

  openOpportunityEditDialog(): void {
    if (!this.permissionUtilityService.canCreate(this.entityPermissions())) {
      this.feedbackDialogService.showErrorToast({
        detail: 'message.noPermissionToCreate',
        summary: 'message.permissionDenied',
      });
      return;
    }
    this.showCreateDialog.set(true);
  }

  handleOpportunityCreated(opportunity: { id?: number } | null): void {
    this.showCreateDialog.set(false);
    this.loadOpportunities();
    if (opportunity?.id) {
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['/partnerships/opportunities', opportunity.id], {
          queryParams: { fromCreate: 'true' },
        }),
      );
      window.open(url, '_blank');
    }
  }

  exportData(): void {
    const q = this.searchQuery().trim();
    const base = this.opportunityService.getUrl();
    const apiUrl = q ? `${base}/search` : base;
    const searchParams: SearchParams | undefined = q ? { generalSearch: q } : undefined;

    this.listviewExportService
      .exportToGoogleSheet(
        'Opportunity',
        apiUrl,
        searchParams,
        'lastModifiedDate',
        'desc',
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
