import { Component, computed, DestroyRef, inject, model, OnInit, signal } from '@angular/core';
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
        AiCardBgComponent
    ],
    providers: [ConfirmationService, MessageService],
    template: `
        <div class="flex flex-col gap-6 animate-fade-in-up">
            <!-- Page Title -->
            <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div class="flex flex-wrap items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <h1 class="text-deepsea-500 dark:text-surface-0 text-xl sm:text-2xl font-extrabold leading-8 m-0">Water Sanitization</h1>
                    <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-300">
                        <p-tag value="ID &amp; Profile" severity="info" styleClass="!bg-blue-50 dark:!bg-blue-900/30" />
                    </div>
                </div>
            </div>

            <div class="flex flex-col xl:flex-row gap-6 w-full">
            <!-- MAIN CONTENT: Tasks -->
            <div class="w-full flex-1 flex flex-col gap-6 min-w-0 [&>.card]:mb-0">
                <!-- Activity Feed -->
                <div class="card">
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

                <!-- Tasks Section -->
                <div class="card">
                    <div class="flex flex-col gap-6">
                        <!-- Tasks Header -->
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
                        <!-- Task Filter Tabs -->
                        <div class="flex flex-col gap-6">
                        <div class="flex flex-wrap gap-2">
                            @for (filter of taskFilterOptions; track filter.key) {
                                <p-tag
                                    [value]="filter.label + (taskCounts()[filter.countKey] > 0 ? ' ' + taskCounts()[filter.countKey] : '')"
                                    [icon]="filter.icon"
                                    severity="secondary"
                                    styleClass="cursor-pointer transition-colors px-2 py-1"
                                    [class]="activeTaskFilter() === filter.key ? 'tag-filter-active' : ''"
                                    (click)="activeTaskFilter.set(filter.key)"
                                />
                            }
                        </div>

                        <p-iconfield>
                            <p-inputicon class="pi pi-search" />
                            <input pInputText [(ngModel)]="taskSearchQuery" placeholder="Search tasks" class="w-full" />
                        </p-iconfield>

                        <!-- Task Accordion -->
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
                    </div>
                </div>

            </div>

            <!-- RIGHT SIDEBAR -->
            <div class="w-full xl:w-[380px] flex flex-col gap-6 shrink-0 [&>.card]:mb-0">
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

                        <div class="flex flex-wrap gap-2">
                            <p-tag
                                value="All Files"
                                severity="secondary"
                                styleClass="cursor-pointer transition-colors px-2 py-1"
                                [class]="activeDocFilter() === 'All Files' ? 'tag-filter-active' : ''"
                                (click)="activeDocFilter.set('All Files')"
                            />
                            @for (type of docFileTypes(); track type) {
                                <p-tag
                                    [value]="type"
                                    severity="secondary"
                                    styleClass="cursor-pointer transition-colors px-2 py-1"
                                    [class]="activeDocFilter() === type ? 'tag-filter-active' : ''"
                                    (click)="activeDocFilter.set(type)"
                                />
                            }
                            <p-tag
                                value="Other"
                                severity="secondary"
                                styleClass="cursor-pointer transition-colors px-2 py-1"
                                [class]="activeDocFilter() === 'Other' ? 'tag-filter-active' : ''"
                                (click)="activeDocFilter.set('Other')"
                            />
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
                                    <p-avatar [image]="'demo/images/avatar/' + member.image" shape="circle" styleClass="border border-surface-0 dark:border-surface-900 w-6 h-6" />
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

    activityRowsPerPage = 3;
    activityPage = signal(0);
    activityTotalPages = computed(() => Math.ceil(this.activityFeed.length / this.activityRowsPerPage));
    activityFirst = computed(() => this.activityPage() * this.activityRowsPerPage);
    activityLast = computed(() => Math.min(this.activityFirst() + this.activityRowsPerPage, this.activityFeed.length));
    paginatedActivities = computed(() => this.activityFeed.slice(this.activityFirst(), this.activityLast()));

    // ─── Activity ───
    isActivityExpanded = signal(true);
    isTasksExpanded = signal(true);

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
        const cardChrome = 160 + 72; // header, search, gaps, paginator strip
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
}
