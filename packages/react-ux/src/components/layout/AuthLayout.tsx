import { type ReactNode } from 'react';
import { useLayout } from '../../hooks/useLayout';
import { Configurator } from './Configurator';

export interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { toggleConfigSidebar } = useLayout();

  return (
    <>
      <main>{children}</main>
      <button
        className="layout-config-button config-link"
        onClick={toggleConfigSidebar}
      >
        <i className="pi pi-cog" />
      </button>
      <Configurator location="landing" />
    </>
  );
}
