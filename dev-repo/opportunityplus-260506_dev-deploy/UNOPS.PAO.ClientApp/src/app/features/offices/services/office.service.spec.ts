/**
 * @fileoverview Unit tests for OfficeService.
 * @author UNOPS Opportunity+ System Development Team
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OfficeService } from './office.service';
import type { OfficeFilterRequest, OfficeTreeNodeModel } from '../models/office.model';

describe('OfficeService', () => {
  let service: OfficeService;
  let httpMock: HttpTestingController;

  const baseUrl = '/api/office';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OfficeService]
    });
    service = TestBed.inject(OfficeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have loading and error signals', () => {
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  describe('getOffices', () => {
    it('should call GET /api/office with filter params', () => {
      const request: OfficeFilterRequest = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        records: [],
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPages: 0
      };

      service.getOffices(request).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url.startsWith(baseUrl) && !r.url.includes('/search'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('pageIndex')).toBe('1');
      expect(req.request.params.get('pageSize')).toBe('10');
      req.flush(mockResponse);
    });
  });

  describe('searchOffices', () => {
    it('should call GET /api/office/search with query and params', () => {
      const query = 'test';
      const request: OfficeFilterRequest = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        records: [],
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPages: 0
      };

      service.searchOffices(query, request).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/search'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('query')).toBe(query);
      req.flush(mockResponse);
    });
  });

  describe('getOfficeTree', () => {
    it('should call GET /api/office/tree without rootId', () => {
      const mockResponse: OfficeTreeNodeModel[] = [];

      service.getOfficeTree().subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/tree'));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call GET /api/office/tree with rootId', () => {
      const mockResponse: OfficeTreeNodeModel[] = [];
      service.getOfficeTree(5).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/tree') && r.params.get('rootId') === '5');
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getOfficeDetail', () => {
    it('should call GET /api/office/{id}', () => {
      const id = 123;
      const mockResponse = {
        id,
        code: 'OFF001',
        name: 'Test Office',
        operationalRoles: [],
        doAHolders: [],
        parentChain: [],
        children: []
      };

      service.getOfficeDetail(id).subscribe((res) => {
        expect(res.id).toBe(id);
        expect(res.code).toBe('OFF001');
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getOfficePermissions', () => {
    it('should call GET /api/office/{id}/permissions', () => {
      const id = 123;
      const mockResponse = {
        canView: true,
        canUploadDocuments: false,
        canEditWorkflowConfiguration: false,
        canEditOperationalRoles: false,
      };

      service.getOfficePermissions(id).subscribe((res) => {
        expect(res.canView).toBe(true);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}/permissions`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRelatedOpportunities', () => {
    it('should call GET /api/office/{id}/opportunities', () => {
      const id = 123;
      const request: OfficeFilterRequest = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        records: [],
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPages: 0
      };

      service.getRelatedOpportunities(id, request).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/opportunities'));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getRelatedPartners', () => {
    it('should call GET /api/office/{id}/partners', () => {
      const id = 123;
      const request: OfficeFilterRequest = { pageIndex: 1, pageSize: 10 };
      const mockResponse = {
        records: [],
        totalCount: 0,
        pageIndex: 1,
        pageSize: 10,
        totalPages: 0
      };

      service.getRelatedPartners(id, request).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne((r) => r.url.includes('/partners'));
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('updateOperationalRole', () => {
    it('should call PUT /api/office/{id}/operational-roles with body', () => {
      const id = 42;
      const body = {
        entityRoleCode: 'Organizational_Director_OrganizationHierarchy',
        userId: 7,
        effectiveDate: '2026-04-22'
      };
      const mockResponse = {
        id,
        code: 'X',
        name: 'Office',
        operationalRoles: [],
        doAHolders: [],
        parentChain: [],
        children: []
      };

      service.updateOperationalRole(id, body).subscribe((res) => {
        expect(res.id).toBe(id);
      });

      const req = httpMock.expectOne(`${baseUrl}/${id}/operational-roles`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(body);
      req.flush(mockResponse);
    });
  });

  describe('getOperationalRoleAssignmentHistory', () => {
    it('should call GET assignment-history with query params', () => {
      const id = 9;
      const code = 'Organizational_Director_OrganizationHierarchy';
      const mockResponse = {
        records: [],
        pageIndex: 0,
        pageSize: 15,
        totalCount: 0,
        hasMore: false
      };

      service.getOperationalRoleAssignmentHistory(id, code, 0, 15).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        (r) =>
          r.url === `${baseUrl}/${id}/operational-roles/assignment-history` &&
          r.params.get('entityRoleCode') === code &&
          r.params.get('pageIndex') === '0' &&
          r.params.get('pageSize') === '15'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
