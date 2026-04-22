import type { Meta, StoryObj } from '@storybook/angular';
import { OpportunityPipelineWidget } from '@/app/pages/dashboards/dashboard/components/opportunitypipelinewidget';

const meta: Meta<OpportunityPipelineWidget> = {
    title: 'Blocks/Gauges/SegmentedMeterStack',
    component: OpportunityPipelineWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Single card split by a horizontal divider into two stacked sections, each with a section title and a horizontal segmented meter bar with end-aligned labels, plus a full-width action button.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<OpportunityPipelineWidget>;
export const Default: Story = {};
