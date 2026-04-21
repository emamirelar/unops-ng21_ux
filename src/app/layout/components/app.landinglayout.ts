import { FooterWidget } from '@/app/pages/landing/components/footerwidget';
import { TopbarWidget } from '@/app/pages/landing/components/topbarwidget';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing-layout',
    standalone: true,
    imports: [CommonModule, TopbarWidget, RouterModule, FooterWidget],
    template: ` <app-topbar-widget />
        <main>
            <router-outlet></router-outlet>
        </main>
        <app-footer-widget />`
})
export class LandingLayout {}
