import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@/app/layout/service/brand-theme';
import { Dashboard } from '@/app/pages/dashboards/dashboard/dashboard';

const meta: Meta<Dashboard> = {
    title: 'Pages/Dashboard',
    component: Dashboard,
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
                    'Main opportunity dashboard with stat cards, pipeline segmented meter, opportunity trends line chart, ' +
                    'pipeline health gauge, and a recent opportunities data table.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Dashboard>;

export const Default: Story = {};
