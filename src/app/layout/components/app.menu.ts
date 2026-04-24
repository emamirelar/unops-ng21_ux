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
                            label: 'Components',
                            icon: 'pi pi-fw pi-objects-column',
                            path: '/components',
                            items: [
                                { label: 'Avatar', icon: 'pi pi-fw pi-user', url: `${SB}/?path=/docs/components-datadisplay-avatar--docs`, target: '_blank' },
                                { label: 'Button', icon: 'pi pi-fw pi-stop', url: `${SB}/?path=/docs/components-forminputs-button--docs`, target: '_blank' },
                                { label: 'Confirm', icon: 'pi pi-fw pi-check-circle', url: `${SB}/?path=/docs/components-overlays-confirmdialog--docs`, target: '_blank' },
                                { label: 'Data View', icon: 'pi pi-fw pi-table', url: `${SB}/?path=/docs/components-datadisplay-dataview--docs`, target: '_blank' },
                                { label: 'Date Picker', icon: 'pi pi-fw pi-calendar', url: `${SB}/?path=/docs/components-forminputs-datepicker--docs`, target: '_blank' },
                                { label: 'Dialog', icon: 'pi pi-fw pi-window-maximize', url: `${SB}/?path=/docs/components-overlays-dialog--docs`, target: '_blank' },
                                { label: 'File Upload', icon: 'pi pi-fw pi-upload', url: `${SB}/?path=/docs/components-forminputs-fileupload--docs`, target: '_blank' },
                                { label: 'Form Field', icon: 'pi pi-fw pi-pencil', url: `${SB}/?path=/docs/components-forminputs-formfield--docs`, target: '_blank' },
                                { label: 'Input Text', icon: 'pi pi-fw pi-text-cursor', url: `${SB}/?path=/docs/components-forminputs-inputtext--docs`, target: '_blank' },
                                { label: 'Media', icon: 'pi pi-fw pi-image', url: `${SB}/?path=/docs/components-datadisplay-media--docs`, target: '_blank' },
                                { label: 'Menu', icon: 'pi pi-fw pi-bars', url: `${SB}/?path=/docs/components-navigation-menu--docs`, target: '_blank' },
                                { label: 'Panels', icon: 'pi pi-fw pi-window-minimize', url: `${SB}/?path=/docs/components-layout-panels--docs`, target: '_blank' },
                                { label: 'Popover & Tooltip', icon: 'pi pi-fw pi-comment', url: `${SB}/?path=/docs/components-overlays-popover--docs`, target: '_blank' },
                                { label: 'Progress', icon: 'pi pi-fw pi-spinner', url: `${SB}/?path=/docs/components-datadisplay-progress--docs`, target: '_blank' },
                                { label: 'Select', icon: 'pi pi-fw pi-chevron-down', url: `${SB}/?path=/docs/components-forminputs-select--docs`, target: '_blank' },
                                { label: 'Slider & Knob', icon: 'pi pi-fw pi-sliders-h', url: `${SB}/?path=/docs/components-forminputs-rangeinput--docs`, target: '_blank' },
                                { label: 'Table', icon: 'pi pi-fw pi-th-large', url: `${SB}/?path=/docs/components-datadisplay-table--docs`, target: '_blank' },
                                { label: 'Tabs & Stepper', icon: 'pi pi-fw pi-bookmark', url: `${SB}/?path=/docs/components-navigation-tabs--docs`, target: '_blank' },
                                { label: 'Tag, Chip & Badge', icon: 'pi pi-fw pi-tag', url: `${SB}/?path=/docs/components-datadisplay-tag--docs`, target: '_blank' },
                                { label: 'Toast & Message', icon: 'pi pi-fw pi-bell', url: `${SB}/?path=/docs/components-feedback-toast--docs`, target: '_blank' },
                                { label: 'Toggle', icon: 'pi pi-fw pi-toggle-on', url: `${SB}/?path=/docs/components-forminputs-toggle--docs`, target: '_blank' }
                            ]
                        },
                        {
                            label: 'Blocks',
                            icon: 'pi pi-fw pi-prime',
                            path: '/blocks',
                            items: [
                                { label: 'Avatar Data Table', icon: 'pi pi-fw pi-users', url: `${SB}/?path=/docs/blocks-tables-avatardatatable--docs`, target: '_blank' },
                                { label: 'Budget Meter Panel', icon: 'pi pi-fw pi-chart-bar', url: `${SB}/?path=/docs/blocks-gauges-budgetmeterpanel--docs`, target: '_blank' },
                                { label: 'Call to Action Band', icon: 'pi pi-fw pi-megaphone', url: `${SB}/?path=/docs/blocks-landing-calltoactionband--docs`, target: '_blank' },
                                { label: 'Category Bar Panel', icon: 'pi pi-fw pi-chart-bar', url: `${SB}/?path=/docs/blocks-charts-categorybarpanel--docs`, target: '_blank' },
                                { label: 'Compact Stat Card Grid', icon: 'pi pi-fw pi-th-large', url: `${SB}/?path=/docs/blocks-metrics-compactstatcardgrid--docs`, target: '_blank' },
                                { label: 'Comparison Line Panel', icon: 'pi pi-fw pi-chart-line', url: `${SB}/?path=/docs/blocks-charts-comparisonlinepanel--docs`, target: '_blank' },
                                { label: 'Contact Split Form', icon: 'pi pi-fw pi-envelope', url: `${SB}/?path=/docs/blocks-landing-contactsplitform--docs`, target: '_blank' },
                                { label: 'FAQ Accordion', icon: 'pi pi-fw pi-question-circle', url: `${SB}/?path=/docs/blocks-landing-faqaccordion--docs`, target: '_blank' },
                                { label: 'Feature Detail Left', icon: 'pi pi-fw pi-align-left', url: `${SB}/?path=/docs/blocks-landing-featuredetailleft--docs`, target: '_blank' },
                                { label: 'Feature Detail Right', icon: 'pi pi-fw pi-align-right', url: `${SB}/?path=/docs/blocks-landing-featuredetailright--docs`, target: '_blank' },
                                { label: 'Feature Showcase', icon: 'pi pi-fw pi-star', url: `${SB}/?path=/docs/blocks-landing-featureshowcase--docs`, target: '_blank' },
                                { label: 'Feature Split Left', icon: 'pi pi-fw pi-align-left', url: `${SB}/?path=/docs/blocks-landing-featuresplitleft--docs`, target: '_blank' },
                                { label: 'Feature Split Right', icon: 'pi pi-fw pi-align-right', url: `${SB}/?path=/docs/blocks-landing-featuresplitright--docs`, target: '_blank' },
                                { label: 'Features Hero Banner', icon: 'pi pi-fw pi-flag', url: `${SB}/?path=/docs/blocks-landing-featuresherobanner--docs`, target: '_blank' },
                                { label: 'Gauge Metrics Panel', icon: 'pi pi-fw pi-gauge', url: `${SB}/?path=/docs/blocks-gauges-gaugemetricspanel--docs`, target: '_blank' },
                                { label: 'Gauge Table Panel', icon: 'pi pi-fw pi-table', url: `${SB}/?path=/docs/blocks-gauges-gaugetablepanel--docs`, target: '_blank' },
                                { label: 'Hero Banner', icon: 'pi pi-fw pi-flag', url: `${SB}/?path=/docs/blocks-landing-herobanner--docs`, target: '_blank' },
                                { label: 'Item List Panel', icon: 'pi pi-fw pi-list', url: `${SB}/?path=/docs/blocks-tables-itemlistpanel--docs`, target: '_blank' },
                                { label: 'Landing Footer', icon: 'pi pi-fw pi-align-justify', url: `${SB}/?path=/docs/blocks-landing-landingfooter--docs`, target: '_blank' },
                                { label: 'Landing Topbar', icon: 'pi pi-fw pi-align-justify', url: `${SB}/?path=/docs/blocks-landing-landingtopbar--docs`, target: '_blank' },
                                { label: 'Location Card Grid', icon: 'pi pi-fw pi-map-marker', url: `${SB}/?path=/docs/blocks-landing-locationcardgrid--docs`, target: '_blank' },
                                { label: 'Logo Marquee', icon: 'pi pi-fw pi-images', url: `${SB}/?path=/docs/blocks-landing-logomarquee--docs`, target: '_blank' },
                                { label: 'Meter Breakdown List', icon: 'pi pi-fw pi-list', url: `${SB}/?path=/docs/blocks-gauges-meterbreakdownlist--docs`, target: '_blank' },
                                { label: 'Meter Breakdown Panel', icon: 'pi pi-fw pi-chart-pie', url: `${SB}/?path=/docs/blocks-gauges-meterbreakdownpanel--docs`, target: '_blank' },
                                { label: 'Meter Card Row', icon: 'pi pi-fw pi-chart-bar', url: `${SB}/?path=/docs/blocks-metrics-metercardrow--docs`, target: '_blank' },
                                { label: 'Metric Meter Panel', icon: 'pi pi-fw pi-gauge', url: `${SB}/?path=/docs/blocks-gauges-metricmeterpanel--docs`, target: '_blank' },
                                { label: 'Overview Line Panel', icon: 'pi pi-fw pi-chart-line', url: `${SB}/?path=/docs/blocks-charts-overviewlinepanel--docs`, target: '_blank' },
                                { label: 'Pricing Cards', icon: 'pi pi-fw pi-dollar', url: `${SB}/?path=/docs/blocks-landing-pricingcards--docs`, target: '_blank' },
                                { label: 'Pricing Comparison Table', icon: 'pi pi-fw pi-table', url: `${SB}/?path=/docs/blocks-landing-pricingcomparisontable--docs`, target: '_blank' },
                                { label: 'Searchable Data Table', icon: 'pi pi-fw pi-search', url: `${SB}/?path=/docs/blocks-tables-searchabledatatable--docs`, target: '_blank' },
                                { label: 'Segmented Meter Stack', icon: 'pi pi-fw pi-chart-bar', url: `${SB}/?path=/docs/blocks-gauges-segmentedmeterstack--docs`, target: '_blank' },
                                { label: 'Stat Card Grid', icon: 'pi pi-fw pi-th-large', url: `${SB}/?path=/docs/blocks-metrics-statcardgrid--docs`, target: '_blank' },
                                { label: 'Stat Column Panel', icon: 'pi pi-fw pi-chart-bar', url: `${SB}/?path=/docs/blocks-metrics-statcolumnpanel--docs`, target: '_blank' },
                                { label: 'Status Data Table', icon: 'pi pi-fw pi-table', url: `${SB}/?path=/docs/blocks-tables-statusdatatable--docs`, target: '_blank' },
                                { label: 'Testimonial Card', icon: 'pi pi-fw pi-comment', url: `${SB}/?path=/docs/blocks-landing-testimonialcard--docs`, target: '_blank' },
                                { label: 'Testimonial Grid', icon: 'pi pi-fw pi-comments', url: `${SB}/?path=/docs/blocks-landing-testimonialgrid--docs`, target: '_blank' },
                                { label: 'Trend Line Panel', icon: 'pi pi-fw pi-chart-line', url: `${SB}/?path=/docs/blocks-charts-trendlinepanel--docs`, target: '_blank' }
                            ]
                        },
                        {
                            label: 'Playground',
                            icon: 'pi pi-fw pi-play',
                            path: '/playground',
                            items: [
                                { label: 'Page Builder', icon: 'pi pi-fw pi-pencil', url: `${SB}/?path=/docs/playground-pagebuilder--docs`, target: '_blank' }
                            ]
                        }
                    ]
                }
            ]
        },
        { separator: true },
        {
            label: 'Dashboards',
            icon: 'pi pi-fw pi-objects-column',
            path: '/dashboards',
            items: [
                {
                    label: 'E-Commerce',
                    icon: 'pi pi-fw pi-wallet',
                    routerLink: ['/']
                },
                {
                    label: 'Banking',
                    icon: 'pi pi-fw pi-building-columns',
                    routerLink: ['/dashboard-banking']
                },
                {
                    label: 'Marketing',
                    icon: 'pi pi-fw pi-megaphone',
                    routerLink: ['/dashboard-marketing']
                }
            ]
        },
        { separator: true },
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
                        {
                            label: 'Detail',
                            icon: 'pi pi-fw pi-file',
                            routerLink: ['/apps/cms/detail']
                        },
                        {
                            label: 'Detail-2',
                            icon: 'pi pi-fw pi-file',
                            routerLink: ['/apps/cms/detail2']
                        },
                        {
                            label: 'List',
                            icon: 'pi pi-fw pi-list',
                            routerLink: ['/apps/cms/list']
                        },
                        {
                            label: 'Edit',
                            icon: 'pi pi-fw pi-pencil',
                            routerLink: ['/apps/cms/edit']
                        }
                    ]
                },
                {
                    label: 'Chat',
                    icon: 'pi pi-fw pi-comments',
                    routerLink: ['/apps/chat']
                },
                {
                    label: 'Files',
                    icon: 'pi pi-fw pi-folder',
                    routerLink: ['/apps/files']
                },
                {
                    label: 'Mail',
                    icon: 'pi pi-fw pi-envelope',
                    routerLink: ['/apps/mail']
                },
                {
                    label: 'Task List',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/apps/tasklist']
                }
            ]
        },
        { separator: true },
        {
            label: 'UI Kit',
            icon: 'pi pi-fw pi-star',
            path: '/uikit',
            items: [
                {
                    label: 'Form Layout',
                    icon: 'pi pi-fw pi-id-card',
                    routerLink: ['/uikit/formlayout']
                },
                {
                    label: 'Input',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/uikit/input']
                },
                {
                    label: 'Button',
                    icon: 'pi pi-fw pi-box',
                    routerLink: ['/uikit/button']
                },
                {
                    label: 'Table',
                    icon: 'pi pi-fw pi-table',
                    routerLink: ['/uikit/table']
                },
                {
                    label: 'List',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/uikit/list']
                },
                {
                    label: 'Tree',
                    icon: 'pi pi-fw pi-share-alt',
                    routerLink: ['/uikit/tree']
                },
                {
                    label: 'Panel',
                    icon: 'pi pi-fw pi-tablet',
                    routerLink: ['/uikit/panel']
                },
                {
                    label: 'Overlay',
                    icon: 'pi pi-fw pi-clone',
                    routerLink: ['/uikit/overlay']
                },
                {
                    label: 'Media',
                    icon: 'pi pi-fw pi-image',
                    routerLink: ['/uikit/media']
                },
                {
                    label: 'Menu',
                    icon: 'pi pi-fw pi-bars',
                    routerLink: ['/uikit/menu']
                },
                {
                    label: 'Message',
                    icon: 'pi pi-fw pi-comment',
                    routerLink: ['/uikit/message']
                },
                {
                    label: 'File',
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/uikit/file']
                },
                {
                    label: 'Chart',
                    icon: 'pi pi-fw pi-chart-bar',
                    routerLink: ['/uikit/charts']
                },
                {
                    label: 'Timeline',
                    icon: 'pi pi-fw pi-calendar',
                    routerLink: ['/uikit/timeline']
                },
                {
                    label: 'Misc',
                    icon: 'pi pi-fw pi-circle',
                    routerLink: ['/uikit/misc']
                }
            ]
        },
        { separator: true },
        {
            label: 'Prime Blocks',
            icon: 'pi pi-fw pi-prime',
            path: '/blocks',
            items: [
                {
                    label: 'Free Blocks',
                    icon: 'pi pi-fw pi-eye',
                    routerLink: ['/blocks']
                },
                {
                    label: 'All Blocks',
                    icon: 'pi pi-fw pi-globe',
                    url: 'https://primeblocks.org',
                    target: '_blank'
                }
            ]
        },
        { separator: true },
        {
            label: 'Utilities',
            icon: 'pi pi-fw pi-compass',
            path: '/utilities',
            items: [
                {
                    label: 'Figma',
                    icon: 'pi pi-fw pi-pencil',
                    url: 'https://www.figma.com/design/3BgdXCQjva5nUEO8OidU1B/Preview-%7C-UNOPS-NG-UX?node-id=0-1&t=KdfljgRtYLzFPfKL-1',
                    target: '_blank'
                }
            ]
        },
        { separator: true },
        {
            label: 'Pages',
            icon: 'pi pi-fw pi-briefcase',
            path: '/pages',
            items: [
                {
                    label: 'Landing',
                    icon: 'pi pi-fw pi-globe',
                    routerLink: ['/landing']
                },
                {
                    label: 'Auth',
                    icon: 'pi pi-fw pi-user',
                    path: '/auth',
                    items: [
                        {
                            label: 'Login',
                            icon: 'pi pi-fw pi-sign-in',
                            routerLink: ['/auth/login']
                        },
                        {
                            label: 'Error',
                            icon: 'pi pi-fw pi-times-circle',
                            routerLink: ['/auth/error']
                        },
                        {
                            label: 'Access Denied',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: ['/auth/access']
                        },
                        {
                            label: 'Register',
                            icon: 'pi pi-fw pi-user-plus',
                            routerLink: ['/auth/register']
                        },
                        {
                            label: 'Forgot Password',
                            icon: 'pi pi-fw pi-question',
                            routerLink: ['/auth/forgot-password']
                        },
                        {
                            label: 'New Password',
                            icon: 'pi pi-fw pi-cog',
                            routerLink: ['/auth/new-password']
                        },
                        {
                            label: 'Verification',
                            icon: 'pi pi-fw pi-envelope',
                            routerLink: ['/auth/verification']
                        },
                        {
                            label: 'Lock Screen',
                            icon: 'pi pi-fw pi-eye-slash',
                            routerLink: ['/auth/lock-screen']
                        }
                    ]
                },
                {
                    label: 'Crud',
                    icon: 'pi pi-fw pi-pencil',
                    routerLink: ['/pages/crud']
                },
                {
                    label: 'Invoice',
                    icon: 'pi pi-fw pi-dollar',
                    routerLink: ['/pages/invoice']
                },
                {
                    label: 'Help',
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/pages/help']
                },
                {
                    label: 'Oops',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/auth/oops']
                },
                {
                    label: 'Not Found',
                    icon: 'pi pi-fw pi-exclamation-circle',
                    routerLink: ['/pages/notfound']
                },
                {
                    label: 'Empty',
                    icon: 'pi pi-fw pi-circle-off',
                    routerLink: ['/pages/empty']
                },
                {
                    label: 'FAQ',
                    icon: 'pi pi-fw pi-question',
                    routerLink: ['/pages/faq']
                },
                {
                    label: 'Contact Us',
                    icon: 'pi pi-fw pi-phone',
                    routerLink: ['/landing/contact']
                }
            ]
        },
        { separator: true },
        {
            label: 'E-Commerce',
            icon: 'pi pi-fw pi-wallet',
            path: '/ecommerce',
            items: [
                {
                    label: 'Product Overview',
                    icon: 'pi pi-fw pi-image',
                    routerLink: ['/ecommerce/product-overview']
                },
                {
                    label: 'Product List',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/ecommerce/product-list']
                },
                {
                    label: 'New Product',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/ecommerce/new-product']
                },
                {
                    label: 'Shopping Cart',
                    icon: 'pi pi-fw pi-shopping-cart',
                    routerLink: ['/ecommerce/shopping-cart']
                },
                {
                    label: 'Checkout Form',
                    icon: 'pi pi-fw pi-check-square',
                    routerLink: ['/ecommerce/checkout-form']
                },
                {
                    label: 'Order History',
                    icon: 'pi pi-fw pi-history',
                    routerLink: ['/ecommerce/order-history']
                },
                {
                    label: 'Order Summary',
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/ecommerce/order-summary']
                }
            ]
        },
        { separator: true },
        {
            label: 'User Management',
            icon: 'pi pi-fw pi-user',
            path: '/profile',
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['/profile/list']
                },
                {
                    label: 'Create',
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['/profile/create']
                }
            ]
        },
        { separator: true },
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
                                {
                                    label: 'Submenu 1.1.1',
                                    icon: 'pi pi-fw pi-align-left'
                                },
                                {
                                    label: 'Submenu 1.1.2',
                                    icon: 'pi pi-fw pi-align-left'
                                },
                                {
                                    label: 'Submenu 1.1.3',
                                    icon: 'pi pi-fw pi-align-left'
                                }
                            ]
                        },
                        {
                            label: 'Submenu 1.2',
                            icon: 'pi pi-fw pi-align-left',
                            path: '/submenu_1_2',
                            items: [
                                {
                                    label: 'Submenu 1.2.1',
                                    icon: 'pi pi-fw pi-align-left'
                                }
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
                                {
                                    label: 'Submenu 2.1.1',
                                    icon: 'pi pi-fw pi-align-left'
                                },
                                {
                                    label: 'Submenu 2.1.2',
                                    icon: 'pi pi-fw pi-align-left'
                                }
                            ]
                        },
                        {
                            label: 'Submenu 2.2',
                            icon: 'pi pi-fw pi-align-left',
                            path: '/submenu_2_2',
                            items: [
                                {
                                    label: 'Submenu 2.2.1',
                                    icon: 'pi pi-fw pi-align-left'
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        { separator: true },
        {
            label: 'Start',
            icon: 'pi pi-fw pi-download',
            path: '/start',
            items: [
                {
                    label: 'Buy Now',
                    icon: 'pi pi-fw pi-shopping-cart',
                    url: 'https://www.primefaces.org/store'
                },
                {
                    label: 'Documentation',
                    icon: 'pi pi-fw pi-info-circle',
                    routerLink: ['/documentation']
                }
            ]
        }
    ];
}
