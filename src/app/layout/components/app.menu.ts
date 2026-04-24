import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';
import { environment } from '../../../environments/environment';

const SB = environment.storybookBaseUrl;

@Component({
    selector: '[app-menu]',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track $index) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    model: any[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-objects-column',
            routerLink: ['/']
        },
        { separator: true },
        {
            label: 'Partnerships',
            icon: 'pi pi-th-large',
            path: '/apps',
            items: [
                {
                    label: 'Opportunities',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/apps/opportunity']
                },
                {
                    label: 'Partners',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/apps/partners']
                },
                {
                    label: 'Agreements',
                    icon: 'pi pi-fw pi-file-check',
                    routerLink: ['/apps/agreements']
                },
                {
                    label: 'Contacts',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['/apps/contacts']
                },
                {
                    label: 'Interactions',
                    icon: 'pi pi-fw pi-comments',
                    routerLink: ['/apps/interactions']
                }
            ]
        },
        { separator: true },
        {
            label: 'Offices',
            icon: 'pi pi-fw pi-building',
            path: '/apps/offices',
            items: [
                {
                    label: 'Headquarters',
                    icon: 'pi pi-fw pi-home',
                    routerLink: ['/apps/offices/hq']
                },
                {
                    label: 'Multi-Country',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/apps/offices/mcos']
                },
                {
                    label: 'Global Liaison',
                    icon: 'pi pi-fw pi-link',
                    routerLink: ['/apps/offices/liaison']
                },
                {
                    label: 'Portfolio Hubs',
                    icon: 'pi pi-fw pi-th-large',
                    routerLink: ['/apps/offices/portfolios']
                },
                {
                    label: 'Project',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/apps/offices/project-centres']
                },
                {
                    label: 'Shared Services',
                    icon: 'pi pi-fw pi-server',
                    routerLink: ['/apps/offices/shared-services']
                }
            ]
        },
        { separator: true },
        {
            label: 'UNOPS-ng21_UX',
            icon: 'pi pi-fw pi-palette',
            path: '/ux',
            items: [
                {
                    label: 'Storybook',
                    icon: 'pi pi-fw pi-book',
                    url: SB,
                    target: '_blank'
                },
                {
                    label: 'Design System',
                    icon: 'pi pi-fw pi-sitemap',
                    path: '/design-system',
                    preventAutoActivate: true,
                    items: [
                        {
                            label: 'Foundations',
                            icon: 'pi pi-fw pi-box',
                            path: '/foundations',
                            items: [
                                { label: 'Accessibility', icon: 'pi pi-fw pi-eye', url: `${SB}/?path=/docs/foundations-accessibility--docs`, target: '_blank' },
                                { label: 'Design Tokens', icon: 'pi pi-fw pi-palette', url: `${SB}/?path=/docs/foundations-designtokens--docs`, target: '_blank' }
                            ]
                        },
                        {
                            label: 'Apps',
                            icon: 'pi pi-fw pi-th-large',
                            path: '/apps',
                            items: [
                                {
                                    label: 'CMS',
                                    icon: 'pi pi-fw pi-file-edit',
                                    path: '/cms',
                                    items: [
                                        { label: 'Detail', icon: 'pi pi-fw pi-file', routerLink: ['/apps/cms/detail'] },
                                        { label: 'Detail-2', icon: 'pi pi-fw pi-file', routerLink: ['/apps/cms/detail2'] },
                                        { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/apps/cms/list'] },
                                        { label: 'Edit', icon: 'pi pi-fw pi-pencil', routerLink: ['/apps/cms/edit'] }
                                    ]
                                },
                                { label: 'Files', icon: 'pi pi-fw pi-folder', routerLink: ['/apps/files'] },
                                { label: 'Task List', icon: 'pi pi-fw pi-check-square', routerLink: ['/apps/tasklist'] }
                            ]
                        },
                        {
                            label: 'UI Kit',
                            icon: 'pi pi-fw pi-star',
                            path: '/uikit',
                            items: [
                                { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                                { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                                { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
                                { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                                { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
                                { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
                                { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                                { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                                { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
                                { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'] },
                                { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                                { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
                                { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
                                { label: 'Timeline', icon: 'pi pi-fw pi-calendar', routerLink: ['/uikit/timeline'] },
                                { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
                            ]
                        },
                        {
                            label: 'Pages',
                            icon: 'pi pi-fw pi-briefcase',
                            path: '/pages',
                            items: [
                                { label: 'Landing', icon: 'pi pi-fw pi-globe', routerLink: ['/landing'] },
                                {
                                    label: 'Auth',
                                    icon: 'pi pi-fw pi-user',
                                    path: '/auth',
                                    items: [
                                        { label: 'Login', icon: 'pi pi-fw pi-sign-in', routerLink: ['/auth/login'] },
                                        { label: 'Error', icon: 'pi pi-fw pi-times-circle', routerLink: ['/auth/error'] },
                                        { label: 'Access Denied', icon: 'pi pi-fw pi-lock', routerLink: ['/auth/access'] },
                                        { label: 'Register', icon: 'pi pi-fw pi-user-plus', routerLink: ['/auth/register'] },
                                        { label: 'Forgot Password', icon: 'pi pi-fw pi-question', routerLink: ['/auth/forgot-password'] },
                                        { label: 'New Password', icon: 'pi pi-fw pi-cog', routerLink: ['/auth/new-password'] },
                                        { label: 'Verification', icon: 'pi pi-fw pi-envelope', routerLink: ['/auth/verification'] },
                                        { label: 'Lock Screen', icon: 'pi pi-fw pi-eye-slash', routerLink: ['/auth/lock-screen'] }
                                    ]
                                },
                                { label: 'Crud', icon: 'pi pi-fw pi-pencil', routerLink: ['/pages/crud'] },
                                { label: 'Invoice', icon: 'pi pi-fw pi-dollar', routerLink: ['/pages/invoice'] },
                                { label: 'Help', icon: 'pi pi-fw pi-question-circle', routerLink: ['/pages/help'] },
                                { label: 'Oops', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/auth/oops'] },
                                { label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/pages/notfound'] },
                                { label: 'Empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] },
                                { label: 'FAQ', icon: 'pi pi-fw pi-question', routerLink: ['/pages/faq'] },
                                { label: 'Contact Us', icon: 'pi pi-fw pi-phone', routerLink: ['/landing/contact'] }
                            ]
                        },
                        {
                            label: 'E-Commerce',
                            icon: 'pi pi-fw pi-wallet',
                            path: '/ecommerce',
                            items: [
                                { label: 'Product Overview', icon: 'pi pi-fw pi-image', routerLink: ['/ecommerce/product-overview'] },
                                { label: 'Product List', icon: 'pi pi-fw pi-list', routerLink: ['/ecommerce/product-list'] },
                                { label: 'New Product', icon: 'pi pi-fw pi-plus', routerLink: ['/ecommerce/new-product'] },
                                { label: 'Shopping Cart', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['/ecommerce/shopping-cart'] },
                                { label: 'Checkout Form', icon: 'pi pi-fw pi-check-square', routerLink: ['/ecommerce/checkout-form'] },
                                { label: 'Order History', icon: 'pi pi-fw pi-history', routerLink: ['/ecommerce/order-history'] },
                                { label: 'Order Summary', icon: 'pi pi-fw pi-file', routerLink: ['/ecommerce/order-summary'] }
                            ]
                        },
                        {
                            label: 'User Management',
                            icon: 'pi pi-fw pi-user',
                            path: '/profile',
                            items: [
                                { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/profile/list'] },
                                { label: 'Create', icon: 'pi pi-fw pi-plus', routerLink: ['/profile/create'] }
                            ]
                        },
                        {
                            label: 'Hierarchy',
                            icon: 'pi pi-fw pi-align-left',
                            path: '/hierarchy',
                            items: [
                                {
                                    label: 'Submenu 1',
                                    icon: 'pi pi-fw pi-align-left',
                                    path: '/submenu_1',
                                    items: [
                                        {
                                            label: 'Submenu 1.1',
                                            icon: 'pi pi-fw pi-align-left',
                                            path: '/submenu_1_1',
                                            items: [
                                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-align-left' },
                                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-align-left' },
                                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-align-left' }
                                            ]
                                        },
                                        {
                                            label: 'Submenu 1.2',
                                            icon: 'pi pi-fw pi-align-left',
                                            path: '/submenu_1_2',
                                            items: [
                                                { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-align-left' }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    label: 'Submenu 2',
                                    icon: 'pi pi-fw pi-align-left',
                                    path: '/submenu_2',
                                    items: [
                                        {
                                            label: 'Submenu 2.1',
                                            icon: 'pi pi-fw pi-align-left',
                                            path: '/submenu_2_1',
                                            items: [
                                                { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-align-left' },
                                                { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-align-left' }
                                            ]
                                        },
                                        {
                                            label: 'Submenu 2.2',
                                            icon: 'pi pi-fw pi-align-left',
                                            path: '/submenu_2_2',
                                            items: [
                                                { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-align-left' }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            label: 'Documentation',
                            icon: 'pi pi-fw pi-info-circle',
                            routerLink: ['/documentation']
                        }
                    ]
                }
            ]
        }
    ];
}
