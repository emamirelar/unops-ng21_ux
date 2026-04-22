import type { Meta, StoryObj } from '@storybook/angular';
import { FaqWidget } from '@/app/pages/landing/components/faqwidget';

const meta: Meta<FaqWidget> = {
    title: 'Blocks/Landing/FaqAccordion',
    component: FaqWidget,
    parameters: {
        docs: {
            description: {
                component: 'Section title followed by an accordion list of expandable question-and-answer items.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<FaqWidget>;
export const Default: Story = {};
