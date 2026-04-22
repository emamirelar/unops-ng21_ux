import type { Meta, StoryObj } from '@storybook/angular';
import { CtaWidget } from '@/app/pages/landing/components/ctawidget';

const meta: Meta<CtaWidget> = {
    title: 'Blocks/Landing/CallToActionBand',
    component: CtaWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Full-width call-to-action band with headline text, two action buttons, and a decorative background with overlaid UI imagery.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<CtaWidget>;
export const Default: Story = {};
