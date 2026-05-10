import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface PillTabItem {
    value: string;
    label: string;
}

/**
 * Horizontal row of pill-shaped sub-tab buttons. Styling aligns with sidebar menu item
 * hover/active tokens (`--d-menuitem-*`).
 */
@Component({
    selector: 'ux-pill-tabs',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { class: 'ux-pill-tabs block' },
    styles: `
        .ux-pill-tabs__row {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .ux-pill-tabs__btn {
            border-radius: 9999px;
            padding: 0.375rem 0.875rem;
            font-size: var(--p-font-size, 0.875rem);
            font-weight: 600;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.15s ease;
            border: 1px solid var(--p-primary-800);
            background: transparent;
            color: var(--p-text-muted-color);
        }

        :host-context(.app-dark) .ux-pill-tabs__btn:not(.ux-pill-tabs__btn--active) {
            border-color: var(--p-surface-700);
        }

        .ux-pill-tabs__btn:hover:not(.ux-pill-tabs__btn--active) {
            background: var(--d-menuitem-hover-bg);
            color: var(--p-primary-950);
        }

        :host-context(.app-dark) .ux-pill-tabs__btn:hover:not(.ux-pill-tabs__btn--active) {
            color: var(--p-primary-200);
        }

        .ux-pill-tabs__btn--active {
            background: var(--p-primary-200);
            border-color: transparent;
            color: var(--p-primary-950);
        }

        :host-context(.app-dark) .ux-pill-tabs__btn--active {
            color: var(--p-primary-950);
        }

        .ux-pill-tabs__btn:focus {
            outline: none;
            box-shadow: none;
        }

        .ux-pill-tabs__btn:focus-visible {
            outline: none;
            box-shadow: var(--d-menuitem-focus-shadow);
        }
    `,
    template: `
        <div class="ux-pill-tabs__row" role="tablist">
            @for (item of items(); track item.value) {
                <button
                    type="button"
                    class="ux-pill-tabs__btn"
                    role="tab"
                    [attr.aria-selected]="activeValue() === item.value"
                    [class.ux-pill-tabs__btn--active]="activeValue() === item.value"
                    (click)="activeValue.set(item.value)"
                >
                    {{ item.label }}
                </button>
            }
        </div>
    `
})
export class PillTabsComponent {
    readonly items = input.required<PillTabItem[]>();
    readonly activeValue = model<string>('');
}
