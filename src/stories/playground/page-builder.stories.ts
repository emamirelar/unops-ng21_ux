import type { Meta, StoryObj } from '@storybook/angular';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { moduleMetadata } from '@storybook/angular';

import { OpportunityStatCardWidget } from '@/app/pages/dashboards/dashboard/components/opportunitystatcardwidget';
import { OpportunityTrendsWidget } from '@/app/pages/dashboards/dashboard/components/opportunitytrendswidget';
import { OpportunityPipelineWidget } from '@/app/pages/dashboards/dashboard/components/opportunitypipelinewidget';
import { PipelineHealthWidget } from '@/app/pages/dashboards/dashboard/components/pipelinehealthwidget';
import { RecentOpportunitiesWidget } from '@/app/pages/dashboards/dashboard/components/recentopportunitieswidget';
import { StatCardWidget } from '@/app/pages/dashboards/marketing/components/statcardwidget';
import { SalesOverviewWidget } from '@/app/pages/dashboards/marketing/components/salesoverviewwidget';
import { FollowerAnalyticsWidget } from '@/app/pages/dashboards/marketing/components/followeranalyticswidget';
import { OrderHistoryWidget } from '@/app/pages/dashboards/marketing/components/orderhistorywidget';
import { OverviewWidget } from '@/app/pages/dashboards/ecommerce/components/overviewwidget';
import { OrdersWidget } from '@/app/pages/dashboards/ecommerce/components/orderswidget';
import { MiniStatCardWidget } from '@/app/pages/dashboards/ecommerce/components/ministatcardwidget';
import { TransactionsHistoryWidget } from '@/app/pages/dashboards/banking/components/transactionshistorywidget';
import { IncomeExpenditureWidget } from '@/app/pages/dashboards/banking/components/incomeexpenditurewidget';
import { SpendingLimitWidget } from '@/app/pages/dashboards/banking/components/spendinglimitwidget';
import { CreditScoreWidget } from '@/app/pages/dashboards/banking/components/creditscorewidget';
import { CurrencyCardWidget } from '@/app/pages/dashboards/banking/components/currencycardwidget';

const BLOCK_COMPONENTS = [
    OpportunityStatCardWidget,
    OpportunityTrendsWidget,
    OpportunityPipelineWidget,
    PipelineHealthWidget,
    RecentOpportunitiesWidget,
    StatCardWidget,
    SalesOverviewWidget,
    FollowerAnalyticsWidget,
    OrderHistoryWidget,
    OverviewWidget,
    OrdersWidget,
    MiniStatCardWidget,
    TransactionsHistoryWidget,
    IncomeExpenditureWidget,
    SpendingLimitWidget,
    CreditScoreWidget,
    CurrencyCardWidget
];

type SlotOption =
    | 'none'
    | 'StatCardGrid'
    | 'StatColumnPanel'
    | 'MeterCardRow'
    | 'CompactStatCardGrid'
    | 'TrendLinePanel'
    | 'OverviewLinePanel'
    | 'ComparisonLinePanel'
    | 'CategoryBarPanel'
    | 'SegmentedMeterStack'
    | 'GaugeMetricsPanel'
    | 'BudgetMeterPanel'
    | 'MetricMeterPanel'
    | 'GaugeTablePanel'
    | 'StatusDataTable'
    | 'SearchableDataTable'
    | 'AvatarDataTable'
    | 'ItemListPanel';

const SLOT_OPTIONS: SlotOption[] = [
    'none',
    'StatCardGrid',
    'StatColumnPanel',
    'MeterCardRow',
    'CompactStatCardGrid',
    'TrendLinePanel',
    'OverviewLinePanel',
    'ComparisonLinePanel',
    'CategoryBarPanel',
    'SegmentedMeterStack',
    'GaugeMetricsPanel',
    'BudgetMeterPanel',
    'MetricMeterPanel',
    'GaugeTablePanel',
    'StatusDataTable',
    'SearchableDataTable',
    'AvatarDataTable',
    'ItemListPanel'
];

@Component({
    selector: 'sb-page-builder',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ...BLOCK_COMPONENTS],
    template: `
        <div class="flex flex-col gap-6">
            <div class="flex items-center gap-4">
                <div class="flex flex-col gap-1">
                    <h1 class="text-deepsea-500 dark:text-surface-0 text-2xl font-extrabold leading-8 m-0">{{ pageTitle }}</h1>
                    @if (pageSubtitle) {
                        <p class="text-surface-600 dark:text-surface-300 text-sm m-0">{{ pageSubtitle }}</p>
                    }
                </div>
            </div>

            @if (header !== 'none') {
                <div class="w-full">
                    <ng-container [ngSwitch]="header">
                        <opportunity-stat-card-widget *ngSwitchCase="'StatCardGrid'" />
                        <stat-card-widget *ngSwitchCase="'StatColumnPanel'" />
                        <mini-stat-card-widget *ngSwitchCase="'MeterCardRow'" />
                        <currency-card-widget *ngSwitchCase="'CompactStatCardGrid'" />
                        <opportunity-trends-widget *ngSwitchCase="'TrendLinePanel'" />
                        <sales-overview-widget *ngSwitchCase="'OverviewLinePanel'" />
                        <income-expenditure-widget *ngSwitchCase="'ComparisonLinePanel'" />
                        <overview-widget *ngSwitchCase="'CategoryBarPanel'" />
                        <opportunity-pipeline-widget *ngSwitchCase="'SegmentedMeterStack'" />
                        <pipeline-health-widget *ngSwitchCase="'GaugeMetricsPanel'" />
                        <spending-limit-widget *ngSwitchCase="'BudgetMeterPanel'" />
                        <follower-analytics-widget *ngSwitchCase="'MetricMeterPanel'" />
                        <credit-score-widget *ngSwitchCase="'GaugeTablePanel'" />
                        <recent-opportunities-widget *ngSwitchCase="'StatusDataTable'" />
                        <order-history-widget *ngSwitchCase="'SearchableDataTable'" />
                        <transactions-history-widget *ngSwitchCase="'AvatarDataTable'" />
                        <orders-widget *ngSwitchCase="'ItemListPanel'" />
                    </ng-container>
                </div>
            }

            <div class="flex flex-col xl:flex-row gap-6 w-full">
                @if (content !== 'none') {
                    <div class="w-full flex-1 min-w-0">
                        <ng-container [ngSwitch]="content">
                            <opportunity-stat-card-widget *ngSwitchCase="'StatCardGrid'" />
                            <stat-card-widget *ngSwitchCase="'StatColumnPanel'" />
                            <mini-stat-card-widget *ngSwitchCase="'MeterCardRow'" />
                            <currency-card-widget *ngSwitchCase="'CompactStatCardGrid'" />
                            <opportunity-trends-widget *ngSwitchCase="'TrendLinePanel'" />
                            <sales-overview-widget *ngSwitchCase="'OverviewLinePanel'" />
                            <income-expenditure-widget *ngSwitchCase="'ComparisonLinePanel'" />
                            <overview-widget *ngSwitchCase="'CategoryBarPanel'" />
                            <opportunity-pipeline-widget *ngSwitchCase="'SegmentedMeterStack'" />
                            <pipeline-health-widget *ngSwitchCase="'GaugeMetricsPanel'" />
                            <spending-limit-widget *ngSwitchCase="'BudgetMeterPanel'" />
                            <follower-analytics-widget *ngSwitchCase="'MetricMeterPanel'" />
                            <credit-score-widget *ngSwitchCase="'GaugeTablePanel'" />
                            <recent-opportunities-widget *ngSwitchCase="'StatusDataTable'" />
                            <order-history-widget *ngSwitchCase="'SearchableDataTable'" />
                            <transactions-history-widget *ngSwitchCase="'AvatarDataTable'" />
                            <orders-widget *ngSwitchCase="'ItemListPanel'" />
                        </ng-container>
                    </div>
                }

                @if (sidebar !== 'none') {
                    <div class="xl:w-[380px] shrink-0">
                        <ng-container [ngSwitch]="sidebar">
                            <opportunity-stat-card-widget *ngSwitchCase="'StatCardGrid'" />
                            <stat-card-widget *ngSwitchCase="'StatColumnPanel'" />
                            <mini-stat-card-widget *ngSwitchCase="'MeterCardRow'" />
                            <currency-card-widget *ngSwitchCase="'CompactStatCardGrid'" />
                            <opportunity-trends-widget *ngSwitchCase="'TrendLinePanel'" />
                            <sales-overview-widget *ngSwitchCase="'OverviewLinePanel'" />
                            <income-expenditure-widget *ngSwitchCase="'ComparisonLinePanel'" />
                            <overview-widget *ngSwitchCase="'CategoryBarPanel'" />
                            <opportunity-pipeline-widget *ngSwitchCase="'SegmentedMeterStack'" />
                            <pipeline-health-widget *ngSwitchCase="'GaugeMetricsPanel'" />
                            <spending-limit-widget *ngSwitchCase="'BudgetMeterPanel'" />
                            <follower-analytics-widget *ngSwitchCase="'MetricMeterPanel'" />
                            <credit-score-widget *ngSwitchCase="'GaugeTablePanel'" />
                            <recent-opportunities-widget *ngSwitchCase="'StatusDataTable'" />
                            <order-history-widget *ngSwitchCase="'SearchableDataTable'" />
                            <transactions-history-widget *ngSwitchCase="'AvatarDataTable'" />
                            <orders-widget *ngSwitchCase="'ItemListPanel'" />
                        </ng-container>
                    </div>
                }
            </div>

            @if (footer !== 'none') {
                <div class="w-full">
                    <ng-container [ngSwitch]="footer">
                        <opportunity-stat-card-widget *ngSwitchCase="'StatCardGrid'" />
                        <stat-card-widget *ngSwitchCase="'StatColumnPanel'" />
                        <mini-stat-card-widget *ngSwitchCase="'MeterCardRow'" />
                        <currency-card-widget *ngSwitchCase="'CompactStatCardGrid'" />
                        <opportunity-trends-widget *ngSwitchCase="'TrendLinePanel'" />
                        <sales-overview-widget *ngSwitchCase="'OverviewLinePanel'" />
                        <income-expenditure-widget *ngSwitchCase="'ComparisonLinePanel'" />
                        <overview-widget *ngSwitchCase="'CategoryBarPanel'" />
                        <opportunity-pipeline-widget *ngSwitchCase="'SegmentedMeterStack'" />
                        <pipeline-health-widget *ngSwitchCase="'GaugeMetricsPanel'" />
                        <spending-limit-widget *ngSwitchCase="'BudgetMeterPanel'" />
                        <follower-analytics-widget *ngSwitchCase="'MetricMeterPanel'" />
                        <credit-score-widget *ngSwitchCase="'GaugeTablePanel'" />
                        <recent-opportunities-widget *ngSwitchCase="'StatusDataTable'" />
                        <order-history-widget *ngSwitchCase="'SearchableDataTable'" />
                        <transactions-history-widget *ngSwitchCase="'AvatarDataTable'" />
                        <orders-widget *ngSwitchCase="'ItemListPanel'" />
                    </ng-container>
                </div>
            }
        </div>
    `
})
class PageBuilderComponent {
    @Input() pageTitle = 'Page Title';
    @Input() pageSubtitle = '';
    @Input() header: SlotOption = 'none';
    @Input() content: SlotOption = 'none';
    @Input() sidebar: SlotOption = 'none';
    @Input() footer: SlotOption = 'none';
}

const slotArgType = {
    control: 'select' as const,
    options: SLOT_OPTIONS,
    description: 'Block to render in this slot. Choose "none" to leave empty.'
};

const meta: Meta<PageBuilderComponent> = {
    title: 'Playground/PageBuilder',
    component: PageBuilderComponent,
    argTypes: {
        pageTitle: { control: 'text', description: 'Page heading text' },
        pageSubtitle: { control: 'text', description: 'Optional subtitle below the heading' },
        header: { ...slotArgType, description: 'Full-width block above the main content area.' },
        content: { ...slotArgType, description: 'Primary content area (left/main column).' },
        sidebar: { ...slotArgType, description: 'Sidebar content area (right column on xl+).' },
        footer: { ...slotArgType, description: 'Full-width block below the main content area.' }
    },
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Interactive page composer. Use the Controls panel to select blocks for each layout slot ' +
                    '(header, content, sidebar, footer) and build a page layout live. ' +
                    'The layout uses the same flex/grid structure as the Opportunity and Agreements pages.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<PageBuilderComponent>;

export const Blank: Story = {
    args: {
        pageTitle: 'New Page',
        pageSubtitle: 'Start composing by selecting blocks in the Controls panel.',
        header: 'none',
        content: 'none',
        sidebar: 'none',
        footer: 'none'
    }
};

export const OpportunityLike: Story = {
    args: {
        pageTitle: 'Water Sanitization',
        pageSubtitle: '',
        header: 'none',
        content: 'StatusDataTable',
        sidebar: 'GaugeMetricsPanel',
        footer: 'none'
    }
};

export const AgreementsLike: Story = {
    args: {
        pageTitle: 'Partnership Agreements',
        pageSubtitle: '',
        header: 'StatCardGrid',
        content: 'SearchableDataTable',
        sidebar: 'none',
        footer: 'none'
    }
};

export const AnalyticsDashboard: Story = {
    args: {
        pageTitle: 'Analytics Dashboard',
        pageSubtitle: 'Key performance metrics and trends.',
        header: 'StatCardGrid',
        content: 'TrendLinePanel',
        sidebar: 'SegmentedMeterStack',
        footer: 'StatusDataTable'
    }
};
