import { Component, computed, DestroyRef, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { MeterGroupModule } from 'primeng/metergroup';
import { AiInsightsCardComponent, DetailLayoutComponent, DetailTabDirective, FooterService, PillTabsComponent } from '@unopsitg/ux';
import { DocumentsCard } from '../documents';

@Component({
    selector: 'app-opportunity-empty',
    host: { class: 'block w-full' },
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        TagModule,
        AvatarModule,
        TableModule,
        PaginatorModule,
        InputTextModule,
        MeterGroupModule,
        AiInsightsCardComponent,
        DetailLayoutComponent,
        DetailTabDirective,
        PillTabsComponent,
        DocumentsCard
    ],
    template: `
        <ux-detail-layout [tabs]="detailTabs" [(activeTab)]="activeTab">

            <!-- ═══ HEADER ═══ -->
            <div ux-detail-header class="flex flex-col gap-3 py-4">
                <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div class="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
                        <h1 class="text-deepsea-500 dark:text-surface-0 text-xl sm:text-2xl font-extrabold leading-8 m-0">Untitled Opportunity</h1>
                        <div class="flex items-center gap-2">
                            <p-tag value="Draft" severity="warn" />
                            <p-tag value="New" severity="secondary" />
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
                    <i class="pi pi-info-circle"></i>
                    <span>This page showcases every section and component in its empty / no-data state.</span>
                </div>
            </div>
            <div ux-detail-header-meta>
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-surface-500 dark:text-surface-400 pb-2">
                    <span class="inline-flex items-center gap-1.5">
                        <i class="pi pi-hashtag text-surface-400"></i>
                        <strong>ID:</strong> —
                    </span>
                    <span class="text-surface-300 dark:text-surface-600 hidden sm:inline">|</span>
                    <span class="inline-flex items-center gap-1.5">
                        <i class="pi pi-user text-surface-400"></i>
                        <strong>Manager:</strong> Not assigned
                    </span>
                    <span class="text-surface-300 dark:text-surface-600 hidden sm:inline">|</span>
                    <span class="inline-flex items-center gap-1.5">
                        <i class="pi pi-building text-surface-400"></i>
                        <strong>Org Unit:</strong> Not assigned
                    </span>
                    <span class="text-surface-300 dark:text-surface-600 hidden sm:inline">|</span>
                    <span class="inline-flex items-center gap-1.5">
                        <i class="pi pi-calendar text-surface-400"></i>
                        <strong>Target Signing:</strong> Not set
                    </span>
                </div>
            </div>

            <!-- ═══════════════════════════════════════════════════ -->
            <!-- OVERVIEW TAB                                       -->
            <!-- ═══════════════════════════════════════════════════ -->
            <ng-template uxDetailTab="overview">

                <!-- Entry Progress (empty) -->
                <div class="card flex flex-col gap-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                                <i class="pi pi-chart-pie text-lg text-primary-500"></i>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">Entry Progress</span>
                            </div>
                        </div>
                        <span class="text-2xl font-bold text-surface-400 dark:text-surface-500">0%</span>
                    </div>
                    <p-meter-group [value]="emptyCompletionSegments" styleClass="mb-0">
                        <ng-template #label>
                            <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mt-3">
                                @for (seg of emptyCompletionSegments; track seg.label) {
                                    <div class="flex items-center gap-2">
                                        <span class="inline-block w-2.5 h-2.5 rounded-full shrink-0 bg-surface-200 dark:bg-surface-600"></span>
                                        <span class="text-xs text-surface-400 dark:text-surface-500">{{ seg.label }}</span>
                                        <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 ml-auto">0%</span>
                                    </div>
                                }
                            </div>
                        </ng-template>
                    </p-meter-group>
                    <div class="empty-state">
                        <i class="pi pi-chart-bar text-3xl text-surface-300 dark:text-surface-600"></i>
                        <span class="empty-state-title">No progress tracked yet</span>
                        <span class="empty-state-desc">Progress is calculated automatically as you fill in the opportunity sections: Budget & Finance, Documentation, Stakeholders, Compliance, and Timeline.</span>
                    </div>
                </div>

                <!-- Overview Description (empty) -->
                <div class="card">
                    <div class="empty-state">
                        <i class="pi pi-align-left text-3xl text-surface-300 dark:text-surface-600"></i>
                        <span class="empty-state-title">No overview description</span>
                        <span class="empty-state-desc">Provide a summary of the opportunity — describe the programme's goals, target beneficiaries, implementation approach, and expected outcomes. This is the first section reviewers and approvers will read.</span>
                    </div>
                </div>

                <!-- Budget & Finance Cards (empty) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    <div class="card flex flex-col gap-1 min-w-0">
                        <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Proposed Budget</span>
                        <span class="text-base sm:text-lg font-bold text-surface-300 dark:text-surface-600">$0</span>
                        <span class="text-xs text-surface-400 dark:text-surface-500">Enter the total proposed budget for this opportunity</span>
                    </div>
                    <div class="card flex flex-col gap-1 min-w-0">
                        <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Total Funded</span>
                        <span class="text-base sm:text-lg font-bold text-surface-300 dark:text-surface-600">$0</span>
                        <span class="text-xs text-surface-400 dark:text-surface-500">Funding totals are derived from confirmed partner contributions</span>
                    </div>
                    <div class="card flex flex-col gap-1 min-w-0">
                        <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Unfunded</span>
                        <span class="text-base sm:text-lg font-bold text-surface-300 dark:text-surface-600">$0</span>
                        <span class="text-xs text-surface-400 dark:text-surface-500">The gap between the proposed budget and confirmed funding</span>
                    </div>
                </div>

                <!-- Analysis Stats (empty) -->
                <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                    @for (stat of emptyAnalysisStats; track stat.label) {
                        <div class="card flex flex-col gap-1 min-w-0">
                            <div class="flex items-center gap-2">
                                <i class="pi text-sm text-surface-300 dark:text-surface-600" [ngClass]="stat.icon"></i>
                                <span class="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wide">{{ stat.label }}</span>
                            </div>
                            <span class="text-lg sm:text-xl font-bold text-surface-300 dark:text-surface-600">0</span>
                            <span class="text-xs text-surface-400 dark:text-surface-500">{{ stat.hint }}</span>
                        </div>
                    }
                </div>

            </ng-template>

            <!-- ═══════════════════════════════════════════════════ -->
            <!-- SCOPE TAB                                          -->
            <!-- ═══════════════════════════════════════════════════ -->
            <ng-template uxDetailTab="scope">
                <ux-pill-tabs [items]="scopeSubTabs" [(activeValue)]="activeScopeSub" />

                <!-- WHAT — Products & Services (empty) -->
                @if (activeScopeSub() === 'what') {
                    <div class="flex flex-col gap-5 p-2">
                        <div class="flex flex-col lg:flex-row lg:gap-10 gap-5">
                            <div class="flex flex-col gap-1">
                                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Proposed Initiative Type</span>
                                <span class="text-sm text-surface-300 dark:text-surface-600 italic">Not specified</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Delivery Modality</span>
                                <span class="text-sm text-surface-300 dark:text-surface-600 italic">Not specified</span>
                            </div>
                        </div>
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-briefcase text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No deliverables defined</span>
                                <span class="empty-state-desc">Add the products and services this opportunity will deliver. Each deliverable should include a name, hierarchy classification, service line, quantity, and whether procurement is required.</span>
                            </div>
                        </div>
                    </div>
                }

                <!-- WHEN — Timeline (empty) -->
                @if (activeScopeSub() === 'when') {
                    <div class="flex flex-col gap-5 p-2">
                        <div class="flex flex-col sm:flex-row sm:flex-wrap gap-4">
                            @for (dateField of emptyDateFields; track dateField.label) {
                                <div class="card flex flex-col gap-1 sm:min-w-[140px] sm:flex-1">
                                    <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">{{ dateField.label }}</span>
                                    <span class="text-base font-bold text-surface-300 dark:text-surface-600">—</span>
                                    <span class="text-xs text-surface-400 dark:text-surface-500">{{ dateField.hint }}</span>
                                </div>
                            }
                        </div>
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-calendar text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No signing date notes</span>
                                <span class="empty-state-desc">Add any important notes or conditions related to the signing date — e.g. dependencies on partner due diligence, approvals, or external timelines.</span>
                            </div>
                        </div>
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-flag text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No key milestones</span>
                                <span class="empty-state-desc">Define the major milestones for this opportunity: creation, submission deadline, target signing, implementation start, mid-term review, and target delivery date. These form the timeline view.</span>
                            </div>
                        </div>
                    </div>
                }

                <!-- WHERE — Geography (empty) -->
                @if (activeScopeSub() === 'where') {
                    <div class="flex flex-col gap-4 p-2">
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-globe text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No implementation countries</span>
                                <span class="empty-state-desc">Select the countries where this opportunity will be implemented. Each country entry will show its continent, region, responsible org unit, classification tags (HCA, SIDS, LDC), and UNSDCF status.</span>
                            </div>
                        </div>
                    </div>
                }

                <!-- WHY — Impact (empty) -->
                @if (activeScopeSub() === 'impact') {
                    <div class="flex flex-col gap-6 p-2">
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-book text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No context & challenges</span>
                                <span class="empty-state-desc">Describe the context and challenges this opportunity addresses — the problem statement, affected populations, root causes, and why intervention is needed now.</span>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="card flex flex-col gap-1">
                                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Impact</span>
                                <span class="text-sm text-surface-300 dark:text-surface-600 italic">No impact statement defined. Describe the long-term change this opportunity aims to achieve.</span>
                            </div>
                            <div class="card flex flex-col gap-1">
                                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Outcomes</span>
                                <span class="text-sm text-surface-300 dark:text-surface-600 italic">No outcomes defined. List the measurable results expected at the end of implementation.</span>
                            </div>
                        </div>

                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-check-circle text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No cross-cutting concerns assessed</span>
                                <span class="empty-state-desc">Indicate applicability of cross-cutting concerns: Gender Equality, Human Rights, Disability Inclusion, Environmental Sustainability, Climate Change, and Conflict Sensitivity.</span>
                            </div>
                        </div>

                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-flag text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No SDG alignment</span>
                                <span class="empty-state-desc">Link relevant Sustainable Development Goals (SDGs) to this opportunity. Mark one as primary and any others as secondary, and specify the relevant SDG targets.</span>
                            </div>
                        </div>
                    </div>
                }

            </ng-template>

            <!-- ═══════════════════════════════════════════════════ -->
            <!-- STAKEHOLDERS TAB                                   -->
            <!-- ═══════════════════════════════════════════════════ -->
            <ng-template uxDetailTab="stakeholders">
                <ux-pill-tabs [items]="stakeholderSubTabs" [(activeValue)]="activeStakeholderSub" />

                <!-- PARTNERS (empty) -->
                @if (activeStakeholderSub() === 'partners') {
                    <div class="flex flex-col gap-5 p-2">
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-building text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No funding partners</span>
                                <span class="empty-state-desc">Add the organisations providing financial contributions. Each funding partner needs: name, confirmation status, contribution amount (USD), percentage share, due diligence status and expiry, and any linked agreements.</span>
                            </div>
                        </div>

                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-building text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No client partners</span>
                                <span class="empty-state-desc">Add the client organisations for this opportunity. Client partners are the government or institutional entities that will benefit from or co-implement the programme. Include due diligence status.</span>
                            </div>
                        </div>
                    </div>
                }

                <!-- TEAM (empty) -->
                @if (activeStakeholderSub() === 'team') {
                    <div class="flex flex-col gap-6 p-2">
                        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            <div class="xl:col-span-2 flex flex-col gap-6">
                                <div class="flex flex-col gap-3">
                                    <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Opportunity Manager</span>
                                    <div class="card">
                                        <div class="empty-state-inline">
                                            <p-avatar icon="pi pi-user" shape="circle" styleClass="w-10 h-10 bg-surface-100 dark:bg-surface-700 text-surface-400" />
                                            <div class="flex flex-col">
                                                <span class="text-sm font-semibold text-surface-300 dark:text-surface-600">Not assigned</span>
                                                <span class="text-xs text-surface-400 dark:text-surface-500">Assign the person responsible for managing and progressing this opportunity through the workflow.</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card">
                                    <div class="empty-state">
                                        <i class="pi pi-users text-3xl text-surface-300 dark:text-surface-600"></i>
                                        <span class="empty-state-title">No collaborators</span>
                                        <span class="empty-state-desc">Add team members who will collaborate on this opportunity. Include their name, position, role (e.g. Collaborator, Technical Advisor), and areas of expertise.</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-3">
                                <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Decision-Making Pathway</span>
                                <div class="card">
                                    <div class="empty-state">
                                        <i class="pi pi-sitemap text-3xl text-surface-300 dark:text-surface-600"></i>
                                        <span class="empty-state-title">No approval pathway</span>
                                        <span class="empty-state-desc">The decision-making pathway shows the sequence of approvals needed: manager submission, head of programme review, regional director approval, and portfolio review committee (for large opportunities).</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                <!-- BENEFICIARIES (empty) -->
                @if (activeStakeholderSub() === 'beneficiaries') {
                    <div class="flex flex-col gap-5 p-2">
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div class="card flex flex-col gap-1">
                                <span class="text-xs text-surface-400 dark:text-surface-500">Direct Beneficiaries</span>
                                <span class="text-lg font-bold text-surface-300 dark:text-surface-600">—</span>
                                <span class="text-xs text-surface-400 dark:text-surface-500">Number of people who directly receive services</span>
                            </div>
                            <div class="card flex flex-col gap-1">
                                <span class="text-xs text-surface-400 dark:text-surface-500">Indirect Beneficiaries</span>
                                <span class="text-lg font-bold text-surface-300 dark:text-surface-600">—</span>
                                <span class="text-xs text-surface-400 dark:text-surface-500">Number of people who benefit indirectly (e.g. households, communities)</span>
                            </div>
                            <div class="card flex flex-col gap-1">
                                <span class="text-xs text-surface-400 dark:text-surface-500">Total Beneficiaries</span>
                                <span class="text-lg font-bold text-surface-300 dark:text-surface-600">—</span>
                                <span class="text-xs text-surface-400 dark:text-surface-500">Sum of direct and indirect beneficiaries</span>
                            </div>
                        </div>
                        <div class="card">
                            <div class="empty-state">
                                <i class="pi pi-heart text-3xl text-surface-300 dark:text-surface-600"></i>
                                <span class="empty-state-title">No beneficiary description</span>
                                <span class="empty-state-desc">Describe the target beneficiary population — who they are, where they live, the specific challenges they face, and any priority demographics (e.g. women, children, displaced persons).</span>
                            </div>
                        </div>
                    </div>
                }

            </ng-template>

            <!-- ═══════════════════════════════════════════════════ -->
            <!-- RISK & COMPLIANCE TAB                              -->
            <!-- ═══════════════════════════════════════════════════ -->
            <ng-template uxDetailTab="risk">
                <div class="card">
                    <div class="empty-state">
                        <i class="pi pi-shield text-3xl text-surface-300 dark:text-surface-600"></i>
                        <span class="empty-state-title">No risks identified</span>
                        <span class="empty-state-desc">Add risks associated with this opportunity. For each risk, provide: title, category (Operational, Legal, External, Social), probability (Low/Medium/High), impact level, proximity, response type, description, and whether it qualifies as an organisational high risk.</span>
                    </div>
                </div>

                <div class="card">
                    <div class="empty-state">
                        <i class="pi pi-file-edit text-3xl text-surface-300 dark:text-surface-600"></i>
                        <span class="empty-state-title">No opportunity statement</span>
                        <span class="empty-state-desc">The AI-generated opportunity statement summarises the opportunity's scope, risks, stakeholders, and strategic alignment. It is generated once enough data is entered across all sections, and can be regenerated or manually edited.</span>
                    </div>
                </div>
            </ng-template>

            <!-- ═══════════════════════════════════════════════════ -->
            <!-- ACTIVITY TAB                                       -->
            <!-- ═══════════════════════════════════════════════════ -->
            <ng-template uxDetailTab="activity">

                <!-- Activity Feed (empty) -->
                <div class="card">
                    <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide px-2 pt-2">Latest Activity</span>
                    <div class="empty-state py-8">
                        <i class="pi pi-history text-3xl text-surface-300 dark:text-surface-600"></i>
                        <span class="empty-state-title">No activity yet</span>
                        <span class="empty-state-desc">The activity feed tracks all changes to the opportunity: document uploads, funding confirmations, date changes, stage transitions, budget updates, and SDG linkages. Activity is recorded automatically as the team works on the opportunity.</span>
                    </div>
                </div>

                <!-- Source Interactions (empty) -->
                <div class="card">
                    <div class="flex flex-col gap-3">
                        <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Source Interactions</span>
                        <div class="empty-state">
                            <i class="pi pi-link text-3xl text-surface-300 dark:text-surface-600"></i>
                            <span class="empty-state-title">No related interactions</span>
                            <span class="empty-state-desc">Link the meetings, field visits, workshops, and consultations that led to this opportunity. Each interaction shows its title, type, date, status, and participants.</span>
                        </div>
                    </div>
                </div>

                <!-- Collaboration / Comments (empty) -->
                <div class="card">
                    <div class="flex flex-col gap-4">
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-semibold text-surface-700 dark:text-surface-100">Comments</span>
                            <p-tag value="0" styleClass="text-xs font-semibold" />
                        </div>
                        <div class="empty-state">
                            <i class="pi pi-comments text-3xl text-surface-300 dark:text-surface-600"></i>
                            <span class="empty-state-title">No comments</span>
                            <span class="empty-state-desc">Use the collaboration section to discuss the opportunity with team members. Comments support mentions, are visible to all collaborators, and are retained as part of the decision record.</span>
                        </div>
                        <div class="flex gap-3 pt-3 border-t border-surface-200 dark:border-surface-700">
                            <p-avatar icon="pi pi-user" shape="circle" styleClass="w-8 h-8 flex-shrink-0 bg-surface-200 dark:bg-surface-700" />
                            <div class="flex-1 flex items-center gap-2">
                                <input pInputText placeholder="Write a comment..." class="w-full" disabled />
                                <p-button icon="pi pi-send" [rounded]="true" size="small" [disabled]="true" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tasks (empty) -->
                <div class="card">
                    <div class="flex flex-col gap-6">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wide">Tasks</span>
                            <p-button icon="pi pi-plus" label="New Task" [outlined]="true" size="small" styleClass="!text-primary-600 !border-primary-600" />
                        </div>
                        <div class="empty-state">
                            <i class="pi pi-check-square text-3xl text-surface-300 dark:text-surface-600"></i>
                            <span class="empty-state-title">No tasks created</span>
                            <span class="empty-state-desc">Create tasks to track work items for this opportunity: documentation preparation, partner coordination, site assessments, budget finalisation, and approval follow-ups. Tasks can be assigned to team members with start and end dates.</span>
                        </div>
                    </div>
                </div>

                <!-- Documents (empty — uses existing DocumentsCard with no data) -->
                <app-documents-card [documents]="[]" />

            </ng-template>

            <!-- ═══ SIDEBAR ═══ -->
            <ng-container ux-detail-sidebar>
                <ux-ai-insights-card
                    title="AI Project Analysis"
                    [insights]="[]"
                    searchPlaceholder="Search AI insights, risks, or optimizations..."
                />

                <div class="card flex flex-col gap-3">
                    <div class="flex items-center gap-2">
                        <i class="pi pi-sparkles text-ai-500 dark:text-ai-400"></i>
                        <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">AI Sidebar Sections</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        @for (section of emptySidebarSections; track section.label) {
                            <div class="rounded-lg border border-dashed border-surface-300 dark:border-surface-600 p-3">
                                <div class="flex items-center gap-2 mb-1">
                                    <i class="pi text-xs text-surface-400" [ngClass]="section.icon"></i>
                                    <span class="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wide">{{ section.label }}</span>
                                </div>
                                <span class="text-xs text-surface-400 dark:text-surface-500">{{ section.hint }}</span>
                            </div>
                        }
                    </div>
                </div>
            </ng-container>

        </ux-detail-layout>

        <ng-template #footerContent>
            <div class="footer-desktop">
                <span class="footer-item"><i class="pi pi-building text-xs"></i><span class="footer-item-content text-surface-400">No org unit assigned</span></span>
                <span class="footer-item"><i class="pi pi-calendar text-xs"></i><span class="footer-item-content text-surface-400"><strong>Target signing:</strong> Not set</span></span>
                <span class="footer-item-wide"><span class="text-surface-400"><strong>Created:</strong> —</span></span>
                <span class="footer-item-wide"><span class="text-surface-400"><strong>Last modified:</strong> —</span></span>
            </div>
            <div class="footer-mobile">
                <span class="footer-item"><i class="pi pi-building text-xs"></i><span class="footer-item-content text-surface-400">No org unit</span></span>
                <span class="footer-item"><i class="pi pi-calendar text-xs"></i><span class="footer-item-content text-surface-400"><strong>Target signing:</strong> —</span></span>
            </div>
        </ng-template>
    `,
    styles: `
        .empty-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            padding: 2rem 1rem;
            text-align: center;
        }

        .empty-state-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: var(--p-surface-500);
        }

        :host-context(.dark) .empty-state-title {
            color: var(--p-surface-400);
        }

        .empty-state-desc {
            font-size: 0.75rem;
            line-height: 1.5;
            color: var(--p-surface-400);
            max-width: 36rem;
        }

        :host-context(.dark) .empty-state-desc {
            color: var(--p-surface-500);
        }

        .empty-state-inline {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
    `
})
export class OpportunityEmpty {

    private footerService = inject(FooterService);
    @ViewChild('footerContent', { static: true }) footerTpl!: TemplateRef<unknown>;

    ngOnInit() {
        this.footerService.content.set(this.footerTpl);
    }

    constructor() {
        inject(DestroyRef).onDestroy(() => this.footerService.content.set(null));
    }

    detailTabs = [
        { value: 'overview', label: 'Overview', icon: 'pi pi-chart-bar' },
        { value: 'scope', label: 'Scope', icon: 'pi pi-briefcase' },
        { value: 'stakeholders', label: 'Stakeholders', icon: 'pi pi-users' },
        { value: 'risk', label: 'Risk & Compliance', icon: 'pi pi-chart-line' },
        { value: 'activity', label: 'Activity', icon: 'pi pi-history' }
    ];
    activeTab = signal('overview');

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

    emptyCompletionSegments = [
        { label: 'Budget & Finance', value: 0, color: 'var(--p-surface-200)' },
        { label: 'Documentation', value: 0, color: 'var(--p-surface-200)' },
        { label: 'Stakeholders', value: 0, color: 'var(--p-surface-200)' },
        { label: 'Compliance & Legal', value: 0, color: 'var(--p-surface-200)' },
        { label: 'Timeline', value: 0, color: 'var(--p-surface-200)' }
    ];

    emptyAnalysisStats = [
        { label: 'Countries', icon: 'pi-globe', hint: 'Add implementation countries in the Scope > Where section' },
        { label: 'Partners', icon: 'pi-users', hint: 'Add funding and client partners in the Stakeholders tab' },
        { label: 'SDGs', icon: 'pi-flag', hint: 'Link Sustainable Development Goals in the Scope > Why section' },
        { label: 'Deliverables', icon: 'pi-briefcase', hint: 'Define products and services in the Scope > What section' }
    ];

    emptyDateFields = [
        { label: 'Submission Deadline', hint: 'The date by which the opportunity must be formally submitted' },
        { label: 'Implementation Duration', hint: 'Expected total duration of the programme in months' },
        { label: 'Target Delivery', hint: 'When all deliverables are expected to be completed' },
        { label: 'Implementation Start', hint: 'The planned start date of programme implementation' },
        { label: 'Target Signing', hint: 'The date by which the agreement should be signed' }
    ];

    emptySidebarSections = [
        { label: 'Insights', icon: 'pi-lightbulb', hint: 'AI-generated observations about schedule risks, budget optimisation, and compliance gaps — requires data in the Overview and Scope tabs.' },
        { label: 'Suggestions', icon: 'pi-bolt', hint: 'Actionable recommendations to improve the opportunity — generated when enough sections are completed.' },
        { label: 'Risks', icon: 'pi-exclamation-triangle', hint: 'AI risk assessment with confidence levels and DST recommendations — requires risk data in the Risk & Compliance tab.' },
        { label: 'Similar', icon: 'pi-search', hint: 'Similar opportunities and projects based on scope, geography, and partner profile — requires data in multiple sections.' },
        { label: 'People', icon: 'pi-users', hint: 'Suggested team members and experts based on the opportunity profile and organisational expertise data.' }
    ];
}
