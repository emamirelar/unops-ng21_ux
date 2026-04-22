import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { MOCK_PRODUCTS, STATUS_MAP, type MockProduct, type Severity } from '@/stories/data/mock';

const DATAVIEW_DOC = `**DataView** presents a collection in list or grid layout using \`p-dataview\`. Templates \`#list\` and \`#grid\` receive the current page of items as \`items\`. Mock products use \`status\` strings mapped to tag severities via \`STATUS_MAP\`.

Use **Actions** for \`onPage\` when paginating.`;

interface DataViewStoryArgs {
    products: MockProduct[];
    layout: 'list' | 'grid';
    onPage: (event: unknown) => void;
}

function severityForStatus(status: string): Severity {
    return STATUS_MAP[status] ?? 'secondary';
}

const meta: Meta<DataViewStoryArgs> = {
    title: 'Components/DataDisplay/DataView',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, DataViewModule, TagModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: DATAVIEW_DOC
            }
        }
    },
    args: {
        products: MOCK_PRODUCTS,
        layout: 'list',
        onPage: action('onPage')
    },
    argTypes: {
        products: { control: false },
        layout: {
            control: 'select',
            options: ['list', 'grid']
        },
        onPage: { control: false }
    },
    render: (args) => ({
        props: {
            ...args,
            severityForStatus
        },
        template: `
<p-dataview [value]="products" [layout]="layout" [paginator]="true" [rows]="4" (onPage)="onPage($event)">
  <ng-template #list let-items>
    <div class="flex flex-col">
      <div *ngFor="let item of items; let first = first" class="p-4 flex flex-col sm:flex-row sm:items-center gap-4" [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }">
        <div class="flex-1">
          <div class="text-sm text-muted-color">{{ item.category }}</div>
          <div class="text-lg font-medium">{{ item.name }}</div>
        </div>
        <div class="flex items-center gap-3">
          <p-tag [value]="item.status" [severity]="severityForStatus(item.status)" />
          <span class="font-semibold">{{ item.price | currency:'USD':'symbol':'1.0-0' }}</span>
        </div>
      </div>
    </div>
  </ng-template>
  <ng-template #grid let-items>
    <div class="grid grid-cols-12 gap-4">
      <div *ngFor="let item of items" class="col-span-12 sm:col-span-6 lg:col-span-4">
        <div class="p-4 border border-surface-200 dark:border-surface-700 rounded-border flex flex-col gap-2 h-full">
          <div class="text-sm text-muted-color">{{ item.category }}</div>
          <div class="text-lg font-medium">{{ item.name }}</div>
          <div class="flex items-center justify-between mt-auto pt-2">
            <p-tag [value]="item.status" [severity]="severityForStatus(item.status)" />
            <span class="font-semibold">{{ item.price | currency:'USD':'symbol':'1.0-0' }}</span>
          </div>
        </div>
      </div>
    </div>
  </ng-template>
  <ng-template #emptymessage>
    <div class="p-6 text-center text-muted-color">No items match this view.</div>
  </ng-template>
</p-dataview>
        `
    })
};

export default meta;
type Story = StoryObj<DataViewStoryArgs>;

export const Default: Story = {
    args: {
        layout: 'list',
        products: MOCK_PRODUCTS
    }
};

export const GridLayout: Story = {
    args: {
        layout: 'grid',
        products: MOCK_PRODUCTS
    }
};

/** Both layouts stacked to compare list vs grid without switching controls. */
export const AllVariants: Story = {
    args: {
        products: MOCK_PRODUCTS
    },
    argTypes: {
        layout: { table: { disable: true } }
    },
    render: (args) => ({
        props: { ...args, severityForStatus },
        template: `
<div class="flex flex-col gap-8">
  <section>
    <h3 class="text-lg font-semibold mb-2">List</h3>
    <p-dataview [value]="products" layout="list" [paginator]="true" [rows]="3" (onPage)="onPage($event)">
      <ng-template #list let-items>
        <div *ngFor="let item of items; let first = first" class="p-3 flex justify-between items-center gap-2" [ngClass]="{ 'border-t border-surface-200 dark:border-surface-700': !first }">
          <span>{{ item.name }}</span>
          <p-tag [value]="item.status" [severity]="severityForStatus(item.status)" />
        </div>
      </ng-template>
    </p-dataview>
  </section>
  <section>
    <h3 class="text-lg font-semibold mb-2">Grid</h3>
    <p-dataview [value]="products" layout="grid" [paginator]="true" [rows]="3" (onPage)="onPage($event)">
      <ng-template #grid let-items>
        <div class="grid grid-cols-12 gap-2">
          <div *ngFor="let item of items" class="col-span-12 sm:col-span-6 p-2 border border-surface-200 dark:border-surface-700 rounded-border">
            <div class="font-medium">{{ item.name }}</div>
            <p-tag [value]="item.status" [severity]="severityForStatus(item.status)" />
          </div>
        </div>
      </ng-template>
    </p-dataview>
  </section>
</div>
        `
    })
};

/** Edge case: empty collection with \`#emptymessage\`. */
export const Empty: Story = {
    args: {
        products: [],
        layout: 'list'
    }
};
