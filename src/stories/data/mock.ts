import { MenuItem, TreeNode } from 'primeng/api';

export interface MockProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    status: string;
    rating: number;
    image: string;
}

export interface MockUser {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
    status: string;
    date: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
    { id: 1, name: 'Cloud Storage', category: 'Infrastructure', price: 65, status: 'Active', rating: 5, image: 'demo/images/avatar/amyelsner.png' },
    { id: 2, name: 'API Gateway', category: 'Networking', price: 120, status: 'Active', rating: 4, image: 'demo/images/avatar/annafali.png' },
    { id: 3, name: 'Data Pipeline', category: 'Analytics', price: 89, status: 'Draft', rating: 3, image: 'demo/images/avatar/asiyajavayant.png' },
    { id: 4, name: 'Auth Service', category: 'Security', price: 45, status: 'Archived', rating: 4, image: 'demo/images/avatar/bernardodominic.png' },
    { id: 5, name: 'CDN Edge', category: 'Networking', price: 200, status: 'Active', rating: 5, image: 'demo/images/avatar/amyelsner.png' },
    { id: 6, name: 'Monitoring Suite', category: 'DevOps', price: 150, status: 'Active', rating: 4, image: 'demo/images/avatar/annafali.png' },
    { id: 7, name: 'Message Queue', category: 'Infrastructure', price: 75, status: 'Draft', rating: 3, image: 'demo/images/avatar/asiyajavayant.png' },
    { id: 8, name: 'Search Index', category: 'Analytics', price: 110, status: 'Active', rating: 5, image: 'demo/images/avatar/bernardodominic.png' }
];

export const MOCK_USERS: MockUser[] = [
    { id: 1, name: 'Amy Elsner', email: 'amy@example.com', role: 'Admin', avatar: 'demo/images/avatar/amyelsner.png', status: 'Active', date: 'Apr 21, 2026' },
    { id: 2, name: 'Anna Fali', email: 'anna@example.com', role: 'Editor', avatar: 'demo/images/avatar/annafali.png', status: 'Active', date: 'Apr 20, 2026' },
    { id: 3, name: 'Asiya Javayant', email: 'asiya@example.com', role: 'Viewer', avatar: 'demo/images/avatar/asiyajavayant.png', status: 'Inactive', date: 'Apr 19, 2026' },
    { id: 4, name: 'Bernardo Dominic', email: 'bernardo@example.com', role: 'Editor', avatar: 'demo/images/avatar/bernardodominic.png', status: 'Active', date: 'Apr 18, 2026' },
    { id: 5, name: 'Elwin Sharvill', email: 'elwin@example.com', role: 'Admin', avatar: 'demo/images/avatar/amyelsner.png', status: 'Active', date: 'Apr 17, 2026' }
];

export const MOCK_MENU_ITEMS: MenuItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home' },
    { label: 'Projects', icon: 'pi pi-briefcase', items: [{ label: 'Active', icon: 'pi pi-check' }, { label: 'Archived', icon: 'pi pi-inbox' }] },
    { label: 'Team', icon: 'pi pi-users' },
    { separator: true },
    { label: 'Settings', icon: 'pi pi-cog' }
];

export const MOCK_BREADCRUMB_ITEMS: MenuItem[] = [
    { label: 'Home', icon: 'pi pi-home', routerLink: '/' },
    { label: 'Projects' },
    { label: 'Details' }
];

export const MOCK_TREE_NODES: TreeNode[] = [
    {
        key: '0',
        label: 'Documents',
        icon: 'pi pi-folder',
        children: [
            { key: '0-0', label: 'Reports', icon: 'pi pi-file', data: 'Reports folder' },
            { key: '0-1', label: 'Templates', icon: 'pi pi-file', data: 'Templates folder' }
        ]
    },
    {
        key: '1',
        label: 'Media',
        icon: 'pi pi-folder',
        children: [{ key: '1-0', label: 'Images', icon: 'pi pi-image' }]
    }
];

export const SEVERITY_OPTIONS = ['primary', 'secondary', 'success', 'info', 'warn', 'help', 'danger', 'contrast'] as const;
export type Severity = (typeof SEVERITY_OPTIONS)[number];

export const STATUS_MAP: Record<string, Severity> = {
    Active: 'success',
    Draft: 'warn',
    Archived: 'secondary',
    Inactive: 'danger'
};

export const MOCK_SELECT_OPTIONS = [
    { label: 'Option A', value: 'a' },
    { label: 'Option B', value: 'b' },
    { label: 'Option C', value: 'c' },
    { label: 'Option D', value: 'd' }
];

export const MOCK_AUTOCOMPLETE_ITEMS = ['Angular', 'React', 'Vue', 'Svelte', 'Next.js', 'Nuxt', 'Remix', 'Astro', 'SolidJS', 'Qwik'];

export const MOCK_TAB_PANELS = [
    { header: 'Overview', content: 'Overview content goes here.' },
    { header: 'Details', content: 'Detailed information is shown in this tab.' },
    { header: 'Activity', content: 'Activity log for recent actions.' }
];

export const MOCK_TIMELINE_EVENTS = [
    { status: 'Created', date: 'Apr 10, 2026', icon: 'pi pi-plus', color: '#0092d1', detail: 'Record was created.' },
    { status: 'In Review', date: 'Apr 14, 2026', icon: 'pi pi-search', color: '#e85c0e', detail: 'Submitted for review.' },
    { status: 'Approved', date: 'Apr 18, 2026', icon: 'pi pi-check', color: '#4c9f38', detail: 'Approved by manager.' },
    { status: 'Published', date: 'Apr 21, 2026', icon: 'pi pi-send', color: '#00a997', detail: 'Published to production.' }
];
