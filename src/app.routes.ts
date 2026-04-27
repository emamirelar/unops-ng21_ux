import { AppLayout, AuthLayout } from '@emamirelar/ux';
import { LandingLayout } from '@/app/layout/components/app.landinglayout';
import { Notfound } from '@/app/pages/notfound/notfound';
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('@/app/pages/dashboards/dashboard/dashboard').then((c) => c.Dashboard),
                data: { breadcrumb: 'Home' }
            },
            {
                path: 'dashboard-banking',
                loadComponent: () => import('@/app/pages/dashboards/banking/bankingdashboard').then((c) => c.BankingDashboard),
                data: { breadcrumb: 'Banking Dashboard' }
            },
            {
                path: 'dashboard-marketing',
                loadComponent: () => import('@/app/pages/dashboards/marketing/marketingdashboard').then((c) => c.MarketingDashboard),
                data: { breadcrumb: 'Marketing Dashboard' }
            },
            {
                path: 'uikit',
                data: { breadcrumb: 'UI Kit' },
                loadChildren: () => import('@/app/pages/uikit/uikit.routes')
            },
            {
                path: 'documentation',
                data: { breadcrumb: 'Documentation' },
                loadComponent: () => import('@/app/pages/documentation/documentation').then((c) => c.Documentation)
            },
            {
                path: 'pages',
                loadChildren: () => import('@/app/pages/pages.routes'),
                data: { breadcrumb: 'Pages' }
            },
            {
                path: 'apps',
                loadChildren: () => import('@/app/apps/apps.routes'),
                data: { breadcrumb: 'Partnerships' }
            },

            {
                path: 'blocks',
                data: { breadcrumb: 'Free Blocks' },
                loadChildren: () => import('@/app/pages/blocks/blocks.routes')
            },
            {
                path: 'ecommerce',
                loadChildren: () => import('@/app/pages/ecommerce/ecommerce.routes'),
                data: { breadcrumb: 'E-Commerce' }
            },
            {
                path: 'profile',
                loadChildren: () => import('@/app/pages/usermanagement/usermanagement.routes')
            }
        ]
    },
    {
        path: 'landing',
        component: LandingLayout,
        children: [
            {
                path: '',
                loadComponent: () => import('@/app/pages/landing/landingpage').then((c) => c.LandingPage)
            },
            {
                path: 'features',
                loadComponent: () => import('@/app/pages/landing/featurespage').then((c) => c.FeaturesPage)
            },
            {
                path: 'pricing',
                loadComponent: () => import('@/app/pages/landing/pricingpage').then((c) => c.PricingPage)
            },
            {
                path: 'contact',
                loadComponent: () => import('@/app/pages/landing/contactpage').then((c) => c.ContactPage)
            }
        ]
    },

    { path: 'notfound', component: Notfound },
    {
        path: 'auth',
        component: AuthLayout,
        children: [
            {
                path: 'login',
                loadComponent: () => import('@/app/pages/auth/login').then((c) => c.Login)
            },
            {
                path: 'register',
                loadComponent: () => import('@/app/pages/auth/register').then((c) => c.Register)
            },
            {
                path: 'verification',
                loadComponent: () => import('@/app/pages/auth/verification').then((c) => c.Verification)
            },
            {
                path: 'forgot-password',
                loadComponent: () => import('@/app/pages/auth/forgotpassword').then((c) => c.ForgotPassword)
            },
            {
                path: 'new-password',
                loadComponent: () => import('@/app/pages/auth/newpassword').then((c) => c.NewPassword)
            },
            {
                path: 'lock-screen',
                loadComponent: () => import('@/app/pages/auth/lockscreen').then((c) => c.LockScreen)
            },
            {
                path: 'access',
                loadComponent: () => import('@/app/pages/auth/access').then((c) => c.Access)
            },
            {
                path: 'oops',
                loadComponent: () => import('@/app/pages/oops/oops').then((c) => c.Oops)
            },
            {
                path: 'error',
                loadComponent: () => import('@/app/pages/notfound/notfound').then((c) => c.Notfound)
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
