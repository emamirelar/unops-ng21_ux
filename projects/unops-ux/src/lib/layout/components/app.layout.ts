import { CommonModule } from '@angular/common';
import { Component, computed, effect, ElementRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { LayoutService } from '../layout.service';
import { AppBreadcrumb } from './app.breadcrumb';
import { AppConfigurator } from './app.configurator';
import { AppRightMenu } from './app.rightmenu';
import { AppSearch } from './app.search';
import { AppSidebar } from './app.sidebar';
import { AppTopbar } from './app.topbar';
import { FooterMainComponent } from '../../components/footer-main/footer-main';

@Component({
    selector: 'app-layout',
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppConfigurator, AppBreadcrumb, FooterMainComponent, AppSearch, AppRightMenu],
    template: `<div class="layout-wrapper" [ngClass]="containerClass()">
        <div app-topbar></div>
        <div class="layout-body">
            <div app-sidebar></div>
            <div class="layout-content-wrapper">
                <div class="layout-content-wrapper-inside">
                    <main class="layout-content">
                        <div app-breadcrumb></div>
                        <router-outlet></router-outlet>
                    </main>
                    <ux-footer-main class="footer-sticky" />
                </div>
            </div>
        </div>
        <app-configurator />
        <div app-search></div>
        <div app-rightmenu></div>
        <div class="layout-mask"></div>
    </div> `
})
export class AppLayout {
    layoutService = inject(LayoutService);
    private elRef = inject(ElementRef);

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });

        inject(Router).events.pipe(
            filter((e): e is NavigationEnd => e instanceof NavigationEnd),
            takeUntilDestroyed()
        ).subscribe(() => {
            const wrapper: HTMLElement | null = this.elRef.nativeElement.querySelector('.layout-content-wrapper');
            if (wrapper) wrapper.scrollTop = 0;
        });
    }

    containerClass = computed(() => {
        const layoutConfig = this.layoutService.layoutConfig();
        const layoutState = this.layoutService.layoutState();
        return {
            'layout-overlay': layoutConfig.menuMode === 'overlay',
            'layout-static': layoutConfig.menuMode === 'static',
            'layout-slim': layoutConfig.menuMode === 'slim',
            'layout-horizontal': layoutConfig.menuMode === 'horizontal',
            'layout-compact': layoutConfig.menuMode === 'compact',
            'layout-reveal': layoutConfig.menuMode === 'reveal',
            'layout-drawer': layoutConfig.menuMode === 'drawer',
            'layout-overlay-active': layoutState.overlayMenuActive,
            'layout-mobile-active': layoutState.mobileMenuActive,
            'layout-sidebar-expanded': layoutState.sidebarExpanded,
            'layout-sidebar-rail': !layoutState.sidebarPinned && layoutConfig.menuMode === 'static',
            'layout-sidebar-anchored': layoutState.anchored,
            [`layout-card-${layoutConfig.cardStyle}`]: true,
            [`layout-sidebar-${layoutConfig.menuTheme}`]: true
        };
    });
}
