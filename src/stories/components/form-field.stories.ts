import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { action } from 'storybook/actions';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FloatLabelModule } from 'primeng/floatlabel';
import { IftaLabelModule } from 'primeng/iftalabel';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';

const meta: Meta = {
    title: 'Components/FormInputs/FormField',
    decorators: [
        moduleMetadata({
            imports: [
                CommonModule,
                FormsModule,
                InputTextModule,
                IconFieldModule,
                InputIconModule,
                FloatLabelModule,
                IftaLabelModule,
                InputGroupModule,
                InputGroupAddonModule
            ]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Layout helpers for form controls: `p-iconfield` with `p-inputicon`, `p-floatlabel` and `p-iftalabel` for label placement, and `p-inputgroup` with `p-inputgroupaddon` for prefixes and suffixes around inputs.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        props: {
            query: '',
            onInput: action('input')
        },
        template: `
      <p-iconfield>
        <p-inputicon class="pi pi-search" />
        <input pInputText [(ngModel)]="query" placeholder="Search" (input)="onInput($event)" style="width: 100%;" />
      </p-iconfield>
    `
    })
};

export const FloatLabelStory: Story = {
    render: () => ({
        props: {
            username: '',
            onInput: action('input')
        },
        template: `
      <p-floatlabel variant="on">
        <input pInputText id="float_user" [(ngModel)]="username" autocomplete="off" (input)="onInput($event)" style="width: 100%;" />
        <label for="float_user">Username</label>
      </p-floatlabel>
    `
    })
};

export const IftaLabelStory: Story = {
    render: () => ({
        props: {
            email: '',
            onInput: action('input')
        },
        template: `
      <p-iftalabel>
        <input pInputText id="ifta_email" [(ngModel)]="email" type="email" autocomplete="off" (input)="onInput($event)" style="width: 100%;" />
        <label for="ifta_email">Email</label>
      </p-iftalabel>
    `
    })
};

export const InputGroupStory: Story = {
    render: () => ({
        props: {
            domain: 'example',
            onInput: action('input')
        },
        template: `
      <p-inputgroup>
        <p-inputgroup-addon>https://</p-inputgroup-addon>
        <input pInputText [(ngModel)]="domain" placeholder="subdomain" (input)="onInput($event)" />
        <p-inputgroup-addon>.app</p-inputgroup-addon>
      </p-inputgroup>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            q: '',
            user: '',
            site: '',
            onInput: action('input')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 1.5rem; max-width: 28rem;">
        <p-iconfield>
          <p-inputicon class="pi pi-filter" />
          <input pInputText [(ngModel)]="q" placeholder="Filter" (input)="onInput($event)" style="width: 100%;" />
        </p-iconfield>
        <p-floatlabel variant="in">
          <input pInputText id="av_user" [(ngModel)]="user" (input)="onInput($event)" style="width: 100%;" />
          <label for="av_user">Display name</label>
        </p-floatlabel>
        <p-inputgroup>
          <p-inputgroup-addon><i class="pi pi-globe"></i></p-inputgroup-addon>
          <input pInputText [(ngModel)]="site" placeholder="yoursite" (input)="onInput($event)" />
          <p-inputgroup-addon>.com</p-inputgroup-addon>
        </p-inputgroup>
      </div>
    `
    })
};
