import type { Meta, StoryObj } from '@storybook/angular';
import { applicationConfig } from '@storybook/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { BrandSoft } from '@unops/ux';
import { PartnerDetail } from '@/app/apps/partners/partner-detail';
import { PartnerService } from '@/app/apps/partners/partner.service';

const meta: Meta<PartnerDetail> = {
    title: 'Pages/PartnerDetail',
    component: PartnerDetail,
    decorators: [
        applicationConfig({
            providers: [
                provideRouter([{ path: '**', component: PartnerDetail }]),
                provideHttpClient(withFetch()),
                provideZonelessChangeDetection(),
                providePrimeNG({ theme: { preset: BrandSoft, options: { darkModeSelector: '.app-dark' } } })
            ]
        })
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Partner detail page showing a header card with flag icon and partner info, two-column layout ' +
                    'with Partner Details and Classification sections on the left, and Focal Point, Location, and ' +
                    'Record Info cards on the right sidebar. Includes status/approval tags with contextual colors.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<PartnerDetail>;

export const Default: Story = {
    play: async ({ fixture }) => {
        const service = fixture.debugElement.injector.get(PartnerService);
        service.getPartners();
        const component = fixture.componentInstance;
        component.partnerId.set('997');
        fixture.detectChanges();
    }
};

export const UNAgency: Story = {
    play: async ({ fixture }) => {
        const service = fixture.debugElement.injector.get(PartnerService);
        service.getPartners();
        const component = fixture.componentInstance;
        component.partnerId.set('1042');
        fixture.detectChanges();
    }
};

export const DraftPartner: Story = {
    play: async ({ fixture }) => {
        const service = fixture.debugElement.injector.get(PartnerService);
        service.getPartners();
        const component = fixture.componentInstance;
        component.partnerId.set('1287');
        fixture.detectChanges();
    }
};

export const NotFound: Story = {};
