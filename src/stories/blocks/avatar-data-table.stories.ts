import type { Meta, StoryObj } from '@storybook/angular';
import { TransactionsHistoryWidget } from '@/app/pages/dashboards/banking/components/transactionshistorywidget';

const meta: Meta<TransactionsHistoryWidget> = {
    title: 'Blocks/Tables/AvatarDataTable',
    component: TransactionsHistoryWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Paginated data table with avatar+name cells, date column, color-coded amount styling, account column, and row action menus.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<TransactionsHistoryWidget>;
export const Default: Story = {};
