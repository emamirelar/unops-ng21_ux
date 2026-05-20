import { InjectionToken, Signal } from '@angular/core';
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

export interface TopbarLanguageItem {
    code: string;
    label: string;
    flag: string;
}

export interface TopbarLanguageConfig {
    languages: TopbarLanguageItem[];
    defaultLanguage?: string;
    onLanguageChange?: (code: string) => void;
}

export const TOPBAR_LANGUAGE_CONFIG = new InjectionToken<TopbarLanguageConfig>('UNOPS_UX_TOPBAR_LANGUAGE_CONFIG');

export interface TopbarProfileMenuItem {
    id: string;
    label: string;
    icon: string;
    separator?: boolean;
    command: () => void;
}

export interface TopbarProfileMenuConfig {
    items: TopbarProfileMenuItem[];
}

export const TOPBAR_PROFILE_MENU_CONFIG = new InjectionToken<TopbarProfileMenuConfig>('UNOPS_UX_TOPBAR_PROFILE_MENU_CONFIG');

export interface TopbarNotificationItem {
    id: number;
    message: string;
    category: string;
    time: string;
    isRead: boolean;
    entity?: string;
    entityId?: number;
    icon?: string;
}

export interface TopbarNotificationTab {
    id: string;
    label: string;
    badge?: string;
}

export interface TopbarNotificationConfig {
    tabs: Signal<TopbarNotificationTab[]>;
    items: Signal<TopbarNotificationItem[]>;
    selectedTab: Signal<string>;
    unreadCount: Signal<number>;
    onTabChange: (tabId: string) => void;
    onItemClick: (item: TopbarNotificationItem) => void;
    onMarkAsRead: (item: TopbarNotificationItem) => void;
    onMarkAllAsRead: () => void;
    onPanelOpen?: () => void;
}

export const TOPBAR_NOTIFICATION_CONFIG = new InjectionToken<TopbarNotificationConfig>('UNOPS_UX_TOPBAR_NOTIFICATION_CONFIG');
