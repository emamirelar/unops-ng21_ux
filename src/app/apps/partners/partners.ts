import { Partner } from '@/app/types/partner';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { PartnerService } from './partner.service';

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

@Component({
    selector: 'app-partners',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-col gap-6">
            <div>
                <ul class="list-none p-0 m-0 flex items-center font-medium mb-5">
                    <li>
                        <a class="text-surface-500 dark:text-surface-300 no-underline leading-normal cursor-pointer">Application</a>
                    </li>
                    <li class="px-2">
                        <i class="pi pi-angle-right text-surface-500 dark:text-surface-300 text-sm! leading-normal!"></i>
                    </li>
                    <li>
                        <span class="text-surface-900 dark:text-surface-0 leading-normal">Partners</span>
                    </li>
                </ul>
                <div>
                    <div class="font-bold text-3xl text-surface-900 dark:text-surface-0 mb-4">Partners</div>
                    <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-8">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-base! leading-normal!"></i>
                            <span>{{ partnerService.allPartners().length }} Partners</span>
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
                </div>
            </div>

            <div class="card">
                <div class="flex justify-end mb-4">
                    <p-select-button [(ngModel)]="layout" [options]="layoutOptions" [allowEmpty]="false">
                        <ng-template #item let-option>
                            <i class="pi" [class.pi-bars]="option === 'list'" [class.pi-table]="option === 'grid'"></i>
                        </ng-template>
                    </p-select-button>
                </div>
            <p-dataview [value]="partnerService.allPartners()" [layout]="layout" [pt]="{ header: { class: 'p-0! hidden' } }">

                <ng-template #list let-items>
                    <div class="flex flex-col">
                        @for (item of items; track item.id; let i = $index) {
                            <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-4" [class.border-t]="i !== 0" [class.border-surface]="i !== 0">
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
                                            <p-tag [value]="item.status" [style]="getStatusStyle(item.status)" />
                                        }
                                        @if (item.partnerApprovalStatus) {
                                            <p-tag [value]="item.partnerApprovalStatus" [style]="getApprovalStyle(item.partnerApprovalStatus)" />
                                        }
                                        <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="secondary" [routerLink]="['/apps/partners', item.id]" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        @for (item of items; track item.id) {
                            <div class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                                <div class="p-5 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl flex flex-col gap-4">
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
                                                <p-tag [value]="item.status" [style]="getStatusStyle(item.status)" />
                                            }
                                            @if (item.partnerApprovalStatus) {
                                                <p-tag [value]="item.partnerApprovalStatus" [style]="getApprovalStyle(item.partnerApprovalStatus)" />
                                            }
                                        </div>
                                        <p-button icon="pi pi-eye" label="View" [text]="true" severity="secondary" size="small" [routerLink]="['/apps/partners', item.id]" />
                                    </div>
                                </div>
                            </div>
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
    activeCount = computed(() => this.partnerService.allPartners().filter(p => p.status === 'Active').length);
    keyGlobalCount = computed(() => this.partnerService.allPartners().filter(p => p.keyGlobalPartner).length);

    ngOnInit() {
        this.partnerService.getPartners();
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

    getStatusStyle(status: string): Record<string, string> {
        const styles: Record<string, Record<string, string>> = {
            Active: { background: 'var(--color-babygreen-100)', color: 'var(--color-babygreen-700)' },
            Draft: { background: 'var(--color-yellow-100)', color: 'var(--color-yellow-700)' },
            Closed: { background: 'var(--color-deepsea-100)', color: 'var(--color-deepsea-500)' },
            Archived: { background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }
        };
        return styles[status] ?? { background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' };
    }

    getApprovalStyle(status: string): Record<string, string> {
        const styles: Record<string, Record<string, string>> = {
            Approved: { background: 'var(--color-olive-100)', color: 'var(--color-olive-700)' },
            NotApproved: { background: 'var(--color-red-100)', color: 'var(--color-red-700)' }
        };
        return styles[status] ?? { background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' };
    }
}
