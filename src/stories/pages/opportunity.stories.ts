import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@emamirelar/ux';
import { Opportunity } from '@/app/apps/opportunity/opportunity';

const meta: Meta<Opportunity> = {
    title: 'Pages/Opportunity',
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
                    'Full Opportunity detail page. Two-column layout with Activity Feed (collapsible timeline + paginator), ' +
                    'Tasks section (filter tabs, search, accordion with status groups, checkbox tasks, avatar groups), ' +
                    'AI Project Analysis sidebar (gradient card with searchable insight cards), and Documents section ' +
                    '(type filter tags, search, sortable table, file upload). Includes a Task Drawer overlay for create/edit.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Opportunity>;

export const Default: Story = {};

export const WithActivityCollapsed: Story = {
    play: async ({ canvasElement }) => {
        const activityHeader = canvasElement.querySelector('.pi-history')?.closest('[class*="cursor-pointer"]') as HTMLElement | null;
        activityHeader?.click();
    }
};
