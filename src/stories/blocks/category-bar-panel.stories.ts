import type { Meta, StoryObj } from '@storybook/angular';
import { OverviewWidget } from '@/app/pages/dashboards/ecommerce/components/overviewwidget';

const meta: Meta<OverviewWidget> = {
    title: 'Blocks/Charts/CategoryBarPanel',
    component: OverviewWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a title row and time-range control, containing a categorical bar chart.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<OverviewWidget>;
export const Default: Story = {};
