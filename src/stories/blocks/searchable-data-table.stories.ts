import type { Meta, StoryObj } from '@storybook/angular';
import { OrderHistoryWidget } from '@/app/pages/dashboards/marketing/components/orderhistorywidget';

const meta: Meta<OrderHistoryWidget> = {
    title: 'Blocks/Tables/SearchableDataTable',
    component: OrderHistoryWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Header with title, search field, filter and export buttons; below, a wide selectable data table with checkbox column, multiple text columns, avatar cells, status pills, row actions, and pagination.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<OrderHistoryWidget>;
export const Default: Story = {};
