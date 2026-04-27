import { Injectable, signal } from '@angular/core';
import { Partner } from '@/app/types/partner';

const STATUS_CLASSES: Record<string, string> = {
    Active: '!bg-babygreen-100 !text-babygreen-900 dark:!bg-babygreen-900 dark:!text-babygreen-300',
    Draft: '!bg-yellow-100 !text-yellow-900 dark:!bg-yellow-900 dark:!text-yellow-300',
    Closed: '!bg-deepsea-100 !text-deepsea-500 dark:!bg-deepsea-800 dark:!text-deepsea-100',
    Archived: '!bg-gray-100 !text-gray-700 dark:!bg-gray-900 dark:!text-gray-300'
};

const APPROVAL_CLASSES: Record<string, string> = {
    Approved: '!bg-olive-100 !text-olive-700 dark:!bg-olive-900 dark:!text-olive-300',
    NotApproved: '!bg-red-100 !text-red-800 dark:!bg-red-950 dark:!text-red-300'
};

const FALLBACK_CLASS = '!bg-gray-100 !text-gray-700 dark:!bg-gray-900 dark:!text-gray-300';

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
