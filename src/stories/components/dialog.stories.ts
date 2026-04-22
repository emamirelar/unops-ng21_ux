import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';

type DialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

@Component({
    selector: 'sb-dialog-drawer-demo',
    standalone: true,
    imports: [ButtonModule, DrawerModule],
    template: `
        <p-button label="Open drawer" (onClick)="openDrawer()" />
        <p-drawer
            [(visible)]="drawerVisible"
            header="Details panel"
            position="right"
            [style]="{ width: '22rem' }"
            (onHide)="onHide()"
        >
            <p class="m-0 leading-normal">
                Drawer content slides in from the right. Use it for secondary workflows without leaving the page.
            </p>
        </p-drawer>
    `
})
class SbDialogDrawerDemo {
    drawerVisible = false;

    readonly onHide = action('onHide');

    openDrawer(): void {
        this.drawerVisible = true;
        action('openDrawer')();
    }
}

@Component({
    selector: 'sb-dialog-variants-demo',
    standalone: true,
    imports: [CommonModule, DialogModule, ButtonModule],
    template: `
        <div class="flex flex-wrap gap-2 mb-4">
            <p-button label="Center dialog" (onClick)="open('center')" />
            <p-button label="Left dialog" (onClick)="open('left')" />
            <p-button label="Top dialog" (onClick)="open('top')" />
        </div>
        <p-dialog
            header="Center"
            [(visible)]="centerVisible"
            position="center"
            [modal]="true"
            [style]="{ width: '320px' }"
            (onHide)="onHideCenter()"
        >
            <p class="m-0">Centered modal.</p>
            <ng-template #footer>
                <p-button label="Close" (onClick)="centerVisible = false" />
            </ng-template>
        </p-dialog>
        <p-dialog
            header="Left"
            [(visible)]="leftVisible"
            position="left"
            [modal]="true"
            [style]="{ width: '280px' }"
            (onHide)="onHideLeft()"
        >
            <p class="m-0">Docked to the left.</p>
            <ng-template #footer>
                <p-button label="Close" (onClick)="leftVisible = false" />
            </ng-template>
        </p-dialog>
        <p-dialog
            header="Top"
            [(visible)]="topVisible"
            position="top"
            [modal]="true"
            [style]="{ width: '360px' }"
            (onHide)="onHideTop()"
        >
            <p class="m-0">Attached to the top edge.</p>
            <ng-template #footer>
                <p-button label="Close" (onClick)="topVisible = false" />
            </ng-template>
        </p-dialog>
    `
})
class SbDialogVariantsDemo {
    centerVisible = false;

    leftVisible = false;

    topVisible = false;

    readonly onHideCenter = action('onHideCenter');

    readonly onHideLeft = action('onHideLeft');

    readonly onHideTop = action('onHideTop');

    open(kind: 'center' | 'left' | 'top'): void {
        if (kind === 'center') this.centerVisible = true;
        if (kind === 'left') this.leftVisible = true;
        if (kind === 'top') this.topVisible = true;
        action('open')(kind);
    }
}

type DialogStoryArgs = {
    header: string;
    visible: boolean;
    modal: boolean;
    draggable: boolean;
    closable: boolean;
    position: DialogPosition;
    onHide: () => void;
};

const meta: Meta<DialogStoryArgs> = {
    title: 'Components/Overlays/Dialog',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, DialogModule, DrawerModule, ButtonModule, SbDialogDrawerDemo, SbDialogVariantsDemo]
        })
    ],
    args: {
        header: 'Edit record',
        visible: true,
        modal: true,
        draggable: true,
        closable: true,
        position: 'center',
        onHide: action('onHide')
    },
    argTypes: {
        header: { control: 'text' },
        visible: { control: 'boolean' },
        modal: { control: 'boolean' },
        draggable: { control: 'boolean' },
        closable: { control: 'boolean' },
        position: {
            control: 'select',
            options: ['left', 'right', 'top', 'bottom', 'center'] satisfies DialogPosition[]
        },
        onHide: { action: 'onHide' }
    },
    parameters: {
        docs: {
            description: {
                component:
                    'PrimeNG **Dialog** (`p-dialog`) and **Drawer** (`p-drawer`) overlays: modal panels with headers, footers, positioning, and optional maximize. Use `[(visible)]` with `(onHide)` for lifecycle and Storybook actions.'
            }
        }
    }
};

export default meta;
type Story = StoryObj<DialogStoryArgs>;

export const Default: Story = {
    render: (args) => ({
        props: {
            ...args,
            onHide: () => {
                args.onHide();
            }
        },
        template: `
      <p-dialog
        [header]="header"
        [(visible)]="visible"
        [modal]="modal"
        [draggable]="draggable"
        [closable]="closable"
        [position]="position"
        [style]="{ width: '400px' }"
        (onHide)="onHide()"
      >
        <p class="m-0 leading-normal">
          Review changes before saving. You can drag this dialog when draggable is enabled.
        </p>
        <ng-template #footer>
          <p-button label="Cancel" severity="secondary" [outlined]="true" (onClick)="visible = false" />
          <p-button label="Save" (onClick)="visible = false; onHide()" />
        </ng-template>
      </p-dialog>
      <p-button *ngIf="!visible" label="Open dialog" (onClick)="visible = true" />
    `
    })
};

export const DrawerStory: Story = {
    render: () => ({
        template: `<sb-dialog-drawer-demo />`
    })
};

export const FullScreen: Story = {
    render: () => ({
        props: {
            visible: true,
            onHide: action('onHide')
        },
        template: `
      <p-dialog
        header="Maximizable dialog"
        [(visible)]="visible"
        [modal]="true"
        [maximizable]="true"
        [style]="{ width: '50vw' }"
        (onHide)="onHide()"
      >
        <p class="m-0 leading-normal">
          Toggle maximize from the header. Full-screen layouts work well for rich forms or previews.
        </p>
        <ng-template #footer>
          <p-button label="Close" severity="secondary" (onClick)="visible = false; onHide()" />
        </ng-template>
      </p-dialog>
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        template: `<sb-dialog-variants-demo />`
    })
};

export const Edge_NonDismissible: Story = {
    render: () => ({
        props: {
            visible: true,
            onHide: action('onHide')
        },
        template: `
      <p-dialog
        header="Restricted close"
        [(visible)]="visible"
        [modal]="true"
        [closable]="false"
        [closeOnEscape]="false"
        [dismissableMask]="false"
        [style]="{ width: '400px' }"
        (onHide)="onHide()"
      >
        <p class="m-0">
          Mask click, escape, and the header close icon are disabled. Use the footer action to dismiss (edge case for critical confirmations).
        </p>
        <ng-template #footer>
          <p-button label="Acknowledge" (onClick)="visible = false; onHide()" />
        </ng-template>
      </p-dialog>
    `
    })
};
