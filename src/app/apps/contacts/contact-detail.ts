import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { AiCardBgComponent } from '@unopsitg/ux';
import { Contact, ContactService, getContactStatusClass } from './contact.service';

interface AiInsight {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: string;
    iconColor: string;
}

const INTERACTION_ICONS: Record<string, string> = {
    Meeting: 'pi pi-calendar',
    Email: 'pi pi-envelope',
    Call: 'pi pi-phone',
    Visit: 'pi pi-map-marker',
    Other: 'pi pi-info-circle'
};

const INTERACTION_COLORS: Record<string, string> = {
    Meeting: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300',
    Email: 'bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300',
    Call: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300',
    Visit: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300',
    Other: 'bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300'
};

@Component({
    selector: 'app-contact-detail',
    imports: [CommonModule, FormsModule, ButtonModule, TagModule, PaginatorModule, RouterModule, AiCardBgComponent],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        @if (contact(); as c) {
            <div class="flex flex-col gap-6 animate-fade-in-up">

                <!-- Back + Actions Bar -->
                <div class="flex items-center justify-between">
                    <p-button
                        icon="pi pi-arrow-left"
                        label="Contacts"
                        [text]="true"
                        severity="secondary"
                        routerLink="/apps/contacts"
                    />
                    <div class="flex items-center gap-2">
                        <p-button icon="pi pi-pencil" label="Edit" [outlined]="true" severity="secondary" size="small" />
                        <p-button icon="pi pi-ellipsis-v" [rounded]="true" [text]="true" severity="secondary" size="small" />
                    </div>
                </div>

                <!-- Header -->
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div class="flex flex-wrap items-center gap-3 sm:gap-4 flex-1 min-w-0">
                        <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                            <span class="text-primary text-base font-bold">{{ getInitials(c) }}</span>
                        </div>
                        <div class="flex flex-col gap-1 min-w-0">
                            <h1 class="text-deepsea-500 dark:text-surface-0 text-xl sm:text-2xl font-extrabold leading-8 m-0">
                                {{ c.salutation ? c.salutation + ' ' : '' }}{{ c.firstName }} {{ c.lastName }}
                            </h1>
                            <div class="flex items-center flex-wrap gap-2">
                                @if (c.type) {
                                    <p-tag [value]="c.type" severity="info" />
                                }
                                @if (c.status) {
                                    <p-tag [value]="c.status" [styleClass]="getStatusClass(c.status)" />
                                }
                            </div>
                            <div class="flex items-center flex-wrap gap-x-3 gap-y-1 text-sm text-surface-600 dark:text-surface-300">
                                @if (c.title) {
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-briefcase text-xs text-surface-400"></i>
                                        {{ c.title }}
                                    </span>
                                }
                                @if (c.organization) {
                                    <span class="text-surface-300 dark:text-surface-600">&middot;</span>
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-building text-xs text-surface-400"></i>
                                        {{ c.organization }}
                                    </span>
                                }
                                @if (c.country) {
                                    <span class="text-surface-300 dark:text-surface-600">&middot;</span>
                                    <span class="flex items-center gap-1.5">
                                        <i class="pi pi-map-marker text-xs text-surface-400"></i>
                                        {{ c.city ? c.city + ', ' : '' }}{{ c.country }}
                                    </span>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col xl:flex-row gap-6 w-full">
                <!-- LEFT COLUMN: Main content -->
                <div class="w-full flex-1 flex flex-col gap-6 min-w-0 [&>.card]:mb-0">

                    <!-- Contact Information -->
                    <div class="card">
                        <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isContactInfoExpanded()" (click)="isContactInfoExpanded.set(!isContactInfoExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-id-card text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Contact Information</h4>
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isContactInfoExpanded()" [class.pi-chevron-down]="!isContactInfoExpanded()"></i>
                        </div>
                        <div class="expand-body" [class.expand-body--open]="isContactInfoExpanded()">
                            <div class="expand-body__inner">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 px-2 pb-4">
                                    @if (c.email) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Email</span>
                                            <a [href]="'mailto:' + c.email" class="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                                                <i class="pi pi-envelope text-xs"></i> {{ c.email }}
                                            </a>
                                        </div>
                                    }
                                    @if (c.phone) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Phone</span>
                                            <a [href]="'tel:' + c.phone" class="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                                                <i class="pi pi-phone text-xs"></i> {{ c.phone }}
                                            </a>
                                        </div>
                                    }
                                    @if (c.mobilePhone) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Mobile</span>
                                            <a [href]="'tel:' + c.mobilePhone" class="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                                                <i class="pi pi-mobile text-xs"></i> {{ c.mobilePhone }}
                                            </a>
                                        </div>
                                    }
                                    @if (c.linkedIn) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">LinkedIn</span>
                                            <a [href]="c.linkedIn" target="_blank" rel="noopener" class="text-primary text-sm font-medium hover:underline flex items-center gap-1.5">
                                                <i class="pi pi-linkedin text-xs"></i> View Profile
                                            </a>
                                        </div>
                                    }
                                    @if (c.preferredLanguage) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Preferred Language</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.preferredLanguage }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Organization & Location -->
                    <div class="card">
                        <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isOrgExpanded()" (click)="isOrgExpanded.set(!isOrgExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-building text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Organization & Location</h4>
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isOrgExpanded()" [class.pi-chevron-down]="!isOrgExpanded()"></i>
                        </div>
                        <div class="expand-body" [class.expand-body--open]="isOrgExpanded()">
                            <div class="expand-body__inner">
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 px-2 pb-4">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Organization</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.organization }}</span>
                                    </div>
                                    @if (c.department) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Department</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.department }}</span>
                                        </div>
                                    }
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Type</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.type }}</span>
                                    </div>
                                    @if (c.address) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Address</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.address }}</span>
                                        </div>
                                    }
                                    @if (c.city || c.country) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">City / Country</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.city ? c.city + ', ' : '' }}{{ c.country }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Interactions -->
                    <div class="card">
                        <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isInteractionsExpanded()" (click)="isInteractionsExpanded.set(!isInteractionsExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-comments text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Interactions</h4>
                                @if (c.interactions && c.interactions.length > 0) {
                                    <p-tag [value]="'' + c.interactions.length" severity="secondary" styleClass="ml-1" />
                                }
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isInteractionsExpanded()" [class.pi-chevron-down]="!isInteractionsExpanded()"></i>
                        </div>
                        <div class="expand-body" [class.expand-body--open]="isInteractionsExpanded()">
                            <div class="expand-body__inner">
                                @if (c.interactions && c.interactions.length > 0) {
                                    <div class="flex flex-col px-2 pb-2">
                                        @for (interaction of c.interactions; track interaction.id; let last = $last) {
                                            <div class="flex gap-4 py-3" [class.border-b]="!last" [class.border-surface-200]="!last" [class.dark:border-surface-700]="!last">
                                                <div class="flex items-center justify-center w-10 h-10 rounded-lg shrink-0"
                                                    [class]="getInteractionColor(interaction.type)">
                                                    <i [class]="getInteractionIcon(interaction.type) + ' text-sm'"></i>
                                                </div>
                                                <div class="flex flex-col gap-1 flex-1 min-w-0">
                                                    <div class="flex items-center justify-between gap-2">
                                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-semibold">{{ interaction.subject }}</span>
                                                        <span class="text-surface-500 dark:text-surface-400 text-xs shrink-0">{{ interaction.date }}</span>
                                                    </div>
                                                    <div class="flex items-center gap-2 text-xs text-surface-500 dark:text-surface-400">
                                                        <p-tag [value]="interaction.type" severity="secondary" styleClass="text-xs!" />
                                                    </div>
                                                    @if (interaction.notes) {
                                                        <p class="text-surface-600 dark:text-surface-300 text-sm m-0 mt-1">{{ interaction.notes }}</p>
                                                    }
                                                    @if (interaction.participants && interaction.participants.length > 0) {
                                                        <div class="flex items-center gap-1.5 mt-1 text-xs text-surface-500 dark:text-surface-400">
                                                            <i class="pi pi-users text-xs"></i>
                                                            <span>{{ interaction.participants!.join(', ') }}</span>
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                } @else {
                                    <div class="flex flex-col items-center justify-center gap-3 py-8 text-surface-400">
                                        <i class="pi pi-comments text-3xl"></i>
                                        <span class="text-sm">No interactions recorded for this contact yet.</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                </div>

                <!-- RIGHT COLUMN: Sidebar -->
                <div class="w-full xl:w-[380px] flex flex-col gap-6 shrink-0 [&>.card]:mb-0">

                    <!-- AI Contact Analysis -->
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
                                    <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">AI Contact Analysis</h4>
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

                    <!-- Partner -->
                    <div class="card">
                        <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isPartnerExpanded()" (click)="isPartnerExpanded.set(!isPartnerExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-globe text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Partner</h4>
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isPartnerExpanded()" [class.pi-chevron-down]="!isPartnerExpanded()"></i>
                        </div>
                        <div class="expand-body" [class.expand-body--open]="isPartnerExpanded()">
                            <div class="expand-body__inner">
                                @if (c.partnerId) {
                                    <div class="flex flex-col gap-5 px-2 pb-4">
                                        <div class="flex items-center gap-4 p-3 rounded-xl border border-surface-200 dark:border-surface-700 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                                            [routerLink]="'/apps/partners/v2/' + c.partnerId">
                                            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                                                <i class="pi pi-globe text-primary"></i>
                                            </div>
                                            <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                                                <span class="text-surface-900 dark:text-surface-0 text-sm font-semibold">{{ c.organization }}</span>
                                                <span class="text-surface-500 dark:text-surface-400 text-xs">Partner ID: {{ c.partnerId }}</span>
                                            </div>
                                            <i class="pi pi-chevron-right text-surface-400 text-sm"></i>
                                        </div>

                                        <div class="flex flex-col gap-4">
                                            <div class="flex flex-col gap-1">
                                                <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Organization Type</span>
                                                <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.type }}</span>
                                            </div>
                                            <div class="flex flex-col gap-1">
                                                <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Role at Organization</span>
                                                <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.title }}</span>
                                            </div>
                                            @if (c.department) {
                                                <div class="flex flex-col gap-1">
                                                    <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Department</span>
                                                    <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.department }}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                } @else {
                                    <div class="flex flex-col items-center justify-center gap-3 py-8 text-surface-400">
                                        <i class="pi pi-globe text-3xl"></i>
                                        <span class="text-sm">No partner linked to this contact.</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <!-- Notes -->
                    @if (c.notes) {
                        <div class="card">
                            <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isNotesExpanded()" (click)="isNotesExpanded.set(!isNotesExpanded())">
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-file-edit text-deepsea-500 dark:text-surface-0"></i>
                                    <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Notes</h4>
                                </div>
                                <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isNotesExpanded()" [class.pi-chevron-down]="!isNotesExpanded()"></i>
                            </div>
                            <div class="expand-body" [class.expand-body--open]="isNotesExpanded()">
                                <div class="expand-body__inner">
                                    <p class="text-surface-700 dark:text-surface-300 text-sm leading-relaxed m-0 px-2 pb-4">
                                        {{ c.notes }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    }

                    <!-- Documents -->
                    <div class="card">
                        <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isDocumentsExpanded()" (click)="isDocumentsExpanded.set(!isDocumentsExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-folder text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Documents</h4>
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isDocumentsExpanded()" [class.pi-chevron-down]="!isDocumentsExpanded()"></i>
                        </div>
                        <div class="expand-body" [class.expand-body--open]="isDocumentsExpanded()">
                            <div class="expand-body__inner">
                                <div class="flex flex-col items-center justify-center gap-3 py-8 text-surface-400">
                                    <i class="pi pi-folder text-3xl"></i>
                                    <span class="text-sm">No documents attached to this contact yet.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Record Information -->
                    <div class="card">
                        <div class="flex items-center justify-between px-2 cursor-pointer" [class.pb-4]="isRecordInfoExpanded()" (click)="isRecordInfoExpanded.set(!isRecordInfoExpanded())">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-info-circle text-deepsea-500 dark:text-surface-0"></i>
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Record Information</h4>
                            </div>
                            <i class="pi text-sm text-surface-600 dark:text-surface-300" [class.pi-chevron-up]="isRecordInfoExpanded()" [class.pi-chevron-down]="!isRecordInfoExpanded()"></i>
                        </div>
                        <div class="expand-body" [class.expand-body--open]="isRecordInfoExpanded()">
                            <div class="expand-body__inner">
                                <div class="flex flex-col gap-4 px-2 pb-4">
                                    <div class="flex flex-col gap-1">
                                        <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Contact ID</span>
                                        <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.id }}</span>
                                    </div>
                                    @if (c.createdDate) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Created</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.createdDate }}</span>
                                        </div>
                                    }
                                    @if (c.lastModifiedDate) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Last Modified</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.lastModifiedDate }}</span>
                                        </div>
                                    }
                                    @if (c.lastInteraction) {
                                        <div class="flex flex-col gap-1">
                                            <span class="text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">Last Interaction</span>
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-medium">{{ c.lastInteraction }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                </div>

            </div>
        } @else {
            <div class="flex flex-col items-center justify-center gap-4 py-20">
                <i class="pi pi-info-circle text-4xl text-surface-400"></i>
                <span class="text-surface-600 dark:text-surface-300 text-lg">Contact not found</span>
                <p-button label="Back to Contacts" icon="pi pi-arrow-left" routerLink="/apps/contacts" />
            </div>
        }
    `
})
export class ContactDetail implements OnInit {
    private route = inject(ActivatedRoute);
    private contactService = inject(ContactService);

    contactId = signal<string | null>(null);

    contact = computed(() => {
        const id = this.contactId();
        if (!id) return null;
        return this.contactService.getContactById(id);
    });

    isContactInfoExpanded = signal(true);
    isOrgExpanded = signal(true);
    isInteractionsExpanded = signal(true);
    isNotesExpanded = signal(true);
    isDocumentsExpanded = signal(false);
    isPartnerExpanded = signal(true);
    isRecordInfoExpanded = signal(false);

    // ─── AI Analysis ───
    isAiCardExpanded = signal(false);
    aiSearchQuery = signal('');
    aiInsights: AiInsight[] = [
        { id: 1, title: 'Engagement Declining', description: 'No interactions logged in the past 45 days. Contacts with similar roles typically have bi-weekly touchpoints.', actionLabel: 'Schedule follow-up', icon: 'pi-exclamation-triangle', iconColor: 'text-orange-500' },
        { id: 2, title: 'Relationship Strength: Strong', description: 'This contact has participated in 5 meetings and 3 calls in the last quarter, above the average for this partner.', actionLabel: 'View relationship report', icon: 'pi-chart-line', iconColor: 'text-green-500' },
        { id: 3, title: 'Missing Contact Details', description: 'Mobile phone and LinkedIn profile are missing. Contacts with complete profiles have 40% higher engagement rates.', actionLabel: 'Request info update', icon: 'pi-file', iconColor: 'text-blue-500' },
        { id: 4, title: 'Decision-Maker Identified', description: 'Based on title and interaction patterns, this contact is likely a key decision-maker for their organization.', actionLabel: 'Flag as key stakeholder', icon: 'pi-users', iconColor: 'text-teal-500' },
        { id: 5, title: 'Duplicate Contact Risk', description: 'A similar contact record exists with a matching email domain and organization. This may be a duplicate entry.', actionLabel: 'Review potential duplicate', icon: 'pi-search', iconColor: 'text-red-500' },
        { id: 6, title: 'Preferred Language Mismatch', description: 'Recent communications were sent in English, but the contact\'s preferred language is set to Japanese.', actionLabel: 'Update templates', icon: 'pi-globe', iconColor: 'text-orange-500' },
        { id: 7, title: 'Upcoming Contract Renewal', description: 'The linked partner has a contract renewal in 60 days. This is an ideal time to re-engage this contact.', actionLabel: 'Draft renewal outreach', icon: 'pi-clock', iconColor: 'text-blue-600' },
        { id: 8, title: 'Sentiment Analysis', description: 'Recent email exchanges show a positive sentiment trend. The tone has shifted from neutral to highly engaged.', actionLabel: 'View sentiment details', icon: 'pi-heart', iconColor: 'text-cherry-500' },
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
        this.contactService.getContacts();
        this.contactId.set(this.route.snapshot.paramMap.get('id'));

        const onResize = () => this.aiInsightsPerPage.set(this.calcInsightsPerPage());
        window.addEventListener('resize', onResize);
        this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    }

    getInitials(contact: Contact): string {
        return (contact.firstName[0] ?? '') + (contact.lastName[0] ?? '');
    }

    getStatusClass = getContactStatusClass;

    getInteractionIcon(type: string): string {
        return INTERACTION_ICONS[type] ?? INTERACTION_ICONS['Other'];
    }

    getInteractionColor(type: string): string {
        return INTERACTION_COLORS[type] ?? INTERACTION_COLORS['Other'];
    }
}
