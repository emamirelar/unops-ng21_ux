/**
 * @fileoverview Office list component with Entity Manager-driven cards.
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { ListviewComponent } from '@features/list-view/components/listview/listview.component';
import { ListViewColumn, ListViewConfig } from '@features/list-view/components/listview/listview.model';
import { EntityConfigurationService } from '@shared/services/api/entity-configuration.service';
import { SearchField } from '@shared/services/utils';

@Component({
  selector: 'app-office-list',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ProgressSpinnerModule,
    ListviewComponent
  ],
  templateUrl: './office-list.component.html',
  styleUrl: './office-list.component.scss'
})
export class OfficeListComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly entityConfigService = inject(EntityConfigurationService);
  private readonly translateService = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly columns = signal<ListViewColumn[]>([]);
  readonly columnsLoading = signal(true);

  readonly listviewConfig = computed<ListViewConfig>(() => ({
    pageSize: 20,
    pageSizeOptions: [20, 50, 100],
    enablePagination: true,
    enableSorting: true,
    enableSearch: true,
    enableExport: false,
    scrollable: true,
    scrollHeight: 'flex',
    entityName: 'Office',
    defaultViewMode: 'card',
    showViewModeToggle: true,
    defaultSortField: 'name',
    defaultSortOrder: 'asc',
    sortableFields: [
      { field: 'name', label: this.translateService.instant('office.list.columnName') },
      { field: 'alias', label: this.translateService.instant('office.list.columnAlias') },
      { field: 'costCentreId', label: this.translateService.instant('office.list.columnCostCentre') }
    ],
    searchConfig: {
      useAdvancedSearch: true,
      placeholder: this.translateService.instant('office.list.searchPlaceholderNameAliasCostCentre'),
      searchableFields: [
        { field: 'name', label: 'office.list.columnName', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'alias', label: 'office.list.columnAlias', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'code', label: 'office.list.columnCode', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'costCentreId', label: 'office.list.columnCostCentre', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'type', label: 'office.list.columnType', type: 'string', operators: ['is', 'is not'] },
        { field: 'internalName', label: 'office.list.columnInternalName', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'externalName', label: 'office.list.columnExternalName', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'hierarchyLevel', label: 'office.list.columnHierarchyLevel', type: 'number', operators: ['is', 'is not', '>', '<', '>=', '<='] },
        { field: 'effectiveDate', label: 'office.list.columnEffectiveDate', type: 'date', operators: ['after', 'before', 'between'] },
        { field: 'financialCentreType', label: 'office.list.columnFinancialCentreType', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'funding', label: 'office.list.columnFunding', type: 'string', operators: ['is', 'is not', 'like', 'not like'] },
        { field: 'scopeType', label: 'office.list.columnScopeType', type: 'string', operators: ['is', 'is not'] },
        { field: 'status', label: 'office.list.columnStatus', type: 'number', operators: ['is', 'is not'] },
        { field: 'parentId', label: 'office.list.columnParent', type: 'number', operators: ['is', 'is not'] }
      ] as SearchField[]
    }
  }));

  ngOnInit(): void {
    this.loadColumns();
  }

  private loadColumns(): void {
    this.columnsLoading.set(true);
    this.entityConfigService
      .getEntityListViewConfiguration('Office')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (cols) => {
          this.columns.set(cols as ListViewColumn[]);
          this.columnsLoading.set(false);
        },
        error: () => {
          this.columns.set(this.getDefaultColumns());
          this.columnsLoading.set(false);
        }
      });
  }

  private getDefaultColumns(): ListViewColumn[] {
    return [
      { field: 'name', label: 'Name', type: 'text', sortable: true },
      { field: 'alias', label: 'Alias', type: 'text', sortable: true },
      { field: 'code', label: 'Code', type: 'text', sortable: true },
      { field: 'type', label: 'Type', type: 'badge', sortable: true },
      { field: 'status', label: 'Status', type: 'badge', sortable: true }
    ];
  }

  onRowClick(office: { id: number }): void {
    this.router.navigate(['/offices', office.id]);
  }
}
