import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { SkeletonModule } from 'primeng/skeleton';

const PROGRESS_DOC = `**ProgressBar** communicates completion (determinate) or ongoing work (indeterminate). **Skeleton** provides placeholder shapes while content loads.

Use Controls for bar \`value\`, \`showValue\`, and \`mode\`; skeleton layouts are shown in named stories so object props stay out of noisy Controls.`;

type ProgressMode = 'determinate' | 'indeterminate';

interface ProgressStoryArgs {
    value: number;
    showValue: boolean;
    mode: ProgressMode;
}

const meta: Meta<ProgressStoryArgs> = {
    title: 'Components/DataDisplay/Progress',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ProgressBarModule, SkeletonModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: PROGRESS_DOC
            }
        }
    },
    args: {
        value: 45,
        showValue: true,
        mode: 'determinate'
    },
    argTypes: {
        value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
        showValue: { control: 'boolean' },
        mode: {
            control: 'select',
            options: ['determinate', 'indeterminate']
        }
    },
    render: (args) => ({
        props: args,
        template: `
<p-progressbar [value]="value" [showValue]="showValue" [mode]="mode" />
        `
    })
};

export default meta;
type Story = StoryObj<ProgressStoryArgs>;

export const Default: Story = {};

export const Indeterminate: Story = {
    args: {
        mode: 'indeterminate',
        value: 0
    }
};

/** Several skeleton primitives in one view (no object Controls). */
export const SkeletonLoading: Story = {
    argTypes: {
        value: { table: { disable: true } },
        showValue: { table: { disable: true } },
        mode: { table: { disable: true } }
    },
    render: () => ({
        template: `
<div class="flex flex-col gap-6 max-w-md">
  <div class="flex gap-3 items-center">
    <p-skeleton shape="circle" size="3rem" />
    <div class="flex flex-col gap-2 flex-1">
      <p-skeleton width="10rem" height="1rem" />
      <p-skeleton width="6rem" height="0.75rem" />
    </div>
  </div>
  <p-skeleton height="8rem" />
  <div class="flex gap-2">
    <p-skeleton width="5rem" height="2rem" borderRadius="4px" />
    <p-skeleton width="5rem" height="2rem" borderRadius="4px" />
  </div>
</div>
        `
    })
};

/** Default + indeterminate + skeleton together for documentation “all variants”. */
export const AllVariants: Story = {
    argTypes: {
        value: { table: { disable: true } },
        showValue: { table: { disable: true } },
        mode: { table: { disable: true } }
    },
    render: () => ({
        template: `
<div class="flex flex-col gap-8 max-w-lg">
  <div>
    <div class="text-sm font-medium mb-2">Determinate 62%</div>
    <p-progressbar [value]="62" [showValue]="true" mode="determinate" />
  </div>
  <div>
    <div class="text-sm font-medium mb-2">Indeterminate</div>
    <p-progressbar mode="indeterminate" />
  </div>
  <div>
    <div class="text-sm font-medium mb-2">Skeleton row</div>
    <div class="flex gap-3">
      <p-skeleton size="3rem" shape="circle" />
      <div class="flex-1 flex flex-col gap-2">
        <p-skeleton height="1rem" class="w-full" />
        <p-skeleton height="0.75rem" class="w-4/5" />
      </div>
    </div>
  </div>
</div>
        `
    })
};

/** Edge case: zero progress should still render a visible track. */
export const ZeroProgress: Story = {
    args: {
        value: 0,
        showValue: true,
        mode: 'determinate'
    }
};
