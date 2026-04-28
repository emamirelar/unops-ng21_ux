import { LayoutService } from '@emamirelar/ux';
import { CustomersLogoWidget } from '@/app/pages/landing/components/customerslogowidget';
import { LazyImageWidget } from '@/app/pages/landing/components/lazyimagewidget';
import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HorizontalGridWidget } from './horizontalgridwidget';

@Component({
    selector: 'app-hero-widget',
    standalone: true,
    imports: [CommonModule, HorizontalGridWidget, LazyImageWidget, CustomersLogoWidget, RouterLink],
    template: `
        <section class="animate-fadein animate-duration-300 animate-ease-in relative lg:pb-14 lg:pt-52 pt-36 pb-10">
            <app-horizontal-grid-widget class="top-108 lg:top-104"></app-horizontal-grid-widget>
            <div class="relative z-10 mx-auto landing-container overflow-hidden">
                <div class="flex flex-col items-center">
                    <h1 class="title-h4 lg:title-h1">
                        Welcome to the enhanced <br />
                        <span class="text-primary-600">Partner and Opportunities platform, Opportunity+</span>
                    </h1>
                    <p class="body-small lg:body-medium mt-4 lg:mt-6 max-w-2xl">Your personalized dashboard for managing partnerships and opportunities</p>
                    <p class="body-small mt-2 max-w-2xl text-surface-500 dark:text-surface-400">We've added new dashboard features, improved navigation, and streamlined workflows. Explore the updated interface and share your feedback with the admin team.</p>
                    <a routerLink="/" class="body-button mt-6 lg:mt-8">Get Started</a>
                </div>
                <div class="mb-20 lg:mb-28">
                    <app-lazy-image-widget
                        [src]="'demo/images/landing/' + (isDarkTheme() ? 'hero-dashboard-dark.png' : 'hero-dashboard.png')"
                        alt="Hero Image"
                        className="mt-16 max-w-284! w-full h-auto mx-auto rounded-xl lg:rounded-3xl shadow-[0px_4px_16px_0px_rgba(18,18,23,0.08),0px_0px_0px_8px_#E3E8EF] dark:shadow-[0px_4px_16px_0px_rgba(18,18,23,0.08),0px_0px_0px_8px_#27272A]"
                    ></app-lazy-image-widget>
                </div>
                <app-customers-logo-widget></app-customers-logo-widget>
            </div>
        </section>
    `
})
export class HeroWidget {
    layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
