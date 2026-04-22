import type { Meta, StoryObj } from '@storybook/angular';
import { SalesOverviewWidget } from '@/app/pages/dashboards/marketing/components/salesoverviewwidget';

const meta: Meta<SalesOverviewWidget> = {
    title: 'Blocks/Charts/OverviewLinePanel',
    component: SalesOverviewWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Panel with a title, description, and compact dropdown, containing a multi-line trend chart.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SalesOverviewWidget>;
export const Default: Story = {};
