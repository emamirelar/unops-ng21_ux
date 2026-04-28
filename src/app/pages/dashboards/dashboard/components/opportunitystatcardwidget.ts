import { trackByFn } from '@/app/lib/utils';
import { MiniLineChart } from '@/app/pages/dashboards/charts/minilinechart';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'opportunity-stat-card-widget',
    imports: [CommonModule, MiniLineChart],
    template: `@for (data of datasets; track trackByFn()) {
        <div class="card flex-1 mb-0! p-0! min-w-64 rounded-2xl shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)]">
            <div class="px-4 pt-3.5 pb-1">
                <div class="flex items-start gap-2">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" [ngClass]="data.iconBg">
                        <i class="pi text-sm" [ngClass]="data.icon"></i>
                    </div>
                    <span class="flex-1 label-medium mt-0.5">{{ data.cardData.title }}</span>
                </div>
                <div class="mt-2 flex items-center gap-3">
                    <span class="label-large">{{ data.cardData.value }}</span>
                    <div class="px-2 py-0.5 rounded-lg text-sm font-semibold" [ngClass]="data.cardData.changePositive ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'">
                        {{ data.cardData.change }}
                    </div>
                </div>
                <p class="body-xsmall text-left mt-1">{{ data.cardData.subtitle }}</p>
            </div>
            <mini-line-chart class="max-h-20! p-0!" [data]="data.data" [bgColor]="data.bgColor" [borderColor]="data.borderColor" />
        </div>
    }`,
    host: {
        class: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7'
    }
})
export class OpportunityStatCardWidget {
    datasets = [
        {
            cardData: {
                title: 'Total Opportunities',
                value: '284',
                change: '+18%',
                changePositive: true,
                subtitle: 'vs. previous quarter'
            },
            icon: 'pi-briefcase',
            iconBg: 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
            data: [142, 168, 195, 210, 238, 252, 261, 278, 284],
            borderColor: 'rgb(0, 146, 209)',
            bgColor: ['rgba(0,146,209,0.3)', 'rgba(0,146,209,0)']
        },
        {
            cardData: {
                title: 'Pipeline Value',
                value: '$1.24B',
                change: '+24%',
                changePositive: true,
                subtitle: 'across active opportunities'
            },
            icon: 'pi-dollar',
            iconBg: 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300',
            data: [680, 750, 820, 910, 980, 1050, 1120, 1180, 1240],
            borderColor: 'rgb(76, 159, 56)',
            bgColor: ['rgba(76,159,56,0.3)', 'rgba(76,159,56,0)']
        },
        {
            cardData: {
                title: 'Active Partners',
                value: '67',
                change: '+12%',
                changePositive: true,
                subtitle: 'contributing organizations'
            },
            icon: 'pi-globe',
            iconBg: 'bg-ocean-50 text-ocean-700 dark:bg-ocean-900 dark:text-ocean-300',
            data: [42, 45, 48, 52, 55, 58, 61, 64, 67],
            borderColor: 'rgb(78, 195, 224)',
            bgColor: ['rgba(78,195,224,0.3)', 'rgba(78,195,224,0)']
        },
        {
            cardData: {
                title: 'Win Rate',
                value: '72%',
                change: '-3%',
                changePositive: false,
                subtitle: 'conversion to signed'
            },
            icon: 'pi-chart-line',
            iconBg: 'bg-cherry-50 text-cherry-700 dark:bg-cherry-900 dark:text-cherry-300',
            data: [78, 76, 80, 74, 77, 73, 75, 71, 72],
            borderColor: 'rgb(153, 30, 102)',
            bgColor: ['rgba(153,30,102,0.3)', 'rgba(153,30,102,0)']
        }
    ];

    protected readonly trackByFn = trackByFn;
}
