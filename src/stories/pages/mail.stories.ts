import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unops/ux';
import { MailInbox } from '@/app/apps/mail/mail-inbox';

const meta: Meta<MailInbox> = {
    title: 'Pages/Mail',
    component: MailInbox,
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
                    'Email inbox application with folder navigation (Inbox, Sent, Drafts, Trash, Starred), ' +
                    'searchable/sortable mail table with avatars, tag labels, star toggle, row actions menu, ' +
                    'pagination, and a compose dialog with rich text fields.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<MailInbox>;

export const Default: Story = {};
