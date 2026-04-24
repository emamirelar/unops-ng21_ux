import { Component, Input } from '@angular/core';

@Component({
    selector: 'logo-widget',
    standalone: true,
    template: `
        <img
            [class]="className + ' block dark:hidden'"
            src="demo/images/landing/unops-logo_onlight.svg"
            alt="UNOPS"
        />
        <img
            [class]="className + ' hidden dark:block'"
            src="demo/images/landing/unops-logo_ondark.svg"
            alt="UNOPS"
        />
    `
})
export class LogoWidget {
    @Input() className: string = '';
}
