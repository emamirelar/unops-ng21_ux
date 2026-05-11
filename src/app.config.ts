import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { BrandSoft, MENU_MODEL } from '@unopsitg/ux';
import { providePrimeNG } from 'primeng/config';
import { createDemoAppMenu } from './app/config/app-menu';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } }),
        {
            provide: MENU_MODEL,
            useFactory: () => createDemoAppMenu()
        }
    ]
};
