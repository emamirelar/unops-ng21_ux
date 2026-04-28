import { Component } from '@angular/core';
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
        <ol>
            @for (item of breadcrumbs$ | async; track item.url; let last = $last) {
                <li class="text-sm font-medium text-surface-700 dark:text-surface-100">
                    @if (!last && item.url) {
                        <a [routerLink]="item.url" class="text-surface-700 dark:text-surface-100 hover:text-surface-950 dark:hover:text-surface-0 no-underline hover:underline cursor-pointer">{{ item.label }}</a>
                    } @else {
                        {{ item.label }}
                    }
                </li>
                @if (!last) {
                    <li class="text-sm font-medium text-surface-400 dark:text-surface-400">/</li>
                }
            }
        </ol>
    </nav> `
})
export class AppBreadcrumb {
    private readonly _breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

    readonly breadcrumbs$ = this._breadcrumbs$.asObservable();

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
}
