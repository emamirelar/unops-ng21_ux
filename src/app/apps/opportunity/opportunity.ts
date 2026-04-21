import { Component, computed, model, OnInit, signal } from '@angular/core';
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
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { TaskDrawer } from '../tasklist/task-drawer';

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

@Component({
    selector: 'app-opportunity',
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
        MenuModule,
        ConfirmDialogModule,
        TaskDrawer
    ],
    providers: [ConfirmationService],
    template: `
        <div class="flex flex-col gap-6">
            <!-- Page Title -->
            <div class="flex items-center gap-4">
                <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-8 m-0">Water Sanitization</h1>
                    <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-300">
                        <span class="flex items-center gap-1.5"><i class="pi pi-briefcase text-xs"></i> Opportunity</span>
                        <span class="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600"></span>
                        <span class="flex items-center gap-1.5"><i class="pi pi-flag text-xs"></i> ID &amp; Profile</span>
                        <span class="w-1 h-1 rounded-full bg-surface-300 dark:bg-surface-600"></span>
                        <p-tag value="Active" severity="success" />
                    </div>
                </div>
            </div>

            <div class="flex flex-col xl:flex-row gap-6 w-full">
            <!-- MAIN CONTENT: Tasks -->
            <div class="w-full flex-1 flex flex-col gap-6 min-w-0">
                <!-- AI Project Analysis Card -->
                <div class="bg-gradient-to-r from-[#cce5ff] to-[#ffedf8] dark:from-[#0d2847] dark:to-[#2d1530] border border-[#e0e7ff] dark:border-[#2d3a5c] rounded-2xl shadow-sm p-4 overflow-hidden transition-all duration-300">
                    <div class="flex items-center justify-between cursor-pointer" (click)="isAiCardExpanded.set(!isAiCardExpanded())">
                        <div class="flex items-center gap-3">
                            <div class="w-[34px] h-[34px] rounded-[10px] shadow-sm bg-white/80 dark:bg-surface-800 flex items-center justify-center shrink-0">
                                <i class="pi pi-sparkles text-primary-500"></i>
                            </div>
                            @if (!isAiCardExpanded()) {
                                <div class="flex flex-col">
                                    <span class="text-deepsea-500 dark:text-surface-0 text-lg font-medium leading-7 tracking-tight">AI Project Analysis</span>
                                    <span class="text-midnight-700 dark:text-surface-300 text-[13px] font-medium leading-tight">{{ aiInsights.length }} insights available for your review</span>
                                </div>
                            } @else {
                                <span class="text-deepsea-500 dark:text-surface-0 text-lg font-medium leading-7 tracking-tight">AI Project Analysis</span>
                            }
                        </div>
                        <button class="w-[30px] h-[30px] rounded-full bg-white/85 dark:bg-surface-800 border border-white dark:border-surface-700 shadow-sm flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-surface-700 transition-colors">
                            <i class="pi text-xs text-darkblue-500" [ngClass]="isAiCardExpanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                        </button>
                    </div>

                    @if (isAiCardExpanded()) {
                        <div class="flex flex-col gap-4 mt-4">
                            <div class="bg-white/60 dark:bg-surface-800/60 border border-white dark:border-surface-700 rounded-[14px] shadow-sm flex items-center gap-4 px-4 py-2.5">
                                <i class="pi pi-search text-surface-400 text-sm"></i>
                                <input
                                    type="text"
                                    [ngModel]="aiSearchQuery()"
                                    (ngModelChange)="aiSearchQuery.set($event)"
                                    placeholder="Search AI insights, risks, or optimizations..."
                                    class="bg-transparent border-none outline-none flex-1 text-[13px] font-medium text-deepsea-500 dark:text-surface-0 placeholder:text-surface-400"
                                />
                            </div>

                            <div class="flex flex-col gap-3 max-h-[420px] overflow-y-auto">
                                @for (insight of filteredAiInsights(); track insight.id) {
                                    <div class="bg-white/70 dark:bg-surface-800/70 border border-white/50 dark:border-surface-700/50 rounded-[14px] shadow-sm p-4 flex gap-3 items-start">
                                        <i class="pi mt-0.5" [ngClass]="[insight.icon, insight.iconColor]"></i>
                                        <div class="flex flex-col gap-2 flex-1 min-w-0">
                                            <div class="flex flex-col gap-1">
                                                <span class="text-midnight-500 dark:text-surface-0 text-sm font-bold leading-[21px]">{{ insight.title }}</span>
                                                <p class="text-[#2b638b] dark:text-surface-300 text-[13px] leading-[21px]">{{ insight.description }}</p>
                                            </div>
                                            <button class="flex items-center gap-1.5 text-darkblue-500 dark:text-primary-400 text-[13px] font-semibold cursor-pointer hover:underline bg-transparent border-none p-0 w-fit">
                                                {{ insight.actionLabel }}
                                                <i class="pi pi-arrow-right text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>

                <!-- Tasks Section -->
                <div class="card">
                    <div class="flex flex-col gap-4">
                        <!-- Tasks Header -->
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 class="text-surface-900 dark:text-surface-0 text-2xl font-medium">Opportunity Tasks</h2>
                            <div class="flex items-center gap-3">
                                <p-iconfield class="flex-1 sm:flex-none">
                                    <p-inputicon class="pi pi-search" />
                                    <input pInputText [(ngModel)]="taskSearchQuery" placeholder="Search" />
                                </p-iconfield>
                                <p-button icon="pi pi-plus" label="New Task" severity="secondary" [outlined]="true" size="small" (onClick)="openNewTaskDrawer()" />
                            </div>
                        </div>

                        <!-- Task Filter Tabs -->
                        <div class="flex gap-2 overflow-x-auto">
                            @for (filter of taskFilterOptions; track filter.key) {
                                <button
                                    (click)="activeTaskFilter.set(filter.key)"
                                    class="px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                                    [ngClass]="activeTaskFilter() === filter.key ? 'bg-primary text-surface-0 dark:text-surface-900 shadow-sm' : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'"
                                >
                                    <i [class]="filter.icon + ' text-sm'"></i>
                                    <span class="text-sm font-medium">{{ filter.label }}</span>
                                    @if (taskCounts()[filter.countKey] > 0) {
                                        <div class="px-2 py-0.5 rounded-sm text-xs font-semibold" [ngClass]="activeTaskFilter() === filter.key ? 'bg-white/90 text-primary-600' : 'bg-surface-200 dark:bg-surface-600 text-surface-900 dark:text-surface-100'">
                                            {{ taskCounts()[filter.countKey] }}
                                        </div>
                                    }
                                </button>
                            }
                        </div>

                        <!-- Task Accordion -->
                        <p-accordion [value]="openTaskPanels" [multiple]="true" [pt]="{ root: { class: 'border-none!' } }">
                            @if (pendingTasks().length > 0) {
                                <p-accordionpanel value="0" [pt]="{ root: { class: 'border-none!' } }">
                                    <p-accordionheader>
                                        <div class="flex items-center gap-4 px-2">
                                            <h3 class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ pendingTasks().length }} Pending</h3>
                                        </div>
                                    </p-accordionheader>
                                    <p-accordioncontent [pt]="{ root: { class: 'overflow-hidden' } }">
                                        <div class="flex flex-col">
                                            @for (task of pendingTasks(); track task.id; let last = $last) {
                                                <ng-container *ngTemplateOutlet="taskItem; context: { task: task, isLast: last }"></ng-container>
                                            }
                                        </div>
                                    </p-accordioncontent>
                                </p-accordionpanel>
                            }

                            @if (inProgressTasks().length > 0) {
                                <p-accordionpanel value="1" [pt]="{ root: { class: 'border-none!' } }">
                                    <p-accordionheader>
                                        <div class="flex items-center gap-4 px-2">
                                            <h3 class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ inProgressTasks().length }} In Progress</h3>
                                        </div>
                                    </p-accordionheader>
                                    <p-accordioncontent [pt]="{ root: { class: 'overflow-hidden' } }">
                                        <div class="flex flex-col">
                                            @for (task of inProgressTasks(); track task.id; let last = $last) {
                                                <ng-container *ngTemplateOutlet="taskItem; context: { task: task, isLast: last }"></ng-container>
                                            }
                                        </div>
                                    </p-accordioncontent>
                                </p-accordionpanel>
                            }

                            @if (completedTasks().length > 0) {
                                <p-accordionpanel value="2" [pt]="{ root: { class: 'border-none!' } }">
                                    <p-accordionheader>
                                        <div class="flex items-center gap-4 px-2">
                                            <h3 class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ completedTasks().length }} Completed</h3>
                                        </div>
                                    </p-accordionheader>
                                    <p-accordioncontent [pt]="{ root: { class: 'overflow-hidden' } }">
                                        <div class="flex flex-col">
                                            @for (task of completedTasks(); track task.id; let last = $last) {
                                                <ng-container *ngTemplateOutlet="taskItemCompleted; context: { task: task, isLast: last }"></ng-container>
                                            }
                                        </div>
                                    </p-accordioncontent>
                                </p-accordionpanel>
                            }
                        </p-accordion>
                    </div>
                </div>

            </div>

            <!-- RIGHT SIDEBAR: Activity -->
            <div class="xl:w-[380px] flex flex-col gap-6 shrink-0">
                <!-- Activity Feed -->
                <div class="card">
                    <div class="px-2 pb-4">
                        <h3 class="text-surface-900 dark:text-surface-0 text-xl font-medium leading-7">Activity</h3>
                    </div>

                    <div class="relative max-h-[350px]">
                        <div class="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-surface-0 dark:from-surface-900 to-transparent pointer-events-none z-20"></div>
                        <div class="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-surface-0 dark:from-surface-900 to-transparent pointer-events-none z-20"></div>

                        <div class="pb-6 pt-3 px-2 max-h-[350px] overflow-y-auto">
                            <div class="relative">
                                <div class="absolute left-[10px] top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-700"></div>
                                <div class="flex flex-col gap-4">
                                    @for (activity of activityFeed; track activity.id; let last = $last) {
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
                    </div>
                </div>

                <!-- Documents Section -->
                <div class="card">
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <h2 class="text-surface-900 dark:text-surface-0 text-2xl font-medium">Documents</h2>
                        </div>

                        <div class="flex flex-wrap gap-3">
                            @for (filter of docFilterOptions; track filter) {
                                <button
                                    (click)="activeDocFilter.set(filter)"
                                    class="px-4 py-2 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap cursor-pointer"
                                    [ngClass]="{
                                        'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-950 dark:text-primary-100 shadow-sm': activeDocFilter() === filter,
                                        'border-surface-200 dark:border-surface-700 text-surface-950 dark:text-surface-0 hover:bg-surface-50 dark:hover:bg-surface-700': activeDocFilter() !== filter
                                    }"
                                >
                                    {{ filter }}
                                </button>
                            }
                        </div>

                        <p-table
                            [value]="filteredDocuments()"
                            [paginator]="true"
                            [rows]="5"
                            sortMode="multiple"
                            styleClass="bg-surface-0 dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 overflow-hidden [&>[data-pc-section=paginatorcontainer]]:border-0! [&_[data-pc-name=pcpaginator]]:rounded-none!"
                            tableStyleClass="w-full"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                            currentPageReportTemplate="Shows {first} to {last} of {totalRecords} results"
                        >
                            <ng-template #header>
                                <tr>
                                    <th pSortableColumn="fileName" class="w-40">File Name <p-sortIcon field="fileName" /></th>
                                    <th pSortableColumn="type" class="w-32">Type <p-sortIcon field="type" /></th>
                                    <th pSortableColumn="fileSize" class="w-32">Size <p-sortIcon field="fileSize" /></th>
                                    <th pSortableColumn="uploadDate" class="flex-1">Upload Date <p-sortIcon field="uploadDate" /></th>
                                    <th pSortableColumn="owner" class="flex-1">Owner <p-sortIcon field="owner" /></th>
                                    <th class="w-24">Actions</th>
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
                                        <p-tag [value]="doc.type" [severity]="getTagSeverity(doc.type)" styleClass="px-2 py-1" />
                                    </td>
                                    <td>
                                        <span class="text-surface-700 dark:text-surface-200 text-sm whitespace-nowrap">{{ doc.fileSize }}</span>
                                    </td>
                                    <td>
                                        <span class="text-surface-700 dark:text-surface-200 text-sm whitespace-nowrap">{{ doc.uploadDate }}</span>
                                    </td>
                                    <td>
                                        <span class="text-surface-700 dark:text-surface-200 text-sm whitespace-nowrap">{{ doc.owner }}</span>
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
                    </div>
                </div>
            </div>

            <p-confirmdialog header="Confirmation" />
            <app-task-drawer [(visible)]="isTaskDrawerVisible" [task]="selectedTask" [mode]="taskDrawerMode" (save)="handleTaskDrawerSave($event)" (cancel)="handleTaskDrawerCancel()" />
        </div>
        </div>

        <!-- Task Item Template -->
        <ng-template #taskItem let-task="task" let-isLast="isLast">
            <div class="flex flex-col">
                <div class="px-2 pt-3 pb-1">
                    <div class="flex items-center gap-3">
                        <p-checkbox [(ngModel)]="task.completed" [binary]="true" [inputId]="'opp-task-' + task.id" [ariaLabel]="'Mark ' + task.title + ' as ' + (task.completed ? 'incomplete' : 'complete')" (onChange)="toggleTaskCompletion(task, task.completed)" />
                        <div class="text-sm font-medium leading-normal transition-all duration-300 flex-1" [ngClass]="task.completed ? 'text-surface-700 dark:text-surface-200 line-through' : 'text-surface-900 dark:text-surface-0'">
                            {{ task.title }}
                        </div>
                    </div>
                    @if (task.description) {
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
                    @if (task.members?.length > 0) {
                        <div class="ml-auto">
                            <p-avatargroup>
                                @for (member of task.members.slice(0, 3); track member.image) {
                                    <p-avatar [image]="'/demo/images/avatar/' + member.image" shape="circle" styleClass="border border-surface-0 dark:border-surface-900 w-6 h-6" />
                                }
                                @if (task.members.length > 3) {
                                    <p-avatar [label]="'+' + (task.members.length - 3)" shape="circle" styleClass="bg-primary-500 text-surface-0 border border-surface-0 dark:border-surface-900 w-6 h-6" />
                                }
                            </p-avatargroup>
                        </div>
                    }
                    <div class="flex items-center gap-1" [class.ml-auto]="!task.members?.length">
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

        <!-- Completed Task Item Template -->
        <ng-template #taskItemCompleted let-task="task" let-isLast="isLast">
            <div class="flex flex-col">
                <div class="px-2 pt-3 pb-1">
                    <div class="flex items-center gap-3">
                        <p-checkbox [(ngModel)]="task.completed" [binary]="true" [inputId]="'opp-task-' + task.id" [ariaLabel]="'Mark ' + task.title + ' as ' + (task.completed ? 'incomplete' : 'complete')" (onChange)="toggleTaskCompletion(task, task.completed)" />
                        <div class="text-surface-700 dark:text-surface-200 text-sm font-medium leading-normal line-through flex-1">{{ task.title }}</div>
                    </div>
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
                    <div class="flex items-center gap-1 ml-auto">
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
    `
})
export class Opportunity implements OnInit {
    // ─── Activity Feed ───
    activityFeed: ActivityItem[] = [
        { id: 1, title: 'Water Quality Report uploaded', icon: 'pi-file-pdf', description: 'Initial water quality assessment for the target region submitted for review.', author: 'Olivia Martinez', time: 'Today, 3:15 PM', dotColor: 'bg-primary-500', ringColor: 'ring-primary-500' },
        { id: 2, title: 'Funding partner confirmed', icon: 'pi-check-circle', description: 'Japan confirmed as funding partner with $15,000,000 contribution.', author: 'James Anderson', time: 'Today, 11:00 AM', dotColor: 'bg-green-500', ringColor: 'ring-green-500' },
        { id: 3, title: 'Key Dates updated', icon: 'pi-calendar', description: 'Target signing date set to Apr 1, 2026. Implementation start scheduled for May 1, 2026.', author: 'Jessica Davis', time: 'Yesterday, 4:30 PM', dotColor: 'bg-orange-500', ringColor: 'ring-orange-500' },
        { id: 4, title: 'Stage moved to ID & Profile', icon: 'pi-info-circle', description: 'Current stage updated to ID & Profile (1/2). Submission deadline pending.', author: 'Robert Fox', time: 'Apr 18, 2026', dotColor: 'bg-ocean-500', ringColor: 'ring-ocean-500' },
        { id: 5, title: 'Budget set to 15,000,000', icon: 'pi-dollar', description: 'Proposed budget of $15,000,000 approved for Water Sanitization opportunity.', author: 'Sarah Wilson', time: 'Apr 17, 2026', dotColor: 'bg-teal-500', ringColor: 'ring-teal-500' },
        { id: 6, title: 'SDGs linked', icon: 'pi-globe', description: '2 Sustainable Development Goals linked to this opportunity.', author: 'Emily Johnson', time: 'Apr 15, 2026', dotColor: 'bg-cherry-500', ringColor: 'ring-cherry-500' }
    ];

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

    // ─── Tasks ───
    activeTaskFilter = signal('All');
    taskSearchQuery = model('');
    openTaskPanels = ['0', '1', '2'];
    isTaskDrawerVisible = false;
    selectedTask: Task | null = null;
    taskDrawerMode: 'create' | 'edit' = 'create';

    taskFilterOptions = [
        { key: 'All', label: 'All', icon: 'pi pi-list', countKey: 'all' as const },
        { key: 'Pending', label: 'Pending', icon: 'pi pi-inbox', countKey: 'pending' as const },
        { key: 'In Progress', label: 'In Progress', icon: 'pi pi-clock', countKey: 'inProgress' as const },
        { key: 'Completed', label: 'Completed', icon: 'pi pi-check-circle', countKey: 'completed' as const }
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
    docFilterOptions = ['All Files', 'Documents', 'Spreadsheets', 'Other'];

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
        const docs = this.documents();
        switch (this.activeDocFilter()) {
            case 'Documents': return docs.filter((d) => d.type === 'PDF' || d.type === 'DOCX');
            case 'Spreadsheets': return docs.filter((d) => d.type === 'XLS');
            case 'Other': return docs.filter((d) => d.type !== 'PDF' && d.type !== 'DOCX' && d.type !== 'XLS');
            default: return docs;
        }
    });

    docMenuItems: MenuItem[] = [];

    constructor(private confirmationService: ConfirmationService) {}

    ngOnInit() {}

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

    getTagSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
            PDF: 'info',
            DOCX: 'secondary',
            XLS: 'warn',
            EPS: 'success',
            PNG: 'success'
        };
        return map[type] || 'secondary';
    }
}
