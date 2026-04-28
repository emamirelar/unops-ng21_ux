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
            <div class="text-left animate-fade-in-down mb-8">
                <h2 class="text-surface-900 dark:text-surface-0 text-2xl sm:text-3xl font-bold leading-relaxed m-0 mb-6">
                    Welcome to the enhanced Partner and Opportunities platform, Opportunity+
                </h2>
                <p class="text-surface-700 dark:text-surface-0/90 text-lg sm:text-xl font-medium leading-relaxed m-0 mb-6">
                    Your personalized dashboard for managing partnerships and opportunities
                </p>
                <p class="text-surface-500 dark:text-surface-0/70 text-sm sm:text-base leading-relaxed m-0">
                    We've added new dashboard features, improved navigation, and streamlined workflows. Explore the updated interface and share your feedback with the admin team.
                </p>
            </div>

            <opportunity-stat-card-widget class="animate-fade-in-up stagger-1" />
            <div class="w-full flex xl:flex-row flex-col gap-6 animate-fade-in-up stagger-2">
                <opportunity-trends-widget />
                <opportunity-pipeline-widget />
            </div>
            <div class="flex xl:flex-row flex-col gap-6 animate-fade-in-up stagger-3">
                <pipeline-health-widget />
                <recent-opportunities-widget />
            </div>
        </div>
    </section>`
})
export class Dashboard {}
