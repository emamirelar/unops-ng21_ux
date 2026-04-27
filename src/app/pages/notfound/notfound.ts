import { LayoutService } from '@emamirelar/ux';
import { LazyImageWidget } from '@/app/pages/landing/components/lazyimagewidget';
import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-notfound',
    imports: [LazyImageWidget, RouterModule],
    template: ` <section class="animate-fadein animate-duration-300 animate-ease-in landing-container mx-auto min-h-[75vh] lg:min-h-screen flex flex-col items-center justify-center">
            <app-lazy-image-widget className="w-64 lg:w-96" [src]="'demo/images/landing/' + (isDarkTheme() ? '404-dark.png' : '404.png')" alt="404 Image" />
            <h1 class="title-h5 lg:title-h1 mt-8">Under Construction</h1>
            <p class="body-small lg:body-large mt-2 lg:mt-4">Come back later!</p>
            <a routerLink="/" class="body-button bg-blue-600 w-fit mt-8 hover:bg-blue-500 px-4">Go to the Homepage</a>
        </section>`
})
export class Notfound {
    private layoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());
}
