import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from 'storybook/actions';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';

type CityOption = { label: string; value: string };

const cityOptions: CityOption[] = [
    { label: 'New York', value: 'NY' },
    { label: 'Rome', value: 'RM' },
    { label: 'London', value: 'LN' }
];

const selectButtonOptions: CityOption[] = [
    { label: 'List', value: 'list' },
    { label: 'Grid', value: 'grid' }
];

const meta: Meta = {
    title: 'Components/FormInputs/Toggle',
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                CheckboxModule,
                RadioButtonModule,
                ToggleSwitchModule,
                ToggleButtonModule,
                SelectButtonModule
            ]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Boolean and single-choice inputs: `p-checkbox`, `p-radiobutton` groups, `p-toggleswitch`, `p-togglebutton`, and segmented `p-selectbutton`. Suitable for settings, feature flags, and layout mode toggles.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        props: {
            checked: true,
            onChange: action('onChange')
        },
        template: `
      <p-checkbox [(ngModel)]="checked" [binary]="true" inputId="story_cb" (onChange)="onChange($event)" />
      <label for="story_cb" style="margin-left: 0.5rem;">Accept terms</label>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            cityOptions,
            checked: false,
            city: 'RM',
            switchOn: true,
            togglePressed: false,
            onCheckboxChange: action('checkboxOnChange'),
            onRadioClick: action('radioOnClick'),
            onSwitchChange: action('toggleSwitchOnChange'),
            onToggleButtonChange: action('toggleButtonOnChange')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 1.25rem; max-width: 24rem;">
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Checkbox</div>
          <p-checkbox [(ngModel)]="checked" [binary]="true" inputId="av_cb" (onChange)="onCheckboxChange($event)" />
          <label for="av_cb" style="margin-left: 0.5rem;">Remember me</label>
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Radio group (3 options)</div>
          <div *ngFor="let opt of cityOptions" style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;">
            <p-radiobutton name="city" [value]="opt.value" [(ngModel)]="city" [inputId]="'city_' + opt.value" (onClick)="onRadioClick($event)" />
            <label [for]="'city_' + opt.value">{{ opt.label }}</label>
          </div>
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">ToggleSwitch</div>
          <p-toggleswitch [(ngModel)]="switchOn" inputId="av_sw" (onChange)="onSwitchChange($event)" />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">ToggleButton</div>
          <p-togglebutton
            [(ngModel)]="togglePressed"
            onLabel="On"
            offLabel="Off"
            onIcon="pi pi-check"
            offIcon="pi pi-times"
            (onChange)="onToggleButtonChange($event)"
          />
        </div>
      </div>
    `
    })
};

export const Disabled: Story = {
    render: () => ({
        props: {
            cityOptions,
            checked: true,
            city: 'NY',
            switchOn: false,
            onChange: action('onChange')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 1rem; max-width: 24rem;">
        <div>
          <p-checkbox [(ngModel)]="checked" [binary]="true" [disabled]="true" inputId="dis_cb" />
          <label for="dis_cb" style="margin-left: 0.5rem;">Disabled checkbox</label>
        </div>
        <div *ngFor="let opt of cityOptions" style="display:flex; align-items:center; gap:0.5rem;">
          <p-radiobutton name="city_dis" [value]="opt.value" [(ngModel)]="city" [inputId]="'dis_' + opt.value" [disabled]="true" />
          <label [for]="'dis_' + opt.value">{{ opt.label }}</label>
        </div>
        <p-toggleswitch [(ngModel)]="switchOn" [disabled]="true" inputId="dis_sw" />
      </div>
    `
    })
};

export const SelectButtonStory: Story = {
    render: () => ({
        props: {
            selectButtonOptions,
            layoutMode: 'list',
            onChange: action('onChange'),
            onOptionClick: action('onOptionClick')
        },
        template: `
      <p-selectbutton
        [options]="selectButtonOptions"
        optionLabel="label"
        optionValue="value"
        [(ngModel)]="layoutMode"
        (onChange)="onChange($event)"
        (onOptionClick)="onOptionClick($event)"
      />
    `
    })
};
