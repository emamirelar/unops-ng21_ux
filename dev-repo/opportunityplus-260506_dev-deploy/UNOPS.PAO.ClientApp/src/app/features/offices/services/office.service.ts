/**
 * @fileoverview Angular service for Office API endpoints.
 * @author UNOPS Opportunity+ System Development Team
 */

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import type {
  OfficeListModel,
  OfficeDetailModel,
  OfficeTreeNodeModel,
  OfficePermissionsModel,
  OfficeFilterRequest,
  PaginationResponse,
  UpdateOfficeOperationalRoleRequest,
  OfficeOperationalRoleAssignmentHistoryResponse
} from '../models/office.model';

/** Minimal opportunity model for related opportunities list (matches backend OpportunityModel). */
export interface OfficeRelatedOpportunity {
  id: number;
  name?: string | null;
  responsibleOrgUnitId?: number | null;
  responsibleOrgUnitName?: string | null;
  stage?: string | null;
  partnerName?: string | null;
  value?: number | null;
  createdDate?: string | null;
  targetSigningDate?: string | null;
  [key: string]: unknown;
}

/** Minimal partner model for related partners list (matches backend OfficeRelatedPartnerModel). */
export interface OfficeRelatedPartner {
  id: number;
  name?: string | null;
  /** EntityStatus value (0=Inactive, 1=Active, 4=Closed, 5=Archived). */
  status?: number;
  /** Count of related opportunities (as client or funding partner). */
  opportunitiesCount?: number;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/office';

  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Get offices with optional filtering and pagination.
   */
  getOffices(request: OfficeFilterRequest): Observable<PaginationResponse<OfficeListModel>> {
    this.loading.set(true);
    this.error.set(null);
    const params = this.buildParams(request);
    return this.http
      .get<PaginationResponse<OfficeListModel>>(this.baseUrl, { params })
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to load offices');
          }
        })
      );
  }

  /**
   * Search offices by query string.
   */
  searchOffices(
    query: string,
    request: OfficeFilterRequest
  ): Observable<PaginationResponse<OfficeListModel>> {
    this.loading.set(true);
    this.error.set(null);
    const params = this.buildParams(request).set('query', query ?? '');
    return this.http
      .get<PaginationResponse<OfficeListModel>>(`${this.baseUrl}/search`, { params })
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to search offices');
          }
        })
      );
  }

  /**
   * Get office hierarchy tree.
   */
  getOfficeTree(rootId?: number | null): Observable<OfficeTreeNodeModel[]> {
    this.loading.set(true);
    this.error.set(null);
    let params = new HttpParams();
    if (rootId != null) {
      params = params.set('rootId', rootId.toString());
    }
    return this.http
      .get<OfficeTreeNodeModel[]>(`${this.baseUrl}/tree`, { params })
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to load office tree');
          }
        })
      );
  }

  /**
   * Get office detail by ID.
   */
  getOfficeDetail(id: number): Observable<OfficeDetailModel> {
    this.loading.set(true);
    this.error.set(null);
    return this.http.get<OfficeDetailModel>(`${this.baseUrl}/${id}`).pipe(
      tap({
        next: () => this.loading.set(false),
        error: (err) => {
          this.loading.set(false);
          this.error.set(err?.message ?? 'Failed to load office detail');
        }
      })
    );
  }

  /**
   * Get permissions for an office.
   */
  getOfficePermissions(id: number): Observable<OfficePermissionsModel> {
    this.loading.set(true);
    this.error.set(null);
    return this.http
      .get<OfficePermissionsModel>(`${this.baseUrl}/${id}/permissions`)
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to load office permissions');
          }
        })
      );
  }

  /**
   * Get opportunities related to an office.
   */
  getRelatedOpportunities(
    id: number,
    request: OfficeFilterRequest
  ): Observable<PaginationResponse<OfficeRelatedOpportunity>> {
    this.loading.set(true);
    this.error.set(null);
    const params = this.buildParams(request);
    return this.http
      .get<PaginationResponse<OfficeRelatedOpportunity>>(`${this.baseUrl}/${id}/opportunities`, {
        params
      })
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to load related opportunities');
          }
        })
      );
  }

  /**
   * Get partners related to an office.
   */
  /**
   * Update one OfficeMaster operational role assignment; returns refreshed office detail.
   */
  updateOperationalRole(
    officeId: number,
    body: UpdateOfficeOperationalRoleRequest
  ): Observable<OfficeDetailModel> {
    this.loading.set(true);
    this.error.set(null);
    return this.http
      .put<OfficeDetailModel>(`${this.baseUrl}/${officeId}/operational-roles`, body)
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to update operational role');
          }
        })
      );
  }

  /**
   * Paged audit for one in-app-managed operational role (requires canEditOperationalRoles on server).
   */
  getOperationalRoleAssignmentHistory(
    officeId: number,
    entityRoleCode: string,
    pageIndex: number,
    pageSize: number
  ): Observable<OfficeOperationalRoleAssignmentHistoryResponse> {
    const params = new HttpParams()
      .set('entityRoleCode', entityRoleCode)
      .set('pageIndex', pageIndex.toString())
      .set('pageSize', pageSize.toString());
    return this.http.get<OfficeOperationalRoleAssignmentHistoryResponse>(
      `${this.baseUrl}/${officeId}/operational-roles/assignment-history`,
      { params }
    );
  }

  getRelatedPartners(
    id: number,
    request: OfficeFilterRequest
  ): Observable<PaginationResponse<OfficeRelatedPartner>> {
    this.loading.set(true);
    this.error.set(null);
    const params = this.buildParams(request);
    return this.http
      .get<PaginationResponse<OfficeRelatedPartner>>(`${this.baseUrl}/${id}/partners`, {
        params
      })
      .pipe(
        tap({
          next: () => this.loading.set(false),
          error: (err) => {
            this.loading.set(false);
            this.error.set(err?.message ?? 'Failed to load related partners');
          }
        })
      );
  }

  private buildParams(request: OfficeFilterRequest): HttpParams {
    let params = new HttpParams();
    if (request.pageIndex != null) {
      params = params.set('pageIndex', request.pageIndex.toString());
    }
    if (request.pageSize != null) {
      params = params.set('pageSize', request.pageSize.toString());
    }
    if (request.orderBy != null && request.orderBy !== '') {
      params = params.set('orderBy', request.orderBy);
    }
    if (request.ascending != null) {
      params = params.set('ascending', request.ascending.toString());
    }
    if (request.name != null && request.name !== '') {
      params = params.set('name', request.name);
    }
    if (request.alias != null && request.alias !== '') {
      params = params.set('alias', request.alias);
    }
    if (request.code != null && request.code !== '') {
      params = params.set('code', request.code);
    }
    if (request.type != null && request.type !== '') {
      params = params.set('type', request.type);
    }
    if (request.parentId != null) {
      params = params.set('parentId', request.parentId.toString());
    }
    if (request.costCentreId != null && request.costCentreId !== '') {
      params = params.set('costCentreId', request.costCentreId);
    }
    if (request.searchTerm != null && request.searchTerm !== '') {
      params = params.set('searchTerm', request.searchTerm);
    }
    return params;
  }
}
