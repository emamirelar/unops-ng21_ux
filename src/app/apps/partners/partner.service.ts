import { Injectable, signal } from '@angular/core';
import { Partner } from '@emamirelar/ux';

const STATUS_CLASSES: Record<string, string> = {
    Active: 'tag-status-active',
    Draft: 'tag-status-draft',
    Closed: 'tag-status-closed',
    Archived: 'tag-status-archived'
};

const APPROVAL_CLASSES: Record<string, string> = {
    Approved: 'tag-approval-approved',
    NotApproved: 'tag-approval-not-approved'
};

const FALLBACK_CLASS = 'tag-status-archived';

export function getPartnerStatusClass(status: string): string {
    return STATUS_CLASSES[status] ?? FALLBACK_CLASS;
}

export function getPartnerApprovalClass(status: string): string {
    return APPROVAL_CLASSES[status] ?? FALLBACK_CLASS;
}

@Injectable({
    providedIn: 'root'
})
export class PartnerService {
    private partnerData = signal<Partner[]>([]);
    allPartners = this.partnerData.asReadonly();
    isLoading = signal(false);

    getPartners() {
        this.isLoading.set(true);
        this.partnerData.set(MOCK_PARTNERS);
        this.isLoading.set(false);
    }

    updatePartner(id: string, changes: Partial<Partner>) {
        const partners = this.partnerData();
        const idx = partners.findIndex(p => p.id === id);
        if (idx !== -1) {
            const updated = { ...partners[idx], ...changes, lastModifiedDate: new Date() };
            const copy = [...partners];
            copy[idx] = updated;
            this.partnerData.set(copy);
        }
    }
}

const MOCK_PARTNERS: Partner[] = [
    {
        id: '997',
        partnerDescription: 'Japan International Cooperation Agency',
        partnerShortDescription: 'JICA',
        partnerCategoryName: 'Government',
        partnerCategoryCode: 'GOV',
        partnerGroupName: 'Bilateral',
        liaisonOfficeName: 'Tokyo Office',
        partnerFocalPointName: 'Takeshi Yamamoto',
        name: 'Japan International Cooperation Agency',
        shortName: 'JICA',
        status: 'Active',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: true,
        address1Country: 'Japan',
        address1City: 'Tokyo',
        createdDate: new Date('2024-03-15'),
        lastModifiedDate: new Date('2026-04-10')
    },
    {
        id: '1042',
        partnerDescription: 'World Health Organization',
        partnerShortDescription: 'WHO',
        partnerCategoryName: 'UN Agency',
        partnerCategoryCode: 'UN',
        partnerGroupName: 'United Nations',
        liaisonOfficeName: 'Geneva Office',
        partnerFocalPointName: 'Marie Dupont',
        name: 'World Health Organization',
        shortName: 'WHO',
        status: 'Active',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: true,
        address1Country: 'Switzerland',
        address1City: 'Geneva',
        createdDate: new Date('2023-11-20'),
        lastModifiedDate: new Date('2026-03-28')
    },
    {
        id: '1105',
        partnerDescription: 'Danish Refugee Council',
        partnerShortDescription: 'DRC',
        partnerCategoryName: 'NGO',
        partnerCategoryCode: 'NGO',
        partnerGroupName: 'International NGO',
        liaisonOfficeName: 'Copenhagen Office',
        partnerFocalPointName: 'Lars Christensen',
        name: 'Danish Refugee Council',
        shortName: 'DRC',
        status: 'Active',
        partnerApprovalStatus: 'NotApproved',
        keyGlobalPartner: false,
        address1Country: 'Denmark',
        address1City: 'Copenhagen',
        createdDate: new Date('2025-01-08'),
        lastModifiedDate: new Date('2026-04-15')
    },
    {
        id: '863',
        partnerDescription: 'European Commission',
        partnerShortDescription: 'EC',
        partnerCategoryName: 'Government',
        partnerCategoryCode: 'GOV',
        partnerGroupName: 'Multilateral',
        liaisonOfficeName: 'Brussels Office',
        partnerFocalPointName: 'Sophie Laurent',
        name: 'European Commission',
        shortName: 'EC',
        status: 'Active',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: true,
        address1Country: 'Belgium',
        address1City: 'Brussels',
        createdDate: new Date('2023-06-12'),
        lastModifiedDate: new Date('2026-02-18')
    },
    {
        id: '1287',
        partnerDescription: 'Médecins Sans Frontières',
        partnerShortDescription: 'MSF',
        partnerCategoryName: 'NGO',
        partnerCategoryCode: 'NGO',
        partnerGroupName: 'International NGO',
        liaisonOfficeName: 'Geneva Office',
        partnerFocalPointName: 'Jean-Pierre Moreau',
        name: 'Médecins Sans Frontières',
        shortName: 'MSF',
        status: 'Draft',
        partnerApprovalStatus: 'NotApproved',
        keyGlobalPartner: false,
        address1Country: 'Switzerland',
        address1City: 'Geneva',
        createdDate: new Date('2026-03-22'),
        lastModifiedDate: new Date('2026-04-02')
    },
    {
        id: '754',
        partnerDescription: 'African Development Bank',
        partnerShortDescription: 'AfDB',
        partnerCategoryName: 'Multilateral',
        partnerCategoryCode: 'MUL',
        partnerGroupName: 'Development Bank',
        liaisonOfficeName: 'Abidjan Office',
        partnerFocalPointName: 'Amina Diallo',
        name: 'African Development Bank',
        shortName: 'AfDB',
        status: 'Active',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: true,
        address1Country: 'Côte d\'Ivoire',
        address1City: 'Abidjan',
        createdDate: new Date('2022-09-05'),
        lastModifiedDate: new Date('2026-01-20')
    },
    {
        id: '1198',
        partnerDescription: 'Norwegian Refugee Council',
        partnerShortDescription: 'NRC',
        partnerCategoryName: 'NGO',
        partnerCategoryCode: 'NGO',
        partnerGroupName: 'International NGO',
        liaisonOfficeName: 'Oslo Office',
        partnerFocalPointName: 'Erik Svensson',
        name: 'Norwegian Refugee Council',
        shortName: 'NRC',
        status: 'Closed',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: false,
        address1Country: 'Norway',
        address1City: 'Oslo',
        createdDate: new Date('2024-07-14'),
        lastModifiedDate: new Date('2026-03-05')
    },
    {
        id: '612',
        partnerDescription: 'United Nations Development Programme',
        partnerShortDescription: 'UNDP',
        partnerCategoryName: 'UN Agency',
        partnerCategoryCode: 'UN',
        partnerGroupName: 'United Nations',
        liaisonOfficeName: 'New York Office',
        partnerFocalPointName: 'Sarah Mitchell',
        name: 'United Nations Development Programme',
        shortName: 'UNDP',
        status: 'Active',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: true,
        address1Country: 'United States',
        address1City: 'New York',
        createdDate: new Date('2022-01-30'),
        lastModifiedDate: new Date('2026-04-18')
    },
    {
        id: '1350',
        partnerDescription: 'Global Environment Facility',
        partnerShortDescription: 'GEF',
        partnerCategoryName: 'Multilateral',
        partnerCategoryCode: 'MUL',
        partnerGroupName: 'Environment Fund',
        liaisonOfficeName: 'Washington Office',
        partnerFocalPointName: 'David Chen',
        name: 'Global Environment Facility',
        shortName: 'GEF',
        status: 'Active',
        partnerApprovalStatus: 'Approved',
        keyGlobalPartner: false,
        address1Country: 'United States',
        address1City: 'Washington D.C.',
        createdDate: new Date('2024-11-03'),
        lastModifiedDate: new Date('2026-04-12')
    },
    {
        id: '1401',
        partnerDescription: 'Swedish International Development Cooperation Agency',
        partnerShortDescription: 'SIDA',
        partnerCategoryName: 'Government',
        partnerCategoryCode: 'GOV',
        partnerGroupName: 'Bilateral',
        liaisonOfficeName: 'Stockholm Office',
        partnerFocalPointName: 'Anna Lindqvist',
        name: 'Swedish International Development Cooperation Agency',
        shortName: 'SIDA',
        status: 'Draft',
        partnerApprovalStatus: 'NotApproved',
        keyGlobalPartner: false,
        address1Country: 'Sweden',
        address1City: 'Stockholm',
        createdDate: new Date('2026-04-01'),
        lastModifiedDate: new Date('2026-04-19')
    }
];
