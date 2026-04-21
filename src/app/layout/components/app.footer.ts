import { Component } from '@angular/core';

@Component({
    selector: '[app-footer]',
    standalone: true,
    template: `
        <div class="layout-footer">
            <span class="footer-copyright">&#169; UNOPS 2026</span>
        </div>
    `
})
export class AppFooter {}
