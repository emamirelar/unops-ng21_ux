import type { Meta, StoryObj } from '@storybook/angular';
import { CreditScoreWidget } from '@/app/pages/dashboards/banking/components/creditscorewidget';

const meta: Meta<CreditScoreWidget> = {
    title: 'Blocks/Gauges/GaugeTablePanel',
    component: CreditScoreWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a semi-circular gradient gauge and centered score label, followed by a list of tabular rows showing amounts, rates, installments, and payoff values.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<CreditScoreWidget>;
export const Default: Story = {};
