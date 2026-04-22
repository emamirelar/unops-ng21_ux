import type { Meta, StoryObj } from '@storybook/angular';
import { FeaturesSectionOneWidget } from '@/app/pages/landing/components/features/featuressectiononewidget';

const meta: Meta<FeaturesSectionOneWidget> = {
    title: 'Blocks/Landing/FeatureDetailLeft',
    component: FeaturesSectionOneWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Two-column layout with overlapping UI card images on the left and text with badge, bullet points, and feature list on the right.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<FeaturesSectionOneWidget>;
export const Default: Story = {};
