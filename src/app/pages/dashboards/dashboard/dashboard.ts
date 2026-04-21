import { OpportunityStatCardWidget } from '@/app/pages/dashboards/dashboard/components/opportunitystatcardwidget';
import { OpportunityTrendsWidget } from '@/app/pages/dashboards/dashboard/components/opportunitytrendswidget';
import { OpportunityPipelineWidget } from '@/app/pages/dashboards/dashboard/components/opportunitypipelinewidget';
import { PipelineHealthWidget } from '@/app/pages/dashboards/dashboard/components/pipelinehealthwidget';
import { RecentOpportunitiesWidget } from '@/app/pages/dashboards/dashboard/components/recentopportunitieswidget';
import { Component } from '@angular/core';

@Component({
    selector: 'app-dashboard',
    imports: [OpportunityStatCardWidget, OpportunityTrendsWidget, OpportunityPipelineWidget, PipelineHealthWidget, RecentOpportunitiesWidget],
    template: `<section>
        <div class="flex flex-col gap-7">
            <opportunity-stat-card-widget />
            <div class="w-full flex xl:flex-row flex-col gap-6">
                <opportunity-trends-widget />
                <opportunity-pipeline-widget />
            </div>
            <div class="flex xl:flex-row flex-col gap-6">
                <pipeline-health-widget />
                <recent-opportunities-widget />
            </div>
        </div>
    </section>`
})
export class Dashboard {}
