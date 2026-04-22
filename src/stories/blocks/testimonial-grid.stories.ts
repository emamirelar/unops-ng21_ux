import type { Meta, StoryObj } from '@storybook/angular';
import { TestimonialWidget } from '@/app/pages/landing/components/testimonialwidget';

const meta: Meta<TestimonialWidget> = {
    title: 'Blocks/Landing/TestimonialGrid',
    component: TestimonialWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Introduction heading with responsive multi-column grid of testimonial quote cards and action buttons.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<TestimonialWidget>;
export const Default: Story = {};
