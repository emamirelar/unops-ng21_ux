import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { BrandSoft, LayoutService, MENU_MODEL } from '@unops/ux';
import { providePrimeNG } from 'primeng/config';
import { createDemoAppMenu } from './app/config/app-menu';
import { appRoutes } from './app.routes';
import { environment } from './environments/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch()),
        provideZonelessChangeDetection(),
        providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } }),
        {
            provide: MENU_MODEL,
            useFactory: (layoutService: LayoutService) => createDemoAppMenu(layoutService, environment.storybookBaseUrl),
            deps: [LayoutService]
        }
    ]
};
