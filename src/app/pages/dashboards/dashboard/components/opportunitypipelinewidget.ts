import { CustomMeter } from '@/app/pages/dashboards/charts/custommeter';
import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'opportunity-pipeline-widget',
    imports: [CustomMeter, DividerModule, ButtonModule],
    template: `<div class="p-6">
            <div class="mb-6 flex items-center justify-between gap-6">
                <div class="label-medium">Pipeline by Stage</div>
            </div>
            <custom-meter title="Opportunity stages" [value]="stageData" />
        </div>
        <p-divider class="m-0!" />
        <div class="p-6">
            <div class="mb-6 flex items-center justify-between gap-6">
                <div class="label-medium">By Sector</div>
            </div>
            <custom-meter [value]="sectorData" />
            <p-button styleClass="w-full mt-6 text-surface-950! dark:text-surface-0! rounded-lg!" label="View all opportunities" outlined severity="secondary" />
        </div>`,
    host: {
        class: 'card w-full xl:w-100 mb-0! p-0! rounded-3xl border border-surface shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]'
    }
})
export class OpportunityPipelineWidget {
    stageData = [
        { label: 'ID & Profile', title: '84', colorClass: 'bg-blue-500', value: 84 },
        { label: 'Formulation', title: '72', colorClass: 'bg-ocean-500', value: 72 },
        { label: 'Approval', title: '68', colorClass: 'bg-teal-500', value: 68 },
        { label: 'Signed', title: '60', colorClass: 'bg-green-500', value: 60 }
    ];

    sectorData = [
        { label: 'Infrastructure', title: '$420M', colorClass: 'bg-blue-500', value: 420 },
        { label: 'Health', title: '$310M', colorClass: 'bg-green-500', value: 310 },
        { label: 'Education', title: '$280M', colorClass: 'bg-ocean-500', value: 280 },
        { label: 'Environment', title: '$230M', colorClass: 'bg-teal-500', value: 230 }
    ];
}
