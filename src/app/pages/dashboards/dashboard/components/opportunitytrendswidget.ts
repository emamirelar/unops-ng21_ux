import { generateRandomMultiData } from '@/app/lib/utils';
import { MultiLineChart } from '@/app/pages/dashboards/charts/multilinechart';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';

@Component({
    selector: 'opportunity-trends-widget',
    imports: [FormsModule, MultiLineChart, SelectButtonModule],
    template: `<div class="flex flex-col md:flex-row gap-4 md:gap-0 items-start justify-between mb-4">
            <div class="label-medium">Opportunity Trends</div>
            <p-select-button [(ngModel)]="select" [options]="options" optionLabel="name" ariaLabelledBy="basic" [allowEmpty]="false" />
        </div>
        <div class="flex-1 w-full overflow-auto">
            <multi-line-chart [datasets]="randomData" [labels]="labels" [bgColors]="bgColors" [borderColors]="borderColors" [option]="select.value" tooltipPrefix="" />
        </div>`,
    host: {
        class: 'card w-full xl:w-auto xl:flex-1 mb-0! px-7! pb-7! pt-6! border rounded-3xl border-surface flex flex-col justify-between overflow-hidden'
    }
})
export class OpportunityTrendsWidget {
    randomData = generateRandomMultiData('2024-01-01T00:00:00', '2026-04-21T00:00:00', 4, 8, 24, 2, true);

    select = { name: 'Monthly', value: 'month' };

    labels = ['New Opportunities', 'Closed / Signed'];

    bgColors = [undefined, ['rgba(76,159,56,0.3)', 'rgba(76,159,56,0)']];

    borderColors = [undefined, 'rgb(76,159,56)'];

    options = [
        { name: 'Weekly', value: 'week' },
        { name: 'Monthly', value: 'month' },
        { name: 'Yearly', value: 'year' }
    ];
}
