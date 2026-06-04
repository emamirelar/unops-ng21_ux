import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    AiCardBgComponent,
    AiInsightsCardComponent,
    AiInsight,
    CompletionStepsComponent,
    CompletionStep,
    DocumentsCardComponent,
    DocumentItem,
    FooterMainComponent,
    PillTabsComponent,
    PillTabItem,
    UxSelectComponent,
    TaskDrawerComponent
} from '@unopsitg/ux';
import { ButtonModule } from 'primeng/button';
import { TabsModule } from 'primeng/tabs';
import { TagModule } from 'primeng/tag';

interface ShowcaseSection {
    id: string;
    title: string;
    description: string;
}

@Component({
    selector: 'app-showcase',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ButtonModule,
        TabsModule,
        TagModule,
        AiCardBgComponent,
        AiInsightsCardComponent,
        CompletionStepsComponent,
        DocumentsCardComponent,
        FooterMainComponent,
        PillTabsComponent,
        UxSelectComponent,
        TaskDrawerComponent
    ],
    template: `
        <div class="flex flex-col gap-8 animate-fade-in">

            <!-- Page header -->
            <div class="card">
                <div class="flex flex-col gap-2">
                    <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 m-0">Component Showcase</h1>
                    <p class="text-lg text-surface-600 dark:text-surface-300 m-0">
                        Visual catalog of all components available in <code class="bg-highlight px-2 py-0.5 rounded-border text-sm">&#64;unopsitg/ux</code>.
                        Each section shows a live demo and the code needed to render it.
                    </p>
                </div>
                <div class="flex flex-wrap gap-2 mt-4">
                    @for (section of sections; track section.id) {
                        <a class="text-sm font-semibold text-primary-600 dark:text-primary-300 hover:underline cursor-pointer"
                           (click)="scrollTo(section.id)">{{ section.title }}</a>
                    }
                </div>
            </div>

            <!-- 1. AiCardBgComponent -->
            <section [id]="sections[0].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Visual" severity="info" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[0].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[0].description }}</p>

                <div class="rounded-2xl overflow-hidden">
                    <ux-ai-card-bg class="p-8 rounded-2xl">
                        <p class="text-deepsea-500 dark:text-surface-0 font-medium text-center m-0">
                            Content projected inside the animated AI background
                        </p>
                    </ux-ai-card-bg>
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeAiCardBg)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeAiCardBg}}</code></pre>
                </div>
            </section>

            <!-- 2. AiInsightsCardComponent -->
            <section [id]="sections[1].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Card" severity="success" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[1].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[1].description }}</p>

                <div class="max-w-md">
                    <ux-ai-insights-card
                        [title]="'AI Insights'"
                        [insights]="demoInsights"
                        [searchPlaceholder]="'Search insights...'"
                        (actionClick)="onInsightAction($event)"
                    />
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeAiInsights)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeAiInsights}}</code></pre>
                </div>
            </section>

            <!-- 3. CompletionStepsComponent -->
            <section [id]="sections[2].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Progress" severity="warn" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[2].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[2].description }}</p>

                <div class="max-w-lg">
                    <ux-completion-steps
                        [title]="'Opportunity Completion'"
                        [steps]="demoSteps"
                        [mandatory]="{ filled: 5, total: 8 }"
                        [optional]="{ filled: 2, total: 4 }"
                        [totalRecords]="12"
                        [interactive]="true"
                    />
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeCompletionSteps)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeCompletionSteps}}</code></pre>
                </div>
            </section>

            <!-- 4. PillTabsComponent -->
            <section [id]="sections[3].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Navigation" severity="contrast" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[3].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[3].description }}</p>

                <div>
                    <ux-pill-tabs [items]="demoPillTabs" [(activeValue)]="activePillTab" />
                    <p class="mt-3 text-sm text-surface-600 dark:text-surface-300">
                        Active tab: <strong>{{ activePillTab() }}</strong>
                    </p>
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codePillTabs)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codePillTabs}}</code></pre>
                </div>
            </section>

            <!-- 5. UxSelectComponent -->
            <section [id]="sections[4].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Form" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[4].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[4].description }}</p>

                <div class="max-w-xs">
                    <ux-select
                        [options]="demoSelectOptions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Choose a country..."
                        [(value)]="selectedCountry"
                        [filter]="true"
                        [showClear]="true"
                    />
                    <p class="mt-3 text-sm text-surface-600 dark:text-surface-300">
                        Selected: <strong>{{ selectedCountry() ?? 'None' }}</strong>
                    </p>
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeSelect)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeSelect}}</code></pre>
                </div>
            </section>

            <!-- 6. DocumentsCardComponent -->
            <section [id]="sections[5].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Card" severity="success" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[5].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[5].description }}</p>

                <div class="max-w-2xl">
                    <ux-documents-card [documents]="demoDocuments" [rows]="3" />
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeDocuments)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeDocuments}}</code></pre>
                </div>
            </section>

            <!-- 7. TaskDrawerComponent -->
            <section [id]="sections[6].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Drawer" severity="danger" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[6].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[6].description }}</p>

                <div>
                    <button pButton label="Open Task Drawer" icon="pi pi-plus" (click)="taskDrawerVisible.set(true)"></button>
                    <ux-task-drawer
                        [(visible)]="taskDrawerVisible"
                        [mode]="'create'"
                        (save)="onTaskSave($event)"
                    />
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeTaskDrawer)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeTaskDrawer}}</code></pre>
                </div>
            </section>

            <!-- 8. DetailLayoutComponent -->
            <section [id]="sections[7].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Layout" severity="secondary" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[7].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[7].description }}</p>

                <div class="border border-surface-200 dark:border-surface-700 rounded-2xl overflow-hidden">
                    <!-- Static mockup (live ux-detail-layout captures page scroll via :has() CSS) -->
                    <div class="flex flex-col">
                        <div class="flex items-center gap-4 px-4 py-3 border-b border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900">
                            <i class="pi pi-briefcase text-2xl text-primary-500"></i>
                            <div class="flex flex-col">
                                <span class="text-lg font-bold text-surface-900 dark:text-surface-0">Sample Project</span>
                                <span class="text-sm text-surface-500 dark:text-surface-400">ID: OPP-2024-001</span>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 px-4 pt-3 border-b border-surface-200 dark:border-surface-700">
                            <span class="px-4 py-2 text-sm font-semibold text-primary-600 dark:text-primary-300 border-b-2 border-primary-500">Overview</span>
                            <span class="px-4 py-2 text-sm font-medium text-surface-500 dark:text-surface-400">Details</span>
                            <span class="px-4 py-2 text-sm font-medium text-surface-500 dark:text-surface-400">History</span>
                        </div>
                        <div class="flex gap-6 p-4">
                            <div class="flex-1">
                                <div class="card">
                                    <h3 class="text-lg font-semibold text-surface-900 dark:text-surface-0 m-0 mb-3">Overview Tab Content</h3>
                                    <p class="text-surface-600 dark:text-surface-300 m-0">The layout handles sticky headers, responsive tabs (dropdown on mobile), and a persistent right sidebar automatically.</p>
                                </div>
                            </div>
                            <div class="w-[280px] shrink-0">
                                <div class="card">
                                    <h4 class="text-sm font-semibold text-surface-900 dark:text-surface-0 m-0 mb-2">Sidebar</h4>
                                    <p class="text-sm text-surface-600 dark:text-surface-300 m-0">AI insights, documents, or contextual cards go here.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 pb-3">
                        <p class="text-xs text-surface-500 dark:text-surface-400 m-0 italic">
                            <i class="pi pi-info-circle mr-1"></i>
                            Static preview — the live component takes over page scroll. See <a href="/apps/opportunities/1" class="text-primary-500 hover:underline">/apps/opportunities/:id</a> for a full working example.
                        </p>
                    </div>
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeDetailLayout)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeDetailLayout}}</code></pre>
                </div>
            </section>

            <!-- 9. FooterMainComponent -->
            <section [id]="sections[8].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Layout" severity="secondary" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[8].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[8].description }}</p>

                <div class="border border-surface-200 dark:border-surface-700 rounded-2xl overflow-hidden">
                    <ux-footer-main [copyrightOnly]="true" />
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeFooter)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeFooter}}</code></pre>
                </div>
            </section>

            <!-- 10. Injection Tokens -->
            <section [id]="sections[9].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="DI" severity="warn" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[9].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[9].description }}</p>

                <div class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <h3 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">MENU_MODEL</h3>
                        <p class="text-sm text-surface-600 dark:text-surface-300 m-0">Provides the sidebar menu tree as <code class="bg-highlight px-1.5 py-0.5 rounded-border text-xs">MenuItem[]</code>.</p>
                        <pre class="app-code"><code>{{codeMenuModel}}</code></pre>
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">SIDEBAR_LOGO</h3>
                        <p class="text-sm text-surface-600 dark:text-surface-300 m-0">Customizes the sidebar logo for expanded and compact states.</p>
                        <pre class="app-code"><code>{{codeSidebarLogo}}</code></pre>
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">TOPBAR_PROFILE_MENU_CONFIG</h3>
                        <p class="text-sm text-surface-600 dark:text-surface-300 m-0">Configures the profile dropdown menu items.</p>
                        <pre class="app-code"><code>{{codeProfileMenu}}</code></pre>
                    </div>

                    <div class="flex flex-col gap-2">
                        <h3 class="text-base font-semibold text-surface-900 dark:text-surface-0 m-0">TOPBAR_NOTIFICATION_CONFIG</h3>
                        <p class="text-sm text-surface-600 dark:text-surface-300 m-0">Signal-based notification panel configuration.</p>
                        <pre class="app-code"><code>{{codeNotifications}}</code></pre>
                    </div>
                </div>
            </section>

            <!-- 11. Theme Presets -->
            <section [id]="sections[10].id" class="card flex flex-col gap-4">
                <div class="flex items-center gap-3">
                    <p-tag value="Theme" severity="info" />
                    <h2 class="text-xl font-bold text-surface-900 dark:text-surface-0 m-0">{{ sections[10].title }}</h2>
                </div>
                <p class="text-surface-600 dark:text-surface-300 m-0">{{ sections[10].description }}</p>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="card flex flex-col items-center gap-2 border border-primary-200 dark:border-primary-800">
                        <i class="pi pi-sun text-2xl text-primary-500"></i>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">BrandSoft</span>
                        <span class="text-xs text-surface-500 dark:text-surface-400 text-center">Aura base — soft, rounded aesthetic</span>
                    </div>
                    <div class="card flex flex-col items-center gap-2">
                        <i class="pi pi-bolt text-2xl text-orange-500"></i>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">BrandCrisp</span>
                        <span class="text-xs text-surface-500 dark:text-surface-400 text-center">Lara base — clean, sharp edges</span>
                    </div>
                    <div class="card flex flex-col items-center gap-2">
                        <i class="pi pi-moon text-2xl text-surface-700 dark:text-surface-200"></i>
                        <span class="font-semibold text-surface-900 dark:text-surface-0">BrandContrast</span>
                        <span class="text-xs text-surface-500 dark:text-surface-400 text-center">Nora base — high contrast, accessibility-focused</span>
                    </div>
                </div>

                <div class="relative">
                    <button class="absolute top-2 right-2 z-10" pButton icon="pi pi-copy" [text]="true" size="small" severity="secondary"
                            (click)="copyCode(codeTheme)" aria-label="Copy code"></button>
                    <pre class="app-code"><code>{{codeTheme}}</code></pre>
                </div>
            </section>

        </div>
    `
})
export class Showcase {
    sections: ShowcaseSection[] = [
        { id: 'ai-card-bg', title: 'AiCardBg', description: 'Animated gradient background with floating SVG blobs. Use as a wrapper to give any card an AI-themed visual treatment.' },
        { id: 'ai-insights-card', title: 'AiInsightsCard', description: 'Expandable card displaying paginated AI-generated insights with search filtering and action buttons.' },
        { id: 'completion-steps', title: 'CompletionSteps', description: 'Dot-based progress indicator showing mandatory and optional completion status with tooltips.' },
        { id: 'pill-tabs', title: 'PillTabs', description: 'Horizontal row of pill-shaped toggle buttons for sub-navigation or filtering.' },
        { id: 'ux-select', title: 'UxSelect', description: 'Branded wrapper around PrimeNG Select with consistent styling and hover/focus states.' },
        { id: 'documents-card', title: 'DocumentsCard', description: 'Collapsible document manager with pill-tab filtering, searchable table, sort, and file upload.' },
        { id: 'task-drawer', title: 'TaskDrawer', description: 'Slide-in drawer for creating or editing tasks with date pickers, status, and team member assignment.' },
        { id: 'detail-layout', title: 'DetailLayout', description: 'Full detail page shell with sticky header, responsive tabbed content area, and persistent sidebar.' },
        { id: 'footer-main', title: 'FooterMain', description: 'Sticky application footer. Shows copyright by default or custom content via FooterService.' },
        { id: 'injection-tokens', title: 'Injection Tokens', description: 'DI tokens for configuring the layout shell: menu, logos, profile menu, and notifications.' },
        { id: 'theme-presets', title: 'Theme Presets', description: 'Three brand presets (BrandSoft, BrandCrisp, BrandContrast) that apply UNOPS branding over PrimeNG base themes.' }
    ];

    // -- Demo data --

    demoInsights: AiInsight[] = [
        { id: 1, title: 'Budget Optimization', description: 'Consider reallocating 15% of the travel budget to digital collaboration tools.', actionLabel: 'Review Budget', icon: 'pi-wallet', iconColor: 'text-green-500' },
        { id: 2, title: 'Timeline Risk', description: 'Phase 2 deliverables are at risk of delay based on current resource allocation.', actionLabel: 'View Timeline', icon: 'pi-clock', iconColor: 'text-orange-500' },
        { id: 3, title: 'Stakeholder Engagement', description: 'Partner response rate has dropped 20% — schedule follow-up meetings.', actionLabel: 'Contact Partners', icon: 'pi-users', iconColor: 'text-blue-500' },
        { id: 4, title: 'Compliance Check', description: 'Two mandatory documents are still pending review before the submission deadline.', actionLabel: 'Check Documents', icon: 'pi-file-check', iconColor: 'text-red-500' }
    ];

    demoSteps: CompletionStep[] = [
        { type: 'mandatory', filled: true, name: 'Project Title' },
        { type: 'mandatory', filled: true, name: 'Description' },
        { type: 'mandatory', filled: true, name: 'Budget' },
        { type: 'mandatory', filled: true, name: 'Timeline' },
        { type: 'mandatory', filled: true, name: 'Partner' },
        { type: 'mandatory', filled: false, name: 'Risk Assessment' },
        { type: 'mandatory', filled: false, name: 'Approval' },
        { type: 'mandatory', filled: false, name: 'Final Review' },
        { type: 'optional', filled: true, name: 'Attachments' },
        { type: 'optional', filled: true, name: 'Notes' },
        { type: 'optional', filled: false, name: 'Tags' },
        { type: 'optional', filled: false, name: 'Custom Fields' }
    ];

    demoPillTabs: PillTabItem[] = [
        { value: 'all', label: 'All' },
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'closed', label: 'Closed' }
    ];
    activePillTab = signal('all');

    demoSelectOptions = [
        { label: 'Denmark', value: 'dk' },
        { label: 'Norway', value: 'no' },
        { label: 'Sweden', value: 'se' },
        { label: 'Finland', value: 'fi' },
        { label: 'Kenya', value: 'ke' },
        { label: 'Myanmar', value: 'mm' }
    ];
    selectedCountry = signal<string | null>(null);

    demoDocuments: DocumentItem[] = [
        { id: 1, fileName: 'Project_Proposal_v3.pdf', type: 'PDF', fileSize: '2.4 MB', uploadDate: '2024-03-15', owner: 'Amy Elsner', icon: 'pi-file-pdf' },
        { id: 2, fileName: 'Budget_Breakdown.xlsx', type: 'Excel', fileSize: '890 KB', uploadDate: '2024-03-12', owner: 'John Smith', icon: 'pi-file-excel' },
        { id: 3, fileName: 'Meeting_Notes_Q1.docx', type: 'Word', fileSize: '156 KB', uploadDate: '2024-03-10', owner: 'Sarah Connor', icon: 'pi-file-word' },
        { id: 4, fileName: 'Site_Photos.zip', type: 'Archive', fileSize: '45 MB', uploadDate: '2024-03-08', owner: 'Amy Elsner', icon: 'pi-file' },
        { id: 5, fileName: 'Risk_Matrix.pdf', type: 'PDF', fileSize: '1.1 MB', uploadDate: '2024-03-05', owner: 'John Smith', icon: 'pi-file-pdf' }
    ];

    taskDrawerVisible = signal(false);


    // -- Code snippets --

    codeAiCardBg = `<ux-ai-card-bg class="p-8 rounded-2xl">
  <p>Your content here — rendered above the animated background</p>
</ux-ai-card-bg>`;

    codeAiInsights = `import { AiInsightsCardComponent, AiInsight } from '@unopsitg/ux';

// In your component:
insights: AiInsight[] = [
  {
    id: 1,
    title: 'Budget Optimization',
    description: 'Consider reallocating 15% of travel budget...',
    actionLabel: 'Review Budget',
    icon: 'pi-wallet',
    iconColor: 'text-green-500'
  }
];

// Template:
<ux-ai-insights-card
  [title]="'AI Insights'"
  [insights]="insights"
  [searchPlaceholder]="'Search insights...'"
  (actionClick)="handleAction($event)"
/>`;

    codeCompletionSteps = `import { CompletionStepsComponent, CompletionStep } from '@unopsitg/ux';

steps: CompletionStep[] = [
  { type: 'mandatory', filled: true, name: 'Project Title' },
  { type: 'mandatory', filled: false, name: 'Risk Assessment' },
  { type: 'optional', filled: true, name: 'Attachments' },
];

// Template:
<ux-completion-steps
  [title]="'Opportunity Completion'"
  [steps]="steps"
  [mandatory]="{ filled: 5, total: 8 }"
  [optional]="{ filled: 2, total: 4 }"
  [totalRecords]="12"
  [interactive]="true"
  (stepClick)="onStepClick($event)"
/>`;

    codePillTabs = `import { PillTabsComponent, PillTabItem } from '@unopsitg/ux';

tabs: PillTabItem[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
];
activeTab = signal('all');

// Template:
<ux-pill-tabs [items]="tabs" [(activeValue)]="activeTab" />`;

    codeSelect = `import { UxSelectComponent } from '@unopsitg/ux';

options = [
  { label: 'Denmark', value: 'dk' },
  { label: 'Norway', value: 'no' },
];
selected = signal<string | null>(null);

// Template:
<ux-select
  [options]="options"
  optionLabel="label"
  optionValue="value"
  placeholder="Choose a country..."
  [(value)]="selected"
  [filter]="true"
  [showClear]="true"
/>`;

    codeDocuments = `import { DocumentsCardComponent, DocumentItem } from '@unopsitg/ux';

documents: DocumentItem[] = [
  {
    id: 1,
    fileName: 'Project_Proposal_v3.pdf',
    type: 'PDF',
    fileSize: '2.4 MB',
    uploadDate: '2024-03-15',
    owner: 'Amy Elsner',
    icon: 'pi-file-pdf'
  }
];

// Template:
<ux-documents-card [documents]="documents" [rows]="5" />`;

    codeTaskDrawer = `import { TaskDrawerComponent, TaskDrawerTask } from '@unopsitg/ux';

drawerVisible = signal(false);

onSave(task: TaskDrawerTask) {
  console.log('Task saved:', task);
}

// Template:
<button pButton label="New Task" (click)="drawerVisible.set(true)" />

<ux-task-drawer
  [(visible)]="drawerVisible"
  [mode]="'create'"
  (save)="onSave($event)"
  (cancel)="drawerVisible.set(false)"
/>`;

    codeDetailLayout = `import {
  DetailLayoutComponent, DetailTabDirective, DetailTab
} from '@unopsitg/ux';

tabs: DetailTab[] = [
  { value: 'overview', label: 'Overview', icon: 'pi pi-home' },
  { value: 'details', label: 'Details', icon: 'pi pi-list' },
];
activeTab = signal('overview');

// Template:
<ux-detail-layout [tabs]="tabs" [(activeTab)]="activeTab">
  <ng-container ux-detail-header>
    <!-- Sticky header content -->
  </ng-container>

  <ng-template uxDetailTab="overview">
    <!-- Overview tab content -->
  </ng-template>

  <ng-template uxDetailTab="details">
    <!-- Details tab content -->
  </ng-template>

  <ng-container ux-detail-sidebar>
    <!-- Right sidebar (AI card, docs, etc.) -->
  </ng-container>
</ux-detail-layout>`;

    codeFooter = `import { FooterMainComponent } from '@unopsitg/ux';

// Default copyright footer:
<ux-footer-main [copyrightOnly]="true" />

// Or inject custom content via FooterService:
import { FooterService } from '@unopsitg/ux';

export class MyComponent {
  private footerService = inject(FooterService);
  // Set footerService.content with a TemplateRef
}`;

    codeMenuModel = `import { MENU_MODEL, MenuItem } from '@unopsitg/ux';

// In app.config.ts providers:
{
  provide: MENU_MODEL,
  useFactory: () => [
    { label: 'Home', icon: 'pi pi-home', routerLink: ['/'] },
    { separator: true },
    {
      label: 'Features',
      icon: 'pi pi-th-large',
      items: [
        { label: 'Dashboard', icon: 'pi pi-chart-bar', routerLink: ['/dashboard'] },
        { label: 'Settings', icon: 'pi pi-cog', routerLink: ['/settings'] },
      ]
    }
  ] satisfies MenuItem[]
}`;

    codeSidebarLogo = `import { SIDEBAR_LOGO } from '@unopsitg/ux';

// In app.config.ts providers:
{
  provide: SIDEBAR_LOGO,
  useValue: {
    expanded: 'assets/logo-full.svg',
    compact: 'assets/logo-compact.svg',
    alt: 'My App'
  }
}`;

    codeProfileMenu = `import { TOPBAR_PROFILE_MENU_CONFIG } from '@unopsitg/ux';

// In app.config.ts providers:
{
  provide: TOPBAR_PROFILE_MENU_CONFIG,
  useValue: {
    items: [
      { id: 'profile', label: 'My Profile', icon: 'pi pi-user', command: () => router.navigate(['/profile']) },
      { id: 'settings', label: 'Settings', icon: 'pi pi-cog', command: () => router.navigate(['/settings']) },
      { id: 'logout', label: 'Sign Out', icon: 'pi pi-sign-out', separator: true, command: () => authService.logout() }
    ]
  }
}`;

    codeNotifications = `import { TOPBAR_NOTIFICATION_CONFIG } from '@unopsitg/ux';

// In app.config.ts providers:
{
  provide: TOPBAR_NOTIFICATION_CONFIG,
  useFactory: () => ({
    tabs: signal([
      { id: 'all', label: 'All', badge: '5' },
      { id: 'unread', label: 'Unread', badge: '3' },
    ]),
    items: signal([
      { id: 1, message: 'New partner added', category: 'info', time: '2m ago', isRead: false }
    ]),
    selectedTab: signal('all'),
    unreadCount: signal(3),
    onTabChange: (tabId) => { /* handle tab change */ },
    onItemClick: (item) => { /* handle click */ },
    onMarkAsRead: (item) => { /* mark read */ },
    onMarkAllAsRead: () => { /* mark all read */ },
  })
}`;

    codeTheme = `import { providePrimeNG } from 'primeng/config';
import { BrandSoft, BrandCrisp, BrandContrast } from '@unopsitg/ux';

// In app.config.ts providers:
providePrimeNG({
  theme: {
    preset: BrandSoft,  // or BrandCrisp, BrandContrast
    options: {
      darkModeSelector: '.app-dark'
    }
  }
})`;

    // -- Methods --

    scrollTo(id: string) {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    copyCode(code: string) {
        navigator.clipboard.writeText(code);
    }

    onInsightAction(insight: AiInsight) {
        console.log('Insight action:', insight.title);
    }

    onTaskSave(task: unknown) {
        console.log('Task saved:', task);
        this.taskDrawerVisible.set(false);
    }
}
