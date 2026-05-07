/**
 * @fileoverview Office detail tabs component with tabbed layout for office sections.
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { Tab, TabList, Tabs, TabPanels, TabPanel } from 'primeng/tabs';

import { OfficeRolesDoaComponent } from '../office-roles-doa/office-roles-doa.component';
import { OfficeDetailsTabComponent } from '../office-details-tab/office-details-tab.component';
import { OfficeFinancialTabComponent } from '../office-financial-tab/office-financial-tab.component';
import { OfficeScopeTabComponent } from '../office-scope-tab/office-scope-tab.component';
import { OfficeOpportunitiesTabComponent } from '../office-opportunities-tab/office-opportunities-tab.component';
import { OfficePartnersTabComponent } from '../office-partners-tab/office-partners-tab.component';
import { OfficeDocumentsTabComponent } from '../office-documents-tab/office-documents-tab.component';
import { WorkflowScopeConfigTabComponent } from '../workflow-scope-config-tab/workflow-scope-config-tab.component';
import type { OfficeDetailModel } from '../../models/office.model';

export type OfficeDetailTabId =
  | 'details'
  | 'financial'
  | 'scope'
  | 'roles-doa'
  | 'opportunities'
  | 'partners'
  | 'documents'
  | 'workflow-config';

@Component({
  selector: 'app-office-detail-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    Tab,
    TabList,
    Tabs,
    TabPanels,
    TabPanel,
    OfficeRolesDoaComponent,
    OfficeDetailsTabComponent,
    OfficeFinancialTabComponent,
    OfficeScopeTabComponent,
    OfficeOpportunitiesTabComponent,
    OfficePartnersTabComponent,
    OfficeDocumentsTabComponent,
    WorkflowScopeConfigTabComponent
  ],
  templateUrl: './office-detail-tabs.component.html',
  styleUrl: './office-detail-tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeDetailTabsComponent {
  readonly office = input.required<OfficeDetailModel>();
  readonly opportunitiesCount = input<number>(0);
  readonly partnersCount = input<number>(0);
  readonly officeRefreshed = output<OfficeDetailModel>();

  readonly activeTab = signal<OfficeDetailTabId>('details');


  onTabChange(value: string | number | undefined): void {
    if (value === undefined) {
      return;
    }
    this.activeTab.set(String(value) as OfficeDetailTabId);
  }
}
