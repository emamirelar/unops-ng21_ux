import { Partner } from '@emamirelar/ux';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { getPartnerApprovalClass, getPartnerStatusClass, PartnerService } from './partner.service';

const COUNTRY_TO_FLAG: Record<string, string> = {
    'japan': 'jp',
    'switzerland': 'ch',
    'denmark': 'dk',
    'belgium': 'be',
    "cote d'ivoire": 'ci',
    "côte d'ivoire": 'ci',
    'ivory coast': 'ci',
    'norway': 'no',
    'united states': 'us',
    'sweden': 'se',
    'france': 'fr',
    'germany': 'de',
    'united kingdom': 'gb',
    'italy': 'it',
    'spain': 'es',
    'netherlands': 'nl',
    'austria': 'at',
    'finland': 'fi',
    'ireland': 'ie',
    'portugal': 'pt',
    'greece': 'gr',
    'poland': 'pl',
    'canada': 'ca',
    'australia': 'au',
    'new zealand': 'nz',
    'brazil': 'br',
    'india': 'in',
    'china': 'cn',
    'south korea': 'kr',
    'mexico': 'mx',
    'south africa': 'za',
    'nigeria': 'ng',
    'kenya': 'ke',
    'ethiopia': 'et',
    'egypt': 'eg',
    'turkey': 'tr',
    'ukraine': 'ua',
    'pakistan': 'pk',
    'bangladesh': 'bd',
    'colombia': 'co',
    'argentina': 'ar',
    'peru': 'pe',
    'chile': 'cl',
    'thailand': 'th',
    'vietnam': 'vn',
    'indonesia': 'id',
    'philippines': 'ph',
    'malaysia': 'my',
    'singapore': 'sg',
    'saudi arabia': 'sa',
    'jordan': 'jo',
    'lebanon': 'lb',
    'iraq': 'iq',
    'afghanistan': 'af',
    'syria': 'sy',
    'yemen': 'ye',
    'somalia': 'so',
    'sudan': 'sd',
    'democratic republic of the congo': 'cd',
    'mozambique': 'mz',
    'tanzania': 'tz',
    'uganda': 'ug',
    'myanmar': 'mm',
    'cambodia': 'kh',
    'haiti': 'ht',
    'nepal': 'np',
    'sri lanka': 'lk',
    'luxembourg': 'lu',
    'czech republic': 'cz',
    'romania': 'ro',
    'hungary': 'hu',
    'serbia': 'rs'
};

interface FilterTag {
    group: 'status' | 'category';
    label: string;
    value: string;
}

@Component({
    selector: 'app-partners',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, RouterModule, InputTextModule, IconFieldModule, InputIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-col gap-6">
            <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">Partners</h1>

            <div class="flex flex-col items-start justify-start gap-3">
                <p-iconfield class="w-full sm:w-72">
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Search partners..." class="w-full! py-2! rounded-xl!" />
                </p-iconfield>

                <div class="flex items-center flex-wrap gap-2">
                    @for (tag of filterTags(); track tag.value) {
                        <p-tag
                            [value]="tag.label"
                            severity="secondary"
                            styleClass="cursor-pointer transition-colors px-2 py-1"
                            [class]="isTagActive(tag) ? 'tag-filter-active' : ''"
                            (click)="toggleTag(tag)"
                        />
                    }
                    @if (hasActiveFilters()) {
                        <p-tag
                            value="Clear"
                            icon="pi pi-times"
                            severity="secondary"
                            styleClass="cursor-pointer transition-colors px-2 py-1"
                            (click)="clearFilters()"
                        />
                    }
                </div>
            </div>

            <div class="p-4 border border-surface rounded-2xl">
                <div class="flex items-center justify-between mb-4 animate-fade-in">
                    <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-6 text-sm">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-base! leading-normal!"></i>
                            <span>{{ filteredPartners().length }} Partners</span>
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
            <p-dataview [value]="filteredPartners()" [layout]="layout" [pt]="{ header: { class: 'p-0! hidden' }, content: { class: 'bg-transparent!' } }">

                <ng-template #list let-items>
                    <div class="flex flex-col">
                        @for (item of items; track item.id; let i = $index) {
                            <a
                                [routerLink]="['/apps/partners', item.id]"
                                class="flex flex-col sm:flex-row sm:items-center p-4 gap-4 no-underline text-inherit cursor-pointer hover:bg-emphasis transition-colors animate-fade-in-up"
                                [style.animation-delay.ms]="i * 50"
                                [class.border-t]="i !== 0"
                                [class.border-surface]="i !== 0"
                            >
                                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0 overflow-hidden">
                                    <img [src]="getFlagUrl(item)" [alt]="item.address1Country || 'Global'" class="w-8 h-8 object-contain" />
                                </div>

                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <span class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ item.name }}</span>
                                            @if (item.shortName) {
                                                <span class="text-surface-500 dark:text-surface-400 text-sm">({{ item.shortName }})</span>
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
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        @for (item of items; track item.id; let i = $index) {
                            <a [routerLink]="['/apps/partners', item.id]" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2 no-underline text-inherit">
                                <div
                                    class="p-5 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl flex flex-col gap-4 cursor-pointer hover:bg-emphasis transition-colors animate-fade-in-up"
                                    [style.animation-delay.ms]="i * 50"
                                >
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0 overflow-hidden">
                                                <img [src]="getFlagUrl(item)" [alt]="item.address1Country || 'Global'" class="w-7 h-7 object-contain" />
                                            </div>
                                            <div class="flex flex-col gap-0.5 min-w-0">
                                                <span class="text-surface-900 dark:text-surface-0 text-base font-semibold truncate">{{ item.shortName || item.name }}</span>
                                                @if (item.shortName) {
                                                    <span class="text-surface-600 dark:text-surface-300 text-xs truncate">{{ item.name }}</span>
                                                }
                                            </div>
                                        </div>
                                        @if (item.keyGlobalPartner) {
                                            <i class="pi pi-star-fill text-amber-500 text-sm" title="Key Global Partner"></i>
                                        }
                                    </div>

                                    <div class="flex flex-col gap-2 text-sm text-surface-600 dark:text-surface-300">
                                        @if (item.partnerCategoryName) {
                                            <span class="flex items-center gap-2"><i class="pi pi-tag text-xs"></i> {{ item.partnerCategoryName }} &middot; {{ item.partnerGroupName }}</span>
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
                                </div>
                            </a>
                        }
                    </div>
                </ng-template>
            </p-dataview>
            </div>
        </div>
    `
})
export class Partners implements OnInit {
    partnerService = inject(PartnerService);
    layout: 'list' | 'grid' = 'list';
    layoutOptions = ['list', 'grid'];

    searchQuery = signal('');
    activeStatusFilters = signal<Set<string>>(new Set());
    activeCategoryFilters = signal<Set<string>>(new Set());

    filterTags = computed<FilterTag[]>(() => {
        const partners = this.partnerService.allPartners();
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

        return this.partnerService.allPartners().filter(p => {
            if (query) {
                const searchable = [p.name, p.shortName, p.address1Country, p.address1City, p.partnerCategoryName, p.partnerFocalPointName, p.liaisonOfficeName].filter(Boolean).join(' ').toLowerCase();
                if (!searchable.includes(query)) return false;
            }
            if (statusFilters.size > 0 && (!p.status || !statusFilters.has(p.status))) return false;
            if (categoryFilters.size > 0 && (!p.partnerCategoryName || !categoryFilters.has(p.partnerCategoryName))) return false;
            return true;
        });
    });

    activeCount = computed(() => this.filteredPartners().filter(p => p.status === 'Active').length);
    keyGlobalCount = computed(() => this.filteredPartners().filter(p => p.keyGlobalPartner).length);
    hasActiveFilters = computed(() => this.searchQuery().length > 0 || this.activeStatusFilters().size > 0 || this.activeCategoryFilters().size > 0);

    ngOnInit() {
        this.partnerService.getPartners();
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
    }

    getFlagUrl(partner: Partner): string {
        if (partner.partnerCategoryCode === 'UN') {
            return 'flags/un.svg';
        }
        if (!partner.address1Country) {
            return 'flags/globe.svg';
        }
        const code = COUNTRY_TO_FLAG[partner.address1Country.toLowerCase()];
        return code ? `flags/${code}.svg` : 'flags/globe.svg';
    }

    getStatusClass = getPartnerStatusClass;
    getApprovalClass = getPartnerApprovalClass;
}
