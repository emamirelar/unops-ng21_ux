import { Injectable, signal } from '@angular/core';

export interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    salutation?: string;
    email: string;
    phone: string;
    mobilePhone?: string;
    organization: string;
    partnerId?: string;
    title: string;
    department?: string;
    type: string;
    country: string;
    city: string;
    address?: string;
    status: string;
    lastInteraction: string;
    linkedIn?: string;
    notes?: string;
    preferredLanguage?: string;
    createdDate?: string;
    lastModifiedDate?: string;
    interactions?: ContactInteraction[];
}

export interface ContactInteraction {
    id: string;
    date: string;
    type: 'Meeting' | 'Email' | 'Call' | 'Visit' | 'Other';
    subject: string;
    notes?: string;
    participants?: string[];
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

    getContactById(id: string): Contact | null {
        if (this.contactData().length === 0) {
            this.contactData.set(MOCK_CONTACTS);
        }
        return this.contactData().find(c => c.id === id) ?? null;
    }
}

const MOCK_CONTACTS: Contact[] = [
    { id: '1', salutation: 'Mr.', firstName: 'Takeshi', lastName: 'Yamamoto', email: 'takeshi.yamamoto@jica.go.jp', phone: '+81 3 5226 6660', mobilePhone: '+81 90 1234 5678', organization: 'JICA', partnerId: '997', title: 'Programme Director', department: 'Development Cooperation', type: 'Government', country: 'Japan', city: 'Tokyo', address: '5-25 Nibancho, Chiyoda-ku', status: 'Active', lastInteraction: 'Apr 22, 2026', linkedIn: 'https://linkedin.com/in/tyamamoto', preferredLanguage: 'English', createdDate: 'Jan 15, 2024', lastModifiedDate: 'Apr 22, 2026', notes: 'Key focal point for JICA partnership. Prefers formal communication.', interactions: [
        { id: 'i1', date: 'Apr 22, 2026', type: 'Meeting', subject: 'Q2 Partnership Review', notes: 'Discussed project pipeline for FY2026-27.', participants: ['Hassan Al-Rashid', 'Sarah Mitchell'] },
        { id: 'i2', date: 'Mar 15, 2026', type: 'Email', subject: 'Draft MoU Review', notes: 'Sent revised MoU for infrastructure programme.' },
        { id: 'i3', date: 'Feb 28, 2026', type: 'Call', subject: 'Budget Alignment Discussion', participants: ['Anna Lindqvist'] }
    ] },
    { id: '2', salutation: 'Dr.', firstName: 'Marie', lastName: 'Dupont', email: 'marie.dupont@who.int', phone: '+41 22 791 2111', organization: 'WHO', partnerId: '1042', title: 'Health Specialist', department: 'Global Health Programme', type: 'UN Agency', country: 'Switzerland', city: 'Geneva', address: 'Avenue Appia 20', status: 'Active', lastInteraction: 'Apr 20, 2026', linkedIn: 'https://linkedin.com/in/mdupont', preferredLanguage: 'French', createdDate: 'Nov 20, 2023', lastModifiedDate: 'Apr 20, 2026', notes: 'Subject matter expert on health infrastructure projects.', interactions: [
        { id: 'i4', date: 'Apr 20, 2026', type: 'Meeting', subject: 'Health Infrastructure Scoping', participants: ['Elena Petrov'] },
        { id: 'i5', date: 'Apr 5, 2026', type: 'Email', subject: 'Technical Assessment Follow-up' }
    ] },
    { id: '3', salutation: 'Mr.', firstName: 'Lars', lastName: 'Christensen', email: 'lars.christensen@drc.ngo', phone: '+45 33 73 50 00', mobilePhone: '+45 21 34 56 78', organization: 'DRC', partnerId: '1105', title: 'Regional Coordinator', department: 'Programme Management', type: 'NGO', country: 'Denmark', city: 'Copenhagen', address: 'Borgergade 10', status: 'Active', lastInteraction: 'Apr 18, 2026', preferredLanguage: 'English', createdDate: 'Jan 8, 2025', lastModifiedDate: 'Apr 18, 2026', interactions: [
        { id: 'i6', date: 'Apr 18, 2026', type: 'Visit', subject: 'Site Visit — East Africa Programme', participants: ['Pierre Mbeki'] }
    ] },
    { id: '4', salutation: 'Ms.', firstName: 'Sophie', lastName: 'Laurent', email: 'sophie.laurent@ec.europa.eu', phone: '+32 2 299 1111', organization: 'European Commission', partnerId: '863', title: 'Policy Advisor', department: 'International Partnerships (DG INTPA)', type: 'Government', country: 'Belgium', city: 'Brussels', address: 'Rue de la Loi 41', status: 'Active', lastInteraction: 'Apr 15, 2026', linkedIn: 'https://linkedin.com/in/slaurent', preferredLanguage: 'French', createdDate: 'Jun 12, 2023', lastModifiedDate: 'Apr 15, 2026', notes: 'Primary EC contact for EU-funded programmes. Coordinates with DG ECHO on humanitarian projects.', interactions: [
        { id: 'i7', date: 'Apr 15, 2026', type: 'Meeting', subject: 'EU Grant Programme Coordination', participants: ['Ingrid Hofmann', 'David Chen'] },
        { id: 'i8', date: 'Mar 28, 2026', type: 'Call', subject: 'Pillar Assessment Update' },
        { id: 'i9', date: 'Mar 10, 2026', type: 'Email', subject: 'Budget Revision Request' },
        { id: 'i10', date: 'Feb 20, 2026', type: 'Meeting', subject: 'Annual Review Meeting' }
    ] },
    { id: '5', salutation: 'Mr.', firstName: 'Jean-Pierre', lastName: 'Moreau', email: 'jp.moreau@msf.org', phone: '+41 22 849 8400', organization: 'MSF', partnerId: '1287', title: 'Operations Manager', department: 'Operational Centre', type: 'NGO', country: 'Switzerland', city: 'Geneva', status: 'Pending', lastInteraction: 'Apr 10, 2026', preferredLanguage: 'French', createdDate: 'Mar 22, 2026', lastModifiedDate: 'Apr 10, 2026', interactions: [
        { id: 'i11', date: 'Apr 10, 2026', type: 'Email', subject: 'Partnership Exploration — Joint Logistics' }
    ] },
    { id: '6', salutation: 'Ms.', firstName: 'Amina', lastName: 'Diallo', email: 'amina.diallo@afdb.org', phone: '+225 20 26 3900', mobilePhone: '+225 07 89 01 23', organization: 'AfDB', partnerId: '754', title: 'Investment Officer', department: 'Infrastructure & Urban Development', type: 'Multilateral', country: "Côte d'Ivoire", city: 'Abidjan', address: 'Avenue Joseph Anoma', status: 'Active', lastInteraction: 'Apr 8, 2026', linkedIn: 'https://linkedin.com/in/adiallo', preferredLanguage: 'French', createdDate: 'Sep 5, 2022', lastModifiedDate: 'Apr 8, 2026', notes: 'AfDB infrastructure financing specialist. Strong advocate for UNOPS project delivery capacity.', interactions: [
        { id: 'i12', date: 'Apr 8, 2026', type: 'Meeting', subject: 'Infrastructure Portfolio Review' },
        { id: 'i13', date: 'Mar 20, 2026', type: 'Call', subject: 'Co-financing Discussion' }
    ] },
    { id: '7', salutation: 'Mr.', firstName: 'Erik', lastName: 'Svensson', email: 'erik.svensson@nrc.no', phone: '+47 23 15 98 00', organization: 'NRC', partnerId: '1198', title: 'Advocacy Lead', department: 'Policy & Advocacy', type: 'NGO', country: 'Norway', city: 'Oslo', status: 'Inactive', lastInteraction: 'Mar 28, 2026', preferredLanguage: 'English', createdDate: 'Jul 14, 2024', lastModifiedDate: 'Mar 28, 2026', notes: 'Partnership concluded. Contact retained for future reference.', interactions: [] },
    { id: '8', salutation: 'Ms.', firstName: 'Sarah', lastName: 'Mitchell', email: 'sarah.mitchell@undp.org', phone: '+1 212 906 5000', mobilePhone: '+1 917 555 0198', organization: 'UNDP', partnerId: '612', title: 'Senior Analyst', department: 'Bureau for Policy and Programme Support', type: 'UN Agency', country: 'United States', city: 'New York', address: 'One United Nations Plaza', status: 'Active', lastInteraction: 'Apr 21, 2026', linkedIn: 'https://linkedin.com/in/smitchell', preferredLanguage: 'English', createdDate: 'Jan 30, 2022', lastModifiedDate: 'Apr 21, 2026', notes: 'Key interlocutor for joint UNDP-UNOPS programming.', interactions: [
        { id: 'i14', date: 'Apr 21, 2026', type: 'Meeting', subject: 'Joint Programme Review Board', participants: ['Hassan Al-Rashid', 'Elena Petrov'] },
        { id: 'i15', date: 'Apr 10, 2026', type: 'Email', subject: 'Quarterly Progress Report Submission' },
        { id: 'i16', date: 'Mar 5, 2026', type: 'Call', subject: 'Budget Revision Coordination' }
    ] },
    { id: '9', salutation: 'Mr.', firstName: 'David', lastName: 'Chen', email: 'david.chen@thegef.org', phone: '+1 202 473 0508', organization: 'GEF', partnerId: '1350', title: 'Climate Finance Lead', department: 'Climate Change Division', type: 'Multilateral', country: 'United States', city: 'Washington D.C.', address: '1818 H Street NW', status: 'Active', lastInteraction: 'Apr 19, 2026', preferredLanguage: 'English', createdDate: 'Nov 3, 2024', lastModifiedDate: 'Apr 19, 2026', notes: 'Leading GEF climate finance portfolio. Interested in UNOPS green infrastructure capacity.', interactions: [
        { id: 'i17', date: 'Apr 19, 2026', type: 'Meeting', subject: 'GEF-8 Project Pipeline Discussion', participants: ['Sophie Laurent'] },
        { id: 'i18', date: 'Mar 25, 2026', type: 'Email', subject: 'Concept Note Feedback' }
    ] },
    { id: '10', salutation: 'Ms.', firstName: 'Anna', lastName: 'Lindqvist', email: 'anna.lindqvist@sida.se', phone: '+46 8 698 5000', organization: 'SIDA', partnerId: '1401', title: 'Programme Officer', department: 'Department for Asia, Middle East and Humanitarian Assistance', type: 'Government', country: 'Sweden', city: 'Stockholm', address: 'Valhallavägen 199', status: 'Pending', lastInteraction: 'Apr 5, 2026', preferredLanguage: 'English', createdDate: 'Apr 1, 2026', lastModifiedDate: 'Apr 5, 2026', interactions: [
        { id: 'i19', date: 'Apr 5, 2026', type: 'Call', subject: 'Introductory Call — SIDA Partnership' }
    ] },
    { id: '11', salutation: 'Mr.', firstName: 'Hassan', lastName: 'Al-Rashid', email: 'hassan.alrashid@unops.org', phone: '+45 45 33 75 00', mobilePhone: '+45 60 12 34 56', organization: 'UNOPS', title: 'Project Manager', department: 'Infrastructure & Project Management Group', type: 'UN Agency', country: 'Denmark', city: 'Copenhagen', address: 'Marmorvej 51', status: 'Active', lastInteraction: 'Apr 23, 2026', linkedIn: 'https://linkedin.com/in/halrashid', preferredLanguage: 'English', createdDate: 'Mar 15, 2024', lastModifiedDate: 'Apr 23, 2026', interactions: [
        { id: 'i20', date: 'Apr 23, 2026', type: 'Meeting', subject: 'Internal Portfolio Coordination' },
        { id: 'i21', date: 'Apr 15, 2026', type: 'Email', subject: 'Project Delivery Update' }
    ] },
    { id: '12', salutation: 'Ms.', firstName: 'Elena', lastName: 'Petrov', email: 'elena.petrov@unicef.org', phone: '+1 212 326 7000', organization: 'UNICEF', title: 'Emergency Coordinator', department: 'Office of Emergency Programmes', type: 'UN Agency', country: 'United States', city: 'New York', status: 'Active', lastInteraction: 'Apr 17, 2026', preferredLanguage: 'English', createdDate: 'Jul 14, 2024', lastModifiedDate: 'Apr 17, 2026', interactions: [
        { id: 'i22', date: 'Apr 17, 2026', type: 'Call', subject: 'Emergency Response Coordination — Horn of Africa' }
    ] },
    { id: '13', salutation: 'Mr.', firstName: 'Pierre', lastName: 'Mbeki', email: 'pierre.mbeki@oxfam.org', phone: '+44 1865 473727', organization: 'Oxfam', title: 'Country Director', department: 'Programme Quality', type: 'NGO', country: 'United Kingdom', city: 'Oxford', address: 'Oxfam House, John Smith Drive', status: 'Active', lastInteraction: 'Apr 14, 2026', preferredLanguage: 'English', createdDate: 'Jun 12, 2023', lastModifiedDate: 'Apr 14, 2026', interactions: [
        { id: 'i23', date: 'Apr 14, 2026', type: 'Visit', subject: 'Joint Programme Monitoring Visit — DRC' }
    ] },
    { id: '14', salutation: 'Dr.', firstName: 'Ingrid', lastName: 'Hofmann', email: 'ingrid.hofmann@giz.de', phone: '+49 228 44 60 0', mobilePhone: '+49 151 555 0214', organization: 'GIZ', title: 'Technical Advisor', department: 'Sustainable Infrastructure', type: 'Government', country: 'Germany', city: 'Bonn', address: 'Friedrich-Ebert-Allee 32', status: 'Active', lastInteraction: 'Apr 12, 2026', linkedIn: 'https://linkedin.com/in/ihofmann', preferredLanguage: 'German', createdDate: 'Nov 20, 2023', lastModifiedDate: 'Apr 12, 2026', notes: 'GIZ focal point for technical cooperation on sustainable infrastructure.', interactions: [
        { id: 'i24', date: 'Apr 12, 2026', type: 'Meeting', subject: 'Technical Cooperation Framework Review' },
        { id: 'i25', date: 'Mar 18, 2026', type: 'Email', subject: 'Capacity Building Proposal Feedback' }
    ] },
    { id: '15', salutation: 'Ms.', firstName: 'Fatima', lastName: 'Al-Zahra', email: 'fatima.alzahra@wfp.org', phone: '+39 06 6513 1', organization: 'WFP', title: 'Logistics Specialist', department: 'Supply Chain Division', type: 'UN Agency', country: 'Italy', city: 'Rome', address: 'Via Cesare Giulio Viola 68/70', status: 'Inactive', lastInteraction: 'Feb 28, 2026', preferredLanguage: 'Arabic', createdDate: 'Sep 5, 2022', lastModifiedDate: 'Feb 28, 2026', notes: 'Previously coordinated on joint logistics operations. Contact retained for future reference.', interactions: [] }
];
