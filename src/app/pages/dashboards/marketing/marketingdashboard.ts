import { FollowerAnalyticsWidget } from '@/app/pages/dashboards/marketing/components/followeranalyticswidget';
import { OrderHistoryWidget } from '@/app/pages/dashboards/marketing/components/orderhistorywidget';
import { SalesOverviewWidget } from '@/app/pages/dashboards/marketing/components/salesoverviewwidget';
import { StatCardWidget } from '@/app/pages/dashboards/marketing/components/statcardwidget';
import { Component } from '@angular/core';

@Component({
    selector: 'app-marketing-dashboard',
    standalone: true,
    imports: [StatCardWidget, SalesOverviewWidget, FollowerAnalyticsWidget, OrderHistoryWidget],
    template: `<section class="flex flex-col *:py-8 [&>*:first-child]:pt-0! [&>*:last-child]:pb-0! divide-y divide-(--surface-border)">
        <stat-card-widget class="animate-fade-in-up stagger-1" />
        <div
            class="flex xl:flex-row flex-col xl:divide-y-0 divide-y xl:divide-x divide-(--surface-border) animate-fade-in-up stagger-2"
        >
            <sales-overview-widget />
            <follower-analytics-widget />
        </div>
        <order-history-widget class="animate-fade-in-up stagger-3" />
    </section>`
})
export class MarketingDashboard {}
