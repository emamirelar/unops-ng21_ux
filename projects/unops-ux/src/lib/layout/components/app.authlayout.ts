import { LayoutService } from '../layout.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppConfigurator } from './app.configurator';

@Component({
    selector: 'auth-layout',
    imports: [RouterModule, AppConfigurator],
    template: `
        <main>
            <router-outlet></router-outlet>
        </main>
        <button class="layout-config-button config-link" (click)="layoutService.toggleConfigSidebar()">
            <i class="pi pi-cog"></i>
        </button>
        <app-configurator location="landing" />
    `
})
export class AuthLayout {
    layoutService: LayoutService = inject(LayoutService);
}
