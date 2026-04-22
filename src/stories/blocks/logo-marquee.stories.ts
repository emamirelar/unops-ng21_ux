import type { Meta, StoryObj } from '@storybook/angular';
import { CustomersLogoWidget } from '@/app/pages/landing/components/customerslogowidget';

const meta: Meta<CustomersLogoWidget> = {
    title: 'Blocks/Landing/LogoMarquee',
    component: CustomersLogoWidget,
    parameters: {
        docs: {
            description: {
                component: 'Infinite-scroll horizontal strip of partner/customer logos using CSS animation.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<CustomersLogoWidget>;
export const Default: Story = {};
