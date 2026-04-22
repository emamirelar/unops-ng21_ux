import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { MOCK_TAB_PANELS } from '@/stories/data/mock';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { TabsModule } from 'primeng/tabs';

const scrollableTabData = [
    ...MOCK_TAB_PANELS,
    ...Array.from({ length: 9 }, (_, i) => ({
        header: `Tab ${i + 4}`,
        content: `Additional panel ${i + 4} for scrollable behavior.`
    }))
];

const meta: Meta = {
    title: 'Components/Navigation/Tabs',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, TabsModule, StepperModule, ButtonModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'PrimeNG **Tabs** (`p-tabs` with `p-tablist` / `p-tabpanels`) and **Stepper** for guided flows. Tab copy comes from `MOCK_TAB_PANELS`.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        props: {
            panels: MOCK_TAB_PANELS,
            onTabChange: action('tabChange')
        },
        template: `
      <p-tabs [value]="0" (valueChange)="onTabChange($event)">
        <p-tablist>
          <p-tab *ngFor="let panel of panels; let i = index" [value]="i">{{ panel.header }}</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel *ngFor="let panel of panels; let i = index" [value]="i">
            <p class="m-0 leading-normal">{{ panel.content }}</p>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    `
    })
};

export const StepperStory: Story = {
    render: () => ({
        props: {
            stepValue: 1,
            onStepChange: action('stepChange')
        },
        template: `
      <p-stepper [(value)]="stepValue" [linear]="true" (valueChange)="onStepChange($event)">
        <p-step-list>
          <p-step [value]="1">Account</p-step>
          <p-step [value]="2">Billing</p-step>
          <p-step [value]="3">Review</p-step>
        </p-step-list>
        <p-step-panels>
          <p-step-panel [value]="1">
            <p class="m-0">Step 1 — collect account details.</p>
          </p-step-panel>
          <p-step-panel [value]="2">
            <p class="m-0">Step 2 — confirm billing.</p>
          </p-step-panel>
          <p-step-panel [value]="3">
            <p class="m-0">Step 3 — submit the request.</p>
          </p-step-panel>
        </p-step-panels>
      </p-stepper>
    `
    })
};

export const ScrollableTabs: Story = {
    render: () => ({
        props: {
            panels: scrollableTabData
        },
        template: `
      <p-tabs [value]="0" [scrollable]="true">
        <p-tablist>
          <p-tab *ngFor="let panel of panels; let i = index" [value]="i">{{ panel.header }}</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel *ngFor="let panel of panels; let i = index" [value]="i">
            <p class="m-0 leading-normal">{{ panel.content }}</p>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            panels: MOCK_TAB_PANELS,
            stepValue: 1
        },
        template: `
      <div class="flex flex-col gap-10">
        <div>
          <p class="text-sm font-medium mb-2">Tabs</p>
          <p-tabs [value]="0">
            <p-tablist>
              <p-tab *ngFor="let panel of panels; let i = index" [value]="i">{{ panel.header }}</p-tab>
            </p-tablist>
            <p-tabpanels>
              <p-tabpanel *ngFor="let panel of panels; let i = index" [value]="i">
                <p class="m-0">{{ panel.content }}</p>
              </p-tabpanel>
            </p-tabpanels>
          </p-tabs>
        </div>
        <div>
          <p class="text-sm font-medium mb-2">Linear stepper</p>
          <p-stepper [(value)]="stepValue" [linear]="true">
            <p-step-list>
              <p-step [value]="1">One</p-step>
              <p-step [value]="2">Two</p-step>
              <p-step [value]="3">Three</p-step>
            </p-step-list>
            <p-step-panels>
              <p-step-panel [value]="1"><p class="m-0">Content 1</p></p-step-panel>
              <p-step-panel [value]="2"><p class="m-0">Content 2</p></p-step-panel>
              <p-step-panel [value]="3"><p class="m-0">Content 3</p></p-step-panel>
            </p-step-panels>
          </p-stepper>
        </div>
      </div>
    `
    })
};

export const Edge_SingleTab: Story = {
    render: () => ({
        props: {
            panels: MOCK_TAB_PANELS.slice(0, 1)
        },
        template: `
      <p-tabs [value]="0">
        <p-tablist>
          <p-tab *ngFor="let panel of panels; let i = index" [value]="i">{{ panel.header }}</p-tab>
        </p-tablist>
        <p-tabpanels>
          <p-tabpanel *ngFor="let panel of panels; let i = index" [value]="i">
            <p class="m-0">{{ panel.content }}</p>
          </p-tabpanel>
        </p-tabpanels>
      </p-tabs>
    `
    })
};
