import { createContext, useContext } from 'react';
import type { MenuItem } from '../types';

export interface MenuContextValue {
  menuItems: MenuItem[];
  currentPath: string;
  onNavigate?: (path: string) => void;
}

export const MenuContext = createContext<MenuContextValue>({
  menuItems: [],
  currentPath: '/',
});

export function useMenu(): MenuContextValue {
  return useContext(MenuContext);
}
