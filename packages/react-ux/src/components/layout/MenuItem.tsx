import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { useLayout } from '../../hooks/useLayout';
import { useMenu } from '../../hooks/useMenu';
import type { MenuItem } from '../../types';

interface MenuItemComponentProps {
  item: MenuItem;
  root: boolean;
  parentPath: string | null;
  preventAutoActivate?: boolean;
}

export function MenuItemComponent({
  item,
  root,
  parentPath,
  preventAutoActivate = false,
}: MenuItemComponentProps) {
  const {
    layoutState,
    layoutConfig,
    setLayoutState,
    hasOverlaySubmenu,
    isDesktop,
    isCompact,
    isRail,
  } = useLayout();

  const { currentPath, onNavigate } = useMenu();

  const isVisible = item.visible !== false;
  const hasChildren = !!item.items && item.items.length > 0;
  const hasRouterLink = !!item.to;
  const isDisabled = !!item.disabled;

  const isRailCollapsed = isRail && !layoutState.sidebarExpanded;

  const fullPath = useMemo(() => {
    const itemPath = item.path;
    if (!itemPath) return parentPath;
    if (parentPath && !itemPath.startsWith(parentPath)) {
      return parentPath + itemPath;
    }
    return itemPath;
  }, [item.path, parentPath]);

  const isActive = useMemo(() => {
    if (item.path && layoutState.activePath) {
      return layoutState.activePath.startsWith(fullPath ?? '');
    }
    return false;
  }, [item.path, layoutState.activePath, fullPath]);

  const isRouteWithin = useMemo(() => {
    if (!root || !hasChildren) return false;
    return hasMatchingChildRoute(item, currentPath);
  }, [root, hasChildren, item, currentPath]);

  const itemClick = useCallback(
    (event: React.MouseEvent) => {
      if (isDisabled) {
        event.preventDefault();
        return;
      }

      if (item.command) {
        item.command({ originalEvent: event.nativeEvent, item });
      }

      if (hasChildren) {
        if (isActive) {
          const deactivateHover = root && hasOverlaySubmenu && isDesktop();
          setLayoutState({
            activePath: parentPath,
            ...(deactivateHover ? { menuHoverActive: false } : {}),
          });
        } else {
          setLayoutState({ activePath: fullPath, menuHoverActive: true });
        }
      } else {
        if (item.to && onNavigate) {
          onNavigate(item.to);
        }
        setLayoutState({
          overlayMenuActive: false,
          mobileMenuActive: false,
          menuHoverActive: false,
        });
        if (hasOverlaySubmenu && isDesktop()) {
          setLayoutState({ activePath: null });
        }
      }

      if (isDesktop() && isRail && !layoutState.sidebarExpanded) {
        setLayoutState({ sidebarPinned: true, sidebarExpanded: false });
      }
    },
    [
      isDisabled,
      item,
      hasChildren,
      isActive,
      root,
      hasOverlaySubmenu,
      isDesktop,
      parentPath,
      fullPath,
      setLayoutState,
      onNavigate,
      isRail,
      layoutState.sidebarExpanded,
    ],
  );

  const onMouseEnter = useCallback(() => {
    if (
      isDesktop() &&
      root &&
      hasChildren &&
      layoutState.menuHoverActive &&
      !isActive
    ) {
      setLayoutState({ activePath: fullPath, menuHoverActive: true });
    }
  }, [isDesktop, root, hasChildren, layoutState.menuHoverActive, isActive, fullPath, setLayoutState]);

  if (!isVisible) return null;

  const isActiveRoute = item.to ? currentPath === item.to : false;

  const linkClassName = clsx(item.className, {
    'active-route': isActiveRoute,
  });

  const renderLink = () => {
    if (hasRouterLink && !hasChildren) {
      return (
        <a
          href={item.to}
          className={linkClassName}
          onClick={itemClick}
          onMouseEnter={onMouseEnter}
          tabIndex={0}
        >
          {item.icon && <i className={clsx(item.icon, 'layout-menuitem-icon')} />}
          <span className="layout-menuitem-text label-small text-inherit">
            {item.label}
          </span>
          {hasChildren && (
            <i className="pi pi-fw pi-angle-down layout-submenu-toggler" />
          )}
        </a>
      );
    }

    return (
      <a
        href={item.url}
        className={linkClassName}
        target={item.target}
        onClick={itemClick}
        onMouseEnter={onMouseEnter}
        tabIndex={0}
      >
        {item.icon && <i className={clsx(item.icon, 'layout-menuitem-icon')} />}
        <span className="layout-menuitem-text label-small text-inherit">
          {item.label}
        </span>
        {hasChildren && (
          <i className="pi pi-fw pi-angle-down layout-submenu-toggler" />
        )}
      </a>
    );
  };

  return (
    <li
      className={clsx(item.badgeClass, {
        'active-menuitem': isActive,
        'layout-root-menuitem': root,
        'route-active-within': isRouteWithin,
      })}
    >
      {root && isVisible && hasChildren && (
        <div className="layout-menuitem-root-text">{item.label}</div>
      )}
      {((!hasRouterLink || hasChildren) && isVisible) || (hasRouterLink && !hasChildren && isVisible)
        ? renderLink()
        : null}
      {hasChildren && isVisible && (
        <ul className={clsx({ 'layout-root-submenulist': root })}>
          {item.items!.map((child, idx) => (
            <MenuItemComponent
              key={child.label ?? idx}
              item={child}
              root={false}
              parentPath={fullPath}
              preventAutoActivate={preventAutoActivate || !!item.preventAutoActivate}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

function hasMatchingChildRoute(
  item: MenuItem | null | undefined,
  currentPath: string,
): boolean {
  if (!item) return false;
  if (item.to) return currentPath === item.to;
  return item.items?.some((child) => hasMatchingChildRoute(child, currentPath)) ?? false;
}
