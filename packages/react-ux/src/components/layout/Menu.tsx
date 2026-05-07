import { useMenu } from '../../hooks/useMenu';
import { MenuItemComponent } from './MenuItem';

export function Menu() {
  const { menuItems } = useMenu();

  return (
    <ul className="layout-menu">
      {menuItems.map((item, index) =>
        item.separator ? (
          <li key={`sep-${index}`} className="menu-separator" />
        ) : (
          <MenuItemComponent
            key={item.label ?? index}
            item={item}
            root
            parentPath={null}
          />
        ),
      )}
    </ul>
  );
}
