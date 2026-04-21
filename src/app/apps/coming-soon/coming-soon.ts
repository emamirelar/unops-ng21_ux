import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-coming-soon',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex flex-col items-center justify-center py-24 px-6 text-center">
            <i class="pi pi-wrench text-6xl text-surface-400 dark:text-surface-500 mb-6"></i>
            <h1 class="text-surface-900 dark:text-surface-0 text-3xl font-semibold leading-10 m-0">Under Construction</h1>
            <p class="text-surface-600 dark:text-surface-300 text-lg mt-3 max-w-md">
                This feature is coming soon. We're working hard to bring it to you.
            </p>
        </div>
    `
})
export class ComingSoon {}
