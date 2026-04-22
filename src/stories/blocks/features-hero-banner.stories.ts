import type { Meta, StoryObj } from '@storybook/angular';
import { FeaturesHeroWidget } from '@/app/pages/landing/components/features/featuresherowidget';

const meta: Meta<FeaturesHeroWidget> = {
    title: 'Blocks/Landing/FeaturesHeroBanner',
    component: FeaturesHeroWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Features page hero section with headline, supporting text, call-to-action button, and overlapping dashboard imagery collage.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<FeaturesHeroWidget>;
export const Default: Story = {};
