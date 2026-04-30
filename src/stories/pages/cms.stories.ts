import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unops/ux';
import { List } from '@/app/apps/cms/list';

const meta: Meta<List> = {
    title: 'Pages/CMS',
    component: List,
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
                    'Content management blog listing page with a featured article carousel, category filters, ' +
                    'post cards with images, author avatars, and a responsive grid layout for browsing content.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<List>;

export const Default: Story = {};
