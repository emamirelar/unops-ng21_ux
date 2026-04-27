import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'recent-opportunities-widget',
    imports: [CommonModule, ButtonModule, TableModule, TagModule],
    template: `<div class="flex items-center gap-2">
            <div class="flex-1 flex flex-col gap-1">
                <span class="label-medium">Recent Opportunities</span>
                <span class="body-xsmall text-left">Track opportunities across the pipeline.</span>
            </div>
            <p-button label="See All" severity="secondary" outlined styleClass="text-surface-950! dark:text-surface-0! px-3! py-1! rounded-lg!" />
        </div>
        <div class="w-full overflow-auto flex-1 mt-5">
            <p-table
                [value]="opportunities"
                [rows]="7"
                [paginator]="true"
                dataKey="id"
                [tableStyle]="{ 'min-width': '50rem' }"
            >
                <ng-template #header>
                    <tr>
                        <th>Opportunity</th>
                        <th>Partner</th>
                        <th>Value</th>
                        <th>Stage</th>
                        <th>Region</th>
                        <th></th>
                    </tr>
                </ng-template>
                <ng-template #body let-data>
                    <tr>
                        <td>
                            <div class="label-xsmall text-surface-950 dark:text-surface-0">{{ data.name }}</div>
                        </td>
                        <td>
                            <div class="body-xsmall text-left">{{ data.partner }}</div>
                        </td>
                        <td>
                            <div class="label-xsmall text-surface-950 dark:text-surface-0">{{ data.value }}</div>
                        </td>
                        <td>
                            <p-tag [value]="data.stage" [severity]="stageSeverity(data.stage)" />
                        </td>
                        <td>
                            <div class="body-xsmall text-left">{{ data.region }}</div>
                        </td>
                        <td>
                            <div class="flex items-end justify-end">
                                <button class="text-right text-surface-700 dark:text-surface-300 hover:cursor-pointer">
                                    <i class="pi pi-ellipsis-h"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                </ng-template>
            </p-table>
        </div>`,
    host: {
        class: 'card xl:w-auto w-full xl:flex-1 mb-0! flex-1 px-4! sm:px-7! pb-4! sm:pb-7! pt-4! sm:pt-6! border rounded-3xl border-surface flex flex-col justify-between overflow-hidden'
    },
    styles: `
        :host ::ng-deep {
            .p-datatable {
                .p-datatable-thead > tr th {
                    background: transparent;
                }

                .p-datatable-tbody > tr {
                    background: transparent;
                }

                .p-datatable-tbody > tr.p-datatable-row-selected > td,
                .p-datatable-tbody > tr:has(+ .p-datatable-row-selected) > td {
                    border-bottom-color: var(--p-datatable-body-cell-border-color);
                }

                .p-paginator {
                    background: transparent;
                }
            }
        }
    `
})
export class RecentOpportunitiesWidget {
    opportunities = [
        { id: '1', name: 'Water Sanitization', partner: 'Japan', value: '$15.0M', stage: 'ID & Profile', region: 'Sub-Saharan Africa' },
        { id: '2', name: 'Rural Electrification', partner: 'Denmark', value: '$22.5M', stage: 'Formulation', region: 'South Asia' },
        { id: '3', name: 'School Infrastructure', partner: 'Norway', value: '$8.7M', stage: 'Signed', region: 'Latin America' },
        { id: '4', name: 'Healthcare Supply Chain', partner: 'USAID', value: '$31.2M', stage: 'Approval', region: 'East Africa' },
        { id: '5', name: 'Road Rehabilitation', partner: 'World Bank', value: '$45.0M', stage: 'ID & Profile', region: 'Central Asia' },
        { id: '6', name: 'Flood Resilience', partner: 'EU', value: '$12.3M', stage: 'Formulation', region: 'Southeast Asia' },
        { id: '7', name: 'Urban Waste Mgmt', partner: 'Sweden', value: '$9.8M', stage: 'Approval', region: 'West Africa' },
        { id: '8', name: 'Bridge Construction', partner: 'South Korea', value: '$18.6M', stage: 'Signed', region: 'Middle East' },
        { id: '9', name: 'Solar Farm Initiative', partner: 'Germany', value: '$27.4M', stage: 'ID & Profile', region: 'North Africa' }
    ];

    stageSeverity(stage: string): 'info' | 'warn' | 'success' | 'secondary' {
        switch (stage) {
            case 'ID & Profile':
                return 'info';
            case 'Formulation':
                return 'warn';
            case 'Approval':
                return 'secondary';
            case 'Signed':
                return 'success';
            default:
                return 'secondary';
        }
    }
}
