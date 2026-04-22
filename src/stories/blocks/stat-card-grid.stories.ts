import type { Meta, StoryObj } from '@storybook/angular';
import { OpportunityStatCardWidget } from '@/app/pages/dashboards/dashboard/components/opportunitystatcardwidget';

const meta: Meta<OpportunityStatCardWidget> = {
    title: 'Blocks/Metrics/StatCardGrid',
    component: OpportunityStatCardWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Responsive grid of bordered mini-cards, each displaying an icon, title, large value, colored delta chip, and a sparkline chart along the bottom.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<OpportunityStatCardWidget>;
export const Default: Story = {};
