import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unopsitg/ux';
import { Partners } from '@/app/apps/partners/partners';

const meta: Meta<Partners> = {
    title: 'Pages/Partners',
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
                    'Partner directory page with list/grid toggle, search bar, filter tags (status & category), ' +
                    'summary stats (total, active, key global), and DataView displaying partner cards with flag icons, ' +
                    'category/status/approval tags, and country info.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Partners>;

export const ListView: Story = {};

export const GridView: Story = {
    play: async ({ canvasElement }) => {
        const gridBtn = canvasElement.querySelector('.pi-table')?.closest('div[role="radio"], button') as HTMLElement | null;
        gridBtn?.click();
    }
};
