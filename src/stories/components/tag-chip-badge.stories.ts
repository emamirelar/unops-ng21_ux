import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { ChipModule } from 'primeng/chip';
import { BadgeModule } from 'primeng/badge';
import { SEVERITY_OPTIONS, type Severity } from '@/stories/data/mock';

const TAG_DOC = `This story groups **Tag** (\`p-tag\`), **Chip** (\`p-chip\`), and **Badge** (\`p-badge\`) — small data-display primitives for status, filters, and counts.

Tag stories use shared mock **severity** options. Chips demonstrate label, icon, image, removable, and custom content. Badges show value and severity-style usage. Use Actions for chip \`onRemove\`.`;

interface TagStoryArgs {
    value: string;
    severity: Severity;
    rounded: boolean;
    icon: string;
    onRemove: (event: MouseEvent) => void;
}

const meta: Meta<TagStoryArgs> = {
    title: 'Components/DataDisplay/Tag',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, TagModule, ChipModule, BadgeModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: TAG_DOC
            }
        }
    },
    args: {
        value: 'In progress',
        severity: 'info',
        rounded: false,
        icon: 'pi pi-info-circle',
        onRemove: action('onRemove')
    },
    argTypes: {
        value: { control: 'text' },
        severity: {
            control: 'select',
            options: [...SEVERITY_OPTIONS]
        },
        rounded: { control: 'boolean' },
        icon: { control: 'text' },
        onRemove: { control: false }
    },
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-wrap items-center gap-2">
  <p-tag [value]="value" [severity]="severity" [rounded]="rounded" [icon]="icon ? icon : undefined" />
</div>
        `
    })
};

export default meta;
type Story = StoryObj<TagStoryArgs>;

export const Default: Story = {};

/** One tag per severity from the shared design tokens. */
export const AllSeverities: Story = {
    render: () => ({
        template: `
<div class="flex flex-wrap gap-2">
  <p-tag *ngFor="let s of severities" [value]="s" [severity]="s" />
</div>
        `,
        props: {
            severities: [...SEVERITY_OPTIONS]
        }
    })
};

/** AllVariants: tags, chips, and badges in one canvas. */
export const AllVariants: Story = {
    args: {
        onRemove: action('onRemove')
    },
    argTypes: {
        value: { table: { disable: true } },
        severity: { table: { disable: true } },
        rounded: { table: { disable: true } },
        icon: { table: { disable: true } }
    },
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-col gap-6">
  <div class="flex flex-wrap gap-2 items-center">
    <span class="text-sm font-medium w-24">Tags</span>
    <p-tag value="primary" severity="primary" />
    <p-tag value="success" severity="success" />
    <p-tag value="warn" severity="warn" />
  </div>
  <div class="flex flex-wrap gap-2 items-center">
    <span class="text-sm font-medium w-24">Chips</span>
    <p-chip label="Plain" />
    <p-chip label="Icon" icon="pi pi-check" />
    <p-chip label="Removable" [removable]="true" (onRemove)="onRemove($event)" />
  </div>
  <div class="flex flex-wrap gap-2 items-center">
    <span class="text-sm font-medium w-24">Badges</span>
    <p-badge value="2" />
    <p-badge value="8" severity="danger" />
    <p-badge value="NEW" severity="success" />
  </div>
</div>
        `
    })
};

export const ChipVariants: Story = {
    args: {
        onRemove: action('onRemove')
    },
    argTypes: {
        value: { table: { disable: true } },
        severity: { table: { disable: true } },
        rounded: { table: { disable: true } },
        icon: { table: { disable: true } }
    },
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-wrap gap-2 items-center">
  <p-chip label="Angular" />
  <p-chip label="PrimeNG" icon="pi pi-star-fill" />
  <p-chip label="Avatar" image="https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png" alt="Amy" />
  <p-chip label="Dismiss me" [removable]="true" (onRemove)="onRemove($event)" />
  <p-chip class="!py-0 !pl-0 !pr-4">
    <span class="bg-primary text-primary-contrast rounded-full w-8 h-8 flex items-center justify-center">P</span>
    <span class="ml-2 font-medium">Custom</span>
  </p-chip>
</div>
        `
    })
};

export const BadgeVariants: Story = {
    argTypes: {
        value: { table: { disable: true } },
        severity: { table: { disable: true } },
        rounded: { table: { disable: true } },
        icon: { table: { disable: true } }
    },
    render: () => ({
        template: `
<div class="flex flex-wrap gap-4 items-center">
  <p-badge value="3" />
  <p-badge value="99+" severity="warn" />
  <p-badge value="!" severity="danger" />
  <p-badge value="PRO" severity="contrast" />
</div>
        `
    })
};

/** Edge case: tag with an empty label still renders the shape; useful for icon-only or placeholder states. */
export const Empty: Story = {
    args: {
        value: '',
        icon: '',
        severity: 'secondary',
        rounded: true
    },
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-wrap gap-2 items-center">
  <p-tag [value]="value" [severity]="severity" [rounded]="rounded" />
  <span class="text-sm text-muted-color">Empty value</span>
</div>
        `
    })
};
