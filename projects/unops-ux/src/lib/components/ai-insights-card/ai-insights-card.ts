import {
    ChangeDetectionStrategy,
    Component,
    computed,
    DestroyRef,
    inject,
    input,
    OnInit,
    output,
    signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';
import { AiCardBgComponent } from '../ai-card-bg/ai-card-bg';

export interface AiInsight {
    id: number;
    title: string;
    description: string;
    actionLabel: string;
    icon: string;
    iconColor: string;
}

@Component({
    selector: 'ux-ai-insights-card',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [AiCardBgComponent, FormsModule, NgClass, PaginatorModule],
    host: {
        class: 'ux-ai-insights-card block border border-blue-100 dark:border-midnight-400 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 flex flex-col',
        '[class.ux-ai-expanded]': 'expanded()'
    },
    styles: `
        :host { display: flex; }
    `,
    template: `
        <ux-ai-card-bg class="flex flex-col flex-1 p-4">
            <div class="motion-safe:animate-enter-liquid [animation-delay:80ms] flex flex-col flex-1">
                <div class="flex items-center justify-between cursor-pointer shrink-0 pr-2" (click)="expanded.set(!expanded())">
                    <div class="flex items-center gap-3">
                        <div class="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0">
                            <i class="pi pi-sparkles text-blue-800 dark:text-blue-300"></i>
                        </div>
                        <div class="flex flex-col">
                            <h4 class="title-h4 text-left text-deepsea-500 dark:text-surface-0">{{ title() }}</h4>
                            <span class="text-midnight-700 dark:text-surface-100 text-sm font-medium leading-tight">{{ insights().length }} insights available for your review</span>
                        </div>
                    </div>
                    <i class="pi text-sm text-darkblue-500 dark:text-surface-0" [ngClass]="expanded() ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                </div>

                <div class="expand-body" [class.expand-body--open]="expanded()">
                    <div class="expand-body__inner">
                        <div class="flex flex-col gap-4 mt-4">
                            <div class="bg-white/60 dark:bg-surface-800/60 border border-white dark:border-surface-700 rounded-[14px] shadow-sm flex items-center gap-4 px-4 py-2.5 shrink-0">
                                <i class="pi pi-search text-surface-500 dark:text-surface-300 text-sm"></i>
                                <input
                                    type="text"
                                    [ngModel]="searchQuery()"
                                    (ngModelChange)="searchQuery.set($event); page.set(0)"
                                    [placeholder]="searchPlaceholder()"
                                    class="bg-transparent border-none outline-none flex-1 text-sm font-medium text-deepsea-500 dark:text-surface-0 placeholder:text-surface-700 dark:placeholder:text-surface-300"
                                />
                            </div>

                            <div class="flex flex-col gap-3">
                                @for (insight of paginatedInsights(); track insight.id) {
                                    <div class="bg-white/70 dark:bg-surface-800/70 border border-white/50 dark:border-surface-700/50 rounded-[14px] shadow-sm p-4 flex gap-3 items-start shrink-0">
                                        <i class="pi mt-0.5" [ngClass]="[insight.icon, insight.iconColor]"></i>
                                        <div class="flex flex-col gap-2 flex-1 min-w-0">
                                            <div class="flex flex-col gap-1">
                                                <span class="text-midnight-500 dark:text-surface-0 text-sm font-bold leading-[21px]">{{ insight.title }}</span>
                                                <p class="text-[#2b638b] dark:text-surface-300 text-sm leading-normal">{{ insight.description }}</p>
                                            </div>
                                            <button
                                                class="flex items-center gap-1.5 text-darkblue-500 dark:text-primary-400 text-sm font-semibold cursor-pointer hover:underline bg-transparent border-none p-0 w-fit"
                                                (click)="actionClick.emit(insight)"
                                            >
                                                {{ insight.actionLabel }}
                                                <i class="pi pi-arrow-right text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                }
                            </div>

                            <div class="shrink-0 w-full border-t border-white/50 dark:border-surface-700/50 pt-2 mt-1 relative z-[1] bg-transparent">
                                <p-paginator
                                    [rows]="perPage()"
                                    [totalRecords]="filteredInsights().length"
                                    [first]="first()"
                                    (onPageChange)="page.set($event.page ?? 0)"
                                    [pageLinkSize]="3"
                                    styleClass="w-full border-none! bg-transparent!"
                                    [pt]="{ root: { class: 'bg-transparent! relative! w-full! justify-center!' } }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ux-ai-card-bg>
    `
})
export class AiInsightsCardComponent implements OnInit {
    title = input.required<string>();
    insights = input.required<AiInsight[]>();
    searchPlaceholder = input('Search AI insights...');

    actionClick = output<AiInsight>();

    expanded = signal(false);
    searchQuery = signal('');

    filteredInsights = computed(() => {
        const query = this.searchQuery().trim().toLowerCase();
        if (!query) return this.insights();
        return this.insights().filter(i =>
            i.title.toLowerCase().includes(query) ||
            i.description.toLowerCase().includes(query)
        );
    });

    perPage = signal(this.calcPerPage());
    page = signal(0);
    first = computed(() => this.page() * this.perPage());
    paginatedInsights = computed(() => {
        const all = this.filteredInsights();
        return all.slice(this.first(), this.first() + this.perPage());
    });

    private destroyRef = inject(DestroyRef);

    ngOnInit() {
        const onResize = () => this.perPage.set(this.calcPerPage());
        window.addEventListener('resize', onResize);
        this.destroyRef.onDestroy(() => window.removeEventListener('resize', onResize));
    }

    private calcPerPage(): number {
        const shellOffset = 12 * 16;
        const cardChrome = 160 + 72;
        const insightCardHeight = 150;
        const available = (typeof window !== 'undefined' ? window.innerHeight : 900) - shellOffset - cardChrome;
        return Math.max(1, Math.floor(available / insightCardHeight));
    }
}
