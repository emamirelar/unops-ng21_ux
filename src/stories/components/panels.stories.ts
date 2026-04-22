import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { PanelModule } from 'primeng/panel';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ToolbarModule } from 'primeng/toolbar';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';

const PANELS_DOC = `Layout primitives: **Accordion** (stacked disclose), **Panel** and **Fieldset** (grouped content), **Card** (header/body/footer), **Toolbar** (start/end slots), **Divider**, and **Splitter** (resizable regions).

Accordion follows PrimeNG 21 markup: \`p-accordion\` with \`p-accordionpanel\`, \`p-accordionheader\`, and \`p-accordioncontent\`, using string \`value\` keys. Splitter panels use \`ng-template #panel\` children. Use Actions for accordion open/close and toolbar button clicks.`;

interface PanelsStoryArgs {
    onAccordionOpen: (event: unknown) => void;
    onAccordionClose: (event: unknown) => void;
    onToolbarAction: (event: MouseEvent) => void;
}

const meta: Meta<PanelsStoryArgs> = {
    title: 'Components/Layout/Panels',
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                AccordionModule,
                PanelModule,
                FieldsetModule,
                CardModule,
                DividerModule,
                ToolbarModule,
                SplitterModule,
                ButtonModule
            ]
        })
    ],
    parameters: {
        docs: {
            description: {
                component: PANELS_DOC
            }
        }
    },
    args: {
        onAccordionOpen: action('accordion onOpen'),
        onAccordionClose: action('accordion onClose'),
        onToolbarAction: action('toolbar action')
    },
    argTypes: {
        onAccordionOpen: { control: false },
        onAccordionClose: { control: false },
        onToolbarAction: { control: false }
    }
};

export default meta;
type Story = StoryObj<PanelsStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: args,
        template: `
<p-accordion value="0" (onOpen)="onAccordionOpen($event)" (onClose)="onAccordionClose($event)">
  <p-accordion-panel value="0">
    <p-accordion-header>Overview</p-accordion-header>
    <p-accordion-content>
      <p class="m-0">High-level summary of the workspace and key metrics.</p>
    </p-accordion-content>
  </p-accordion-panel>
  <p-accordion-panel value="1">
    <p-accordion-header>Operations</p-accordion-header>
    <p-accordion-content>
      <p class="m-0">Day-to-day tasks, queues, and ownership.</p>
    </p-accordion-content>
  </p-accordion-panel>
  <p-accordion-panel value="2">
    <p-accordion-header>Compliance</p-accordion-header>
    <p-accordion-content>
      <p class="m-0">Policies, audit trails, and retention rules.</p>
    </p-accordion-content>
  </p-accordion-panel>
</p-accordion>
        `
    })
};

export const PanelStory: Story = {
    render: () => ({
        template: `
<p-panel header="Collapsible panel" [toggleable]="true">
  <p class="m-0">Panel body collapses with the header toggle control.</p>
</p-panel>
        `
    })
};

export const FieldsetStory: Story = {
    render: () => ({
        template: `
<p-fieldset legend="Details" [toggleable]="true">
  <p class="m-0">Fieldset content can be collapsed to save vertical space.</p>
</p-fieldset>
        `
    })
};

export const CardStory: Story = {
    render: () => ({
        template: `
<p-card [style]="{ width: '22rem' }">
  <ng-template #header>
    <div class="h-2 bg-primary rounded-t-border"></div>
  </ng-template>
  <ng-template #title>Deployment</ng-template>
  <ng-template #subtitle>Production · EU</ng-template>
  <p class="m-0">Card content with header strip, title, subtitle, and footer actions.</p>
  <ng-template #footer>
    <div class="flex gap-2">
      <p-button label="View" severity="secondary" [outlined]="true" styleClass="flex-1" />
      <p-button label="Promote" styleClass="flex-1" />
    </div>
  </ng-template>
</p-card>
        `
    })
};

export const ToolbarStory: Story = {
    render: (args) => ({
        props: args,
        template: `
<p-toolbar>
  <ng-template #start>
    <p-button label="Save" icon="pi pi-save" class="mr-2" (onClick)="onToolbarAction($event)" />
    <p-button label="Delete" icon="pi pi-trash" severity="secondary" [outlined]="true" (onClick)="onToolbarAction($event)" />
  </ng-template>
  <ng-template #end>
    <p-button icon="pi pi-upload" severity="secondary" [rounded]="true" [text]="true" (onClick)="onToolbarAction($event)" />
  </ng-template>
</p-toolbar>
        `
    })
};

export const DividerStory: Story = {
    render: () => ({
        template: `
<div class="flex flex-col gap-4">
  <span>Section A</span>
  <p-divider />
  <span>Section B</span>
  <div class="flex items-stretch gap-4 h-24">
    <span class="flex items-center">Left</span>
    <p-divider layout="vertical" />
    <span class="flex items-center">Right</span>
  </div>
</div>
        `
    })
};

export const SplitterStory: Story = {
    render: () => ({
        template: `
<p-splitter [style]="{ height: '240px' }" [panelSizes]="[40, 60]">
  <ng-template #panel>
    <div class="flex items-center justify-center h-full border border-surface-200 dark:border-surface-700">Panel A</div>
  </ng-template>
  <ng-template #panel>
    <div class="flex items-center justify-center h-full border border-surface-200 dark:border-surface-700 border-l-0">Panel B</div>
  </ng-template>
</p-splitter>
        `
    })
};

/** Accordion, panel, fieldset, and dividers in one scrollable example. */
export const AllVariants: Story = {
    render: (args) => ({
        props: args,
        template: `
<div class="flex flex-col gap-6 max-w-2xl">
  <p-accordion value="0" (onOpen)="onAccordionOpen($event)" (onClose)="onAccordionClose($event)">
    <p-accordion-panel value="0">
      <p-accordion-header>Quick accordion</p-accordion-header>
      <p-accordion-content><p class="m-0">First panel.</p></p-accordion-content>
    </p-accordion-panel>
    <p-accordion-panel value="1">
      <p-accordion-header>Second</p-accordion-header>
      <p-accordion-content><p class="m-0">Second panel.</p></p-accordion-content>
    </p-accordion-panel>
  </p-accordion>
  <p-divider />
  <p-panel header="Nested panel" [toggleable]="true">
    <p class="m-0">Inside the stack.</p>
  </p-panel>
  <p-fieldset legend="Nested fieldset" [toggleable]="true">
    <p class="m-0">More grouped content.</p>
  </p-fieldset>
</div>
        `
    })
};

/** Edge case: accordion with no panel pre-selected (\`value\` unset). */
export const AccordionNoneOpen: Story = {
    render: (args) => ({
        props: args,
        template: `
<p-accordion (onOpen)="onAccordionOpen($event)" (onClose)="onAccordionClose($event)">
  <p-accordion-panel value="a">
    <p-accordion-header>First</p-accordion-header>
    <p-accordion-content><p class="m-0">Open manually.</p></p-accordion-content>
  </p-accordion-panel>
  <p-accordion-panel value="b">
    <p-accordion-header>Second</p-accordion-header>
    <p-accordion-content><p class="m-0">Also closed initially.</p></p-accordion-content>
  </p-accordion-panel>
</p-accordion>
        `
    })
};
