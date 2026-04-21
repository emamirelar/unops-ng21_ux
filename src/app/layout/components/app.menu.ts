import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';

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
        // { separator: true },
        // {
        //     label: 'Prime Blocks',
        //     icon: 'pi pi-fw pi-prime',
        //     path: '/blocks',
        //     items: [
        //         {
        //             label: 'Free Blocks',
        //             icon: 'pi pi-fw pi-eye',
        //             routerLink: ['/blocks']
        //         },
        //         {
        //             label: 'All Blocks',
        //             icon: 'pi pi-fw pi-globe',
        //             url: ['https://primeblocks.org'],
        //             target: '_blank'
        //         }
        //     ]
        // },
        // { separator: true },
        // {
        //     label: 'Utilities',
        //     icon: 'pi pi-fw pi-compass',
        //     path: '/utilities',
        //     items: [
        //         {
        //             label: 'Figma',
        //             icon: 'pi pi-fw pi-pencil',
        //             url: ['https://www.figma.com/design/3BgdXCQjva5nUEO8OidU1B/Preview-%7C-UNOPS-NG-UX?node-id=0-1&t=KdfljgRtYLzFPfKL-1'],
        //             target: '_blank'
        //         }
        //     ]
        // },
        // { separator: true },
        // {
        //     label: 'Pages',
        //     icon: 'pi pi-fw pi-briefcase',
        //     path: '/pages',
        //     items: [
        //         {
        //             label: 'Landing',
        //             icon: 'pi pi-fw pi-globe',
        //             routerLink: ['/landing']
        //         },
        //         {
        //             label: 'Auth',
        //             icon: 'pi pi-fw pi-user',
        //             path: '/auth',
        //             items: [
        //                 {
        //                     label: 'Login',
        //                     icon: 'pi pi-fw pi-sign-in',
        //                     routerLink: ['/auth/login']
        //                 },
        //                 {
        //                     label: 'Error',
        //                     icon: 'pi pi-fw pi-times-circle',
        //                     routerLink: ['/auth/error']
        //                 },
        //                 {
        //                     label: 'Access Denied',
        //                     icon: 'pi pi-fw pi-lock',
        //                     routerLink: ['/auth/access']
        //                 },
        //                 {
        //                     label: 'Register',
        //                     icon: 'pi pi-fw pi-user-plus',
        //                     routerLink: ['/auth/register']
        //                 },
        //                 {
        //                     label: 'Forgot Password',
        //                     icon: 'pi pi-fw pi-question',
        //                     routerLink: ['/auth/forgot-password']
        //                 },
        //                 {
        //                     label: 'New Password',
        //                     icon: 'pi pi-fw pi-cog',
        //                     routerLink: ['/auth/new-password']
        //                 },
        //                 {
        //                     label: 'Verification',
        //                     icon: 'pi pi-fw pi-envelope',
        //                     routerLink: ['/auth/verification']
        //                 },
        //                 {
        //                     label: 'Lock Screen',
        //                     icon: 'pi pi-fw pi-eye-slash',
        //                     routerLink: ['/auth/lock-screen']
        //                 }
        //             ]
        //         },

        //         {
        //             label: 'Crud',
        //             icon: 'pi pi-fw pi-pencil',
        //             routerLink: ['/pages/crud']
        //         },
        //         {
        //             label: 'Invoice',
        //             icon: 'pi pi-fw pi-dollar',
        //             routerLink: ['/pages/invoice']
        //         },
        //         {
        //             label: 'Help',
        //             icon: 'pi pi-fw pi-question-circle',
        //             routerLink: ['/pages/help']
        //         },
        //         {
        //             label: 'Oops',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             routerLink: ['/auth/oops']
        //         },
        //         {
        //             label: 'Not Found',
        //             icon: 'pi pi-fw pi-exclamation-circle',
        //             routerLink: ['/pages/notfound']
        //         },
        //         {
        //             label: 'Empty',
        //             icon: 'pi pi-fw pi-circle-off',
        //             routerLink: ['/pages/empty']
        //         },
        //         {
        //             label: 'FAQ',
        //             icon: 'pi pi-fw pi-question',
        //             routerLink: ['/pages/faq']
        //         },
        //         {
        //             label: 'Contact Us',
        //             icon: 'pi pi-fw pi-phone',
        //             routerLink: ['/landing/contact']
        //         }
        //     ]
        // },
        // { separator: true },
        // {
        //     label: 'E-Commerce',
        //     icon: 'pi pi-fw pi-wallet',
        //     path: '/ecommerce',
        //     items: [
        //         {
        //             label: 'Product Overview',
        //             icon: 'pi pi-fw pi-image',
        //             routerLink: ['/ecommerce/product-overview']
        //         },
        //         {
        //             label: 'Product List',
        //             icon: 'pi pi-fw pi-list',
        //             routerLink: ['/ecommerce/product-list']
        //         },
        //         {
        //             label: 'New Product',
        //             icon: 'pi pi-fw pi-plus',
        //             routerLink: ['/ecommerce/new-product']
        //         },
        //         {
        //             label: 'Shopping Cart',
        //             icon: 'pi pi-fw pi-shopping-cart',
        //             routerLink: ['/ecommerce/shopping-cart']
        //         },
        //         {
        //             label: 'Checkout Form',
        //             icon: 'pi pi-fw pi-check-square',
        //             routerLink: ['/ecommerce/checkout-form']
        //         },
        //         {
        //             label: 'Order History',
        //             icon: 'pi pi-fw pi-history',
        //             routerLink: ['/ecommerce/order-history']
        //         },
        //         {
        //             label: 'Order Summary',
        //             icon: 'pi pi-fw pi-file',
        //             routerLink: ['/ecommerce/order-summary']
        //         }
        //     ]
        // },
        // { separator: true },
        // {
        //     label: 'User Management',
        //     icon: 'pi pi-fw pi-user',
        //     path: '/profile',
        //     items: [
        //         {
        //             label: 'List',
        //             icon: 'pi pi-fw pi-list',
        //             routerLink: ['/profile/list']
        //         },
        //         {
        //             label: 'Create',
        //             icon: 'pi pi-fw pi-plus',
        //             routerLink: ['/profile/create']
        //         }
        //     ]
        // },
        // { separator: true },
        // {
        //     label: 'Hierarchy',
        //     icon: 'pi pi-fw pi-align-left',
        //     path: '/hierarchy',
        //     items: [
        //         {
        //             label: 'Submenu 1',
        //             icon: 'pi pi-fw pi-align-left',
        //             path: '/submenu_1',
        //             items: [
        //                 {
        //                     label: 'Submenu 1.1',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/submenu_1_1',
        //                     items: [
        //                         {
        //                             label: 'Submenu 1.1.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 1.1.2',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 1.1.3',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 1.2',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/submenu_1_2',
        //                     items: [
        //                         {
        //                             label: 'Submenu 1.2.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             label: 'Submenu 2',
        //             icon: 'pi pi-fw pi-align-left',
        //             path: '/submenu_2',
        //             items: [
        //                 {
        //                     label: 'Submenu 2.1',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/submenu_2_1',
        //                     items: [
        //                         {
        //                             label: 'Submenu 2.1.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         },
        //                         {
        //                             label: 'Submenu 2.1.2',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     label: 'Submenu 2.2',
        //                     icon: 'pi pi-fw pi-align-left',
        //                     path: '/submenu_2_2',
        //                     items: [
        //                         {
        //                             label: 'Submenu 2.2.1',
        //                             icon: 'pi pi-fw pi-align-left'
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ]
        // },
        // { separator: true },
        // {
        //     label: 'Start',
        //     icon: 'pi pi-fw pi-download',
        //     path: '/start',
        //     items: [
        //         {
        //             label: 'Buy Now',
        //             icon: 'pi pi-fw pi-shopping-cart',
        //             url: 'https://www.primefaces.org/store'
        //         },
        //         {
        //             label: 'Documentation',
        //             icon: 'pi pi-fw pi-info-circle',
        //             routerLink: ['/documentation']
        //         }
        //     ]
        // }
    ];
}
