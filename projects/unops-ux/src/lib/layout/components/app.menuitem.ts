import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { LayoutService } from '../layout.service';
import type { MenuItem } from '../tokens';

@Component({
    selector: '[app-menuitem]',
    imports: [CommonModule, RouterModule, TooltipModule, RippleModule],
    template: `
        @if (root() && isVisible() && hasChildren()) {
            <div class="layout-menuitem-root-text">{{ item()?.label }}</div>
        }
        @if ((!hasRouterLink() || hasChildren()) && isVisible()) {
            <a
                [attr.href]="item()?.url"
                (click)="itemClick($event)"
                (mouseenter)="onMouseEnter()"
                (mouseleave)="onMouseLeave()"
                [ngClass]="item()?.class"
                [attr.target]="item()?.target"
                tabindex="0"
                pRipple
                [pTooltip]="item()?.label"
                [tooltipDisabled]="!((isCompact() || isRailCollapsed()) && !isActive() && root())"
            >
                <i [ngClass]="item()?.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text label-small text-inherit">{{ item()?.label }}</span>
                @if (hasChildren()) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                }
            </a>
        }
        @if (hasRouterLink() && !hasChildren() && isVisible()) {
            <a
                (click)="itemClick($event)"
                (mouseenter)="onMouseEnter()"
                (mouseleave)="onMouseLeave()"
                [ngClass]="item()?.class"
                [routerLink]="item()?.routerLink"
                routerLinkActive="active-route"
                [routerLinkActiveOptions]="item()?.routerLinkActiveOptions || { paths: 'exact', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' }"
                [fragment]="item()?.fragment"
                [queryParamsHandling]="item()?.queryParamsHandling"
                [preserveFragment]="item()?.preserveFragment"
                [skipLocationChange]="item()?.skipLocationChange"
                [replaceUrl]="item()?.replaceUrl"
                [state]="item()?.state"
                [queryParams]="item()?.queryParams"
                [attr.target]="item()?.target"
                tabindex="0"
                [pTooltip]="item()?.label"
                [tooltipDisabled]="!((isCompact() || isRailCollapsed()) && !isActive() && root())"
            >
                <i [ngClass]="item()?.icon" class="layout-menuitem-icon"></i>
                <span class="layout-menuitem-text label-small text-inherit">{{ item()?.label }}</span>
                @if (hasChildren()) {
                    <i class="pi pi-fw pi-angle-down layout-submenu-toggler"></i>
                }
            </a>
        }
        @if (hasChildren() && isVisible()) {
            <ul [animate.enter]="initialized() ? 'p-submenu-enter' : null" [animate.leave]="'p-submenu-leave'" [class.layout-root-submenulist]="root()">
                @for (child of item()?.items; track child?.label) {
                    <li app-menuitem [item]="child" [root]="false" [parentPath]="fullPath()" [preventAutoActivate]="preventAutoActivate() || !!item()?.preventAutoActivate" [class]="child?.['badgeClass']"></li>
                }
            </ul>
        }
    `,
    host: {
        '[class.active-menuitem]': 'isActive()',
        '[class.layout-root-menuitem]': 'root()',
        '[class.route-active-within]': 'isRouteWithin()'
    },
    styles: [
        `
            .p-submenu-enter {
                animation: p-animate-submenu-expand 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                overflow: hidden;
            }

            .p-submenu-leave {
                animation: p-animate-submenu-collapse 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                overflow: hidden;
            }

            @keyframes p-animate-submenu-expand {
                from {
                    max-height: 0;
                }
                to {
                    max-height: 1000px;
                }
            }

            @keyframes p-animate-submenu-collapse {
                from {
                    max-height: 1000px;
                }
                to {
                    max-height: 0;
                }
            }
        `
    ]
})
export class AppMenuitem implements AfterViewInit, OnDestroy {
    layoutService = inject(LayoutService);

    router = inject(Router);

    private hoverExpandTimer: ReturnType<typeof setTimeout> | null = null;

    item = input<MenuItem | null>(null);

    root = input<boolean>(true);

    parentPath = input<string | null>(null);

    preventAutoActivate = input<boolean>(false);

    isDisabled = computed(() => this.item()?.disabled ?? false);

    isSlim = computed(() => this.layoutService.layoutConfig().menuMode === 'slim');

    isHorizontal = computed(() => this.layoutService.layoutConfig().menuMode === 'horizontal');

    isCompact = computed(() => this.layoutService.layoutConfig().menuMode === 'compact');

    isRailCollapsed = computed(() => this.layoutService.isRail() && !this.layoutService.layoutState().sidebarExpanded);

    isVisible = computed(() => this.item()?.visible !== false);

    hasChildren = computed(() => !!this.item()?.items && (this.item()?.items?.length ?? 0) > 0);

    hasCommand = computed(() => typeof this.item()?.command === 'function');

    hasRouterLink = computed(() => !!this.item()?.routerLink);

    fullPath = computed(() => {
        const itemPath = this.item()?.path;
        if (!itemPath) return this.parentPath();
        const parent = this.parentPath();
        if (parent && !itemPath.startsWith(parent)) {
            return parent + itemPath;
        }
        return itemPath;
    });

    menuHoverActive = computed(() => this.layoutService.layoutState().menuHoverActive);

    isActive = computed(() => {
        const activePath = this.layoutService.layoutState().activePath;
        if (this.item()?.path) {
            return activePath?.startsWith(this.fullPath() ?? '') ?? false;
        }
        return false;
    });

    isRouteWithin = computed(() => {
        this.layoutService.currentUrl();
        if (!this.root() || !this.hasChildren()) return false;
        return this.hasMatchingChildRoute(this.item());
    });

    initialized = signal<boolean>(false);

    constructor() {
        effect(() => {
            this.updateActivePath();
        });
    }

    private readonly defaultMatchOptions: import('@angular/router').IsActiveMatchOptions = {
        paths: 'exact',
        queryParams: 'ignored',
        matrixParams: 'ignored',
        fragment: 'ignored'
    };

    private itemMatchOptions(item: MenuItem | null | undefined): import('@angular/router').IsActiveMatchOptions {
        return item?.routerLinkActiveOptions ?? this.defaultMatchOptions;
    }

    updateActivePath() {
        if (this.layoutService.hasOverlaySubmenu() && this.layoutService.isDesktop()) {
            return;
        }

        if (this.preventAutoActivate()) {
            return;
        }

        const item = this.item();
        const parentPath = this.parentPath();

        if (item?.routerLink && !item?.items) {
            const isRouteActive = this.router.isActive(item.routerLink[0], this.itemMatchOptions(item));

            if (isRouteActive && parentPath) {
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    activePath: parentPath
                }));
            }
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.initialized.set(true);
        });
    }

    itemClick(event: Event) {
        if (this.isDisabled()) {
            event.preventDefault();
            return;
        }

        if (this.hasCommand()) {
            this.item()?.command?.({ originalEvent: event, item: this.item() ?? undefined });
        }

        if (this.hasChildren()) {
            if (this.isActive()) {
                const deactivateHover = this.root() && this.layoutService.hasOverlaySubmenu() && this.layoutService.isDesktop();
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    activePath: this.parentPath(),
                    menuHoverActive: deactivateHover ? false : val.menuHoverActive
                }));
            } else {
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    activePath: this.fullPath(),
                    menuHoverActive: true
                }));
            }
        } else {
            this.layoutService.layoutState.update((val) => ({
                ...val,
                overlayMenuActive: false,
                mobileMenuActive: false,
                menuHoverActive: false
            }));

            if (this.layoutService.hasOverlaySubmenu() && this.layoutService.isDesktop()) {
                this.layoutService.layoutState.update((val) => ({
                    ...val,
                    activePath: null
                }));
            }
        }

        if (this.layoutService.isDesktop() && this.layoutService.isRail() && !this.layoutService.layoutState().sidebarExpanded) {
            this.layoutService.toggleSidebarPin();
        }
    }

    onMouseEnter() {
        if (this.layoutService.isDesktop() && this.root() && this.hasChildren() && this.menuHoverActive() && !this.isActive()) {
            this.layoutService.layoutState.update((val) => ({
                ...val,
                activePath: this.fullPath(),
                menuHoverActive: true
            }));
        }
    }

    onMouseLeave() {}

    ngOnDestroy() {
        this.clearHoverTimer();
    }

    private scheduleRailExpand() {
        this.clearHoverTimer();
        this.hoverExpandTimer = setTimeout(() => {
            this.layoutService.layoutState.update((val) => ({
                ...val,
                sidebarExpanded: true
            }));
        }, 500);
    }

    private clearHoverTimer() {
        if (this.hoverExpandTimer !== null) {
            clearTimeout(this.hoverExpandTimer);
            this.hoverExpandTimer = null;
        }
    }

    private hasMatchingChildRoute(item: MenuItem | null | undefined): boolean {
        if (!item) return false;
        if (item.routerLink) {
            return this.router.isActive(item.routerLink[0], this.itemMatchOptions(item));
        }
        return item.items?.some((child) => this.hasMatchingChildRoute(child)) ?? false;
    }
}
