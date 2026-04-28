import { type IsActiveMatchOptions } from '@angular/router';
import { LayoutService, type MenuItem } from '@emamirelar/ux';

const SUBSET_MATCH: IsActiveMatchOptions = { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' };

/** Demo shell menu for the UNOPS-ng21_UX reference application. */
export function createDemoAppMenu(layoutService: LayoutService, storybookBaseUrl: string): MenuItem[] {
    return [
        {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: ['/']
        },
        { separator: true },
        {
            label: 'Partnerships',
            icon: 'pi pi-th-large',
            path: '/apps',
            items: [
                {
                    label: 'Partners',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/apps/partners'],
                    routerLinkActiveOptions: SUBSET_MATCH
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
                },
                {
                    label: 'Agreements',
                    icon: 'pi pi-fw pi-file-check',
                    routerLink: ['/apps/agreements']
                },
                {
                    label: 'Opportunities',
                    icon: 'pi pi-fw pi-briefcase',
                    routerLink: ['/apps/opportunity']
                }
            ]
        },
        { separator: true },
        {
            label: 'Operation Tools',
            icon: 'pi pi-fw pi-wrench',
            path: '/ops',
            items: [
                {
                    label: 'Offices',
                    icon: 'pi pi-fw pi-building',
                    routerLink: ['/apps/offices']
                }
            ]
        },
        { separator: true },
        {
            label: 'Administration',
            icon: 'pi pi-fw pi-building-columns',
            path: '/admin',
            items: [
                {
                    label: 'Entity Manager',
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: ['/admin/entity-manager']
                },
                {
                    label: 'Partner Tree',
                    icon: 'pi pi-fw pi-share-alt',
                    routerLink: ['/admin/partner-tree']
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
                    label: 'Theme Configurator',
                    icon: 'pi pi-fw pi-cog',
                    command: () => layoutService.toggleConfigSidebar()
                },
                {
                    label: 'Storybook',
                    icon: 'pi pi-fw pi-book',
                    url: storybookBaseUrl,
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
                                { label: 'Accessibility', icon: 'pi pi-fw pi-eye', url: `${storybookBaseUrl}/?path=/docs/foundations-accessibility--docs`, target: '_blank' },
                                { label: 'Design Tokens', icon: 'pi pi-fw pi-palette', url: `${storybookBaseUrl}/?path=/docs/foundations-designtokens--docs`, target: '_blank' }
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
