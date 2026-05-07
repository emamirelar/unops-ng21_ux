import { type ReactNode } from 'react';
import { LayoutContext, useLayoutReducers } from '../hooks/useLayout';
import { useDarkMode } from '../hooks/useDarkMode';
import { MenuContext, type MenuContextValue } from '../hooks/useMenu';
import type { LayoutConfig, LayoutState, MenuItem } from '../types';

export interface LayoutProviderProps {
  children: ReactNode;
  initialConfig?: Partial<LayoutConfig>;
  initialState?: Partial<LayoutState>;
  menuItems?: MenuItem[];
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function LayoutProvider({
  children,
  initialConfig,
  initialState,
  menuItems = [],
  currentPath = '/',
  onNavigate,
}: LayoutProviderProps) {
  const layoutValue = useLayoutReducers(initialConfig, initialState);

  useDarkMode(layoutValue.isDarkTheme);

  const menuValue: MenuContextValue = {
    menuItems,
    currentPath,
    onNavigate,
  };

  return (
    <LayoutContext.Provider value={layoutValue}>
      <MenuContext.Provider value={menuValue}>{children}</MenuContext.Provider>
    </LayoutContext.Provider>
  );
}
