import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ux-detail-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'ux-detail-footer' },
    styles: `
        :host {
            display: block;
            position: fixed;
            bottom: 0;
            left: -2rem;
            right: -2rem;
            z-index: 100;
            background: var(--p-primary-50);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            padding: 0.75rem 3rem;
            font-size: var(--font-size-xs, 0.75rem);
            line-height: 1.5;
            color: var(--p-text-color);
            height: 2.5rem;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
        }

        :host-context(:root[class*='app-dark']) {
            background: var(--p-primary-950);
            color: var(--p-surface-100);
        }
    `,
    template: `<ng-content />`
})
export class DetailFooterComponent {}
