import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import clsx from 'clsx';
import { useLayout } from '../../hooks/useLayout';
import { Breadcrumb } from './Breadcrumb';

export interface TopbarProps {
  mobileLogo?: { dark: string; light: string; alt: string };
}

export function Topbar({ mobileLogo }: TopbarProps) {
  const {
    isDarkTheme,
    isSidebarPinned,
    toggleMenu,
    toggleSidebarPin,
    toggleDarkMode,
  } = useLayout();

  const [searchActive, setSearchActive] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedNotificationBar, setSelectedNotificationBar] = useState('inbox');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const profileRef = useRef<HTMLLIElement>(null);

  const mobileLogoSrc = useMemo(() => {
    if (!mobileLogo) return undefined;
    return isDarkTheme ? mobileLogo.dark : mobileLogo.light;
  }, [isDarkTheme, mobileLogo]);

  const desktopLogoSrc = mobileLogoSrc;

  const openSearch = useCallback(() => {
    setSearchActive(true);
    requestAnimationFrame(() => searchInputRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => setSearchActive(false), []);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [profileMenuOpen]);

  const notificationsBars = [
    { id: 'inbox', label: 'Inbox', badge: '2' },
    { id: 'general', label: 'General' },
    { id: 'archived', label: 'Archived' },
  ];

  const notificationsData: Record<string, Array<{
    image: string;
    name: string;
    description: string;
    time: string;
    new: boolean;
  }>> = {
    inbox: [
      { image: 'demo/images/avatar/avatar-square-m-2.jpg', name: 'Michael Lee', description: 'You have a new message from the support team regarding your recent inquiry.', time: '1 hour ago', new: true },
      { image: 'demo/images/avatar/avatar-square-f-1.jpg', name: 'Alice Johnson', description: 'Your report has been successfully submitted and is under review.', time: '10 minutes ago', new: true },
      { image: 'demo/images/avatar/avatar-square-f-2.jpg', name: 'Emily Davis', description: 'The project deadline has been updated to September 30th.', time: 'Yesterday at 4:35 PM', new: false },
    ],
    general: [
      { image: 'demo/images/avatar/avatar-square-f-1.jpg', name: 'Alice Johnson', description: 'Reminder: Your subscription is about to expire in 3 days.', time: '30 minutes ago', new: true },
      { image: 'demo/images/avatar/avatar-square-m-2.jpg', name: 'Michael Lee', description: 'The server maintenance has been completed successfully.', time: 'Yesterday at 2:15 PM', new: false },
    ],
    archived: [
      { image: 'demo/images/avatar/avatar-square-m-1.jpg', name: 'Lucas Brown', description: 'Your appointment with Dr. Anderson has been confirmed.', time: '1 week ago', new: true },
      { image: 'demo/images/avatar/avatar-square-f-2.jpg', name: 'Emily Davis', description: 'The document you uploaded has been archived.', time: '2 weeks ago', new: false },
    ],
  };

  const languages = [
    { code: 'en', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
    { code: 'fr', label: 'French', flag: '\u{1F1EB}\u{1F1F7}' },
    { code: 'es', label: 'Spanish', flag: '\u{1F1EA}\u{1F1F8}' },
  ];

  const selectedNotifications = notificationsData[selectedNotificationBar] ?? [];

  return (
    <div className="layout-topbar">
      <button
        type="button"
        className="mobile-menu-button"
        aria-label="Toggle navigation menu"
        onClick={toggleMenu}
      >
        <i className="pi pi-bars" />
      </button>

      <div className="topbar-left">
        <button
          type="button"
          className={clsx('topbar-menu-toggle', { active: isSidebarPinned })}
          aria-label={isSidebarPinned ? 'Collapse sidebar' : 'Expand sidebar'}
          onClick={toggleSidebarPin}
        >
          <i className="pi pi-bars" />
        </button>

        {desktopLogoSrc && (
          <a className="topbar-logo" href="/">
            <img src={desktopLogoSrc} alt={mobileLogo?.alt ?? 'Logo'} />
          </a>
        )}

        <span className="topbar-logo-separator" />
        <Breadcrumb />

        {searchActive && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="relative w-48 sm:w-80">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-color" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                aria-label="Search"
                className="w-full py-2 pl-9 pr-3 text-sm rounded-md border border-surface bg-transparent"
                onKeyDown={(e) => e.key === 'Escape' && closeSearch()}
              />
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-8 h-8 rounded-md cursor-pointer hover:bg-emphasis transition-colors"
              aria-label="Close search"
              onClick={closeSearch}
            >
              <i className="pi pi-times text-sm" />
            </button>
          </div>
        )}
      </div>

      {mobileLogoSrc && (
        <a className="mobile-logo" href="/">
          <img src={mobileLogoSrc} alt={mobileLogo?.alt ?? 'Logo'} />
        </a>
      )}

      <div className="topbar-right">
        <ul className="topbar-menu">
          <li className={clsx('right-sidebar-item', { hidden: searchActive })}>
            <a
              className="right-sidebar-button"
              aria-label="Open search"
              onClick={openSearch}
            >
              <i className="pi pi-search" />
            </a>
          </li>

          <li className={clsx('right-sidebar-item', { hidden: searchActive })}>
            <a
              className="right-sidebar-button"
              aria-label={isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleDarkMode}
            >
              <i className={isDarkTheme ? 'pi pi-sun' : 'pi pi-moon'} />
            </a>
          </li>

          {/* Notifications */}
          <NotificationsDropdown
            bars={notificationsBars}
            selectedBar={selectedNotificationBar}
            onSelectBar={setSelectedNotificationBar}
            notifications={selectedNotifications}
          />

          {/* Language */}
          <LanguageDropdown
            languages={languages}
            selected={selectedLanguage}
            onSelect={setSelectedLanguage}
          />

          {/* Profile */}
          <li className="profile-item static sm:relative" ref={profileRef}>
            <a
              className="right-sidebar-button relative z-50"
              aria-label="User profile menu"
              onClick={(e) => {
                e.stopPropagation();
                setProfileMenuOpen((o) => !o);
              }}
            >
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-200 dark:bg-surface-700">
                <i className="pi pi-user" />
              </span>
            </a>
            <div
              className={clsx(
                'list-none p-2 m-0 rounded-2xl border border-surface overflow-hidden fixed sm:absolute bg-surface-0 dark:bg-surface-900 origin-top w-52 mt-2 right-4 sm:right-0 z-[999] top-auto shadow-[0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]',
                { hidden: !profileMenuOpen, 'animate-scalein': profileMenuOpen },
              )}
            >
              <ul className="flex flex-col gap-1">
                {[
                  { icon: 'pi pi-user', label: 'Profile' },
                  { icon: 'pi pi-cog', label: 'Settings' },
                  { icon: 'pi pi-calendar', label: 'Calendar' },
                  { icon: 'pi pi-inbox', label: 'Inbox' },
                ].map((item) => (
                  <li key={item.label}>
                    <a
                      className="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      <i className={item.icon} />
                      <span>{item.label}</span>
                    </a>
                  </li>
                ))}
                <li className="border-t border-surface mt-1 pt-1">
                  <a
                    className="label-small dark:text-surface-400 flex gap-2 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <i className="pi pi-power-off" />
                    <span>Log out</span>
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

function NotificationsDropdown({
  bars,
  selectedBar,
  onSelectBar,
  notifications,
}: {
  bars: { id: string; label: string; badge?: string }[];
  selectedBar: string;
  onSelectBar: (id: string) => void;
  notifications: Array<{
    image: string;
    name: string;
    description: string;
    time: string;
    new: boolean;
  }>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <li className="right-sidebar-item static sm:relative z-50" ref={ref}>
      <a
        className="right-sidebar-button"
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2.5" />
        <i className="pi pi-bell" />
      </a>
      <div
        className={clsx(
          'list-none m-0 rounded-2xl border border-surface fixed sm:absolute bg-surface-0 dark:bg-surface-900 overflow-hidden origin-top w-[calc(100vw-2rem)] sm:w-88 mt-2 z-50 top-auto left-4 sm:left-auto sm:right-0 shadow-[0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]',
          { hidden: !open },
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-surface">
          <span className="label-small text-surface-950 dark:text-surface-0">Notifications</span>
          <button className="py-1 px-2 text-surface-950 dark:text-surface-0 label-x-small hover:bg-emphasis border border-surface rounded-lg shadow-[0px_1px_2px_0px_rgba(18,18,23,0.05)] transition-all">
            Mark all as read
          </button>
        </div>
        <div className="flex items-center border-b border-surface">
          {bars.map((bar) => (
            <button
              key={bar.id}
              className={clsx(
                'px-3.5 py-2 inline-flex items-center border-b gap-2',
                selectedBar === bar.id
                  ? 'border-surface-950 dark:border-surface-0'
                  : 'border-transparent',
              )}
              onClick={() => onSelectBar(bar.id)}
            >
              <span
                className={clsx(
                  'label-small',
                  selectedBar === bar.id && 'text-surface-950 dark:text-surface-0',
                )}
              >
                {bar.label}
              </span>
              {bar.badge && (
                <span className="inline-flex items-center justify-center rounded-md bg-green-500 text-white text-xs px-1.5 py-0.5 min-w-[1.25rem]">
                  {bar.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <ul className="flex flex-col divide-y divide-[var(--surface-border)] max-h-80 overflow-auto">
          {notifications.map((item) => (
            <li key={item.name + item.time}>
              <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5 cursor-pointer hover:bg-emphasis transition-all">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex flex-col">
                  <span className="label-small text-left text-surface-950 dark:text-surface-0">
                    {item.name}
                  </span>
                  <span className="label-xsmall text-left line-clamp-1">
                    {item.description}
                  </span>
                  <span className="label-xsmall text-left">{item.time}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function LanguageDropdown({
  languages,
  selected,
  onSelect,
}: {
  languages: { code: string; label: string; flag: string }[];
  selected: string;
  onSelect: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [open]);

  return (
    <li className="right-sidebar-item static sm:relative" ref={ref}>
      <a
        className="right-sidebar-button"
        aria-label="Change language"
        onClick={() => setOpen((o) => !o)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m5 8 6 6" />
          <path d="m4 14 6-6 2-3" />
          <path d="M2 5h12" />
          <path d="M7 2h1" />
          <path d="m22 22-5-10-5 10" />
          <path d="M14 18h6" />
        </svg>
      </a>
      <div
        className={clsx(
          'list-none p-2 m-0 rounded-2xl border border-surface overflow-hidden fixed sm:absolute bg-surface-0 dark:bg-surface-900 origin-top w-44 mt-2 right-4 sm:right-0 z-[999] top-auto shadow-[0px_9px_9px_0px_rgba(0,0,0,0.03),0px_2px_5px_0px_rgba(0,0,0,0.04)]',
          { hidden: !open },
        )}
      >
        <ul className="flex flex-col gap-1">
          {languages.map((lang) => (
            <li key={lang.code}>
              <a
                className={clsx(
                  'label-small dark:text-surface-400 flex gap-2.5 py-2 px-2.5 rounded-lg items-center hover:bg-emphasis transition-colors duration-150 cursor-pointer',
                  selected === lang.code && 'text-surface-950 dark:text-surface-0 font-semibold',
                )}
                onClick={() => {
                  onSelect(lang.code);
                  setOpen(false);
                }}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}
