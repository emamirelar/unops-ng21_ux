import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@emamirelar/ux';
import { Files } from '@/app/apps/files/files';

const meta: Meta<Files> = {
    title: 'Pages/Files',
    component: Files,
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
                    'File management application with activity feed, storage breakdown visualization, ' +
                    'file/folder table with type icons, sharing indicators, row action menus, and a ' +
                    'drawer for file details with comments and metadata.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Files>;

export const Default: Story = {};
