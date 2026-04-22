import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

const AVATAR_DOC = `**Avatar** (\`p-avatar\`) shows a label fallback, icon, or image for people or entities. **AvatarGroup** (\`p-avatargroup\`) stacks multiple avatars for “who’s here” summaries.

Controls map to the standalone avatar story; named variants cover image, icon, stacked groups, and a full size matrix.`;

type AvatarSize = 'normal' | 'large' | 'xlarge';
type AvatarShape = 'circle' | 'square';

interface AvatarStoryArgs {
    label: string;
    icon: string;
    image: string;
    size: AvatarSize;
    shape: AvatarShape;
    onImageError: (event: Event) => void;
}

const meta: Meta<AvatarStoryArgs> = {
    title: 'Components/DataDisplay/Avatar',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, AvatarModule, AvatarGroupModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: AVATAR_DOC
            }
        }
    },
    args: {
        label: 'UN',
        icon: '',
        image: '',
        size: 'normal',
        shape: 'circle',
        onImageError: action('onImageError')
    },
    argTypes: {
        label: { control: 'text' },
        icon: { control: 'text' },
        image: { control: 'text' },
        size: {
            control: 'select',
            options: ['normal', 'large', 'xlarge']
        },
        shape: {
            control: 'select',
            options: ['square', 'circle']
        },
        onImageError: { control: false }
    },
    render: (args) => ({
        props: args,
        template: `
<p-avatar
  [label]="label"
  [icon]="icon ? icon : undefined"
  [image]="image ? image : undefined"
  [size]="size"
  [shape]="shape"
  (onImageError)="onImageError($event)"
/>
        `
    })
};

export default meta;
type Story = StoryObj<AvatarStoryArgs>;

export const Default: Story = {
    args: {
        label: 'UN',
        shape: 'circle',
        size: 'normal'
    }
};

export const WithImage: Story = {
    args: {
        label: '',
        image: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
        shape: 'circle',
        size: 'large'
    }
};

export const WithIcon: Story = {
    args: {
        label: '',
        icon: 'pi pi-user',
        shape: 'square',
        size: 'xlarge'
    }
};

export const AvatarGroup: Story = {
    argTypes: {
        label: { table: { disable: true } },
        icon: { table: { disable: true } },
        image: { table: { disable: true } },
        size: { table: { disable: true } },
        shape: { table: { disable: true } }
    },
    render: (args) => ({
        props: args,
        template: `
<p-avatargroup>
  <p-avatar label="AE" shape="circle" styleClass="!bg-primary !text-primary-contrast" />
  <p-avatar label="BF" shape="circle" styleClass="!bg-highlight !text-highlight-contrast" />
  <p-avatar label="CJ" shape="circle" styleClass="!bg-green-500 !text-white" />
  <p-avatar icon="pi pi-plus" shape="circle" styleClass="!bg-surface-200 dark:!bg-surface-700" />
</p-avatargroup>
        `
    })
};

/** Matrix of size × shape for quick visual QA. */
export const AllVariants: Story = {
    argTypes: {
        label: { table: { disable: true } },
        icon: { table: { disable: true } },
        image: { table: { disable: true } },
        size: { table: { disable: true } },
        shape: { table: { disable: true } }
    },
    render: (args) => ({
        props: {
            ...args,
            sizes: ['normal', 'large', 'xlarge'] as AvatarSize[],
            shapes: ['square', 'circle'] as AvatarShape[]
        },
        template: `
<div class="flex flex-col gap-6">
  <div *ngFor="let size of sizes" class="flex flex-col gap-2">
    <span class="text-sm font-medium capitalize">{{ size }}</span>
    <div class="flex flex-wrap items-end gap-4">
      <div *ngFor="let shape of shapes" class="flex flex-col items-center gap-1">
        <p-avatar [label]="size[0] + (shape === 'circle' ? 'C' : 'S')" [size]="size" [shape]="shape" />
        <span class="text-xs text-muted-color">{{ shape }}</span>
      </div>
    </div>
  </div>
</div>
        `
    })
};

/** Edge case: invalid image URL falls back to label behavior; watch Actions for \`onImageError\`. */
export const BrokenImageFallback: Story = {
    args: {
        label: 'ERR',
        image: 'https://example.invalid/not-a-real-image.png',
        icon: '',
        shape: 'circle',
        size: 'normal'
    }
};
