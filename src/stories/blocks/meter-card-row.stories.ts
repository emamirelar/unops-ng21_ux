import type { Meta, StoryObj } from '@storybook/angular';
import { MiniStatCardWidget } from '@/app/pages/dashboards/ecommerce/components/ministatcardwidget';

const meta: Meta<MiniStatCardWidget> = {
    title: 'Blocks/Metrics/MeterCardRow',
    component: MiniStatCardWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Row of tall bordered cards, each containing a title, value, dropdown, clustered vertical meter bars, and a footer strip with a highlighted percentage.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<MiniStatCardWidget>;
export const Default: Story = {};
