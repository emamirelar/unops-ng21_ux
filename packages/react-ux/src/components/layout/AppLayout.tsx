import { type ReactNode, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { useLayout } from '../../hooks/useLayout';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';
import { Breadcrumb } from './Breadcrumb';
import { Footer } from './Footer';
import { Configurator } from './Configurator';
import { Search } from './Search';
import { RightMenu } from './RightMenu';
import type { BreadcrumbItem } from '../../types';

export interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const {
    layoutConfig,
    layoutState,
    isOverlay,
    isStatic,
    isSlim,
    isHorizontal,
    isCompact,
    isReveal,
    isDrawer,
    isRail,
  } = useLayout();

  useEffect(() => {
    if (layoutState.mobileMenuActive) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.classList.remove('blocked-scroll');
    }
    return () => {
      document.body.classList.remove('blocked-scroll');
    };
  }, [layoutState.mobileMenuActive]);

  const containerClass = useMemo(
    () =>
      clsx('layout-wrapper', {
        'layout-overlay': isOverlay,
        'layout-static': isStatic,
        'layout-slim': isSlim,
        'layout-horizontal': isHorizontal,
        'layout-compact': isCompact,
        'layout-reveal': isReveal,
        'layout-drawer': isDrawer,
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.mobileMenuActive,
        'layout-sidebar-expanded': layoutState.sidebarExpanded,
        'layout-sidebar-rail': isRail,
        'layout-sidebar-anchored': layoutState.anchored,
        [`layout-card-${layoutConfig.cardStyle}`]: true,
        [`layout-sidebar-${layoutConfig.menuTheme}`]: true,
      }),
    [
      isOverlay,
      isStatic,
      isSlim,
      isHorizontal,
      isCompact,
      isReveal,
      isDrawer,
      layoutState.overlayMenuActive,
      layoutState.mobileMenuActive,
      layoutState.sidebarExpanded,
      isRail,
      layoutState.anchored,
      layoutConfig.cardStyle,
      layoutConfig.menuTheme,
    ],
  );

  return (
    <div className={containerClass}>
      <Topbar />
      <div className="layout-body">
        <Sidebar />
        <div className="layout-content-wrapper">
          <div className="layout-content-wrapper-inside">
            <main className="layout-content">
              <Breadcrumb items={breadcrumbs} />
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
      <Configurator />
      <Search />
      <RightMenu />
      <div className="layout-mask" />
    </div>
  );
}
