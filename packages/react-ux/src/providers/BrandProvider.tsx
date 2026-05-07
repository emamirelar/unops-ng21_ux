import { type ReactNode, useEffect } from 'react';
import { $t } from '@primeuix/themes';
import { BrandSoft } from '../tokens/brand-theme';
import { useDarkMode } from '../hooks/useDarkMode';

export interface BrandProviderProps {
  children: ReactNode;
  /** PrimeUIX theme preset -- defaults to BrandSoft */
  preset?: Record<string, unknown>;
  /** Enable dark mode */
  darkMode?: boolean;
  /** CSS selector used by PrimeUIX to scope dark tokens. Defaults to '.app-dark'. */
  darkModeSelector?: string;
}

/**
 * Initializes the PrimeUIX theme engine with the brand preset.
 * Works with both PrimeReact v10 and v11 -- consumers wrap their
 * own PrimeReactProvider around this if they need PrimeReact-specific
 * context (locale, passthrough, etc.).
 */
export function BrandProvider({
  children,
  preset,
  darkMode = false,
  darkModeSelector = '.app-dark',
}: BrandProviderProps) {
  useDarkMode(darkMode);

  useEffect(() => {
    $t()
      .preset(preset ?? BrandSoft)
      .use({ useDefaultOptions: true, darkModeSelector });
  }, [preset, darkModeSelector]);

  return <>{children}</>;
}
