import { Component } from '@angular/core';

@Component({
    selector: '[app-footer]',
    standalone: true,
    template: `
        <footer class="layout-footer">
            <span class="footer-copyright">&#169; UNOPS 2026</span>
        </footer>
    `
})
export class AppFooter {}
