import type { Meta, StoryObj } from '@storybook/angular';
import { TopbarWidget } from '@/app/pages/landing/components/topbarwidget';

interface LandingTopbarStoryArgs {
    class: string;
}

const meta: Meta<LandingTopbarStoryArgs> = {
    title: 'Blocks/Landing/LandingTopbar',
    component: TopbarWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Fixed navigation bar with logo, inline navigation links, authentication buttons, and a slide-down mobile menu.'
            }
        }
    },
    args: {
        class: ''
    },
    argTypes: {
        class: {
            control: 'text',
            name: 'class',
            description: 'Optional class string bound to the root section element.'
        }
    }
};

export default meta;
type Story = StoryObj<LandingTopbarStoryArgs>;

export const Default: Story = {};
