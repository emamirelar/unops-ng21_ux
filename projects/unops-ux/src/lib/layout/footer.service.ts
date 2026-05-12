import { Injectable, signal, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FooterService {
    readonly content = signal<TemplateRef<unknown> | null>(null);
}
