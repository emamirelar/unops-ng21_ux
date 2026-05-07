/**
 * @fileoverview Offices feature routes.
 * @author UNOPS Opportunity+ System Development Team
 */

import { Routes } from '@angular/router';
import { OfficeListComponent } from './components/office-list/office-list.component';
import { OfficeDetailComponent } from './components/office-detail/office-detail.component';

export const OFFICES_ROUTES: Routes = [
  {
    path: '',
    component: OfficeListComponent,
    data: { breadcrumb: 'Offices' }
  },
  {
    path: ':id',
    component: OfficeDetailComponent,
    data: { breadcrumb: 'Office Detail' }
  }
];
