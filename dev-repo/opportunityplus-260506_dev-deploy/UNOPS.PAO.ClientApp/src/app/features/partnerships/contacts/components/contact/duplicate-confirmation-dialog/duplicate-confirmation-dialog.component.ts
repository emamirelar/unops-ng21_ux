import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';

export interface DuplicateDetectionResponse {
  success: boolean;
  action: 'duplicateConfirmation' | 'created';
  message: string;
  entityType?: string; // Added to support different entity types
  duplicateInfo?: {
    totalDuplicates: number;
    highConfidence: number;
    mediumConfidence: number;
    lowConfidence: number;
    topDuplicate?: {
      entityId: number;
      score: number;
      matchReason: string;
      matchedData: any;
    };
  };
  confirmationRequired?: boolean;
  originalData?: any;
}

@Component({
  selector: 'app-duplicate-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, ButtonModule, TranslateModule, TooltipModule],
  template: `
    <div class="p-4">
      <p class="text-gray-700 mb-4 font-sans text-sm">{{ data.message }}</p>

      @if (data.duplicateInfo?.topDuplicate) {
        <div
          class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <div class="font-medium text-gray-800 mb-1">
                {{ data.duplicateInfo!.topDuplicate!.matchReason }}
              </div>
              <div class="font-sans text-xs text-gray-600">
                {{ 'DUPLICATE_DETECTION.matchScore' | translate }}:
                {{ (data.duplicateInfo!.topDuplicate!.score * 100) | number: '1.1-1' }}%
              </div>
            </div>
            <p-button
              type="button"
              icon="pi pi-external-link"
              [rounded]="true"
              [text]="true"
              severity="primary"
              (onClick)="viewRecord(data.duplicateInfo!.topDuplicate!.entityId)"
              [pTooltip]="'DUPLICATE_DETECTION.viewRecord' | translate"
              tooltipPosition="top"
              tooltipStyleClass="unops-tooltip-nowrap"
            />
          </div>
        </div>
      }

      <div class="flex justify-end gap-4 flex-wrap">
        <p-button
          type="button"
          [label]="'button.cancel' | translate"
          severity="secondary"
          [outlined]="true"
          (onClick)="cancel()"
        />
        <p-button
          type="button"
          [label]="getCreateAnywayTranslation() | translate"
          severity="warn"
          (onClick)="confirm()"
        />
      </div>
    </div>
  `,
  styleUrl: './duplicate-confirmation-dialog.component.scss'
})
export class DuplicateConfirmationDialogComponent {
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);

  get data(): DuplicateDetectionResponse {
    return this.dialogConfig.data;
  }

  get entityType(): string {
    return this.data.entityType || this.detectEntityTypeFromMessage() || 'contact';
  }

  confirm(): void {
    this.dialogRef.close(true);
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  viewRecord(entityId: number): void {
    const entityType = this.entityType.toLowerCase();
    let route = '';
    
    switch (entityType) {
      case 'contact':
        route = `/partnerships/contacts/${entityId}`;
        break;
      case 'partner':
        route = `/partnerships/partners/${entityId}`;
        break;
      case 'interaction':
        route = `/partnerships/interactions/${entityId}`;
        break;
      default:
        route = `/partnerships/contacts/${entityId}`;
    }
    
    // Construct full URL with protocol, host, hash and route
    const fullUrl = `${window.location.protocol}//${window.location.host}/#${route}`;
    
    // Open in new tab
    window.open(fullUrl, '_blank');
  }



  getCreateAnywayTranslation(): string {
    const entityType = this.entityType.toLowerCase();
    return `DUPLICATE_DETECTION.create${this.capitalizeFirst(entityType)}Anyway`;
  }

  private detectEntityTypeFromMessage(): string {
    const message = this.data.message?.toLowerCase() || '';
    if (message.includes('contact')) return 'contact';
    if (message.includes('partner')) return 'partner';
    if (message.includes('interaction')) return 'interaction';
    return 'contact'; // default fallback
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}
