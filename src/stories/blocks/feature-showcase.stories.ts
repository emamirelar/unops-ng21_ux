import type { Meta, StoryObj } from '@storybook/angular';
import { SectionThreeWidget } from '@/app/pages/landing/components/sectionthreewidget';

const meta: Meta<SectionThreeWidget> = {
    title: 'Blocks/Landing/FeatureShowcase',
    component: SectionThreeWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Centered heading block with a large animated hero visual, followed by a multi-column grid of small feature blocks with icons and descriptive text.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SectionThreeWidget>;
export const Default: Story = {};
