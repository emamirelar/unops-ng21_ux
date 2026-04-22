import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';

type MessageSeverity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

type MessageStoryArgs = {
    severity: MessageSeverity;
    messageText: string;
    closable: boolean;
};

@Component({
    selector: 'sb-toast-gallery',
    standalone: true,
    imports: [CommonModule, ToastModule, MessageModule, ButtonModule],
    template: `
        <div class="flex flex-col gap-6">
            <div>
                <p class="text-sm font-medium mb-2">Toast (MessageService)</p>
                <div class="flex flex-wrap gap-2">
                    <p-button label="Success" severity="success" (onClick)="showSuccess()" />
                    <p-button label="Info" severity="info" (onClick)="showInfo()" />
                    <p-button label="Warn" severity="warn" (onClick)="showWarn()" />
                    <p-button label="Error" severity="danger" (onClick)="showError()" />
                </div>
                <p-toast />
            </div>
            <div>
                <p class="text-sm font-medium mb-2">Inline messages</p>
                <div class="flex flex-col gap-2">
                    <p-message severity="info">Inline info</p-message>
                    <p-message severity="success">Inline success</p-message>
                </div>
            </div>
        </div>
    `,
    providers: [MessageService]
})
class SbToastGallery {
    constructor(private readonly messages: MessageService) {}

    showSuccess(): void {
        this.messages.add({ severity: 'success', summary: 'Saved', detail: 'Changes were persisted.' });
        action('toast')({ kind: 'success' });
    }

    showInfo(): void {
        this.messages.add({ severity: 'info', summary: 'FYI', detail: 'Background sync is running.' });
        action('toast')({ kind: 'info' });
    }

    showWarn(): void {
        this.messages.add({ severity: 'warn', summary: 'Attention', detail: 'Quota almost reached.' });
        action('toast')({ kind: 'warn' });
    }

    showError(): void {
        this.messages.add({ severity: 'error', summary: 'Failed', detail: 'The request could not be completed.' });
        action('toast')({ kind: 'error' });
    }
}

const meta: Meta<MessageStoryArgs> = {
    title: 'Components/Feedback/Toast',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ToastModule, MessageModule, ButtonModule, SbToastGallery],
            providers: [MessageService]
        })
    ],
    args: {
        severity: 'info',
        messageText: 'This is an informational message.',
        closable: false
    },
    argTypes: {
        severity: {
            control: 'select',
            options: ['success', 'info', 'warn', 'error', 'secondary', 'contrast'] satisfies MessageSeverity[]
        },
        messageText: { control: 'text' },
        closable: { control: 'boolean' }
    },
    parameters: {
        docs: {
            description: {
                component:
                    '**Toast** (`p-toast`) displays transient notifications via `MessageService`; **Message** (`p-message`) is ideal for inline feedback. This file demonstrates both patterns.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<MessageStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            onClose: action('messageClose')
        },
        template: `
      <p-message [severity]="severity" [closable]="closable" (onClose)="onClose($event)">
        {{ messageText }}
      </p-message>
    `
    })
};

export const AllSeverities: Story = {
    render: () => ({
        template: `
      <div class="flex flex-col gap-3 max-w-xl">
        <p-message severity="success">Success Message</p-message>
        <p-message severity="info">Info Message</p-message>
        <p-message severity="warn">Warn Message</p-message>
        <p-message severity="error">Error Message</p-message>
        <p-message severity="secondary">Secondary Message</p-message>
        <p-message severity="contrast">Contrast Message</p-message>
      </div>
    `
    })
};

export const Closable: Story = {
    render: () => ({
        props: {
            onClose: action('messageClose')
        },
        template: `
      <p-message severity="warn" [closable]="true" (onClose)="onClose($event)">
        You can dismiss this warning with the close control.
      </p-message>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        template: `<sb-toast-gallery />`
    })
};

const longMessageText =
    'This inline message demonstrates very long copy that should wrap within the layout without breaking surrounding structure. ' +
    'It can be used for detailed validation summaries or policy excerpts.';

export const Edge_LongCopy: Story = {
    args: {
        severity: 'info',
        messageText: longMessageText,
        closable: true
    },
    render: (args) => ({
        props: args,
        template: `
      <p-message [severity]="severity" [closable]="closable">
        {{ messageText }}
      </p-message>
    `
    })
};
