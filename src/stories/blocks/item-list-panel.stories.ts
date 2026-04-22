import type { Meta, StoryObj } from '@storybook/angular';
import { OrdersWidget } from '@/app/pages/dashboards/ecommerce/components/orderswidget';

const meta: Meta<OrdersWidget> = {
    title: 'Blocks/Tables/ItemListPanel',
    component: OrdersWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a title and chevron "see all" button, containing a vertical list of rows with thumbnails, title and date text, status pills, and small identifiers, separated by dividers.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<OrdersWidget>;
export const Default: Story = {};
