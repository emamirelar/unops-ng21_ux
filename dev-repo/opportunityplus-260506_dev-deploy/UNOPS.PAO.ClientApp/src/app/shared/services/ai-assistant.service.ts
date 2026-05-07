import { Injectable, signal, computed, effect } from '@angular/core';

interface AiAssistantState {
  active: boolean;
  panelSize: number;
}

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  private readonly ACTIVE_KEY = 'aiAssistantActive';
  private readonly PANEL_SIZE_KEY = 'aiAssistantPanelSize';

  readonly state = signal<AiAssistantState>({
    active: this.getStoredActive(),
    panelSize: this.getStoredPanelSize()
  });

  readonly isActive = computed(() => this.state().active);
  readonly panelSize = computed(() => this.state().panelSize);

  constructor() {
    effect(() => {
      const s = this.state();
      localStorage.setItem(this.ACTIVE_KEY, JSON.stringify(s.active));
      localStorage.setItem(this.PANEL_SIZE_KEY, JSON.stringify(s.panelSize));
    });
  }

  toggle(): void {
    this.state.update(s => ({ ...s, active: !s.active }));
  }

  setActive(active: boolean): void {
    this.state.update(s => ({ ...s, active }));
  }

  updatePanelSize(size: number): void {
    this.state.update(s => ({
      ...s,
      panelSize: size,
      active: size > 0
    }));
  }

  private getStoredActive(): boolean {
    try {
      const stored = localStorage.getItem(this.ACTIVE_KEY);
      return stored ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  }

  private getStoredPanelSize(): number {
    try {
      const stored = localStorage.getItem(this.PANEL_SIZE_KEY);
      return stored ? JSON.parse(stored) : 30;
    } catch {
      return 30;
    }
  }
}
