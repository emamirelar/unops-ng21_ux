import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unopsitg/ux';
import { MarketingDashboard } from '@/app/pages/dashboards/marketing/marketingdashboard';

const meta: Meta<MarketingDashboard> = {
    title: 'Pages/MarketingDashboard',
    component: MarketingDashboard,
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
                    'Marketing dashboard with stat column cards, sales overview line chart, follower analytics meter panel, ' +
                    'and a searchable order history data table.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<MarketingDashboard>;

export const Default: Story = {};
