import { Component, inject } from '@angular/core';
import { LayoutService } from '../layout.service';

@Component({
    selector: '[app-footer]',
    template: `
        @if (layoutService.isHorizontal()) {
            <footer class="layout-footer">
                <span class="footer-copyright">&#169; UNOPS {{ copyrightYear }}</span>
            </footer>
        }
    `
})
export class AppFooter {
    layoutService = inject(LayoutService);

    readonly copyrightYear = new Date().getFullYear();
}
