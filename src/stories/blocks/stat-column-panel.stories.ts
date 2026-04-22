import type { Meta, StoryObj } from '@storybook/angular';
import { StatCardWidget } from '@/app/pages/dashboards/marketing/components/statcardwidget';

const meta: Meta<StatCardWidget> = {
    title: 'Blocks/Metrics/StatColumnPanel',
    component: StatCardWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Three-column layout of stat blocks separated by dividers, each showing a title, large number, colored percent pill, dropdown control, and a filled area line chart.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<StatCardWidget>;
export const Default: Story = {};
