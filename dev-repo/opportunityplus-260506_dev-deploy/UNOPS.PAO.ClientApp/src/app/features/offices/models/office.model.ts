/**
 * @fileoverview TypeScript models for Office entity matching backend DTOs.
 * @author UNOPS Opportunity+ System Development Team
 */

/** Operational role for office (e.g., Regional Director, HSSE Coordinator). */
export interface OfficeOperationalRoleModel {
  /** Entity role code — fixed matrix rows use this for `role.{code}` labels. */
  entityRoleCode?: string;
  roleName: string;
  /** PAO user id when assigned (for edit dialog pre-selection). */
  holderUserId?: number | null;
  holderName?: string | null;
  positionTitle?: string | null;
  orgUnitWorksAt?: string | null;
  /** Assignment applicability start (AC3), ISO timestamp when set. */
  applicabilityPeriodStart?: string | null;
  isActive: boolean;
  /** Director/Manager holder "Works at" differs from this office's org unit (AC6). */
  worksAtMismatch?: boolean;
}

/** Audit row for in-app operational role assignment changes (AC5). */
export interface OfficeOperationalRoleAuditEntryModel {
  timestamp: string;
  changedByUserId: number;
  changedByName?: string | null;
  entityRoleCode: string;
  /** Entity role name from API (DB); UI prefers i18n + Deputy override like operational roles table. */
  roleName?: string | null;
  effectiveDate?: string | null;
  newUserId: number;
  newAssigneeName?: string | null;
  previousUserIds: number[];
  description?: string | null;
}

/** Paged assignment history for one operational role (dialog + infinite scroll). */
export interface OfficeOperationalRoleAssignmentHistoryResponse {
  records: OfficeOperationalRoleAuditEntryModel[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  hasMore: boolean;
}

/** Request body for PUT .../office/{id}/operational-roles */
export interface UpdateOfficeOperationalRoleRequest {
  entityRoleCode: string;
  userId: number;
  /** ISO date yyyy-MM-dd */
  effectiveDate: string;
}

/** DoA holder for office (Delegation of Authority). */
export interface OfficeDoAHolderModel {
  doAType: string;
  doALevel: string;
  roleHolder?: string | null;
  applicabilityPeriodStart?: string | null; // ISO date
  applicabilityPeriodEnd?: string | null; // ISO date
  conditions?: string | null;
  /** Source of the role assignment from EntityUserRole (e.g. DoA, Mgmt). */
  roleSource?: string | null;
  isActive: boolean;
  /** When set, Role Holder column uses OIC styling with the resolved display name. */
  officerInChargeResourceId?: string | null;
  officerInChargeDisplayName?: string | null;
}

/** Country in geographic scope. */
export interface CountryScopeModel {
  id: number;
  code: string;
  name: string;
  responsibleOfficeName?: string | null;
  responsibleOfficeId?: number | null;
  status?: string | null;
}

/** Key information section for office detail. */
export interface OfficeKeyInformationModel {
  id: number;
  code: string;
  internalName?: string | null;
  alias?: string | null;
  externalName?: string | null;
  organisationalEntityType?: string | null;
  hierarchyLevel?: number | null;
  effectiveDate?: string | null; // ISO date
}

/** Financial information section for office detail. */
export interface OfficeFinancialInformationModel {
  costCentreId?: string | null;
  financialCentreType?: string | null;
  funding?: string | null;
  nerTarget?: number | null;
  nerTargetPeriod?: string | null;
  eaTarget?: number | null;
  eaTargetPeriod?: string | null;
}

/** Physical office/location details from oneUNOPS Projects. */
export interface OfficePhysicalDetailsModel {
  officeId?: string | null;
  officeName?: string | null;
  alias?: string | null;
  locationType?: string | null;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  geoCoordinates?: string | null;
}

/** Scope section for office detail. */
export interface OfficeScopeModel {
  scopeType?: string | null;
  geographicScope?: CountryScopeModel[] | null;
}

/** Office hierarchy node (parent chain). */
export interface OfficeHierarchyNodeModel {
  id: number;
  officeId?: number | null;
  code: string;
  name: string;
  type?: string | null;
  /** True for the office being viewed (last row in the chain). */
  isCurrent?: boolean;
}

/** Office tree node for hierarchy display. */
export interface OfficeTreeNodeModel {
  id: number;
  code: string;
  name: string;
  type?: string | null;
  children: OfficeTreeNodeModel[];
}

/** Sync metadata: when each section was last synced from external source. */
export interface OfficeSyncMetadataModel {
  financialLastSyncedAt?: string | null; // ISO date
  /** Geographic implementation + scope countries (locations sync config). */
  locationsLastSyncedAt?: string | null;
  operationalRolesLastSyncedAt?: string | null;
  doAHoldersLastSyncedAt?: string | null;
}

/** Office permissions for UI. */
export interface OfficePermissionsModel {
  canView: boolean;
  /** Upload strategy documents on Regional Office (OfficeMaster Director/Deputy). */
  canUploadDocuments: boolean;
  /** Edit scoped workflow configuration (separate from document upload). */
  canEditWorkflowConfiguration: boolean;
  /**
   * Edit operational roles when the user's HR "works at" org unit matches this office's org hierarchy.
   */
  canEditOperationalRoles: boolean;
}

/** Office list item for list/search views. */
export interface OfficeListModel {
  id: number;
  code: string;
  name: string;
  alias?: string | null;
  type?: string | null;
  hierarchyLevel?: number | null;
  parentId?: number | null;
  parentName?: string | null;
  childrenCount: number;
  status: number;
  regionalDirector?: string | null;
  scopeType?: string | null;
  organizationHierarchyId?: number | null;
  internalName?: string | null;
  externalName?: string | null;
  organisationalEntityType?: string | null;
  effectiveDate?: string | null; // ISO date
  costCentreId?: string | null;
  financialCentreType?: string | null;
  funding?: string | null;
  nerTarget?: number | null;
  nerTargetPeriod?: string | null;
  eaTarget?: number | null;
  eaTargetPeriod?: string | null;
}

/** Full office detail including key info, hierarchy, roles, and DoA holders. */
export interface OfficeDetailModel {
  id: number;
  code: string;
  name: string;
  organizationHierarchyId?: number | null;
  keyInformation?: OfficeKeyInformationModel | null;
  financialInformation?: OfficeFinancialInformationModel | null;
  scope?: OfficeScopeModel | null;
  physicalLocations?: OfficePhysicalDetailsModel[];
  operationalRoles: OfficeOperationalRoleModel[];
  operationalRoleAuditTrail?: OfficeOperationalRoleAuditEntryModel[];
  doAHolders: OfficeDoAHolderModel[];
  parentChain: OfficeHierarchyNodeModel[];
  children: OfficeTreeNodeModel[];
  /** Transitive descendant office count (excl. self), for workflow regional impact. */
  workflowConfigurationImpactedDescendantOfficeCount?: number;
  regionalDirector?: string | null;
  permissions?: OfficePermissionsModel | null;
  syncMetadata?: OfficeSyncMetadataModel | null;
}

/** Filter request for office list/search. */
export interface OfficeFilterRequest {
  pageIndex?: number;
  pageSize?: number;
  orderBy?: string | null;
  ascending?: boolean | null;
  name?: string | null;
  alias?: string | null;
  code?: string | null;
  type?: string | null;
  parentId?: number | null;
  costCentreId?: string | null;
  searchTerm?: string | null;
}

/** Paginated response wrapper. */
export interface PaginationResponse<T> {
  records: T[];
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  totalPages: number;
  searchMetadata?: Record<number, Record<string, unknown>> | null;
  searchQuery?: string | null;
  executionTimeMs?: number | null;
}
