/**
 * @fileoverview Office Documents tab with document list and upload.
 * @author UNOPS Opportunity+ System Development Team
 */

import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { DocumentComponent } from '@shared/components/documents/document/document.component';
import { GDriveDocumentComponent } from '@shared/components/documents/gdrive/document-gdrive.component';
import type { OfficeDetailModel } from '../../models/office.model';

@Component({
  selector: 'app-office-documents-tab',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ButtonModule,
    PanelModule,
    DocumentComponent,
    GDriveDocumentComponent
  ],
  templateUrl: './office-documents-tab.component.html',
  styleUrl: './office-documents-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * @class OfficeDocumentsTabComponent
 * @description Documents tab for Office detail. Displays document list and upload.
 * Upload allowed only for Regional Office org type and users with Organizational Director or Deputy Director on this office.
 * Only Strategy documents are supported initially.
 */
export class OfficeDocumentsTabComponent {
  readonly office = input.required<OfficeDetailModel>();

  @ViewChild('gdriveComponent') gdriveComponent!: GDriveDocumentComponent;

  readonly entityId = computed(() => this.office().id.toString());
  readonly canUploadDocuments = computed(
    () => this.office().permissions?.canUploadDocuments === true
  );

  /** Accepted MIME types for Google Drive document picker (Strategy docs: PDF, Word, Excel). */
  readonly acceptedMimeTypes =
    'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.google-apps.document,application/vnd.google-apps.spreadsheet';

  /**
   * Opens the Google Drive picker by calling the GDrive component's openGoogleDrivePicker method.
   */
  openGoogleDriveDialog(): void {
    if (this.gdriveComponent) {
      this.gdriveComponent.openGoogleDrivePicker();
    }
  }
}
