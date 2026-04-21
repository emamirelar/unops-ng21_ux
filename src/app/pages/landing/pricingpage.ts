import { AppConfigurator } from '@/app/layout/components/app.configurator';
import { LayoutService } from '@/app/layout/service/layout.service';
import { CtaWidget } from '@/app/pages/landing/components/ctawidget';
import { PricingCompareWidget } from '@/app/pages/landing/components/pricing/pricingcomparewidget';
import { PricingHeroWidget } from '@/app/pages/landing/components/pricing/pricingherowidget';
import { TestimonialWidget } from '@/app/pages/landing/components/testimonialwidget';
import { Component, inject } from '@angular/core';

@Component({
    selector: 'app-pricing-page',
    standalone: true,
    imports: [PricingHeroWidget, PricingCompareWidget, CtaWidget, TestimonialWidget, AppConfigurator],
    template: `
        <app-pricing-hero-widget />
        <app-pricing-compare-widget />
        <app-cta-widget />
        <app-testimonial-widget />
        <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <app-configurator location="landing" />
    `
})
export class PricingPage {
    layoutService: LayoutService = inject(LayoutService);
}
