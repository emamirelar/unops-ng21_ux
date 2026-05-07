import { Routes } from '@angular/router';

export const PARTNERS_V2_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/partners-v2/partners-v2.component').then(m => m.PartnersV2Component),
    data: { breadcrumb: 'List' }
  },
  {
    path: ':recordId',
    loadComponent: () =>
      import('./components/partner-detail-v2/partner-detail-v2.component').then(m => m.PartnerDetailV2Component),
    data: { breadcrumb: 'Detail' }
  }
];
