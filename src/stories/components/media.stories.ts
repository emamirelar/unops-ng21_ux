import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { CommonModule } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { MOCK_TIMELINE_EVENTS } from '@/stories/data/mock';

const MEDIA_DOC = `**Timeline** visualizes ordered events with optional opposite-column metadata. **Image** supports in-place preview. This file uses \`MOCK_TIMELINE_EVENTS\` from the shared mock module.

Horizontal timelines use \`layout="horizontal"\` (PrimeNG’s API; some docs refer to this as a horizontal alignment). Templates \`#opposite\` and \`#content\` receive each \`event\` as the implicit variable.`;

type TimelineEvent = (typeof MOCK_TIMELINE_EVENTS)[number];

interface MediaStoryArgs {
    events: TimelineEvent[];
    onImageError: (event: Event) => void;
}

const meta: Meta<MediaStoryArgs> = {
    title: 'Components/DataDisplay/Media',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, TimelineModule, ImageModule, CardModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: MEDIA_DOC
            }
        }
    },
    args: {
        events: MOCK_TIMELINE_EVENTS,
        onImageError: action('onImageError')
    },
    argTypes: {
        events: { control: false },
        onImageError: { control: false }
    },
    render: (args) => ({
        props: args,
        template: `
<p-timeline [value]="events">
  <ng-template #marker let-event>
    <span
      class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
      [style.background-color]="event.color"
    >
      <i [class]="event.icon"></i>
    </span>
  </ng-template>
  <ng-template #opposite let-event>
    <small class="text-muted-color">{{ event.date }}</small>
  </ng-template>
  <ng-template #content let-event>
    <p-card [header]="event.status">
      <p class="m-0 text-sm">{{ event.detail }}</p>
    </p-card>
  </ng-template>
</p-timeline>
        `
    })
};

export default meta;
type Story = StoryObj<MediaStoryArgs>;

export const Default: Story = {
    args: {
        events: MOCK_TIMELINE_EVENTS
    }
};

/** Horizontal axis; \`layout\` is set to \`horizontal\` per PrimeNG 21. */
export const HorizontalTimeline: Story = {
    args: {
        events: MOCK_TIMELINE_EVENTS
    },
    render: (args) => ({
        props: args,
        template: `
<p-timeline [value]="events" layout="horizontal" align="top">
  <ng-template #marker let-event>
    <span
      class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
      [style.background-color]="event.color"
    >
      <i [class]="event.icon"></i>
    </span>
  </ng-template>
  <ng-template #opposite let-event>
    <small class="text-muted-color">{{ event.date }}</small>
  </ng-template>
  <ng-template #content let-event>
    <div class="font-medium">{{ event.status }}</div>
    <p class="m-0 text-sm text-muted-color max-w-xs">{{ event.detail }}</p>
  </ng-template>
</p-timeline>
        `
    })
};

export const ImagePreview: Story = {
    args: {
        events: MOCK_TIMELINE_EVENTS
    },
    argTypes: {
        events: { table: { disable: true } }
    },
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-col items-center gap-4">
  <p-image
    src="flags/us.svg"
    alt="Flag preview"
    width="200"
    [preview]="true"
    (onImageError)="onImageError($event)"
  />
</div>
        `
    })
};

/** Timeline card column plus preview image in one doc-friendly canvas. */
export const AllVariants: Story = {
    args: {
        events: MOCK_TIMELINE_EVENTS
    },
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-col gap-10">
  <section>
    <h3 class="text-lg font-semibold mb-3">Vertical timeline</h3>
    <p-timeline [value]="events" class="max-w-xl">
      <ng-template #opposite let-event>
        <small class="text-muted-color">{{ event.date }}</small>
      </ng-template>
      <ng-template #content let-event>
        <div class="font-medium">{{ event.status }}</div>
        <p class="m-0 text-sm">{{ event.detail }}</p>
      </ng-template>
    </p-timeline>
  </section>
  <section>
    <h3 class="text-lg font-semibold mb-3">Image preview</h3>
    <p-image src="flags/jp.svg" alt="Japan flag" width="160" [preview]="true" (onImageError)="onImageError($event)" />
  </section>
</div>
        `
    })
};

/** Edge case: no events still mounts the timeline shell. */
export const Empty: Story = {
    args: {
        events: []
    }
};
