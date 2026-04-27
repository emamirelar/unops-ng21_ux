import { GaugeChart } from '@/app/pages/dashboards/charts/gaugechart';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
    selector: 'pipeline-health-widget',
    imports: [DividerModule, ButtonModule, GaugeChart],
    template: `<div class="card xl:w-auto w-full mb-0! px-4! sm:px-6! pb-4! sm:pb-6! pt-4! rounded-3xl border border-surface">
        <div class="mb-2 flex items-start gap-2">
            <span class="flex-1 label-medium">Pipeline Health</span>
            <button class="hover:cursor-pointer"><i class="pi pi-ellipsis-h text-surface-500 hover:text-surface-950 dark:hover:text-surface-0 transition-all"></i></button>
        </div>
        <gauge-chart [data]="data" [labels]="labels" />
        <div class="mt-8 rounded-lg border border-surface">
            <div class="border-b border-surface flex items-center justify-between px-3.5 py-2">
                <span class="label-small text-surface-950 dark:text-surface-0">Key Metrics</span>
            </div>
            <div class="p-3.5 flex flex-col gap-3">
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Avg. Time to Close</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">94 days</span>
                </div>
                <p-divider class="m-0!" />
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Conversion Rate</span>
                    <span class="px-2 py-1 rounded-lg text-green-700 bg-green-50 dark:bg-green-900 dark:text-green-300 text-sm font-semibold">72%</span>
                </div>
                <p-divider class="m-0!" />
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">At Risk</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">12</span>
                </div>
                <p-divider class="m-0!" />
                <div class="flex items-center justify-between gap-4">
                    <span class="body-xsmall">Avg. Deal Size</span>
                    <span class="label-xsmall text-surface-950 dark:text-surface-0">$4.37M</span>
                </div>
            </div>
        </div>
        <p-button styleClass="mt-6 w-full text-surface-950! dark:text-surface-0! rounded-lg!" label="View pipeline details" outlined severity="secondary" />
    </div>`
})
export class PipelineHealthWidget {
    data = [760, 240];

    labels = ['Pipeline Score', ''];
}
