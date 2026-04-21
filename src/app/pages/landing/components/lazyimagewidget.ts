import { Component, DestroyRef, ElementRef, afterNextRender, inject, input, signal } from '@angular/core';

@Component({
    selector: 'app-lazy-image-widget',
    standalone: true,
    template: ` <img [src]="isIntersecting() ? src() : ''" [alt]="alt()" [class]="className()" [class.opacity-0]="!isLoaded()" class="transition-opacity duration-700 ease-out delay-75" (load)="handleLoad()" /> `
})
export class LazyImageWidget {
    src = input<string>('');
    alt = input<string>('');
    className = input<string>('');

    isIntersecting = signal(false);
    isLoaded = signal(false);

    private el = inject(ElementRef);
    private destroyRef = inject(DestroyRef);

    constructor() {
        afterNextRender(() => {
            const imageElement = this.el.nativeElement.querySelector('img');

            if (imageElement) {
                const observer = new IntersectionObserver(
                    ([entry]) => {
                        if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                            this.isIntersecting.set(true);
                            observer.unobserve(entry.target);
                        }
                    },
                    { threshold: 0.1 }
                );

                observer.observe(imageElement);

                this.destroyRef.onDestroy(() => {
                    observer.disconnect();
                });
            }
        });
    }

    handleLoad() {
        this.isLoaded.set(true);
    }
}
