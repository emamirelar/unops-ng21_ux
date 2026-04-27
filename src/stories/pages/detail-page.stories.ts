import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@emamirelar/ux';
import { Opportunity } from '@/app/apps/opportunity/opportunity';

const meta: Meta<Opportunity> = {
    title: 'Patterns/DetailPage',
    component: Opportunity,
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
                    'Generic "Detail Page" pattern. Two-column layout with a collapsible activity timeline, ' +
                    'grouped task list with filters and search, an AI/insights sidebar panel, and a document table ' +
                    'with file upload. This pattern is used for entity detail views where you need activity tracking, ' +
                    'task management, contextual insights, and document management in a single view.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Opportunity>;

export const Default: Story = {};
