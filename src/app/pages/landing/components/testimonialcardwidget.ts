import { LayoutService } from '@unopsitg/ux';
import { CommonModule } from '@angular/common';
import { Component, computed, inject, Input } from '@angular/core';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-testimonial-card-widget',
    standalone: true,
    imports: [CommonModule, AvatarModule, AnimateOnScrollModule],
    template: `
        <div pAnimateOnScroll enterClass="animate-enter fade-in-10 animate-duration-1000" leaveClass="animate-leave fade-out-0" class="p-5 lg:p-6 border border-surface-200 dark:border-surface-800 rounded-2xl" [ngClass]="className">
            <p class="body-medium text-left">
                {{ testimonial.message }}
            </p>
            <div class="flex items-center gap-3 mt-6">
                <p-avatar class="w-14! h-14! border border-surface-200 dark:border-surface-700" [size]="'large'" [image]="testimonial.avatar" [shape]="'circle'" />
                <div class="flex-1">
                    <div class="text-xl font-semibold text-surface-950 dark:text-surface-0">{{ testimonial.name }}</div>
                    <span class="text-lg text-surface-500 mt-2">{{ testimonial.title }}</span>
                </div>
            </div>
        </div>
    `
})
export class TestimonialCardWidget {
    @Input() testimonial: any;
    @Input() className: string = '';

    layoutService = inject(LayoutService);
    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
