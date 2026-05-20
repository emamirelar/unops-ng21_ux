import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { Partner } from '@unopsitg/ux';
import { getPartnerStatusClass, getPartnerApprovalClass } from './partner.service';

const MOCK_TEAM_PARTNERS: Partner[] = [
    { id: '1', name: '3DF Three Disease Fund', shortName: '3DF', partnerCategoryName: 'MPI', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '2', name: '3MDG Three Millennium Development Goal Fund', shortName: '3MDG', partnerCategoryName: 'MPI', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '3', name: 'AAIC Japan Co., Ltd.', shortName: 'AAIC', partnerFocalPointName: 'Yuichi Sugawara', status: 'Active', partnerApprovalStatus: 'NotApproved', keyGlobalPartner: false },
    { id: '4', name: 'ABC Agência Brasileira de Cooperação', shortName: 'ABC', partnerCategoryName: 'Gov: Non-OECD/DAC', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '5', name: 'ABCR Brazilian Association of Private Road Operators', shortName: 'ABCR', partnerCategoryName: 'Private Sector', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '6', name: 'ABDIB Associação Brasileira da Infraestrutura e Indústrias de Base', shortName: 'ABDIB', partnerCategoryName: 'Private Sector', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '7', name: 'Abt Associates', shortName: 'Abt', partnerCategoryName: 'Private Sector', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '8', name: 'Accenture', shortName: 'Accenture', partnerCategoryName: 'Private Sector', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '9', name: 'ACFE Association of Certified Fraud Examiners', shortName: 'ACFE', partnerCategoryName: 'Academic, Training and Research', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '10', name: 'ADA Austria Development Agency', shortName: 'ADA', partnerCategoryName: 'Gov: OECD/DAC', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '11', name: 'ADB Asian Development Bank', shortName: 'ADB', partnerCategoryName: 'Vertical Fund', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: true },
    { id: '12', name: 'ADRA Adventist Development and Relief Agency', shortName: 'ADRA', partnerCategoryName: 'NGO', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '13', name: 'AFD Agence Française de Développement', shortName: 'AFD', partnerCategoryName: 'Gov: OECD/DAC', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: true },
    { id: '14', name: 'African Development Bank', shortName: 'AfDB', partnerCategoryName: 'MPI', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '15', name: 'African Union', shortName: 'AU', partnerCategoryName: 'Gov: Non-OECD/DAC', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '16', name: 'AGFUND Arab Gulf Fund', shortName: 'AGFUND', partnerCategoryName: 'Vertical Fund', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '17', name: 'AICS Italian Agency for Development Cooperation', shortName: 'AICS', partnerCategoryName: 'Gov: OECD/DAC', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '18', name: 'Aker Solutions', shortName: 'Aker', partnerCategoryName: 'Private Sector', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: false },
    { id: '19', name: 'AMISOM African Union Mission', shortName: 'AMISOM', partnerCategoryName: 'Gov: Non-OECD/DAC', liaisonOfficeName: 'Other Partners', status: 'Draft', partnerApprovalStatus: 'NotApproved', keyGlobalPartner: false },
    { id: '20', name: 'Asian Infrastructure Investment Bank', shortName: 'AIIB', partnerCategoryName: 'MPI', liaisonOfficeName: 'Other Partners', status: 'Active', partnerApprovalStatus: 'Approved', keyGlobalPartner: true },
];

interface FilterTag {
    group: 'status' | 'category';
    label: string;
    value: string;
}

@Component({
    selector: 'app-partners-team',
    imports: [
        CommonModule, FormsModule, ButtonModule, RouterModule,
        DataViewModule, TagModule, IconFieldModule, InputIconModule,
        InputTextModule, SelectButtonModule, SkeletonModule, CardModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        :host { display: block; }
    `,
    template: `
<div class="flex flex-col gap-6">
  <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">Partners</h1>

  <div class="flex flex-col items-start justify-start gap-3">
    <div class="flex items-center gap-3 w-full">
      <p-iconfield class="w-full sm:w-72">
        <p-inputicon styleClass="pi pi-search" />
        <input
          pInputText
          [ngModel]="searchQuery()"
          (ngModelChange)="searchQuery.set($event)"
          placeholder="Search partners..."
          class="w-full"
        />
      </p-iconfield>

      <div class="flex items-center gap-3 ml-auto">
        <p-button icon="pi pi-file-import" label="Import" rounded text />
        <p-button icon="pi pi-plus" label="New Partner" rounded />
      </div>
    </div>

    <div class="flex items-center flex-wrap gap-2">
      @for (tag of filterTags(); track tag.value) {
        <button
          type="button"
          class="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors"
          [class]="isTagActive(tag) ? 'bg-primary text-primary-contrast border-primary' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-200 dark:hover:bg-surface-700'"
          (click)="toggleTag(tag)">
          {{ tag.label }}
        </button>
      }
      @if (hasActiveFilters()) {
        <button
          type="button"
          class="px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
          (click)="clearFilters()">
          <i class="pi pi-times text-xs mr-1"></i>Clear Filters
        </button>
      }
    </div>
  </div>

  <div class="p-4 border border-surface rounded-2xl">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-6 text-sm">
        <div class="flex items-center gap-2">
          <i class="pi pi-users text-base! leading-normal!"></i>
          <span>{{ totalCount() }} Partners</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-check-circle text-base! leading-normal!"></i>
          <span>{{ activeCount() }} Active</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-star text-base! leading-normal!"></i>
          <span>{{ keyGlobalCount() }} Key Global</span>
        </div>
      </div>
      <p-select-button [(ngModel)]="layout" [options]="layoutOptions" [allowEmpty]="false">
        <ng-template #item let-option>
          <i class="pi" [class.pi-bars]="option === 'list'" [class.pi-table]="option === 'grid'"></i>
        </ng-template>
      </p-select-button>
    </div>

    <p-dataview
      [value]="filteredPartners()"
      [layout]="layout"
      [pt]="{ header: { class: 'hidden' } }"
    >
      <ng-template #list let-items>
        <div class="flex flex-col">
          @for (item of items; track item.id; let i = $index) {
            <a
              [routerLink]="['/apps/partners', item.id]"
              class="flex flex-col sm:flex-row sm:items-center p-4 gap-4 no-underline text-inherit cursor-pointer hover:bg-emphasis transition-colors"
              [class.border-t]="i !== 0"
              [class.border-surface]="i !== 0"
            >
              <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0 overflow-hidden">
                <span class="text-base font-bold text-primary">{{ (item.shortName || item.name || '?').charAt(0) }}</span>
              </div>

              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                <div class="flex flex-col gap-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ item.name }}</span>
                    @if (item.shortName) {
                      <span class="text-surface-600 dark:text-surface-300 text-sm">({{ item.shortName }})</span>
                    }
                    @if (item.keyGlobalPartner) {
                      <i class="pi pi-star-fill text-amber-500 text-xs" title="Key Global Partner"></i>
                    }
                  </div>
                  <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-300">
                    @if (item.address1Country) {
                      <span class="flex items-center gap-1"><i class="pi pi-map-marker text-xs"></i> {{ item.address1City ? item.address1City + ', ' : '' }}{{ item.address1Country }}</span>
                    }
                    @if (item.liaisonOfficeName) {
                      <span class="flex items-center gap-1"><i class="pi pi-home text-xs"></i> {{ item.liaisonOfficeName }}</span>
                    }
                    @if (item.partnerFocalPointName) {
                      <span class="flex items-center gap-1"><i class="pi pi-user text-xs"></i> {{ item.partnerFocalPointName }}</span>
                    }
                  </div>
                </div>

                <div class="flex items-center gap-3 shrink-0">
                  @if (item.partnerCategoryName) {
                    <p-tag [value]="item.partnerCategoryName" severity="info" />
                  }
                  @if (item.status) {
                    <p-tag [value]="item.status" [styleClass]="getStatusClass(item.status)" />
                  }
                  @if (item.partnerApprovalStatus) {
                    <p-tag [value]="item.partnerApprovalStatus" [styleClass]="getApprovalClass(item.partnerApprovalStatus)" />
                  }
                  <span class="pi pi-chevron-right text-surface-400 text-sm"></span>
                </div>
              </div>
            </a>
          }
          @empty {
            <div class="flex flex-col items-center justify-center py-12 text-surface-500">
              <i class="pi pi-search text-4xl mb-3"></i>
              <span class="text-lg">No partners found</span>
            </div>
          }
        </div>
      </ng-template>

      <ng-template #grid let-items>
        <div class="grid grid-cols-12 gap-4">
          @for (item of items; track item.id; let i = $index) {
            <a [routerLink]="['/apps/partners', item.id]" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2 no-underline text-inherit">
              <p-card styleClass="cursor-pointer hover:bg-emphasis transition-colors border border-surface-200 dark:border-surface-700">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0 overflow-hidden">
                      <span class="text-sm font-bold text-primary">{{ (item.shortName || item.name || '?').charAt(0) }}</span>
                    </div>
                    <div class="flex flex-col gap-0.5 min-w-0">
                      <span class="text-surface-900 dark:text-surface-0 text-base font-semibold truncate">{{ item.shortName || item.name }}</span>
                      @if (item.shortName) {
                        <span class="text-surface-600 dark:text-surface-300 text-sm truncate">{{ item.name }}</span>
                      }
                    </div>
                  </div>
                  @if (item.keyGlobalPartner) {
                    <i class="pi pi-star-fill text-amber-500 text-sm" title="Key Global Partner"></i>
                  }
                </div>

                <div class="flex flex-col gap-2 text-sm text-surface-600 dark:text-surface-300">
                  @if (item.partnerCategoryName) {
                    <span class="flex items-center gap-2"><i class="pi pi-tag text-xs"></i> {{ item.partnerCategoryName }}{{ item.partnerGroupName ? ' · ' + item.partnerGroupName : '' }}</span>
                  }
                  @if (item.address1Country) {
                    <span class="flex items-center gap-2"><i class="pi pi-map-marker text-xs"></i> {{ item.address1City ? item.address1City + ', ' : '' }}{{ item.address1Country }}</span>
                  }
                  @if (item.partnerFocalPointName) {
                    <span class="flex items-center gap-2"><i class="pi pi-user text-xs"></i> {{ item.partnerFocalPointName }}</span>
                  }
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-surface-200 dark:border-surface-700">
                  <div class="flex items-center gap-2">
                    @if (item.status) {
                      <p-tag [value]="item.status" [styleClass]="getStatusClass(item.status)" />
                    }
                    @if (item.partnerApprovalStatus) {
                      <p-tag [value]="item.partnerApprovalStatus" [styleClass]="getApprovalClass(item.partnerApprovalStatus)" />
                    }
                  </div>
                  <span class="pi pi-chevron-right text-surface-400 text-sm"></span>
                </div>
              </p-card>
            </a>
          }
          @empty {
            <div class="col-span-full flex flex-col items-center justify-center py-12 text-surface-500">
              <i class="pi pi-search text-4xl mb-3"></i>
              <span class="text-lg">No partners found</span>
            </div>
          }
        </div>
      </ng-template>
    </p-dataview>
  </div>
</div>
    `
})
export class PartnersTeam {
    private partners = signal<Partner[]>(MOCK_TEAM_PARTNERS);

    layout: 'list' | 'grid' = 'list';
    layoutOptions = ['list', 'grid'];

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
    totalCount = computed(() => this.filteredPartners().length);
    hasActiveFilters = computed(() =>
        this.searchQuery().length > 0 ||
        this.activeStatusFilters().size > 0 ||
        this.activeCategoryFilters().size > 0
    );

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
    }

    getStatusClass = getPartnerStatusClass;
    getApprovalClass = getPartnerApprovalClass;
}
