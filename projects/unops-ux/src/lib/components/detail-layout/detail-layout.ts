import { afterNextRender, ChangeDetectionStrategy, Component, computed, ContentChildren, DestroyRef, Directive, ElementRef, inject, input, model, PLATFORM_ID, QueryList, signal, TemplateRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
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
 *     <!-- Use ng-container so children become direct children of the
 *          library's flex container and inherit the gap spacing. -->
 *     ...right sidebar (AI card, documents, etc.)...
 *   </ng-container>
 *
 * </ux-detail-layout>
 * ```
 */
@Component({
    selector: 'ux-detail-layout',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, SelectModule, TabsModule],
    host: { class: 'ux-detail-layout' },
    styles: `
        :host {
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
            font-family: var(--p-font-family, 'Noto Sans', sans-serif);
            background: transparent;
            color: var(--p-text-color);
        }

        .ux-dl__header {
            background: transparent;
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

        .ux-dl__sidebar-inner { display: flex; flex-direction: column; gap: 1.5rem; }

        .ux-dl__header-meta {
            overflow: hidden;
            max-height: 80px;
            opacity: 1;
            transition: max-height 0.25s ease-out, opacity 0.2s ease-out;
        }
        .ux-dl__header-meta--hidden {
            max-height: 0;
            opacity: 0;
        }

        :host :deep p-tablist {
            position: fixed;
            top: 0;
            z-index: 1000;
            background: var(--p-content-background, var(--p-primary-400));
            padding-inline: 0.75rem;
        }
        @media screen and (min-width: 640px) {
            :host :deep p-tablist {
                padding-inline: 1rem;
            }
        }
        @media screen and (min-width: 1024px) {
            :host :deep p-tablist {
                padding-inline: 1.5rem;
            }
        }
        :host :deep p-tablist .p-tablist-content { width: 100%; }
        :host :deep p-tablist .p-tablist-tab-list { width: 100%; padding: 0 0 0 2rem; position: fixed; }
        :host :deep p-tab { flex: 1; justify-content: center; }

        .ux-dl__mobile-tabs {
            position: sticky;
            top: 0;
            z-index: 5;
        }

    `,
    template: `
        <div class="flex flex-col flex-1 min-h-0">

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

                    @if (!singleTab()) {
                        <!-- Mobile: dropdown selector -->
                        @if (isMobile()) {
                            <div class="ux-dl__mobile-tabs">
                                <p-select
                                    [options]="tabOptions()"
                                    [ngModel]="activeTab()"
                                    (ngModelChange)="activeTab.set($event)"
                                    optionLabel="label"
                                    optionValue="value"
                                    styleClass="w-full ux-dl__mobile-select"
                                />
                            </div>
                        }

                        <!-- Desktop: horizontal tab bar -->
                        <p-tablist [style.display]="isMobile() ? 'none' : null">
                            @for (tab of tabs(); track tab.value) {
                                <p-tab [value]="tab.value">
                                    @if (tab.icon) {
                                        <i [class]="tab.icon" class="mr-2 text-sm"></i>
                                    }
                                    {{ tab.label }}
                                </p-tab>
                            }
                        </p-tablist>
                    }

                    <!-- Content + Sidebar row below tab bar -->
                    <div class="flex flex-col lg:flex-row items-start gap-6 w-full py-4 lg:py-6">

                        <!-- Main column: tab panels -->
                        <div class="w-full flex-1 min-w-0 flex flex-col gap-6">
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
                        </div>

                        <!-- Sidebar -->
                        <aside class="w-full lg:w-[380px] shrink-0 flex flex-col lg:sticky lg:top-4 lg:self-start lg:pb-8">
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

    /** Options for the mobile tab dropdown. */
    readonly tabOptions = computed(() => this.tabs().map(t => ({ label: t.label, value: t.value })));

    /** True when there is only a single tab, making the tab bar redundant. */
    readonly singleTab = computed(() => this.tabs().length <= 1);

    /** True when viewport is below the lg breakpoint (1024px). */
    readonly isMobile = signal(false);

    /** True once the scrollable body has been scrolled past the threshold. */
    readonly scrolled = signal(false);

    private elRef = inject(ElementRef);

    constructor() {
        if (isPlatformBrowser(inject(PLATFORM_ID))) {
            const mql = window.matchMedia('(max-width: 1023px)');
            this.isMobile.set(mql.matches);
            const handler = (e: MediaQueryListEvent) => this.isMobile.set(e.matches);
            mql.addEventListener('change', handler);
            inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', handler));
        }

        // #region agent log
        afterNextRender(() => {
            const host = this.elRef.nativeElement as HTMLElement;
            const layoutContent = host.closest('.layout-content');
            const layoutContentWrapper = host.closest('.layout-content-wrapper');
            const wrapperInside = host.closest('.layout-content-wrapper-inside');
            const footerWrapper = host.querySelector('[class*="z-100"]') || host.lastElementChild?.lastElementChild;
            const sidebar = host.querySelector('aside');
            const scrollArea = host.querySelector('.ux-dl__scroll');
            const appFooterEl = layoutContentWrapper?.querySelector('[app-footer]');
            const cs = (el: Element | null | undefined) => el ? getComputedStyle(el) : null;
            const data = {
                layoutContent: layoutContent ? { paddingBottom: cs(layoutContent)!.paddingBottom, paddingTop: cs(layoutContent)!.paddingTop, height: layoutContent.getBoundingClientRect().height, bottom: layoutContent.getBoundingClientRect().bottom } : null,
                wrapperInside: wrapperInside ? { paddingBottom: cs(wrapperInside)!.paddingBottom, height: wrapperInside.getBoundingClientRect().height, bottom: wrapperInside.getBoundingClientRect().bottom } : null,
                host: { paddingBottom: cs(host)!.paddingBottom, height: host.getBoundingClientRect().height, bottom: host.getBoundingClientRect().bottom },
                footerWrapper: footerWrapper ? { paddingBottom: cs(footerWrapper)!.paddingBottom, marginBottom: cs(footerWrapper)!.marginBottom, height: footerWrapper.getBoundingClientRect().height, bottom: footerWrapper.getBoundingClientRect().bottom, classes: footerWrapper.className } : null,
                sidebar: sidebar ? { paddingBottom: cs(sidebar)!.paddingBottom, height: sidebar.getBoundingClientRect().height } : null,
                scrollArea: scrollArea ? { paddingBottom: cs(scrollArea)!.paddingBottom, height: scrollArea.getBoundingClientRect().height, bottom: scrollArea.getBoundingClientRect().bottom } : null,
                appFooter: appFooterEl ? { height: appFooterEl.getBoundingClientRect().height, display: cs(appFooterEl)!.display } : 'not found',
                viewportHeight: window.innerHeight,
            };
            console.log('[DEBUG-694fea] Footer layout computed styles', JSON.stringify(data, null, 2));
            fetch('http://127.0.0.1:7278/ingest/09818c15-01b3-40a5-8a07-65bd2be63fb7',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'694fea'},body:JSON.stringify({sessionId:'694fea',location:'detail-layout.ts:afterNextRender',message:'Footer layout computed styles',data,timestamp:Date.now(),hypothesisId:'H1-H2-H3-H4'})}).catch(()=>{});
        });
        // #endregion
    }

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
