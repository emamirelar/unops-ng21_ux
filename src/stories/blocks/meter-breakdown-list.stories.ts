import type { Meta, StoryObj } from '@storybook/angular';
import { SocialMediaUsersWidget } from '@/app/pages/dashboards/ecommerce/components/socialmediauserswidget';

const meta: Meta<SocialMediaUsersWidget> = {
    title: 'Blocks/Gauges/MeterBreakdownList',
    component: SocialMediaUsersWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Compact panel with a headline number, percent change pill, horizontal meter, and an icon-labeled breakdown list. Variant of MeterBreakdownPanel with different styling emphasis.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<SocialMediaUsersWidget>;
export const Default: Story = {};
