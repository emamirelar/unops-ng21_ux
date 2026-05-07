import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  inject
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-partner-funding-agreements',
  standalone: true,
  imports: [CommonModule, TranslateModule, PanelModule],
  templateUrl: './partner-funding-agreements.component.html',
  styleUrl: './partner-funding-agreements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PartnerFundingAgreementsComponent implements OnInit {
  private route = inject(ActivatedRoute);


  partnerId = signal<string>('');
  ngOnInit(): void {
    // Get partnerId from parent route params (since this is a child route)
    this.route.parent?.paramMap.subscribe(params => {
      const recordId = params.get('recordId');
      if (recordId) {
        this.partnerId.set(recordId);
      }
    });
  }
}
