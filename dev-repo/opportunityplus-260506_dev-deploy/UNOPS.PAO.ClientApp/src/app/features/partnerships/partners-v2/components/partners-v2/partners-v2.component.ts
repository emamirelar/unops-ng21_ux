/**
 * @fileoverview Partner list page following the unops-ng21_ux design system.
 * Features DataView with list/grid toggle, search, filter tags, and summary stats.
 * @author UNOPS Opportunity+ System Development Team
 */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { Partner } from '@partnerships/partners/models/partner.model';

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

interface FilterTag {
  group: 'status' | 'category';
  label: string;
  value: string;
}

/**
 * @class PartnersV2Component
 * @description Partner directory page with list/grid toggle, search, filter tags,
 * and summary statistics. Uses PrimeNG DataView for flexible layout switching.
 * @since 2.0.0
 */
@Component({
  selector: 'app-partners-v2',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    DataViewModule,
    SelectButtonModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './partners-v2.component.html',
  styleUrl: './partners-v2.component.scss'
})
export class PartnersV2Component implements OnInit {
  private router = inject(Router);
  private http = inject(HttpClient);

  partners = signal<Partner[]>([]);
  isLoading = signal(true);

  layout: 'list' | 'grid' = 'list';
  layoutOptions = ['list', 'grid'];

  searchQuery = signal('');
  activeStatusFilters = signal<Set<string>>(new Set());
  activeCategoryFilters = signal<Set<string>>(new Set());

  filterTags = computed<FilterTag[]>(() => {
    const partners = this.partners();
    const statuses = [...new Set(partners.map(p => p.status).filter((s): s is string => !!s))];
    const categories = [...new Set(partners.map(p => p.partnerCategoryName).filter((c): c is string => !!c))];
    return [
      ...statuses.map(s => ({ group: 'status' as const, label: s, value: s })),
      ...categories.map(c => ({ group: 'category' as const, label: c, value: c }))
    ];
  });

  filteredPartners = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const statusFilters = this.activeStatusFilters();
    const categoryFilters = this.activeCategoryFilters();

    return this.partners().filter(p => {
      if (query) {
        const searchable = [p.name, p.shortName, p.address1Country, p.address1City, p.partnerCategoryName, p.partnerFocalPointName, p.liaisonOfficeName]
          .filter(Boolean).join(' ').toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      if (statusFilters.size > 0 && (!p.status || !statusFilters.has(p.status))) return false;
      if (categoryFilters.size > 0 && (!p.partnerCategoryName || !categoryFilters.has(p.partnerCategoryName))) return false;
      return true;
    });
  });

  activeCount = computed(() => this.filteredPartners().filter(p => p.status === 'Active').length);
  keyGlobalCount = computed(() => this.filteredPartners().filter(p => p.keyGlobalPartner).length);
  hasActiveFilters = computed(() =>
    this.searchQuery().length > 0 ||
    this.activeStatusFilters().size > 0 ||
    this.activeCategoryFilters().size > 0
  );

  ngOnInit() {
    this.loadPartners();
  }

  private loadPartners() {
    this.isLoading.set(true);
    this.http.get<any>('/api/partner').subscribe({
      next: (data) => {
        if (data && Array.isArray(data.records)) {
          this.partners.set(data.records);
        } else if (data && Array.isArray(data)) {
          this.partners.set(data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  navigateToDetail(partner: Partner) {
    this.router.navigate(['/partners-v2', partner.id]);
  }

  isTagActive(tag: FilterTag): boolean {
    const set = tag.group === 'status' ? this.activeStatusFilters() : this.activeCategoryFilters();
    return set.has(tag.value);
  }

  toggleTag(tag: FilterTag) {
    const signalRef = tag.group === 'status' ? this.activeStatusFilters : this.activeCategoryFilters;
    const current = signalRef();
    const next = new Set(current);
    if (next.has(tag.value)) {
      next.delete(tag.value);
    } else {
      next.add(tag.value);
    }
    signalRef.set(next);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.activeStatusFilters.set(new Set());
    this.activeCategoryFilters.set(new Set());
  }

  getFlagUrl(partner: Partner): string {
    if (partner.partnerCategoryCode === 'UN') {
      return 'flags/un.svg';
    }
    if (!partner.address1Country) {
      return 'flags/globe.svg';
    }
    const code = COUNTRY_TO_FLAG[partner.address1Country.toLowerCase()];
    return code ? `flags/${code}.svg` : 'flags/globe.svg';
  }

  getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast'> = {
      Active: 'success',
      Draft: 'warn',
      Closed: 'secondary',
      Archived: 'contrast'
    };
    return map[status] ?? 'secondary';
  }

  getApprovalSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast' {
    const map: Record<string, 'success' | 'warn' | 'danger' | 'info' | 'secondary' | 'contrast'> = {
      Approved: 'success',
      NotApproved: 'danger'
    };
    return map[status] ?? 'secondary';
  }
}
