// Styles
import './styles/layout.scss';
import 'primeicons/primeicons.css';

// Tokens / Theme
export { BrandSoft, BrandCrisp, BrandContrast, brandPresets, brandPrimitives } from './tokens/brand-theme';

// Types
export type {
  MenuItem,
  SidebarLogoConfig,
  TopbarMobileLogoConfig,
  LayoutConfig,
  LayoutState,
  BreadcrumbItem,
} from './types';

// Hooks
export { useLayout, LayoutContext, type LayoutContextValue } from './hooks/useLayout';
export { useDarkMode } from './hooks/useDarkMode';
export { useMenu, MenuContext, type MenuContextValue } from './hooks/useMenu';

// Providers
export { BrandProvider, type BrandProviderProps } from './providers/BrandProvider';
export { LayoutProvider, type LayoutProviderProps } from './providers/LayoutProvider';

// Layout Components
export { AppLayout, type AppLayoutProps } from './components/layout/AppLayout';
export { Topbar, type TopbarProps } from './components/layout/Topbar';
export { Sidebar } from './components/layout/Sidebar';
export { Menu } from './components/layout/Menu';
export { MenuItemComponent } from './components/layout/MenuItem';
export { Breadcrumb, type BreadcrumbProps } from './components/layout/Breadcrumb';
export { Footer, type FooterProps } from './components/layout/Footer';
export { Configurator, type ConfiguratorProps } from './components/layout/Configurator';
export { Search } from './components/layout/Search';
export { RightMenu } from './components/layout/RightMenu';
export { AuthLayout, type AuthLayoutProps } from './components/layout/AuthLayout';

// UI Components
export { AiCardBg, type AiCardBgProps } from './components/ui/AiCardBg';
