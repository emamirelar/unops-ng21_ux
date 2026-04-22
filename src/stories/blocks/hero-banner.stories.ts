import type { Meta, StoryObj } from '@storybook/angular';
import { HeroWidget } from '@/app/pages/landing/components/herowidget';

const meta: Meta<HeroWidget> = {
    title: 'Blocks/Landing/HeroBanner',
    component: HeroWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Classic hero section: large headline, supporting text, primary call-to-action button, and a large product screenshot image with a customer logo strip below.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<HeroWidget>;
export const Default: Story = {};
