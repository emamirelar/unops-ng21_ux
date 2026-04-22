import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { action } from 'storybook/actions';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { SplitButtonModule } from 'primeng/splitbutton';
import { SEVERITY_OPTIONS } from '@/stories/data/mock';

type ButtonSeverity = (typeof SEVERITY_OPTIONS)[number];

type ButtonStoryArgs = {
    label: string;
    severity: ButtonSeverity;
    icon: string;
    disabled: boolean;
    loading: boolean;
    outlined: boolean;
    textStyle: boolean;
    raised: boolean;
    rounded: boolean;
    size: 'small' | 'large' | undefined;
};

const splitMenuAction = action('menuCommand');
const splitModel: MenuItem[] = [
    { label: 'Save', icon: 'pi pi-check', command: (): void => splitMenuAction('Save') },
    { label: 'Update', icon: 'pi pi-refresh', command: (): void => splitMenuAction('Update') },
    { label: 'Delete', icon: 'pi pi-trash', command: (): void => splitMenuAction('Delete') }
];

const meta: Meta<ButtonStoryArgs> = {
    title: 'Components/FormInputs/Button',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ButtonModule, ButtonGroupModule, SplitButtonModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'PrimeNG button controls for actions and navigation: standard `p-button`, grouped `p-buttongroup`, and `p-splitbutton` with a tiered menu for secondary commands. Supports severity, loading state, and outlined or text variants.'
            }
        }
    },
    args: {
        label: 'Submit',
        severity: 'primary',
        icon: '',
        disabled: false,
        loading: false,
        outlined: false,
        textStyle: false,
        raised: false,
        rounded: false,
        size: undefined
    },
    argTypes: {
        label: { control: 'text' },
        severity: {
            control: 'select',
            options: [...SEVERITY_OPTIONS]
        },
        icon: { control: 'text' },
        disabled: { control: 'boolean' },
        loading: { control: 'boolean' },
        outlined: { control: 'boolean' },
        textStyle: { control: 'boolean' },
        raised: { control: 'boolean' },
        rounded: { control: 'boolean' },
        size: {
            control: 'select',
            options: [undefined, 'small', 'large'],
            labels: { undefined: 'default' }
        }
    }
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            onClick: action('onClick')
        },
        template: `
      <p-button
        [label]="label"
        [severity]="severity"
        [icon]="icon || undefined"
        [disabled]="disabled"
        [loading]="loading"
        [outlined]="outlined"
        [text]="textStyle"
        [raised]="raised"
        [rounded]="rounded"
        [size]="size ?? undefined"
        (onClick)="onClick($event)"
      />
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            severities: [...SEVERITY_OPTIONS],
            onClick: action('onClick')
        },
        template: `
      <div style="display:grid; grid-template-columns: auto repeat(3, minmax(0,1fr)); gap: 0.5rem 0.75rem; align-items: center; max-width: 720px;">
        <span></span>
        <span>Solid</span>
        <span>Outlined</span>
        <span>Text</span>
        <ng-container *ngFor="let sev of severities">
          <strong style="text-transform: capitalize;">{{ sev }}</strong>
          <p-button [label]="'Action'" [severity]="sev" (onClick)="onClick($event)"></p-button>
          <p-button [label]="'Action'" [severity]="sev" [outlined]="true" (onClick)="onClick($event)"></p-button>
          <p-button [label]="'Action'" [severity]="sev" [text]="true" (onClick)="onClick($event)"></p-button>
        </ng-container>
      </div>
    `
    })
};

export const Disabled: Story = {
    args: {
        disabled: true,
        label: 'Disabled'
    },
    render: (args) => ({
        props: {
            ...args,
            onClick: action('onClick')
        },
        template: `
      <p-button
        [label]="label"
        [severity]="severity"
        [icon]="icon || undefined"
        [disabled]="disabled"
        [loading]="loading"
        [outlined]="outlined"
        [text]="textStyle"
        [raised]="raised"
        [rounded]="rounded"
        [size]="size ?? undefined"
        (onClick)="onClick($event)"
      />
    `
    })
};

export const IconOnly: Story = {
    args: {
        label: '',
        icon: 'pi pi-search'
    },
    render: (args) => ({
        props: {
            ...args,
            ariaLabel: 'Search',
            onClick: action('onClick')
        },
        template: `
      <p-button
        [icon]="icon || undefined"
        [severity]="severity"
        [disabled]="disabled"
        [loading]="loading"
        [outlined]="outlined"
        [text]="textStyle"
        [rounded]="true"
        [size]="size ?? undefined"
        [ariaLabel]="ariaLabel"
        (onClick)="onClick($event)"
      />
    `
    })
};

export const ButtonGroupStory: Story = {
    render: () => ({
        props: {
            onClick: action('onClick')
        },
        template: `
      <p-buttongroup>
        <p-button label="First" (onClick)="onClick($event)" />
        <p-button label="Second" severity="secondary" (onClick)="onClick($event)" />
        <p-button label="Third" severity="help" [outlined]="true" (onClick)="onClick($event)" />
      </p-buttongroup>
    `
    })
};

export const SplitButtonStory: Story = {
    render: () => ({
        props: {
            model: splitModel,
            onClick: action('onClick'),
            onDropdownClick: action('onDropdownClick'),
            onMenuShow: action('onMenuShow'),
            onMenuHide: action('onMenuHide')
        },
        template: `
      <p-splitbutton
        label="Save"
        [model]="model"
        icon="pi pi-save"
        (onClick)="onClick($event)"
        (onDropdownClick)="onDropdownClick($event)"
        (onMenuShow)="onMenuShow($event)"
        (onMenuHide)="onMenuHide($event)"
      />
    `
    })
};
