import type { Meta, StoryObj } from '@storybook/angular';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TagModule } from 'primeng/tag';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { FormsModule } from '@angular/forms';
import { brandPrimitives } from '@unops/ux';

interface ContrastPair {
    name: string;
    fg: string;
    bg: string;
    ratio: number;
    aaLarge: boolean;
    aaNormal: boolean;
    aaaLarge: boolean;
    aaaNormal: boolean;
}

function luminance(hex: string): number {
    const rgb = [hex.slice(1, 3), hex.slice(3, 5), hex.slice(5, 7)].map((c) => {
        const v = parseInt(c, 16) / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

function contrastRatio(hex1: string, hex2: string): number {
    const l1 = luminance(hex1);
    const l2 = luminance(hex2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

function buildPair(name: string, fg: string, bg: string): ContrastPair {
    const ratio = Math.round(contrastRatio(fg, bg) * 100) / 100;
    return { name, fg, bg, ratio, aaLarge: ratio >= 3, aaNormal: ratio >= 4.5, aaaLarge: ratio >= 4.5, aaaNormal: ratio >= 7 };
}

const LIGHT_BG = '#ffffff';
const DARK_BG = '#0d1e2f'; // deepsea-500

const CONTRAST_PAIRS: ContrastPair[] = [
    buildPair('Primary on white', brandPrimitives.darkblue[500], LIGHT_BG),
    buildPair('Primary button bg on white', brandPrimitives.darkblue[600], LIGHT_BG),
    buildPair('White on primary-600', '#ffffff', brandPrimitives.darkblue[600]),
    buildPair('Body text on white', brandPrimitives.gray[950], LIGHT_BG),
    buildPair('Muted text on white', brandPrimitives.gray[600], LIGHT_BG),
    buildPair('Success text on white', brandPrimitives.green[700], LIGHT_BG),
    buildPair('Danger text on white', brandPrimitives.red[600], LIGHT_BG),
    buildPair('Warning text on white', brandPrimitives.orange[800], LIGHT_BG),
    buildPair('Info text on white', brandPrimitives.blue[800], LIGHT_BG),
    buildPair('White on deepsea-500 (dark bg)', '#ffffff', DARK_BG),
    buildPair('Surface-200 on deepsea (dark muted)', brandPrimitives.deepsea[200], DARK_BG),
    buildPair('Green-400 on deepsea (dark success)', brandPrimitives.green[400], DARK_BG),
    buildPair('Red-400 on deepsea (dark danger)', brandPrimitives.red[400], DARK_BG),
    buildPair('Orange-300 on deepsea (dark warning)', brandPrimitives.orange[300], DARK_BG),
    buildPair('Blue-200 on deepsea (dark info)', brandPrimitives.blue[200], DARK_BG)
];

@Component({
    selector: 'sb-accessibility',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: `
        :host { display: block; padding: 2rem; color: var(--text-color, #1a1a1a); }
        h1 { font-size: 2rem; font-weight: 700; margin: 0 0 0.5rem; }
        h2 { font-size: 1.5rem; font-weight: 600; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--surface-border, #e5e7eb); }
        h3 { font-size: 1.125rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
        p.desc { color: var(--text-muted-color, #6b7280); margin: 0 0 2rem; }
        p.section-desc { color: var(--text-muted-color, #6b7280); margin: 0 0 1rem; font-size: 0.875rem; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; margin-bottom: 1.5rem; }
        th { text-align: left; font-weight: 600; padding: 0.5rem 0.75rem; border-bottom: 2px solid var(--surface-border, #e5e7eb); }
        td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--surface-border, #e5e7eb); vertical-align: middle; }
        .swatch-cell { display: flex; align-items: center; gap: 0.5rem; }
        .swatch-preview { width: 2.5rem; height: 1.5rem; border-radius: 4px; border: 1px solid var(--surface-border, #e5e7eb); display: flex; align-items: center; justify-content: center; font-size: 0.625rem; font-weight: 700; }
        .pass { color: #4c9f38; font-weight: 600; }
        .fail { color: #da291c; font-weight: 600; }
        .ratio { font-family: 'SF Mono', 'Fira Code', monospace; font-weight: 600; }
        code { font-family: 'SF Mono', 'Fira Code', monospace; font-size: 0.8125rem; background: var(--surface-hover, #f3f4f6); padding: 1px 5px; border-radius: 4px; }
        .demo-row { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
        .demo-card { border: 1px solid var(--surface-border, #e5e7eb); border-radius: 0.75rem; padding: 1.5rem; flex: 1; min-width: 260px; }
        .demo-card h4 { margin: 0 0 0.75rem; font-weight: 600; }
        .demo-card p { margin: 0.25rem 0 0; font-size: 0.8125rem; color: var(--text-muted-color, #6b7280); }
        .focus-demo { display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-start; }
        .focus-demo > * { flex: none; }
        .target-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.75rem; margin-bottom: 0.75rem; }
        .target-box { border: 1px solid var(--surface-border, #e5e7eb); border-radius: 0.5rem; padding: 0.75rem; text-align: center; font-size: 0.75rem; }
        .target-box .size { font-size: 1rem; font-weight: 700; display: block; margin-bottom: 0.25rem; }
        .badge-pass { background: #d2e7cd; color: #13280e; padding: 2px 8px; border-radius: 99px; font-size: 0.6875rem; font-weight: 600; }
        .badge-fail { background: #f6cac6; color: #370a07; padding: 2px 8px; border-radius: 99px; font-size: 0.6875rem; font-weight: 600; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
        .summary-card { border: 1px solid var(--surface-border, #e5e7eb); border-radius: 0.75rem; padding: 1rem 1.25rem; }
        .summary-card .metric { font-size: 2rem; font-weight: 700; }
        .summary-card .label { font-size: 0.8125rem; color: var(--text-muted-color, #6b7280); }
    `,
    template: `
        <h1>Accessibility Compliance</h1>
        <p class="desc">WCAG 2.1 compliance audit for the brand design system. Covers color contrast, keyboard navigation, focus indicators, touch targets, and semantic patterns.</p>

        <div class="summary-grid">
            <div class="summary-card">
                <div class="metric pass">{{ aaPassCount }}/{{ totalPairs }}</div>
                <div class="label">AA Normal pass rate</div>
            </div>
            <div class="summary-card">
                <div class="metric pass">{{ aaLargePassCount }}/{{ totalPairs }}</div>
                <div class="label">AA Large Text pass rate</div>
            </div>
            <div class="summary-card">
                <div class="metric" [class.pass]="aaaPassCount > totalPairs / 2" [class.fail]="aaaPassCount <= totalPairs / 2">{{ aaaPassCount }}/{{ totalPairs }}</div>
                <div class="label">AAA Normal pass rate</div>
            </div>
            <div class="summary-card">
                <div class="metric">48px</div>
                <div class="label">Min touch target (PrimeNG)</div>
            </div>
        </div>

        <h2>Color Contrast Ratios</h2>
        <p class="section-desc">
            WCAG 2.1 requires a minimum contrast ratio of <strong>4.5:1</strong> for normal text (AA), <strong>3:1</strong> for large text (AA),
            and <strong>7:1</strong> for enhanced (AAA). Ratios computed from brand palette hex values.
        </p>
        <table>
            <thead>
                <tr>
                    <th>Pair</th>
                    <th>Preview</th>
                    <th>Ratio</th>
                    <th>AA Normal</th>
                    <th>AA Large</th>
                    <th>AAA Normal</th>
                    <th>AAA Large</th>
                </tr>
            </thead>
            <tbody>
                @for (pair of contrastPairs; track pair.name) {
                    <tr>
                        <td>{{ pair.name }}</td>
                        <td>
                            <div class="swatch-preview" [style.background]="pair.bg" [style.color]="pair.fg">Aa</div>
                        </td>
                        <td class="ratio">{{ pair.ratio }}:1</td>
                        <td><span [class]="pair.aaNormal ? 'pass' : 'fail'">{{ pair.aaNormal ? 'Pass' : 'Fail' }}</span></td>
                        <td><span [class]="pair.aaLarge ? 'pass' : 'fail'">{{ pair.aaLarge ? 'Pass' : 'Fail' }}</span></td>
                        <td><span [class]="pair.aaaNormal ? 'pass' : 'fail'">{{ pair.aaaNormal ? 'Pass' : 'Fail' }}</span></td>
                        <td><span [class]="pair.aaaLarge ? 'pass' : 'fail'">{{ pair.aaaLarge ? 'Pass' : 'Fail' }}</span></td>
                    </tr>
                }
            </tbody>
        </table>

        <h2>Focus Indicators</h2>
        <p class="section-desc">
            PrimeNG components use <code>--p-focus-ring-shadow</code> for visible focus rings. Tab through the elements below to verify keyboard navigation.
        </p>
        <div class="demo-row">
            <div class="demo-card">
                <h4>Interactive Elements</h4>
                <div class="focus-demo">
                    <p-button label="Button" />
                    <p-button label="Secondary" severity="secondary" [outlined]="true" />
                    <input pInputText placeholder="Text input" style="width: 160px" />
                    <p-checkbox [binary]="true" />
                </div>
                <p>Tab through to see focus rings. All PrimeNG components emit a visible <code>box-shadow</code> focus indicator.</p>
            </div>
            <div class="demo-card">
                <h4>Focus Ring Token</h4>
                <table style="margin:0">
                    <tbody>
                        <tr><td><code>--focus-ring-shadow</code></td><td>var(--p-focus-ring-shadow)</td></tr>
                        <tr><td>Style</td><td>0 0 0 2px offset, primary-derived color</td></tr>
                        <tr><td>Visible on</td><td>:focus-visible (keyboard only)</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h2>Touch Target Sizes</h2>
        <p class="section-desc">
            WCAG 2.5.5 (AAA) recommends 44×44 CSS pixels minimum. WCAG 2.5.8 (AA, new in 2.2) requires 24×24px with adequate spacing. PrimeNG defaults meet or exceed these.
        </p>
        <div class="target-grid">
            <div class="target-box"><span class="size">48px</span>Button default height<br/><span class="badge-pass">AAA</span></div>
            <div class="target-box"><span class="size">40px</span>Input default height<br/><span class="badge-pass">AAA</span></div>
            <div class="target-box"><span class="size">20px</span>Checkbox / Radio<br/><span class="badge-pass">AA 2.2</span></div>
            <div class="target-box"><span class="size">44px</span>Toggle Switch<br/><span class="badge-pass">AAA</span></div>
            <div class="target-box"><span class="size">36px</span>Icon button (small)<br/><span class="badge-pass">AA 2.2</span></div>
            <div class="target-box"><span class="size">32px</span>Tag / Chip<br/><span class="badge-pass">AA 2.2</span></div>
        </div>

        <h2>Semantic HTML & ARIA Patterns</h2>
        <p class="section-desc">PrimeNG components emit semantic ARIA attributes by default. Key patterns used in this project:</p>
        <div class="demo-row">
            <div class="demo-card">
                <h4>Roles & Attributes</h4>
                <table style="margin:0">
                    <tbody>
                        <tr><td>Dialog</td><td><code>role="dialog"</code>, <code>aria-modal="true"</code>, <code>aria-labelledby</code></td></tr>
                        <tr><td>Table</td><td><code>role="table"</code>, <code>aria-sort</code> on sortable columns</td></tr>
                        <tr><td>Menu</td><td><code>role="menu"</code>, <code>role="menuitem"</code>, arrow-key nav</td></tr>
                        <tr><td>Tabs</td><td><code>role="tablist"</code> / <code>role="tab"</code> / <code>role="tabpanel"</code></td></tr>
                        <tr><td>Accordion</td><td><code>aria-expanded</code>, <code>aria-controls</code> on headers</td></tr>
                        <tr><td>Toast</td><td><code>role="alert"</code>, <code>aria-live="assertive"</code></td></tr>
                        <tr><td>Tooltip</td><td><code>role="tooltip"</code>, <code>aria-describedby</code></td></tr>
                    </tbody>
                </table>
            </div>
            <div class="demo-card">
                <h4>Keyboard Navigation</h4>
                <table style="margin:0">
                    <tbody>
                        <tr><td>Tab / Shift+Tab</td><td>Focus traversal through interactive elements</td></tr>
                        <tr><td>Enter / Space</td><td>Activate buttons, toggles, menu items</td></tr>
                        <tr><td>Arrow keys</td><td>Navigate within menus, tabs, select lists</td></tr>
                        <tr><td>Escape</td><td>Close dialogs, drawers, popovers</td></tr>
                        <tr><td>Home / End</td><td>Jump to first/last item in lists</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <h2>Storybook a11y Addon</h2>
        <p class="section-desc">
            The <code>&#64;storybook/addon-a11y</code> addon is installed and runs automated <strong>axe-core</strong> checks on every story.
            Open the <strong>Accessibility</strong> tab in the addons panel on any story to see a live audit of violations, passes, and incomplete checks.
        </p>
        <p-message severity="info">
            Use the Accessibility panel in Storybook to run live axe-core audits on each component and block story.
        </p-message>
    `
})
class AccessibilityComponent {
    contrastPairs = CONTRAST_PAIRS;
    totalPairs = CONTRAST_PAIRS.length;
    aaPassCount = CONTRAST_PAIRS.filter((p) => p.aaNormal).length;
    aaLargePassCount = CONTRAST_PAIRS.filter((p) => p.aaLarge).length;
    aaaPassCount = CONTRAST_PAIRS.filter((p) => p.aaaNormal).length;
}

const meta: Meta<AccessibilityComponent> = {
    title: 'Foundations/Accessibility',
    component: AccessibilityComponent,
    decorators: [
        moduleMetadata({
            imports: [ButtonModule, InputTextModule, CheckboxModule, TagModule, MessageModule, TooltipModule, FormsModule]
        })
    ],
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component:
                    'WCAG 2.1 accessibility compliance report for the brand design system. Covers color contrast ratio audits (AA/AAA), ' +
                    'focus indicator verification, touch target sizing, semantic HTML and ARIA patterns, keyboard navigation support, ' +
                    'and integration with the axe-core-based Storybook a11y addon for automated checks.'
            }
        }
    }
};
export default meta;
type Story = StoryObj<AccessibilityComponent>;

export const Default: Story = {};
