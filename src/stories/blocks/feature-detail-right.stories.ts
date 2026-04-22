import type { Meta, StoryObj } from '@storybook/angular';
import { FeaturesSectionTwoWidget } from '@/app/pages/landing/components/features/featuressectiontwowidget';

const meta: Meta<FeaturesSectionTwoWidget> = {
    title: 'Blocks/Landing/FeatureDetailRight',
    component: FeaturesSectionTwoWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Mirrored two-column section with text and bullet points on the left and an image stack on the right.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<FeaturesSectionTwoWidget>;
export const Default: Story = {};
