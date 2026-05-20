import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

export interface CompletionStep {
    type: 'mandatory' | 'optional';
    filled: boolean;
    name: string;
}

export interface CompletionCategory {
    filled: number;
    total: number;
}

@Component({
    selector: 'ux-completion-steps',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [TooltipModule],
    host: { class: 'block' },
    template: `
        <div class="card flex flex-col gap-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="flex flex-col">
                        <span class="text-xs font-semibold text-surface-600 dark:text-surface-300 uppercase tracking-wide">{{ title() }}</span>
                    </div>
                </div>
                <span class="text-2xl font-bold" [class]="filledTotal() > 0 ? 'text-surface-900 dark:text-surface-0' : 'text-surface-500 dark:text-surface-400'">{{ filledTotal() }}/{{ totalRecords() }}</span>
            </div>

            <div class="flex items-center gap-1 flex-wrap">
                @for (step of steps(); track $index) {
                    <span class="inline-flex items-center justify-center w-6 h-6 rounded-full"
                          [class.cursor-pointer]="interactive()"
                          [class]="getDotStyle(step).bg"
                          [pTooltip]="step.name + (step.filled ? '' : ' (missing)')" tooltipPosition="top"
                          (click)="interactive() && stepClick.emit($index)">
                        @if (getDotStyle(step).icon === 'pi') {
                            <i class="pi text-[3px]" [class]="getDotStyle(step).iconClass + ' ' + getDotStyle(step).text"></i>
                        } @else if (getDotStyle(step).icon === 'material') {
                            <span class="material-symbols-outlined leading-none" style="font-size:20px;transform:scale(0.9)" [class]="getDotStyle(step).text">{{ getDotStyle(step).iconClass }}</span>
                        } @else {
                            <span class="text-sm font-black leading-none" [class]="getDotStyle(step).text">!</span>
                        }
                    </span>
                }
            </div>

            <div class="flex flex-wrap items-center gap-x-6 gap-y-2 mt-1">
                <div class="flex items-center gap-2">
                    <span class="inline-block w-4 h-4 rounded-full shrink-0" [class]="legendMandatoryBg()"></span>
                    <span class="text-sm text-surface-600 dark:text-surface-300">Mandatory:</span>
                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ mandatory().filled }}/{{ mandatory().total }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="inline-block w-4 h-4 rounded-full shrink-0" [class]="legendOptionalBg()"></span>
                    <span class="text-sm text-surface-600 dark:text-surface-300">Optional:</span>
                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ optional().filled }}/{{ optional().total }}</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-sm text-surface-600 dark:text-surface-300">Total:</span>
                    <span class="text-sm font-semibold text-surface-900 dark:text-surface-0">{{ totalRecords() }}</span>
                </div>
            </div>

            @if (empty()) {
                <div class="empty-state">
                    <i class="pi pi-chart-bar text-3xl text-surface-500 dark:text-surface-400"></i>
                    <span class="empty-state-title">{{ emptyTitle() }}</span>
                    <span class="empty-state-desc">{{ emptyDescription() }}</span>
                </div>
            }
        </div>
    `
})
export class CompletionStepsComponent {
    title = input('Completion Steps');
    steps = input<CompletionStep[]>([]);
    mandatory = input<CompletionCategory>({ filled: 0, total: 0 });
    optional = input<CompletionCategory>({ filled: 0, total: 0 });
    totalRecords = input(0);
    interactive = input(false);
    emptyTitle = input('No progress tracked yet');
    emptyDescription = input('Progress is calculated automatically as you fill in the opportunity sections. Each dot represents a required or optional field — mandatory fields (bordered red) must be completed before submission.');

    stepClick = output<number>();

    private readonly dotStyles = {
        mandatoryFilled:  { bg: 'bg-green-200 dark:bg-green-700', text: 'text-green-800 dark:text-green-50', icon: 'pi', iconClass: 'pi-check' },
        optionalFilled:   { bg: 'bg-blue-200 dark:bg-blue-700',  text: 'text-blue-800 dark:text-blue-50', icon: 'material', iconClass: 'info_i' },
        mandatoryMissing: { bg: 'bg-transparent border-2 border-red-400 dark:border-red-500', text: 'text-red-500 dark:text-red-400', icon: 'pi', iconClass: 'pi-plus' },
        optionalMissing:  { bg: 'bg-transparent border-2 border-surface-300 dark:border-surface-600', text: 'text-surface-500 dark:text-surface-400', icon: 'material', iconClass: 'info_i' }
    };

    filledTotal = computed(() => this.mandatory().filled + this.optional().filled);
    empty = computed(() => this.filledTotal() === 0);

    legendMandatoryBg = computed(() =>
        this.mandatory().filled > 0 ? this.dotStyles.mandatoryFilled.bg : this.dotStyles.mandatoryMissing.bg
    );

    legendOptionalBg = computed(() =>
        this.optional().filled > 0 ? this.dotStyles.optionalFilled.bg : this.dotStyles.optionalMissing.bg
    );

    getDotStyle(step: CompletionStep) {
        if (step.filled) return step.type === 'mandatory' ? this.dotStyles.mandatoryFilled : this.dotStyles.optionalFilled;
        return step.type === 'mandatory' ? this.dotStyles.mandatoryMissing : this.dotStyles.optionalMissing;
    }
}
