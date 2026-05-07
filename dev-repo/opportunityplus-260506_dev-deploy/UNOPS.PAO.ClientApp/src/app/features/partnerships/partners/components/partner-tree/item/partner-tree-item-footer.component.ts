import { ChangeDetectionStrategy, Component, inject, OnInit, Signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PermissionUtilityService } from '@core/services/auth';
import { EntityPermissions } from '@core/services/auth';

@Component({
  selector: 'app-partner-tree-item-footer',
  standalone: true,
  imports: [ButtonModule, TranslateModule, CommonModule],
  templateUrl: './partner-tree-item-footer.component.html',
  styleUrl: './partner-tree-item-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerTreeItemFooterComponent implements OnInit {
  private dialogRef = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  record: any;
  isFormInvalid!: Signal<boolean>;
  recordPermissions!: Signal<EntityPermissions>;
  permissionUtilityService!: PermissionUtilityService;

  ngOnInit() {
    this.record = this.config.data?.record;
    this.isFormInvalid = this.config.data?.isFormInvalid;
    this.recordPermissions = this.config.data?.recordPermissions;
    this.permissionUtilityService = this.config.data?.permissionUtilityService;
  }

  canSave(): boolean {
    if (!this.recordPermissions || !this.permissionUtilityService) return true;
    
    const isNewRecord = !this.record?.id;
    return isNewRecord 
      ? this.permissionUtilityService.canCreate(this.recordPermissions())
      : this.permissionUtilityService.canUpdate(this.recordPermissions());
  }

  canDelete(): boolean {
    if (!this.recordPermissions || !this.permissionUtilityService) return true;
    return this.permissionUtilityService.canDelete(this.recordPermissions());
  }

  onDelete(): void {
    if (this.config.data?.handleDelete) {
      this.config.data.handleDelete();
    }
  }

  onActivate(): void {
    if (this.config.data?.handleActivate) {
      this.config.data.handleActivate();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.config.data?.handleSave) {
      this.config.data.handleSave();
    }
  }
}
