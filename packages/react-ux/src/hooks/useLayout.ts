import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
} from 'react';
import type { LayoutConfig, LayoutState } from '../types';

const DESKTOP_BREAKPOINT = 992;

const defaultConfig: LayoutConfig = {
  preset: 'Soft',
  primary: 'blue',
  surface: null,
  darkTheme: true,
  menuMode: 'static',
  menuTheme: 'primary',
  cardStyle: 'transparent',
};

const defaultState: LayoutState = {
  staticMenuInactive: false,
  overlayMenuActive: false,
  rightMenuVisible: false,
  configSidebarVisible: false,
  mobileMenuActive: false,
  searchBarActive: false,
  sidebarExpanded: false,
  sidebarPinned: true,
  menuHoverActive: false,
  activePath: null,
  anchored: false,
};

type ConfigAction =
  | { type: 'SET_CONFIG'; payload: Partial<LayoutConfig> }
  | { type: 'TOGGLE_DARK' };

type StateAction =
  | { type: 'SET_STATE'; payload: Partial<LayoutState> }
  | { type: 'TOGGLE_MENU' }
  | { type: 'TOGGLE_SIDEBAR_PIN' }
  | { type: 'TOGGLE_RIGHT_MENU' }
  | { type: 'TOGGLE_CONFIG_SIDEBAR' }
  | { type: 'TOGGLE_SEARCH_BAR' }
  | { type: 'CHANGE_MENU_MODE'; mode: string };

function configReducer(state: LayoutConfig, action: ConfigAction): LayoutConfig {
  switch (action.type) {
    case 'SET_CONFIG':
      return { ...state, ...action.payload };
    case 'TOGGLE_DARK':
      return { ...state, darkTheme: !state.darkTheme };
    default:
      return state;
  }
}

function stateReducer(state: LayoutState, action: StateAction): LayoutState {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'TOGGLE_MENU': {
      const isDesktop = window.innerWidth > DESKTOP_BREAKPOINT - 1;
      if (isDesktop) {
        return {
          ...state,
          sidebarPinned: !state.sidebarPinned,
          sidebarExpanded: false,
        };
      }
      return { ...state, mobileMenuActive: !state.mobileMenuActive };
    }
    case 'TOGGLE_SIDEBAR_PIN':
      return {
        ...state,
        sidebarPinned: !state.sidebarPinned,
        sidebarExpanded: false,
      };
    case 'TOGGLE_RIGHT_MENU':
      return { ...state, rightMenuVisible: !state.rightMenuVisible };
    case 'TOGGLE_CONFIG_SIDEBAR':
      return { ...state, configSidebarVisible: !state.configSidebarVisible };
    case 'TOGGLE_SEARCH_BAR':
      return { ...state, searchBarActive: !state.searchBarActive };
    case 'CHANGE_MENU_MODE':
      return {
        ...state,
        staticMenuInactive: false,
        overlayMenuActive: false,
        mobileMenuActive: false,
        sidebarExpanded: false,
        sidebarPinned: true,
        menuHoverActive: false,
        anchored: false,
      };
    default:
      return state;
  }
}

export interface LayoutContextValue {
  layoutConfig: LayoutConfig;
  layoutState: LayoutState;
  dispatchConfig: Dispatch<ConfigAction>;
  dispatchState: Dispatch<StateAction>;

  isSlim: boolean;
  isHorizontal: boolean;
  isOverlay: boolean;
  isCompact: boolean;
  isStatic: boolean;
  isReveal: boolean;
  isDrawer: boolean;
  isRail: boolean;
  isSidebarPinned: boolean;
  isDarkTheme: boolean;
  hasOverlaySubmenu: boolean;

  toggleMenu: () => void;
  toggleDarkMode: () => void;
  toggleSidebarPin: () => void;
  toggleSearchBar: () => void;
  toggleRightMenu: () => void;
  toggleConfigSidebar: () => void;
  setLayoutConfig: (partial: Partial<LayoutConfig>) => void;
  setLayoutState: (partial: Partial<LayoutState>) => void;
  changeMenuMode: (mode: string) => void;
  isDesktop: () => boolean;
}

export const LayoutContext = createContext<LayoutContextValue | null>(null);

export function useLayoutReducers(
  initialConfig?: Partial<LayoutConfig>,
  initialState?: Partial<LayoutState>,
) {
  const [layoutConfig, dispatchConfig] = useReducer(configReducer, {
    ...defaultConfig,
    ...initialConfig,
  });
  const [layoutState, dispatchState] = useReducer(stateReducer, {
    ...defaultState,
    ...initialState,
  });

  const isSlim = layoutConfig.menuMode === 'slim';
  const isHorizontal = layoutConfig.menuMode === 'horizontal';
  const isOverlay = layoutConfig.menuMode === 'overlay';
  const isCompact = layoutConfig.menuMode === 'compact';
  const isStatic = layoutConfig.menuMode === 'static';
  const isReveal = layoutConfig.menuMode === 'reveal';
  const isDrawer = layoutConfig.menuMode === 'drawer';
  const isSidebarPinned = layoutState.sidebarPinned;
  const isRail = !layoutState.sidebarPinned && isStatic;
  const isDarkTheme = layoutConfig.darkTheme;
  const hasOverlaySubmenu = isSlim || isCompact || isHorizontal;

  const isDesktop = useCallback(() => window.innerWidth > DESKTOP_BREAKPOINT - 1, []);

  const toggleMenu = useCallback(() => dispatchState({ type: 'TOGGLE_MENU' }), []);
  const toggleDarkMode = useCallback(() => dispatchConfig({ type: 'TOGGLE_DARK' }), []);
  const toggleSidebarPin = useCallback(() => dispatchState({ type: 'TOGGLE_SIDEBAR_PIN' }), []);
  const toggleSearchBar = useCallback(() => dispatchState({ type: 'TOGGLE_SEARCH_BAR' }), []);
  const toggleRightMenu = useCallback(() => dispatchState({ type: 'TOGGLE_RIGHT_MENU' }), []);
  const toggleConfigSidebar = useCallback(
    () => dispatchState({ type: 'TOGGLE_CONFIG_SIDEBAR' }),
    [],
  );

  const setLayoutConfig = useCallback(
    (partial: Partial<LayoutConfig>) => dispatchConfig({ type: 'SET_CONFIG', payload: partial }),
    [],
  );

  const setLayoutState = useCallback(
    (partial: Partial<LayoutState>) => dispatchState({ type: 'SET_STATE', payload: partial }),
    [],
  );

  const changeMenuMode = useCallback(
    (mode: string) => {
      dispatchConfig({ type: 'SET_CONFIG', payload: { menuMode: mode } });
      dispatchState({ type: 'CHANGE_MENU_MODE', mode });
    },
    [],
  );

  const value: LayoutContextValue = useMemo(
    () => ({
      layoutConfig,
      layoutState,
      dispatchConfig,
      dispatchState,
      isSlim,
      isHorizontal,
      isOverlay,
      isCompact,
      isStatic,
      isReveal,
      isDrawer,
      isRail,
      isSidebarPinned,
      isDarkTheme,
      hasOverlaySubmenu,
      toggleMenu,
      toggleDarkMode,
      toggleSidebarPin,
      toggleSearchBar,
      toggleRightMenu,
      toggleConfigSidebar,
      setLayoutConfig,
      setLayoutState,
      changeMenuMode,
      isDesktop,
    }),
    [
      layoutConfig,
      layoutState,
      isSlim,
      isHorizontal,
      isOverlay,
      isCompact,
      isStatic,
      isReveal,
      isDrawer,
      isRail,
      isSidebarPinned,
      isDarkTheme,
      hasOverlaySubmenu,
      toggleMenu,
      toggleDarkMode,
      toggleSidebarPin,
      toggleSearchBar,
      toggleRightMenu,
      toggleConfigSidebar,
      setLayoutConfig,
      setLayoutState,
      changeMenuMode,
      isDesktop,
    ],
  );

  return value;
}

export function useLayout(): LayoutContextValue {
  const ctx = useContext(LayoutContext);
  if (!ctx) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return ctx;
}
