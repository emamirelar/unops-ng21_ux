import { Component, computed, DestroyRef, inject, model, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TaskDrawer } from '../tasklist/task-drawer';
import { DocumentsCard, DocumentItem } from '../documents';
import { AiInsight, AiInsightsCardComponent, DetailLayoutComponent, DetailTabDirective, FooterService, PillTabsComponent } from '@unopsitg/ux';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { DrawerModule } from 'primeng/drawer';


interface Member {
    name?: string;
    image: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    completed: boolean;
    startDate: string | null;
    endDate: string | null;
    members: Member[];
}

interface ActivityItem {
    id: number;
    title: string;
    icon: string;
    description: string;
    author: string;
    time: string;
    dotColor: string;
    ringColor: string;
}

type Document = DocumentItem;

interface Deliverable {
    id: number;
    name: string;
    hierarchy: string;
    serviceLine: string;
    quantity: number;
    requiresProcurement: boolean;
}

interface SDGAlignment {
    number: number;
    name: string;
    isPrimary: boolean;
    targets: string[];
    color: string;
}

interface CrossCuttingConcern {
    label: string;
    value: boolean;
}

interface Partner {
    id: number;
    name: string;
    type: 'funding' | 'client';
    status: string;
    contributionUSD: number;
    contributionPercentage: number;
    dueDiligenceStatus: string;
    dueDiligenceExpiry: string;
    agreements: string[];
}

interface Country {
    id: number;
    name: string;
    isoCode: string;
    continent: string;
    region: string;
    orgUnit: string;
    tags: string[];
    hasUNSDCF: boolean;
}

interface TimelineEvent {
    id: number;
    label: string;
    date: string;
    icon: string;
    color: string;
}

interface Risk {
    id: number;
    title: string;
    category: string;
    probability: string;
    impact: string;
    proximity: string;
    responseType: string;
    description: string;
    isOrgHighRisk: boolean;
}

interface Interaction {
    id: number;
    title: string;
    type: string;
    date: string;
    status: string;
    participants: string;
}

interface TeamMember {
    id: number;
    name: string;
    position: string;
    role: string;
    expertise: string[];
    image: string;
}

@Component({
    selector: 'app-opportunity',
    host: { class: 'block w-full' },
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        IconFieldModule,
        InputIconModule,
        TagModule,
        DividerModule,
        AvatarModule,
        AvatarGroupModule,
        AccordionModule,
        TableModule,
        PaginatorModule,
        ConfirmDialogModule,
        TaskDrawer,
        DocumentsCard,
        AiInsightsCardComponent,
        DetailLayoutComponent,
        DetailTabDirective,
        PillTabsComponent,
        TooltipModule,
        ProgressBarModule,
        DrawerModule,
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <ux-detail-layout [tabs]="detailTabs" [(activeTab)]="activeTab">

            <!-- ═══ HEADER ═══ -->
            <div ux-detail-header class="flex flex-col gap-3 py-4">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <h1 class="text-deepsea-500 dark:text-surface-0 text-xl sm:text-2xl font-extrabold leading-8 m-0">Water Sanitization</h1>
                        <div class="flex items-center gap-2">
                            <p-tag value="ID &amp; Profile" severity="info" styleClass="!bg-blue-50 dark:!bg-blue-900/30" />
                            <p-tag value="Active" severity="success" />
                        </div>
                        <span class="text-sm text-surface-600 dark:text-surface-300">OPP-2026-00142</span>
                    </div>
                </div>
            </div>
            <div ux-detail-header-meta></div>

            <!-- ═══ OVERVIEW TAB ═══ -->
            <ng-template uxDetailTab="overview">

                <!-- ═══════════════════════════════════════════════ -->
                <!-- ENTITY COMPLETION METER -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex flex-col">
                                <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Opportunity Completion Steps</span>
                            </div>
                        </div>
                        <span class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{ completionFilledTotal() }}/{{ completionTotalRecords }}</span>
                    </div>

                    <div class="flex items-center gap-1 flex-wrap">
                        @for (step of completionSteps(); track $index) {
                            <span class="inline-flex items-center justify-center w-6 h-6 rounded-full cursor-pointer"
                                  [class]="getDotStyle(step).bg"
                                  [pTooltip]="step.name + (step.filled ? '' : ' (missing)')" tooltipPosition="top"
                                  (click)="openStepDrawer($index)">
                                @if (getDotStyle(step).icon) {
                                    <i class="pi text-[3px]" [class]="getDotStyle(step).icon + ' ' + getDotStyle(step).text"></i>
                                } @else {
                                    <span class="text-sm font-black leading-none" [class]="getDotStyle(step).text">!</span>
                                }
                            </span>
                        }
                    </div>

                    <div class="flex items-center gap-6 mt-1">
                        <div class="flex items-center gap-2">
                            <span class="inline-block w-4 h-4 rounded-full shrink-0" [class]="dotStyles.mandatoryFilled.bg"></span>
                            <span class="text-sm text-surface-600 dark:text-surface-300">Mandatory:</span>
                            <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ completionMandatory.filled }}/{{ completionMandatory.total }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="inline-block w-4 h-4 rounded-full shrink-0" [class]="dotStyles.optionalFilled.bg"></span>
                            <span class="text-sm text-surface-600 dark:text-surface-300">Optional:</span>
                            <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ completionOptional.filled }}/{{ completionOptional.total }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm text-surface-600 dark:text-surface-300">Total:</span>
                            <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ completionTotalRecords }}</span>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- OVERVIEW SECTION -->
                <!-- ═══════════════════════════════════════════════ -->
                <div id="section-overview">
                            <div class="flex flex-col gap-5">
                                <div class="flex flex-col gap-1">
                                    <p class="text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0">
                                        This opportunity focuses on providing sustainable water sanitization solutions to underserved communities in East Africa and Southeast Asia. The programme will deploy modern filtration infrastructure, train local operators, and establish long-term maintenance frameworks to ensure clean water access for over 2.5 million beneficiaries across three implementation countries.
                                    </p>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    <div class="card flex flex-col gap-0.5 text-xs sm:hidden">
                                        <span class="font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Created</span>
                                        <span class="text-sm font-medium text-surface-900 dark:text-surface-0">Apr 5, 2026</span>
                                        <span class="text-surface-600 dark:text-surface-300">by Olivia Martinez</span>
                                    </div>
                                    <div class="card flex flex-col gap-0.5 text-xs sm:hidden">
                                        <span class="font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Last modified</span>
                                        <span class="text-sm font-medium text-surface-900 dark:text-surface-0">Apr 30, 2026</span>
                                        <span class="text-surface-600 dark:text-surface-300">by James Anderson</span>
                                    </div>
                                    <div class="card flex flex-col gap-1 min-w-0">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Proposed Budget</span>
                                        <span class="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-0 truncate">$15,000,000</span>
                                    </div>
                                    <div class="card card-success flex flex-col gap-1 min-w-0">
                                        <span class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Total Funded</span>
                                        <span class="text-base sm:text-lg font-bold text-green-700 dark:text-green-300 truncate">$15,000,000</span>
                                    </div>
                                    <div class="card flex flex-col gap-1 min-w-0">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Unfunded</span>
                                        <span class="text-base sm:text-lg font-bold text-surface-900 dark:text-surface-0 truncate">$0</span>
                                    </div>
                                    @for (stat of analysisStats; track stat.label) {
                                        <div class="card flex flex-col gap-1 min-w-0">
                                            <div class="flex items-center gap-2">
                                                <i class="pi text-sm" [ngClass]="[stat.icon, stat.iconColor]"></i>
                                                <span class="text-xs font-medium text-surface-600 dark:text-surface-300 uppercase tracking-wide">{{ stat.label }}</span>
                                            </div>
                                            <span class="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-0">{{ stat.value }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                </div>

            </ng-template>

            <!-- ═══ SCOPE TAB ═══ -->
            <ng-template uxDetailTab="scope">

                <ux-pill-tabs [items]="scopeSubTabs" [(activeValue)]="activeScopeSub" />

                <!-- WHAT - PRODUCTS & SERVICES -->
                @if (activeScopeSub() === 'what') {
                <div id="section-what">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="flex flex-col lg:flex-row lg:gap-10 gap-5">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Proposed Initiative Type</span>
                                        <span class="text-sm font-medium text-surface-900 dark:text-surface-0">Grant Support</span>
                                    </div>
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Delivery Modality</span>
                                        <div class="flex items-center gap-2">
                                            <p-tag value="Mixed (Direct + Grant Support)" severity="info" />
                                        </div>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Deliverables</span>
                                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        @for (deliverable of deliverables; track deliverable.id) {
                                            <div class="card flex flex-col gap-2">
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ deliverable.name }}</div>
                                                    <div class="text-sm text-surface-600 dark:text-surface-300 mt-0.5">{{ deliverable.hierarchy }}</div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <p-tag [value]="deliverable.serviceLine" severity="secondary" styleClass="text-xs" />
                                                    @if (deliverable.requiresProcurement) {
                                                        <p-tag value="Procurement" severity="warn" styleClass="text-xs" />
                                                    }
                                                    <span class="text-sm text-surface-600 dark:text-surface-300 ml-auto">Qty: {{ deliverable.quantity }}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                </div>
                }

                <!-- WHEN - TIMELINE -->
                @if (activeScopeSub() === 'when') {
                <div id="section-when">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                                    <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Submission Deadline</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">Mar 15, 2026</span>
                                    </div>
                                    <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Implementation Duration</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">24 months</span>
                                    </div>
                                    <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Target Delivery</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">May 1, 2028</span>
                                    </div>
                                    <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Implementation Start</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">May 1, 2026</span>
                                    </div>
                                    <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Target Signing</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">Apr 1, 2026</span>
                                        <p-tag value="Firm Deadline" severity="warn" styleClass="text-xs w-fit mt-1" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Signing Date Notes</span>
                                    <p class="text-sm text-surface-700 dark:text-surface-100 m-0">Signing is contingent on completion of due diligence for all partners and final approval from the regional director.</p>
                                </div>
                                <!-- Timeline -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Key Milestones</span>
                                    <!-- Phase bar -->
                                    <div class="flex rounded-lg overflow-hidden h-3">
                                        <div class="bg-blue-400 dark:bg-blue-600" style="width: 15%;" pTooltip="Development: ~110 days" tooltipPosition="top"></div>
                                        <div class="bg-green-400 dark:bg-green-600" style="width: 85%;" pTooltip="Implementation: ~730 days" tooltipPosition="top"></div>
                                    </div>
                                    <div class="flex justify-between text-sm text-surface-600 dark:text-surface-300">
                                        <span>Development</span>
                                        <span>Implementation</span>
                                    </div>
                                </div>
                                <div class="flex flex-col gap-3 mt-2">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Timeline</span>
                                    <div class="relative pl-6 mt-2">
                                        <div class="absolute left-[11px] top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"></div>
                                        @for (event of timelineEvents; track event.id; let last = $last) {
                                            <div class="flex gap-3 pb-4" [class.pb-0]="last">
                                                <div class="flex items-start pt-1 -ml-6 w-6 justify-center">
                                                    <div class="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 relative z-10" [ngClass]="[event.color, timelineRingClass(event.color)]"></div>
                                                </div>
                                                <div class="flex flex-col gap-0.5 flex-1">
                                                    <div class="flex items-center gap-2">
                                                        <i class="pi text-xs" [ngClass]="event.icon"></i>
                                                        <span class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ event.label }}</span>
                                                    </div>
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">{{ event.date }}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                </div>
                }

                <!-- WHERE - GEOGRAPHY -->
                @if (activeScopeSub() === 'where') {
                <div id="section-where">
                            <div class="flex flex-col gap-4 p-2">
                                <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Implementation Countries</span>
                                <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                                    @for (country of countries; track country.id) {
                                        <div class="card flex flex-col gap-3 sm:min-w-[220px] sm:flex-1">
                                            <div class="flex items-center gap-3">
                                                <span class="flag rounded-sm" [ngClass]="'flag-' + country.isoCode.toLowerCase()"></span>
                                                <div class="flex flex-col min-w-0">
                                                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ country.name }}</span>
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">{{ country.continent }} · {{ country.region }}</span>
                                                </div>
                                            </div>
                                            <div class="flex flex-wrap gap-1.5">
                                                @for (tag of country.tags; track tag) {
                                                    <p-tag [value]="tag" severity="secondary" styleClass="text-xs" />
                                                }
                                                @if (country.hasUNSDCF) {
                                                    <p-tag value="Active UNSDCF" severity="success" styleClass="text-xs" />
                                                }
                                            </div>
                                            <div class="pt-2 border-t border-surface-200 dark:border-surface-700">
                                                <span class="text-sm text-surface-600 dark:text-surface-300">Org Unit: </span>
                                                <span class="text-xs text-surface-700 dark:text-surface-100">{{ country.orgUnit }}</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div class="flex flex-wrap gap-4 text-sm text-surface-600 dark:text-surface-300 pt-2 border-t border-surface-200 dark:border-surface-700">
                                    <span><strong>HCA</strong> = Humanitarian, Conflict, and post-conflict Areas</span>
                                    <span><strong>SIDS</strong> = Small Island Developing States</span>
                                    <span><strong>UNSDCF</strong> = UN Sustainable Development Cooperation Framework</span>
                                </div>
                            </div>
                </div>
                }

                <!-- IMPACT (WHY) -->
                @if (activeScopeSub() === 'impact') {
                <div id="section-why">
                            <div class="flex flex-col gap-6 p-2">
                                <!-- Context & Challenges -->
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Context &amp; Challenges</span>
                                    <p class="text-sm text-surface-700 dark:text-surface-100 leading-relaxed m-0">
                                        An estimated 2.2 billion people worldwide lack safely managed drinking water. In the targeted regions of Kenya, Bangladesh, and Cambodia, contaminated water sources are a leading cause of waterborne diseases, particularly among children under five. Existing infrastructure is aging and unable to meet the growing demand driven by urbanisation and climate change.
                                    </p>
                                </div>

                                <!-- Objectives -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Partner Objectives &amp; Results</span>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="card card-info flex flex-col gap-1">
                                            <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Impact</span>
                                            <p class="text-sm text-surface-700 dark:text-surface-100 m-0">Improved health outcomes and reduced waterborne disease mortality in targeted communities by 40% within 3 years of implementation.</p>
                                        </div>
                                        <div class="card card-info flex flex-col gap-1">
                                            <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Outcomes</span>
                                            <p class="text-sm text-surface-700 dark:text-surface-100 m-0">Sustainable access to clean water for 2.5M beneficiaries; 150 local operators trained; 45 filtration facilities operational.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Cross-cutting Concerns -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Cross-cutting Concerns</span>
                                    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-2">
                                        @for (concern of crossCuttingConcerns; track concern.label) {
                                            <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-400 dark:border-surface-700 sm:min-w-[150px] sm:flex-1">
                                                <i class="pi text-sm" [ngClass]="concern.value ? 'pi-check-circle text-green-500' : 'pi-times-circle text-surface-400'"></i>
                                                <span class="text-sm text-surface-700 dark:text-surface-100">{{ concern.label }}</span>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <!-- SDG Alignment -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">SDG Alignment</span>
                                    <div class="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                                        @for (sdg of sdgAlignments; track sdg.number) {
                                            <div class="p-4 rounded-xl border border-surface-400 dark:border-surface-700 sm:min-w-[220px] sm:flex-1" [class]="sdg.isPrimary ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'bg-surface-50 dark:bg-surface-800'">
                                                <div class="flex items-start gap-3 mb-2">
                                                    <div class="size-8 shrink-0 rounded-lg flex items-center justify-center text-sm font-bold text-white" [style.background-color]="sdg.color">{{ sdg.number }}</div>
                                                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0 pt-1 flex-1 min-w-0">{{ sdg.name }}</span>
                                                    <p-tag [value]="sdg.isPrimary ? 'Primary' : 'Secondary'" [severity]="sdg.isPrimary ? 'info' : 'secondary'" styleClass="text-xs shrink-0" />
                                                </div>
                                                @if (sdg.targets.length > 0) {
                                                    <div class="flex flex-wrap gap-2">
                                                        @for (target of sdg.targets; track target) {
                                                            <p-tag [value]="target" severity="info" styleClass="text-xs" />
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                </div>
                }

            </ng-template>

            <!-- ═══ STAKEHOLDERS TAB ═══ -->
            <ng-template uxDetailTab="stakeholders">

                <ux-pill-tabs [items]="stakeholderSubTabs" [(activeValue)]="activeStakeholderSub" />

                <!-- PARTNERS (WHO) -->
                @if (activeStakeholderSub() === 'partners') {
                <div id="section-who">
                            <div class="flex flex-col gap-5 p-2">
                                <!-- Funding Partners -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Funding Partners</span>
                                    @for (partner of fundingPartners; track partner.id) {
                                        <div class="card">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                                        <i class="pi pi-building text-primary-600 dark:text-primary-400"></i>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">{{ partner.name }}</span>
                                                        <span class="text-sm text-surface-600 dark:text-surface-300">Funding Partner</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-shrink-0">
                                                    <p-tag [value]="partner.status" severity="success" styleClass="text-xs" />
                                                    <p-tag [value]="partner.contributionPercentage + '%'" severity="info" styleClass="text-xs" />
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">Contribution</span>
                                                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">\${{ partner.contributionUSD.toLocaleString() }}</span>
                                                </div>
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">Due Diligence</span>
                                                    <div class="flex items-center gap-1">
                                                        <i class="pi pi-check-circle text-xs text-green-500"></i>
                                                        <span class="text-sm text-surface-700 dark:text-surface-100">{{ partner.dueDiligenceStatus }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">DD Expiry</span>
                                                    <span class="text-sm text-surface-700 dark:text-surface-100">{{ partner.dueDiligenceExpiry }}</span>
                                                </div>
                                            </div>
                                            @if (partner.agreements.length > 0) {
                                                <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                                    <span class="text-sm text-surface-600 dark:text-surface-300 mr-1">Agreements:</span>
                                                    @for (agreement of partner.agreements; track agreement) {
                                                        <p-tag [value]="agreement" severity="secondary" styleClass="text-xs" />
                                                    }
                                                </div>
                                            }
                                        </div>
                                    }
                                </div>

                                <!-- Client Partners -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Client Partners</span>
                                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-3">
                                    @for (partner of clientPartners; track partner.id) {
                                        <div class="card card-accent">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <div class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                                                        <i class="pi pi-building text-teal-600 dark:text-teal-400"></i>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-teal-600 dark:text-teal-400 cursor-pointer hover:underline truncate">{{ partner.name }}</span>
                                                        <span class="text-sm text-surface-600 dark:text-surface-300">Client Partner</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-shrink-0">
                                                    <p-tag [value]="partner.status" severity="success" styleClass="text-xs" />
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">Due Diligence</span>
                                                    <div class="flex items-center gap-1">
                                                        <i class="pi pi-check-circle text-xs text-green-500"></i>
                                                        <span class="text-sm text-surface-700 dark:text-surface-100">{{ partner.dueDiligenceStatus }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-sm text-surface-600 dark:text-surface-300">DD Expiry</span>
                                                    <span class="text-sm text-surface-700 dark:text-surface-100">{{ partner.dueDiligenceExpiry }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </div>
                </div>
                }

                <!-- TEAM -->
                @if (activeStakeholderSub() === 'team') {
                <div id="section-team">
                            <div class="flex flex-col gap-6 p-2">
                                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    <!-- Left: Manager + Collaborators (2 cols) -->
                                    <div class="xl:col-span-2 flex flex-col gap-6">
                                        <!-- Opportunity Manager -->
                                        <div class="flex flex-col gap-3">
                                            <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Opportunity Manager</span>
                                            <div class="card card-primary">
                                                <div class="flex items-center gap-3">
                                                    <p-avatar image="demo/images/avatar/amyelsner.png" shape="circle" styleClass="w-10 h-10" />
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-primary-700 dark:text-primary-300">Olivia Martinez</span>
                                                        <span class="text-xs text-primary-600 dark:text-primary-400">Programme Manager, P4 · KEOC</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Collaborators -->
                                        <div class="flex flex-col gap-3">
                                            <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Opportunity Collaborators</span>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
                                                @for (member of teamMembers; track member.id) {
                                                    <div class="card flex flex-col gap-2">
                                                        <div class="flex items-center gap-3">
                                                            <p-avatar [image]="'demo/images/avatar/' + member.image" shape="circle" styleClass="w-9 h-9" />
                                                            <div class="flex items-center gap-2 flex-1 min-w-0">
                                                                <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ member.name }}</span>
                                                                <p-tag [value]="member.role" severity="secondary" styleClass="text-xs" />
                                                            </div>
                                                        </div>
                                                        <span class="text-sm text-surface-600 dark:text-surface-300">{{ member.position }}</span>
                                                        @if (member.expertise.length > 0) {
                                                            <div class="flex flex-wrap gap-1.5">
                                                                @for (skill of member.expertise; track skill) {
                                                                    <p-tag [value]="skill" severity="info" styleClass="text-xs whitespace-nowrap" />
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <!-- Right: Decision-Making Pathway (1 col) -->
                                    <div class="flex flex-col gap-3">
                                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Decision-Making Pathway</span>
                                        <div class="card">
                                            <div class="flex flex-col gap-2">
                                                @for (step of decisionPathway; track step.step; let last = $last) {
                                                    <div class="flex items-start gap-3">
                                                        <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                                                            [class]="step.completed
                                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                                                                : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600'">
                                                            @if (step.completed) {
                                                                <i class="pi pi-check text-xs"></i>
                                                            } @else {
                                                                {{ step.step }}
                                                            }
                                                        </div>
                                                        <div class="flex flex-col flex-1 pb-3" [class.border-b]="!last" [class.border-surface-200]="!last" [class.dark:border-surface-700]="!last">
                                                            <span class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ step.label }}</span>
                                                            <span class="text-sm text-surface-600 dark:text-surface-300">{{ step.approver }}</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                </div>
                }

                <!-- BENEFICIARIES -->
                @if (activeStakeholderSub() === 'beneficiaries') {
                <div id="section-beneficiaries">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="card flex flex-col gap-1">
                                        <span class="text-sm text-surface-600 dark:text-surface-300">Direct</span>
                                        <span class="text-lg font-bold text-surface-900 dark:text-surface-0">850,000</span>
                                    </div>
                                    <div class="card flex flex-col gap-1">
                                        <span class="text-sm text-surface-600 dark:text-surface-300">Indirect</span>
                                        <span class="text-lg font-bold text-surface-900 dark:text-surface-0">1,650,000</span>
                                    </div>
                                    <div class="card card-primary flex flex-col gap-1">
                                        <span class="text-xs text-primary-600 dark:text-primary-400">Total</span>
                                        <span class="text-lg font-bold text-primary-700 dark:text-primary-300">2,500,000</span>
                                    </div>
                                </div>
                                <p class="text-sm text-surface-700 dark:text-surface-100 m-0">
                                    Beneficiaries include rural and peri-urban households in water-stressed districts, with a priority focus on women and children who bear the primary burden of water collection and waterborne illness.
                                </p>
                            </div>
                </div>
                }

            </ng-template>

            <!-- ═══ RISK TAB ═══ -->
            <ng-template uxDetailTab="risk">

                <!-- ═══════════════════════════════════════════════ -->
                <!-- RISKS -->
                <!-- ═══════════════════════════════════════════════ -->
                <div id="section-risks">
                            <div class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                                @for (risk of risks; track risk.id) {
                                    <div [class]="riskCardClass(risk) + ' flex flex-col h-full'">
                                        <div class="flex flex-col gap-2 flex-1">
                                            <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ risk.title }}</span>
                                            <div class="flex flex-wrap items-center gap-2">
                                                @if (risk.isOrgHighRisk) {
                                                    <p-tag value="Org. High Risk" severity="danger" styleClass="text-xs" />
                                                }
                                                <p-tag [value]="risk.category" severity="secondary" styleClass="text-xs" />
                                                <p-tag [value]="risk.probability" [severity]="risk.probability === 'High' ? 'danger' : risk.probability === 'Medium' ? 'warn' : 'secondary'" styleClass="text-xs" />
                                            </div>
                                            <p class="text-sm text-surface-700 dark:text-surface-100 m-0">{{ risk.description }}</p>
                                            <div class="flex flex-wrap gap-4 text-sm text-surface-600 dark:text-surface-300 pt-2 border-t border-surface-200 dark:border-surface-700 mt-auto">
                                                <span><strong>Impact:</strong> {{ risk.impact }}</span>
                                                <span><strong>Proximity:</strong> {{ risk.proximity }}</span>
                                                <span><strong>Response:</strong> {{ risk.responseType }}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                </div>

            </ng-template>

            <!-- ═══ ACTIVITY TAB ═══ -->
            <ng-template uxDetailTab="activity">
                <!-- ═══════════════════════════════════════════════ -->
                <!-- ACTIVITY FEED -->
                <!-- ═══════════════════════════════════════════════ -->
                <div id="section-activity" class="card">
                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide px-2 pt-2">Latest Activity</span>
                        <div class="pb-3 pt-3 px-2">
                            <div class="relative">
                                <div class="absolute left-[10px] top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"></div>
                                <div class="flex flex-col gap-4">
                                    @for (activity of paginatedActivities(); track activity.id; let last = $last) {
                                        <div class="flex gap-3">
                                            <div class="flex items-start pt-2.5 w-6 justify-center">
                                                <div class="w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 relative z-10" [ngClass]="[activity.dotColor, activity.ringColor]"></div>
                                            </div>
                                            <div class="flex-1 pb-4" [class.border-b]="!last" [class.border-surface-200]="!last" [class.dark:border-surface-700]="!last">
                                                <div class="flex flex-col gap-2">
                                                    <div class="flex flex-col gap-1">
                                                        <div class="flex items-center gap-1">
                                                            <i class="pi text-sm text-surface-700 dark:text-surface-100" [ngClass]="activity.icon"></i>
                                                            <span class="text-surface-950 dark:text-surface-0 text-base font-medium leading-normal">{{ activity.title }}</span>
                                                        </div>
                                                        <p class="text-surface-700 dark:text-surface-100 text-sm leading-tight">{{ activity.description }}</p>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-tight">{{ activity.time }}</span>
                                                        <div class="w-0 h-[6px] border-l border-surface-200 dark:border-surface-700"></div>
                                                        <span class="text-surface-700 dark:text-surface-100 text-sm leading-tight">{{ activity.author }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>

                        <p-paginator
                            [rows]="activityRowsPerPage"
                            [totalRecords]="activityFeed.length"
                            [first]="activityFirst()"
                            (onPageChange)="activityPage.set($event.page ?? 0)"
                            styleClass="border-t border-surface-200 dark:border-surface-700"
                        />
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- RELATED -->
                <!-- ═══════════════════════════════════════════════ -->
                <div id="section-related" class="card">
                            <div class="flex flex-col gap-3">
                                <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Source Interactions</span>
                                <p-table
                                    [value]="interactions"
                                    styleClass="flex flex-col rounded-2xl overflow-hidden"
                                    tableStyleClass="w-full"
                                >
                                    <ng-template #header>
                                        <tr>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th class="hidden sm:table-cell">Date</th>
                                            <th class="hidden sm:table-cell">Status</th>
                                        </tr>
                                    </ng-template>
                                    <ng-template #body let-item>
                                        <tr class="cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                                            <td>
                                                <span class="text-sm text-primary-600 dark:text-primary-400 font-medium">{{ item.title }}</span>
                                            </td>
                                            <td><p-tag [value]="item.type" severity="secondary" styleClass="text-xs" /></td>
                                            <td class="hidden sm:table-cell"><span class="text-sm text-surface-600 dark:text-surface-300">{{ item.date }}</span></td>
                                            <td class="hidden sm:table-cell"><p-tag [value]="item.status" [severity]="item.status === 'Completed' ? 'success' : 'info'" styleClass="text-xs" /></td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- COLLABORATION (Comments) -->
                <!-- ═══════════════════════════════════════════════ -->
                <div id="section-collaboration" class="card">
                            <div class="flex flex-col gap-4">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-semibold text-surface-700 dark:text-surface-100">Comments</span>
                                    <p-tag [value]="'' + comments.length" styleClass="text-xs font-semibold" />
                                </div>
                                @for (comment of comments; track comment.id) {
                                    <div class="flex gap-3">
                                        <p-avatar [image]="'demo/images/avatar/' + comment.avatar" shape="circle" styleClass="w-8 h-8 flex-shrink-0" />
                                        <div class="flex flex-col gap-1 flex-1">
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ comment.author }}</span>
                                                <span class="text-sm text-surface-600 dark:text-surface-300">{{ comment.time }}</span>
                                            </div>
                                            <p class="text-sm text-surface-700 dark:text-surface-100 m-0">{{ comment.text }}</p>
                                        </div>
                                    </div>
                                }
                                <div class="flex gap-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                    <p-avatar icon="pi pi-user" shape="circle" styleClass="w-8 h-8 flex-shrink-0 bg-surface-200 dark:bg-surface-700" />
                                    <div class="flex-1 flex items-center gap-2">
                                        <input pInputText placeholder="Write a comment..." class="w-full" />
                                        <p-button icon="pi pi-send" [rounded]="true" size="small" />
                                    </div>
                                </div>
                            </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- TASKS (existing) -->
                <!-- ═══════════════════════════════════════════════ -->
                <div id="section-tasks" class="card">
                    <div class="flex flex-col gap-6">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Tasks</span>
                            <p-button icon="pi pi-plus" label="New Task" [outlined]="true" size="small" styleClass="!text-primary-600 !border-primary-600" (onClick)="openNewTaskDrawer()" />
                        </div>
                        <div class="flex flex-wrap gap-2" role="tablist" aria-label="Task filters">
                            @for (filter of taskFilterOptions; track filter.key) {
                                <button
                                    role="tab"
                                    [attr.aria-selected]="activeTaskFilter() === filter.key"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer"
                                    [ngClass]="activeTaskFilter() === filter.key ? filter.activeClass : filter.inactiveClass"
                                    (click)="selectTaskFilter(filter.key)"
                                >
                                    <i class="pi text-xs" [ngClass]="filter.icon.replace('pi ', '')"></i>
                                    {{ filter.label }}
                                    @if (taskCounts()[filter.countKey] > 0) {
                                        <span class="text-xs opacity-70">{{ taskCounts()[filter.countKey] }}</span>
                                    }
                                </button>
                            }
                        </div>

                        <p-iconfield>
                            <p-inputicon class="pi pi-search" />
                            <input pInputText [(ngModel)]="taskSearchQuery" placeholder="Search tasks" class="w-full" />
                        </p-iconfield>

                        <p-accordion [(value)]="openTaskPanels" [multiple]="true" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                            @if (inProgressTasks().length > 0) {
                                <p-accordionpanel value="1" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                                    <p-accordionheader [pt]="{ root: { class: 'pl-0! bg-transparent! hover:bg-yellow-50! dark:hover:bg-yellow-700/20! rounded-lg transition-colors' } }">
                                        <div class="flex items-center gap-3 px-2">
                                            <i class="pi pi-clock text-sm text-yellow-500"></i>
                                            <h5 class="title-h5 text-left!">In Progress</h5>
                                        </div>
                                    </p-accordionheader>
                                    <p-accordioncontent [pt]="accordionContentPT">
                                        <div class="flex flex-col">
                                            @for (task of inProgressTasks(); track task.id; let last = $last) {
                                                <ng-container *ngTemplateOutlet="taskItem; context: { task: task, isLast: last }"></ng-container>
                                            }
                                        </div>
                                    </p-accordioncontent>
                                </p-accordionpanel>
                            }

                            <p-divider />

                            @if (pendingTasks().length > 0) {
                                <p-accordionpanel value="0" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                                    <p-accordionheader [pt]="{ root: { class: 'pl-0! bg-transparent! hover:bg-blue-50! dark:hover:bg-blue-700/20! rounded-lg transition-colors' } }">
                                        <div class="flex items-center gap-3 px-2">
                                            <i class="pi pi-inbox text-sm text-blue-500"></i>
                                            <h5 class="title-h5 text-left!">Not Started</h5>
                                        </div>
                                    </p-accordionheader>
                                    <p-accordioncontent [pt]="accordionContentPT">
                                        <div class="flex flex-col">
                                            @for (task of pendingTasks(); track task.id; let last = $last) {
                                                <ng-container *ngTemplateOutlet="taskItem; context: { task: task, isLast: last }"></ng-container>
                                            }
                                        </div>
                                    </p-accordioncontent>
                                </p-accordionpanel>
                            }

                            <p-divider />

                            @if (completedTasks().length > 0) {
                                <p-accordionpanel value="2" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                                    <p-accordionheader [pt]="{ root: { class: 'pl-0! bg-transparent! hover:bg-green-50! dark:hover:bg-green-700/20! rounded-lg transition-colors' } }">
                                        <div class="flex items-center gap-3 px-2">
                                            <i class="pi pi-check-circle text-sm text-green-500"></i>
                                            <h5 class="title-h5 text-left!">Completed</h5>
                                        </div>
                                    </p-accordionheader>
                                    <p-accordioncontent [pt]="accordionContentPT">
                                        <div class="flex flex-col">
                                            @for (task of completedTasks(); track task.id; let last = $last) {
                                                <ng-container *ngTemplateOutlet="taskItem; context: { task: task, isLast: last }"></ng-container>
                                            }
                                        </div>
                                    </p-accordioncontent>
                                </p-accordionpanel>
                            }
                        </p-accordion>
                    </div>
                </div>

            </ng-template>

           

            <!-- ═══ SIDEBAR ═══ -->
            <ng-container ux-detail-sidebar>
                <ux-ai-insights-card
                    title="AI Project Analysis"
                    [insights]="aiInsights"
                    searchPlaceholder="Search AI insights, risks, or optimizations..."
                />

                <app-documents-card [documents]="documents()" />
            </ng-container>

        </ux-detail-layout>

        <ng-template #footerContent>
            <div class="footer-desktop">
                <span class="footer-item"><i class="pi pi-building text-xs"></i><span class="footer-item-content">KEOC - Kenya Operations Centre</span></span>
                <span class="footer-item"><i class="pi pi-calendar text-xs"></i><span class="footer-item-content"><strong>Target signing:</strong> <span>Apr 1, 2026</span></span></span>
                <span class="footer-item-wide"><span><strong>Created:</strong> Apr 5, 2026</span><span><strong>by:</strong> Olivia Martinez</span></span>
                <span class="footer-item-wide"><span><strong>Last modified:</strong> Apr 30, 2026</span><span><strong>by:</strong> James Anderson</span></span>
            </div>

            <div class="footer-mobile">
                <span class="footer-item"><i class="pi pi-building text-xs"></i><span class="footer-item-content">KEOC - Kenya Operations Centre</span></span>
                <span class="footer-item"><i class="pi pi-calendar text-xs"></i><span class="footer-item-content"><strong>Target signing:</strong> <span>Apr 1, 2026</span></span></span>
            </div>
        </ng-template>

        <p-confirmdialog header="Confirmation" />
        <app-task-drawer [(visible)]="isTaskDrawerVisible" [task]="selectedTask" [mode]="taskDrawerMode" (save)="handleTaskDrawerSave($event)" (cancel)="handleTaskDrawerCancel()" />

        <!-- Step Completion Drawer -->
        <p-drawer [(visible)]="isStepDrawerVisible" position="right" styleClass="w-full! md:w-[420px]!" appendTo="body">
            @if (selectedStep(); as step) {
                <ng-template #header>
                    <div class="flex items-center gap-3">
                        <span class="inline-flex items-center justify-center w-8 h-8 rounded-full" [class]="getDotStyle(step).bg">
                            @if (getDotStyle(step).icon) {
                                <i class="pi text-sm" [class]="getDotStyle(step).icon + ' ' + getDotStyle(step).text"></i>
                            } @else {
                                <span class="text-sm font-black leading-none" [class]="getDotStyle(step).text">!</span>
                            }
                        </span>
                        <div class="flex flex-col">
                            <span class="font-semibold text-surface-900 dark:text-surface-0">{{ step.name }}</span>
                            <span class="text-sm text-surface-400">
                                {{ step.type === 'mandatory' ? 'Mandatory' : 'Optional' }}
                                · {{ step.filled ? 'Completed' : 'Missing' }}
                            </span>
                        </div>
                    </div>
                </ng-template>

                <div class="flex flex-col gap-5">
                    <div class="flex items-center gap-4">
                        <div class="flex flex-col gap-0.5">
                            <span class="text-xs text-surface-500 dark:text-surface-400">Type</span>
                            <span class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ step.type === 'mandatory' ? 'Mandatory' : 'Optional' }}</span>
                        </div>
                        <div class="flex flex-col gap-0.5">
                            <span class="text-xs text-surface-500 dark:text-surface-400">Status</span>
                            <span class="text-sm font-medium" [class]="step.filled ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                                {{ step.filled ? 'Completed' : 'Missing' }}
                            </span>
                        </div>
                    </div>

                    @if (!step.filled) {
                        @for (field of step.fields; track field.label) {
                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-semibold text-surface-700 dark:text-surface-200">{{ field.label }}</label>
                                <input type="text" pInputText [(ngModel)]="stepDrawerValues[field.label]" [placeholder]="field.placeholder" class="w-full" />
                                @if (field.aiSuggestions?.length) {
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <i class="pi pi-sparkles text-ai-500 dark:text-ai-400 text-xs"></i>
                                        @for (suggestion of field.aiSuggestions; track suggestion) {
                                            <button
                                                type="button"
                                                class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium
                                                       bg-ai-50 dark:bg-ai-900/30 text-ai-700 dark:text-ai-300
                                                       border border-ai-200 dark:border-ai-700/50
                                                       hover:bg-ai-100 dark:hover:bg-ai-800/40 hover:border-ai-300 dark:hover:border-ai-600
                                                       transition-colors cursor-pointer"
                                                (click)="stepDrawerValues[field.label] = suggestion"
                                            >
                                                {{ suggestion }}
                                            </button>
                                        }
                                    </div>
                                }
                            </div>
                        }

                        <div class="card bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                            <div class="flex items-start gap-3">
                                <i class="pi pi-exclamation-triangle text-orange-500 mt-0.5"></i>
                                <div class="flex flex-col gap-1">
                                    <span class="text-sm font-semibold text-orange-700 dark:text-orange-300">Missing Record</span>
                                    <span class="text-xs text-orange-600 dark:text-orange-400">Complete the fields above to register this entry.</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 mt-2 justify-end">
                            <p-button label="Cancel" icon="pi pi-times" [outlined]="true" severity="secondary" (onClick)="isStepDrawerVisible = false" />
                            <p-button label="Save" icon="pi pi-check" (onClick)="saveStepDrawer()" />
                        </div>
                    }
                </div>
            }
        </p-drawer>

        <!-- Unified Task Item Template -->
        <ng-template #taskItem let-task="task" let-isLast="isLast">
            <div class="flex flex-col">
                <div class="px-2 pt-3 pb-1">
                    <div class="flex items-center gap-3">
                        <p-checkbox [(ngModel)]="task.completed" [binary]="true" [inputId]="'opp-task-' + task.id" [ariaLabel]="'Mark ' + task.title + ' as ' + (task.completed ? 'incomplete' : 'complete')" (onChange)="toggleTaskCompletion(task, task.completed)" />
                        <div class="text-sm font-medium leading-normal transition-all duration-300 flex-1" [ngClass]="task.completed ? 'text-surface-700 dark:text-surface-100 line-through' : 'text-surface-900 dark:text-surface-0'">
                            {{ task.title }}
                        </div>
                    </div>
                    @if (task.description && !task.completed) {
                        <div class="text-surface-700 dark:text-surface-100 text-xs leading-tight line-clamp-2 pl-8 pt-1">{{ task.description }}</div>
                    }
                </div>
                <div class="pl-8 pr-2 pt-1 pb-3 flex items-center gap-2">
                    @if (task.startDate) {
                        <p-tag [value]="task.startDate" severity="secondary" size="small" />
                    }
                    @if (task.startDate && task.endDate) {
                        <span class="text-surface-600 dark:text-surface-300 text-sm">-</span>
                    }
                    @if (task.endDate) {
                        <p-tag [value]="task.endDate" severity="secondary" size="small" />
                    }
                    @if (!task.completed && task.members?.length > 0) {
                        <div class="ml-auto">
                            <p-avatargroup>
                                @for (member of task.members.slice(0, 3); track member.image) {
                                    <p-avatar [image]="'demo/images/avatar/' + member.image" shape="circle" styleClass="border border-surface-0 dark:border-surface-900 w-6 h-6" />
                                }
                                @if (task.members.length > 3) {
                                    <p-avatar [label]="'+' + (task.members.length - 3)" shape="circle" styleClass="bg-primary-500 text-surface-0 border border-surface-0 dark:border-surface-900 w-6 h-6" />
                                }
                            </p-avatargroup>
                        </div>
                    }
                    <div class="flex items-center gap-1" [class.ml-auto]="task.completed || !task.members?.length">
                        <p-button icon="pi pi-pencil" [text]="true" [rounded]="true" size="small" severity="secondary" styleClass="cursor-pointer" ariaLabel="Edit task" (onClick)="openEditTaskDrawer(task)" />
                        <p-button icon="pi pi-trash" [text]="true" [rounded]="true" size="small" severity="secondary" styleClass="cursor-pointer" ariaLabel="Delete task" (onClick)="deleteTask(task.id)" />
                    </div>
                </div>
                @if (!isLast) {
                    <p-divider type="dashed" styleClass="mx-2 my-1" />
                }
            </div>
        </ng-template>
    `,
    styles: `
        :host ::ng-deep .p-datatable th:first-child,
        :host ::ng-deep .p-datatable td:first-child {
            padding-left: 0;
            padding-right: 0;
        }

        :host ::ng-deep .p-datatable th,
        :host ::ng-deep .p-datatable td {
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
        }

        :host ::ng-deep .p-datatable th:nth-child(3),
        :host ::ng-deep .p-datatable td:nth-child(3) {
            padding-left: 0;
            padding-right: 0;
        }

        :host ::ng-deep .p-datatable .p-datatable-thead > tr,
        :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
        :host ::ng-deep .p-datatable .p-datatable-tbody > tr,
        :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
            background: transparent;
        }


    `
})
export class Opportunity {

    // ─── Footer ───
    private footerService = inject(FooterService);
    @ViewChild('footerContent', { static: true }) footerTpl!: TemplateRef<unknown>;

    ngOnInit() {
        this.footerService.content.set(this.footerTpl);
    }

    // ─── Tab Navigation (powered by ux-detail-layout) ───
    detailTabs = [
        { value: 'overview', label: 'Overview', icon: 'pi pi-chart-bar' },
        { value: 'scope', label: 'Scope', icon: 'pi pi-briefcase' },
        { value: 'stakeholders', label: 'Stakeholders', icon: 'pi pi-users' },
        { value: 'risk', label: 'Risk & Compliance', icon: 'pi pi-chart-line' },
        { value: 'activity', label: 'Activity', icon: 'pi pi-history' }
    ];
    activeTab = signal('overview');

    // ─── Sub-tab Navigation ───
    activeScopeSub = signal('what');
    activeStakeholderSub = signal('partners');

    scopeSubTabs = [
        { value: 'what', label: 'What' },
        { value: 'when', label: 'When' },
        { value: 'where', label: 'Where' },
        { value: 'impact', label: 'Why' }
    ];

    stakeholderSubTabs = [
        { value: 'partners', label: 'Partners' },
        { value: 'team', label: 'Team' },
        { value: 'beneficiaries', label: 'Beneficiaries' }
    ];

    // ─── Dot Styles (single source of truth for completion dots) ───
    dotStyles = {
        mandatoryFilled:  { bg: 'bg-green-200 dark:bg-green-700', text: 'text-green-800 dark:text-green-50', icon: 'pi-check' },
        optionalFilled:   { bg: 'bg-blue-200 dark:bg-blue-700',  text: 'text-blue-800 dark:text-blue-50', icon: 'pi-info' },
        mandatoryMissing: { bg: 'bg-transparent border-2 border-red-400 dark:border-red-500', text: 'text-red-500 dark:text-red-400', icon: 'pi-plus' },
        optionalMissing:  { bg: 'bg-transparent border-2 border-surface-300 dark:border-surface-600', text: 'text-surface-500 dark:text-surface-400', icon: 'pi-info' }
    };

    getDotStyle(step: { type: 'mandatory' | 'optional'; filled: boolean }) {
        if (step.filled) return step.type === 'mandatory' ? this.dotStyles.mandatoryFilled : this.dotStyles.optionalFilled;
        return step.type === 'mandatory' ? this.dotStyles.mandatoryMissing : this.dotStyles.optionalMissing;
    }

    // ─── Entity Completion (Mandatory / Optional out of total records) ───
    completionTotalRecords = 30;
    completionMandatory = { filled: 2, total: 3 };
    completionOptional = { filled: 12, total: 27 };

    mandatoryRecords: { name: string; filled: boolean; fields: { label: string; placeholder: string; aiSuggestions?: string[] }[] }[] = [
        { name: 'Title', filled: true, fields: [] },
        { name: 'Description', filled: true, fields: [] },
        { name: 'Focal Point', filled: false, fields: [
            { label: 'Focal Point Name', placeholder: 'e.g. Maria Santos', aiSuggestions: ['Maria Santos', 'O. Martinez', 'J. Anderson'] },
            { label: 'Role', placeholder: 'e.g. Project Manager', aiSuggestions: ['Project Manager', 'Programme Officer', 'Team Lead'] }
        ] }
    ];

    optionalRecords: { name: string; filled: boolean; fields: { label: string; placeholder: string; aiSuggestions?: string[] }[] }[] = [
        { name: 'Budget', filled: true, fields: [] },
        { name: 'Duration', filled: true, fields: [] },
        { name: 'Start Date', filled: true, fields: [] },
        { name: 'End Date', filled: true, fields: [] },
        { name: 'Funding Source', filled: true, fields: [] },
        { name: 'Implementing Partner', filled: true, fields: [] },
        { name: 'Country', filled: true, fields: [] },
        { name: 'Region', filled: true, fields: [] },
        { name: 'Sector', filled: true, fields: [] },
        { name: 'Sub-Sector', filled: true, fields: [] },
        { name: 'SDG Goals', filled: true, fields: [] },
        { name: 'Target Beneficiaries', filled: true, fields: [] },
        { name: 'Vendor Documentation', filled: false, fields: [
            { label: 'Vendor Name', placeholder: 'e.g. Acme Equipment Ltd.', aiSuggestions: ['Acme Equipment Ltd.', 'Toray Industries', 'Veolia Water Technologies'] },
            { label: 'Document Type', placeholder: 'e.g. Compliance form, Certificate', aiSuggestions: ['Compliance Form', 'Import Certificate', 'Quality Assurance Certificate'] },
            { label: 'Due Date', placeholder: 'e.g. 2026-06-01', aiSuggestions: ['2026-06-01', '2026-06-15'] }
        ]},
        { name: 'Risk Assessment', filled: false, fields: [
            { label: 'Risk Category', placeholder: 'e.g. Schedule, Financial, Operational', aiSuggestions: ['Schedule', 'Financial', 'Operational'] },
            { label: 'Probability', placeholder: 'e.g. High, Medium, Low', aiSuggestions: ['High', 'Medium', 'Low'] },
            { label: 'Impact', placeholder: 'e.g. Critical, Major, Minor', aiSuggestions: ['Critical', 'Major', 'Minor'] },
            { label: 'Mitigation Strategy', placeholder: 'Describe mitigation approach...', aiSuggestions: ['Accelerate vendor onboarding timeline', 'Add buffer to critical-path milestones'] }
        ]},
        { name: 'Stakeholder Alignment', filled: false, fields: [
            { label: 'Stakeholder Group', placeholder: 'e.g. Legal, Engineering, Finance', aiSuggestions: ['Legal', 'Engineering', 'Finance'] },
            { label: 'Alignment Issue', placeholder: 'Describe the misalignment...', aiSuggestions: ['Pending legal review of partnership terms', 'Budget allocation dispute'] },
            { label: 'Resolution Owner', placeholder: 'e.g. Project Manager', aiSuggestions: ['Project Manager', 'Legal Counsel', 'Programme Director'] }
        ]},
        { name: 'Scope Change Control', filled: false, fields: [
            { label: 'Change Request Title', placeholder: 'e.g. Additional site survey', aiSuggestions: ['Additional site survey', 'Extended water testing phase'] },
            { label: 'Requested By', placeholder: 'e.g. Field Operations', aiSuggestions: ['Field Operations', 'Quality Assurance', 'Engineering'] },
            { label: 'Impact on Budget', placeholder: 'e.g. +$50,000', aiSuggestions: ['+$50,000', '+$25,000', 'No impact'] },
            { label: 'Impact on Timeline', placeholder: 'e.g. +2 weeks', aiSuggestions: ['+2 weeks', '+1 week', 'No impact'] },
            { label: 'Justification', placeholder: 'Why is this change needed?', aiSuggestions: ['Regulatory compliance requirement', 'Quality baseline not met in initial tests'] }
        ]},
        { name: 'Software Licenses', filled: false, fields: [
            { label: 'Software Name', placeholder: 'e.g. AutoCAD, JIRA', aiSuggestions: ['AutoCAD', 'JIRA', 'MS Project'] },
            { label: 'Current License Count', placeholder: 'e.g. 15', aiSuggestions: ['15', '10', '25'] },
            { label: 'Annual Cost', placeholder: 'e.g. $12,000', aiSuggestions: ['$12,000', '$8,500'] }
        ]},
        { name: 'Resource Allocation', filled: false, fields: [
            { label: 'Team / Department', placeholder: 'e.g. Legal, Engineering', aiSuggestions: ['Legal', 'Engineering', 'Procurement'] },
            { label: 'Current Allocation %', placeholder: 'e.g. 140%', aiSuggestions: ['140%', '120%', '100%'] },
            { label: 'Required Capacity', placeholder: 'e.g. 2 FTEs', aiSuggestions: ['2 FTEs', '3 FTEs'] },
            { label: 'Timeframe', placeholder: 'e.g. June 2026', aiSuggestions: ['June 2026', 'July 2026'] }
        ]},
        { name: 'Regulatory Compliance', filled: false, fields: [
            { label: 'Regulation Name', placeholder: 'e.g. Water Sanitization Act 2026', aiSuggestions: ['Water Sanitization Act 2026', 'Environmental Impact Regulation'] },
            { label: 'Effective Date', placeholder: 'e.g. 2026-07-15', aiSuggestions: ['2026-07-15', '2026-08-01'] },
            { label: 'Affected Operations', placeholder: 'e.g. East Africa filtration sites', aiSuggestions: ['East Africa filtration sites', 'All regional installations'] },
            { label: 'Compliance Action Required', placeholder: 'Describe required actions...', aiSuggestions: ['Update filtration protocols', 'Submit revised environmental assessment'] }
        ]},
        { name: 'Project Timeline', filled: false, fields: [
            { label: 'Milestone', placeholder: 'e.g. Equipment delivery', aiSuggestions: ['Equipment delivery', 'Site preparation complete', 'Phase 1 sign-off'] },
            { label: 'Original Date', placeholder: 'e.g. 2026-08-01', aiSuggestions: ['2026-08-01', '2026-09-01'] },
            { label: 'Revised Date', placeholder: 'e.g. 2026-07-15', aiSuggestions: ['2026-07-15', '2026-08-15'] },
            { label: 'Reason for Change', placeholder: 'e.g. Ahead of schedule', aiSuggestions: ['Ahead of schedule', 'Vendor delay', 'Weather disruption'] }
        ]},
        { name: 'Community Engagement', filled: false, fields: [
            { label: 'Community Board', placeholder: 'e.g. Local Water Committee', aiSuggestions: ['Local Water Committee', 'Village Council', 'Regional Water Authority'] },
            { label: 'Last Update Date', placeholder: 'e.g. 2026-03-30', aiSuggestions: ['2026-03-30', '2026-04-15'] },
            { label: 'Next Scheduled Update', placeholder: 'e.g. 2026-05-30', aiSuggestions: ['2026-05-30', '2026-06-15'] },
            { label: 'Communication Channel', placeholder: 'e.g. Newsletter, Town Hall', aiSuggestions: ['Newsletter', 'Town Hall', 'Community Radio'] }
        ]},
        { name: 'Weather Mitigation Plan', filled: false, fields: [
            { label: 'Weather Risk', placeholder: 'e.g. Monsoon season', aiSuggestions: ['Monsoon season', 'Typhoon season', 'Extreme heat'] },
            { label: 'Affected Activity', placeholder: 'e.g. Foundation pouring', aiSuggestions: ['Foundation pouring', 'Outdoor installation', 'Transport logistics'] },
            { label: 'Mitigation Action', placeholder: 'e.g. Accelerate schedule', aiSuggestions: ['Accelerate schedule', 'Use weather-resistant materials', 'Stage equipment indoors'] },
            { label: 'Deadline to Mitigate', placeholder: 'e.g. 2026-06-15', aiSuggestions: ['2026-06-15', '2026-06-01'] }
        ]},
        { name: 'Quality Assurance Report', filled: false, fields: [
            { label: 'Test Phase', placeholder: 'e.g. Initial water testing', aiSuggestions: ['Initial water testing', 'Secondary filtration test', 'Final quality audit'] },
            { label: 'Result', placeholder: 'e.g. 98% efficiency', aiSuggestions: ['98% efficiency', '95% efficiency', '99.2% purity'] },
            { label: 'Baseline Requirement', placeholder: 'e.g. 95%', aiSuggestions: ['95%', '90%', '97%'] }
        ]},
        { name: 'Legal Review', filled: false, fields: [
            { label: 'Review Subject', placeholder: 'e.g. Partnership agreement terms', aiSuggestions: ['Partnership agreement terms', 'Procurement contract review', 'IP rights assessment'] },
            { label: 'Reviewing Party', placeholder: 'e.g. UNOPS Legal', aiSuggestions: ['UNOPS Legal', 'External Counsel', 'Government of Japan Legal'] },
            { label: 'Target Completion', placeholder: 'e.g. 2026-06-01', aiSuggestions: ['2026-06-01', '2026-05-15'] }
        ]},
        { name: 'Signing Agreement', filled: false, fields: [
            { label: 'Agreement Title', placeholder: 'e.g. Japan Funding Agreement', aiSuggestions: ['Japan Funding Agreement', 'Water Purification Partnership MoU'] },
            { label: 'Counterparty', placeholder: 'e.g. Government of Japan', aiSuggestions: ['Government of Japan', 'JICA', 'Ministry of Foreign Affairs'] },
            { label: 'Target Signing Date', placeholder: 'e.g. 2026-04-01', aiSuggestions: ['2026-04-01', '2026-04-15'] },
            { label: 'Blocking Issue', placeholder: 'e.g. Pending legal reviews', aiSuggestions: ['Pending legal reviews', 'Awaiting budget approval', 'No blocking issues'] }
        ]},
        { name: 'Communication Plan', filled: false, fields: [
            { label: 'Audience', placeholder: 'e.g. Partners, Beneficiaries', aiSuggestions: ['Partners', 'Beneficiaries', 'Donors & Stakeholders'] },
            { label: 'Frequency', placeholder: 'e.g. Monthly', aiSuggestions: ['Weekly', 'Bi-weekly', 'Monthly'] },
            { label: 'Channel', placeholder: 'e.g. Email, Newsletter', aiSuggestions: ['Email', 'Newsletter', 'Quarterly Report'] },
            { label: 'Responsible Person', placeholder: 'e.g. Communications Officer', aiSuggestions: ['Communications Officer', 'Project Manager', 'Stakeholder Liaison'] }
        ]},
        { name: 'Procurement Plan', filled: false, fields: [
            { label: 'Item / Service', placeholder: 'e.g. Filtration equipment', aiSuggestions: ['Filtration equipment', 'Water testing kits', 'Transport & logistics'] },
            { label: 'Estimated Cost', placeholder: 'e.g. $500,000', aiSuggestions: ['$500,000', '$250,000', '$750,000'] },
            { label: 'Procurement Method', placeholder: 'e.g. Competitive bidding', aiSuggestions: ['Competitive bidding', 'Direct procurement', 'Framework agreement'] },
            { label: 'Target Award Date', placeholder: 'e.g. 2026-07-01', aiSuggestions: ['2026-07-01', '2026-07-15'] }
        ]}
    ];

    completionSteps = computed(() => {
        const steps: { type: 'mandatory' | 'optional'; filled: boolean; name: string; fields: { label: string; placeholder: string; aiSuggestions?: string[] }[] }[] = [];
        for (const rec of this.mandatoryRecords) {
            steps.push({ type: 'mandatory', filled: rec.filled, name: rec.name, fields: rec.fields });
        }
        for (const rec of this.optionalRecords) {
            steps.push({ type: 'optional', filled: rec.filled, name: rec.name, fields: rec.fields });
        }
        return steps;
    });

    completionFilledTotal = computed(() =>
        this.completionMandatory.filled + this.completionOptional.filled
    );
    completionTotal = computed(() =>
        Math.round((this.completionFilledTotal() / this.completionTotalRecords) * 100)
    );

    // ─── Step Drawer ───
    isStepDrawerVisible = false;
    selectedStepIndex = signal<number | null>(null);
    stepDrawerValues: Record<string, string> = {};

    selectedStep = computed(() => {
        const idx = this.selectedStepIndex();
        if (idx === null) return null;
        return this.completionSteps()[idx] ?? null;
    });

    openStepDrawer(index: number) {
        this.selectedStepIndex.set(index);
        this.stepDrawerValues = {};
        this.isStepDrawerVisible = true;
    }

    saveStepDrawer() {
        this.isStepDrawerVisible = false;
    }

    // ─── Analysis Stats ───
    analysisStats = [
        { label: 'Countries', value: '3', icon: 'pi-globe', iconColor: 'text-blue-500' },
        { label: 'Partners', value: '2', icon: 'pi-users', iconColor: 'text-teal-500' },
        { label: 'SDGs', value: '2', icon: 'pi-flag', iconColor: 'text-cherry-500' },
        { label: 'Deliverables', value: '5', icon: 'pi-briefcase', iconColor: 'text-primary-500' }
    ];

    // ─── Deliverables (What) ───
    deliverables: Deliverable[] = [
        { id: 1, name: 'Community Water Filtration Systems', hierarchy: 'Infrastructure > Water & Sanitation > Filtration', serviceLine: 'Infrastructure', quantity: 45, requiresProcurement: true },
        { id: 2, name: 'Local Operator Training Programme', hierarchy: 'Capacity Building > Technical Training', serviceLine: 'HR & Capacity', quantity: 150, requiresProcurement: false },
        { id: 3, name: 'Water Quality Monitoring Equipment', hierarchy: 'Infrastructure > Water & Sanitation > Monitoring', serviceLine: 'Infrastructure', quantity: 90, requiresProcurement: true },
        { id: 4, name: 'Community Awareness Campaigns', hierarchy: 'Advisory > Public Health Communication', serviceLine: 'Advisory', quantity: 12, requiresProcurement: false },
        { id: 5, name: 'Maintenance Framework & SOPs', hierarchy: 'Advisory > Technical Advisory > Sustainability', serviceLine: 'Advisory', quantity: 3, requiresProcurement: false }
    ];

    // ─── SDG Alignment (Why) ───
    sdgAlignments: SDGAlignment[] = [
        { number: 6, name: 'Clean Water and Sanitation', isPrimary: true, color: '#26BDE2', targets: ['6.1 — Safe drinking water', '6.3 — Water quality improvement', '6.b — Local water management'] },
        { number: 3, name: 'Good Health and Well-being', isPrimary: false, color: '#4C9F38', targets: ['3.3 — Waterborne disease reduction', '3.9 — Environmental health risks'] }
    ];

    crossCuttingConcerns: CrossCuttingConcern[] = [
        { label: 'Gender Equality', value: true },
        { label: 'Human Rights', value: true },
        { label: 'Disability Inclusion', value: true },
        { label: 'Environmental Sustainability', value: true },
        { label: 'Climate Change', value: true },
        { label: 'Conflict Sensitivity', value: false }
    ];

    // ─── Partners (Who) ───
    fundingPartners: Partner[] = [
        { id: 1, name: 'Government of Japan', type: 'funding', status: 'Confirmed', contributionUSD: 15000000, contributionPercentage: 100, dueDiligenceStatus: 'Completed', dueDiligenceExpiry: 'Dec 31, 2027', agreements: ['JP-UNOPS-2026-WSP', 'Framework Agreement 2024-2028'] }
    ];

    clientPartners: Partner[] = [
        { id: 2, name: 'Ministry of Water & Irrigation, Kenya', type: 'client', status: 'Confirmed', contributionUSD: 0, contributionPercentage: 0, dueDiligenceStatus: 'Completed', dueDiligenceExpiry: 'Jun 30, 2027', agreements: [] },
        { id: 3, name: 'Department of Public Health Engineering, Bangladesh', type: 'client', status: 'In Review', contributionUSD: 0, contributionPercentage: 0, dueDiligenceStatus: 'In Progress', dueDiligenceExpiry: 'Pending', agreements: [] }
    ];

    // ─── Countries (Where) ───
    countries: Country[] = [
        { id: 1, name: 'Kenya', isoCode: 'KE', continent: 'Africa', region: 'East Africa', orgUnit: 'KEOC - Kenya Operations Centre', tags: ['HCA'], hasUNSDCF: true },
        { id: 2, name: 'Bangladesh', isoCode: 'BD', continent: 'Asia', region: 'South Asia', orgUnit: 'BDOC - Bangladesh Operations Centre', tags: [], hasUNSDCF: true },
        { id: 3, name: 'Cambodia', isoCode: 'KH', continent: 'Asia', region: 'Southeast Asia', orgUnit: 'MMOC - Myanmar Multi-Country Office', tags: [], hasUNSDCF: false }
    ];

    // ─── Timeline (When) ───
    timelineEvents: TimelineEvent[] = [
        { id: 1, label: 'Opportunity Created', date: 'Apr 5, 2026', icon: 'pi-plus-circle', color: 'bg-blue-500' },
        { id: 2, label: 'Submission Deadline', date: 'Mar 15, 2026', icon: 'pi-flag', color: 'bg-orange-500' },
        { id: 3, label: 'Target Signing', date: 'Apr 1, 2026', icon: 'pi-file-check', color: 'bg-green-500' },
        { id: 4, label: 'Implementation Start', date: 'May 1, 2026', icon: 'pi-play', color: 'bg-teal-500' },
        { id: 5, label: 'Mid-Term Review', date: 'May 1, 2027', icon: 'pi-chart-bar', color: 'bg-primary-500' },
        { id: 6, label: 'Target Delivery', date: 'May 1, 2028', icon: 'pi-check-circle', color: 'bg-green-600' }
    ];

    // ─── Risks ───
    risks: Risk[] = [
        { id: 1, title: 'Monsoon Season Delay', category: 'Operational', probability: 'High', impact: 'Major', proximity: 'Imminent', responseType: 'Mitigate', description: 'Upcoming monsoon season (Jun–Sep) may delay physical construction of filtration facilities if foundation work is not completed before May.', isOrgHighRisk: true },
        { id: 2, title: 'Regulatory Compliance Gap', category: 'Legal / Regulatory', probability: 'Medium', impact: 'Moderate', proximity: '3–6 months', responseType: 'Avoid', description: 'New water sanitization compliance laws take effect in 60 days in Kenya. Current designs may need revision to meet updated standards.', isOrgHighRisk: false },
        { id: 3, title: 'Supply Chain Disruption', category: 'External', probability: 'Medium', impact: 'Major', proximity: '6–12 months', responseType: 'Transfer', description: 'Global shortage of specialized filtration membranes could delay equipment procurement by 8–12 weeks.', isOrgHighRisk: false },
        { id: 4, title: 'Community Acceptance', category: 'Social', probability: 'Low', impact: 'Moderate', proximity: '3–6 months', responseType: 'Accept', description: 'Potential resistance from communities unfamiliar with modern filtration systems. Mitigation through early engagement and awareness campaigns.', isOrgHighRisk: false }
    ];

    // ─── Related Interactions ───
    interactions: Interaction[] = [
        { id: 1, title: 'Initial consultation with Government of Japan', type: 'Meeting', date: 'Mar 10, 2026', status: 'Completed', participants: 'O. Martinez, J. Anderson, K. Tanaka' },
        { id: 2, title: 'Kenya site assessment visit', type: 'Field Visit', date: 'Mar 22, 2026', status: 'Completed', participants: 'O. Martinez, S. Wilson, Local team' },
        { id: 3, title: 'Technical review with DPHE Bangladesh', type: 'Meeting', date: 'Apr 10, 2026', status: 'In Progress', participants: 'J. Davis, R. Ahmed' },
        { id: 4, title: 'Partner coordination workshop', type: 'Workshop', date: 'Apr 25, 2026', status: 'Planned', participants: 'All partners' }
    ];

    // ─── Collaboration (Comments) ───
    comments = [
        { id: 1, author: 'James Anderson', avatar: 'bernardodominic.png', time: 'Apr 28, 2026 · 2:15 PM', text: 'Japan has officially confirmed the full funding amount. I\'ve updated the partner status accordingly.' },
        { id: 2, author: 'Jessica Davis', avatar: 'annafali.png', time: 'Apr 27, 2026 · 10:30 AM', text: 'The Bangladesh DPHE team has raised concerns about timeline alignment with their fiscal year. We may need to adjust the implementation start for that country.' },
        { id: 3, author: 'Olivia Martinez', avatar: 'amyelsner.png', time: 'Apr 26, 2026 · 4:45 PM', text: 'I\'ve uploaded the initial water quality assessment report. Please review before the submission deadline.' }
    ];

    // ─── Team ───
    teamMembers: TeamMember[] = [
        { id: 1, name: 'James Anderson', position: 'Senior Programme Officer, P3 · KEOC', role: 'Collaborator', expertise: ['Water & Sanitation', 'Procurement'], image: 'bernardodominic.png' },
        { id: 2, name: 'Jessica Davis', position: 'Programme Analyst, NOB · BDOC', role: 'Collaborator', expertise: ['Monitoring & Evaluation', 'South Asia'], image: 'annafali.png' },
        { id: 3, name: 'Robert Fox', position: 'Engineering Specialist, P4 · HQ', role: 'Technical Advisor', expertise: ['Infrastructure', 'Filtration Systems'], image: 'asiyajavayant.png' },
        { id: 4, name: 'Sarah Wilson', position: 'Finance Officer, P2 · KEOC', role: 'Collaborator', expertise: ['Budget Management', 'Reporting'], image: 'amyelsner.png' }
    ];

    decisionPathway = [
        { step: 1, label: 'Opportunity Manager Submission', approver: 'Olivia Martinez · Programme Manager, P4', completed: true },
        { step: 2, label: 'Head of Programme Review', approver: 'David Chen · Head of Programme, P5 · KEOC', completed: false },
        { step: 3, label: 'Regional Director Approval', approver: 'Maria Santos · Regional Director, D1 · AFR', completed: false },
        { step: 4, label: 'Portfolio Review Committee', approver: 'Committee review required for opportunities > $10M', completed: false }
    ];

    // ─── Activity Feed ───
    activityFeed: ActivityItem[] = [
        { id: 1, title: 'Water Quality Report uploaded', icon: 'pi-file-pdf', description: 'Initial water quality assessment for the target region submitted for review.', author: 'Olivia Martinez', time: 'Today, 3:15 PM', dotColor: 'bg-primary-500', ringColor: 'ring-primary-500' },
        { id: 2, title: 'Funding partner confirmed', icon: 'pi-check-circle', description: 'Japan confirmed as funding partner with $15,000,000 contribution.', author: 'James Anderson', time: 'Today, 11:00 AM', dotColor: 'bg-green-500', ringColor: 'ring-green-500' },
        { id: 3, title: 'Key Dates updated', icon: 'pi-calendar', description: 'Target signing date set to Apr 1, 2026. Implementation start scheduled for May 1, 2026.', author: 'Jessica Davis', time: 'Yesterday, 4:30 PM', dotColor: 'bg-orange-500', ringColor: 'ring-orange-500' },
        { id: 4, title: 'Stage moved to ID & Profile', icon: 'pi-info-circle', description: 'Current stage updated to ID & Profile (1/2). Submission deadline pending.', author: 'Robert Fox', time: 'Apr 18, 2026', dotColor: 'bg-ocean-500', ringColor: 'ring-ocean-500' },
        { id: 5, title: 'Budget set to 15,000,000', icon: 'pi-dollar', description: 'Proposed budget of $15,000,000 approved for Water Sanitization opportunity.', author: 'Sarah Wilson', time: 'Apr 17, 2026', dotColor: 'bg-teal-500', ringColor: 'ring-teal-500' },
        { id: 6, title: 'SDGs linked', icon: 'pi-globe', description: '2 Sustainable Development Goals linked to this opportunity.', author: 'Emily Johnson', time: 'Apr 15, 2026', dotColor: 'bg-cherry-500', ringColor: 'ring-cherry-500' }
    ];

    activityRowsPerPage = 3;
    activityPage = signal(0);
    activityTotalPages = computed(() => Math.ceil(this.activityFeed.length / this.activityRowsPerPage));
    activityFirst = computed(() => this.activityPage() * this.activityRowsPerPage);
    activityLast = computed(() => Math.min(this.activityFirst() + this.activityRowsPerPage, this.activityFeed.length));
    paginatedActivities = computed(() => this.activityFeed.slice(this.activityFirst(), this.activityLast()));

    // ─── AI Analysis ───
    aiInsights: AiInsight[] = [
        { id: 1, title: 'Schedule Risk Detected', description: 'Based on similar past projects with Japan, the target signing date (Apr 1) has an 82% probability of delay due to pending legal reviews.', actionLabel: 'Draft extension request', icon: 'pi-exclamation-triangle', iconColor: 'text-orange-500' },
        { id: 2, title: 'Budget Optimization', description: 'Reallocating $250k from Q3 to Q2 could accelerate deliverables 3 and 4 by three weeks without impacting final budget constraints.', actionLabel: 'View reallocation draft', icon: 'pi-chart-line', iconColor: 'text-green-500' },
        { id: 3, title: 'Missing Vendor Documentation', description: '3 critical compliance forms are currently missing from the primary equipment contractor. This blocks Phase 1 sign-off.', actionLabel: 'Send automated reminder', icon: 'pi-file', iconColor: 'text-blue-500' },
        { id: 4, title: 'Stakeholder Alignment', description: 'Recent meeting transcripts indicate a potential misalignment on Phase 2 deliverable definitions between Legal and Engineering.', actionLabel: 'Generate alignment report', icon: 'pi-users', iconColor: 'text-teal-500' },
        { id: 5, title: 'Scope Creep Detection', description: '4 new ad-hoc requests identified in recent email threads outside the formal change control process.', actionLabel: 'Review flagged requests', icon: 'pi-search', iconColor: 'text-red-500' },
        { id: 6, title: 'Cost Saving Opportunity', description: 'Consolidating overlapping software licenses for the site engineering team could save approximately $12,000 annually.', actionLabel: 'Apply savings', icon: 'pi-wallet', iconColor: 'text-green-600' },
        { id: 7, title: 'Resource Bottleneck Predicted', description: 'The Legal team is overallocated by 40% next month across parallel projects, which may bottleneck upcoming approvals.', actionLabel: 'Suggest resource shift', icon: 'pi-clock', iconColor: 'text-orange-500' },
        { id: 8, title: 'Regulatory Update Needed', description: 'New water sanitization compliance laws take effect in 60 days in the target operational region.', actionLabel: 'Review regulation impact', icon: 'pi-shield', iconColor: 'text-blue-600' },
        { id: 9, title: 'Milestone Acceleration', description: 'Filtration equipment delivery is tracking 2 weeks ahead of schedule. Site installation can begin early.', actionLabel: 'Update project timeline', icon: 'pi-bolt', iconColor: 'text-teal-500' },
        { id: 10, title: 'Communication Gap', description: "The local community board hasn't been updated in 45 days. The recommended engagement frequency is every 30 days.", actionLabel: 'Draft update newsletter', icon: 'pi-comments', iconColor: 'text-cherry-500' },
        { id: 11, title: 'Weather Risk Impact', description: 'Upcoming monsoon season has a 65% chance of delaying the physical plant construction if foundation pouring is delayed.', actionLabel: 'View mitigation plan', icon: 'pi-cloud', iconColor: 'text-ocean-500' },
        { id: 12, title: 'Quality Assurance Trend', description: 'Initial water testing phase passed with 98% efficiency, exceeding the 95% baseline requirement.', actionLabel: 'Publish QA report', icon: 'pi-check-circle', iconColor: 'text-green-500' }
    ];

    // ─── Tasks ───
    activeTaskFilter = signal('All');
    taskSearchQuery = model('');
    /** Default matches `activeTaskFilter` "All": expand every section that has tasks. */
    openTaskPanels = model<string[]>(['1', '0', '2']);
    accordionContentPT = { root: { class: 'overflow-hidden bg-transparent!' }, content: { class: 'bg-transparent!' } };
    isTaskDrawerVisible = false;
    selectedTask: Task | null = null;
    taskDrawerMode: 'create' | 'edit' = 'create';

    taskFilterOptions = [
        {
            key: 'All',
            label: 'All',
            icon: 'pi pi-list',
            countKey: 'all' as const,
            badgeClass: 'bg-surface-200 dark:bg-surface-600 text-surface-900 dark:text-surface-100',
            inactiveClass:
                'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-600',
            activeClass:
                'bg-primary-300 border-primary-300 text-primary-950 dark:bg-primary-300 dark:border-primary-300 dark:text-primary-950'
        },
        {
            key: 'Pending',
            label: 'Not Started',
            icon: 'pi pi-inbox',
            countKey: 'pending' as const,
            badgeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
            inactiveClass:
                'bg-blue-50 dark:bg-blue-700/10 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-700/20',
            activeClass: 'bg-blue-300 border-blue-300 text-primary-950 dark:bg-blue-300 dark:border-blue-300 dark:text-primary-950'
        },
        {
            key: 'In Progress',
            label: 'In Progress',
            icon: 'pi pi-clock',
            countKey: 'inProgress' as const,
            badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
            inactiveClass:
                'bg-yellow-50 dark:bg-yellow-700/10 text-yellow-600 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-700/20',
            activeClass:
                'bg-yellow-300 border-yellow-300 text-primary-950 dark:bg-yellow-300 dark:border-yellow-300 dark:text-primary-950'
        },
        {
            key: 'Completed',
            label: 'Completed',
            icon: 'pi pi-check-circle',
            countKey: 'completed' as const,
            badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
            inactiveClass:
                'bg-green-50 dark:bg-green-700/10 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-700/20',
            activeClass:
                'bg-green-300 border-green-300 text-primary-950 dark:bg-green-300 dark:border-green-300 dark:text-primary-950'
        }
    ];

    taskData = signal<Task[]>([
        { id: 1, title: 'Complete submission deadline documentation', description: 'Prepare all required documents for the submission deadline.', status: 'pending', completed: false, startDate: '21.04.2026', endDate: '25.04.2026', members: [{ image: 'amyelsner.png' }, { image: 'annafali.png' }] },
        { id: 2, title: 'Finalize target signing agreement', description: null, status: 'pending', completed: false, startDate: '22.04.2026', endDate: '01.04.2026', members: [{ image: 'bernardodominic.png' }] },
        { id: 3, title: 'Prepare implementation start plan', description: 'Define milestones, deliverables, and resource allocation for May 1, 2026 start.', status: 'pending', completed: false, startDate: '23.04.2026', endDate: '28.04.2026', members: [{ image: 'asiyajavayant.png' }, { image: 'amyelsner.png' }] },
        { id: 4, title: 'Review water quality assessment data', description: 'Analyze initial water quality samples and validate against sanitization standards.', status: 'in-progress', completed: false, startDate: '18.04.2026', endDate: '24.04.2026', members: [{ image: 'annafali.png' }, { image: 'bernardodominic.png' }] },
        { id: 5, title: 'Coordinate with Japan funding partner', description: null, status: 'in-progress', completed: false, startDate: '19.04.2026', endDate: '26.04.2026', members: [{ image: 'amyelsner.png' }] },
        { id: 6, title: 'Link SDGs to opportunity', description: null, status: 'completed', completed: true, startDate: '10.04.2026', endDate: '15.04.2026', members: [{ image: 'amyelsner.png' }, { image: 'annafali.png' }] },
        { id: 7, title: 'Set proposed budget to 15,000,000', description: null, status: 'completed', completed: true, startDate: '12.04.2026', endDate: '17.04.2026', members: [{ image: 'asiyajavayant.png' }] }
    ]);

    filteredTasks = computed(() => {
        let tasks = this.taskData();
        if (this.taskSearchQuery().trim()) {
            tasks = tasks.filter((t) => t.title.toLowerCase().includes(this.taskSearchQuery().toLowerCase()));
        }
        switch (this.activeTaskFilter()) {
            case 'Pending': return tasks.filter((t) => t.status === 'pending');
            case 'In Progress': return tasks.filter((t) => t.status === 'in-progress');
            case 'Completed': return tasks.filter((t) => t.status === 'completed');
            default: return tasks;
        }
    });

    taskCounts = computed(() => ({
        all: this.taskData().length,
        pending: this.taskData().filter((t) => t.status === 'pending').length,
        inProgress: this.taskData().filter((t) => t.status === 'in-progress').length,
        completed: this.taskData().filter((t) => t.status === 'completed').length
    }));

    pendingTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'pending'));
    inProgressTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'in-progress'));
    completedTasks = computed(() => this.filteredTasks().filter((t) => t.status === 'completed'));

    // ─── Documents ───
    documents = signal<Document[]>([
        { id: 1, fileName: 'PDF File Number One', type: 'DOCX', fileSize: '17.4 MB', uploadDate: 'Apr 21, 2026', owner: 'Olivia Martinez', icon: 'pi-file-word' },
        { id: 2, fileName: 'Table Data', type: 'XLS', fileSize: '24 MB', uploadDate: 'Apr 20, 2026', owner: 'Jessica Davis', icon: 'pi-file-excel' },
        { id: 3, fileName: 'Google Doc', type: 'EPS', fileSize: '11.4 MB', uploadDate: 'Apr 15, 2026', owner: 'Emily Johnson', icon: 'pi-file' },
        { id: 4, fileName: 'Google Document', type: 'DOCX', fileSize: '8.2 MB', uploadDate: 'Apr 14, 2026', owner: 'Sarah Wilson', icon: 'pi-file-word' },
        { id: 5, fileName: 'Water Quality Report', type: 'PDF', fileSize: '5.6 MB', uploadDate: 'Apr 12, 2026', owner: 'Amy Elsner', icon: 'pi-file-pdf' },
        { id: 6, fileName: 'Sanitization Standards', type: 'PDF', fileSize: '1.1 MB', uploadDate: 'Apr 10, 2026', owner: 'Robert Fox', icon: 'pi-file-pdf' },
        { id: 7, fileName: 'Implementation Plan', type: 'DOCX', fileSize: '2.5 MB', uploadDate: 'Apr 8, 2026', owner: 'James Anderson', icon: 'pi-file-word' },
        { id: 8, fileName: 'Budget Projections', type: 'XLS', fileSize: '3.1 MB', uploadDate: 'Apr 5, 2026', owner: 'Jessica Davis', icon: 'pi-file-excel' }
    ]);

    private messageService = inject(MessageService);

    constructor(private confirmationService: ConfirmationService) {
        inject(DestroyRef).onDestroy(() => this.footerService.content.set(null));
    }

    // ─── Task Methods ───
    selectTaskFilter(key: string): void {
        this.activeTaskFilter.set(key);
        this.openTaskPanels.set(this.taskAccordionValuesForFilter(key));
    }

    /** Panel values match p-accordionpanel: In Progress = "1", Not Started = "0", Completed = "2". */
    private taskAccordionValuesForFilter(filterKey: string): string[] {
        const tasks = this.taskData();
        const hasInProgress = tasks.some((t) => t.status === 'in-progress');
        const hasPending = tasks.some((t) => t.status === 'pending');
        const hasCompleted = tasks.some((t) => t.status === 'completed');

        switch (filterKey) {
            case 'Pending':
                return hasPending ? ['0'] : [];
            case 'In Progress':
                return hasInProgress ? ['1'] : [];
            case 'Completed':
                return hasCompleted ? ['2'] : [];
            case 'All':
            default: {
                const open: string[] = [];
                if (hasInProgress) {
                    open.push('1');
                }
                if (hasPending) {
                    open.push('0');
                }
                if (hasCompleted) {
                    open.push('2');
                }
                return open;
            }
        }
    }

    toggleTaskCompletion(task: Task, completed: boolean) {
        setTimeout(() => {
            const tasks = this.taskData();
            const idx = tasks.findIndex((t) => t.id === task.id);
            if (idx !== -1) {
                const updated = { ...tasks[idx], status: completed ? 'completed' : 'pending', completed };
                const remaining = tasks.filter((t) => t.id !== task.id);
                this.taskData.set([updated, ...remaining]);
            }
        }, 400);
    }

    deleteTask(taskId: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this task?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Delete', severity: 'danger' },
            accept: () => this.taskData.set(this.taskData().filter((t) => t.id !== taskId))
        });
    }

    openNewTaskDrawer() {
        this.selectedTask = null;
        this.taskDrawerMode = 'create';
        this.isTaskDrawerVisible = true;
    }

    openEditTaskDrawer(task: Task) {
        this.selectedTask = task;
        this.taskDrawerMode = 'edit';
        this.isTaskDrawerVisible = true;
    }

    handleTaskDrawerSave(newTaskData: any) {
        if (this.taskDrawerMode === 'create') {
            const tasks = this.taskData();
            const newId = Math.max(...tasks.map((t) => t.id), 0) + 1;
            const newTask: Task = {
                id: newId,
                title: newTaskData.title || '',
                description: newTaskData.description || null,
                status: newTaskData.status || 'pending',
                completed: newTaskData.completed || false,
                startDate: newTaskData.startDate || null,
                endDate: newTaskData.endDate || null,
                members: newTaskData.members || []
            };
            this.taskData.set([newTask, ...tasks]);
        } else {
            const tasks = this.taskData();
            const idx = tasks.findIndex((t) => t.id === newTaskData.id);
            if (idx !== -1) {
                tasks[idx] = { ...tasks[idx], ...newTaskData, id: tasks[idx].id };
                this.taskData.set([...tasks]);
            }
        }
        this.isTaskDrawerVisible = false;
    }

    handleTaskDrawerCancel() {
        this.isTaskDrawerVisible = false;
        this.selectedTask = null;
    }

    riskCardClass(risk: Risk): string {
        if (risk.probability === 'High' || risk.isOrgHighRisk) return 'card card-danger';
        if (risk.probability === 'Medium') return 'card card-warn';
        return 'card';
    }

    timelineRingClass(color: string): string {
        const map: Record<string, string> = {
            'bg-blue-500': 'ring-blue-500',
            'bg-orange-500': 'ring-orange-500',
            'bg-green-500': 'ring-green-500',
            'bg-green-600': 'ring-green-600',
            'bg-teal-500': 'ring-teal-500',
            'bg-primary-500': 'ring-primary-500'
        };
        return map[color] ?? 'ring-surface-400';
    }
}
