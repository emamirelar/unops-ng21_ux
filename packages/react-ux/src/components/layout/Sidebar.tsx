import { useCallback, useEffect, useRef } from 'react';
import { useLayout } from '../../hooks/useLayout';
import { Menu } from './Menu';
import { Topbar } from './Topbar';

const BREAKPOINT = 992;

export function Sidebar() {
  const {
    isHorizontal,
    isRail,
    layoutState,
    setLayoutState,
    hasOverlaySubmenu,
    isDesktop,
  } = useLayout();

  const sidebarRef = useRef<HTMLElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onMouseLeave = useCallback(() => {
    if (!isDesktop() || !isRail) return;
    if (layoutState.sidebarPinned) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLayoutState({ sidebarExpanded: false });
    }, 300);
  }, [isDesktop, isRail, layoutState.sidebarPinned, setLayoutState]);

  const onMenuScroll = useCallback(() => {
    if (!menuContainerRef.current) return;
    if (isHorizontal) {
      const scrollLeft = menuContainerRef.current.scrollLeft;
      menuContainerRef.current.style.setProperty('--menu-scroll-x', `-${scrollLeft}px`);
    } else {
      const scrollTop = menuContainerRef.current.scrollTop;
      menuContainerRef.current.style.setProperty('--menu-scroll-y', `-${scrollTop}px`);
    }

    if (hasOverlaySubmenu && isDesktop()) {
      setLayoutState({ activePath: null, menuHoverActive: false });
    }
  }, [isHorizontal, hasOverlaySubmenu, isDesktop, setLayoutState]);

  useEffect(() => {
    const hasOpenOverlay =
      layoutState.overlayMenuActive ||
      (hasOverlaySubmenu && !!layoutState.activePath);
    const shouldBindOutside = isDesktop()
      ? hasOpenOverlay
      : layoutState.mobileMenuActive;

    if (!shouldBindOutside) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      const topbarButton = document.querySelector('.mobile-menu-button');
      const sidebar = sidebarRef.current;

      const isOutside = !(
        sidebar?.isSameNode(target) ||
        sidebar?.contains(target) ||
        topbarButton?.isSameNode(target) ||
        topbarButton?.contains(target)
      );

      if (isOutside) {
        if (isDesktop()) {
          setLayoutState({
            overlayMenuActive: false,
            ...(hasOverlaySubmenu ? { activePath: null, menuHoverActive: false } : {}),
          });
        } else {
          setLayoutState({ mobileMenuActive: false });
        }
      }
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [
    layoutState.overlayMenuActive,
    layoutState.activePath,
    layoutState.mobileMenuActive,
    hasOverlaySubmenu,
    isDesktop,
    setLayoutState,
  ]);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${BREAKPOINT}px)`);
    const handler = () => {
      if (hasOverlaySubmenu) {
        setLayoutState({
          activePath: isDesktop() ? null : undefined,
          menuHoverActive: false,
        });
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [hasOverlaySubmenu, isDesktop, setLayoutState]);

  return (
    <nav
      ref={sidebarRef}
      className="layout-sidebar"
      aria-label="Main navigation"
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={menuContainerRef}
        className="layout-menu-container"
        onScroll={onMenuScroll}
      >
        <Menu />
      </div>
      {isHorizontal && <Topbar />}
    </nav>
  );
}
