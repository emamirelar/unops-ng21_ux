import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FooterService } from '../../layout/footer.service';

@Component({
    selector: 'ux-footer-main',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgTemplateOutlet],
    host: { class: 'ux-footer-main' },
    styles: `
        :host {
            flex-shrink: 0;
            display: flex;
            align-items: center;
            height: 3rem;
            padding: 1rem;
            background: var(--p-primary-50);
            font-size: var(--font-size-xs, 0.75rem);
            line-height: 1.2;
            color: var(--p-text-color);
        }

        @media screen and (min-width: 992px) {
            :host {
                padding: 1rem 2rem;
            }
        }

        :host-context(:root[class*='app-dark']) {
            background: var(--p-primary-950);
            color: var(--p-surface-100);
        }

        :host(.footer-sticky) {
            position: sticky;
            bottom: 0;
            z-index: 10;
        }
    `,
    template: `
        @if (copyrightOnly()) {
            <span>&#169; UNOPS {{ copyrightYear }}</span>
        } @else if (footerService.content(); as tpl) {
            <ng-container [ngTemplateOutlet]="tpl" />
        }
    `
})
export class FooterMainComponent {
    /** When true, always shows the default copyright — ignores FooterService content. */
    copyrightOnly = input(false);

    protected readonly footerService = inject(FooterService);
    protected readonly copyrightYear = new Date().getFullYear();
}
