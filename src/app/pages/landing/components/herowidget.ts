import { CustomersLogoWidget } from '@/app/pages/landing/components/customerslogowidget';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HorizontalGridWidget } from './horizontalgridwidget';

@Component({
    selector: 'app-hero-widget',
    standalone: true,
    imports: [CommonModule, HorizontalGridWidget, CustomersLogoWidget, RouterLink],
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
                    <p class="body-small mt-2 max-w-2xl text-surface-600 dark:text-surface-300">We've added new dashboard features, improved navigation, and streamlined workflows. Explore the updated interface and share your feedback with the admin team.</p>
                    <a routerLink="/" class="body-button mt-6 lg:mt-8">Get Started</a>
                </div>
                <div class="mb-20 lg:mb-28"></div>
                <app-customers-logo-widget></app-customers-logo-widget>
            </div>
        </section>
    `
})
export class HeroWidget {}
