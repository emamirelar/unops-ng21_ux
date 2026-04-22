import type { Meta, StoryObj } from '@storybook/angular';
import { IncomeExpenditureWidget } from '@/app/pages/dashboards/banking/components/incomeexpenditurewidget';

const meta: Meta<IncomeExpenditureWidget> = {
    title: 'Blocks/Charts/ComparisonLinePanel',
    component: IncomeExpenditureWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a title and time-range toggle button group, containing a two-series comparison line chart.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<IncomeExpenditureWidget>;
export const Default: Story = {};
