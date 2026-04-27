import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@emamirelar/ux';
import { BankingDashboard } from '@/app/pages/dashboards/banking/bankingdashboard';

const meta: Meta<BankingDashboard> = {
    title: 'Pages/BankingDashboard',
    component: BankingDashboard,
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
                    'Banking dashboard with currency card grid, credit score gauge, income/expenditure comparison chart, ' +
                    'spending limit meters, and a transaction history table with avatars.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<BankingDashboard>;

export const Default: Story = {};
