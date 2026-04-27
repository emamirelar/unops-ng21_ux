import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@/app/layout/service/brand-theme';
import { Partners } from '@/app/apps/partners/partners';

const meta: Meta<Partners> = {
    title: 'Patterns/PartnerDirectory',
    component: Partners,
    decorators: [
        applicationConfig({
            providers: [provideRouter([]), provideHttpClient(withFetch()), provideZonelessChangeDetection(), providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } })]
        })
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Generic "Entity Directory" pattern. Filterable list/grid view with search, tag-based filtering, ' +
                    'summary statistics bar, and a DataView that can toggle between list and grid layouts. ' +
                    'This pattern suits any entity browse page where users need to search, filter, and preview records.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Partners>;

export const Default: Story = {};
