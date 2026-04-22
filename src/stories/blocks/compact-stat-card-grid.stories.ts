import type { Meta, StoryObj } from '@storybook/angular';
import { CurrencyCardWidget } from '@/app/pages/dashboards/banking/components/currencycardwidget';

const meta: Meta<CurrencyCardWidget> = {
    title: 'Blocks/Metrics/CompactStatCardGrid',
    component: CurrencyCardWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Grid of four compact cards each showing a code label, masked number line, large value, percent chip, and a mini sparkline.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<CurrencyCardWidget>;
export const Default: Story = {};
