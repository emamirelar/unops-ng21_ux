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
import { getOpportunityStageSeverity, OpportunityService } from './opportunity.service';

interface FilterTag {
    group: 'stage' | 'region';
    label: string;
    value: string;
}

@Component({
    selector: 'app-opportunities',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, RouterModule, InputTextModule, IconFieldModule, InputIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-col gap-6">
            <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">Opportunities</h1>

            <div class="flex flex-col items-start justify-start gap-3">
                <p-iconfield class="w-full sm:w-72">
                    <p-inputicon styleClass="pi pi-search" />
                    <input pInputText [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Search opportunities..." class="w-full! py-2! rounded-xl!" />
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
                    <div class="flex items-center text-surface-700 dark:text-surface-300 flex-wrap gap-4 sm:gap-6 text-sm">
                        <div class="flex items-center gap-2">
                            <i class="pi pi-briefcase text-base! leading-normal!"></i>
                            <span>{{ filteredOpportunities().length }} Opportunities</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-info-circle text-base! leading-normal!"></i>
                            <span>{{ idProfileCount() }} ID &amp; Profile</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-pencil text-base! leading-normal!"></i>
                            <span>{{ formulationCount() }} Formulation</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-check-square text-base! leading-normal!"></i>
                            <span>{{ approvalCount() }} Approval</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <i class="pi pi-verified text-base! leading-normal!"></i>
                            <span>{{ signedCount() }} Signed</span>
                        </div>
                    </div>
                    <p-select-button [(ngModel)]="layout" [options]="layoutOptions" [allowEmpty]="false">
                        <ng-template #item let-option>
                            <i class="pi" [class.pi-bars]="option === 'list'" [class.pi-table]="option === 'grid'"></i>
                        </ng-template>
                    </p-select-button>
                </div>
                <p-dataview [value]="filteredOpportunities()" [layout]="layout" [pt]="{ header: { class: 'p-0! hidden' }, content: { class: 'bg-transparent!' } }">
                    <ng-template #list let-items>
                        <div class="flex flex-col">
                            @for (item of items; track item.id; let i = $index) {
                                <a
                                    [routerLink]="['/apps/opportunities', item.id]"
                                    class="flex flex-col sm:flex-row sm:items-center p-4 gap-4 no-underline text-inherit cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors animate-fade-in-up"
                                    [style.animation-delay.ms]="i * 50"
                                    [class.border-t]="i !== 0"
                                    [class.border-surface]="i !== 0"
                                >
                                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                                        <i class="pi pi-briefcase text-primary text-xl"></i>
                                    </div>

                                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                                        <div class="flex flex-col gap-1 min-w-0">
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <span class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ item.name }}</span>
                                            </div>
                                            <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-300 flex-wrap">
                                                <span class="flex items-center gap-1"><i class="pi pi-building text-xs"></i> {{ item.partner }}</span>
                                                <span class="flex items-center gap-1"><i class="pi pi-map-marker text-xs"></i> {{ item.region }}</span>
                                                @if (item.sector) {
                                                    <span class="flex items-center gap-1"><i class="pi pi-sitemap text-xs"></i> {{ item.sector }}</span>
                                                }
                                            </div>
                                        </div>

                                        <div class="flex items-center gap-3 shrink-0 flex-wrap">
                                            <span class="text-surface-900 dark:text-surface-0 text-sm font-semibold">{{ item.value }}</span>
                                            <p-tag [value]="item.stage" [severity]="stageSeverity(item.stage)" />
                                            <span class="pi pi-chevron-right text-surface-400 text-sm"></span>
                                        </div>
                                    </div>
                                </a>
                            }
                        </div>
                    </ng-template>

                    <ng-template #grid let-items>
                        <div class="grid grid-cols-12 gap-4">
                            @for (item of items; track item.id; let i = $index) {
                                <a [routerLink]="['/apps/opportunities', item.id]" class="col-span-12 sm:col-span-6 lg:col-span-4 p-2 no-underline text-inherit">
                                    <div
                                        class="p-5 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl flex flex-col gap-4 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors animate-fade-in-up"
                                        [style.animation-delay.ms]="i * 50"
                                    >
                                        <div class="flex items-start justify-between gap-2">
                                            <div class="flex items-center gap-3 min-w-0">
                                                <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                                                    <i class="pi pi-briefcase text-primary"></i>
                                                </div>
                                                <div class="flex flex-col gap-0.5 min-w-0">
                                                    <span class="text-surface-900 dark:text-surface-0 text-base font-semibold truncate">{{ item.name }}</span>
                                                    <span class="text-surface-600 dark:text-surface-300 text-xs truncate">{{ item.partner }}</span>
                                                </div>
                                            </div>
                                            <p-tag [value]="item.stage" [severity]="stageSeverity(item.stage)" />
                                        </div>

                                        <div class="flex flex-col gap-2 text-sm text-surface-600 dark:text-surface-300">
                                            <span class="flex items-center gap-2"><i class="pi pi-dollar text-xs"></i> {{ item.value }}</span>
                                            <span class="flex items-center gap-2"><i class="pi pi-map-marker text-xs"></i> {{ item.region }}</span>
                                            @if (item.sector) {
                                                <span class="flex items-center gap-2"><i class="pi pi-sitemap text-xs"></i> {{ item.sector }}</span>
                                            }
                                        </div>

                                        <div class="flex items-center justify-end pt-2 border-t border-surface-200 dark:border-surface-700">
                                            <span class="pi pi-chevron-right text-surface-400 text-sm"></span>
                                        </div>
                                    </div>
                                </a>
                            }
                        </div>
                    </ng-template>
                </p-dataview>
            </div>
        </div>
    `
})
export class Opportunities implements OnInit {
    opportunityService = inject(OpportunityService);
    layout: 'list' | 'grid' = 'list';
    layoutOptions = ['list', 'grid'];

    searchQuery = signal('');
    activeStageFilters = signal<Set<string>>(new Set());
    activeRegionFilters = signal<Set<string>>(new Set());

    filterTags = computed<FilterTag[]>(() => {
        const items = this.opportunityService.allOpportunities();
        const stages = [...new Set(items.map(o => o.stage).filter((s): s is string => !!s))];
        const regions = [...new Set(items.map(o => o.region).filter((r): r is string => !!r))];
        return [
            ...stages.map(s => ({ group: 'stage' as const, label: s, value: s })),
            ...regions.map(r => ({ group: 'region' as const, label: r, value: r }))
        ];
    });

    filteredOpportunities = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const stageFilters = this.activeStageFilters();
        const regionFilters = this.activeRegionFilters();

        return this.opportunityService.allOpportunities().filter(o => {
            if (query) {
                const searchable = [o.name, o.partner, o.region, o.sector, o.stage, o.value].filter(Boolean).join(' ').toLowerCase();
                if (!searchable.includes(query)) return false;
            }
            if (stageFilters.size > 0 && !stageFilters.has(o.stage)) return false;
            if (regionFilters.size > 0 && !regionFilters.has(o.region)) return false;
            return true;
        });
    });

    idProfileCount = computed(() => this.filteredOpportunities().filter(o => o.stage === 'ID & Profile').length);
    formulationCount = computed(() => this.filteredOpportunities().filter(o => o.stage === 'Formulation').length);
    approvalCount = computed(() => this.filteredOpportunities().filter(o => o.stage === 'Approval').length);
    signedCount = computed(() => this.filteredOpportunities().filter(o => o.stage === 'Signed').length);

    hasActiveFilters = computed(() => this.searchQuery().length > 0 || this.activeStageFilters().size > 0 || this.activeRegionFilters().size > 0);

    ngOnInit() {
        this.opportunityService.getOpportunities();
    }

    stageSeverity(stage: string) {
        return getOpportunityStageSeverity(stage);
    }

    isTagActive(tag: FilterTag): boolean {
        const set = tag.group === 'stage' ? this.activeStageFilters() : this.activeRegionFilters();
        return set.has(tag.value);
    }

    toggleTag(tag: FilterTag) {
        const signalRef = tag.group === 'stage' ? this.activeStageFilters : this.activeRegionFilters;
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
        this.activeStageFilters.set(new Set());
        this.activeRegionFilters.set(new Set());
    }
}
