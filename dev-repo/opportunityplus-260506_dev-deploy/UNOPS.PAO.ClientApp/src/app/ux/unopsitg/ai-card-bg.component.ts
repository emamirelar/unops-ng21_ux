/**
 * Local shim for `ux-ai-card-bg` / {@link AiCardBgComponent} until the component
 * ships from the UNOPS UX package import path used by the app (`@unopsitg/ux`).
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'ux-ai-card-bg',
  template: `
    <div class="ux-ai-card-bg__shell">
      <div class="ux-ai-card-bg__gradient" aria-hidden="true"></div>
      <div class="ux-ai-card-bg__inner">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
    }
    .ux-ai-card-bg__shell {
      position: relative;
      overflow: hidden;
      border-radius: inherit;
    }
    .ux-ai-card-bg__gradient {
      position: absolute;
      inset: 0;
      opacity: 0.4;
      background: linear-gradient(
        125deg,
        var(--p-primary-color, #0092d1) 0%,
        color-mix(in srgb, var(--p-primary-color, #0092d1) 65%, #6366f1) 45%,
        var(--p-primary-400, #38bdf8) 100%
      );
      background-size: 200% 200%;
      animation: ux-ai-card-bg-shift 10s ease-in-out infinite;
    }
    :host-context(.dark) .ux-ai-card-bg__gradient,
    :host-context(.p-dark) .ux-ai-card-bg__gradient {
      opacity: 0.5;
    }
    .ux-ai-card-bg__inner {
      position: relative;
      z-index: 1;
      background: color-mix(in srgb, var(--p-surface-0, #fff) 92%, transparent);
    }
    :host-context(.dark) .ux-ai-card-bg__inner,
    :host-context(.p-dark) .ux-ai-card-bg__inner {
      background: color-mix(in srgb, var(--p-surface-900, #18181b) 88%, transparent);
    }
    @keyframes ux-ai-card-bg-shift {
      0%,
      100% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .ux-ai-card-bg__gradient {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AiCardBgComponent {}
