export interface MenuItem {
  label?: string;
  icon?: string;
  to?: string;
  url?: string;
  target?: string;
  separator?: boolean;
  path?: string;
  visible?: boolean;
  disabled?: boolean;
  preventAutoActivate?: boolean;
  command?: (event?: { originalEvent?: Event; item?: MenuItem }) => void;
  items?: MenuItem[];
  className?: string;
  badgeClass?: string;
}

export interface SidebarLogoConfig {
  expanded: string;
  compact: string;
  alt: string;
}

export interface TopbarMobileLogoConfig {
  dark: string;
  light: string;
  alt: string;
}

export interface LayoutConfig {
  preset: string;
  primary: string;
  surface: string | undefined | null;
  darkTheme: boolean;
  menuMode: string;
  menuTheme: string;
  cardStyle: string;
}

export interface LayoutState {
  staticMenuInactive: boolean;
  overlayMenuActive: boolean;
  rightMenuVisible: boolean;
  configSidebarVisible: boolean;
  mobileMenuActive: boolean;
  searchBarActive: boolean;
  sidebarExpanded: boolean;
  sidebarPinned: boolean;
  menuHoverActive: boolean;
  activePath: string | null;
  anchored: boolean;
}

export interface BreadcrumbItem {
  label: string;
  url?: string;
}
