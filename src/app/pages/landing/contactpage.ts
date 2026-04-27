import { AppConfigurator } from '@emamirelar/ux';
import { LayoutService } from '@emamirelar/ux';
import { ContactAdressWidget } from '@/app/pages/landing/components/contact/contactadresswidget';
import { ContactHeroWidget } from '@/app/pages/landing/components/contact/contactherowidget';
import { FaqWidget } from '@/app/pages/landing/components/faqwidget';
import { TestimonialWidget } from '@/app/pages/landing/components/testimonialwidget';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-contact-page',
    standalone: true,
    imports: [ContactHeroWidget, ContactAdressWidget, TestimonialWidget, FaqWidget, AppConfigurator],
    template: `
        <app-contact-hero-widget />
        <app-contact-adress-widget />
        <app-testimonial-widget />
        <app-faq-widget />
        <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <app-configurator location="landing" />
    `
})
export class ContactPage {
    layoutService: LayoutService = inject(LayoutService);
}
