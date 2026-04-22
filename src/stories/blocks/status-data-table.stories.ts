import type { Meta, StoryObj } from '@storybook/angular';
import { RecentOpportunitiesWidget } from '@/app/pages/dashboards/dashboard/components/recentopportunitieswidget';

const meta: Meta<RecentOpportunitiesWidget> = {
    title: 'Blocks/Tables/StatusDataTable',
    component: RecentOpportunitiesWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a title row, subtitle, and outline "see all" button, containing a wide data table with header row, text cells, status pills, and trailing row menu icons.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<RecentOpportunitiesWidget>;
export const Default: Story = {};
