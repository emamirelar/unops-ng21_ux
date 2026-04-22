import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { MOCK_USERS, type MockUser } from '@/stories/data/mock';
import { ButtonModule } from 'primeng/button';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';

const meta: Meta = {
    title: 'Components/Overlays/Popover',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ButtonModule, PopoverModule, TooltipModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    '**Popover** (`p-popover`) hosts rich overlay content; **Tooltip** (`pTooltip`) shows short hints on hover/focus. Set `tooltipPosition` for placement.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        props: {
            onHover: action('tooltipShow')
        },
        template: `
      <p-button
        label="Hover for tooltip"
        pTooltip="Save assigns your changes to this record."
        tooltipPosition="top"
        (mouseenter)="onHover()"
      />
    `
    })
};

export const PopoverStory: Story = {
    render: () => ({
        props: {
            users: MOCK_USERS,
            onSelect: action('selectUser')
        },
        template: `
      <p-button type="button" label="Show team" (onClick)="op.toggle($event)" />
      <p-popover #op [style]="{ width: '280px' }">
        <div class="flex flex-col gap-2 p-1">
          <span class="font-medium text-sm">Team members</span>
          <ul class="list-none m-0 p-0 flex flex-col gap-1">
            <li *ngFor="let u of users">
              <button
                type="button"
                class="w-full text-left border-none bg-transparent cursor-pointer hover:bg-emphasis p-2 rounded"
                (click)="onSelect(u.name); op.hide()"
              >
                {{ u.name }}
              </button>
            </li>
          </ul>
        </div>
      </p-popover>
    `
    })
};

export const TooltipPositions: Story = {
    render: () => ({
        props: {},
        template: `
      <div class="flex flex-wrap gap-3">
        <p-button label="Top" pTooltip="Top placement" tooltipPosition="top" />
        <p-button label="Right" pTooltip="Right placement" tooltipPosition="right" />
        <p-button label="Bottom" pTooltip="Bottom placement" tooltipPosition="bottom" />
        <p-button label="Left" pTooltip="Left placement" tooltipPosition="left" />
      </div>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            users: MOCK_USERS
        },
        template: `
      <div class="flex flex-col gap-6 items-start">
        <p-button
          label="Tooltip"
          pTooltip="Compact hint text"
          tooltipPosition="top"
        />
        <div>
          <p-button type="button" label="Popover list" (onClick)="op2.toggle($event)" />
          <p-popover #op2>
            <p class="m-0 text-sm">Popover body with arbitrary markup.</p>
          </p-popover>
        </div>
        <div class="flex gap-2">
          <p-button label="T1" pTooltip="One" tooltipPosition="top" />
          <p-button label="T2" pTooltip="Two" tooltipPosition="bottom" />
        </div>
      </div>
    `
    })
};

export const Edge_EmptyPopoverList: Story = {
    render: () => ({
        props: {
            users: [] as MockUser[]
        },
        template: `
      <p-button type="button" label="Open empty popover" (onClick)="op.toggle($event)" />
      <p-popover #op>
        <p *ngIf="users.length === 0" class="m-0 text-sm text-muted-color">No items to display.</p>
      </p-popover>
    `
    })
};
