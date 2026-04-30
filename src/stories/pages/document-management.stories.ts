import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unopsitg/ux';
import { Agreements } from '@/app/apps/agreements/agreements';

const meta: Meta<Agreements> = {
    title: 'Patterns/DocumentManagement',
    component: Agreements,
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
                    'Generic "Document Management" pattern. Grid layout with an activity feed timeline, ' +
                    'category breakdown visualization, pinned item cards, filter tags, a searchable/sortable ' +
                    'data table, and a slide-out drawer for create/edit with file upload, metadata display, ' +
                    'and a comments thread. This pattern suits any document or file management workflow.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Agreements>;

export const Default: Story = {};
