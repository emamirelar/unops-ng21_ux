import { CommonModule } from '@angular/common';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { action } from 'storybook/actions';
import { MOCK_BREADCRUMB_ITEMS, MOCK_MENU_ITEMS } from '@/stories/data/mock';
import type { MenuItem } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { TieredMenuModule } from 'primeng/tieredmenu';

const homeItem: MenuItem = { icon: 'pi pi-home', routerLink: '/' };

const meta: Meta = {
    title: 'Components/Navigation/Menu',
    decorators: [
        moduleMetadata({
            imports: [CommonModule, MenuModule, MenubarModule, TieredMenuModule, BreadcrumbModule, ButtonModule]
        })
    ],
    parameters: {
        docs: {
            description: {
                component:
                    'Navigation patterns: **Menu**, **Menubar**, **TieredMenu**, and **Breadcrumb**, driven by `MenuItem` models from `@/stories/data/mock`.'
            }
        }
    }
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => ({
        props: {
            items: MOCK_MENU_ITEMS,
            onShow: action('menuShow'),
            onHide: action('menuHide')
        },
        template: `
      <p-menu [model]="items" (onShow)="onShow($event)" (onHide)="onHide($event)" />
    `
    })
};

export const MenubarStory: Story = {
    render: () => ({
        props: {
            items: MOCK_MENU_ITEMS
        },
        template: `<p-menubar [model]="items" />`
    })
};

export const TieredMenuStory: Story = {
    render: () => ({
        props: {
            items: MOCK_MENU_ITEMS
        },
        template: `<p-tieredmenu [model]="items" />`
    })
};

export const BreadcrumbStory: Story = {
    render: () => ({
        props: {
            items: MOCK_BREADCRUMB_ITEMS,
            home: homeItem
        },
        template: `<p-breadcrumb [model]="items" [home]="home" />`
    })
};

export const PopupMenu: Story = {
    render: () => ({
        props: {
            items: MOCK_MENU_ITEMS,
            toggle: action('toggleMenu')
        },
        template: `
      <p-menu #popupMenu [popup]="true" appendTo="body" [model]="items" />
      <p-button
        label="Open menu"
        icon="pi pi-chevron-down"
        iconPos="right"
        (onClick)="popupMenu.toggle($event); toggle($event)"
      />
    `
    })
};

export const AllVariants: Story = {
    render: () => ({
        props: {
            items: MOCK_MENU_ITEMS,
            crumbs: MOCK_BREADCRUMB_ITEMS,
            home: homeItem
        },
        template: `
      <div class="flex flex-col gap-8">
        <div>
          <p class="text-sm font-medium mb-2">Menubar</p>
          <p-menubar [model]="items" />
        </div>
        <div>
          <p class="text-sm font-medium mb-2">Breadcrumb</p>
          <p-breadcrumb [model]="crumbs" [home]="home" />
        </div>
        <div class="flex flex-wrap gap-8">
          <div>
            <p class="text-sm font-medium mb-2">Menu</p>
            <p-menu [model]="items" />
          </div>
          <div>
            <p class="text-sm font-medium mb-2">Tiered</p>
            <p-tieredmenu [model]="items" />
          </div>
        </div>
      </div>
    `
    })
};

export const Edge_SingleItemMenu: Story = {
    render: () => ({
        props: {
            single: [{ label: 'Only action', icon: 'pi pi-star' }] satisfies MenuItem[]
        },
        template: `
      <p-menu [model]="single" />
    `
    })
};
