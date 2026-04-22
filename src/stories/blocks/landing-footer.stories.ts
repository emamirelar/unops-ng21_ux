import type { Meta, StoryObj } from '@storybook/angular';
import { FooterWidget } from '@/app/pages/landing/components/footerwidget';

const meta: Meta<FooterWidget> = {
    title: 'Blocks/Landing/LandingFooter',
    component: FooterWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Footer section with logo, organized link column groups, social media icons, and a copyright line.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<FooterWidget>;
export const Default: Story = {};
