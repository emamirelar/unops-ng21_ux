import { Routes } from '@angular/router';

export default [
    {
        path: 'opportunity',
        data: { breadcrumb: 'Opportunities' },
        children: [
            {
                path: '',
                loadComponent: () => import('./opportunity').then((c) => c.Opportunity),
                data: { breadcrumb: 'Opportunity Details' }
            }
        ]
    },
    {
        path: 'cms',
        loadChildren: () => import('./cms/cms.routes'),
        data: { breadcrumb: 'CMS' }
    },
    {
        path: 'chat',
        loadComponent: () => import('./chat').then((c) => c.Chat),
        data: { breadcrumb: 'Chat' }
    },
    {
        path: 'files',
        loadComponent: () => import('./files').then((c) => c.Files),
        data: { breadcrumb: 'Files' }
    },
    {
        path: 'mail',
        loadChildren: () => import('./mail/mail.routes'),
        data: { breadcrumb: 'Mail' }
    },
    {
        path: 'tasklist',
        loadComponent: () => import('./tasklist').then((c) => c.TaskList),
        data: { breadcrumb: 'Task List' }
    },
    {
        path: 'partners',
        loadComponent: () => import('./partners').then((c) => c.Partners),
        data: { breadcrumb: 'Partners' }
    },
    {
        path: 'agreements',
        loadComponent: () => import('./agreements').then((c) => c.Agreements),
        data: { breadcrumb: 'Agreements' }
    },
    {
        path: 'contacts',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Contacts' }
    },
    {
        path: 'interactions',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Interactions' }
    },
    {
        path: 'offices/hq',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Headquarters (HQ)' }
    },
    {
        path: 'offices/mcos',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Multi-Country Offices (MCOs)' }
    },
    {
        path: 'offices/liaison',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Global Liaison Offices' }
    },
    {
        path: 'offices/portfolios',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Global Portfolios Hubs' }
    },
    {
        path: 'offices/project-centres',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Project Centres / Project Offices' }
    },
    {
        path: 'offices/shared-services',
        loadComponent: () => import('./coming-soon').then((c) => c.ComingSoon),
        data: { breadcrumb: 'Global Shared Services Centre' }
    }
] as Routes;
