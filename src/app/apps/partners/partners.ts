import { Partner } from '@/app/types/partner';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { PartnerService } from './partner.service';

@Component({
    selector: 'app-partners',
    imports: [CommonModule, DataViewModule, FormsModule, SelectButtonModule, TagModule, ButtonModule, RouterModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex items-center gap-4">
                <div class="flex flex-col gap-1 flex-1 min-w-0">
                    <h1 class="text-surface-900 dark:text-surface-0 text-2xl font-semibold leading-8 m-0">Partners</h1>
                    <span class="text-surface-600 dark:text-surface-300 text-sm">{{ partnerService.allPartners().length }} organizations</span>
                </div>
            </div>

            <div class="card">
                <div class="flex justify-end mb-4">
                    <p-select-button [(ngModel)]="layout" [options]="layoutOptions" [allowEmpty]="false">
                        <ng-template #item let-option>
                            <i class="pi" [class.pi-bars]="option === 'list'" [class.pi-table]="option === 'grid'"></i>
                        </ng-template>
                    </p-select-button>
                </div>
            <p-dataview [value]="partnerService.allPartners()" [layout]="layout" [pt]="{ header: { class: 'p-0! hidden' } }">

                <ng-template #list let-items>
                    <div class="flex flex-col">
                        @for (item of items; track item.id; let i = $index) {
                            <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-4" [class.border-t]="i !== 0" [class.border-surface]="i !== 0">
                                <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                                    <i class="pi pi-building text-primary text-xl"></i>
                                </div>

                                <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                                    <div class="flex flex-col gap-1 min-w-0">
                                        <div class="flex items-center gap-2">
                                            <span class="text-surface-900 dark:text-surface-0 text-base font-semibold">{{ item.name }}</span>
                                            @if (item.shortName) {
                                                <span class="text-surface-500 dark:text-surface-400 text-sm">({{ item.shortName }})</span>
                                            }
                                            @if (item.keyGlobalPartner) {
                                                <i class="pi pi-star-fill text-amber-500 text-xs" title="Key Global Partner"></i>
                                            }
                                        </div>
                                        <div class="flex items-center gap-3 text-sm text-surface-600 dark:text-surface-300">
                                            @if (item.address1Country) {
                                                <span class="flex items-center gap-1"><i class="pi pi-map-marker text-xs"></i> {{ item.address1City ? item.address1City + ', ' : '' }}{{ item.address1Country }}</span>
                                            }
                                            @if (item.liaisonOfficeName) {
                                                <span class="flex items-center gap-1"><i class="pi pi-home text-xs"></i> {{ item.liaisonOfficeName }}</span>
                                            }
                                            @if (item.partnerFocalPointName) {
                                                <span class="flex items-center gap-1"><i class="pi pi-user text-xs"></i> {{ item.partnerFocalPointName }}</span>
                                            }
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-3 shrink-0">
                                        @if (item.partnerCategoryName) {
                                            <p-tag [value]="item.partnerCategoryName" severity="info" />
                                        }
                                        @if (item.status) {
                                            <p-tag [value]="item.status" [severity]="getStatusSeverity(item.status)" />
                                        }
                                        @if (item.partnerApprovalStatus === 'Approved') {
                                            <p-tag value="Approved" severity="success" [icon]="'pi pi-check'" />
                                        }
                                        <p-button icon="pi pi-eye" [rounded]="true" [text]="true" severity="secondary" [routerLink]="['/apps/partners', item.id]" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </ng-template>

                <ng-template #grid let-items>
                    <div class="grid grid-cols-12 gap-4">
                        @for (item of items; track item.id) {
                            <div class="col-span-12 sm:col-span-6 lg:col-span-4 p-2">
                                <div class="p-5 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded-xl flex flex-col gap-4">
                                    <div class="flex items-start justify-between">
                                        <div class="flex items-center gap-3">
                                            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 shrink-0">
                                                <i class="pi pi-building text-primary"></i>
                                            </div>
                                            <div class="flex flex-col gap-0.5 min-w-0">
                                                <span class="text-surface-900 dark:text-surface-0 text-base font-semibold truncate">{{ item.shortName || item.name }}</span>
                                                @if (item.shortName) {
                                                    <span class="text-surface-600 dark:text-surface-300 text-xs truncate">{{ item.name }}</span>
                                                }
                                            </div>
                                        </div>
                                        @if (item.keyGlobalPartner) {
                                            <i class="pi pi-star-fill text-amber-500 text-sm" title="Key Global Partner"></i>
                                        }
                                    </div>

                                    <div class="flex flex-col gap-2 text-sm text-surface-600 dark:text-surface-300">
                                        @if (item.partnerCategoryName) {
                                            <span class="flex items-center gap-2"><i class="pi pi-tag text-xs"></i> {{ item.partnerCategoryName }} &middot; {{ item.partnerGroupName }}</span>
                                        }
                                        @if (item.address1Country) {
                                            <span class="flex items-center gap-2"><i class="pi pi-map-marker text-xs"></i> {{ item.address1City ? item.address1City + ', ' : '' }}{{ item.address1Country }}</span>
                                        }
                                        @if (item.partnerFocalPointName) {
                                            <span class="flex items-center gap-2"><i class="pi pi-user text-xs"></i> {{ item.partnerFocalPointName }}</span>
                                        }
                                    </div>

                                    <div class="flex items-center justify-between pt-2 border-t border-surface-200 dark:border-surface-700">
                                        <div class="flex items-center gap-2">
                                            @if (item.status) {
                                                <p-tag [value]="item.status" [severity]="getStatusSeverity(item.status)" />
                                            }
                                            @if (item.partnerApprovalStatus === 'Approved') {
                                                <p-tag value="Approved" severity="success" [icon]="'pi pi-check'" />
                                            }
                                        </div>
                                        <p-button icon="pi pi-eye" label="View" [text]="true" severity="secondary" size="small" [routerLink]="['/apps/partners', item.id]" />
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
export class Partners implements OnInit {
    partnerService = inject(PartnerService);
    layout: 'list' | 'grid' = 'list';
    layoutOptions = ['list', 'grid'];

    ngOnInit() {
        this.partnerService.getPartners();
    }

    getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        const map: Record<string, 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'> = {
            Active: 'success',
            Draft: 'warn',
            Closed: 'danger',
            Archived: 'secondary'
        };
        return map[status] || 'info';
    }
}
