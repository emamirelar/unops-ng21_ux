import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@/app/layout/service/brand-theme';
import { EcommerceDashboard } from '@/app/pages/dashboards/ecommerce/ecommercedashboard';

const meta: Meta<EcommerceDashboard> = {
    title: 'Pages/EcommerceDashboard',
    component: EcommerceDashboard,
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
                    'Ecommerce dashboard with mini stat cards (revenue, orders, customers, returns), ' +
                    'category overview bar chart, orders list panel, social media revenue breakdown, and social media users meter.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<EcommerceDashboard>;

export const Default: Story = {};
