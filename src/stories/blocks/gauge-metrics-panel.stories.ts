import type { Meta, StoryObj } from '@storybook/angular';
import { PipelineHealthWidget } from '@/app/pages/dashboards/dashboard/components/pipelinehealthwidget';

const meta: Meta<PipelineHealthWidget> = {
    title: 'Blocks/Gauges/GaugeMetricsPanel',
    component: PipelineHealthWidget,
    parameters: {
        docs: {
            description: {
                component:
                    'Card with a header row and menu icon, a large semi-circular gauge with centered numeric label, a bordered metrics panel of label/value rows separated by dividers, and a full-width action button.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<PipelineHealthWidget>;
export const Default: Story = {};
