import type { Meta, StoryObj } from '@storybook/angular';
import { ContactHeroWidget } from '@/app/pages/landing/components/contact/contactherowidget';

const meta: Meta<ContactHeroWidget> = {
    title: 'Blocks/Landing/ContactSplitForm',
    component: ContactHeroWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Split hero section with contact details and social links on the left, and a multi-field contact form on the right.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<ContactHeroWidget>;
export const Default: Story = {};
