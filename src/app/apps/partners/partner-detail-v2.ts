import { Partner } from '@/app/types/partner';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';
import { PartnerService } from './partner.service';

const COUNTRY_TO_FLAG: Record<string, string> = {
    japan: 'jp', switzerland: 'ch', denmark: 'dk', belgium: 'be',
    "cote d'ivoire": 'ci', "côte d'ivoire": 'ci', 'ivory coast': 'ci',
    norway: 'no', 'united states': 'us', sweden: 'se', france: 'fr',
    germany: 'de', 'united kingdom': 'gb', italy: 'it', spain: 'es',
    netherlands: 'nl', austria: 'at', finland: 'fi', ireland: 'ie',
    portugal: 'pt', greece: 'gr', poland: 'pl', canada: 'ca',
    australia: 'au', 'new zealand': 'nz', brazil: 'br', india: 'in',
    china: 'cn', 'south korea': 'kr', mexico: 'mx', 'south africa': 'za',
    nigeria: 'ng', kenya: 'ke', ethiopia: 'et', egypt: 'eg', turkey: 'tr',
    ukraine: 'ua', pakistan: 'pk', bangladesh: 'bd', colombia: 'co',
    argentina: 'ar', peru: 'pe', chile: 'cl', thailand: 'th',
    vietnam: 'vn', indonesia: 'id', philippines: 'ph', malaysia: 'my',
    singapore: 'sg', 'saudi arabia': 'sa', jordan: 'jo', lebanon: 'lb',
    iraq: 'iq', afghanistan: 'af', syria: 'sy', yemen: 'ye', somalia: 'so',
    sudan: 'sd', 'democratic republic of the congo': 'cd', mozambique: 'mz',
    tanzania: 'tz', uganda: 'ug', myanmar: 'mm', cambodia: 'kh',
    haiti: 'ht', nepal: 'np', 'sri lanka': 'lk', luxembourg: 'lu',
    'czech republic': 'cz', romania: 'ro', hungary: 'hu', serbia: 'rs'
};

@Component({
    selector: 'app-partner-detail-v2',
    imports: [CommonModule, ButtonModule, TagModule, RouterModule, TabsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (partner(); as p) {
            <div class="flex flex-col gap-0">

                <!-- Back + Actions Bar -->
                <div class="flex items-center justify-between mb-4">
                    <p-button
                        icon="pi pi-arrow-left"
                        label="Partners"
                        [text]="true"
                        severity="secondary"
                        routerLink="/apps/partners"
                    />
                    <div class="flex items-center gap-2">
                        <p-button icon="pi pi-pencil" label="Edit" [outlined]="true" severity="secondary" size="small" />
                        <p-button icon="pi pi-ellipsis-v" [rounded]="true" [text]="true" severity="secondary" size="small" />
                    </div>
                </div>

                <!-- Unified Header Card -->
                <div class="card !mb-0 !rounded-b-none border-b border-surface-200 dark:border-surface-700">
                    <div class="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div class="flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 shrink-0 overflow-hidden">
                            <img [src]="flagUrl()" [alt]="p.address1Country || 'Global'" class="w-9 h-9 object-contain" />
                        </div>

                        <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                            <!-- Line 1: Name + badge -->
                            <div class="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                                <h1 class="text-surface-900 dark:text-surface-0 text-xl font-bold leading-7 m-0">{{ p.name }}</h1>
                                @if (p.shortName) {
                                    <span class="text-surface-500 dark:text-surface-400 text-base font-medium">({{ p.shortName }})</span>
                                }
                                @if (p.keyGlobalPartner) {
                                    <span class="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                                        <i class="pi pi-star-fill text-xs"></i> Key Global
                                    </span>
                                }
                            </div>

                            <!-- Line 2: Location · Office · Focal point -->
                            <div class="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-surface-600 dark:text-surface-300">
                                @if (p.address1Country) {
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-map-marker text-xs text-surface-400"></i>
                                        {{ p.address1City ? p.address1City + ', ' : '' }}{{ p.address1Country }}
                                    </span>
                                }
                                @if (p.liaisonOfficeName) {
                                    <span class="text-surface-300 dark:text-surface-600">&middot;</span>
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-building text-xs text-surface-400"></i>
                                        {{ p.liaisonOfficeName }}
                                    </span>
                                }
                                @if (p.partnerFocalPointName) {
                                    <span class="text-surface-300 dark:text-surface-600">&middot;</span>
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-user text-xs text-surface-400"></i>
                                        {{ p.partnerFocalPointName }}
                                    </span>
                                }
                            </div>

                            <!-- Line 3: Tags -->
                            <div class="flex items-center flex-wrap gap-2 mt-0.5">
                                @if (p.partnerCategoryName) {
                                    <p-tag [value]="p.partnerCategoryName" severity="info" />
                                }
                                @if (p.status) {
                                    <p-tag [value]="p.status" [style]="getStatusStyle(p.status)" />
                                }
                                @if (p.partnerApprovalStatus) {
                                    <p-tag [value]="p.partnerApprovalStatus" [style]="getApprovalStyle(p.partnerApprovalStatus)" />
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tabs -->
                <p-tabs [value]="0" [scrollable]="true">
                    <p-tablist>
                        <p-tab [value]="0"><i class="pi pi-id-card mr-2"></i>Details</p-tab>
                        <p-tab [value]="1"><i class="pi pi-briefcase mr-2"></i>Opportunities</p-tab>
                        <p-tab [value]="2"><i class="pi pi-users mr-2"></i>Contacts</p-tab>
                        <p-tab [value]="3"><i class="pi pi-comments mr-2"></i>Interactions</p-tab>
                        <p-tab [value]="4"><i class="pi pi-file mr-2"></i>Documents</p-tab>
                    </p-tablist>

                    <!-- Details tab -->
                    <p-tabpanels>
                        <p-tabpanel [value]="0">
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5 py-2">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Partner ID</span>
                                    <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.id }}</span>
                                </div>

                                @if (p.partnerDescription) {
                                    <div class="flex flex-col gap-1 sm:col-span-2">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Description</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.partnerDescription }}</span>
                                    </div>
                                }

                                @if (p.partnerCategoryName) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Category</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.partnerCategoryName }}</span>
                                    </div>
                                }

                                @if (p.partnerCategoryCode) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Category Code</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.partnerCategoryCode }}</span>
                                    </div>
                                }

                                @if (p.partnerGroupName) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Partner Group</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.partnerGroupName }}</span>
                                    </div>
                                }

                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Key Global Partner</span>
                                    <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">
                                        @if (p.keyGlobalPartner) {
                                            <i class="pi pi-check-circle text-green-500 mr-1"></i> Yes
                                        } @else {
                                            <i class="pi pi-minus-circle text-surface-400 mr-1"></i> No
                                        }
                                    </span>
                                </div>

                                @if (p.createdDate) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Created</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.createdDate | date:'mediumDate' }}</span>
                                    </div>
                                }

                                @if (p.lastModifiedDate) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Last Modified</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.lastModifiedDate | date:'mediumDate' }}</span>
                                    </div>
                                }
                            </div>
                        </p-tabpanel>

                        <!-- Opportunities tab (placeholder) -->
                        <p-tabpanel [value]="1">
                            <div class="flex flex-col items-center justify-center gap-3 py-12 text-surface-400">
                                <i class="pi pi-briefcase text-3xl"></i>
                                <span class="text-sm">No opportunities linked to this partner yet.</span>
                            </div>
                        </p-tabpanel>

                        <!-- Contacts tab (placeholder) -->
                        <p-tabpanel [value]="2">
                            <div class="flex flex-col items-center justify-center gap-3 py-12 text-surface-400">
                                <i class="pi pi-users text-3xl"></i>
                                <span class="text-sm">No contacts linked to this partner yet.</span>
                            </div>
                        </p-tabpanel>

                        <!-- Interactions tab (placeholder) -->
                        <p-tabpanel [value]="3">
                            <div class="flex flex-col items-center justify-center gap-3 py-12 text-surface-400">
                                <i class="pi pi-comments text-3xl"></i>
                                <span class="text-sm">No interactions recorded for this partner yet.</span>
                            </div>
                        </p-tabpanel>

                        <!-- Documents tab (placeholder) -->
                        <p-tabpanel [value]="4">
                            <div class="flex flex-col items-center justify-center gap-3 py-12 text-surface-400">
                                <i class="pi pi-file text-3xl"></i>
                                <span class="text-sm">No documents attached to this partner yet.</span>
                            </div>
                        </p-tabpanel>
                    </p-tabpanels>
                </p-tabs>
            </div>
        } @else {
            <div class="flex flex-col items-center justify-center gap-4 py-20">
                <i class="pi pi-info-circle text-4xl text-surface-400"></i>
                <span class="text-surface-600 dark:text-surface-300 text-lg">Partner not found</span>
                <p-button label="Back to Partners" icon="pi pi-arrow-left" routerLink="/apps/partners" />
            </div>
        }
    `
})
export class PartnerDetailV2 implements OnInit {
    private route = inject(ActivatedRoute);
    private partnerService = inject(PartnerService);

    partnerId = signal<string | null>(null);

    partner = computed(() => {
        const id = this.partnerId();
        if (!id) return null;
        return this.partnerService.allPartners().find(p => p.id === id) ?? null;
    });

    flagUrl = computed(() => {
        const p = this.partner();
        if (!p) return 'flags/globe.svg';
        if (p.partnerCategoryCode === 'UN') return 'flags/un.svg';
        if (!p.address1Country) return 'flags/globe.svg';
        const code = COUNTRY_TO_FLAG[p.address1Country.toLowerCase()];
        return code ? `flags/${code}.svg` : 'flags/globe.svg';
    });

    ngOnInit() {
        this.partnerService.getPartners();
        this.partnerId.set(this.route.snapshot.paramMap.get('id'));
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
