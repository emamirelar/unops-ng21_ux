import { MiniStatCardWidget } from '@/app/pages/dashboards/ecommerce/components/ministatcardwidget';
import { OrdersWidget } from '@/app/pages/dashboards/ecommerce/components/orderswidget';
import { OverviewWidget } from '@/app/pages/dashboards/ecommerce/components/overviewwidget';
import { SocialMediaRevenueWidget } from '@/app/pages/dashboards/ecommerce/components/socialmediarevenuewidget';
import { SocialMediaUsersWidget } from '@/app/pages/dashboards/ecommerce/components/socialmediauserswidget';
import { Component } from '@angular/core';

@Component({
    selector: 'app-ecommerce-dashboard',
    standalone: true,
    imports: [SocialMediaUsersWidget, MiniStatCardWidget, OverviewWidget, OrdersWidget, SocialMediaRevenueWidget],
    template: `<section class="flex flex-col gap-7">
        <div class="flex flex-wrap gap-7">
            <mini-stat-card-widget />
        </div>
        <overview-widget />
        <div class="flex flex-wrap gap-7">
            <social-media-users-widget />
            <orders-widget />
            <social-media-revenue-widget />
        </div>
    </section>`
})
export class EcommerceDashboard {}
