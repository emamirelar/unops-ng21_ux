import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { AccordionModule } from 'primeng/accordion';
import { CachedDataService } from '@shared/services/utils';
import { PartnerCategoryGroup, PartnerGroup } from '../../models/partner-category-group.model';

@Component({
  selector: 'app-partner-tree-page',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    AccordionModule
  ],
  template: `
    <div class="unops-partner-tree-accordion-host flex flex-col gap-6">
      <!-- Header -->
      <div class="flex flex-col gap-2">
        <h1 class="font-sans text-2xl font-bold text-gray-950">
          {{ 'title.partnerTree' | translate }}
        </h1>
        <p class="font-sans text-sm text-gray-600">
          {{ 'description.partnerTree' | translate }}
        </p>
      </div>

      <!-- Accordion controls -->
      <div class="flex flex-wrap gap-2 mb-6">
        <p-button icon="pi pi-plus" [label]="'button.expandAll' | translate" (click)="expandAll()" />
        <p-button icon="pi pi-minus" [label]="'button.collapseAll' | translate" (click)="collapseAll()" />
      </div>

      <!-- Partner Tree Accordion -->
      <p-accordion
        class="w-full"
        [multiple]="true"
        [value]="expandedCategoryIds()"
        (valueChange)="onAccordionValueChange($event)">
        @for (category of partnerCategories(); track category.partnerCategoryId) {
          <p-accordion-panel [value]="category.partnerCategoryId">
            <p-accordion-header>
              <div class="flex items-center justify-between w-full">
                <span class="font-semibold">{{ category.partnerCategoryName }}</span>
                <button
                  type="button"
                  class="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                  (click)="navigateToCategory(category); $event.stopPropagation()"
                  [title]="'tooltip.viewCategoryDetails' | translate">
                  <i class="pi pi-external-link text-xs"></i>
                </button>
              </div>
            </p-accordion-header>
            <p-accordion-content>
              <div class="flex flex-col gap-2">
                @for (group of category.children; track group.partnerGroupId) {
                  <div
                    class="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    (click)="navigateToGroup(group)">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-tag text-blue-500"></i>
                      <span class="font-medium">{{ group.partnerGroupName }}</span>
                    </div>
                  </div>
                }
                @if (!category.children || category.children.length === 0) {
                  <div class="p-3 text-gray-500 text-center font-sans text-sm">
                    {{ 'message.noPartnerGroups' | translate }}
                  </div>
                }
              </div>
            </p-accordion-content>
          </p-accordion-panel>
        }
      </p-accordion>
    </div>
  `,
})
export class PartnerTreePageComponent implements OnInit {
  private router = inject(Router);
  private cachedDataService = inject(CachedDataService);

  partnerCategories = signal<PartnerCategoryGroup[]>([]);
  /** Expanded panel values (partner category ids) when [multiple]="true". */
  expandedCategoryIds = signal<number[]>([]);

  constructor() {
    // Watch for changes in partner category groups data
    effect(() => {
      const data = this.cachedDataService.partnerCategoryGroups();
      if (data && data.length > 0) {
        this.partnerCategories.set(data);
      }
    });
  }

  ngOnInit() {
    this.loadPartnerTreeData();
  }

  private loadPartnerTreeData() {
    const partnerCategoryGroupData = this.cachedDataService.partnerCategoryGroups();
    if (!partnerCategoryGroupData || partnerCategoryGroupData.length === 0) {
      // Load the data if not available - effect will handle the update
      this.cachedDataService.loadPartnerCategoryGroups();
    }
  }

  navigateToCategory(category: PartnerCategoryGroup) {
    this.router.navigate(['/admin/partner-tree', category.partnerCategoryId]);
  }

  navigateToGroup(group: PartnerGroup) {
    this.router.navigate(['/admin/partner-tree', group.partnerGroupId]);
  }

  onAccordionValueChange(value: string | number | Array<string | number> | null | undefined): void {
    if (value == null) {
      this.expandedCategoryIds.set([]);
      return;
    }
    if (Array.isArray(value)) {
      this.expandedCategoryIds.set(value.map(v => Number(v)));
      return;
    }
    this.expandedCategoryIds.set([Number(value)]);
  }

  expandAll() {
    this.expandedCategoryIds.set(this.partnerCategories().map(c => c.partnerCategoryId));
  }

  collapseAll() {
    this.expandedCategoryIds.set([]);
  }
}
