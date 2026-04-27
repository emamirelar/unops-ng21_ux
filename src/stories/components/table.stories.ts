import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { MOCK_PRODUCTS, type MockProduct } from '@/stories/data/mock';

const TABLE_DOC = `PrimeNG **Table** (\`p-table\`) displays tabular data with optional sorting and pagination. This file also imports **Paginator** (\`PaginatorModule\`) for parity with split paginator use cases; the paginated story relies on the table’s built-in paginator.

Pass row data via the \`products\` prop and keep complex collections out of Controls (\`control: false\`) so Docs stays readable. Use the Actions panel to inspect \`onPage\` and \`onSort\` payloads.`;

interface TableStoryArgs {
    products: MockProduct[];
    onPage: (event: unknown) => void;
    onSort: (event: unknown) => void;
}

const meta: Meta<TableStoryArgs> = {
    title: 'Components/DataDisplay/Table',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, TableModule, PaginatorModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: TABLE_DOC
            }
        }
    },
    args: {
        products: MOCK_PRODUCTS,
        onPage: action('onPage'),
        onSort: action('onSort')
    },
    argTypes: {
        products: { control: false },
        onPage: { control: false },
        onSort: { control: false }
    },
    render: (args) => ({
        props: args,
        template: `
<p-table
  [value]="products"
  [tableStyle]="{ 'min-width': '40rem' }"
  (onPage)="onPage($event)"
  (onSort)="onSort($event)"
>
  <ng-template #header>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Price</th>
      <th>Status</th>
    </tr>
  </ng-template>
  <ng-template #body let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'USD':'symbol':'1.0-0' }}</td>
      <td>{{ product.status }}</td>
    </tr>
  </ng-template>
  <ng-template #emptymessage>
    <tr>
      <td colspan="4" class="p-4 text-center text-muted-color">No products to display.</td>
    </tr>
  </ng-template>
</p-table>
        `
    })
};

export default meta;
type Story = StoryObj<TableStoryArgs>;

export const Default: Story = {
    args: {
        products: MOCK_PRODUCTS
    }
};

export const Sortable: Story = {
    args: {
        products: MOCK_PRODUCTS
    },
    render: (args) => ({
        props: args,
        template: `
<p-table
  [value]="products"
  [tableStyle]="{ 'min-width': '40rem' }"
  (onSort)="onSort($event)"
>
  <ng-template #header>
    <tr>
      <th pSortableColumn="name">
        <span class="flex items-center gap-2">Name <p-sortIcon field="name" /></span>
      </th>
      <th pSortableColumn="category">
        <span class="flex items-center gap-2">Category <p-sortIcon field="category" /></span>
      </th>
      <th pSortableColumn="price">
        <span class="flex items-center gap-2">Price <p-sortIcon field="price" /></span>
      </th>
      <th pSortableColumn="status">
        <span class="flex items-center gap-2">Status <p-sortIcon field="status" /></span>
      </th>
    </tr>
  </ng-template>
  <ng-template #body let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'USD':'symbol':'1.0-0' }}</td>
      <td>{{ product.status }}</td>
    </tr>
  </ng-template>
</p-table>
        `
    })
};

export const Paginated: Story = {
    args: {
        products: MOCK_PRODUCTS
    },
    render: (args) => ({
        props: args,
        template: `
<p-table
  [value]="products"
  [paginator]="true"
  [rows]="5"
  [tableStyle]="{ 'min-width': '40rem' }"
  (onPage)="onPage($event)"
>
  <ng-template #header>
    <tr>
      <th>Name</th>
      <th>Category</th>
      <th>Price</th>
      <th>Status</th>
    </tr>
  </ng-template>
  <ng-template #body let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'USD':'symbol':'1.0-0' }}</td>
      <td>{{ product.status }}</td>
    </tr>
  </ng-template>
</p-table>
        `
    })
};

/** Sorting, pagination, and reporting enabled together (named “all variants” for this component). */
export const AllVariants: Story = {
    args: {
        products: MOCK_PRODUCTS
    },
    render: (args) => ({
        props: args,
        template: `
<p-table
  [value]="products"
  [paginator]="true"
  [rows]="4"
  [rowsPerPageOptions]="[4, 8]"
  [tableStyle]="{ 'min-width': '40rem' }"
  (onPage)="onPage($event)"
  (onSort)="onSort($event)"
>
  <ng-template #header>
    <tr>
      <th pSortableColumn="name">
        <span class="flex items-center gap-2">Name <p-sortIcon field="name" /></span>
      </th>
      <th pSortableColumn="category">
        <span class="flex items-center gap-2">Category <p-sortIcon field="category" /></span>
      </th>
      <th pSortableColumn="price">
        <span class="flex items-center gap-2">Price <p-sortIcon field="price" /></span>
      </th>
      <th pSortableColumn="status">
        <span class="flex items-center gap-2">Status <p-sortIcon field="status" /></span>
      </th>
    </tr>
  </ng-template>
  <ng-template #body let-product>
    <tr>
      <td>{{ product.name }}</td>
      <td>{{ product.category }}</td>
      <td>{{ product.price | currency:'USD':'symbol':'1.0-0' }}</td>
      <td>{{ product.status }}</td>
    </tr>
  </ng-template>
</p-table>
        `
    })
};

/** Edge case: no rows and a custom empty state via \`#emptymessage\`. */
export const Empty: Story = {
    args: {
        products: []
    }
};
