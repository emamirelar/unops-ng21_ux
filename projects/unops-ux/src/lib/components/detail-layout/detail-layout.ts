import { ChangeDetectionStrategy, Component, ContentChildren, Directive, input, model, QueryList, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsModule } from 'primeng/tabs';

export interface DetailTab {
    value: string;
    label: string;
    icon?: string;
}

/**
 * Structural directive that marks a template as content for a specific tab
 * inside `<ux-detail-layout>`.
 *
 * Usage: `<ng-template uxDetailTab="overview">...content...</ng-template>`
 */
@Directive({ selector: '[uxDetailTab]' })
export class DetailTabDirective {
    readonly uxDetailTab = input.required<string>();
    constructor(public templateRef: TemplateRef<unknown>) {}
}

/**
 * Reusable detail-page layout shell: sticky header, tabbed main column,
 * and a persistent right sidebar (typically for AI insights).
 *
 * All styling derives from the active PrimeNG brand preset (BrandSoft / BrandCrisp /
 * BrandContrast) via `--p-*` CSS variables and Tailwind `surface-*` / `primary-*`
 * utilities (resolved by `tailwindcss-primeui`). No hardcoded colors.
 *
 * ```html
 * <ux-detail-layout [tabs]="myTabs" [(activeTab)]="currentTab">
 *   <ng-container ux-detail-header>
 *     ...sticky header content...
 *   </ng-container>
 *
 *   <ng-template uxDetailTab="overview">...tab 1...</ng-template>
 *   <ng-template uxDetailTab="scope">...tab 2...</ng-template>
 *
 *   <ng-container ux-detail-sidebar>
 *     ...right sidebar (AI card, documents, etc.)...
 *   </ng-container>
 *
 *   <ng-container ux-detail-footer>
 *     ...audit metadata row...
 *   </ng-container>
 * </ux-detail-layout>
 * ```
 */
@Component({
    selector: 'ux-detail-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TabsModule],
    host: { class: 'ux-detail-layout block' },
    styles: `
        :host {
            display: block;
            min-height: calc(100vh - 4rem);
            font-family: var(--p-font-family, 'Noto Sans', sans-serif);
            background: transparent;
            color: var(--p-text-color);
        }

        .ux-dl__header {
            background: transparent;
            border-bottom: 1px solid var(--p-content-border-color);
        }

        .ux-dl__scroll {
            scrollbar-width: thin;
            scrollbar-color: color-mix(in srgb, var(--p-primary-color) 25%, transparent)
                color-mix(in srgb, var(--p-surface-500) 8%, transparent);
        }

        .ux-dl__scroll::-webkit-scrollbar { width: 10px; height: 10px; }
        .ux-dl__scroll::-webkit-scrollbar-track {
            background: color-mix(in srgb, var(--p-surface-500) 8%, transparent);
            border-radius: var(--p-content-border-radius, 0.375rem);
        }
        .ux-dl__scroll::-webkit-scrollbar-thumb {
            background: color-mix(in srgb, var(--p-primary-color) 25%, transparent);
            border-radius: var(--p-content-border-radius, 0.375rem);
        }
        .ux-dl__scroll::-webkit-scrollbar-thumb:hover {
            background: color-mix(in srgb, var(--p-primary-color) 45%, transparent);
        }

        .ux-dl__sidebar-inner,
        .ux-dl__sidebar-inner > * { display: flex; flex-direction: column; gap: 1.5rem; }

        .ux-dl__header-meta {
            overflow: hidden;
            max-height: 50px;
            opacity: 1;
            transition: max-height 0.25s ease-out, opacity 0.2s ease-out;
        }
        .ux-dl__header-meta--hidden {
            max-height: 0;
            opacity: 0;
        }

        :host :deep p-tablist {
            position: sticky;
            top: 0;
            z-index: 5;
            background: var(--p-content-background, var(--p-primary-400));
        }
        :host :deep p-tablist .p-tablist-content { width: 100%; }
        :host :deep p-tablist .p-tablist-tab-list { width: 100%; }
        :host :deep p-tab { flex: 1; justify-content: center; }
    `,
    template: `
        <div class="flex flex-col overflow-hidden" [style.height]="'calc(100vh - 64px)'">

            <!-- Sticky header (projected) -->
            <div class="ux-dl__header flex-shrink-0 z-10">
                <div>
                    <ng-content select="[ux-detail-header]" />
                </div>
                <div class="ux-dl__header-meta" [class.ux-dl__header-meta--hidden]="scrolled()">
                    <ng-content select="[ux-detail-header-meta]" />
                </div>
            </div>

            <!-- Scrollable body -->
            <div class="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-hidden ux-dl__scroll"
                 (scroll)="onScroll($event)">

                <!-- Full-width tab bar -->
                <p-tabs [value]="activeTab()" (valueChange)="activeTab.set($event + '')">
                    <p-tablist>
                        @for (tab of tabs(); track tab.value) {
                            <p-tab [value]="tab.value">
                                @if (tab.icon) {
                                    <i [class]="tab.icon" class="mr-2 text-sm"></i>
                                }
                                {{ tab.label }}
                            </p-tab>
                        }
                    </p-tablist>

                    <!-- Content + Sidebar row below tab bar -->
                    <div class="flex flex-col lg:flex-row items-start gap-6 w-full py-4 sm:py-6">

                        <!-- Main column: tab panels -->
                        <div class="flex-1 min-w-0 flex flex-col gap-6">
                            <p-tabpanels>
                                @for (tab of tabs(); track tab.value) {
                                    <p-tabpanel [value]="tab.value">
                                        <div class="flex flex-col gap-6">
                                            @if (getTabTemplate(tab.value); as tmpl) {
                                                <ng-container [ngTemplateOutlet]="tmpl" />
                                            }
                                        </div>
                                    </p-tabpanel>
                                }
                            </p-tabpanels>

                            <!-- Footer below tab content -->
                            <ng-content select="[ux-detail-footer]" />
                        </div>

                        <!-- Sidebar -->
                        <aside class="w-full lg:w-[380px] shrink-0 flex flex-col lg:sticky lg:top-4 lg:self-start pb-8">
                            <div class="ux-dl__sidebar-inner w-full">
                                <ng-content select="[ux-detail-sidebar]" />
                            </div>
                        </aside>
                    </div>
                </p-tabs>
            </div>
        </div>
    `
})
export class DetailLayoutComponent {
    /** Tab definitions for the main content area. */
    readonly tabs = input.required<DetailTab[]>();

    /** Currently active tab value (two-way bindable). */
    readonly activeTab = model<string>('');

    /** True once the scrollable body has been scrolled past the threshold. */
    readonly scrolled = signal(false);

    /** Tab content templates provided by the consumer. */
    @ContentChildren(DetailTabDirective) tabTemplates!: QueryList<DetailTabDirective>;

    getTabTemplate(value: string): TemplateRef<unknown> | null {
        const match = this.tabTemplates?.find(t => t.uxDetailTab() === value);
        return match?.templateRef ?? null;
    }

    onScroll(event: Event) {
        const el = event.target as HTMLElement;
        this.scrolled.set(el.scrollTop > 10);
    }
}
