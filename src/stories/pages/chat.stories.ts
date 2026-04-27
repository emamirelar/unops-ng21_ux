import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@/app/layout/service/brand-theme';
import { Chat } from '@/app/apps/chat/index';

const meta: Meta<Chat> = {
    title: 'Pages/Chat',
    component: Chat,
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
                    'Full chat application with three-panel layout: channel list (with search, pinned, group and individual chats), ' +
                    'message area (threaded messages, timestamps, day separators, message input), and a collapsible ' +
                    'contact/user profile sidebar. Supports creating new chats, archiving, pinning, and deleting conversations.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<Chat>;

export const Default: Story = {};
