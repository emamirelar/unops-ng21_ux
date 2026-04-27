import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-documentation',
    imports: [CommonModule],
    template: `
        <div class="card animate-fade-in">
            <div class="font-semibold text-2xl mb-4">Documentation</div>
            <div class="font-semibold text-xl mb-4">Get Started</div>
            <p class="text-lg mb-4">UNOPS is an application template for Angular and is distributed as a CLI project. Current versions are Angular v21 with PrimeNG v21. In case CLI is not installed already, use the command below to set it up.</p>
            <pre class="app-code">
<code>npm install -g &#64;angular/cli</code></pre>
            <p class="text-lg mb-4">
                Once CLI is ready in your system, extract the contents of the zip file distribution, cd to the directory, install the libraries from npm and then execute "ng serve" to run the application in your local environment.
            </p>
            <pre class="app-code">
<code>npm install
ng serve</code></pre>

            <p class="text-lg mb-4">
                The application should run at
                <i class="bg-highlight px-2 py-1 rounded-border not-italic text-base">http://localhost:4200/</i>
                to view the application in your local environment.
            </p>

            <div class="font-semibold text-xl mb-4">Structure</div>
            <p class="text-lg mb-4">Templates consists of a couple folders, demos and layout have been separated so that you can easily remove what is not necessary for your application.</p>
            <ul class="leading-normal list-disc pl-8 text-lg mb-4">
                <li><span class="text-primary font-medium">projects/unops-ux</span>: Publishable <code>&#64;unops/ux</code> library (layout shell, brand theme, types, SCSS/Tailwind), required.</li>
                <li><span class="text-primary font-medium">src/app/layout</span>: App-only shell (e.g. marketing <code>LandingLayout</code>).</li>
                <li><span class="text-primary font-medium">src/app/pages</span>: Demo pages like Dashboard, optional.</li>
                <li><span class="text-primary font-medium">public/demo/</span>: Public asssets used in demos, optional.</li>
                <li><span class="text-primary font-medium">public/layout/</span>: Public asssets used for the main layout, required.</li>
                <li><span class="text-primary font-medium">src/assets/demo</span>: Resources used in demos, optional.</li>
            </ul>

            <div class="font-semibold text-xl mb-4">Menu</div>
            <p class="text-lg mb-4">
                The sidebar menu is provided via the
                <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">MENU_MODEL</span>
                injection token. In this demo app, items are built in
                <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/app/config/app-menu.ts</span>
                and registered in <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">src/app.config.ts</span>.
            </p>

            <div class="font-semibold text-xl mb-4">Layout Service</div>
            <p class="text-lg mb-4">
                <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">projects/unops-ux/src/lib/layout/layout.service.ts</span>
                (<code>LayoutService</code> from <code>&#64;unops/ux</code>) manages layout state changes, including dark mode, PrimeNG theme, menu modes, and states.
            </p>

            <div class="font-semibold text-xl mb-4">Tailwind CSS</div>
            <p class="text-lg mb-4">The demo pages are developed with Tailwind CSS however the core application shell mainly uses custom CSS.</p>

            <div class="font-semibold text-xl mb-4">Variables</div>
            <p class="text-lg mb-4">
                CSS variables used in the template are derived from the default theme. Customize them through the CSS variables in
                <span class="bg-highlight px-2 py-1 rounded-border not-italic text-base">projects/unops-ux/src/assets/variables</span>.
            </p>
        </div>
    `,
    styles: `
        @media screen and (max-width: 991px) {
            .video-container {
                position: relative;
                width: 100%;
                height: 0;
                padding-bottom: 56.25%;

                iframe {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }
            }
        }
    `
})
export class Documentation {}
