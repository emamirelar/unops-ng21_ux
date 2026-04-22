import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ConfirmationService } from 'primeng/api';
import { action } from 'storybook/actions';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';

@Component({
    selector: 'sb-confirm-dialog-trigger',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule],
    template: `
        <p-button label="Delete item" severity="danger" icon="pi pi-trash" (onClick)="open()" />
        <p-confirmdialog />
    `
})
class SbConfirmDialogTrigger {
    constructor(private readonly confirmation: ConfirmationService) {}

    open(): void {
        this.confirmation.confirm({
            header: 'Confirm Action',
            message: 'Are you sure you want to proceed? This cannot be undone.',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Yes, continue' },
            accept: () => {
                action('accept')();
            },
            reject: () => {
                action('reject')();
            }
        });
    }
}

@Component({
    selector: 'sb-confirm-popup-trigger',
    standalone: true,
    imports: [ButtonModule, ConfirmPopupModule],
    template: `
        <p-confirmpopup key="sbConfirmPopup" />
        <p-button label="Confirm in place" icon="pi pi-check" (onClick)="confirm($event)" />
    `
})
class SbConfirmPopupTrigger {
    constructor(private readonly confirmation: ConfirmationService) {}

    confirm(event: Event): void {
        this.confirmation.confirm({
            key: 'sbConfirmPopup',
            target: event.currentTarget ?? event.target ?? undefined,
            message: 'Apply this change next to the trigger?',
            icon: 'pi pi-question-circle',
            rejectButtonProps: { label: 'No', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Yes' },
            accept: () => {
                action('accept')();
            },
            reject: () => {
                action('reject')();
            }
        });
    }
}

@Component({
    selector: 'sb-confirm-danger-trigger',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule],
    template: `
        <p-button label="Permanently delete" severity="danger" icon="pi pi-times" (onClick)="open()" />
        <p-confirmdialog />
    `
})
class SbConfirmDangerTrigger {
    constructor(private readonly confirmation: ConfirmationService) {}

    open(): void {
        this.confirmation.confirm({
            header: 'Danger zone',
            message: 'This will permanently remove the selected records.',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'Keep', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Delete', severity: 'danger' },
            accept: () => {
                action('accept')();
            },
            reject: () => {
                action('reject')();
            }
        });
    }
}

@Component({
    selector: 'sb-confirm-long-message',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule],
    template: `
        <p-button label="Open long confirm" (onClick)="open()" />
        <p-confirmdialog [style]="{ width: 'min(90vw, 32rem)' }" />
    `
})
class SbConfirmLongMessage {
    constructor(private readonly confirmation: ConfirmationService) {}

    open(): void {
        this.confirmation.confirm({
            header: 'Review detailed terms',
            message:
                'This action applies retention policies across all linked workspaces, notifies owners, and starts a 30-day undo window. ' +
                'Ensure exports are complete before continuing. Do you still want to schedule this operation?',
            icon: 'pi pi-info-circle',
            rejectButtonProps: { label: 'Not now', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Schedule' },
            accept: () => {
                action('accept')();
            },
            reject: () => {
                action('reject')();
            }
        });
    }
}

@Component({
    selector: 'sb-confirm-gallery',
    standalone: true,
    imports: [ButtonModule, ConfirmDialogModule, ConfirmPopupModule],
    template: `
        <p-confirmdialog />
        <p-confirmpopup key="sbConfirmPopupGallery" />
        <div class="flex flex-col gap-4 max-w-xl">
            <div>
                <p class="text-sm text-muted-color mb-2">Confirm dialog</p>
                <p-button label="Delete item" severity="danger" icon="pi pi-trash" (onClick)="openDialog()" />
            </div>
            <div>
                <p class="text-sm text-muted-color mb-2">Confirm popup</p>
                <p-button label="Confirm in place" icon="pi pi-check" (onClick)="openPopup($event)" />
            </div>
            <div>
                <p class="text-sm text-muted-color mb-2">Danger accept styling</p>
                <p-button label="Permanently delete" severity="danger" icon="pi pi-times" (onClick)="openDanger()" />
            </div>
        </div>
    `
})
class SbConfirmGallery {
    constructor(private readonly confirmation: ConfirmationService) {}

    openDialog(): void {
        this.confirmation.confirm({
            header: 'Confirm Action',
            message: 'Are you sure you want to proceed? This cannot be undone.',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Yes, continue' },
            accept: () => action('accept')('dialog'),
            reject: () => action('reject')('dialog')
        });
    }

    openPopup(event: Event): void {
        this.confirmation.confirm({
            key: 'sbConfirmPopupGallery',
            target: event.currentTarget ?? event.target ?? undefined,
            message: 'Apply this change next to the trigger?',
            icon: 'pi pi-question-circle',
            rejectButtonProps: { label: 'No', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Yes' },
            accept: () => action('accept')('popup'),
            reject: () => action('reject')('popup')
        });
    }

    openDanger(): void {
        this.confirmation.confirm({
            header: 'Danger zone',
            message: 'This will permanently remove the selected records.',
            icon: 'pi pi-exclamation-triangle',
            rejectButtonProps: { label: 'Keep', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Delete', severity: 'danger' },
            accept: () => action('accept')('danger'),
            reject: () => action('reject')('danger')
        });
    }
}

const meta: Meta = {
    title: 'Components/Overlays/ConfirmDialog',
    decorators: [
        moduleMetadata({
            imports: [
                ButtonModule,
                ConfirmDialogModule,
                ConfirmPopupModule,
                SbConfirmDialogTrigger,
                SbConfirmPopupTrigger,
                SbConfirmDangerTrigger,
                SbConfirmLongMessage,
                SbConfirmGallery
            ],
            providers: [ConfirmationService]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'PrimeNG **ConfirmDialog** (`p-confirmdialog`) and **ConfirmPopup** (`p-confirmpopup`) require `ConfirmationService` in `providers`. Dialog confirmations are global; popups anchor to the `target` event from the triggering control.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        template: `<sb-confirm-dialog-trigger />`
    })
};

export const ConfirmPopupStory: Story = {
    render: () => ({
        template: `<sb-confirm-popup-trigger />`
    })
};

export const DangerConfirm: Story = {
    render: () => ({
        template: `<sb-confirm-danger-trigger />`
    })
};

export const AllVariants: Story = {
    render: () => ({
        template: `<sb-confirm-gallery />`
    })
};

export const Edge_LongMessage: Story = {
    render: () => ({
        template: `<sb-confirm-long-message />`
    })
};
