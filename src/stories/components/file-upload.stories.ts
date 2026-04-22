import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig, moduleMetadata } from '@storybook/angular';
import { provideHttpClient } from '@angular/common/http';
import { action } from 'storybook/actions';
import type { FileUploadHandlerEvent } from 'primeng/types/fileupload';
import { FileUploadModule } from 'primeng/fileupload';

type FileUploadStoryArgs = {
    mode: 'basic' | 'advanced';
    multiple: boolean;
    accept: string;
    maxFileSize: number;
};

const meta: Meta<FileUploadStoryArgs> = {
    title: 'Components/FormInputs/FileUpload',
    decorators: [
        applicationConfig({
            providers: [provideHttpClient()]
        }),
        moduleMetadata({
            imports: [FileUploadModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'PrimeNG `p-fileupload` supports basic single-button picking and an advanced layout with drag-and-drop, file list, and optional auto upload. Use `customUpload` in stories to log actions without requiring a real backend.'
            }
        }
    },
    args: {
        mode: 'advanced',
        multiple: false,
        accept: '*',
        maxFileSize: 1_000_000
    },
    argTypes: {
        mode: {
            control: 'select',
            options: ['basic', 'advanced']
        },
        multiple: { control: 'boolean' },
        accept: { control: 'text' },
        maxFileSize: { control: 'number' }
    }
};

export default meta;
type Story = StoryObj<FileUploadStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            uploadHandler: (event: FileUploadHandlerEvent): void => {
                action('uploadHandler')(event);
            },
            onSelect: action('onSelect'),
            onClear: action('onClear'),
            onRemove: action('onRemove'),
            onError: action('onError')
        },
        template: `
      <p-fileupload
        [mode]="mode"
        [multiple]="multiple"
        [accept]="accept"
        [maxFileSize]="maxFileSize"
        [customUpload]="true"
        (uploadHandler)="uploadHandler($event)"
        (onSelect)="onSelect($event)"
        (onClear)="onClear($event)"
        (onRemove)="onRemove($event)"
        (onError)="onError($event)"
      />
    `
    })
};

export const AllVariants: Story = {
    render: (args) => ({
        props: {
            ...args,
            uploadHandler: (event: FileUploadHandlerEvent): void => {
                action('uploadHandler')(event);
            },
            onSelect: action('onSelect')
        },
        template: `
      <div style="display:flex; flex-direction:column; gap: 2rem;">
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Advanced</div>
          <p-fileupload
            mode="advanced"
            [multiple]="multiple"
            [accept]="accept"
            [maxFileSize]="maxFileSize"
            [customUpload]="true"
            (uploadHandler)="uploadHandler($event)"
            (onSelect)="onSelect($event)"
          />
        </div>
        <div>
          <div style="font-size:0.75rem; margin-bottom:0.35rem; opacity:0.8;">Basic</div>
          <p-fileupload
            mode="basic"
            [multiple]="multiple"
            [accept]="accept"
            [maxFileSize]="maxFileSize"
            [customUpload]="true"
            chooseLabel="Browse"
            (uploadHandler)="uploadHandler($event)"
            (onSelect)="onSelect($event)"
          />
        </div>
      </div>
    `
    })
};

export const BasicMode: Story = {
    args: {
        mode: 'basic',
        multiple: false
    },
    render: (args) => ({
        props: {
            ...args,
            uploadHandler: (event: FileUploadHandlerEvent): void => {
                action('uploadHandler')(event);
            },
            onSelect: action('onSelect')
        },
        template: `
      <p-fileupload
        mode="basic"
        [multiple]="multiple"
        [accept]="accept"
        [maxFileSize]="maxFileSize"
        [customUpload]="true"
        chooseLabel="Choose"
        (uploadHandler)="uploadHandler($event)"
        (onSelect)="onSelect($event)"
      />
    `
    })
};

export const MultipleFiles: Story = {
    args: {
        multiple: true,
        mode: 'advanced'
    },
    render: (args) => ({
        props: {
            ...args,
            uploadHandler: (event: FileUploadHandlerEvent): void => {
                action('uploadHandler')(event);
            },
            onSelect: action('onSelect')
        },
        template: `
      <p-fileupload
        mode="advanced"
        [multiple]="true"
        [accept]="accept"
        [maxFileSize]="maxFileSize"
        [customUpload]="true"
        (uploadHandler)="uploadHandler($event)"
        (onSelect)="onSelect($event)"
      />
    `
    })
};

export const StrictAcceptSmallMax: Story = {
    args: {
        accept: 'image/*',
        maxFileSize: 50_000,
        multiple: false,
        mode: 'advanced'
    },
    render: (args) => ({
        props: {
            ...args,
            uploadHandler: (event: FileUploadHandlerEvent): void => {
                action('uploadHandler')(event);
            },
            onSelect: action('onSelect'),
            onError: action('onError')
        },
        template: `
      <p-fileupload
        mode="advanced"
        [multiple]="multiple"
        accept="image/*"
        [maxFileSize]="maxFileSize"
        [customUpload]="true"
        (uploadHandler)="uploadHandler($event)"
        (onSelect)="onSelect($event)"
        (onError)="onError($event)"
      />
    `
    })
};
