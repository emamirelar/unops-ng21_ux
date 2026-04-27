import { LayoutService } from '../layout.service';
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';

import { BehaviorSubject, filter } from 'rxjs';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    imports: [CommonModule, RouterModule],
    template: `<nav class="layout-breadcrumb" aria-label="Breadcrumb">
        <button type="button" class="breadcrumb-back" [attr.aria-label]="sidebarCollapsed() ? 'Expand sidebar' : 'Collapse sidebar'" (click)="toggleSidebar()">
            <i [class]="sidebarCollapsed() ? 'pi pi-chevron-right' : 'pi pi-chevron-left'"></i>
        </button>
        <span class="breadcrumb-divider"></span>
        <ol>
            <ng-template ngFor let-item let-last="last" [ngForOf]="breadcrumbs$ | async">
                <li class="text-sm font-medium text-deepsea-500 dark:text-surface-0">{{ item.label }}</li>
                <li *ngIf="!last" class="text-sm font-medium text-deepsea-500 dark:text-surface-0">/</li>
            </ng-template>
        </ol>
    </nav> `
})
export class AppBreadcrumb {
    private readonly layoutService = inject(LayoutService);
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

    sidebarCollapsed = computed(() => this.layoutService.isCompact());

    constructor(private router: Router) {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
            const root = this.router.routerState.snapshot.root;
            const breadcrumbs: Breadcrumb[] = [];
            this.addBreadcrumb(root, [], breadcrumbs);

            this._breadcrumbs$.next(breadcrumbs);
        });
    }

    private addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], breadcrumbs: Breadcrumb[]) {
        const routeUrl = parentUrl.concat(route.url.map((url) => url.path));
        const breadcrumb = route.data['breadcrumb'];
        const parentBreadcrumb = route.parent && route.parent.data ? route.parent.data['breadcrumb'] : null;

        if (breadcrumb && breadcrumb !== parentBreadcrumb) {
            breadcrumbs.push({
                label: route.data['breadcrumb'],
                url: '/' + routeUrl.join('/')
            });
        }

        if (route.firstChild) {
            this.addBreadcrumb(route.firstChild, routeUrl, breadcrumbs);
        }
    }

    toggleSidebar() {
        const currentMode = this.layoutService.layoutConfig().menuMode;
        this.layoutService.changeMenuMode(currentMode === 'compact' ? 'static' : 'compact');
    }
}
