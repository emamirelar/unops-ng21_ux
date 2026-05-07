import { Routes } from '@angular/router';
import { authGuard, routePermissionGuard } from '@core/guards';
import { OpportunityListComponent } from '@partnerships/opportunities/components/opportunity/list/opportunity-list.component';
import { OpportunityViewComponent } from '@partnerships/opportunities/components/opportunity/view/opportunity-view.component';

export const OPPORTUNITIES_ROUTES: Routes = [
  {
    path: '',
    component: OpportunityListComponent,
    canActivate: [authGuard, routePermissionGuard],
  },
  {
    path: ':recordId',
    component: OpportunityViewComponent,
    canActivate: [authGuard, routePermissionGuard]
    // Note: runGuardsAndResolvers removed - don't re-run guards on section changes
  },
  {
    path: ':recordId/:section',
    component: OpportunityViewComponent,
    canActivate: [authGuard, routePermissionGuard]
    // Note: runGuardsAndResolvers removed - don't re-run guards on section changes
  },
];
