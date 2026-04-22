import type { Meta, StoryObj } from '@storybook/angular';
import { PricingCompareWidget } from '@/app/pages/landing/components/pricing/pricingcomparewidget';

const meta: Meta<PricingCompareWidget> = {
    title: 'Blocks/Landing/PricingComparisonTable',
    component: PricingCompareWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Feature comparison table with plan columns showing check and minus icons for each feature row.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<PricingCompareWidget>;
export const Default: Story = {};
