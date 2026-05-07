/**
 * @fileoverview Recursive office hierarchy tree for parent chain display.
 * Renders parent offices with vertical lines, level suffixes, and current-office highlighting.
 * @author UNOPS Opportunity+ System Development Team
 */

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import type { OfficeHierarchyNodeModel } from '../../models/office.model';

@Component({
  selector: 'app-office-hierarchy-tree',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './office-hierarchy-tree.component.html',
  styleUrl: './office-hierarchy-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfficeHierarchyTreeComponent {
  /** Flat list of hierarchy nodes (parents + current office as last item). */
  readonly nodes = input.required<OfficeHierarchyNodeModel[]>();

  /** Whether this node is the current (viewed) office. */
  isCurrent(index: number): boolean {
    const n = this.nodes();
    if (n.length === 0) {
      return false;
    }
    const node = n[index];
    if (node.isCurrent === true) {
      return true;
    }
    return index === n.length - 1;
  }
}
