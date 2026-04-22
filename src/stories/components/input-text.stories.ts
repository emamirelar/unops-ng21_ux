import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from 'storybook/actions';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PasswordModule } from 'primeng/password';
import { InputNumberModule } from 'primeng/inputnumber';

type InputTextStoryArgs = {
    placeholder: string;
    disabled: boolean;
    value: string;
};

const meta: Meta<InputTextStoryArgs> = {
    title: 'Components/FormInputs/InputText',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, FormsModule, InputTextModule, TextareaModule, PasswordModule, InputNumberModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Text entry primitives: single-line `pInputText`, multi-line `pTextarea`, masked `p-password`, and numeric `p-inputnumber`. Use with `FormsModule` for `ngModel` two-way binding.'
            }
        }
    },
    args: {
        placeholder: 'Type here…',
        disabled: false,
        value: 'Sample text'
    },
    argTypes: {
        placeholder: { control: 'text' },
        disabled: { control: 'boolean' },
        value: { control: 'text' }
    }
};

export default meta;
type Story = StoryObj<InputTextStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            onInput: action('input')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width: 28rem;">
        <input pInputText [(ngModel)]="value" [placeholder]="placeholder" [disabled]="disabled" (input)="onInput($event)" />
      </div>
    `
    })
};

export const AllVariants: Story = {
    render: (args) => ({
        props: {
            ...args,
            numberValue: 1280,
            onInput: action('input'),
            onPasswordFocus: action('onFocus'),
            onPasswordBlur: action('onBlur')
        },
        template: `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; align-items: start;">
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">InputText</div>
          <input pInputText [(ngModel)]="value" [placeholder]="placeholder" [disabled]="disabled" (input)="onInput($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">Textarea</div>
          <textarea pTextarea [(ngModel)]="value" rows="3" [placeholder]="placeholder" [disabled]="disabled" style="width:100%;"></textarea>
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">Password</div>
          <p-password [(ngModel)]="value" [placeholder]="placeholder" [disabled]="disabled" [toggleMask]="true" [feedback]="false"
            (onFocus)="onPasswordFocus($event)" (onBlur)="onPasswordBlur($event)" styleClass="w-full" inputStyleClass="w-full" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.25rem; opacity:0.8;">InputNumber</div>
          <p-inputnumber [(ngModel)]="numberValue" [disabled]="disabled" [placeholder]="placeholder" inputStyleClass="w-full" styleClass="w-full" />
        </div>
      </div>
    `
    })
};

export const Disabled: Story = {
    args: {
        disabled: true,
        value: 'Cannot edit'
    },
    render: (args) => ({
        props: {
            ...args,
            numberValue: 0,
            onInput: action('input')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width: 28rem;">
        <input pInputText [(ngModel)]="value" [placeholder]="placeholder" [disabled]="disabled" />
        <p-inputnumber [(ngModel)]="numberValue" [disabled]="disabled" />
      </div>
    `
    })
};

export const WithPlaceholders: Story = {
    args: {
        placeholder: 'Search projects…',
        value: ''
    },
    render: (args) => ({
        props: {
            ...args,
            onInput: action('input')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap:1rem; max-width: 28rem;">
        <input pInputText [(ngModel)]="value" [placeholder]="placeholder" [disabled]="disabled" (input)="onInput($event)" />
        <textarea pTextarea [(ngModel)]="value" rows="2" [placeholder]="'Notes (optional)'" [disabled]="disabled" style="width:100%;"></textarea>
      </div>
    `
    })
};
