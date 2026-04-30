import { Partner, AiCardBgComponent } from '@unops/ux';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { getPartnerApprovalClass, getPartnerStatusClass, PartnerService } from './partner.service';

interface AiInsight {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: string;
    iconColor: string;
}

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
    selector: 'app-partner-detail',
    imports: [CommonModule, FormsModule, ButtonModule, TagModule, DividerModule, DrawerModule, InputTextModule, PaginatorModule, SelectModule, TextareaModule, ToggleSwitchModule, RouterModule, AiCardBgComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (partner(); as p) {
            <div class="flex flex-col gap-6">

                <!-- Header Card -->
                <div class="card animate-fade-in border-0! p-0!">
                    <div class="flex flex-col sm:flex-row sm:items-start gap-5">
                        <div class="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 shrink-0 overflow-hidden">
                            <img [src]="flagUrl()" [alt]="p.address1Country || 'Global'" class="w-10 h-10 object-contain" />
                        </div>

                        <div class="flex flex-col gap-2 flex-1 min-w-0">
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                                <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">{{ p.name }}</h1>
                                @if (p.shortName) {
                                    <span class="text-surface-500 dark:text-surface-400 text-lg font-medium">({{ p.shortName }})</span>
                                }
                                @if (p.keyGlobalPartner) {
                                    <span class="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                        <i class="pi pi-star-fill text-xs"></i> Key Global Partner
                                    </span>
                                }
                            </div>

                            <div class="flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-surface-600 dark:text-surface-300">
                                @if (p.address1Country) {
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-map-marker text-xs"></i>
                                        {{ p.address1City ? p.address1City + ', ' : '' }}{{ p.address1Country }}
                                    </span>
                                }
                                @if (p.liaisonOfficeName) {
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-building text-xs"></i>
                                        {{ p.liaisonOfficeName }}
                                    </span>
                                }
                            </div>

                            <div class="flex items-center flex-wrap gap-2 mt-1">
                                @if (p.partnerCategoryName) {
                                    <p-tag [value]="p.partnerCategoryName" severity="info" />
                                }
                                @if (p.status) {
                                    <p-tag [value]="p.status" [styleClass]="getStatusClass(p.status)" />
                                }
                                @if (p.partnerApprovalStatus) {
                                    <p-tag [value]="getApprovalLabel(p.partnerApprovalStatus)" [styleClass]="getApprovalClass(p.partnerApprovalStatus)" />
                                }
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <p-button icon="pi pi-pencil" label="Edit" [outlined]="true" severity="secondary" (onClick)="openEditDrawer()" />
                            <p-button icon="pi pi-ellipsis-v" [rounded]="true" [text]="true" severity="secondary" />
                        </div>
                    </div>
                </div>

                <!-- Two-Column Content -->
                <div class="flex flex-col xl:flex-row gap-6 w-full">

                    <!-- Main Content -->
                    <div class="flex-1 flex flex-col gap-6 min-w-0">

                        <!-- Partner Details -->
                        <div class="card flex flex-col gap-5 animate-fade-in-up stagger-1">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-id-card text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Partner Details</h4>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Partner ID</span>
                                    <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.id }}</span>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Full Name</span>
                                    <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.name }}</span>
                                </div>

                                @if (p.shortName) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Short Name</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.shortName }}</span>
                                    </div>
                                }

                                @if (p.partnerDescription) {
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Description</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.partnerDescription }}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <!-- Classification -->
                        <div class="card flex flex-col gap-5 animate-fade-in-up stagger-2">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-sitemap text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Classification</h4>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
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
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Group</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ p.partnerGroupName }}</span>
                                    </div>
                                }

                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Status</span>
                                    <div>
                                        @if (p.status) {
                                            <p-tag [value]="p.status" [styleClass]="getStatusClass(p.status)" />
                                        }
                                    </div>
                                </div>

                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Approval Status</span>
                                    <div>
                                        @if (p.partnerApprovalStatus) {
                                            <p-tag [value]="getApprovalLabel(p.partnerApprovalStatus)" [styleClass]="getApprovalClass(p.partnerApprovalStatus)" />
                                        }
                                    </div>
                                </div>

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
                            </div>
                        </div>
                    </div>

                    <!-- Right Sidebar -->
                    <div class="w-full xl:w-[380px] flex flex-col gap-6 shrink-0">

                        <!-- AI Partner Analysis -->
                        <ux-ai-card-bg
                            class="border border-[#e0e7ff] dark:border-[#2d3a5c] rounded-2xl shadow-sm p-4 overflow-hidden transition-all duration-300 flex flex-col max-h-[calc(100dvh-12rem)]"
                        >
                            <div class="motion-safe:animate-enter-liquid [animation-delay:80ms] flex flex-col flex-1 min-h-0">
                            <div class="flex items-center justify-between cursor-pointer shrink-0" (click)="isAiCardExpanded.set(!isAiCardExpanded())">
                                <div class="flex items-center gap-3">
                                    <div class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0">
                                        <i class="pi pi-sparkles text-blue-800 dark:text-blue-300"></i>
                                    </div>
                                    <div class="flex flex-col">
                                        <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">AI Partner Analysis</h4>
                                        <span class="text-midnight-700 dark:text-surface-100 text-sm font-medium leading-tight">{{ aiInsights.length }} insights available for your review</span>
                                    </div>
                                </div>
                                <button class="w-[30px] h-[30px] rounded-full bg-white/85 dark:bg-transparent border border-white dark:border-surface-300 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-white/10 transition-colors">
                                    <i class="pi text-xs text-darkblue-500 dark:text-surface-0" [ngClass]="isAiCardExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                                </button>
                            </div>

                            <div class="expand-body" [class.expand-body--open]="isAiCardExpanded()">
                                <div class="expand-body__inner">
                                <div class="flex flex-col gap-4 mt-4 flex-1 min-h-0">
                                    <div class="bg-white/60 dark:bg-surface-800/60 border border-white dark:border-surface-700 rounded-[14px] shadow-sm flex items-center gap-4 px-4 py-2.5 shrink-0">
                                        <i class="pi pi-search text-surface-500 dark:text-surface-300 text-sm"></i>
                                        <input
                                            type="text"
                                            [ngModel]="aiSearchQuery()"
                                            (ngModelChange)="aiSearchQuery.set($event); aiInsightsPage.set(0)"
                                            placeholder="Search insights, risks, or recommendations..."
                                            class="bg-transparent border-none outline-none flex-1 text-sm font-medium text-deepsea-500 dark:text-surface-0 placeholder:text-surface-700 dark:placeholder:text-surface-300"
                                        />
                                    </div>

                                    <div class="flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto overscroll-y-contain pr-0.5">
                                        @for (insight of paginatedAiInsights(); track insight.id) {
                                            <div class="bg-white/70 dark:bg-surface-800/70 border border-white/50 dark:border-surface-700/50 rounded-[14px] shadow-sm p-4 flex gap-3 items-start shrink-0">
                                                <i class="pi mt-0.5" [ngClass]="[insight.icon, insight.iconColor]"></i>
                                                <div class="flex flex-col gap-2 flex-1 min-w-0">
                                                    <div class="flex flex-col gap-1">
                                                        <span class="text-midnight-500 dark:text-surface-0 text-sm font-bold leading-[21px]">{{ insight.title }}</span>
                                                        <p class="text-[#2b638b] dark:text-surface-300 text-sm leading-normal">{{ insight.description }}</p>
                                                    </div>
                                                    <button class="flex items-center gap-1.5 text-darkblue-500 dark:text-primary-400 text-sm font-semibold cursor-pointer hover:underline bg-transparent border-none p-0 w-fit">
                                                        {{ insight.actionLabel }}
                                                        <i class="pi pi-arrow-right text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>

                                    <div class="shrink-0 w-full border-t border-white/50 dark:border-surface-700/50 pt-2 mt-1 relative z-[1] bg-transparent">
                                        <p-paginator
                                            [rows]="aiInsightsPerPage()"
                                            [totalRecords]="filteredAiInsights().length"
                                            [first]="aiInsightsFirst()"
                                            (onPageChange)="aiInsightsPage.set($event.page ?? 0)"
                                            [pageLinkSize]="3"
                                            styleClass="w-full border-none! bg-transparent!"
                                            [pt]="{ root: { class: 'bg-transparent! relative! w-full! justify-center!' } }"
                                        />
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </ux-ai-card-bg>

                        <!-- Contact -->
                        <div class="card flex flex-col gap-4 animate-fade-in-up stagger-1">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-user text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Focal Point</h4>
                            </div>

                            @if (p.partnerFocalPointName) {
                                <div class="flex items-center gap-3">
                                    <div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 shrink-0">
                                        <i class="pi pi-user text-primary text-base"></i>
                                    </div>
                                    <div class="flex flex-col gap-0.5">
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-semibold">{{ p.partnerFocalPointName }}</span>
                                        <span class="text-surface-500 dark:text-surface-400 text-xs">Partner Focal Point</span>
                                    </div>
                                </div>
                            } @else {
                                <span class="text-surface-500 dark:text-surface-400 text-sm italic">No focal point assigned</span>
                            }
                        </div>

                        <!-- Location & Office -->
                        <div class="card flex flex-col gap-4 animate-fade-in-up stagger-2">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-map-marker text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Location</h4>
                            </div>

                            <div class="flex flex-col gap-4">
                                @if (p.address1Country) {
                                    <div class="flex items-start gap-3">
                                        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0 overflow-hidden">
                                            <img [src]="flagUrl()" [alt]="p.address1Country" class="w-7 h-7 object-contain" />
                                        </div>
                                        <div class="flex flex-col gap-0.5">
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-semibold">{{ p.address1Country }}</span>
                                            @if (p.address1City) {
                                                <span class="text-surface-500 dark:text-surface-400 text-xs">{{ p.address1City }}</span>
                                            }
                                        </div>
                                    </div>
                                }

                                @if (p.liaisonOfficeName) {
                                    <p-divider styleClass="my-0!" />
                                    <div class="flex items-center gap-3">
                                        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 shrink-0">
                                            <i class="pi pi-building text-surface-600 dark:text-surface-300"></i>
                                        </div>
                                        <div class="flex flex-col gap-0.5">
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-semibold">{{ p.liaisonOfficeName }}</span>
                                            <span class="text-surface-500 dark:text-surface-400 text-xs">Liaison Office</span>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>

                        <!-- Metadata -->
                        <div class="card flex flex-col gap-4 animate-fade-in-up stagger-3">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-clock text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Record Info</h4>
                            </div>

                            <div class="flex flex-col gap-3">
                                @if (p.createdDate) {
                                    <div class="flex items-center justify-between">
                                        <span class="text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">Created</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm">{{ p.createdDate | date:'mediumDate' }}</span>
                                    </div>
                                }
                                @if (p.lastModifiedDate) {
                                    <div class="flex items-center justify-between">
                                        <span class="text-surface-500 dark:text-surface-400 text-xs font-semibold uppercase tracking-wider">Last Modified</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm">{{ p.lastModifiedDate | date:'mediumDate' }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Bar -->
                <div class="flex items-center animate-fade-in">
                    <p-button
                        icon="pi pi-chevron-left"
                        label="Back to list"
                        [text]="true"
                        severity="secondary"
                        routerLink="/apps/partners"
                    />
                </div>
            </div>

            <!-- Edit Partner Drawer -->
            <p-drawer [(visible)]="showEditDrawer" position="right" styleClass="w-full! max-w-[480px]!" appendTo="body">
                <ng-template #header>
                    <h4 class="title-h4 text-left!">Edit Partner</h4>
                </ng-template>

                <div class="flex flex-col h-full">
                    <div class="flex-1 flex flex-col gap-6 overflow-y-auto">
                        <div class="flex flex-col gap-2">
                            <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Full Name</label>
                            <input pInputText [(ngModel)]="editForm.name" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Short Name</label>
                            <input pInputText [(ngModel)]="editForm.shortName" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Description</label>
                            <textarea pTextarea [(ngModel)]="editForm.partnerDescription" [rows]="3" class="w-full"></textarea>
                        </div>

                        <p-divider styleClass="my-0!" />

                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Category</label>
                                <p-select [(ngModel)]="editForm.partnerCategoryName" [options]="categoryOptions" placeholder="Select category" styleClass="w-full" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Group</label>
                                <input pInputText [(ngModel)]="editForm.partnerGroupName" class="w-full" />
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Status</label>
                                <p-select [(ngModel)]="editForm.status" [options]="statusOptions" placeholder="Select status" styleClass="w-full" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Approval Status</label>
                                <p-select [(ngModel)]="editForm.partnerApprovalStatus" [options]="approvalOptions" optionLabel="label" optionValue="value" placeholder="Select approval" styleClass="w-full" />
                            </div>
                        </div>

                        <div class="flex items-center gap-3">
                            <p-toggleswitch [(ngModel)]="editForm.keyGlobalPartner" />
                            <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Key Global Partner</label>
                        </div>

                        <p-divider styleClass="my-0!" />

                        <div class="flex flex-col gap-2">
                            <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Focal Point</label>
                            <input pInputText [(ngModel)]="editForm.partnerFocalPointName" class="w-full" />
                        </div>

                        <div class="flex flex-col gap-2">
                            <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Liaison Office</label>
                            <input pInputText [(ngModel)]="editForm.liaisonOfficeName" class="w-full" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">Country</label>
                                <input pInputText [(ngModel)]="editForm.address1Country" class="w-full" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-sm font-medium">City</label>
                                <input pInputText [(ngModel)]="editForm.address1City" class="w-full" />
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 py-6 pt-4 border-t border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900">
                        <p-button label="Save Changes" severity="primary" styleClass="w-full cursor-pointer" (onClick)="savePartner()" />
                        <p-button label="Cancel" severity="secondary" [outlined]="true" styleClass="w-full cursor-pointer" (onClick)="showEditDrawer = false" />
                    </div>
                </div>
            </p-drawer>
        } @else {
            <div class="flex flex-col items-center justify-center gap-4 py-20">
                <i class="pi pi-info-circle text-4xl text-surface-400"></i>
                <span class="text-surface-600 dark:text-surface-300 text-lg">Partner not found</span>
                <p-button label="Back to Partners" icon="pi pi-arrow-left" routerLink="/apps/partners" />
            </div>
        }
    `
})
export class PartnerDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private partnerService = inject(PartnerService);

    partner = computed(() => {
        const id = this.partnerId();
        if (!id) return null;
        return this.partnerService.allPartners().find(p => p.id === id) ?? null;
    });

    partnerId = signal<string | null>(null);

    showEditDrawer = false;
    editForm: Partial<Partner> & { keyGlobalPartner: boolean } = {
        name: '', shortName: '', partnerDescription: '', partnerCategoryName: '',
        partnerGroupName: '', status: '', partnerApprovalStatus: '',
        keyGlobalPartner: false, partnerFocalPointName: '', liaisonOfficeName: '',
        address1Country: '', address1City: ''
    };

    categoryOptions = ['Government', 'NGO', 'UN Agency', 'Multilateral', 'Private Sector', 'Academic'];
    statusOptions = ['Active', 'Draft', 'Closed', 'Archived'];
    approvalOptions = [
        { label: 'Approved', value: 'Approved' },
        { label: 'Not Approved', value: 'NotApproved' }
    ];

    flagUrl = computed(() => {
        const p = this.partner();
        if (!p) return 'flags/globe.svg';
        if (p.partnerCategoryCode === 'UN') return 'flags/un.svg';
        if (!p.address1Country) return 'flags/globe.svg';
        const code = COUNTRY_TO_FLAG[p.address1Country.toLowerCase()];
        return code ? `flags/${code}.svg` : 'flags/globe.svg';
    });

    // ─── AI Analysis ───
    isAiCardExpanded = signal(false);
    aiSearchQuery = signal('');
    aiInsights: AiInsight[] = [
        { id: 1, title: 'Due Diligence Expiring', description: 'This partner\'s due diligence assessment expires in 30 days. A renewal process should be initiated to avoid partnership suspension.', actionLabel: 'Start renewal process', icon: 'pi-exclamation-triangle', iconColor: 'text-orange-500' },
        { id: 2, title: 'High Opportunity Conversion', description: 'This partner has a 78% opportunity-to-agreement conversion rate, significantly above the 52% portfolio average.', actionLabel: 'View performance report', icon: 'pi-chart-line', iconColor: 'text-green-500' },
        { id: 3, title: 'Capacity Gap Identified', description: 'Recent project evaluations suggest a gap in financial reporting capacity. Targeted training could improve compliance scores.', actionLabel: 'Recommend capacity plan', icon: 'pi-graduation-cap', iconColor: 'text-blue-500' },
        { id: 4, title: 'Geographic Expansion', description: 'This partner has expressed interest in operations in 3 new countries where UNOPS has active programmes. Cross-referencing shows strong alignment.', actionLabel: 'View matching programmes', icon: 'pi-globe', iconColor: 'text-teal-500' },
        { id: 5, title: 'Compliance Risk: Low', description: 'All required documentation is current. No audit findings in the last 24 months. Risk rating remains at the lowest tier.', actionLabel: 'View compliance dashboard', icon: 'pi-shield', iconColor: 'text-green-600' },
        { id: 6, title: 'Engagement Trend Declining', description: 'Active opportunities with this partner dropped from 8 to 3 in the past 6 months. Engagement may need revitalization.', actionLabel: 'Draft engagement strategy', icon: 'pi-chart-bar', iconColor: 'text-red-500' },
        { id: 7, title: 'Similar Partners Found', description: '3 other partners in the same category and region have overlapping mandates. Consolidation or coordination may reduce duplication.', actionLabel: 'Compare partner profiles', icon: 'pi-search', iconColor: 'text-blue-600' },
        { id: 8, title: 'Funding Cycle Alignment', description: 'This partner\'s fiscal year ends in Q2. Aligning new proposals with their budget cycle could improve approval rates by ~35%.', actionLabel: 'View fiscal calendar', icon: 'pi-calendar', iconColor: 'text-orange-500' },
        { id: 9, title: 'Key Contact Changes', description: '2 primary focal points at this partner organization have changed roles in the last quarter. Relationship mapping should be updated.', actionLabel: 'Update contact records', icon: 'pi-users', iconColor: 'text-cherry-500' },
        { id: 10, title: 'Agreement Renewal Window', description: '1 framework agreement with this partner expires in 90 days. Early renewal discussions are recommended.', actionLabel: 'Draft renewal proposal', icon: 'pi-clock', iconColor: 'text-teal-500' },
    ];

    filteredAiInsights = computed(() => {
        const query = this.aiSearchQuery().trim().toLowerCase();
        if (!query) return this.aiInsights;
        return this.aiInsights.filter(insight =>
            insight.title.toLowerCase().includes(query) ||
            insight.description.toLowerCase().includes(query)
        );
    });

    private destroyRef = inject(DestroyRef);
    aiInsightsPerPage = signal(this.calcInsightsPerPage());
    aiInsightsPage = signal(0);
    aiInsightsFirst = computed(() => this.aiInsightsPage() * this.aiInsightsPerPage());
    paginatedAiInsights = computed(() => {
        const insights = this.filteredAiInsights();
        return insights.slice(this.aiInsightsFirst(), this.aiInsightsFirst() + this.aiInsightsPerPage());
    });

    private calcInsightsPerPage(): number {
        const shellOffset = 12 * 16;
        const cardChrome = 160 + 72;
        const insightCardHeight = 150;
        const available = (typeof window !== 'undefined' ? window.innerHeight : 900) - shellOffset - cardChrome;
        return Math.max(1, Math.floor(available / insightCardHeight));
    }

    ngOnInit() {
        this.partnerService.getPartners();
        this.partnerId.set(this.route.snapshot.paramMap.get('id'));

        const onResize = () => this.aiInsightsPerPage.set(this.calcInsightsPerPage());
        window.addEventListener('resize', onResize);
        this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    }

    getStatusClass = getPartnerStatusClass;
    getApprovalClass = getPartnerApprovalClass;

    getApprovalLabel(status: string): string {
        const labels: Record<string, string> = {
            NotApproved: 'Not Approved'
        };
        return labels[status] ?? status;
    }

    openEditDrawer() {
        const p = this.partner();
        if (!p) return;
        this.editForm = {
            name: p.name ?? '',
            shortName: p.shortName ?? '',
            partnerDescription: p.partnerDescription ?? '',
            partnerCategoryName: p.partnerCategoryName ?? '',
            partnerGroupName: p.partnerGroupName ?? '',
            status: p.status ?? '',
            partnerApprovalStatus: p.partnerApprovalStatus ?? '',
            keyGlobalPartner: p.keyGlobalPartner ?? false,
            partnerFocalPointName: p.partnerFocalPointName ?? '',
            liaisonOfficeName: p.liaisonOfficeName ?? '',
            address1Country: p.address1Country ?? '',
            address1City: p.address1City ?? ''
        };
        this.showEditDrawer = true;
    }

    savePartner() {
        this.partnerService.updatePartner(this.partnerId()!, this.editForm);
        this.showEditDrawer = false;
    }
}
