import type { BreadcrumbItem } from '../../types';

export interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function Breadcrumb({ items = [] }: BreadcrumbProps) {
  if (items.length === 0) return <nav className="layout-breadcrumb" aria-label="Breadcrumb" />;

  return (
    <nav className="layout-breadcrumb" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li
              key={item.url ?? item.label}
              className="text-sm font-medium text-surface-700 dark:text-surface-100"
            >
              {!isLast && item.url ? (
                <a
                  href={item.url}
                  className="text-surface-700 dark:text-surface-100 cursor-pointer"
                >
                  {item.label}
                </a>
              ) : (
                item.label
              )}
              {!isLast && (
                <li className="text-sm font-medium text-surface-400 dark:text-surface-400">
                  /
                </li>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
