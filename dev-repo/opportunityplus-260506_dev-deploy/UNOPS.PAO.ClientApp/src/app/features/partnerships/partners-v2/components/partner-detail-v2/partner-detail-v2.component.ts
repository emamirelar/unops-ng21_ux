/**
 * @fileoverview Partner detail page using strictly the unops-ng21_ux library design system.
 * No old dev repo styling, tokens, or shared components are used.
 * @author UNOPS Opportunity+ System Development Team
 */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TabsModule } from 'primeng/tabs';

import { PartnerService } from '@partnerships/partners/services/partner.service';
import { Partner, getPrimaryOrganizationUnit } from '@partnerships/partners/models/partner.model';

const COUNTRY_TO_FLAG: Record<string, string> = {
  japan: 'jp', switzerland: 'ch', denmark: 'dk', belgium: 'be',
  "cote d'ivoire": 'ci', "côte d'ivoire": 'ci', 'ivory coast': 'ci',
  norway: 'no', 'united states': 'us', sweden: 'se', france: 'fr',
  germany: 'de', 'united kingdom': 'gb', italy: 'it', spain: 'es',
  netherlands: 'nl', austria: 'at', finland: 'fi', ireland: 'ie',
  portugal: 'pt', greece: 'gr', poland: 'pl', canada: 'ca',
  australia: 'au', 'new zealand': 'nz', brazil: 'br', india: 'in',
  china: 'cn', 'south korea': 'kr', mexico: 'mx', 'south africa': 'za',
  nigeria: 'ng', kenya: 'ke', ethiopia: 'et', egypt: 'eg', turkey: 'tr',
  ukraine: 'ua', pakistan: 'pk', bangladesh: 'bd', colombia: 'co',
  argentina: 'ar', peru: 'pe', chile: 'cl', thailand: 'th',
  vietnam: 'vn', indonesia: 'id', philippines: 'ph', malaysia: 'my',
  singapore: 'sg', 'saudi arabia': 'sa', jordan: 'jo', lebanon: 'lb',
  iraq: 'iq', afghanistan: 'af', syria: 'sy', yemen: 'ye', somalia: 'so',
  sudan: 'sd', 'democratic republic of the congo': 'cd', mozambique: 'mz',
  tanzania: 'tz', uganda: 'ug', myanmar: 'mm', cambodia: 'kh',
  haiti: 'ht', nepal: 'np', 'sri lanka': 'lk', luxembourg: 'lu',
  'czech republic': 'cz', romania: 'ro', hungary: 'hu', serbia: 'rs'
};

/**
 * @class PartnerDetailV2Component
 * @description Library-only partner detail page using the unops-ng21_ux design system.
 * Uses BrandSoft PrimeNG preset, library Tailwind color palette (deepsea, babygreen, olive,
 * etc.), and library utilities (title-h4, animate-fade-in-up, stagger-*).
 * All old dev repo styling is blocked via scoped SCSS isolation.
 * @since 2.1.0
 */
@Component({
  selector: 'app-partner-detail-v2',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TagModule,
    TabsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partner-detail-v2.component.html',
  styleUrl: './partner-detail-v2.component.scss'
})
export class PartnerDetailV2Component implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private partnerService = inject(PartnerService);
  private destroyRef = inject(DestroyRef);

  partner = signal<Partner | null>(null);
  isLoading = signal(true);
  recordId = '';

  getPrimaryOrganizationUnit = getPrimaryOrganizationUnit;

  flagUrl = computed(() => {
    const p = this.partner();
    if (!p) return 'flags/globe.svg';
    if (p.partnerCategoryCode === 'UN') return 'flags/un.svg';
    if (!p.address1Country) return 'flags/globe.svg';
    const code = COUNTRY_TO_FLAG[p.address1Country.toLowerCase()];
    return code ? `flags/${code}.svg` : 'flags/globe.svg';
  });

  dueDiligenceExpiryWarning = computed(() => {
    const p = this.partner();
    const expiryDate = p?.dueDiligenceExpiryDate;
    if (!expiryDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (expiry > sixMonthsFromNow || expiry < today) return null;

    const diffTime = expiry.getTime() - today.getTime();
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let months = 0;
    const tempDate = new Date(today);
    while (true) {
      const nextMonth = new Date(tempDate);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      if (nextMonth > expiry) break;
      months++;
      tempDate.setMonth(tempDate.getMonth() + 1);
    }
    let days = totalDays;
    if (months > 0) {
      const afterMonthsDate = new Date(today);
      afterMonthsDate.setMonth(afterMonthsDate.getMonth() + months);
      days = Math.ceil((expiry.getTime() - afterMonthsDate.getTime()) / (1000 * 60 * 60 * 24));
    }
    return { months, days, totalDays };
  });

  ngOnInit() {
    this.recordId = this.route.snapshot.paramMap.get('recordId') || '';
    if (this.recordId) {
      this.partnerService.getPartnerById(this.recordId)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data) => {
            this.partner.set(data);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
    } else {
      this.isLoading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/partners-v2']);
  }

  getStatusStyle(status: string): Record<string, string> {
    const styles: Record<string, Record<string, string>> = {
      Active: { background: 'var(--color-babygreen-100)', color: 'var(--color-babygreen-700)' },
      Draft: { background: 'var(--color-yellow-100)', color: 'var(--color-yellow-700)' },
      Closed: { background: 'var(--color-deepsea-100)', color: 'var(--color-deepsea-500)' },
      Archived: { background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' }
    };
    return styles[status] ?? { background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' };
  }

  getApprovalStyle(status: string): Record<string, string> {
    const styles: Record<string, Record<string, string>> = {
      Approved: { background: 'var(--color-olive-100)', color: 'var(--color-olive-700)' },
      NotApproved: { background: 'var(--color-red-100)', color: 'var(--color-red-700)' }
    };
    return styles[status] ?? { background: 'var(--color-gray-100)', color: 'var(--color-gray-600)' };
  }

  formatDate(date: Date | string | null | undefined): string {
    if (!date) return '—';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
