import { useEffect } from 'react';

export function useDarkMode(isDark: boolean) {
  useEffect(() => {
    const el = document.documentElement;
    const apply = () => {
      if (isDark) {
        el.classList.add('app-dark');
      } else {
        el.classList.remove('app-dark');
      }
    };

    if ('startViewTransition' in document) {
      (document as any).startViewTransition(apply);
    } else {
      apply();
    }
  }, [isDark]);
}
