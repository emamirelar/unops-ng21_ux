import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, model, OnInit, signal, viewChild } from '@angular/core';
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
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { FileUploadModule } from 'primeng/fileupload';
import { TaskDrawer } from '../tasklist/task-drawer';
import { AiCardBgComponent } from '@unopsitg/ux';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';

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

interface Document {
    id: number;
    fileName: string;
    type: string;
    fileSize: string;
    uploadDate: string;
    owner: string;
    icon: string;
}

interface AiInsight {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: string;
    iconColor: string;
}

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

interface SectionNav {
    id: string;
    label: string;
    icon: string;
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
        MenuModule,
        ConfirmDialogModule,
        FileUploadModule,
        TaskDrawer,
        AiCardBgComponent,
        TooltipModule,
        ProgressBarModule
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="flex flex-col gap-6 animate-fade-in-up">
            <!-- Page Header -->
            <div class="flex flex-col gap-3">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <h1 class="text-deepsea-500 dark:text-surface-0 text-xl sm:text-2xl font-extrabold leading-8 m-0">Water Sanitization</h1>
                        <div class="flex items-center gap-2">
                            <p-tag value="ID &amp; Profile" severity="info" styleClass="!bg-blue-50 dark:!bg-blue-900/30" />
                            <p-tag value="Active" severity="success" />
                        </div>
                    </div>
                </div>
                <div class="flex flex-wrap items-center gap-4 text-sm text-surface-600 dark:text-surface-300">
                    <span class="flex items-center gap-1"><i class="pi pi-hashtag text-xs"></i> OPP-2026-00142</span>
                    <span class="flex items-center gap-1"><i class="pi pi-user text-xs"></i> Olivia Martinez</span>
                    <span class="flex items-center gap-1"><i class="pi pi-building text-xs"></i> KEOC - Kenya Operations Centre</span>
                    <span class="flex items-center gap-1"><i class="pi pi-calendar text-xs"></i> Target signing: Apr 1, 2026</span>
                </div>
            </div>

            <!-- Section Navigation -->
            <div #sectionNav class="flex flex-wrap gap-2 -mt-2 sticky top-0 z-20 py-3 border-b border-transparent transition-colors backdrop-blur-xl nav-glass" [class.border-surface-200/50]="isNavStuck()" [class.dark:border-surface-700/50]="isNavStuck()">                @for (section of sections; track section.id) {
                    <button
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border cursor-pointer"
                        [class]="activeSection() === section.id
                            ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700'
                            : 'bg-surface-0 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700'"
                        (click)="scrollToSection(section.id)"
                    >
                        <i class="pi text-xs" [ngClass]="section.icon"></i>
                        {{ section.label }}
                    </button>
                }
            </div>

            <div class="flex flex-col xl:flex-row gap-6 w-full">
            <!-- MAIN CONTENT -->
            <div class="w-full flex-1 flex flex-col gap-6 min-w-0 [&>.card]:mb-0">

                <!-- ═══════════════════════════════════════════════ -->
                <!-- ANALYSIS SECTION -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-analysis">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isAnalysisExpanded()" (click)="isAnalysisExpanded.set(!isAnalysisExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-chart-bar text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Analysis</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isAnalysisExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isAnalysisExpanded()">
                        <div class="expand-body__inner">
                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-2">
                                @for (stat of analysisStats; track stat.label) {
                                    <div class="flex flex-col gap-1 p-3 rounded-xl border border-surface-200/60 dark:border-surface-700/40">
                                        <div class="flex items-center gap-2">
                                            <i class="pi text-sm" [ngClass]="[stat.icon, stat.iconColor]"></i>
                                            <span class="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wide">{{ stat.label }}</span>
                                        </div>
                                        <span class="text-xl font-bold text-surface-900 dark:text-surface-0">{{ stat.value }}</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- OVERVIEW SECTION -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-overview">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isOverviewExpanded()" (click)="isOverviewExpanded.set(!isOverviewExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-file text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Overview</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isOverviewExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isOverviewExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Name</span>
                                    <span class="text-base font-medium text-surface-900 dark:text-surface-0">Water Sanitization</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Description</span>
                                    <p class="text-sm text-surface-700 dark:text-surface-200 leading-relaxed m-0">
                                        This opportunity focuses on providing sustainable water sanitization solutions to underserved communities in East Africa and Southeast Asia. The programme will deploy modern filtration infrastructure, train local operators, and establish long-term maintenance frameworks to ensure clean water access for over 2.5 million beneficiaries across three implementation countries.
                                    </p>
                                </div>
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Proposed Budget</span>
                                        <span class="text-lg font-bold text-surface-900 dark:text-surface-0">$15,000,000</span>
                                    </div>
                                    <div class="flex flex-col gap-1 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                                        <span class="text-xs font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">Total Funded</span>
                                        <span class="text-lg font-bold text-green-700 dark:text-green-300">$15,000,000</span>
                                    </div>
                                    <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Unfunded</span>
                                        <div class="flex items-center gap-2">
                                            <span class="text-lg font-bold text-surface-900 dark:text-surface-0">$0</span>
                                            <p-tag value="Fully Funded" severity="success" styleClass="text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Group: Core Details -->
                <div class="flex items-center gap-3 pt-2">
                    <div class="h-px flex-1 bg-surface-200 dark:bg-surface-700"></div>
                    <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Core Details</span>
                    <div class="h-px flex-1 bg-surface-200 dark:bg-surface-700"></div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- WHAT - PRODUCTS & SERVICES -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-what">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isWhatExpanded()" (click)="isWhatExpanded.set(!isWhatExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-briefcase text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">What — Products &amp; Services</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isWhatExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isWhatExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Delivery Modality</span>
                                    <div class="flex items-center gap-2">
                                        <p-tag value="Mixed (Direct + Grant Support)" severity="info" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Deliverables</span>
                                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                        @for (deliverable of deliverables; track deliverable.id) {
                                            <div class="flex flex-col gap-2 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                                <div class="flex-1 min-w-0">
                                                    <div class="text-sm font-medium text-surface-900 dark:text-surface-0">{{ deliverable.name }}</div>
                                                    <div class="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{{ deliverable.hierarchy }}</div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-wrap">
                                                    <p-tag [value]="deliverable.serviceLine" severity="secondary" styleClass="text-xs" />
                                                    @if (deliverable.requiresProcurement) {
                                                        <p-tag value="Procurement" severity="warn" styleClass="text-xs" />
                                                    }
                                                    <span class="text-xs text-surface-500 dark:text-surface-400 ml-auto">Qty: {{ deliverable.quantity }}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- WHY - IMPACT & ALIGNMENT -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-why">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isWhyExpanded()" (click)="isWhyExpanded.set(!isWhyExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-lightbulb text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Why — Impact &amp; Alignment</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isWhyExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isWhyExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-6 p-2">
                                <!-- Context & Challenges -->
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Context &amp; Challenges</span>
                                    <p class="text-sm text-surface-700 dark:text-surface-200 leading-relaxed m-0">
                                        An estimated 2.2 billion people worldwide lack safely managed drinking water. In the targeted regions of Kenya, Bangladesh, and Cambodia, contaminated water sources are a leading cause of waterborne diseases, particularly among children under five. Existing infrastructure is aging and unable to meet the growing demand driven by urbanisation and climate change.
                                    </p>
                                </div>

                                <!-- Objectives -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Partner Objectives &amp; Results</span>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div class="flex flex-col gap-1 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                            <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Impact</span>
                                            <p class="text-sm text-surface-700 dark:text-surface-200 m-0">Improved health outcomes and reduced waterborne disease mortality in targeted communities by 40% within 3 years of implementation.</p>
                                        </div>
                                        <div class="flex flex-col gap-1 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                                            <span class="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Outcomes</span>
                                            <p class="text-sm text-surface-700 dark:text-surface-200 m-0">Sustainable access to clean water for 2.5M beneficiaries; 150 local operators trained; 45 filtration facilities operational.</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Beneficiaries -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Beneficiaries</span>
                                    <div class="grid grid-cols-3 gap-4">
                                        <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                            <span class="text-xs text-surface-500 dark:text-surface-400">Direct</span>
                                            <span class="text-lg font-bold text-surface-900 dark:text-surface-0">850,000</span>
                                        </div>
                                        <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                            <span class="text-xs text-surface-500 dark:text-surface-400">Indirect</span>
                                            <span class="text-lg font-bold text-surface-900 dark:text-surface-0">1,650,000</span>
                                        </div>
                                        <div class="flex flex-col gap-1 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                                            <span class="text-xs text-primary-600 dark:text-primary-400">Total</span>
                                            <span class="text-lg font-bold text-primary-700 dark:text-primary-300">2,500,000</span>
                                        </div>
                                    </div>
                                    <p class="text-sm text-surface-700 dark:text-surface-200 m-0">
                                        Beneficiaries include rural and peri-urban households in water-stressed districts, with a priority focus on women and children who bear the primary burden of water collection and waterborne illness.
                                    </p>
                                </div>

                                <!-- Cross-cutting Concerns -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Cross-cutting Concerns</span>
                                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        @for (concern of crossCuttingConcerns; track concern.label) {
                                            <div class="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                                <i class="pi text-sm" [ngClass]="concern.value ? 'pi-check-circle text-green-500' : 'pi-times-circle text-surface-400'"></i>
                                                <span class="text-sm text-surface-700 dark:text-surface-200">{{ concern.label }}</span>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <!-- SDG Alignment -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">SDG Alignment</span>
                                    <div class="flex flex-col gap-3">
                                        @for (sdg of sdgAlignments; track sdg.number) {
                                            <div class="p-4 rounded-xl border border-surface-100 dark:border-surface-700" [class]="sdg.isPrimary ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'bg-surface-50 dark:bg-surface-800'">
                                                <div class="flex items-center gap-3 mb-2">
                                                    <div class="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white" [class]="sdg.number === 6 ? 'bg-sky-500' : 'bg-green-600'">{{ sdg.number }}</div>
                                                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ sdg.name }}</span>
                                                    <p-tag [value]="sdg.isPrimary ? 'Primary' : 'Secondary'" [severity]="sdg.isPrimary ? 'info' : 'secondary'" styleClass="text-xs" />
                                                </div>
                                                @if (sdg.targets.length > 0) {
                                                    <div class="flex flex-wrap gap-1.5 ml-11">
                                                        @for (target of sdg.targets; track target) {
                                                            <span class="px-2 py-0.5 rounded-md bg-white dark:bg-surface-700 border border-surface-200 dark:border-surface-600 text-xs text-surface-600 dark:text-surface-300">{{ target }}</span>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- WHO - PARTNERS -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-who">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isWhoExpanded()" (click)="isWhoExpanded.set(!isWhoExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Who — Partners</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isWhoExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isWhoExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="flex items-center gap-2 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800">
                                    <i class="pi pi-dollar text-green-600"></i>
                                    <span class="text-sm font-semibold text-green-700 dark:text-green-300">Total Opportunity Budget: $15,000,000 USD</span>
                                </div>

                                <!-- Funding Partners -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Funding Partners</span>
                                    @for (partner of fundingPartners; track partner.id) {
                                        <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700 border-l-4 border-l-primary-500 dark:border-l-primary-400">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <div class="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                                                        <i class="pi pi-building text-primary-600 dark:text-primary-400"></i>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-primary-600 dark:text-primary-400 cursor-pointer hover:underline">{{ partner.name }}</span>
                                                        <span class="text-xs text-surface-500 dark:text-surface-400">Funding Partner</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-shrink-0">
                                                    <p-tag [value]="partner.status" severity="success" styleClass="text-xs" />
                                                    <p-tag [value]="partner.contributionPercentage + '%'" severity="info" styleClass="text-xs" />
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-xs text-surface-500 dark:text-surface-400">Contribution</span>
                                                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">\${{ partner.contributionUSD.toLocaleString() }}</span>
                                                </div>
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-xs text-surface-500 dark:text-surface-400">Due Diligence</span>
                                                    <div class="flex items-center gap-1">
                                                        <i class="pi pi-check-circle text-xs text-green-500"></i>
                                                        <span class="text-sm text-surface-700 dark:text-surface-200">{{ partner.dueDiligenceStatus }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-xs text-surface-500 dark:text-surface-400">DD Expiry</span>
                                                    <span class="text-sm text-surface-700 dark:text-surface-200">{{ partner.dueDiligenceExpiry }}</span>
                                                </div>
                                            </div>
                                            @if (partner.agreements.length > 0) {
                                                <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                                    <span class="text-xs text-surface-500 dark:text-surface-400 mr-1">Agreements:</span>
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
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Client Partners</span>
                                    @for (partner of clientPartners; track partner.id) {
                                        <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700 border-l-4 border-l-teal-500 dark:border-l-teal-400">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <div class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                                        <i class="pi pi-building text-teal-600 dark:text-teal-400"></i>
                                                    </div>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-teal-600 dark:text-teal-400 cursor-pointer hover:underline">{{ partner.name }}</span>
                                                        <span class="text-xs text-surface-500 dark:text-surface-400">Client Partner</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-shrink-0">
                                                    <p-tag [value]="partner.status" severity="success" styleClass="text-xs" />
                                                </div>
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-xs text-surface-500 dark:text-surface-400">Due Diligence</span>
                                                    <div class="flex items-center gap-1">
                                                        <i class="pi pi-check-circle text-xs text-green-500"></i>
                                                        <span class="text-sm text-surface-700 dark:text-surface-200">{{ partner.dueDiligenceStatus }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex flex-col gap-0.5">
                                                    <span class="text-xs text-surface-500 dark:text-surface-400">DD Expiry</span>
                                                    <span class="text-sm text-surface-700 dark:text-surface-200">{{ partner.dueDiligenceExpiry }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- WHERE - GEOGRAPHY -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-where">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isWhereExpanded()" (click)="isWhereExpanded.set(!isWhereExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-globe text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Where — Geography</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isWhereExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isWhereExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-4 p-2">
                                <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Implementation Countries</span>
                                <div class="flex flex-col gap-3">
                                    @for (country of countries; track country.id) {
                                        <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div class="flex items-center gap-3 flex-1 min-w-0">
                                                    <span class="text-lg font-bold text-surface-400 dark:text-surface-500 w-8">{{ country.isoCode }}</span>
                                                    <div class="flex flex-col min-w-0">
                                                        <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ country.name }}</span>
                                                        <span class="text-xs text-surface-500 dark:text-surface-400">{{ country.continent }} · {{ country.region }}</span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                                    @for (tag of country.tags; track tag) {
                                                        <p-tag [value]="tag" severity="secondary" styleClass="text-xs" />
                                                    }
                                                    @if (country.hasUNSDCF) {
                                                        <p-tag value="Active UNSDCF" severity="success" styleClass="text-xs" />
                                                    }
                                                </div>
                                            </div>
                                            <div class="mt-2 pt-2 border-t border-surface-200 dark:border-surface-700">
                                                <span class="text-xs text-surface-500 dark:text-surface-400">Org Unit: </span>
                                                <span class="text-xs text-surface-700 dark:text-surface-200">{{ country.orgUnit }}</span>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div class="flex flex-wrap gap-4 text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-200 dark:border-surface-700">
                                    <span><strong>HCA</strong> = Humanitarian, Conflict, and post-conflict Areas</span>
                                    <span><strong>SIDS</strong> = Small Island Developing States</span>
                                    <span><strong>UNSDCF</strong> = UN Sustainable Development Cooperation Framework</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- WHEN - TIMELINE -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-when">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isWhenExpanded()" (click)="isWhenExpanded.set(!isWhenExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-calendar text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">When — Timeline</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isWhenExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isWhenExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-5 p-2">
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Target Signing</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">Apr 1, 2026</span>
                                        <p-tag value="Firm Deadline" severity="warn" styleClass="text-xs w-fit mt-1" />
                                    </div>
                                    <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Implementation Start</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">May 1, 2026</span>
                                    </div>
                                    <div class="flex flex-col gap-1 p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Target Delivery</span>
                                        <span class="text-base font-bold text-surface-900 dark:text-surface-0">May 1, 2028</span>
                                    </div>
                                </div>
                                <div class="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 flex items-center gap-3">
                                    <i class="pi pi-clock text-primary-600"></i>
                                    <span class="text-sm font-medium text-primary-700 dark:text-primary-300">Implementation Duration: 24 months</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Submission Deadline</span>
                                    <span class="text-sm text-surface-700 dark:text-surface-200">Mar 15, 2026</span>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Signing Date Notes</span>
                                    <p class="text-sm text-surface-700 dark:text-surface-200 m-0">Signing is contingent on completion of due diligence for all partners and final approval from the regional director.</p>
                                </div>

                                <!-- Timeline -->
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Key Milestones</span>
                                    <!-- Phase bar -->
                                    <div class="flex rounded-lg overflow-hidden h-3">
                                        <div class="bg-blue-400 dark:bg-blue-600" style="width: 15%;" pTooltip="Development: ~110 days" tooltipPosition="top"></div>
                                        <div class="bg-green-400 dark:bg-green-600" style="width: 85%;" pTooltip="Implementation: ~730 days" tooltipPosition="top"></div>
                                    </div>
                                    <div class="flex justify-between text-xs text-surface-500 dark:text-surface-400">
                                        <span>Development</span>
                                        <span>Implementation</span>
                                    </div>
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
                                                    <span class="text-xs text-surface-500 dark:text-surface-400">{{ event.date }}</span>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Group: Risk & Management -->
                <div class="flex items-center gap-3 pt-2">
                    <div class="h-px flex-1 bg-surface-200 dark:bg-surface-700"></div>
                    <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Risk &amp; Management</span>
                    <div class="h-px flex-1 bg-surface-200 dark:bg-surface-700"></div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- RISKS -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-risks">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isRisksExpanded()" (click)="isRisksExpanded.set(!isRisksExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-chart-line text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Risks</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isRisksExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isRisksExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-3 p-2">
                                @for (risk of risks; track risk.id) {
                                    <div class="p-4 rounded-xl border-l-4"
                                        [class]="riskCardClass(risk)">
                                        <div class="flex flex-col gap-2">
                                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                                <span class="text-sm font-semibold text-surface-900 dark:text-surface-0 flex-1">{{ risk.title }}</span>
                                                <div class="flex items-center gap-2 flex-shrink-0 flex-wrap">
                                                    @if (risk.isOrgHighRisk) {
                                                        <p-tag value="Org. High Risk" severity="danger" styleClass="text-xs" />
                                                    }
                                                    <p-tag [value]="risk.category" severity="secondary" styleClass="text-xs" />
                                                    <p-tag [value]="risk.probability" [severity]="risk.probability === 'High' ? 'danger' : risk.probability === 'Medium' ? 'warn' : 'secondary'" styleClass="text-xs" />
                                                </div>
                                            </div>
                                            <p class="text-sm text-surface-700 dark:text-surface-200 m-0">{{ risk.description }}</p>
                                            <div class="flex flex-wrap gap-4 text-xs text-surface-500 dark:text-surface-400 pt-2 border-t border-surface-200 dark:border-surface-700">
                                                <span><strong>Impact:</strong> {{ risk.impact }}</span>
                                                <span><strong>Proximity:</strong> {{ risk.proximity }}</span>
                                                <span><strong>Response:</strong> {{ risk.responseType }}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- RELATED -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-related">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isRelatedExpanded()" (click)="isRelatedExpanded.set(!isRelatedExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-link text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Related</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isRelatedExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isRelatedExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-3 p-2">
                                <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Source Interactions</span>
                                <p-table
                                    [value]="interactions"
                                    styleClass="flex flex-col rounded-2xl overflow-hidden"
                                    tableStyleClass="w-full"
                                >
                                    <ng-template #header>
                                        <tr>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                        </tr>
                                    </ng-template>
                                    <ng-template #body let-item>
                                        <tr class="cursor-pointer hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                                            <td>
                                                <span class="text-sm text-primary-600 dark:text-primary-400 font-medium">{{ item.title }}</span>
                                            </td>
                                            <td><p-tag [value]="item.type" severity="secondary" styleClass="text-xs" /></td>
                                            <td><span class="text-sm text-surface-600 dark:text-surface-300">{{ item.date }}</span></td>
                                            <td><p-tag [value]="item.status" [severity]="item.status === 'Completed' ? 'success' : 'info'" styleClass="text-xs" /></td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- COLLABORATION (Comments) -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-collaboration">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isCollaborationExpanded()" (click)="isCollaborationExpanded.set(!isCollaborationExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-comments text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Collaboration</h4>
                            <span class="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold">3</span>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isCollaborationExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isCollaborationExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-4 p-2">
                                @for (comment of comments; track comment.id) {
                                    <div class="flex gap-3">
                                        <p-avatar [image]="'demo/images/avatar/' + comment.avatar" shape="circle" styleClass="w-8 h-8 flex-shrink-0" />
                                        <div class="flex flex-col gap-1 flex-1">
                                            <div class="flex items-center gap-2">
                                                <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ comment.author }}</span>
                                                <span class="text-xs text-surface-500 dark:text-surface-400">{{ comment.time }}</span>
                                            </div>
                                            <p class="text-sm text-surface-700 dark:text-surface-200 m-0">{{ comment.text }}</p>
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
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- TEAM -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-team">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isTeamExpanded()" (click)="isTeamExpanded.set(!isTeamExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-building text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Team</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isTeamExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>
                    <div class="expand-body" [class.expand-body--open]="isTeamExpanded()">
                        <div class="expand-body__inner">
                            <div class="flex flex-col gap-6 p-2">
                                <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                    <!-- Left: Manager + Collaborators (2 cols) -->
                                    <div class="xl:col-span-2 flex flex-col gap-6">
                                        <!-- Opportunity Manager -->
                                        <div class="flex flex-col gap-3">
                                            <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Opportunity Manager</span>
                                            <div class="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800">
                                                <div class="flex items-center gap-3">
                                                    <p-avatar image="demo/images/avatar/amyelsner.png" shape="circle" styleClass="w-10 h-10" />
                                                    <div class="flex flex-col">
                                                        <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">Olivia Martinez</span>
                                                        <span class="text-xs text-surface-500 dark:text-surface-400">Programme Manager, P4 · KEOC</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Collaborators -->
                                        <div class="flex flex-col gap-3">
                                            <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Opportunity Collaborators</span>
                                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                @for (member of teamMembers; track member.id) {
                                                    <div class="p-3 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
                                                        <div class="flex items-center gap-3">
                                                            <p-avatar [image]="'demo/images/avatar/' + member.image" shape="circle" styleClass="w-9 h-9" />
                                                            <div class="flex flex-col flex-1 min-w-0">
                                                                <div class="flex items-center gap-2">
                                                                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ member.name }}</span>
                                                                    <p-tag [value]="member.role" severity="secondary" styleClass="text-xs" />
                                                                </div>
                                                                <span class="text-xs text-surface-500 dark:text-surface-400">{{ member.position }}</span>
                                                            </div>
                                                        </div>
                                                        @if (member.expertise.length > 0) {
                                                            <div class="flex flex-wrap gap-1.5 mt-2 ml-12">
                                                                @for (skill of member.expertise; track skill) {
                                                                    <span class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-300">{{ skill }}</span>
                                                                }
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                            </div>
                                        </div>

                                        <!-- Proposed Initiative Type -->
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Proposed Initiative Type</span>
                                            <span class="text-sm font-medium text-surface-900 dark:text-surface-0">Grant Support</span>
                                        </div>
                                    </div>

                                    <!-- Right: Decision-Making Pathway (1 col) -->
                                    <div class="flex flex-col gap-3">
                                        <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">Decision-Making Pathway</span>
                                        <div class="p-4 rounded-xl bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700">
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
                                                            <span class="text-xs text-surface-500 dark:text-surface-400">{{ step.approver }}</span>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Group: Activity & Work -->
                <div class="flex items-center gap-3 pt-2">
                    <div class="h-px flex-1 bg-surface-200 dark:bg-surface-700"></div>
                    <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Activity &amp; Work</span>
                    <div class="h-px flex-1 bg-surface-200 dark:bg-surface-700"></div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- ACTIVITY FEED (existing) -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-activity">
                    <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isActivityExpanded()" (click)="isActivityExpanded.set(!isActivityExpanded())">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-history text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Activity</h4>
                        </div>
                        <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isActivityExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </div>

                    <div class="expand-body" [class.expand-body--open]="isActivityExpanded()">
                        <div class="expand-body__inner">
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
                                                            <i class="pi text-sm text-surface-700 dark:text-surface-200" [ngClass]="activity.icon"></i>
                                                            <span class="text-surface-950 dark:text-surface-0 text-base font-medium leading-normal">{{ activity.title }}</span>
                                                        </div>
                                                        <p class="text-surface-700 dark:text-surface-200 text-sm leading-tight">{{ activity.description }}</p>
                                                    </div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-surface-700 dark:text-surface-200 text-sm leading-tight">{{ activity.time }}</span>
                                                        <div class="w-0 h-[6px] border-l border-surface-200 dark:border-surface-700"></div>
                                                        <span class="text-surface-700 dark:text-surface-200 text-sm leading-tight">{{ activity.author }}</span>
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
                    </div>
                </div>

                <!-- ═══════════════════════════════════════════════ -->
                <!-- TASKS (existing) -->
                <!-- ═══════════════════════════════════════════════ -->
                <div class="card" id="section-tasks">
                    <div class="flex flex-col gap-6">
                        <div class="flex items-center justify-between px-2 cursor-pointer" (click)="isTasksExpanded.set(!isTasksExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-check-square text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Tasks</h4>
                                <p-button icon="pi pi-plus" label="New Task" [outlined]="true" size="small" styleClass="!text-primary-600 !border-primary-600 ml-12!" (onClick)="openNewTaskDrawer(); $event.stopPropagation()" />
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [ngClass]="isTasksExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                        </div>

                        <div class="expand-body" [class.expand-body--open]="isTasksExpanded()">
                            <div class="expand-body__inner">
                        <div class="flex flex-col gap-6">
                        <div class="flex flex-wrap gap-2" role="tablist" aria-label="Task filters">
                            @for (filter of taskFilterOptions; track filter.key) {
                                <button
                                    role="tab"
                                    [attr.aria-selected]="activeTaskFilter() === filter.key"
                                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer"
                                    [class]="activeTaskFilter() === filter.key
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700'
                                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-600'"
                                    (click)="activeTaskFilter.set(filter.key)"
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

                        <p-accordion [value]="openTaskPanels" [multiple]="true" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                            @if (pendingTasks().length > 0) {
                                <p-accordionpanel value="0" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                                    <p-accordionheader [pt]="{ root: { class: 'pl-0! bg-transparent!' } }">
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

                            @if (inProgressTasks().length > 0) {
                                <p-accordionpanel value="1" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                                    <p-accordionheader [pt]="{ root: { class: 'pl-0! bg-transparent!' } }">
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

                            @if (completedTasks().length > 0) {
                                <p-accordionpanel value="2" [pt]="{ root: { class: 'border-none! bg-transparent!' } }">
                                    <p-accordionheader [pt]="{ root: { class: 'pl-0! bg-transparent!' } }">
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
                        </div>
                    </div>
                </div>

                <!-- Footer: Audit Metadata -->
                <div class="flex flex-wrap items-center gap-x-6 gap-y-2 px-2 py-3 text-xs text-surface-500 dark:text-surface-400 border-t border-surface-200 dark:border-surface-700">
                    <span><strong>Created by:</strong> Olivia Martinez</span>
                    <span><strong>Created:</strong> Apr 5, 2026</span>
                    <span><strong>Last modified by:</strong> James Anderson</span>
                    <span><strong>Last modified:</strong> Apr 30, 2026</span>
                </div>

            </div>

            <!-- ═══════════════════════════════════════════════ -->
            <!-- RIGHT SIDEBAR -->
            <!-- ═══════════════════════════════════════════════ -->
            <div class="w-full xl:w-[380px] flex flex-col gap-6 shrink-0 [&>.card]:mb-0 xl:sticky xl:top-16 xl:self-start">
                <!-- AI Project Analysis Card -->
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
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">AI Project Analysis</h4>
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
                                    placeholder="Search AI insights, risks, or optimizations..."
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

                <!-- Documents Section -->
                <div class="card flex flex-col">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-3">
                            <i class="pi pi-folder text-deepsea-500 dark:text-surface-0"></i>
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Documents</h4>
                        </div>

                        <div class="flex flex-wrap gap-2" role="tablist" aria-label="Document type filters">
                            @for (filter of docFilterOptions(); track filter) {
                                <button
                                    role="tab"
                                    [attr.aria-selected]="activeDocFilter() === filter"
                                    class="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer"
                                    [class]="activeDocFilter() === filter
                                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border-primary-200 dark:border-primary-700'
                                        : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-600 hover:bg-surface-200 dark:hover:bg-surface-600'"
                                    (click)="activeDocFilter.set(filter)"
                                >{{ filter }}</button>
                            }
                        </div>

                        <p-iconfield>
                            <p-inputicon class="pi pi-search" />
                            <input pInputText [(ngModel)]="docSearchQuery" placeholder="Search documents" class="w-full" />
                        </p-iconfield>

                        <p-table
                            [value]="filteredDocuments()"
                            [paginator]="true"
                            [rows]="5"
                            sortMode="multiple"
                            styleClass="flex flex-col rounded-2xl overflow-hidden [&>[data-pc-section=paginatorcontainer]]:border-0! [&>[data-pc-section=paginatorcontainer]]:mt-auto [&_[data-pc-name=pcpaginator]]:rounded-none!"
                            tableStyleClass="w-full"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        >
                            <ng-template #header>
                                <tr>
                                    <th pSortableColumn="fileName">File Name <p-sortIcon field="fileName" /></th>
                                    <th pSortableColumn="type">Type <p-sortIcon field="type" /></th>
                                    <th>Actions</th>
                                </tr>
                            </ng-template>
                            <ng-template #body let-doc>
                                <tr>
                                    <td>
                                        <div class="flex items-center gap-3 py-1">
                                            <i class="pi text-xl text-surface-600 dark:text-surface-300" [ngClass]="doc.icon"></i>
                                            <span class="text-surface-700 dark:text-surface-200 text-sm whitespace-nowrap">{{ doc.fileName }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <p-tag [value]="doc.type" [severity]="getTagSeverity()" styleClass="px-2 py-1" />
                                    </td>
                                    <td>
                                        <div class="flex items-center gap-1">
                                            <p-button icon="pi pi-download" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" ariaLabel="Download" />
                                            <p-button icon="pi pi-ellipsis-h" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" ariaLabel="More options" (onClick)="onDocMenuToggle($event, doc, docMenu)" />
                                            <p-menu #docMenu [model]="docMenuItems" [popup]="true" styleClass="w-48!" appendTo="body" />
                                        </div>
                                    </td>
                                </tr>
                            </ng-template>
                        </p-table>

                        <p-fileupload
                            name="documents[]"
                            [multiple]="true"
                            maxFileSize="10000000"
                            mode="advanced"
                            [auto]="false"
                            chooseLabel="Upload File"
                            chooseIcon="pi pi-upload"
                            [showUploadButton]="false"
                            [showCancelButton]="false"
                        >
                            <ng-template #header let-chooseCallback="chooseCallback">
                                <div class="flex items-center gap-2 w-full">
                                    <p-button icon="pi pi-upload" label="Upload File" (onClick)="chooseCallback()" />
                                    <p-button icon="pi pi-link" label="Share Link" [outlined]="true" styleClass="!text-primary-600 !border-primary-600" (onClick)="shareDocumentLink()" />
                                </div>
                            </ng-template>
                            <ng-template #empty>
                                <div class="flex flex-col items-center gap-2 py-4">
                                    <i class="pi pi-cloud-upload text-2xl text-surface-400 dark:text-surface-300"></i>
                                    <span class="text-surface-500 dark:text-surface-100 text-sm">Drag and drop files here</span>
                                </div>
                            </ng-template>
                        </p-fileupload>
                    </div>
                </div>
            </div>
        </div>

        <p-confirmdialog header="Confirmation" />
        <app-task-drawer [(visible)]="isTaskDrawerVisible" [task]="selectedTask" [mode]="taskDrawerMode" (save)="handleTaskDrawerSave($event)" (cancel)="handleTaskDrawerCancel()" />
        </div>

        <!-- Unified Task Item Template -->
        <ng-template #taskItem let-task="task" let-isLast="isLast">
            <div class="flex flex-col">
                <div class="px-2 pt-3 pb-1">
                    <div class="flex items-center gap-3">
                        <p-checkbox [(ngModel)]="task.completed" [binary]="true" [inputId]="'opp-task-' + task.id" [ariaLabel]="'Mark ' + task.title + ' as ' + (task.completed ? 'incomplete' : 'complete')" (onChange)="toggleTaskCompletion(task, task.completed)" />
                        <div class="text-sm font-medium leading-normal transition-all duration-300 flex-1" [ngClass]="task.completed ? 'text-surface-700 dark:text-surface-200 line-through' : 'text-surface-900 dark:text-surface-0'">
                            {{ task.title }}
                        </div>
                    </div>
                    @if (task.description && !task.completed) {
                        <div class="text-surface-700 dark:text-surface-200 text-xs leading-tight line-clamp-2 pl-8 pt-1">{{ task.description }}</div>
                    }
                </div>
                <div class="pl-8 pr-2 pt-1 pb-3 flex items-center gap-2">
                    @if (task.startDate) {
                        <p-tag [value]="task.startDate" severity="secondary" size="small" />
                    }
                    @if (task.startDate && task.endDate) {
                        <span class="text-surface-600 dark:text-surface-300 text-xs">-</span>
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
                    <div class="px-2 py-1">
                        <div class="border-t border-dashed border-surface-200 dark:border-surface-700"></div>
                    </div>
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

        .nav-glass {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.2) 0%,
                rgba(255, 255, 255, 0.08) 50%,
                rgba(255, 255, 255, 0.03) 100%
            );
        }

        :host-context(.app-dark) .nav-glass {
            background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.06) 0%,
                rgba(255, 255, 255, 0.02) 50%,
                rgba(255, 255, 255, 0.005) 100%
            );
        }

    `
})
export class Opportunity implements OnInit, AfterViewInit {

    private sectionObserver: IntersectionObserver | null = null;
    isNavStuck = signal(false);

    // ─── Section Navigation ───
    sections: SectionNav[] = [
        { id: 'analysis', label: 'Analysis', icon: 'pi-chart-bar' },
        { id: 'overview', label: 'Overview', icon: 'pi-file' },
        { id: 'what', label: 'What', icon: 'pi-briefcase' },
        { id: 'why', label: 'Why', icon: 'pi-lightbulb' },
        { id: 'who', label: 'Who', icon: 'pi-users' },
        { id: 'where', label: 'Where', icon: 'pi-globe' },
        { id: 'when', label: 'When', icon: 'pi-calendar' },
        { id: 'risks', label: 'Risks', icon: 'pi-chart-line' },
        { id: 'related', label: 'Related', icon: 'pi-link' },
        { id: 'collaboration', label: 'Comments', icon: 'pi-comments' },
        { id: 'team', label: 'Team', icon: 'pi-building' },
        { id: 'activity', label: 'Activity', icon: 'pi-history' },
        { id: 'tasks', label: 'Tasks', icon: 'pi-check-square' }
    ];
    activeSection = signal('analysis');

    // ─── Section Expand States ───
    isAnalysisExpanded = signal(true);
    isOverviewExpanded = signal(true);
    isWhatExpanded = signal(false);
    isWhyExpanded = signal(false);
    isWhoExpanded = signal(false);
    isWhereExpanded = signal(false);
    isWhenExpanded = signal(false);
    isRisksExpanded = signal(false);
    isRelatedExpanded = signal(false);
    isCollaborationExpanded = signal(false);
    isTeamExpanded = signal(false);

    // ─── Analysis Stats ───
    analysisStats = [
        { label: 'Total Budget', value: '$15M', icon: 'pi-dollar', iconColor: 'text-green-500' },
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
        { number: 6, name: 'Clean Water and Sanitation', isPrimary: true, targets: ['6.1 — Safe drinking water', '6.3 — Water quality improvement', '6.b — Local water management'] },
        { number: 3, name: 'Good Health and Well-being', isPrimary: false, targets: ['3.3 — Waterborne disease reduction', '3.9 — Environmental health risks'] }
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

    // ─── Activity & Tasks Expand ───
    isActivityExpanded = signal(false);
    isTasksExpanded = signal(false);

    // ─── AI Analysis ───
    isAiCardExpanded = signal(false);
    aiSearchQuery = signal('');
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

    // ─── Tasks ───
    activeTaskFilter = signal('All');
    taskSearchQuery = model('');
    openTaskPanels: string[] = ['0', '1', '2'];
    accordionContentPT = { root: { class: 'overflow-hidden bg-transparent!' }, content: { class: 'bg-transparent!' } };
    isTaskDrawerVisible = false;
    selectedTask: Task | null = null;
    taskDrawerMode: 'create' | 'edit' = 'create';

    taskFilterOptions = [
        { key: 'All', label: 'All', icon: 'pi pi-list', countKey: 'all' as const, badgeClass: 'bg-surface-200 dark:bg-surface-600 text-surface-900 dark:text-surface-100' },
        { key: 'Pending', label: 'Not Started', icon: 'pi pi-inbox', countKey: 'pending' as const, badgeClass: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
        { key: 'In Progress', label: 'In Progress', icon: 'pi pi-clock', countKey: 'inProgress' as const, badgeClass: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
        { key: 'Completed', label: 'Completed', icon: 'pi pi-check-circle', countKey: 'completed' as const, badgeClass: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' }
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
    activeDocFilter = signal('All Files');
    docSearchQuery = model('');
    docFileTypes = computed(() => {
        const types = [...new Set(this.documents().map(d => d.type))];
        types.sort();
        return types;
    });

    docFilterOptions = computed(() => ['All Files', ...this.docFileTypes(), 'Other']);

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

    filteredDocuments = computed(() => {
        let docs = this.documents();
        const query = this.docSearchQuery().trim().toLowerCase();
        if (query) {
            docs = docs.filter(d => d.fileName.toLowerCase().includes(query) || d.owner.toLowerCase().includes(query));
        }
        const filter = this.activeDocFilter();
        if (filter === 'All Files') return docs;
        if (filter === 'Other') {
            const knownTypes = this.docFileTypes();
            return docs.filter(d => !knownTypes.includes(d.type));
        }
        return docs.filter(d => d.type === filter);
    });

    docMenuItems: MenuItem[] = [];

    private messageService = inject(MessageService);

    constructor(private confirmationService: ConfirmationService) {}

    ngOnInit() {
        const onResize = () => this.aiInsightsPerPage.set(this.calcInsightsPerPage());
        window.addEventListener('resize', onResize);
        this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    }

    ngAfterViewInit() {
        this.setupSectionObserver();
        this.setupNavStuckObserver();
        this.destroyRef.onDestroy(() => this.sectionObserver?.disconnect());
    }

    private setupSectionObserver() {
        this.sectionObserver = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        const id = entry.target.id.replace('section-', '');
                        this.activeSection.set(id);
                    }
                }
            },
            { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
        );
        for (const section of this.sections) {
            const el = document.getElementById('section-' + section.id);
            if (el) this.sectionObserver.observe(el);
        }
    }

    private setupNavStuckObserver() {
        const navEl = document.querySelector('[class*="sticky top-0"]');
        if (!navEl) return;
        const sentinel = document.createElement('div');
        sentinel.style.height = '1px';
        sentinel.style.marginBottom = '-1px';
        navEl.parentElement?.insertBefore(sentinel, navEl);
        const observer = new IntersectionObserver(
            ([entry]) => this.isNavStuck.set(!entry.isIntersecting),
            { threshold: 1 }
        );
        observer.observe(sentinel);
        this.destroyRef.onDestroy(() => observer.disconnect());
    }

    // ─── Section Navigation ───
    scrollToSection(sectionId: string) {
        const expandSignal = this.getExpandSignal(sectionId);
        if (expandSignal && !expandSignal()) expandSignal.set(true);
        this.activeSection.set(sectionId);
        setTimeout(() => {
            const el = document.getElementById('section-' + sectionId);
            if (!el) return;
            const scrollContainer = el.closest('.layout-content-wrapper') ?? window;
            const navHeight = 72;
            if (scrollContainer instanceof Window) {
                const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            } else {
                const top = el.offsetTop - navHeight;
                scrollContainer.scrollTo({ top, behavior: 'smooth' });
            }
        });
    }

    private getExpandSignal(sectionId: string) {
        const map: Record<string, ReturnType<typeof signal<boolean>> | undefined> = {
            analysis: this.isAnalysisExpanded, overview: this.isOverviewExpanded,
            what: this.isWhatExpanded, why: this.isWhyExpanded, who: this.isWhoExpanded,
            where: this.isWhereExpanded, when: this.isWhenExpanded, risks: this.isRisksExpanded,
            related: this.isRelatedExpanded, collaboration: this.isCollaborationExpanded,
            team: this.isTeamExpanded, activity: this.isActivityExpanded, tasks: this.isTasksExpanded
        };
        return map[sectionId];
    }

    // ─── Task Methods ───
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

    // ─── Document Methods ───
    onDocMenuToggle(event: Event, doc: Document, menu: Menu) {
        this.docMenuItems = [
            { label: 'Edit', icon: 'pi pi-pencil' },
            { label: 'Share', icon: 'pi pi-share-alt' },
            { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteDocument(doc.id) }
        ];
        menu.toggle(event);
    }

    deleteDocument(docId: number) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this document?',
            header: 'Delete Document',
            icon: 'pi pi-info-circle',
            rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Delete', severity: 'danger' },
            accept: () => this.documents.set(this.documents().filter((d) => d.id !== docId))
        });
    }

    shareDocumentLink() {
        navigator.clipboard.writeText(window.location.href);
        this.messageService.add({ severity: 'success', summary: 'Link Copied', detail: 'Document link copied to clipboard' });
    }

    getTagSeverity(): 'secondary' {
        return 'secondary';
    }

    riskCardClass(risk: Risk): string {
        if (risk.probability === 'High' || risk.isOrgHighRisk) {
            return 'bg-red-50 dark:bg-red-900/10 border-red-400 dark:border-red-600 border border-red-100 dark:border-red-800';
        }
        if (risk.probability === 'Medium') {
            return 'bg-orange-50 dark:bg-orange-900/10 border-orange-400 dark:border-orange-600 border border-orange-100 dark:border-orange-800';
        }
        return 'bg-surface-50 dark:bg-surface-800 border-surface-300 dark:border-surface-600 border border-surface-100 dark:border-surface-700';
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
