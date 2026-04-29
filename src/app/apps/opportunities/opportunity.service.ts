import { Injectable, signal } from '@angular/core';

export interface OpportunityItem {
    id: string;
    name: string;
    partner: string;
    value: string;
    stage: string;
    region: string;
    sector?: string;
    createdDate?: Date;
}

const MOCK_OPPORTUNITIES: OpportunityItem[] = [
    {
        id: '1',
        name: 'Water Sanitization',
        partner: 'Japan',
        value: '$15.0M',
        stage: 'ID & Profile',
        region: 'Sub-Saharan Africa',
        sector: 'Environment',
        createdDate: new Date('2024-03-15')
    },
    {
        id: '2',
        name: 'Rural Electrification',
        partner: 'Denmark',
        value: '$22.5M',
        stage: 'Formulation',
        region: 'South Asia',
        sector: 'Infrastructure',
        createdDate: new Date('2024-05-20')
    },
    {
        id: '3',
        name: 'School Infrastructure',
        partner: 'Norway',
        value: '$8.7M',
        stage: 'Signed',
        region: 'Latin America',
        sector: 'Education',
        createdDate: new Date('2023-11-02')
    },
    {
        id: '4',
        name: 'Healthcare Supply Chain',
        partner: 'USAID',
        value: '$31.2M',
        stage: 'Approval',
        region: 'East Africa',
        sector: 'Health',
        createdDate: new Date('2025-01-08')
    },
    {
        id: '5',
        name: 'Road Rehabilitation',
        partner: 'World Bank',
        value: '$45.0M',
        stage: 'ID & Profile',
        region: 'Central Asia',
        sector: 'Infrastructure',
        createdDate: new Date('2024-07-14')
    },
    {
        id: '6',
        name: 'Flood Resilience',
        partner: 'EU',
        value: '$12.3M',
        stage: 'Formulation',
        region: 'Southeast Asia',
        sector: 'Environment',
        createdDate: new Date('2024-09-30')
    },
    {
        id: '7',
        name: 'Urban Waste Mgmt',
        partner: 'Sweden',
        value: '$9.8M',
        stage: 'Approval',
        region: 'West Africa',
        sector: 'Environment',
        createdDate: new Date('2026-02-01')
    },
    {
        id: '8',
        name: 'Bridge Construction',
        partner: 'South Korea',
        value: '$18.6M',
        stage: 'Signed',
        region: 'Middle East',
        sector: 'Infrastructure',
        createdDate: new Date('2023-06-12')
    },
    {
        id: '9',
        name: 'Solar Farm Initiative',
        partner: 'Germany',
        value: '$27.4M',
        stage: 'ID & Profile',
        region: 'North Africa',
        sector: 'Infrastructure',
        createdDate: new Date('2025-04-22')
    },
    {
        id: '10',
        name: 'Maternal Health Programme',
        partner: 'Canada',
        value: '$14.1M',
        stage: 'Formulation',
        region: 'Caribbean',
        sector: 'Health',
        createdDate: new Date('2026-01-10')
    }
];

export function getOpportunityStageSeverity(stage: string): 'info' | 'warn' | 'success' | 'secondary' {
    switch (stage) {
        case 'ID & Profile':
            return 'info';
        case 'Formulation':
            return 'warn';
        case 'Approval':
            return 'secondary';
        case 'Signed':
            return 'success';
        default:
            return 'secondary';
    }
}

@Injectable({
    providedIn: 'root'
})
export class OpportunityService {
    private opportunityData = signal<OpportunityItem[]>([]);
    allOpportunities = this.opportunityData.asReadonly();
    isLoading = signal(false);

    getOpportunities() {
        this.isLoading.set(true);
        this.opportunityData.set(MOCK_OPPORTUNITIES);
        this.isLoading.set(false);
    }
}
