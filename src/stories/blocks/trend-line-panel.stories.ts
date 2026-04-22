import type { Meta, StoryObj } from '@storybook/angular';
import { OpportunityTrendsWidget } from '@/app/pages/dashboards/dashboard/components/opportunitytrendswidget';

const meta: Meta<OpportunityTrendsWidget> = {
    title: 'Blocks/Charts/TrendLinePanel',
    component: OpportunityTrendsWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a title and pill-style time-range toggle, containing a wide multi-series line chart.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<OpportunityTrendsWidget>;
export const Default: Story = {};
