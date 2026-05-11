import { ChangeDetectionStrategy, Component, computed, input, model, output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'ux-select',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    imports: [FormsModule, SelectModule],
    host: { class: 'ux-select' },
    styles: `
        .ux-select .p-select {
            border-radius: var(--p-content-border-radius, 0.375rem);
            font-family: var(--p-font-family, 'Noto Sans', sans-serif);
            font-size: var(--font-size-sm, 0.875rem);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
            padding: 0.5rem 1.5rem;
        }

        .ux-select .p-select:not(.p-disabled):hover {
            border-color: var(--p-primary-400);
        }

        .ux-select .p-select:not(.p-disabled).p-focus {
            border-color: var(--p-primary-500);
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--p-primary-500) 20%, transparent);
        }

        .ux-select .p-select-label {
            font-size: var(--font-size-sm, 0.875rem);
            color: var(--p-text-color);
        }

        .ux-select .p-select-label.p-placeholder {
            color: var(--p-text-muted-color);
        }

        .ux-select .p-select-dropdown {
            color: var(--p-text-muted-color);
        }

        :root[class*='app-dark'] .ux-select .p-select:not(.p-disabled):hover {
            border-color: var(--p-primary-300);
        }

        :root[class*='app-dark'] .ux-select .p-select:not(.p-disabled).p-focus {
            border-color: var(--p-primary-400);
            box-shadow: 0 0 0 2px color-mix(in srgb, var(--p-primary-400) 25%, transparent);
        }
    `,
    template: `
        <p-select
            [options]="options()"
            [optionLabel]="optionLabel()"
            [optionValue]="optionValue()"
            [optionGroupLabel]="optionGroupLabel()"
            [optionGroupChildren]="optionGroupChildren()"
            [placeholder]="placeholder()"
            [disabled]="disabled()"
            [filter]="filter()"
            [showClear]="showClear()"
            [emptyMessage]="emptyMessage()"
            [group]="group()"
            [ngModel]="value()"
            (ngModelChange)="value.set($event)"
            (onChange)="onChange.emit($event)"
            (onFilter)="onFilter.emit($event)"
            [styleClass]="resolvedStyleClass()"
        />
    `
})
export class UxSelectComponent {
    readonly options = input<any[]>([]);
    readonly optionLabel = input<string>('label');
    readonly optionValue = input<string>('value');
    readonly optionGroupLabel = input<string>('label');
    readonly optionGroupChildren = input<string>('items');
    readonly placeholder = input<string>('');
    readonly disabled = input<boolean>(false);
    readonly filter = input<boolean>(false);
    readonly showClear = input<boolean>(false);
    readonly emptyMessage = input<string>('No results found');
    readonly group = input<boolean>(false);
    readonly styleClass = input<string>('');

    readonly value = model<any>(null);

    readonly onChange = output<any>();
    readonly onFilter = output<any>();

    readonly resolvedStyleClass = computed(() => {
        const base = 'ux-select__inner';
        const extra = this.styleClass();
        return extra ? `${base} ${extra}` : base;
    });
}
