import { Injectable, signal } from '@angular/core';

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    organization: string;
    title: string;
    type: string;
    country: string;
    city: string;
    status: string;
    lastInteraction: string;
}

const STATUS_CLASSES: Record<string, string> = {
    Active: 'tag-status-active',
    Inactive: 'tag-status-closed',
    Pending: 'tag-status-draft'
};

const FALLBACK_CLASS = 'tag-status-archived';

export function getContactStatusClass(status: string): string {
    return STATUS_CLASSES[status] ?? FALLBACK_CLASS;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private contactData = signal<Contact[]>([]);
    allContacts = this.contactData.asReadonly();
    isLoading = signal(false);

    getContacts() {
        this.isLoading.set(true);
        this.contactData.set(MOCK_CONTACTS);
        this.isLoading.set(false);
    }
}

const MOCK_CONTACTS: Contact[] = [
    { id: '1', firstName: 'Takeshi', lastName: 'Yamamoto', email: 'takeshi.yamamoto@jica.go.jp', phone: '+81 3 5226 6660', organization: 'JICA', title: 'Programme Director', type: 'Government', country: 'Japan', city: 'Tokyo', status: 'Active', lastInteraction: 'Apr 22, 2026' },
    { id: '2', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@who.int', phone: '+41 22 791 2111', organization: 'WHO', title: 'Health Specialist', type: 'UN Agency', country: 'Switzerland', city: 'Geneva', status: 'Active', lastInteraction: 'Apr 20, 2026' },
    { id: '3', firstName: 'Lars', lastName: 'Christensen', email: 'lars.christensen@drc.ngo', phone: '+45 33 73 50 00', organization: 'DRC', title: 'Regional Coordinator', type: 'NGO', country: 'Denmark', city: 'Copenhagen', status: 'Active', lastInteraction: 'Apr 18, 2026' },
    { id: '4', firstName: 'Sophie', lastName: 'Laurent', email: 'sophie.laurent@ec.europa.eu', phone: '+32 2 299 1111', organization: 'European Commission', title: 'Policy Advisor', type: 'Government', country: 'Belgium', city: 'Brussels', status: 'Active', lastInteraction: 'Apr 15, 2026' },
    { id: '5', firstName: 'Jean-Pierre', lastName: 'Moreau', email: 'jp.moreau@msf.org', phone: '+41 22 849 8400', organization: 'MSF', title: 'Operations Manager', type: 'NGO', country: 'Switzerland', city: 'Geneva', status: 'Pending', lastInteraction: 'Apr 10, 2026' },
    { id: '6', firstName: 'Amina', lastName: 'Diallo', email: 'amina.diallo@afdb.org', phone: '+225 20 26 3900', organization: 'AfDB', title: 'Investment Officer', type: 'Multilateral', country: "Côte d'Ivoire", city: 'Abidjan', status: 'Active', lastInteraction: 'Apr 8, 2026' },
    { id: '7', firstName: 'Erik', lastName: 'Svensson', email: 'erik.svensson@nrc.no', phone: '+47 23 15 98 00', organization: 'NRC', title: 'Advocacy Lead', type: 'NGO', country: 'Norway', city: 'Oslo', status: 'Inactive', lastInteraction: 'Mar 28, 2026' },
    { id: '8', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.mitchell@undp.org', phone: '+1 212 906 5000', organization: 'UNDP', title: 'Senior Analyst', type: 'UN Agency', country: 'United States', city: 'New York', status: 'Active', lastInteraction: 'Apr 21, 2026' },
    { id: '9', firstName: 'David', lastName: 'Chen', email: 'david.chen@thegef.org', phone: '+1 202 473 0508', organization: 'GEF', title: 'Climate Finance Lead', type: 'Multilateral', country: 'United States', city: 'Washington D.C.', status: 'Active', lastInteraction: 'Apr 19, 2026' },
    { id: '10', firstName: 'Anna', lastName: 'Lindqvist', email: 'anna.lindqvist@sida.se', phone: '+46 8 698 5000', organization: 'SIDA', title: 'Programme Officer', type: 'Government', country: 'Sweden', city: 'Stockholm', status: 'Pending', lastInteraction: 'Apr 5, 2026' },
    { id: '11', firstName: 'Hassan', lastName: 'Al-Rashid', email: 'hassan.alrashid@unops.org', phone: '+45 45 33 75 00', organization: 'UNOPS', title: 'Project Manager', type: 'UN Agency', country: 'Denmark', city: 'Copenhagen', status: 'Active', lastInteraction: 'Apr 23, 2026' },
    { id: '12', firstName: 'Elena', lastName: 'Petrov', email: 'elena.petrov@unicef.org', phone: '+1 212 326 7000', organization: 'UNICEF', title: 'Emergency Coordinator', type: 'UN Agency', country: 'United States', city: 'New York', status: 'Active', lastInteraction: 'Apr 17, 2026' },
    { id: '13', firstName: 'Pierre', lastName: 'Mbeki', email: 'pierre.mbeki@oxfam.org', phone: '+44 1865 473727', organization: 'Oxfam', title: 'Country Director', type: 'NGO', country: 'United Kingdom', city: 'Oxford', status: 'Active', lastInteraction: 'Apr 14, 2026' },
    { id: '14', firstName: 'Ingrid', lastName: 'Hofmann', email: 'ingrid.hofmann@giz.de', phone: '+49 228 44 60 0', organization: 'GIZ', title: 'Technical Advisor', type: 'Government', country: 'Germany', city: 'Bonn', status: 'Active', lastInteraction: 'Apr 12, 2026' },
    { id: '15', firstName: 'Fatima', lastName: 'Al-Zahra', email: 'fatima.alzahra@wfp.org', phone: '+39 06 6513 1', organization: 'WFP', title: 'Logistics Specialist', type: 'UN Agency', country: 'Italy', city: 'Rome', status: 'Inactive', lastInteraction: 'Feb 28, 2026' }
];
