import type { Meta, StoryObj } from '@storybook/angular';
import { ComingSoon } from '@/app/apps/coming-soon/coming-soon';

const meta: Meta<ComingSoon> = {
    title: 'Pages/ComingSoon',
    component: ComingSoon,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Placeholder page for features under construction. Centered message with icon indicating the feature is in progress.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<ComingSoon>;

export const Default: Story = {};
