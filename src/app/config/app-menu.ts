import { type IsActiveMatchOptions } from '@angular/router';
import { type MenuItem } from '@unopsitg/ux';

const SUBSET_MATCH: IsActiveMatchOptions = { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' };

/** Demo shell menu for the UNOPS-ng21_UX reference application. */
export function createDemoAppMenu(): MenuItem[] {
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
                    routerLink: ['/apps/contacts'],
                    routerLinkActiveOptions: SUBSET_MATCH
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
                    routerLink: ['/apps/opportunities'],
                    routerLinkActiveOptions: SUBSET_MATCH
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
    ];
}
