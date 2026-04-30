import { LayoutService } from '@unops/ux';
import { LazyImageWidget } from '@/app/pages/landing/components/lazyimagewidget';
import { LogoWidget } from '@/app/pages/landing/components/logowidget';
import { Component, computed, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-lockscreen',
    imports: [RouterLink, LogoWidget, InputTextModule, LazyImageWidget, ReactiveFormsModule],
    standalone: true,
    template: `
        <section class="min-h-screen flex items-center lg:items-start lg:py-20 justify-center animate-fadein animate-duration-300 animate-ease-in max-w-400 mx-auto">
            <div class="flex w-full h-full justify-center gap-12">
                <div class="flex flex-col py-20 lg:min-w-120">
                    <a routerLink="/" class="flex items-center justify-center lg:justify-start mb-8">
                        <logo-widget />
                    </a>
                    <div class="flex flex-col justify-center grow">
                        <div class="max-w-md mx-auto w-full animate-scale-in-subtle">
                            <h5 class="title-h5 text-center lg:text-left">Screen Locked</h5>
                            <p class="body-small mt-3.5 text-center lg:text-left">Please enter your password</p>
                            <form class="mt-8">
                                <label for="lock-password" class="sr-only">Password</label>
                                <input id="lock-password" pInputText type="password" [formControl]="passwordControl" class="w-full" placeholder="Password" />
                                <div class="flex items-center gap-4 mt-6">
                                    <button type="submit" class="body-button w-full">Unlock</button>
                                </div>
                            </form>
                            <div class="mt-8 body-small text-center lg:text-left">A problem? <a class="text-primary-500 hover:underline cursor-pointer">Contact support</a> and let us help you.</div>
                        </div>
                    </div>
                    <div class="mt-8 text-center lg:text-start block relative text-surface-400 dark:text-surface-500 text-sm">©{{ currentYear }} PrimeTek</div>
                </div>
                <div class="hidden lg:flex h-full py-20">
                    <div class="h-full w-full lg:max-w-130 xl:max-w-242 mx-auto flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] rounded-3xl border border-surface overflow-hidden">
                        <app-lazy-image-widget className="w-auto h-full object-contain object-left" src="demo/images/landing/auth-image.svg" alt="Auth Image" />
                    </div>
                </div>
            </div>
        </section>
    `
})
export class LockScreen {
    LayoutService = inject(LayoutService);

    isDarkTheme = computed(() => this.LayoutService.isDarkTheme());

    currentYear: number = new Date().getFullYear();

    passwordControl = new FormControl<string>('');
}
