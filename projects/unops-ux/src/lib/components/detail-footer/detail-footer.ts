import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'ux-detail-footer',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'ux-detail-footer' },
    styles: `
        :host {
            display: block;
            background: color-mix(in srgb, var(--p-primary-50) 20%, transparent);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            padding: 0.75rem 1.5rem;
            font-size: var(--font-size-xs, 0.75rem);
            color: var(--p-text-color);
        }

        @media screen and (min-width: 1024px) {
            :host {
                padding: 0.75rem 1rem;
            }
        }

        :host-context(:root[class*='app-dark']) {
            background: color-mix(in srgb, var(--p-primary-900) 50%, transparent);
            color: var(--p-surface-100);
        }
    `,
    template: `<ng-content />`
})
export class DetailFooterComponent {}
