import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { PillTabsComponent, PillTabItem } from '@unopsitg/ux';

export interface DocumentItem {
    id: number;
    fileName: string;
    type: string;
    fileSize: string;
    uploadDate: string;
    owner: string;
    icon: string;
}

@Component({
    selector: 'app-documents-card',
    imports: [CommonModule, FormsModule, ButtonModule, FileUploadModule, IconFieldModule, InputIconModule, InputTextModule, MenuModule, TableModule, TagModule, PillTabsComponent, PanelModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        :host :deep .p-fileupload-header {
            background: transparent;
        }
        :host :deep .p-fileupload-content {
            background: transparent;
        }
    `,
    template: `
        <div class="card flex flex-col">
            <p-panel [toggleable]="true" [collapsed]="!expanded()" (collapsedChange)="expanded.set(!$event)" toggler="header">
                <ng-template #header>
                    <div class="flex items-center gap-3 flex-1">
                        <i class="pi pi-folder text-deepsea-500 dark:text-surface-0"></i>
                        <div class="flex flex-col">
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">Documents</h4>
                            <span class="text-surface-500 dark:text-surface-300 text-sm font-medium leading-tight">{{ summary() }}</span>
                        </div>
                    </div>
                </ng-template>
                        <div class="flex flex-col gap-4 pt-4">
                            <ux-pill-tabs [items]="pillTabItems()" [(activeValue)]="activeFilter" />

                            <p-iconfield>
                                <p-inputicon class="pi pi-search" />
                                <input pInputText [(ngModel)]="searchQuery" placeholder="Search documents" class="w-full" />
                            </p-iconfield>

                            @if (filtered().length > 0) {
                                <p-table
                                    [value]="filtered()"
                                    [paginator]="true"
                                    [rows]="rows()"
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
                                                    <span class="text-surface-700 dark:text-surface-100 text-sm whitespace-nowrap">{{ doc.fileName }}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <p-tag [value]="doc.type" styleClass="px-2 py-1" />
                                            </td>
                                            <td>
                                                <div class="flex items-center gap-1">
                                                    <p-button icon="pi pi-download" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" ariaLabel="Download" />
                                                    <p-button icon="pi pi-ellipsis-h" [rounded]="true" [text]="true" size="small" severity="secondary" styleClass="cursor-pointer" ariaLabel="More options" (onClick)="onMenuToggle($event, doc, docMenu)" />
                                                    <p-menu #docMenu [model]="menuItems" [popup]="true" styleClass="w-48!" appendTo="body" />
                                                </div>
                                            </td>
                                        </tr>
                                    </ng-template>
                                </p-table>
                            } @else {
                                <div class="flex flex-col items-center gap-3 py-8 text-center">
                                    <i class="pi pi-folder-open text-3xl text-surface-300 dark:text-surface-500"></i>
                                    <span class="text-surface-600 dark:text-surface-300 text-sm">No documents to show</span>
                                </div>
                            }

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
                                        <p-button icon="pi pi-link" label="Share Link" [outlined]="true" styleClass="!text-primary-600 !border-primary-600" />
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
            </p-panel>
        </div>
    `
})
export class DocumentsCard {
    documents = input<DocumentItem[]>([]);
    rows = input(5);

    expanded = signal(false);
    activeFilter = signal('All Files');
    searchQuery = model('');

    private fileTypes = computed(() => {
        const types = [...new Set(this.documents().map(d => d.type))];
        types.sort();
        return types;
    });

    filterOptions = computed(() => ['All Files', ...this.fileTypes(), 'Other']);

    pillTabItems = computed<PillTabItem[]>(() =>
        this.filterOptions().map(f => ({ value: f, label: f }))
    );

    summary = computed(() => {
        const docs = this.documents();
        const count = docs.length;
        if (count === 0) return 'No files attached';
        const types = this.fileTypes();
        const fileWord = count === 1 ? 'file' : 'files';
        if (types.length === 0) return `${count} ${fileWord} attached`;
        return `${count} ${fileWord} · ${types.join(', ')}`;
    });

    filtered = computed(() => {
        let docs = this.documents();
        const query = this.searchQuery().trim().toLowerCase();
        if (query) {
            docs = docs.filter(d => d.fileName.toLowerCase().includes(query) || d.owner.toLowerCase().includes(query));
        }
        const filter = this.activeFilter();
        if (filter === 'All Files') return docs;
        if (filter === 'Other') {
            const knownTypes = this.fileTypes();
            return docs.filter(d => !knownTypes.includes(d.type));
        }
        return docs.filter(d => d.type === filter);
    });

    menuItems: MenuItem[] = [];

    onMenuToggle(event: Event, _doc: DocumentItem, menu: Menu) {
        this.menuItems = [
            { label: 'Preview', icon: 'pi pi-eye' },
            { label: 'Share', icon: 'pi pi-share-alt' },
            { separator: true },
            { label: 'Delete', icon: 'pi pi-trash', styleClass: 'text-red-500' }
        ];
        menu.toggle(event);
    }
}
