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
            background: var(--p-primary-50);
            font-size: var(--font-size-xs, 0.75rem);
            line-height: 1.2;
            color: var(--p-text-color);
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

        .footer-inner {
            width: 100%;
            max-width: 1540px;
            margin-inline: auto;
            padding: 1rem;
        }

        @media screen and (min-width: 780px) {
            .footer-inner {
                padding: 1rem 3rem;
            }
        }
    `,
    template: `
        <div class="footer-inner">
            @if (copyrightOnly()) {
                <span>&#169; UNOPS {{ copyrightYear }}</span>
            } @else if (footerService.content(); as tpl) {
                <ng-container [ngTemplateOutlet]="tpl" />
            }
        </div>
    `
})
export class FooterMainComponent {
    /** When true, always shows the default copyright — ignores FooterService content. */
    copyrightOnly = input(false);

    protected readonly footerService = inject(FooterService);
    protected readonly copyrightYear = new Date().getFullYear();
}
