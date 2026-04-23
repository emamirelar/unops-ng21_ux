import { Component, computed, ElementRef, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { Menu, MenuModule } from 'primeng/menu';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';

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
    imports: [CommonModule, FormsModule, ButtonModule, TableModule, DrawerModule, InputTextModule, MenuModule, TagModule, TextareaModule, ConfirmDialogModule],
    providers: [ConfirmationService],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex items-center gap-4">
                <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">Partnership Agreements</h1>
                </div>
            </div>

            <div class="flex flex-col gap-8">
                <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6">
                    <div class="lg:col-span-6 xl:col-span-4 bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600 overflow-hidden">
                        <div class="px-6 pt-4 pb-4">
                            <h4 class="title-h4 text-left!">Activity Feed</h4>
                        </div>

                        <div class="relative max-h-[350px] lg:max-h-[450px] 2xl:max-h-[330px]">
                            <div class="absolute top-0 left-0 right-0 h-4 bg-linear-to-b from-surface-0 dark:from-surface-900 to-transparent pointer-events-none z-20"></div>
                            <div class="absolute bottom-0 left-0 right-0 h-6 bg-linear-to-t from-surface-0 dark:from-surface-900 to-transparent pointer-events-none z-20"></div>

                            <div class="pb-6 pt-3 px-4 max-h-[350px] lg:max-h-[450px] 2xl:max-h-[330px] overflow-y-auto">
                                <div class="relative">
                                    <div class="absolute left-[10px] top-0 bottom-0 w-px bg-surface-200 dark:bg-surface-500"></div>

                                    <div class="flex flex-col gap-4">
                                        @for (activity of activityFeed; track activity.id; let i = $index; let last = $last) {
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
                        </div>
                    </div>

                    <div class="lg:col-span-6 xl:col-span-8 flex flex-col gap-6">
                        <div class="p-4 sm:p-5 bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600 flex flex-col gap-[18px] overflow-hidden">
                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:h-8">
                                <h4 class="title-h4 text-left!">Agreement Types</h4>
                                <div class="flex items-center gap-1">
                                    <span class="text-surface-950 dark:text-surface-0 text-xl font-semibold leading-tight">{{ totalAgreements().toLocaleString() }}</span>
                                    <span class="text-surface-500 dark:text-surface-400 text-base leading-none">Total Agreements</span>
                                </div>
                            </div>

                            <div class="hidden md:flex items-end gap-1 w-full">
                                @for (storage of storageData; track storage.id) {
                                    <div class="flex flex-col gap-2" [style.flex]="storage.flexValue">
                                        <div class="h-4 rounded-lg" [style.background-color]="storage.color" [style.box-shadow]="'0px 5px 10px 0px ' + storage.shadowColor"></div>
                                        <div class="flex flex-col gap-1">
                                            <span class="text-surface-900 dark:text-surface-0 text-sm md:text-base xl:text-lg font-medium leading-tight md:leading-normal xl:leading-7">{{ storage.count.toLocaleString() }}</span>
                                            <div class="flex items-center gap-1">
                                                <div class="w-2 h-2 rounded-sm" [style.background-color]="storage.color" [style.box-shadow]="'0px 5px 10px 0px ' + storage.shadowColor"></div>
                                                <span class="text-surface-600 dark:text-surface-300 text-xs md:text-sm leading-tight">{{ storage.type }}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div class="flex flex-col gap-3 md:hidden">
                                @for (storage of storageData; track storage.id) {
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="w-3 h-3 rounded-sm" [style.background-color]="storage.color" [style.box-shadow]="'0px 5px 10px 0px ' + storage.shadowColor"></div>
                                            <span class="text-surface-500 dark:text-surface-400 text-sm leading-tight">{{ storage.type }}</span>
                                        </div>
                                        <span class="text-surface-900 dark:text-surface-0 text-lg font-medium leading-7">{{ storage.count.toLocaleString() }}</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div class="p-5 bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600">
                            <h4 class="title-h4 text-left! mb-4">Pinned</h4>

                            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-6 gap-3">
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
                                            <div class="flex xl:items-center gap-1 xl:flex-row flex-col">
                                                <span class="text-surface-500 dark:text-surface-400 text-sm">{{ pinned.type }}</span>
                                                <div class="w-1 h-1 bg-surface-300 dark:bg-surface-500 rounded-full hidden xl:block"></div>
                                                <span class="text-surface-500 dark:text-surface-400 text-sm">{{ pinned.size }}</span>
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <div class="flex flex-wrap gap-2">
                        @for (filter of filterOptions; track filter) {
                            <p-tag
                                [value]="filter"
                                severity="secondary"
                                [rounded]="true"
                                styleClass="cursor-pointer"
                                [class]="activeFilter() === filter ? 'agreement-filter-active' : ''"
                                (click)="activeFilter.set(filter)"
                            />
                        }
                    </div>

                    <p-table
                        [value]="filteredAgreements()"
                        [paginator]="true"
                        [rows]="rows"
                        [scrollable]="true"
                        sortMode="multiple"
                        styleClass="agreements-table bg-surface-0 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-600 overflow-hidden [&>[data-pc-section=paginatorcontainer]]:border-0! [&_[data-pc-name=pcpaginator]]:rounded-none!"
                        tableStyleClass="w-full min-w-[50rem]"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                        currentPageReportTemplate="Shows {first} to {last} of {totalRecords} results"
                    >
                        <ng-template #header>
                            <tr>
                                <th pSortableColumn="fileName" class="w-40">Agreement Name <p-sortIcon field="fileName" /></th>
                                <th pSortableColumn="type" class="w-32">Type <p-sortIcon field="type" /></th>
                                <th pSortableColumn="fileSize" class="w-42">File Size <p-sortIcon field="fileSize" /></th>
                                <th class="w-24">Size</th>
                                <th pSortableColumn="uploadDate" class="flex-1">Upload Date <p-sortIcon field="uploadDate" /></th>
                                <th pSortableColumn="editDate" class="flex-1">Edit Date <p-sortIcon field="editDate" /></th>
                                <th pSortableColumn="owner" class="flex-1">Owner <p-sortIcon field="owner" /></th>
                                <th class="w-24">Actions</th>
                            </tr>
                        </ng-template>
                        <ng-template #body let-doc>
                            <tr>
                                <td>
                                    <div class="flex items-center gap-3 py-2">
                                        <i class="pi text-xl text-surface-500 dark:text-surface-300" [ngClass]="doc.icon"></i>
                                        <span class="text-surface-700 dark:text-surface-200 text-base whitespace-nowrap">{{ doc.fileName }}</span>
                                    </div>
                                </td>
                                <td>
                                    <p-tag [value]="doc.type" [severity]="getTagSeverity(doc.type)" styleClass="px-2 py-1" />
                                </td>
                                <td>
                                    <span class="text-surface-600 dark:text-surface-300 text-base whitespace-nowrap">{{ doc.fileSize }}</span>
                                </td>
                                <td>
                                    <span class="text-surface-600 dark:text-surface-300 text-base whitespace-nowrap">{{ doc.size }}</span>
                                </td>
                                <td>
                                    <span class="text-surface-600 dark:text-surface-300 text-base whitespace-nowrap">{{ doc.uploadDate }}</span>
                                </td>
                                <td>
                                    <span class="text-surface-600 dark:text-surface-300 text-base whitespace-nowrap">{{ doc.editDate }}</span>
                                </td>
                                <td>
                                    <span class="text-surface-600 dark:text-surface-300 text-base whitespace-nowrap">{{ doc.owner }}</span>
                                </td>
                                <td>
                                    <div class="flex items-center gap-1">
                                        <p-button icon="pi pi-download" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" />
                                        <p-button icon="pi pi-ellipsis-h" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" (onClick)="onTableMenuToggle($event, doc, tableMenu)" />
                                        <p-menu #tableMenu [model]="tableMenuItems" [popup]="true" styleClass="w-48!" appendTo="body" />
                                    </div>
                                </td>
                            </tr>
                        </ng-template>
                    </p-table>
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
                            <div class="w-full h-full flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors rounded-2xl" (click)="triggerFileUpload()">
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
    styles: `
        :host ::ng-deep .agreement-filter-active.p-tag {
            background: var(--surface-0);
            color: var(--gray-900);
            outline: 1px solid var(--gray-900);
            border: 1px solid var(--color-black);
        }

        :host-context(.app-dark) ::ng-deep .agreement-filter-active.p-tag {
            background: var(--p-surface-800);
            color: var(--p-surface-0);
            outline: 1px solid var(--p-surface-400);
            border: 1px solid var(--p-surface-400);
        }

        :host-context(.app-dark) ::ng-deep .agreements-table .p-datatable-thead > tr > th {
            color: var(--p-surface-0);
            border-color: var(--p-content-border-color);
        }

        :host-context(.app-dark) ::ng-deep .agreements-table .p-datatable-tbody > tr > td {
            color: var(--p-surface-200);
            border-color: var(--p-content-border-color);
        }
    `
})
export class Agreements {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    activeFilter = signal<string>('All Agreements');

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
