import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MENU_MODEL } from '../tokens';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: '[app-menu]',
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of menuItems; track $index) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `
})
export class AppMenu {
    /** Injected menu tree from the host application. */
    menuItems = inject(MENU_MODEL);
}
