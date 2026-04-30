import type { Decorator, Preview } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft, LayoutService, MENU_MODEL } from '@unopsitg/ux';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import { createDemoAppMenu } from '../src/app/config/app-menu';
import { environment } from '../src/environments/environment';

setCompodocJson(docJson);

const primeProviders = [
    provideRouter([]),
    provideHttpClient(withFetch()),
    provideZonelessChangeDetection(),
    providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } }),
    {
        provide: MENU_MODEL,
        useFactory: (layoutService: LayoutService) => createDemoAppMenu(layoutService, environment.storybookBaseUrl),
        deps: [LayoutService]
    }
];

/**
 * Syncs `app-dark` on `document.documentElement` with the Storybook toolbar so
 * `dark:` Tailwind utilities and Prime's `darkModeSelector` match the main app.
 */
const withAppDarkDocument: Decorator = (storyFn, context) => {
    if (typeof document !== 'undefined') {
        const useDark = context.globals?.['theme'] === 'dark';
        document.documentElement.classList.toggle('app-dark', useDark);
    }
    return storyFn();
};

const preview: Preview = {
    globalTypes: {
        theme: {
            name: 'App theme',
            description: 'Toggles `app-dark` on the document (Tailwind `dark:` + Prime dark tokens), matching the app shell.',
            defaultValue: 'light',
            toolbar: {
                icon: 'contrast',
                title: 'App theme',
                items: [
                    { value: 'light', title: 'Light', icon: 'circlehollow' },
                    { value: 'dark', title: 'Dark', icon: 'circle' }
                ],
                dynamicTitle: true
            }
        }
    },
    decorators: [withAppDarkDocument, applicationConfig({ providers: primeProviders })],
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    }
};

export default preview;
