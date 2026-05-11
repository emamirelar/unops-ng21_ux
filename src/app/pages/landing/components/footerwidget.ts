import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-footer-widget',
    standalone: true,
    imports: [CommonModule],
    template: `
        <section [ngClass]="class" class="relative border-t border-surface-200 dark:border-surface-800">
            <div class="absolute bottom-0 w-full max-h-52 min-h-14">
                <svg class="w-full h-full" width="1440" height="167" viewBox="0 0 1440 167" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="url(#paint0_linear_2001_3287)" stroke-opacity="0.6" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                    <defs>
                        <linearGradient id="paint0_linear_2001_3287" x1="720" y1="167" x2="720" y2="43.4727" gradientUnits="userSpaceOnUse">
                            <stop class="[stop-color:var(--p-surface-200)] dark:[stop-color:var(--p-surface-800)]" />
                            <stop offset="1" class="[stop-color:var(--p-surface-0)] dark:[stop-color:var(--p-surface-950)]" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div class="relative z-20 landing-container mx-auto md:pt-20 md:pb-14 py-8">
                <div class="text-center body-small">© {{ currentYear }} PrimeTek</div>
            </div>
        </section>
    `
})
export class FooterWidget {
    @Input() class: string | undefined;

    currentYear: number = new Date().getFullYear();

}
