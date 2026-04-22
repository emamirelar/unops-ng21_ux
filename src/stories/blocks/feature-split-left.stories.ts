import type { Meta, StoryObj } from '@storybook/angular';
import { SectionOneWidget } from '@/app/pages/landing/components/sectiononewidget';

const meta: Meta<SectionOneWidget> = {
    title: 'Blocks/Landing/FeatureSplitLeft',
    component: SectionOneWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Two-column section with an image collage on the left and a text column on the right containing a badge, heading, body copy, and a primary button.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SectionOneWidget>;
export const Default: Story = {};
