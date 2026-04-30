import { Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { AiCardBgComponent } from '@unopsitg/ux';

interface ActivityFeed {
    id: number;
    fileName: string;
    icon: string;
    description: string;
    author: string;
    time: string;
    dotColor: string;
    ringColor: string;
}

interface StorageData {
    id: number;
    type: string;
    count: number;
    color: string;
    shadowColor: string;
    flexValue: number;
}

interface PinnedItem {
    id: number;
    name: string;
    type: string;
    size: string;
    icon: string;
}

interface Comment {
    id: number;
    author: string;
    content: string;
    time: string;
}

interface AiInsight {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: string;
    iconColor: string;
}

interface Agreement {
    id: number;
    fileName: string;
    type: string;
    fileSize: string;
    size: string;
    uploadDate: string;
    editDate: string;
    owner: string;
    icon: string;
    comments: Comment[];
}

@Component({
    selector: 'app-agreements',
    imports: [CommonModule, FormsModule, ButtonModule, DataViewModule, DrawerModule, InputTextModule, MenuModule, PaginatorModule, TagModule, TextareaModule, ConfirmDialogModule, AiCardBgComponent],
    providers: [ConfirmationService],
    template: `
        <div class="flex flex-col gap-6 animate-fade-in-up">
            <div class="flex items-center gap-4">
                <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">Partnership Agreements</h1>
                </div>
            </div>

            <div class="flex flex-col xl:flex-row gap-6 w-full">
            <div class="w-full flex-1 flex flex-col gap-8 min-w-0">
                <div class="flex flex-col gap-6">
                    <div class="flex flex-wrap gap-2">
                        @for (filter of filterOptions; track filter) {
                            <p-tag
                                [value]="filter"
                                severity="secondary"
                                [rounded]="true"
                                styleClass="cursor-pointer"
                                [class]="activeFilter() === filter ? 'tag-filter-active' : ''"
                                (click)="activeFilter.set(filter)"
                            />
                        }
                    </div>

                    <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600 overflow-hidden">
                        <p-dataview [value]="paginatedAgreements()" layout="list" [pt]="{ header: { class: 'p-0! hidden' }, content: { class: 'bg-transparent!' } }">
                            <ng-template #list let-items>
                                <div class="flex flex-col">
                                    @for (item of items; track item.id; let i = $index) {
                                        <div
                                            class="flex flex-col sm:flex-row sm:items-center px-5 py-4 gap-4 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                                            [class.border-t]="i !== 0"
                                            [class.border-surface-200]="i !== 0"
                                            [class.dark:border-surface-600]="i !== 0"
                                            (click)="editAgreement(item)"
                                        >
                                            <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 shrink-0">
                                                <i class="pi text-lg text-surface-500 dark:text-surface-300" [ngClass]="item.icon"></i>
                                            </div>

                                            <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-3 min-w-0">
                                                <div class="flex flex-col gap-1 min-w-0">
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-surface-900 dark:text-surface-0 text-base font-semibold truncate">{{ item.fileName }}</span>
                                                        <p-tag [value]="item.type" [severity]="getTagSeverity(item.type)" styleClass="px-2 py-0.5 text-xs" />
                                                    </div>
                                                    <div class="flex items-center gap-3 text-sm text-surface-500 dark:text-surface-400">
                                                        <span class="flex items-center gap-1"><i class="pi pi-file text-xs"></i> {{ item.fileSize }}</span>
                                                        <span class="flex items-center gap-1"><i class="pi pi-calendar text-xs"></i> {{ item.uploadDate }}</span>
                                                        <span class="flex items-center gap-1"><i class="pi pi-user text-xs"></i> {{ item.owner }}</span>
                                                    </div>
                                                </div>

                                                <div class="flex items-center gap-2 shrink-0">
                                                    <p-button icon="pi pi-download" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" (onClick)="$event.stopPropagation()" />
                                                    <p-button icon="pi pi-ellipsis-h" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" (onClick)="onTableMenuToggle($event, item, dataviewMenu); $event.stopPropagation()" />
                                                    <p-menu #dataviewMenu [model]="tableMenuItems" [popup]="true" styleClass="w-48!" appendTo="body" />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </ng-template>
                        </p-dataview>

                        <p-paginator
                            [rows]="rows"
                            [totalRecords]="filteredAgreements().length"
                            [first]="agreementsFirst()"
                            (onPageChange)="agreementsPage.set($event.page ?? 0)"
                            styleClass="border-t border-surface-200 dark:border-surface-600"
                        />
                    </div>
                </div>

                <div class="bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600 flex flex-col">
                    <div class="px-6 pt-4 pb-4">
                        <h4 class="title-h4 text-left!">Activity Feed</h4>
                    </div>

                    <div class="flex-1 pb-2 pt-1 px-4">
                        <div class="relative">
                            <div class="absolute left-[10px] top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-500"></div>

                            <div class="flex flex-col gap-4">
                                @for (activity of paginatedFeed(); track activity.id; let last = $last) {
                                    <div class="flex gap-3">
                                        <div class="flex items-start pt-2.5 w-6 justify-center">
                                            <div class="w-2 h-2 rounded-full ring-2 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-900 relative z-10" [ngClass]="[activity.dotColor, activity.ringColor]"></div>
                                        </div>

                                        <div class="flex-1 pb-4" [class.border-b]="!last" [class.border-surface-200]="!last" [class.dark:border-surface-600]="!last">
                                            <div class="flex flex-col gap-2">
                                                <div class="flex flex-col gap-1">
                                                    <div class="flex items-center justify-between">
                                                        <div class="flex items-center gap-1">
                                                            <i class="pi text-sm text-surface-500 dark:text-surface-300" [ngClass]="activity.icon"></i>
                                                            <span class="text-surface-950 dark:text-surface-0 text-base font-medium leading-normal">{{ activity.fileName }}</span>
                                                        </div>
                                                        <div>
                                                            <p-button [rounded]="true" [text]="true" icon="pi pi-ellipsis-h" size="small" severity="secondary" styleClass="cursor-pointer" (onClick)="activityMenu.toggle($event)" />
                                                            <p-menu #activityMenu [model]="feedMenuItems" [popup]="true" styleClass="w-48!" appendTo="body" />
                                                        </div>
                                                    </div>
                                                    <p class="text-surface-600 dark:text-surface-300 text-sm leading-tight">{{ activity.description }}</p>
                                                </div>
                                                <div class="flex items-center gap-2">
                                                    <span class="text-surface-500 dark:text-surface-400 text-sm leading-tight">{{ activity.time }}</span>
                                                    <div class="w-0 h-[6px] border-l border-surface-200 dark:border-surface-500"></div>
                                                    <span class="text-surface-500 dark:text-surface-400 text-sm leading-tight">{{ activity.author }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>

                    <p-paginator
                        [rows]="feedPerPage"
                        [totalRecords]="activityFeed.length"
                        [first]="feedFirst()"
                        (onPageChange)="feedPage.set($event.page ?? 0)"
                        styleClass="border-t border-surface-200 dark:border-surface-600"
                    />
                </div>
            </div>

            <div class="w-full xl:w-[380px] flex flex-col gap-6 shrink-0 [&>.card]:mb-0">
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
                                <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">AI Agreement Analysis</h4>
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
                                    placeholder="Search AI insights, risks, or compliance..."
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

                <div class="p-5 bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600">
                    <h4 class="title-h4 text-left! mb-4">Pinned</h4>

                    <div class="grid grid-cols-2 gap-3">
                        @for (pinned of pinnedItems; track pinned.id) {
                            <div class="p-3 rounded-xl border border-surface-200 dark:border-surface-600 dark:bg-surface-800 flex flex-col gap-4">
                                <div class="flex justify-between items-start">
                                    <i class="pi text-2xl! text-surface-500 dark:text-surface-300" [ngClass]="pinned.icon"></i>
                                    <div>
                                        <p-button [rounded]="true" [text]="true" icon="pi pi-ellipsis-v" size="small" severity="secondary" styleClass="cursor-pointer" (onClick)="pinnedMenu.toggle($event)" />
                                        <p-menu #pinnedMenu [model]="pinnedMenuItems" [popup]="true" styleClass="w-48!" appendTo="body" />
                                    </div>
                                </div>
                                <div class="flex flex-col gap-1">
                                    <span class="text-surface-900 dark:text-surface-0 text-base font-medium">{{ pinned.name }}</span>
                                    <div class="flex items-center gap-1">
                                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ pinned.type }}</span>
                                        <div class="w-1 h-1 bg-surface-300 dark:bg-surface-500 rounded-full"></div>
                                        <span class="text-surface-500 dark:text-surface-400 text-sm">{{ pinned.size }}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>

                <div class="p-4 bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600 flex flex-col gap-4 overflow-hidden">
                    <div class="flex justify-between items-center">
                        <h4 class="title-h4 text-left!">Agreement Types</h4>
                        <div class="flex items-center gap-1">
                            <span class="text-surface-950 dark:text-surface-0 text-lg font-semibold leading-tight">{{ totalAgreements().toLocaleString() }}</span>
                            <span class="text-surface-500 dark:text-surface-400 text-sm leading-none">Total</span>
                        </div>
                    </div>

                    <div class="flex items-end gap-1 w-full">
                        @for (storage of storageData; track storage.id) {
                            <div class="flex-1 flex flex-col gap-1.5">
                                <div class="h-3 rounded-md" [style.background-color]="storage.color" [style.box-shadow]="'0px 3px 6px 0px ' + storage.shadowColor"></div>
                                <div class="flex flex-col gap-0.5">
                                    <span class="text-surface-900 dark:text-surface-0 text-sm font-medium leading-tight">{{ storage.count }}</span>
                                    <div class="flex items-center gap-1">
                                        <div class="w-1.5 h-1.5 rounded-sm" [style.background-color]="storage.color"></div>
                                        <span class="text-surface-600 dark:text-surface-300 text-xs leading-tight">{{ storage.type }}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            </div>
        </div>

            <p-drawer [(visible)]="showEditDrawer" position="right" styleClass="w-full! max-w-[417px]!" appendTo="body">
                <ng-template #header>
                    <h4 class="title-h4 text-left!">{{ isAddMode ? 'Add' : 'Edit' }}</h4>
                </ng-template>

                <div class="flex flex-col h-full">
                    <div class="flex-1 flex flex-col gap-6 overflow-y-auto">
                        <div class="relative min-h-[180px] h-[180px] rounded-2xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-600">
                            <div class="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-emphasis transition-colors rounded-2xl" (click)="triggerFileUpload()">
                                <div class="flex items-center justify-center">
                                    <div class="w-12 h-12 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center">
                                        <i class="pi text-surface-600 dark:text-surface-300 text-2xl" [ngClass]="editForm.type ? getIconByType(editForm.type) : 'pi-upload'"></i>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <div class="text-surface-900 dark:text-surface-0 text-base font-medium mb-1">
                                        {{ editForm.fileName || 'Click to upload file' }}
                                    </div>
                                    <div class="text-surface-500 dark:text-surface-400 text-sm">
                                        {{ editForm.type ? editForm.type + ' - ' + (editForm.fileSize || '') : 'Select a file to upload' }}
                                    </div>
                                </div>
                            </div>
                            @if (editForm.fileName && editForm.type) {
                                <p-button icon="pi pi-times" [text]="true" [rounded]="true" size="small" styleClass="absolute! z-40! top-4 right-4 cursor-pointer" severity="secondary" (onClick)="removeUploadedFile(); $event.stopPropagation()" />
                            }
                            <input #fileInput type="file" (change)="handleFileUpload($event)" class="hidden" />
                        </div>

                        <div class="flex flex-col gap-6">
                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-base font-medium">Name</label>
                                <input pInputText [(ngModel)]="editForm.fileName" class="w-full" />
                            </div>

                            <div class="flex flex-col gap-2">
                                <label class="text-surface-950 dark:text-surface-0 text-base font-medium">Owner</label>
                                <input pInputText [(ngModel)]="editForm.owner" class="w-full" />
                            </div>

                            @if (!isAddMode || editForm.fileName) {
                                <div class="bg-surface-50 dark:bg-surface-800 rounded-xl p-4 border border-surface-200 dark:border-surface-600">
                                    <div class="grid grid-cols-2 gap-4">
                                        <div class="flex flex-col gap-1 min-h-[44px]">
                                            <label class="text-surface-500 dark:text-surface-400 text-xs font-medium uppercase tracking-wide">Type</label>
                                            @if (editForm.type) {
                                                <p-tag [value]="editForm.type" [severity]="getTagSeverity(editForm.type)" styleClass="px-2 py-1 text-xs w-fit" />
                                            } @else {
                                                <span class="text-surface-700 dark:text-surface-300 text-sm font-medium">&nbsp;</span>
                                            }
                                        </div>

                                        <div class="flex flex-col gap-1 min-h-[44px]">
                                            <label class="text-surface-500 dark:text-surface-400 text-xs font-medium uppercase tracking-wide">File Size</label>
                                            <span class="text-surface-700 dark:text-surface-300 text-sm font-medium">{{ editForm.fileSize || '&nbsp;' }}</span>
                                        </div>

                                        <div class="flex flex-col gap-1 min-h-[44px]">
                                            <label class="text-surface-500 dark:text-surface-400 text-xs font-medium uppercase tracking-wide">Dimensions</label>
                                            <span class="text-surface-700 dark:text-surface-300 text-sm font-medium">{{ editForm.size || '&nbsp;' }}</span>
                                        </div>

                                        <div class="flex flex-col gap-1 min-h-[44px]">
                                            <label class="text-surface-500 dark:text-surface-400 text-xs font-medium uppercase tracking-wide">Uploaded</label>
                                            <span class="text-surface-700 dark:text-surface-300 text-sm font-medium">{{ editForm.uploadDate || '&nbsp;' }}</span>
                                        </div>
                                    </div>

                                    <div class="flex flex-col gap-1 mt-3 pt-3 border-t border-surface-200 dark:border-surface-600 min-h-[44px]">
                                        <label class="text-surface-500 dark:text-surface-400 text-xs font-medium uppercase tracking-wide">Last Modified</label>
                                        <span class="text-surface-700 dark:text-surface-300 text-sm font-medium">{{ editForm.editDate || '&nbsp;' }}</span>
                                    </div>
                                </div>
                            }
                        </div>

                        @if (!isAddMode && editingItem && editingItem.comments) {
                            <div class="border-t border-surface-200 dark:border-surface-700 pt-6">
                                <h4 class="text-surface-950 dark:text-surface-0 text-base font-medium mb-4">Comments</h4>
                                <div class="flex flex-col gap-4">
                                    @for (comment of editingItem!.comments; track comment.id) {
                                        <div class="pb-4 border-b border-surface-200 dark:border-surface-700 last:border-b-0">
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="text-surface-950 dark:text-surface-0 text-base font-medium">{{ comment.author }}</span>
                                                <p-button icon="pi pi-ellipsis-h" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" (onClick)="commentMenu.toggle($event)" />
                                                <p-menu #commentMenu [model]="createCommentMenuItems(comment.id)" [popup]="true" styleClass="w-48!" />
                                            </div>
                                            <p class="text-surface-600 dark:text-surface-300 text-sm mb-2">{{ comment.content }}</p>
                                            <span class="text-surface-500 dark:text-surface-400 text-sm">{{ comment.time }}</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                        @if (!isAddMode) {
                            <div class="border-t border-surface-200 dark:border-surface-700 pt-6">
                                <h4 class="text-surface-950 dark:text-surface-0 text-base font-medium mb-3">Add Comment</h4>
                                <div class="flex flex-col gap-3">
                                    <textarea pTextarea [(ngModel)]="newComment" [rows]="4" class="w-full" placeholder="Write your comment here..."></textarea>
                                    <p-button label="Post Comment" severity="secondary" [outlined]="true" styleClass="w-full cursor-pointer" (onClick)="addComment()" [disabled]="!newComment.trim()" />
                                </div>
                            </div>
                        }
                    </div>

                    <div class="flex flex-col gap-3 py-6 pt-4 border-t border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900">
                        <p-button [label]="isAddMode ? 'Add Agreement' : 'Update Agreement'" severity="primary" styleClass="w-full cursor-pointer" (onClick)="updateAgreement()" />
                        @if (!isAddMode) {
                            <p-button label="Move to trash" icon="pi pi-trash" severity="danger" [outlined]="true" styleClass="w-full cursor-pointer" (onClick)="confirmMoveToTrash()" />
                        }
                    </div>
                </div>
            </p-drawer>

            <p-confirmdialog />
    `,
    styles: ``
})
export class Agreements implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    private destroyRef = inject(DestroyRef);

    feedPage = signal(0);
    feedPerPage = 3;
    feedFirst = computed(() => this.feedPage() * this.feedPerPage);
    paginatedFeed = computed(() => {
        const start = this.feedFirst();
        return this.activityFeed.slice(start, start + this.feedPerPage);
    });

    activeFilter = signal<string>('All Agreements');

    agreementsPage = signal(0);
    agreementsFirst = computed(() => this.agreementsPage() * this.rows);
    paginatedAgreements = computed(() => {
        const all = this.filteredAgreements();
        const start = this.agreementsFirst();
        return all.slice(start, start + this.rows);
    });

    // ─── AI Analysis ───
    isAiCardExpanded = signal(false);
    aiSearchQuery = signal('');
    aiInsights: AiInsight[] = [
        { id: 1, title: 'Expiring Agreements', description: '5 partnership agreements are set to expire within the next 30 days. Renewal discussions should begin immediately to avoid service gaps.', actionLabel: 'View expiring list', icon: 'pi-exclamation-triangle', iconColor: 'text-orange-500' },
        { id: 2, title: 'Compliance Risk Detected', description: '2 vendor contracts are missing updated data processing addendums required by the latest regulatory changes effective Q2 2026.', actionLabel: 'Review non-compliant', icon: 'pi-shield', iconColor: 'text-red-500' },
        { id: 3, title: 'Duplicate Clause Patterns', description: 'Similar indemnification clauses appear in 8 agreements with slight variations. Standardizing could reduce legal review time by 40%.', actionLabel: 'View clause comparison', icon: 'pi-copy', iconColor: 'text-blue-500' },
        { id: 4, title: 'Auto-Renewal Alert', description: '3 agreements with auto-renewal clauses are approaching their opt-out windows. Decision needed within 14 days.', actionLabel: 'Manage renewals', icon: 'pi-calendar', iconColor: 'text-teal-500' },
        { id: 5, title: 'Cost Optimization', description: 'Consolidating 4 overlapping service agreements with the same vendor could save approximately $45,000 annually.', actionLabel: 'View consolidation plan', icon: 'pi-wallet', iconColor: 'text-green-600' },
        { id: 6, title: 'Signature Bottleneck', description: '6 agreements are pending signature for more than 15 days. The average approval cycle is 7 days.', actionLabel: 'Escalate pending', icon: 'pi-clock', iconColor: 'text-orange-500' },
        { id: 7, title: 'Missing Attachments', description: '4 recently uploaded agreements are missing required annexes or supporting schedules referenced in the main body.', actionLabel: 'Send reminders', icon: 'pi-file', iconColor: 'text-blue-500' },
        { id: 8, title: 'Favorable Terms Detected', description: 'The NDA template used in 12 agreements includes broader IP protections than the industry standard, which is a competitive advantage.', actionLabel: 'View analysis', icon: 'pi-check-circle', iconColor: 'text-green-500' },
        { id: 9, title: 'Version Control Issue', description: '2 agreements have multiple versions uploaded with conflicting terms. Only the latest signed version should be retained.', actionLabel: 'Resolve conflicts', icon: 'pi-exclamation-circle', iconColor: 'text-cherry-500' },
        { id: 10, title: 'Jurisdiction Mismatch', description: '1 partnership agreement references a governing law jurisdiction that differs from the operational region.', actionLabel: 'Review jurisdiction', icon: 'pi-globe', iconColor: 'text-ocean-500' }
    ];

    filteredAiInsights = computed(() => {
        const query = this.aiSearchQuery().trim().toLowerCase();
        if (!query) return this.aiInsights;
        return this.aiInsights.filter(insight =>
            insight.title.toLowerCase().includes(query) ||
            insight.description.toLowerCase().includes(query)
        );
    });

    aiInsightsPerPage = signal(this.calcInsightsPerPage());
    aiInsightsPage = signal(0);
    aiInsightsFirst = computed(() => this.aiInsightsPage() * this.aiInsightsPerPage());
    paginatedAiInsights = computed(() => {
        const insights = this.filteredAiInsights();
        return insights.slice(this.aiInsightsFirst(), this.aiInsightsFirst() + this.aiInsightsPerPage());
    });

    filterOptions = ['All Agreements', 'Recently Uploaded', 'Large Files', 'Uploaded by Me'];

    showEditDrawer = false;
    editingItem: Agreement | null = null;
    isAddMode = false;
    editForm: Partial<Agreement> = {
        fileName: '',
        owner: '',
        type: '',
        fileSize: '',
        size: '',
        uploadDate: '',
        editDate: ''
    };
    newComment = '';
    rows = 5;

    activityFeed: ActivityFeed[] = [
        {
            id: 1,
            fileName: 'Service Agreement 2025.pdf',
            icon: 'pi-file-pdf',
            description: 'Updated terms and conditions for the annual service agreement renewal.',
            author: 'Olivia Martinez',
            time: 'Today, 08:00 PM',
            dotColor: 'bg-primary-500',
            ringColor: 'ring-primary-500'
        },
        {
            id: 2,
            fileName: 'NDA - Acme Corp.pdf',
            icon: 'pi-file-pdf',
            description: 'Non-disclosure agreement signed by both parties for the new project scope.',
            author: 'Jessica Davis',
            time: 'Yesterday, 11:42 PM',
            dotColor: 'bg-green-500',
            ringColor: 'ring-green-500'
        },
        {
            id: 3,
            fileName: 'Vendor Contract.docx',
            icon: 'pi-file-word',
            description: 'New vendor contract with revised payment terms and delivery schedule.',
            author: 'Robert Fox',
            time: 'Dec 11, 2025',
            dotColor: 'bg-cyan-500',
            ringColor: 'ring-cyan-500'
        },
        {
            id: 4,
            fileName: 'License Agreement.pdf',
            icon: 'pi-file-pdf',
            description: 'Software license agreement updated with the latest compliance requirements.',
            author: 'Emily Johnson',
            time: 'Dec 10, 2025',
            dotColor: 'bg-yellow-500',
            ringColor: 'ring-yellow-500'
        },
        {
            id: 5,
            fileName: 'Partnership MOU.pdf',
            icon: 'pi-file-pdf',
            description: 'Memorandum of understanding for the strategic partnership initiative.',
            author: 'Sarah Wilson',
            time: 'Dec 9, 2025',
            dotColor: 'bg-purple-500',
            ringColor: 'ring-purple-500'
        },
        {
            id: 6,
            fileName: 'Lease Agreement.docx',
            icon: 'pi-file-word',
            description: 'Office lease agreement renewal with updated terms for the next fiscal year.',
            author: 'Benjamin Taylor',
            time: 'Dec 8, 2025',
            dotColor: 'bg-red-500',
            ringColor: 'ring-red-500'
        }
    ];

    storageData: StorageData[] = [
        { id: 1, type: 'Service', count: 42, color: '#0092d1', shadowColor: 'rgba(0,146,209,0.16)', flexValue: 42 },
        { id: 2, type: 'NDA', count: 38, color: '#e85c0e', shadowColor: 'rgba(232,92,14,0.16)', flexValue: 38 },
        { id: 3, type: 'License', count: 27, color: '#00a997', shadowColor: 'rgba(0,169,151,0.16)', flexValue: 27 },
        { id: 4, type: 'Vendor', count: 21, color: '#991e66', shadowColor: 'rgba(153,30,102,0.16)', flexValue: 21 },
        { id: 5, type: 'Partnership', count: 15, color: '#4c9f38', shadowColor: 'rgba(76,159,56,0.16)', flexValue: 15 },
        { id: 6, type: 'Lease', count: 12, color: '#ffc215', shadowColor: 'rgba(255,194,21,0.16)', flexValue: 12 },
        { id: 7, type: 'Other', count: 9, color: '#da291c', shadowColor: 'rgba(218,41,28,0.16)', flexValue: 9 }
    ];

    totalAgreements = computed(() => this.storageData.reduce((sum, item) => sum + item.count, 0));

    pinnedItems: PinnedItem[] = [
        { id: 1, name: 'Master Service Agreement', type: 'PDF', size: '2.4 MB', icon: 'pi-file-pdf' },
        { id: 2, name: 'NDA Template', type: 'DOCX', size: '1.1 MB', icon: 'pi-file-word' },
        { id: 3, name: 'Vendor Contract', type: 'PDF', size: '3.2 MB', icon: 'pi-file-pdf' },
        { id: 4, name: 'License Terms', type: 'PDF', size: '1.8 MB', icon: 'pi-file-pdf' },
        { id: 5, name: 'Partnership MOU', type: 'DOCX', size: '2.0 MB', icon: 'pi-file-word' },
        { id: 6, name: 'Lease Agreement', type: 'PDF', size: '4.5 MB', icon: 'pi-file-pdf' }
    ];

    agreements = signal<Agreement[]>([
        {
            id: 1,
            fileName: 'Master Service Agreement',
            type: 'PDF',
            fileSize: '2.4 MB',
            size: '-',
            uploadDate: 'Jan 11, 2025',
            editDate: 'Jan 22, 2025',
            owner: 'Robert Fox',
            icon: 'pi-file-pdf',
            comments: [
                { id: 1, author: 'Olivia Martinez', content: 'Legal review completed. Ready for final signature.', time: 'Today, 08:00 PM' },
                { id: 2, author: 'Jessica Davis', content: 'All clauses have been verified against the latest regulatory updates.', time: 'Yesterday, 10:30 AM' }
            ]
        },
        {
            id: 2,
            fileName: 'NDA - Acme Corp',
            type: 'PDF',
            fileSize: '1.1 MB',
            size: '-',
            uploadDate: 'Jan 7, 2025',
            editDate: 'Jan 14, 2025',
            owner: 'Emily Johnson',
            icon: 'pi-file-pdf',
            comments: [{ id: 1, author: 'Robert Fox', content: 'Please review the confidentiality scope section before signing.', time: 'Today, 02:15 PM' }]
        },
        { id: 3, fileName: 'Vendor Contract - TechSupply', type: 'DOCX', fileSize: '3.2 MB', size: '-', uploadDate: 'Jan 2, 2025', editDate: 'Jan 14, 2025', owner: 'David Smith', icon: 'pi-file-word', comments: [] },
        {
            id: 4,
            fileName: 'Software License Agreement',
            type: 'PDF',
            fileSize: '1.8 MB',
            size: '-',
            uploadDate: 'Jan 1, 2025',
            editDate: 'Jan 12, 2025',
            owner: 'Jessica Davis',
            icon: 'pi-file-pdf',
            comments: [{ id: 1, author: 'Benjamin Taylor', content: 'License terms updated to reflect the new pricing model.', time: 'Jan 12, 2025' }]
        },
        { id: 5, fileName: 'Partnership MOU', type: 'PDF', fileSize: '2.0 MB', size: '-', uploadDate: 'Jan 2, 2025', editDate: 'Jan 11, 2025', owner: 'Robert Fox', icon: 'pi-file-pdf', comments: [] },
        { id: 6, fileName: 'Office Lease Agreement', type: 'PDF', fileSize: '4.5 MB', size: '-', uploadDate: 'Jan 2, 2025', editDate: 'Jan 16, 2025', owner: 'James Anderson', icon: 'pi-file-pdf', comments: [] },
        { id: 7, fileName: 'Employment Contract Template', type: 'DOCX', fileSize: '0.8 MB', size: '-', uploadDate: 'Feb 27, 2025', editDate: 'Feb 28, 2025', owner: 'Benjamin Taylor', icon: 'pi-file-word', comments: [] },
        { id: 8, fileName: 'Consulting Agreement', type: 'PDF', fileSize: '1.5 MB', size: '-', uploadDate: 'Dec 28, 2024', editDate: 'Jan 5, 2025', owner: 'Robert Fox', icon: 'pi-file-pdf', comments: [] },
        { id: 9, fileName: 'Data Processing Agreement', type: 'PDF', fileSize: '2.7 MB', size: '-', uploadDate: 'Jan 15, 2025', editDate: 'Jan 20, 2025', owner: 'Sarah Wilson', icon: 'pi-file-pdf', comments: [] },
        { id: 10, fileName: 'SLA - Cloud Services', type: 'PDF', fileSize: '1.2 MB', size: '-', uploadDate: 'Jan 18, 2025', editDate: 'Jan 25, 2025', owner: 'Robert Fox', icon: 'pi-file-pdf', comments: [] },
        { id: 11, fileName: 'Subcontractor Agreement', type: 'DOCX', fileSize: '1.9 MB', size: '-', uploadDate: 'Jan 22, 2025', editDate: 'Jan 24, 2025', owner: 'Alex Brown', icon: 'pi-file-word', comments: [] },
        { id: 12, fileName: 'IP Assignment Agreement', type: 'PDF', fileSize: '0.6 MB', size: '-', uploadDate: 'Jan 5, 2025', editDate: 'Jan 26, 2025', owner: 'Robert Fox', icon: 'pi-file-pdf', comments: [] },
        { id: 13, fileName: 'Non-Compete Agreement', type: 'PDF', fileSize: '0.9 MB', size: '-', uploadDate: 'Jan 28, 2025', editDate: 'Jan 29, 2025', owner: 'Lisa Chen', icon: 'pi-file-pdf', comments: [] }
    ]);

    filteredAgreements = computed(() => {
        const docs = this.agreements();
        switch (this.activeFilter()) {
            case 'Recently Uploaded':
                return [...docs].sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
            case 'Large Files':
                return docs.filter((doc) => parseFloat(doc.fileSize) > 2);
            case 'Uploaded by Me':
                return docs.filter((doc) => doc.owner === 'Robert Fox');
            default:
                return docs;
        }
    });

    feedMenuItems: MenuItem[] = [
        { label: 'Open', icon: 'pi pi-external-link' },
        { label: 'Share', icon: 'pi pi-share-alt' },
        { label: 'Download', icon: 'pi pi-download' },
        { label: 'Delete', icon: 'pi pi-trash' }
    ];

    pinnedMenuItems: MenuItem[] = [
        { label: 'Open', icon: 'pi pi-external-link' },
        { label: 'Unpin', icon: 'pi pi-times' },
        { label: 'Share', icon: 'pi pi-share-alt' },
        { label: 'Delete', icon: 'pi pi-trash' }
    ];

    tableMenuItems: MenuItem[] = [];

    constructor(private confirmationService: ConfirmationService) {}

    ngOnInit() {
        const onResize = () => this.aiInsightsPerPage.set(this.calcInsightsPerPage());
        window.addEventListener('resize', onResize);
        this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    }

    private calcInsightsPerPage(): number {
        const shellOffset = 12 * 16;
        const cardChrome = 160 + 72;
        const insightCardHeight = 150;
        const available = (typeof window !== 'undefined' ? window.innerHeight : 900) - shellOffset - cardChrome;
        return Math.max(1, Math.floor(available / insightCardHeight));
    }

    onTableMenuToggle(event: Event, agreement: Agreement, menu: Menu) {
        this.tableMenuItems = [
            { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editAgreement(agreement) },
            { label: 'Pin', icon: 'pi pi-bookmark' },
            { label: 'Share', icon: 'pi pi-share-alt' },
            { label: 'Delete', icon: 'pi pi-trash', command: () => this.confirmDeleteAgreement(agreement) }
        ];
        menu.toggle(event);
    }

    createCommentMenuItems(commentId: number): MenuItem[] {
        return [
            { label: 'Edit Comment', icon: 'pi pi-pencil' },
            { label: 'Copy Text', icon: 'pi pi-copy' },
            { label: 'Report', icon: 'pi pi-flag' },
            { separator: true },
            { label: 'Remove', icon: 'pi pi-trash', command: () => this.removeComment(commentId) }
        ];
    }

    getTagSeverity(_type: string): 'secondary' {
        return 'secondary';
    }

    editAgreement(agreement: Agreement) {
        this.editingItem = agreement;
        this.isAddMode = false;
        this.editForm = { ...agreement };
        this.showEditDrawer = true;
    }

    addAgreement() {
        this.editingItem = null;
        this.isAddMode = true;
        this.editForm = {
            fileName: '',
            owner: '',
            type: '',
            fileSize: '',
            size: '',
            uploadDate: '',
            editDate: ''
        };
        this.showEditDrawer = true;
    }

    updateAgreement() {
        if (this.isAddMode) {
            const docs = this.agreements();
            const newId = Math.max(...docs.map((d) => d.id)) + 1;
            const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            const newDoc: Agreement = {
                id: newId,
                fileName: this.editForm.fileName || '',
                type: this.editForm.type || '',
                fileSize: this.editForm.fileSize || '',
                size: this.editForm.size || '-',
                uploadDate: this.editForm.uploadDate || currentDate,
                editDate: this.editForm.editDate || currentDate,
                owner: this.editForm.owner || 'Robert Fox',
                icon: this.getIconByType(this.editForm.type || ''),
                comments: []
            };
            this.agreements.set([newDoc, ...docs]);
        } else if (this.editingItem) {
            const docs = this.agreements();
            const index = docs.findIndex((d) => d.id === this.editingItem!.id);
            if (index !== -1) {
                docs[index] = { ...docs[index], ...this.editForm } as Agreement;
                this.agreements.set([...docs]);
            }
        }
        this.showEditDrawer = false;
    }

    addComment() {
        if (this.newComment.trim() && this.editingItem) {
            const comment: Comment = {
                id: Date.now(),
                author: 'Robert Fox',
                content: this.newComment.trim(),
                time: 'Just now'
            };
            this.editingItem.comments.push(comment);
            this.newComment = '';
        }
    }

    removeComment(commentId: number) {
        if (this.editingItem?.comments) {
            const commentIndex = this.editingItem.comments.findIndex((c) => c.id === commentId);
            if (commentIndex !== -1) {
                this.editingItem.comments.splice(commentIndex, 1);
            }
        }
    }

    getIconByType(type: string): string {
        const iconMap: Record<string, string> = {
            PDF: 'pi-file-pdf',
            DOCX: 'pi-file-word',
            PNG: 'pi-image',
            JPG: 'pi-image',
            SVG: 'pi-image',
            XLS: 'pi-file-excel',
            EPS: 'pi-image',
            ZIP: 'pi-file-o',
            CSS: 'pi-code',
            PPTX: 'pi-file',
            SQL: 'pi-database'
        };
        return iconMap[type] || 'pi-file';
    }

    triggerFileUpload() {
        this.fileInput?.nativeElement?.click();
    }

    handleFileUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            const currentDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            this.editForm.fileName = file.name.split('.')[0];
            this.editForm.type = file.name.split('.').pop()?.toUpperCase() || '';
            this.editForm.fileSize = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

            if (this.isAddMode) {
                if (!this.editForm.uploadDate) {
                    this.editForm.uploadDate = currentDate;
                }
                if (!this.editForm.editDate) {
                    this.editForm.editDate = currentDate;
                }
                if (!this.editForm.owner) {
                    this.editForm.owner = 'Robert Fox';
                }
                if (!this.editForm.size) {
                    this.editForm.size = '-';
                }
            }
        }
    }

    removeUploadedFile() {
        this.editForm.fileName = '';
        this.editForm.type = '';
        this.editForm.fileSize = '';
        this.editForm.size = '';

        if (this.isAddMode) {
            this.editForm.uploadDate = '';
            this.editForm.editDate = '';
            this.editForm.owner = '';
        }

        if (this.fileInput?.nativeElement) {
            this.fileInput.nativeElement.value = '';
        }
    }

    confirmDeleteAgreement(agreement: Agreement) {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${agreement.fileName}"? This action cannot be undone.`,
            header: 'Delete Agreement',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: () => {
                this.deleteAgreement(agreement.id);
            }
        });
    }

    deleteAgreement(agreementId: number) {
        const docs = this.agreements();
        const index = docs.findIndex((d) => d.id === agreementId);
        if (index !== -1) {
            docs.splice(index, 1);
            this.agreements.set([...docs]);
            if (this.editingItem?.id === agreementId) {
                this.showEditDrawer = false;
            }
        }
    }

    confirmMoveToTrash() {
        if (!this.editingItem) return;

        this.confirmationService.confirm({
            message: `Are you sure you want to move "${this.editingItem.fileName}" to trash? This action cannot be undone.`,
            header: 'Move to Trash',
            icon: 'pi pi-info-circle',
            rejectButtonProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptButtonProps: {
                label: 'Move to Trash',
                severity: 'danger'
            },
            accept: () => {
                this.deleteAgreement(this.editingItem!.id);
            }
        });
    }
}
