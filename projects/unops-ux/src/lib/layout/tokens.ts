import { InjectionToken } from '@angular/core';
import type { IsActiveMatchOptions, QueryParamsHandling } from '@angular/router';

/**
 * Sidebar / compact menu item shape (recursive). Matches Sakai-style menu model.
 */
export interface MenuItem {
    label?: string;
    icon?: string;
    routerLink?: string[];
    url?: string;
    target?: string;
    separator?: boolean;
    path?: string;
    visible?: boolean;
    disabled?: boolean;
    preventAutoActivate?: boolean;
    command?: (event?: { originalEvent?: Event; item?: MenuItem }) => void;
    items?: MenuItem[];
    class?: string;
    badgeClass?: string;
    fragment?: string;
    queryParamsHandling?: QueryParamsHandling;
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    state?: Record<string, unknown>;
    queryParams?: Record<string, unknown>;
    routerLinkActiveOptions?: IsActiveMatchOptions;
}

export const MENU_MODEL = new InjectionToken<MenuItem[]>('UNOPS_UX_MENU_MODEL', {
    factory: () => {
        throw new Error(
            'MENU_MODEL is not provided. Add { provide: MENU_MODEL, useFactory: ... } or useValue to app.config.ts providers.'
        );
    }
});

export interface SidebarLogoConfig {
    expanded: string;
    compact: string;
    alt: string;
}

export const SIDEBAR_LOGO = new InjectionToken<SidebarLogoConfig>('UNOPS_UX_SIDEBAR_LOGO', {
    factory: () => ({
        expanded: 'assets/opp/AppLogo/AppLogo-onDark_H.svg',
        compact: 'assets/opp/AppLogo/AppLogo-onDark_compact.svg',
        alt: 'UNOPS'
    })
});

export interface TopbarMobileLogoConfig {
    dark: string;
    light: string;
    alt: string;
}

export const TOPBAR_MOBILE_LOGO = new InjectionToken<TopbarMobileLogoConfig>('UNOPS_UX_TOPBAR_MOBILE_LOGO', {
    factory: () => ({
        dark: 'assets/opp/AppLogo/AppLogo-onDark_H.svg',
        light: 'assets/opp/AppLogo/AppLogo-onLight_H.svg',
        alt: 'UNOPS'
    })
});
