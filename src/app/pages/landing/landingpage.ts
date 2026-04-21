import { LayoutService } from '@/app/layout/service/layout.service';
import { CtaWidget } from '@/app/pages/landing/components/ctawidget';
import { FaqWidget } from '@/app/pages/landing/components/faqwidget';
import { HeroWidget } from '@/app/pages/landing/components/herowidget';
import { SectionOneWidget } from '@/app/pages/landing/components/sectiononewidget';
import { SectionThreeWidget } from '@/app/pages/landing/components/sectionthreewidget';
import { SectionTwoWidget } from '@/app/pages/landing/components/sectiontwowidget';
import { TestimonialWidget } from '@/app/pages/landing/components/testimonialwidget';
import { Component, inject } from '@angular/core';
import { AppConfigurator } from '../../layout/components/app.configurator';

@Component({
    selector: 'app-landing-page',
    standalone: true,
    imports: [HeroWidget, SectionOneWidget, SectionTwoWidget, SectionThreeWidget, CtaWidget, TestimonialWidget, FaqWidget, AppConfigurator],
    template: `<app-hero-widget />
        <app-section-one-widget />
        <app-section-two-widget />
        <app-section-three-widget />
        <app-cta-widget />
        <app-testimonial-widget />
        <app-faq-widget />
        <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <app-configurator location="landing" />`
})
export class LandingPage {
    layoutService: LayoutService = inject(LayoutService);
}
