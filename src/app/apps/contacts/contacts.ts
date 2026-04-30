import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Contact, ContactService, getContactStatusClass } from './contact.service';

interface FilterTag {
    group: 'status' | 'type';
    label: string;
    value: string;
}

@Component({
    selector: 'app-contacts',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, RouterModule, InputTextModule, IconFieldModule, InputIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-col gap-6">
            <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">Contacts</h1>

            <div class="flex flex-col items-start justify-start gap-3">
                <p-iconfield class="w-full sm:w-72">
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Search contacts..." class="w-full! py-2! rounded-xl!" />
                </p-iconfield>

                <div class="flex items-center flex-wrap gap-2">
                    @for (tag of filterTags(); track tag.group + ':' + tag.value) {
                        <p-tag
                            [value]="tag.label"
                            severity="secondary"
                            styleClass="cursor-pointer transition-colors px-2 py-1"
                            [class]="isTagActive(tag) ? 'tag-filter-active' : ''"
                            (click)="toggleTag(tag)"
                        />
                    }
                    @if (hasActiveFilters()) {
                        <p-tag
                            value="Clear"
                            icon="pi pi-times"
                            severity="secondary"
                            styleClass="cursor-pointer transition-colors px-2 py-1"
                            (click)="clearFilters()"
                        />
                    }
                </div>
            </div>

            <div class="p-4 border border-surface rounded-2xl">
                <div class="flex items-center justify-between mb-4 animate-fade-in">
                    <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-6 text-sm">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-users text-base! leading-normal!"></i>
                            <span>{{ filteredContacts().length }} Contacts</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-check-circle text-base! leading-normal!"></i>
                            <span>{{ activeCount() }} Active</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-building text-base! leading-normal!"></i>
                            <span>{{ organizationCount() }} Organizations</span>
                        </div>
                    </div>
                    <p-select-button [(ngModel)]="layout" [options]="layoutOptions" [allowEmpty]="false">
                        <ng-template #item let-option>
                            <i class="pi" [class.pi-bars]="option === 'list'" [class.pi-table]="option === 'grid'"></i>
                        </ng-template>
                    </p-select-button>
                </div>
            <p-dataview [value]="filteredContacts()" [layout]="layout" [pt]="{ header: { class: 'p-0! hidden' }, content: { class: 'bg-transparent!' } }">

                <ng-template #list let-items>
                    <div class="flex flex-col">
                        @for (item of items; track item.id; let i = $index) {
                            <div
                                class="flex flex-col sm:flex-row sm:items-center p-4 gap-4 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors animate-fade-in-up"
                                [style.animation-delay.ms]="i * 50"
                                [class.border-t]="i !== 0"
                                [class.border-surface]="i !== 0"
                                [routerLink]="['/apps/contacts', item.id]"
                            >
                                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                                    <span class="text-primary text-sm font-bold">{{ getInitials(item) }}</span>
                                </div>

                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <span class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ item.firstName }} {{ item.lastName }}</span>
                                            <span class="text-surface-500 dark:text-surface-400 text-sm">({{ item.organization }})</span>
                                        </div>
                                        <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-300">
                                            @if (item.title) {
                                                <span class="flex items-center gap-1"><i class="pi pi-briefcase text-xs"></i> {{ item.title }}</span>
                                            }
                                            @if (item.country) {
                                                <span class="flex items-center gap-1"><i class="pi pi-map-marker text-xs"></i> {{ item.city ? item.city + ', ' : '' }}{{ item.country }}</span>
                                            }
                                            @if (item.email) {
                                                <span class="flex items-center gap-1"><i class="pi pi-envelope text-xs"></i> {{ item.email }}</span>
                                            }
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3 shrink-0">
                                        @if (item.type) {
                                            <p-tag [value]="item.type" severity="info" />
                                        }
                                        @if (item.status) {
                                            <p-tag [value]="item.status" [styleClass]="getStatusClass(item.status)" />
                                        }
                                        <span class="pi pi-chevron-right text-surface-400 text-sm"></span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        @for (item of items; track item.id; let i = $index) {
                            <div class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                                <div
                                    class="p-5 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl flex flex-col gap-4 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors animate-fade-in-up"
                                    [style.animation-delay.ms]="i * 50"
                                    [routerLink]="['/apps/contacts', item.id]"
                                >
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                                                <span class="text-primary text-xs font-bold">{{ getInitials(item) }}</span>
                                            </div>
                                            <div class="flex flex-col gap-0.5 min-w-0">
                                                <span class="text-surface-900 dark:text-surface-0 text-base font-semibold truncate">{{ item.firstName }} {{ item.lastName }}</span>
                                                <span class="text-surface-600 dark:text-surface-300 text-xs truncate">{{ item.organization }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex flex-col gap-2 text-sm text-surface-600 dark:text-surface-300">
                                        @if (item.title) {
                                            <span class="flex items-center gap-2"><i class="pi pi-briefcase text-xs"></i> {{ item.title }}</span>
                                        }
                                        @if (item.country) {
                                            <span class="flex items-center gap-2"><i class="pi pi-map-marker text-xs"></i> {{ item.city ? item.city + ', ' : '' }}{{ item.country }}</span>
                                        }
                                        @if (item.email) {
                                            <span class="flex items-center gap-2"><i class="pi pi-envelope text-xs"></i> {{ item.email }}</span>
                                        }
                                        @if (item.phone) {
                                            <span class="flex items-center gap-2"><i class="pi pi-phone text-xs"></i> {{ item.phone }}</span>
                                        }
                                    </div>

                                    <div class="flex items-center justify-between pt-2 border-t border-surface-200 dark:border-surface-700">
                                        <div class="flex items-center gap-2">
                                            @if (item.type) {
                                                <p-tag [value]="item.type" severity="info" />
                                            }
                                            @if (item.status) {
                                                <p-tag [value]="item.status" [styleClass]="getStatusClass(item.status)" />
                                            }
                                        </div>
                                        <span class="pi pi-chevron-right text-surface-400 text-sm"></span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </ng-template>
            </p-dataview>
            </div>
        </div>
    `
})
export class Contacts implements OnInit {
    private contactService = inject(ContactService);
    layout: 'list' | 'grid' = 'list';
    layoutOptions = ['list', 'grid'];

    searchQuery = signal('');
    activeStatusFilters = signal<Set<string>>(new Set());
    activeTypeFilters = signal<Set<string>>(new Set());

    filterTags = computed<FilterTag[]>(() => {
        const contacts = this.contactService.allContacts();
        const statuses = [...new Set(contacts.map(c => c.status).filter(Boolean))];
        const types = [...new Set(contacts.map(c => c.type).filter(Boolean))];
        return [
            ...statuses.map(s => ({ group: 'status' as const, label: s, value: s })),
            ...types.map(t => ({ group: 'type' as const, label: t, value: t }))
        ];
    });

    filteredContacts = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const statusFilters = this.activeStatusFilters();
        const typeFilters = this.activeTypeFilters();

        return this.contactService.allContacts().filter(c => {
            if (query) {
                const searchable = [c.firstName, c.lastName, c.email, c.organization, c.title, c.country, c.city, c.type, c.phone]
                    .filter(Boolean).join(' ').toLowerCase();
                if (!searchable.includes(query)) return false;
            }
            if (statusFilters.size > 0 && !statusFilters.has(c.status)) return false;
            if (typeFilters.size > 0 && !typeFilters.has(c.type)) return false;
            return true;
        });
    });

    activeCount = computed(() => this.filteredContacts().filter(c => c.status === 'Active').length);
    organizationCount = computed(() => new Set(this.filteredContacts().map(c => c.organization)).size);
    hasActiveFilters = computed(() => this.searchQuery().length > 0 || this.activeStatusFilters().size > 0 || this.activeTypeFilters().size > 0);

    ngOnInit() {
        this.contactService.getContacts();
    }

    getStatusClass = getContactStatusClass;

    getInitials(contact: Contact): string {
        return (contact.firstName[0] ?? '') + (contact.lastName[0] ?? '');
    }

    isTagActive(tag: FilterTag): boolean {
        const set = tag.group === 'status' ? this.activeStatusFilters() : this.activeTypeFilters();
        return set.has(tag.value);
    }

    toggleTag(tag: FilterTag) {
        const signalRef = tag.group === 'status' ? this.activeStatusFilters : this.activeTypeFilters;
        const current = signalRef();
        const next = new Set(current);
        if (next.has(tag.value)) {
            next.delete(tag.value);
        } else {
            next.add(tag.value);
        }
        signalRef.set(next);
    }

    clearFilters() {
        this.searchQuery.set('');
        this.activeStatusFilters.set(new Set());
        this.activeTypeFilters.set(new Set());
    }
}
