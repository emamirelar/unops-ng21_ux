import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from 'storybook/actions';
import type { AutoCompleteCompleteEvent } from 'primeng/types/autocomplete';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MOCK_AUTOCOMPLETE_ITEMS, MOCK_SELECT_OPTIONS } from '@/stories/data/mock';

type SelectStoryArgs = {
    placeholder: string;
    disabled: boolean;
    filter: boolean;
};

const meta: Meta<SelectStoryArgs> = {
    title: 'Components/FormInputs/Select',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, SelectModule, MultiSelectModule, AutoCompleteModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Dropdown selection controls: single-value `p-select`, multi-value `p-multiselect`, and typeahead `p-autocomplete`. Options use label/value objects or string suggestions depending on the control.'
            }
        }
    },
    args: {
        placeholder: 'Choose an option',
        disabled: false,
        filter: false
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        filter: { control: 'boolean' }
    }
};

export default meta;
type Story = StoryObj<SelectStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            options: MOCK_SELECT_OPTIONS,
            selected: 'a',
            onChange: action('onChange'),
            onFilter: action('onFilter'),
            onClick: action('onClick')
        },
        template: `
      <p-select
        [options]="options"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="selected"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [filter]="filter"
        [showClear]="true"
        styleClass="w-full md:w-20rem"
        (onChange)="onChange($event)"
        (onFilter)="onFilter($event)"
        (onClick)="onClick($event)"
      />
    `
    })
};

export const AllVariants: Story = {
    render: (args) => {
        const acSuggestions: string[] = [];
        return {
            props: {
                ...args,
                options: MOCK_SELECT_OPTIONS,
                selected: 'b',
                multiSelected: ['a', 'c'],
                acValue: '',
                acSuggestions,
                onSelectChange: action('selectOnChange'),
                onMultiChange: action('multiSelectOnChange'),
                onAcSelect: action('autocompleteOnSelect'),
                acCompleteMethod(event: AutoCompleteCompleteEvent): void {
                    const q = event.query.toLowerCase();
                    acSuggestions.length = 0;
                    acSuggestions.push(...MOCK_AUTOCOMPLETE_ITEMS.filter((item) => item.toLowerCase().includes(q)));
                    action('autocompleteCompleteMethod')(event);
                }
            },
        template: `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">Select</div>
          <p-select
            [options]="options"
            optionLabel="label"
            optionValue="value"
            [(ngModel)]="selected"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [filter]="filter"
            styleClass="w-full"
            (onChange)="onSelectChange($event)"
          />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">MultiSelect</div>
          <p-multiselect
            [options]="options"
            optionLabel="label"
            optionValue="value"
            [(ngModel)]="multiSelected"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [filter]="filter"
            display="chip"
            styleClass="w-full"
            (onChange)="onMultiChange($event)"
          />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">AutoComplete</div>
          <p-autocomplete
            [(ngModel)]="acValue"
            [suggestions]="acSuggestions"
            (completeMethod)="acCompleteMethod($event)"
            [placeholder]="placeholder"
            [dropdown]="true"
            [disabled]="disabled"
            styleClass="w-full"
            inputStyleClass="w-full"
            (onSelect)="onAcSelect($event)"
          />
        </div>
      </div>
    `
        };
    }
};

export const MultiSelect: Story = {
    render: (args) => ({
        props: {
            ...args,
            options: MOCK_SELECT_OPTIONS,
            multiSelected: ['b'],
            onChange: action('onChange')
        },
        template: `
      <p-multiselect
        [options]="options"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="multiSelected"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [filter]="filter"
        display="chip"
        styleClass="w-full md:w-24rem"
        (onChange)="onChange($event)"
      />
    `
    })
};

export const AutoComplete: Story = {
    render: (args) => {
        const acSuggestions: string[] = [];
        return {
            props: {
                ...args,
                acValue: '',
                acSuggestions,
                onSelect: action('onSelect'),
                completeMethod(event: AutoCompleteCompleteEvent): void {
                    const q = event.query.toLowerCase();
                    acSuggestions.length = 0;
                    acSuggestions.push(...MOCK_AUTOCOMPLETE_ITEMS.filter((item) => item.toLowerCase().includes(q)));
                    action('completeMethod')(event);
                }
            },
            template: `
      <p-autocomplete
        [(ngModel)]="acValue"
        [suggestions]="acSuggestions"
        (completeMethod)="completeMethod($event)"
        [placeholder]="placeholder"
        [dropdown]="true"
        [disabled]="disabled"
        styleClass="w-full md:w-24rem"
        inputStyleClass="w-full"
        (onSelect)="onSelect($event)"
      />
    `
        };
    }
};

export const Disabled: Story = {
    args: { disabled: true },
    render: (args) => ({
        props: {
            ...args,
            options: MOCK_SELECT_OPTIONS,
            selected: 'c',
            onChange: action('onChange')
        },
        template: `
      <p-select
        [options]="options"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="selected"
        [placeholder]="placeholder"
        [disabled]="disabled"
        styleClass="w-full md:w-20rem"
        (onChange)="onChange($event)"
      />
    `
    })
};

export const Empty: Story = {
    render: (args) => ({
        props: {
            ...args,
            options: [] as { label: string; value: string }[],
            selected: null as string | null,
            onChange: action('onChange')
        },
        template: `
      <p-select
        [options]="options"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="selected"
        [placeholder]="'No options available'"
        [disabled]="disabled"
        [filter]="filter"
        emptyMessage="No records found"
        styleClass="w-full md:w-20rem"
        (onChange)="onChange($event)"
      />
    `
    })
};
