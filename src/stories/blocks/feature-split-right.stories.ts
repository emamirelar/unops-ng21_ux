import type { Meta, StoryObj } from '@storybook/angular';
import { SectionTwoWidget } from '@/app/pages/landing/components/sectiontwowidget';

const meta: Meta<SectionTwoWidget> = {
    title: 'Blocks/Landing/FeatureSplitRight',
    component: SectionTwoWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Two-column marketing section with text, bullet list, and CTA button on the left, and an image collage on the right.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SectionTwoWidget>;
export const Default: Story = {};
