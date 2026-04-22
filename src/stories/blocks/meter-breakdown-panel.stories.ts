import type { Meta, StoryObj } from '@storybook/angular';
import { SocialMediaRevenueWidget } from '@/app/pages/dashboards/ecommerce/components/socialmediarevenuewidget';

const meta: Meta<SocialMediaRevenueWidget> = {
    title: 'Blocks/Gauges/MeterBreakdownPanel',
    component: SocialMediaRevenueWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Compact dashboard panel with a summary header and pill, horizontal segmented meter, and a breakdown list with platform icons and values.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SocialMediaRevenueWidget>;
export const Default: Story = {};
