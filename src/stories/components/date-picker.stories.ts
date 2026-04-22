import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from 'storybook/actions';
import { DatePickerModule } from 'primeng/datepicker';

type SelectionMode = 'single' | 'range' | 'multiple';

type DateModel = Date | Date[] | null;

type DatePickerStoryArgs = {
    placeholder: string;
    disabled: boolean;
    showTime: boolean;
    showIcon: boolean;
    selectionMode: SelectionMode;
};

function initialValueForMode(mode: SelectionMode): DateModel {
    if (mode === 'range') {
        return [new Date(), new Date()];
    }
    if (mode === 'multiple') {
        return [];
    }
    return new Date();
}

const meta: Meta<DatePickerStoryArgs> = {
    title: 'Components/FormInputs/DatePicker',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, DatePickerModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'The PrimeNG `p-datepicker` combines a text field and calendar overlay for picking dates, optionally with time, range, or multi-date selection. Icon trigger and `showTime` suit scheduling and reporting filters.'
            }
        }
    },
    args: {
        placeholder: 'Select a date',
        disabled: false,
        showTime: false,
        showIcon: true,
        selectionMode: 'single'
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        showTime: { control: 'boolean' },
        showIcon: { control: 'boolean' },
        selectionMode: {
            control: 'select',
            options: ['single', 'range', 'multiple'] satisfies SelectionMode[]
        }
    }
};

export default meta;
type Story = StoryObj<DatePickerStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            value: initialValueForMode(args.selectionMode),
            onSelect: action('onSelect'),
            onBlur: action('onBlur'),
            onClear: action('onClear')
        },
        template: `
      <p-datepicker
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [showTime]="showTime"
        [showIcon]="showIcon"
        [selectionMode]="selectionMode"
        [showButtonBar]="true"
        hourFormat="24"
        (onSelect)="onSelect($event)"
        (onBlur)="onBlur($event)"
        (onClear)="onClear($event)"
      />
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            single: new Date(),
            range: [new Date(), new Date()] as Date[],
            multi: [] as Date[],
            onSelect: action('onSelect')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 1.25rem; max-width: 22rem;">
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Single</div>
          <p-datepicker [(ngModel)]="single" selectionMode="single" [showIcon]="true" (onSelect)="onSelect($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Range</div>
          <p-datepicker [(ngModel)]="range" selectionMode="range" [showIcon]="true" (onSelect)="onSelect($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Multiple</div>
          <p-datepicker [(ngModel)]="multi" selectionMode="multiple" [showIcon]="true" (onSelect)="onSelect($event)" />
        </div>
      </div>
    `
    })
};

export const WithTime: Story = {
    args: {
        showTime: true,
        selectionMode: 'single'
    },
    render: (args) => ({
        props: {
            ...args,
            value: new Date(),
            onSelect: action('onSelect')
        },
        template: `
      <p-datepicker
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [showTime]="showTime"
        [showIcon]="showIcon"
        selectionMode="single"
        hourFormat="24"
        (onSelect)="onSelect($event)"
      />
    `
    })
};

export const RangePicker: Story = {
    render: (args) => ({
        props: {
            ...args,
            value: [new Date(), new Date()] as Date[],
            onSelect: action('onSelect')
        },
        template: `
      <p-datepicker
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [showTime]="showTime"
        [showIcon]="showIcon"
        selectionMode="range"
        [showButtonBar]="true"
        (onSelect)="onSelect($event)"
      />
    `
    })
};

export const Disabled: Story = {
    args: {
        disabled: true,
        selectionMode: 'single'
    },
    render: (args) => ({
        props: {
            ...args,
            value: new Date(),
            onSelect: action('onSelect')
        },
        template: `
      <p-datepicker
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [showTime]="showTime"
        [showIcon]="showIcon"
        selectionMode="single"
        (onSelect)="onSelect($event)"
      />
    `
    })
};
