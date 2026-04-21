import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule } from '@angular/router';

import { BehaviorSubject, filter } from 'rxjs';

interface Breadcrumb {
    label: string;
    url?: string;
}

@Component({
    selector: '[app-breadcrumb]',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `<nav class="layout-breadcrumb">
        <button type="button" class="breadcrumb-back" (click)="goBack()">
            <i class="pi pi-chevron-left"></i>
        </button>
        <span class="breadcrumb-divider"></span>
        <ol>
            <ng-template ngFor let-item let-last="last" [ngForOf]="breadcrumbs$ | async">
                <li class="text-sm font-medium text-deepsea-500">{{ item.label }}</li>
                <li *ngIf="!last" class="text-sm font-medium text-deepsea-500">/</li>
            </ng-template>
        </ol>
    </nav> `
})
export class AppBreadcrumb {
    private readonly location = inject(Location);
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

    goBack() {
        this.location.back();
    }
}
