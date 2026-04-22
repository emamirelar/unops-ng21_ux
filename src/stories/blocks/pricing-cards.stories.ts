import type { Meta, StoryObj } from '@storybook/angular';
import { PricingHeroWidget } from '@/app/pages/landing/components/pricing/pricingherowidget';

const meta: Meta<PricingHeroWidget> = {
    title: 'Blocks/Landing/PricingCards',
    component: PricingHeroWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Pricing section header with a billing frequency toggle and three vertical pricing tier cards, each with feature bullet lists and action buttons.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<PricingHeroWidget>;
export const Default: Story = {};
