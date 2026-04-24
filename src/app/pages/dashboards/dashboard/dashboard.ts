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
            <!-- Hero Header -->
            <div class="px-6 sm:px-10 py-10 rounded-b-2xl text-center flex flex-col items-center">
                <div class="max-w-3xl">
                    <h1 class="text-surface-0 text-3xl sm:text-4xl font-semibold leading-tight m-0 mb-4">
                        Welcome to the enhanced Partner and Opportunities platform, Opportunity +
                    </h1>
                    <p class="text-surface-0/90 text-lg sm:text-xl font-medium leading-relaxed m-0 mb-3">
                        Your personalized dashboard for managing partnerships and opportunities
                    </p>
                    <p class="text-surface-0/70 text-sm sm:text-base leading-relaxed m-0">
                        We've added new dashboard features, improved navigation, and streamlined workflows. Explore the updated interface and share your feedback with the admin team.
                    </p>
                </div>
            </div>

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
