import type { Meta, StoryObj } from '@storybook/angular';
import { SpendingLimitWidget } from '@/app/pages/dashboards/banking/components/spendinglimitwidget';

const meta: Meta<SpendingLimitWidget> = {
    title: 'Blocks/Gauges/BudgetMeterPanel',
    component: SpendingLimitWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with month dropdowns and two custom meter areas: an overall progress-style meter and a second grouped by categories with stacked vertical bars and labels.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SpendingLimitWidget>;
export const Default: Story = {};
