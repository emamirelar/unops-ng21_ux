import { ChangeDetectionStrategy, Component } from '@angular/core';

let aiCardBgFilterId = 0;

/**
 * Animated brand-tinted background for AI insight cards: shifting host background
 * plus soft blurred SVG blobs with staggered fill animation.
 *
 * Project card content with `<ng-content />` so it stacks above the SVG layer.
 */
@Component({
    selector: 'ux-ai-card-bg',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'ux-ai-card-bg block box-border',
        '[attr.data-ai-bg]': 'true'
    },
    styles: `
        :host {
            --ux-ai-bg-from: #cce5ff;
            --ux-ai-bg-to:rgb(255, 236, 254);
            --ux-ai-fg-from:rgb(188, 214, 255);
            --ux-ai-fg-to:rgb(246, 216, 255);
            position: relative;
            overflow: hidden;
            isolation: isolate;
            contain: paint;
            animation: ux-ai-bg-move 5s ease-in-out infinite;
            will-change: background-color;
        }

        :host-context([class*='app-dark']) {
            --ux-ai-bg-from:rgb(0, 32, 69);
            --ux-ai-bg-to:rgb(47, 18, 116);
            --ux-ai-fg-from:rgb(0, 20, 47);
            --ux-ai-fg-to:rgb(76, 1, 71);
        }

        :host > :not(svg) {
            position: relative;
            z-index: 1;
        }

        :host svg.ux-ai-card-bg__svg {
            position: absolute;
            inset: 0;
            z-index: 0;
            height: 100%;
            width: 100%;
            max-height: 100%;
            overflow: hidden;
            pointer-events: none;
        }

        .ux-ai-fg {
            will-change: fill;
            animation: ux-ai-fg-move 6s ease-in-out infinite;
        }

        .ux-ai-fg--1 {
            animation-delay: 0s;
        }

        .ux-ai-fg--2 {
            animation-delay: 2s;
        }

        .ux-ai-fg--3 {
            animation-delay: 4s;
        }

        @keyframes ux-ai-bg-move {
            0%,
            100% {
                background-color: var(--ux-ai-bg-from);
            }
            50% {
                background-color: var(--ux-ai-bg-to);
            }
        }

        @keyframes ux-ai-fg-move {
            0%,
            100% {
                fill: var(--ux-ai-fg-from);
            }
            50% {
                fill: var(--ux-ai-fg-to);
            }
        }

        @media (prefers-reduced-motion: reduce) {
            :host {
                animation: none;
                background-color: var(--ux-ai-bg-from);
            }

            .ux-ai-fg {
                animation: none;
                fill: var(--ux-ai-fg-from);
            }
        }
    `,
    template: `
        <svg
            class="ux-ai-card-bg__svg"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <filter [attr.id]="blurFilterId" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="30" />
                </filter>
            </defs>
            <ellipse
                class="ux-ai-fg ux-ai-fg--1"
                cx="60"
                cy="50"
                rx="120"
                ry="100"
                opacity="0.35"
                [attr.filter]="blurFilterUrl"
            />
            <ellipse
                class="ux-ai-fg ux-ai-fg--2"
                cx="320"
                cy="80"
                rx="100"
                ry="80"
                opacity="0.3"
                [attr.filter]="blurFilterUrl"
            />
            <ellipse
                class="ux-ai-fg ux-ai-fg--3"
                cx="200"
                cy="240"
                rx="140"
                ry="90"
                opacity="0.25"
                [attr.filter]="blurFilterUrl"
            />
        </svg>
        <ng-content />
    `
})
export class AiCardBgComponent {
    readonly blurFilterId = `uxAiBlur_${++aiCardBgFilterId}`;

    get blurFilterUrl(): string {
        return `url(#${this.blurFilterId})`;
    }
}
