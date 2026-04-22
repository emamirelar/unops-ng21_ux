import type { Meta, StoryObj } from '@storybook/angular';
import { FollowerAnalyticsWidget } from '@/app/pages/dashboards/marketing/components/followeranalyticswidget';

const meta: Meta<FollowerAnalyticsWidget> = {
    title: 'Blocks/Gauges/MetricMeterPanel',
    component: FollowerAnalyticsWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Vertical stack: branded icon tile with dropdown, headline number with colored percent pill and comparison line, horizontal segmented meter, and a full-width action button.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<FollowerAnalyticsWidget>;
export const Default: Story = {};
