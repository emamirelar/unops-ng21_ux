import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UserPreferenceService } from '@core/services/user/user-preference.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private userPreferenceService = inject(UserPreferenceService);

  private darkMode = signal(false);
  private userId: string | null = null;

  readonly isDark = computed(() => this.darkMode());

  init(userId: string): void {
    this.userId = userId;
    this.userPreferenceService.getGlobalFilters(userId).subscribe({
      next: (filters) => {
        if (filters?.theme === 'dark') {
          this.applyTheme(true);
        }
      }
    });
  }

  toggle(): void {
    const next = !this.darkMode();
    this.applyTheme(next);
    this.persistTheme(next ? 'dark' : 'light');
  }

  private applyTheme(dark: boolean): void {
    this.darkMode.set(dark);

    if (!isPlatformBrowser(this.platformId)) return;

    const apply = () => {
      if (dark) {
        document.documentElement.classList.add('app-dark');
      } else {
        document.documentElement.classList.remove('app-dark');
      }
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(apply);
    } else {
      apply();
    }
  }

  private persistTheme(theme: string): void {
    if (!this.userId) return;

    this.userPreferenceService.getGlobalFilters(this.userId).subscribe({
      next: (filters) => {
        const updated = { ...filters, theme };
        this.userPreferenceService.updateGlobalFilters(this.userId!, updated).subscribe();
      }
    });
  }
}
