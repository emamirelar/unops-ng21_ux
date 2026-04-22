import type { Meta, StoryObj } from '@storybook/angular';
import { ContactAdressWidget } from '@/app/pages/landing/components/contact/contactadresswidget';

const meta: Meta<ContactAdressWidget> = {
    title: 'Blocks/Landing/LocationCardGrid',
    component: ContactAdressWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Grid of location cards, each showing an image, location title, address block, and phone number.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<ContactAdressWidget>;
export const Default: Story = {};
