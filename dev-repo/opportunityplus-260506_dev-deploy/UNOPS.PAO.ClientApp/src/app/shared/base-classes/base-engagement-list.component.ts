import { 
  ChangeDetectionStrategy, 
  Component, 
  inject, 
  Input, 
  OnInit, 
  signal 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG Modules
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

// Services and Models
import { BaseEngagementService } from '@shared/services/api/base-engagement.service';
import { BaseEngagement, StageSeverity } from '@shared/models/base-engagement.model';

@Component({
  selector: 'app-base-engagement-list',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    TagModule,
    TooltipModule,
    SkeletonModule
  ],
  template: `
    <div class="base-engagement-list">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-600">{{ engagements().length }} total</span>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading()" class="space-y-4">
        <div class="bg-white border border-gray-200 rounded-lg p-4" *ngFor="let item of [1,2,3,4,5]">
          <p-skeleton [height]="'1.5rem'" class="mb-2"></p-skeleton>
          <p-skeleton
            [height]="'1rem'"
            [width]="'60%'"
            class="mb-2"
          ></p-skeleton>
          <p-skeleton
            [height]="'1rem'"
            [width]="'80%'"
          ></p-skeleton>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading() && engagements().length === 0" class="text-center py-8">
        <div class="flex flex-col items-center gap-2">
          <i class="pi pi-inbox text-4xl text-gray-400"></i>
          <span class="text-gray-600">No engagements found</span>
        </div>
      </div>

      <!-- Cards List -->
      <div *ngIf="!loading() && engagements().length > 0" class="space-y-4">
        <div 
          *ngFor="let engagement of engagements()" 
          class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
          (click)="onView(engagement)">
          
          <!-- Engagement Title and Status -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1 min-w-0 mr-4">
              <h3 class="font-medium text-sm truncate text-gray-950" 
                  [title]="engagement.displayName">
                {{ engagement.displayName }}
              </h3>
              <p class="text-[0.625rem] text-gray-600 truncate" 
                 [title]="engagement.engagementNumber">
                {{ engagement.engagementNumber }}
              </p>
            </div>
            <p-tag 
              [value]="engagement.stageDisplay" 
              [severity]="getStageSeverity(engagement.engagementStage)"
              class="text-[0.625rem]">
            </p-tag>
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-2 text-[0.625rem]">
            <!-- Duration -->
            <div class="flex items-center min-w-0">
              <i class="pi pi-clock text-gray-400 mr-2 text-[0.625rem]"></i>
              <span class="text-gray-950 truncate" 
                    [title]="engagement.durationDisplay">
                {{ engagement.durationDisplay }}
              </span>
            </div>

            <!-- Budget -->
            <div class="flex items-center min-w-0">
              <i class="pi pi-dollar text-gray-400 mr-2 text-[0.625rem]"></i>
              <span class="text-gray-950 truncate" 
                    [title]="engagement.budgetDisplay">
                {{ engagement.budgetDisplay }}
              </span>
            </div>

            <!-- Countries -->
            <div class="flex items-center min-w-0 col-span-2">
              <i class="pi pi-map-marker text-gray-400 mr-2 text-[0.625rem]"></i>
              <span class="text-gray-950 truncate" 
                    [title]="getCountriesDisplay(engagement)">
                {{ getCountriesDisplay(engagement) }}
              </span>
            </div>
          </div>

          <!-- View Action Indicator -->
          <div class="flex justify-end mt-2">
            <i class="pi pi-angle-right text-gray-400 text-[0.625rem]"></i>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .base-engagement-list {
      @apply max-w-full;
    }
    
    .truncate {
      @apply overflow-hidden whitespace-nowrap;
      text-overflow: ellipsis;
    }
    
    p-tag {
      @apply flex-shrink-0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BaseEngagementListComponent implements OnInit {
  @Input() partnerId?: number; // Optional: filter by partner
  
  // Signals for reactive state
  engagements = signal<BaseEngagement[]>([]);
  loading = signal<boolean>(false);

  // Services
  private baseEngagementService = inject(BaseEngagementService);
  private router = inject(Router);

  ngOnInit() {
    this.loadEngagements();
  }

  async loadEngagements() {
    this.loading.set(true);
    try {
      let engagements: BaseEngagement[];
      
      if (this.partnerId) {
        engagements = await this.baseEngagementService.getBaseEngagementsByPartnerId(this.partnerId).toPromise() || [];
      } else {
        engagements = await this.baseEngagementService.getBaseEngagements().toPromise() || [];
      }
      
      this.engagements.set(engagements);
    } catch (error) {
      console.error('Error loading engagements:', error);
      this.engagements.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  onView(engagement: BaseEngagement) {
    this.router.navigate(['/base-engagements', engagement.id]);
  }

  getStageSeverity(stage?: string): StageSeverity {
    return this.baseEngagementService.getStageSeverity(stage || '');
  }

  getCountriesDisplay(engagement: BaseEngagement): string {
    if (engagement.implementationCountriesList) {
      return engagement.implementationCountriesList;
    }
    return 'No countries specified';
  }
}
