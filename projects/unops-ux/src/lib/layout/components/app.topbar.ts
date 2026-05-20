import { LayoutService } from '../layout.service';
import { TOPBAR_MOBILE_LOGO, TOPBAR_LANGUAGE_CONFIG, TOPBAR_PROFILE_MENU_CONFIG, TOPBAR_NOTIFICATION_CONFIG } from '../tokens';
import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, inject, model, signal, ViewChild, ChangeDetectionStrategy, AfterViewChecked } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { OverlayBadgeModule } from 'primeng/overlaybadge';
import { RippleModule } from 'primeng/ripple';
import { AppBreadcrumb } from './app.breadcrumb';

type DropdownId = 'notifications' | 'language' | 'profile' | null;

interface NotificationsBars {
    id: string;
    label: string;
    badge?: string | any;
}

@Component({
    selector: '[app-topbar]',
    imports: [RouterModule, CommonModule, AppBreadcrumb, InputTextModule, ButtonModule, IconFieldModule, InputIconModule, RippleModule, BadgeModule, OverlayBadgeModule, AvatarModule],
    template: `<div class="layout-topbar">
        <button type="button" class="mobile-menu-button" aria-label="Toggle navigation menu" (click)="onMenuButtonClick()">
            <i class="pi pi-bars"></i>
        </button>
        <div class="topbar-left">
            <div class="topbar-sidebar-section">
                <button
                    type="button"
                    class="topbar-menu-toggle"
                    [class.active]="isSidebarPinned()"
                    [attr.aria-label]="isSidebarPinned() ? 'Collapse sidebar' : 'Expand sidebar'"
                    (click)="toggleSidebarPin()"
                >
                    <i class="pi pi-bars"></i>
                </button>
                <a class="topbar-logo" [routerLink]="['/']">
                    <img [src]="desktopLogo()" [attr.alt]="mobileLogoConfig.alt" />
                </a>
                <span class="topbar-logo-separator"></span>
            </div>
        </div>

        <div class="topbar-main">
            <div app-breadcrumb></div>
            @if (searchActive()) {
                <div class="flex items-center gap-2 ml-auto">
                    <p-iconfield class="w-48 sm:w-80">
                        <p-inputicon styleClass="pi pi-search" />
                        <input #searchInput type="text" pInputText placeholder="Search..." aria-label="Search" class="w-full !py-2 !text-sm" (keydown.escape)="closeSearch()" />
                    </p-iconfield>
                    <button type="button" class="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer hover:bg-emphasis transition-colors" aria-label="Close search" (click)="closeSearch()">
                        <i class="pi pi-times text-sm"></i>
                    </button>
                </div>
            }
            <div class="topbar-right">
                <ul class="topbar-menu">
                <li class="right-sidebar-item" [class.hidden]="searchActive()">
                    <a class="right-sidebar-button" aria-label="Open search" (click)="openSearch()">
                        <i class="pi pi-search"></i>
                    </a>
                </li>
                <li class="right-sidebar-item" [class.hidden]="searchActive()">
                    <a
                        class="right-sidebar-button"
                        [attr.aria-label]="isDarkTheme() ? 'Switch to light mode' : 'Switch to dark mode'"
                        (click)="toggleDarkMode()"
                    >
                        <i [class]="isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"></i>
                    </a>
                </li>
                <li class="right-sidebar-item static sm:relative z-50" #notificationsItem>
                    <a class="right-sidebar-button" aria-label="Notifications" (click)="toggleDropdown('notifications', $event); onNotificationBellClick()">
                        @if (notifConfig && notifConfig.unreadCount() > 0) {
                            <span class="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2.5"></span>
                        } @else if (!notifConfig) {
                            <span class="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2.5"></span>
                        }
                        <i class="pi pi-bell"></i>
                    </a>
                    @if (activeDropdown() === 'notifications') {
                        <div
                            class="list-none m-0 rounded-2xl border border-surface fixed sm:absolute bg-surface-0 dark:bg-surface-900 overflow-hidden origin-top w-[calc(100vw-2rem)] sm:w-88 mt-2 z-50 top-auto left-4 sm:left-auto sm:right-0 shadow-flyout animate-scalein"
                        >
                            @if (notifConfig) {
                                <div class="p-4 flex items-center justify-between border-b border-surface">
                                    <span class="label-small text-surface-950 dark:text-surface-0">Notifications</span>
                                    <button pRipple class="py-1 px-2 text-surface-950 dark:text-surface-0 label-x-small hover:bg-emphasis border border-surface rounded-lg shadow-subtle transition-all" (click)="notifConfig.onMarkAllAsRead()">Mark all as read</button>
                                </div>
                                <div class="flex items-center border-b border-surface">
                                    @for (tab of notifConfig.tabs(); track tab.id) {
                                        <button
                                            [ngClass]="{ 'border-surface-950 dark:border-surface-0': notifConfig.selectedTab() === tab.id, 'border-transparent': notifConfig.selectedTab() !== tab.id }"
                                            class="px-3.5 py-2 inline-flex items-center border-b gap-2"
                                            (click)="notifConfig.onTabChange(tab.id)"
                                        >
                                            <span [ngClass]="{ 'text-surface-950 dark:text-surface-0': notifConfig.selectedTab() === tab.id }" class="label-small">{{ tab.label }}</span>
                                            <p-badge *ngIf="tab.badge" [value]="tab.badge" severity="success" size="small" class="rounded-md!" />
                                        </button>
                                    }
                                </div>
                                <ul class="flex flex-col divide-y divide-(--surface-border) max-h-80 overflow-auto">
                                    @if (notifConfig.items().length === 0) {
                                        <li class="px-4 sm:px-6 py-8 text-center">
                                            <i class="pi pi-bell-slash text-2xl text-surface-400 mb-2"></i>
                                            <p class="label-small text-surface-400">No {{ notifConfig.selectedTab() === 'unread' ? 'unread ' : '' }}notifications</p>
                                        </li>
                                    } @else {
                                        @for (item of notifConfig.items(); track item.id) {
                                            <li>
                                                <div class="flex items-center gap-3 px-4 sm:px-6 py-3.5 cursor-pointer hover:bg-emphasis transition-all" (click)="notifConfig.onItemClick(item)">
                                                    <div class="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0" [ngClass]="item.isRead ? 'bg-surface-100 dark:bg-surface-800' : 'bg-primary/10'">
                                                        <i [class]="item.icon || 'pi pi-bell'" [ngClass]="item.isRead ? 'text-surface-500' : 'text-primary'"></i>
                                                    </div>
                                                    <div class="flex items-center gap-3 flex-1 min-w-0">
                                                        <div class="flex flex-col flex-1 min-w-0">
                                                            <span class="label-small text-left line-clamp-2" [ngClass]="item.isRead ? '' : 'text-surface-950 dark:text-surface-0 font-semibold'">{{ item.message }}</span>
                                                            <span class="label-xsmall text-left">{{ item.time }}</span>
                                                        </div>
                                                        @if (!item.isRead) {
                                                            <span class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></span>
                                                        }
                                                    </div>
                                                </div>
                                            </li>
                                        }
                                    }
                                </ul>
                            } @else {
                                <div class="p-4 flex items-center justify-between border-b border-surface">
                                    <span class="label-small text-surface-950 dark:text-surface-0">Notifications</span>
                                    <button pRipple class="py-1 px-2 text-surface-950 dark:text-surface-0 label-x-small hover:bg-emphasis border border-surface rounded-lg shadow-subtle transition-all">Mark all as read</button>
                                </div>
                                <div class="flex items-center border-b border-surface">
                                    @for (item of notificationsBars(); track item.id; let i = $index) {
                                        <button
                                            [ngClass]="{ 'border-surface-950 dark:border-surface-0': selectedNotificationBar() === item.id, 'border-transparent': selectedNotificationBar() !== item.id }"
                                            class="px-3.5 py-2 inline-flex items-center border-b gap-2"
                                            (click)="selectedNotificationBar.set(item.id)"
                                        >
                                            <span [ngClass]="{ 'text-surface-950 dark:text-surface-0': selectedNotificationBar() === item.id }" class="label-small">{{ item.label }}</span>
                                            <p-badge *ngIf="item?.badge" [value]="item.badge" severity="success" size="small" class="rounded-md!" />
                                        </button>
                                    }
                                </div>
                                <ul class="flex flex-col divide-y divide-(--surface-border) max-h-80 overflow-auto">
                                    @for (item of selectedNotificationsBarData(); track item.name; let i = $index) {
                                        <li>
                                            <div class="flex items-center gap-3 px-4 sm:px-6 py-3.5 cursor-pointer hover:bg-emphasis transition-all">
                                                <p-overlay-badge value="" severity="danger" class="inline-flex">
                                                    <p-avatar [label]="item.initials" size="large" styleClass="rounded-lg" />
                                                </p-overlay-badge>
                                                <div class="flex items-center gap-3">
                                                    <div class="flex flex-col">
                                                        <span class="label-small text-left text-surface-950 dark:text-surface-0">{{ item.name }}</span>
                                                        <span class="label-xsmall text-left line-clamp-1">{{ item.description }}</span>
                                                        <span class="label-xsmall text-left">{{ item.time }}</span>
                                                    </div>
                                                    <p-badge *ngIf="item.new" value="" severity="success" />
                                                </div>
                                            </div>
                                            <span *ngIf="i !== notifications().length - 1"></span>
                                        </li>
                                    }
                                </ul>
                            }
                        </div>
                    }
                </li>
                <li class="right-sidebar-item static sm:relative" #languageItem>
                    <a class="right-sidebar-button relative z-50" aria-label="Change language" (click)="toggleDropdown('language', $event)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="m5 8 6 6"/>
                            <path d="m4 14 6-6 2-3"/>
                            <path d="M2 5h12"/>
                            <path d="M7 2h1"/>
                            <path d="m22 22-5-10-5 10"/>
                            <path d="M14 18h6"/>
                        </svg>
                    </a>
                    @if (activeDropdown() === 'language') {
                        <div
                            class="list-none p-2 m-0 rounded-2xl border border-surface overflow-hidden fixed sm:absolute bg-surface-0 dark:bg-surface-900 origin-top w-44 mt-2 right-4 sm:right-0 z-999 top-auto shadow-flyout animate-scalein"
                        >
                            <ul class="flex flex-col gap-1">
                                @for (lang of languages(); track lang.code) {
                                    <li>
                                        <a
                                            class="label-small dark:text-surface-400 flex gap-2.5 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                                            [class.text-surface-950]="selectedLanguage() === lang.code"
                                            [class.dark:text-surface-0]="selectedLanguage() === lang.code"
                                            [class.font-semibold]="selectedLanguage() === lang.code"
                                            (click)="selectLanguage(lang.code)"
                                        >
                                            <span class="text-lg">{{ lang.flag }}</span>
                                            <span>{{ lang.label }}</span>
                                        </a>
                                    </li>
                                }
                            </ul>
                        </div>
                    }
                </li>
                <li class="profile-item static sm:relative" #profileItem>
                    <a class="right-sidebar-button relative z-50" aria-label="User profile menu" (click)="toggleDropdown('profile', $event)">
                        <p-avatar icon="pi pi-user" styleClass="w-10! h-10!" />
                    </a>
                    @if (activeDropdown() === 'profile') {
                        <div
                            #profilePanel
                            class="list-none p-2 m-0 rounded-2xl border border-surface overflow-hidden fixed sm:absolute bg-surface-0 dark:bg-surface-900 origin-top w-52 mt-2 right-4 sm:right-0 z-999 top-auto shadow-flyout animate-scalein"
                        >
                            <ul class="flex flex-col gap-1">
                                <div class="mobile-profile-actions">
                                    <li>
                                        <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer" (click)="closeDropdown(); openSearch()">
                                            <i class="pi pi-search"></i>
                                            <span>Search</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer" (click)="closeDropdown(); toggleDarkMode()">
                                            <i [class]="isDarkTheme() ? 'pi pi-sun' : 'pi pi-moon'"></i>
                                            <span>{{ isDarkTheme() ? 'Light Mode' : 'Dark Mode' }}</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer relative" (click)="closeDropdown()">
                                            <i class="pi pi-bell"></i>
                                            <span>Notifications</span>
                                            <span class="w-2 h-2 rounded-full bg-red-500 ml-auto"></span>
                                        </a>
                                    </li>
                                    <li class="border-b border-surface pb-1 mb-1">
                                        <span class="label-xsmall px-2.5 py-1 text-surface-400">Language</span>
                                        @for (lang of languages(); track lang.code) {
                                            <a
                                                class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                                                [class.text-surface-950]="selectedLanguage() === lang.code"
                                                [class.dark:text-surface-0]="selectedLanguage() === lang.code"
                                                [class.font-semibold]="selectedLanguage() === lang.code"
                                                (click)="closeDropdown(); selectLanguage(lang.code)"
                                            >
                                                <span class="text-lg">{{ lang.flag }}</span>
                                                <span>{{ lang.label }}</span>
                                                @if (selectedLanguage() === lang.code) {
                                                    <i class="pi pi-check ml-auto text-xs"></i>
                                                }
                                            </a>
                                        }
                                    </li>
                                </div>
                                @if (profileMenuConfig) {
                                    @for (item of profileMenuConfig.items; track item.id) {
                                        <li [class.border-t]="item.separator" [class.border-surface]="item.separator" [class.mt-1]="item.separator" [class.pt-1]="item.separator">
                                            <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer" (click)="closeDropdown(); item.command()">
                                                <i [class]="item.icon"></i>
                                                <span>{{ item.label }}</span>
                                            </a>
                                        </li>
                                    }
                                } @else {
                                    <li>
                                        <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer" (click)="closeDropdown()">
                                            <i class="pi pi-user"></i>
                                            <span>Profile</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer" (click)="closeDropdown(); onConfigButtonClick()">
                                            <i class="pi pi-cog"></i>
                                            <span>Settings</span>
                                        </a>
                                    </li>
                                    <li class="border-t border-surface mt-1 pt-1">
                                        <a class="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer" (click)="closeDropdown()">
                                            <i class="pi pi-power-off"></i>
                                            <span>Log out</span>
                                        </a>
                                    </li>
                                }
                            </ul>
                        </div>
                    }
                </li>
                </ul>
            </div>
        </div>

        <a class="mobile-logo" [routerLink]="['/']">
            <img [src]="mobileLogo()" [attr.alt]="mobileLogoConfig.alt" />
        </a>
    </div>`
})
export class AppTopbar implements AfterViewChecked {
    layoutService = inject(LayoutService);

    readonly mobileLogoConfig = inject(TOPBAR_MOBILE_LOGO);

    mobileLogo = computed(() =>
        this.layoutService.isDarkTheme() ? this.mobileLogoConfig.dark : this.mobileLogoConfig.light
    );

    desktopLogo = computed(() =>
        this.layoutService.isDarkTheme() ? this.mobileLogoConfig.dark : this.mobileLogoConfig.light
    );

    isDarkTheme = computed(() => this.layoutService.isDarkTheme());

    isSidebarPinned = computed(() => this.layoutService.isSidebarPinned());

    searchActive = signal(false);
    activeDropdown = signal<DropdownId>(null);
    private shouldFocusSearch = false;

    @ViewChild('menubutton') menuButton!: ElementRef;
    @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;
    @ViewChild('notificationsItem') notificationsItem!: ElementRef;
    @ViewChild('languageItem') languageItem!: ElementRef;
    @ViewChild('profileItem') profileItem!: ElementRef;

    notificationsBars = signal<NotificationsBars[]>([
        {
            id: 'inbox',
            label: 'Inbox',
            badge: '2'
        },
        {
            id: 'general',
            label: 'General'
        },
        {
            id: 'archived',
            label: 'Archived'
        }
    ]);

    notifications = signal<any[]>([
        {
            id: 'inbox',
            data: [
                {
                    initials: 'ML',
                    name: 'Michael Lee',
                    description: 'You have a new message from the support team regarding your recent inquiry.',
                    time: '1 hour ago',
                    new: true
                },
                {
                    initials: 'AJ',
                    name: 'Alice Johnson',
                    description: 'Your report has been successfully submitted and is under review.',
                    time: '10 minutes ago',
                    new: true
                },
                {
                    initials: 'ED',
                    name: 'Emily Davis',
                    description: 'The project deadline has been updated to September 30th. Please check the details.',
                    time: 'Yesterday at 4:35 PM',
                    new: false
                }
            ]
        },
        {
            id: 'general',
            data: [
                {
                    initials: 'AJ',
                    name: 'Alice Johnson',
                    description: 'Reminder: Your subscription is about to expire in 3 days. Renew now to avoid interruption.',
                    time: '30 minutes ago',
                    new: true
                },
                {
                    initials: 'ML',
                    name: 'Michael Lee',
                    description: 'The server maintenance has been completed successfully. No further downtime is expected.',
                    time: 'Yesterday at 2:15 PM',
                    new: false
                }
            ]
        },
        {
            id: 'archived',
            data: [
                {
                    initials: 'LB',
                    name: 'Lucas Brown',
                    description: 'Your appointment with Dr. Anderson has been confirmed for October 12th at 10:00 AM.',
                    time: '1 week ago',
                    new: true
                },
                {
                    initials: 'ED',
                    name: 'Emily Davis',
                    description: 'The document you uploaded has been successfully archived for future reference.',
                    time: '2 weeks ago',
                    new: false
                }
            ]
        }
    ]);

    private readonly langConfig = inject(TOPBAR_LANGUAGE_CONFIG, { optional: true });
    readonly profileMenuConfig = inject(TOPBAR_PROFILE_MENU_CONFIG, { optional: true });
    readonly notifConfig = inject(TOPBAR_NOTIFICATION_CONFIG, { optional: true });

    languages = signal(this.langConfig?.languages ?? [
        { code: 'en', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
        { code: 'fr', label: 'French', flag: '\u{1F1EB}\u{1F1F7}' },
        { code: 'es', label: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}' }
    ]);

    selectedLanguage = signal(this.langConfig?.defaultLanguage ?? 'en');

    selectedNotificationBar = model(this.notificationsBars()[0].id ?? 'inbox');

    selectedNotificationsBarData = computed(() => this.notifications().find((f) => f.id === this.selectedNotificationBar()).data);

    onMenuButtonClick() {
        this.layoutService.toggleMenu();
    }

    toggleSidebarPin() {
        this.layoutService.toggleSidebarPin();
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    showRightMenu() {
        this.layoutService.toggleRightMenu();
    }

    onConfigButtonClick() {
        this.layoutService.toggleConfigSidebar();
    }

    selectLanguage(code: string) {
        this.selectedLanguage.set(code);
        this.langConfig?.onLanguageChange?.(code);
        this.closeDropdown();
    }

    onNotificationBellClick() {
        this.notifConfig?.onPanelOpen?.();
    }

    toggleDropdown(id: DropdownId, event: Event) {
        event.stopPropagation();
        this.activeDropdown.update((current) => (current === id ? null : id));
    }

    closeDropdown() {
        this.activeDropdown.set(null);
    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
        if (!this.activeDropdown()) return;

        const target = event.target as Node;
        const containers = [
            this.notificationsItem?.nativeElement,
            this.languageItem?.nativeElement,
            this.profileItem?.nativeElement
        ];

        const insideAny = containers.some((el) => el?.contains(target));
        if (!insideAny) {
            this.closeDropdown();
        }
    }

    openSearch() {
        this.searchActive.set(true);
        this.shouldFocusSearch = true;
    }

    closeSearch() {
        this.searchActive.set(false);
    }

    ngAfterViewChecked() {
        if (this.shouldFocusSearch && this.searchInput) {
            this.searchInput.nativeElement.focus();
            this.shouldFocusSearch = false;
        }
    }

    toggleSearchBar() {
        this.layoutService.toggleSearchBar();
    }
}
