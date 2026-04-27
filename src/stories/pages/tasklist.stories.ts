import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@/app/layout/service/brand-theme';
import { TaskList } from '@/app/apps/tasklist/index';

const meta: Meta<TaskList> = {
    title: 'Pages/TaskList',
    component: TaskList,
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
                    'Task management page with filter tabs (All, Todo, In Progress, Done), search, accordion groups ' +
                    'by status, checkbox tasks with assignee avatar groups, priority tags, and a slide-out Task Drawer ' +
                    'for creating and editing tasks with date pickers and member selection.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<TaskList>;

export const Default: Story = {};
