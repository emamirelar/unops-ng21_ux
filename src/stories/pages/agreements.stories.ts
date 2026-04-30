import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unops/ux';
import { Agreements } from '@/app/apps/agreements/agreements';

const meta: Meta<Agreements> = {
    title: 'Pages/Agreements',
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
                    'Full Agreements management page. Grid layout with Activity Feed (scrollable timeline with per-row menu), ' +
                    'Agreement Types breakdown (color-coded bar chart with totals), Pinned items (file card grid), ' +
                    'Filter tags, paginated Agreements table (sortable columns, row actions, popup menu), ' +
                    'and a right Drawer for Add/Edit (file upload zone, name/owner fields, metadata block, comments, actions).'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Agreements>;

export const Default: Story = {};

export const FilteredByLargeFiles: Story = {
    play: async ({ canvasElement }) => {
        const tags = canvasElement.querySelectorAll('.p-tag');
        const largeFilesTag = Array.from(tags).find((el) => el.textContent?.trim() === 'Large Files') as HTMLElement | null;
        largeFilesTag?.click();
    }
};
