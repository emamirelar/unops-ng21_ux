import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { brandPrimitives } from '@/app/layout/service/brand-theme';

interface ColorSwatch {
    shade: string;
    hex: string;
}

interface ColorPalette {
    name: string;
    swatches: ColorSwatch[];
    role?: string;
}

const PALETTES: ColorPalette[] = Object.entries(brandPrimitives).map(([name, shades]) => ({
    name,
    swatches: Object.entries(shades).map(([shade, hex]) => ({ shade, hex })),
    role: ({
        darkblue: 'primary',
        gray: 'surface (light)',
        deepsea: 'surface (dark)',
        red: 'danger / error',
        orange: 'warning',
        green: 'success',
        blue: 'info'
    } as Record<string, string>)[name]
}));

const SEMANTIC_VARS = [
    { token: '--primary-color', maps: 'var(--p-primary-color)', usage: 'Primary brand actions' },
    { token: '--primary-contrast-color', maps: 'var(--p-primary-contrast-color)', usage: 'Text on primary bg' },
    { token: '--text-color', maps: 'var(--p-text-color)', usage: 'Default body text' },
    { token: '--text-muted-color', maps: 'var(--p-text-muted-color)', usage: 'Secondary / muted text' },
    { token: '--surface-border', maps: 'var(--p-content-border-color)', usage: 'Card / divider borders' },
    { token: '--surface-card', maps: 'var(--p-content-background)', usage: 'Card backgrounds' },
    { token: '--surface-hover', maps: 'var(--p-content-hover-background)', usage: 'Hover state bg' },
    { token: '--surface-ground', maps: '#ffffff / surface-950', usage: 'Page background' },
    { token: '--surface-overlay', maps: 'var(--p-overlay-popover-background)', usage: 'Popover / dialog bg' },
    { token: '--transition-duration', maps: 'var(--p-transition-duration)', usage: 'Default animation speed' },
    { token: '--border-radius', maps: 'var(--p-content-border-radius)', usage: 'Default border radius' },
    { token: '--focus-ring-shadow', maps: 'var(--p-focus-ring-shadow)', usage: 'Focus indicator' }
];

const BREAKPOINTS = [
    { name: 'sm', value: '576px', usage: 'Phones (landscape)' },
    { name: 'md', value: '768px', usage: 'Tablets' },
    { name: 'lg', value: '992px', usage: 'Small desktops / sidebar collapse' },
    { name: 'xl', value: '1200px', usage: 'Desktops' },
    { name: '2xl', value: '1920px', usage: 'Large displays' }
];

const TYPOGRAPHY = [
    { util: 'title-h1', size: '7xl', weight: 'semibold', usage: 'Hero headlines' },
    { util: 'title-h2', size: '4rem', weight: 'semibold', usage: 'Section titles' },
    { util: 'title-h3', size: '3.5rem', weight: 'semibold', usage: 'Sub-section headings' },
    { util: 'title-h4', size: '2.85rem', weight: 'semibold', usage: 'Card group headings' },
    { util: 'title-h5', size: '4xl', weight: 'medium', usage: 'Feature titles' },
    { util: 'title-h6', size: '3xl', weight: 'medium', usage: 'Widget headings' },
    { util: 'title-h7', size: '2xl', weight: 'medium', usage: 'Small headings' },
    { util: 'body-large', size: 'xl', weight: 'normal', usage: 'Hero body copy' },
    { util: 'body-medium', size: 'lg', weight: 'normal', usage: 'Standard body copy' },
    { util: 'body-small', size: 'base', weight: 'normal', usage: 'Secondary text' },
    { util: 'body-xsmall', size: 'sm', weight: 'normal', usage: 'Captions' },
    { util: 'label-large', size: 'xl', weight: 'medium', usage: 'Nav / large labels' },
    { util: 'label-medium', size: 'lg', weight: 'medium', usage: 'Standard labels' },
    { util: 'label-small', size: 'base', weight: 'medium', usage: 'Form labels' },
    { util: 'label-xsmall', size: 'sm', weight: 'medium', usage: 'Micro labels / badges' }
];

@Component({
    selector: 'sb-design-tokens',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        :host { display: block; padding: 2rem; color: var(--text-color, #1a1a1a); }
        h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.5rem; }
        h2 { font-size: 1.5rem; font-weight: 600; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--surface-border, #e5e7eb); }
        h3 { font-size: 1.125rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
        p.desc { color: var(--text-muted-color, #6b7280); margin: 0 0 2rem; }
        .palette { margin-bottom: 1.5rem; }
        .palette-name { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; }
        .palette-name span { font-weight: 600; font-size: 0.875rem; text-transform: capitalize; }
        .palette-name .role { font-weight: 400; color: var(--text-muted-color, #6b7280); font-size: 0.75rem; }
        .swatches { display: flex; gap: 2px; border-radius: 0.5rem; overflow: hidden; }
        .swatch {
            flex: 1; min-width: 0; height: 3rem;
            display: flex; align-items: flex-end; justify-content: center;
            padding-bottom: 4px; font-size: 0.5rem; font-weight: 500;
            cursor: pointer; position: relative;
            transition: box-shadow 0.15s ease;
        }
        .swatch:hover::after {
            content: attr(data-hex); position: absolute; top: 4px; left: 50%; transform: translateX(-50%);
            font-size: 0.5625rem; font-weight: 600; padding: 1px 4px; border-radius: 3px; white-space: nowrap;
        }
        .swatch.changed {
            box-shadow: inset 0 0 0 2px #fff, inset 0 0 0 4px rgba(0,0,0,0.35);
        }
        .swatch .color-input {
            position: absolute; inset: 0; width: 100%; height: 100%;
            opacity: 0; cursor: pointer; border: none; padding: 0;
        }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th { text-align: left; font-weight: 600; padding: 0.5rem 0.75rem; border-bottom: 2px solid var(--surface-border, #e5e7eb); }
        td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--surface-border, #e5e7eb); }
        td code, th code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8125rem; background: var(--surface-hover, #f3f4f6); padding: 1px 5px; border-radius: 4px; }
        .bp-bar { height: 6px; border-radius: 3px; background: var(--primary-color, #00669a); margin-top: 4px; }
        .type-sample { line-height: 1.3; }

        .save-bar {
            position: sticky; top: 0; z-index: 100;
            display: flex; align-items: center; justify-content: space-between;
            padding: 0.625rem 1.25rem;
            margin: -2rem -2rem 1.5rem;
            background: var(--primary-color, #00669a);
            color: #fff; font-size: 0.875rem; font-weight: 500;
            box-shadow: 0 2px 12px rgba(0,0,0,0.18);
        }
        .save-bar .actions { display: flex; gap: 0.5rem; }
        .save-bar button {
            padding: 0.375rem 1rem; border-radius: 0.375rem;
            font-size: 0.8125rem; font-weight: 600;
            cursor: pointer; border: none; transition: opacity 0.15s;
        }
        .save-bar button:hover { opacity: 0.85; }
        .save-bar .btn-save { background: #fff; color: var(--primary-color, #00669a); }
        .save-bar .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .save-bar .btn-reset { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.45); }

        .toast {
            position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 200;
            padding: 0.75rem 1.25rem; border-radius: 0.5rem;
            font-size: 0.875rem; font-weight: 500; color: #fff;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            animation: toastIn 0.3s ease;
        }
        .toast-success { background: #4c9f38; }
        .toast-error { background: #da291c; }
        @keyframes toastIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `,
    template: `
        @if (pendingCount() > 0) {
            <div class="save-bar">
                <span>{{ pendingCount() }} unsaved color change{{ pendingCount() > 1 ? 's' : '' }}</span>
                <div class="actions">
                    <button class="btn-reset" (click)="resetChanges()">Reset</button>
                    <button class="btn-save" [disabled]="saving()" (click)="saveChanges()">
                        {{ saving() ? 'Saving\u2026' : 'Save to Codebase' }}
                    </button>
                </div>
            </div>
        }

        @if (toast()) {
            <div class="toast" [class.toast-success]="!toast()!.error" [class.toast-error]="toast()!.error">
                {{ toast()!.message }}
            </div>
        }

        <h1>Design Tokens</h1>
        <p class="desc">Complete token reference for the brand design system. Click any swatch to edit its color — changes save to <code>brand-theme.ts</code> and <code>tailwind.css</code>.</p>

        <h2>Color Palettes</h2>
        <p style="margin-bottom: 1rem; font-size: 0.875rem; color: var(--text-muted-color, #6b7280)">
            18 custom brand palettes, each with 11 shades (50 – 950). Click a swatch to open the color picker. Hover to see the hex value.
        </p>
        @for (p of palettes; track p.name) {
            <div class="palette">
                <div class="palette-name">
                    <span>{{ p.name }}</span>
                    @if (p.role) { <span class="role">\u2192 {{ p.role }}</span> }
                </div>
                <div class="swatches">
                    @for (s of p.swatches; track s.shade) {
                        <div class="swatch"
                             [class.changed]="isChanged(p.name, s.shade)"
                             [style.background]="getColor(p.name, s.shade, s.hex)"
                             [style.color]="lightText(getColor(p.name, s.shade, s.hex)) ? '#fff' : '#000'"
                             [attr.data-hex]="getColor(p.name, s.shade, s.hex)">
                            {{ s.shade }}
                            <input type="color"
                                   class="color-input"
                                   [value]="getColor(p.name, s.shade, s.hex)"
                                   (input)="onColorChange(p.name, s.shade, $event)" />
                        </div>
                    }
                </div>
            </div>
        }

        <h2>Semantic CSS Variables</h2>
        <table>
            <thead><tr><th>Token</th><th>Maps to</th><th>Usage</th></tr></thead>
            <tbody>
                @for (v of semanticVars; track v.token) {
                    <tr>
                        <td><code>{{ v.token }}</code></td>
                        <td><code>{{ v.maps }}</code></td>
                        <td>{{ v.usage }}</td>
                    </tr>
                }
            </tbody>
        </table>

        <h2>Breakpoints</h2>
        <table>
            <thead><tr><th>Name</th><th>Value</th><th>Usage</th><th style="width:40%">Relative</th></tr></thead>
            <tbody>
                @for (bp of breakpoints; track bp.name) {
                    <tr>
                        <td><code>{{ bp.name }}</code></td>
                        <td><code>{{ bp.value }}</code></td>
                        <td>{{ bp.usage }}</td>
                        <td><div class="bp-bar" [style.width.%]="bpPercent(bp.value)"></div></td>
                    </tr>
                }
            </tbody>
        </table>

        <h2>Typography Utilities</h2>
        <p style="margin-bottom: 1rem; font-size: 0.875rem; color: var(--text-muted-color, #6b7280)">
            Tailwind <code>&#64;utility</code> classes defined in <code>tailwind.css</code>. Apply via class name. Font: Noto Sans with OpenType features.
        </p>
        <table>
            <thead><tr><th>Utility</th><th>Size</th><th>Weight</th><th>Usage</th><th style="width:30%">Sample</th></tr></thead>
            <tbody>
                @for (t of typography; track t.util) {
                    <tr>
                        <td><code>.{{ t.util }}</code></td>
                        <td>{{ t.size }}</td>
                        <td>{{ t.weight }}</td>
                        <td>{{ t.usage }}</td>
                        <td><span class="type-sample" [class]="t.util" style="font-size: clamp(0.75rem, 1vw, 1.125rem)">Aa Bb 123</span></td>
                    </tr>
                }
            </tbody>
        </table>

        <h2>Layout Variables</h2>
        <table>
            <thead><tr><th>Token</th><th>Value</th><th>Usage</th></tr></thead>
            <tbody>
                <tr><td><code>$breakpoint</code></td><td><code>992px</code></td><td>Sidebar collapse point (SCSS)</td></tr>
                <tr><td><code>$sidebarShadow</code></td><td><code>0px 1px 2px 0px rgba(18,18,23,0.05)</code></td><td>Sidebar elevation</td></tr>
                <tr><td><code>--surface-card</code></td><td><code>var(--p-surface-50)</code> / <code>var(--p-surface-900)</code></td><td>Card backgrounds (light / dark)</td></tr>
                <tr><td><code>--surface-ground</code></td><td><code>#ffffff</code> / <code>var(--p-surface-950)</code></td><td>Page background (light / dark)</td></tr>
                <tr><td><code>--menu-bg-color</code></td><td><code>var(--p-primary-700)</code></td><td>Sidebar menu background</td></tr>
                <tr><td><code>.card</code></td><td>padding 1rem, border-radius 1rem, 1px border</td><td>Standard card class</td></tr>
                <tr><td><code>.layout-content</code></td><td>padding 2rem, max-width 1540px</td><td>Main content area</td></tr>
            </tbody>
        </table>
    `
})
class DesignTokensComponent {
    palettes = PALETTES;
    semanticVars = SEMANTIC_VARS;
    breakpoints = BREAKPOINTS;
    typography = TYPOGRAPHY;

    pending = signal<Record<string, string>>({});
    saving = signal(false);
    toast = signal<{ message: string; error: boolean } | null>(null);

    pendingCount = computed(() => Object.keys(this.pending()).length);

    getColor(palette: string, shade: string, original: string): string {
        return this.pending()[`${palette}.${shade}`] ?? original;
    }

    isChanged(palette: string, shade: string): boolean {
        return `${palette}.${shade}` in this.pending();
    }

    onColorChange(palette: string, shade: string, event: Event) {
        const hex = (event.target as HTMLInputElement).value;
        const key = `${palette}.${shade}`;
        const original = this.palettes.find((p) => p.name === palette)?.swatches.find((s) => s.shade === shade)?.hex;

        if (original && hex.toLowerCase() === original.toLowerCase()) {
            this.pending.update((p) => {
                const copy = { ...p };
                delete copy[key];
                return copy;
            });
        } else {
            this.pending.update((p) => ({ ...p, [key]: hex }));
        }
    }

    resetChanges() {
        this.pending.set({});
    }

    async saveChanges() {
        this.saving.set(true);
        this.toast.set(null);

        const changes = Object.entries(this.pending()).map(([key, hex]) => {
            const [palette, shade] = key.split('.');
            return { palette, shade, hex };
        });

        try {
            const res = await fetch('/api/update-tokens', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ changes })
            });

            if (res.ok) {
                const data = await res.json();
                this.pending.set({});
                this.showToast(`${data.count} token(s) saved to brand-theme.ts & tailwind.css`, false);
            } else {
                const err = await res.json().catch(() => ({ error: 'Unknown error' }));
                this.showToast(`Save failed: ${err.error}`, true);
            }
        } catch {
            this.showToast('Network error — is Storybook dev server running?', true);
        }

        this.saving.set(false);
    }

    lightText(hex: string): boolean {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    }

    bpPercent(value: string): number {
        return (parseInt(value) / 1920) * 100;
    }

    private showToast(message: string, error: boolean) {
        this.toast.set({ message, error });
        setTimeout(() => this.toast.set(null), 4000);
    }
}

const meta: Meta<DesignTokensComponent> = {
    title: 'Foundations/DesignTokens',
    component: DesignTokensComponent,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'Interactive reference of the brand design system tokens. Click any color swatch to edit it — ' +
                    'changes are written back to brand-theme.ts and tailwind.css on save. Also documents CSS custom properties, ' +
                    'Tailwind typography utilities, responsive breakpoints, and SCSS layout variables.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<DesignTokensComponent>;

export const Default: Story = {};
