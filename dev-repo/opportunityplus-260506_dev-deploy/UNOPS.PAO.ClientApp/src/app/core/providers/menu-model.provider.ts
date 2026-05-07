import { Provider } from '@angular/core';
import { MENU_MODEL, MenuItem } from '@emamirelar/ux/tokens';

/**
 * Provides the static MENU_MODEL for the UX package's AppMenu component.
 * Role-based filtering (admin items) is handled at route-guard level,
 * not by hiding menu entries. All routes already have canActivate guards.
 */
export function provideMenuModel(): Provider {
  return {
    provide: MENU_MODEL,
    useValue: buildMenuModel()
  };
}

function buildMenuModel(): MenuItem[] {
  return [
    {
      label: 'Home',
      icon: 'pi pi-home',
      routerLink: ['/']
    },
    { separator: true },
    {
      label: 'Partnerships',
      icon: 'pi pi-th-large',
      items: [
        {
          label: 'Partners',
          icon: 'pi pi-globe',
          routerLink: ['/partnerships/partners']
        },
        {
          label: 'Contacts',
          icon: 'pi pi-users',
          routerLink: ['/partnerships/contacts']
        },
        {
          label: 'Interactions',
          icon: 'pi pi-comments',
          routerLink: ['/partnerships/interactions']
        },
        {
          label: 'Opportunities',
          icon: 'pi pi-briefcase',
          routerLink: ['/partnerships/opportunities']
        },
        {
          label: 'Partnership Agreements',
          icon: 'pi pi-file',
          routerLink: ['/partnerships/partnership-agreements']
        }
      ]
    },
    { separator: true },
    {
      label: 'Offices',
      icon: 'pi pi-building',
      items: [
        {
          label: 'Offices',
          icon: 'pi pi-building',
          routerLink: ['/offices']
        }
      ]
    },
    { separator: true },
    {
      label: 'AI Assistant',
      icon: 'pi pi-sparkles',
      routerLink: ['/ai']
    },
    { separator: true },
    {
      label: 'Admin',
      icon: 'pi pi-building-columns',
      items: [
        {
          label: 'Partner Tree',
          icon: 'pi pi-share-alt',
          routerLink: ['/admin/partner-tree']
        },
        {
          label: 'AI Prompts',
          icon: 'pi pi-sparkles',
          routerLink: ['/admin/ai-prompt-management']
        },
        {
          label: 'User Management',
          icon: 'pi pi-user',
          routerLink: ['/admin/user-management']
        },
        {
          label: 'Entity Manager',
          icon: 'pi pi-sitemap',
          routerLink: ['/admin/entity-manager']
        },
        {
          label: 'Translation Workbench',
          icon: 'pi pi-language',
          routerLink: ['/admin/translations']
        },
        {
          label: 'Entity Artifacts',
          icon: 'pi pi-database',
          routerLink: ['/admin/entity-artifacts']
        },
        {
          label: 'Bulk Entity Artifacts',
          icon: 'pi pi-upload',
          routerLink: ['/admin/bulk-entity-artifacts']
        }
      ]
    }
  ];
}
