-- ================================================================
-- Script: Seed EntityManager and EntityFieldManager for Opportunity and Office only (PostgreSQL)
-- Description: Idempotent insert - adds Opportunity and Office entity configs if missing.
--              Does NOT delete or overwrite existing data.
-- Date: March 2025
-- ================================================================

-- ================================================================
-- ENTITY MANAGERS: Opportunity and Office (insert only if missing)
-- ================================================================
INSERT INTO public."EntityManagers" (
    "EntityName",
    "TableName",
    "Description",
    "IsActive",
    "EnableChangeLog",
    "Name",
    "Status",
    "CreatedBy",
    "CreatedDate",
    "LastModifiedBy",
    "LastModifiedDate",
    "IsDeleted",
    "DeletedBy",
    "DeletedDate"
)
SELECT v."EntityName", v."TableName", v."Description", v."IsActive", v."EnableChangeLog", v."Name", v."Status", v."CreatedBy", v."CreatedDate", v."LastModifiedBy", v."LastModifiedDate", v."IsDeleted", v."DeletedBy", v."DeletedDate"
FROM (VALUES
    ('Opportunity'::text, 'Opportunities'::text, 'Funding and partnership opportunities for UNOPS initiatives'::text, true, false, 'Opportunity'::text, 0, 1, NOW(), 0, NULL::timestamptz, false, 0, NULL::timestamptz),
    ('Office'::text, 'Offices'::text, 'UNOPS offices and organizational units'::text, true, false, 'Office'::text, 0, 1, NOW(), 0, NULL::timestamptz, false, 0, NULL::timestamptz)
) AS v("EntityName", "TableName", "Description", "IsActive", "EnableChangeLog", "Name", "Status", "CreatedBy", "CreatedDate", "LastModifiedBy", "LastModifiedDate", "IsDeleted", "DeletedBy", "DeletedDate")
WHERE NOT EXISTS (SELECT 1 FROM public."EntityManagers" em WHERE em."EntityName" = v."EntityName");

-- ================================================================
-- OPPORTUNITY ENTITY FIELDS (insert only if EntityManager exists and field missing)
-- ================================================================
INSERT INTO public."EntityFieldManagers" (
    "EntityManagerId", "FieldName", "DataType", "Description", "IsRequired", "IsActive", "DefaultValue", "MaxLength", "DisplayOrder", "ShowInListView", "ListViewOrder", "RelatedDisplayProperty", "DisplayFieldPath", "DisplayTemplate", "ListViewLabel", "ListViewType", "ListViewWidth", "ListViewEllipsis", "ListViewSortable", "FirstLetterFallbackField", "HelperText",
    "Name", "Status", "CreatedBy", "CreatedDate", "LastModifiedBy", "LastModifiedDate", "IsDeleted", "DeletedBy", "DeletedDate"
)
SELECT em."Id", fd."FieldName", fd."DataType", fd."Description", fd."IsRequired", fd."IsActive", fd."DefaultValue", fd."MaxLength", fd."DisplayOrder", fd."ShowInListView", fd."ListViewOrder", fd."RelatedDisplayProperty", fd."DisplayFieldPath", fd."DisplayTemplate", fd."ListViewLabel", fd."ListViewType", fd."ListViewWidth", fd."ListViewEllipsis", fd."ListViewSortable", fd."FirstLetterFallbackField", fd."HelperText", fd."Name",
    0, 1, NOW(), 0, NULL::timestamptz, false, 0, NULL::timestamptz
FROM public."EntityManagers" em
CROSS JOIN (VALUES
    ('OpportunityThumbnail'::text, 'string'::text, 'AI-generated thumbnail image (base64 encoded)'::text, false, true, NULL::text, NULL::int, 1, true, 1, NULL::text, 'opportunityThumbnail'::text, NULL::text, 'Logo'::text, 'avatar'::text, '8%'::text, false, false, 'name'::text, 'AI-generated thumbnail logo for the opportunity'::text, 'OpportunityThumbnail'::text),
    ('Name'::text, 'string'::text, 'Opportunity name'::text, true, true, NULL::text, 500, 2, true, 2, NULL::text, 'name'::text, NULL::text, 'Name'::text, 'text'::text, '30%'::text, true, true, NULL::text, 'Opportunity name'::text, 'Name'::text),
    ('Status'::text, 'enum'::text, 'Opportunity status'::text, true, true, 'Draft'::text, 50, 3, true, 3, NULL::text, 'status'::text, NULL::text, 'Status'::text, 'badge'::text, '10%'::text, false, true, NULL::text, 'Current status of the opportunity'::text, 'Status'::text),
    ('Stage'::text, 'string'::text, 'Current workflow stage'::text, false, true, NULL::text, NULL::int, 4, true, 4, NULL::text, 'stage'::text, NULL::text, 'Stage'::text, 'text'::text, '15%'::text, false, true, NULL::text, 'Current stage in the workflow'::text, 'Stage'::text),
    ('InitiativeBudgetUSD'::text, 'decimal'::text, 'Initiative budget in USD'::text, false, true, NULL::text, NULL::int, 5, true, 5, NULL::text, 'initiativeBudgetUSD'::text, NULL::text, 'Budget (USD)'::text, 'currency'::text, '12%'::text, false, true, NULL::text, 'Total initiative budget in USD'::text, 'InitiativeBudgetUSD'::text),
    ('ResponsibleOrgUnit'::text, 'OrganizationHierarchy'::text, 'Responsible organization unit'::text, false, true, NULL::text, NULL::int, 6, true, 6, 'name'::text, 'responsibleOrgUnit.name'::text, NULL::text, 'Org Unit'::text, 'text'::text, '25%'::text, true, true, NULL::text, 'Responsible organizational unit'::text, 'ResponsibleOrgUnit'::text),
    ('Id'::text, 'int'::text, 'Unique identifier for the opportunity'::text, true, true, NULL::text, NULL::int, 7, false, NULL::int, NULL::text, 'id'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, NULL::text, 'Id'::text),
    ('Description'::text, 'string'::text, 'Opportunity description'::text, true, true, NULL::text, 2000, 8, false, NULL::int, NULL::text, 'description'::text, NULL::text, NULL::text, 'text'::text, NULL::text, true, false, NULL::text, 'Brief description of the opportunity'::text, 'Description'::text),
    ('PartnerReference'::text, 'string'::text, 'Partner reference number'::text, false, true, NULL::text, 255, 9, false, NULL::int, NULL::text, 'partnerReference'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Partner reference identifier'::text, 'PartnerReference'::text)
) AS fd("FieldName", "DataType", "Description", "IsRequired", "IsActive", "DefaultValue", "MaxLength", "DisplayOrder", "ShowInListView", "ListViewOrder", "RelatedDisplayProperty", "DisplayFieldPath", "DisplayTemplate", "ListViewLabel", "ListViewType", "ListViewWidth", "ListViewEllipsis", "ListViewSortable", "FirstLetterFallbackField", "HelperText", "Name")
WHERE em."EntityName" = 'Opportunity'
AND NOT EXISTS (SELECT 1 FROM public."EntityFieldManagers" efm WHERE efm."EntityManagerId" = em."Id" AND efm."FieldName" = fd."FieldName");

-- ================================================================
-- OFFICE ENTITY FIELDS (insert only if EntityManager exists and field missing)
-- ================================================================
INSERT INTO public."EntityFieldManagers" (
    "EntityManagerId", "FieldName", "DataType", "Description", "IsRequired", "IsActive", "DefaultValue", "MaxLength", "DisplayOrder", "ShowInListView", "ListViewOrder", "RelatedDisplayProperty", "DisplayFieldPath", "DisplayTemplate", "ListViewLabel", "ListViewType", "ListViewWidth", "ListViewEllipsis", "ListViewSortable", "FirstLetterFallbackField", "HelperText",
    "Name", "Status", "CreatedBy", "CreatedDate", "LastModifiedBy", "LastModifiedDate", "IsDeleted", "DeletedBy", "DeletedDate"
)
SELECT em."Id", fd."FieldName", fd."DataType", fd."Description", fd."IsRequired", fd."IsActive", fd."DefaultValue", fd."MaxLength", fd."DisplayOrder", fd."ShowInListView", fd."ListViewOrder", fd."RelatedDisplayProperty", fd."DisplayFieldPath", fd."DisplayTemplate", fd."ListViewLabel", fd."ListViewType", fd."ListViewWidth", fd."ListViewEllipsis", fd."ListViewSortable", fd."FirstLetterFallbackField", fd."HelperText", fd."Name",
    0, 1, NOW(), 0, NULL::timestamptz, false, 0, NULL::timestamptz
FROM public."EntityManagers" em
CROSS JOIN (VALUES
    ('Name'::text, 'string'::text, 'Office name'::text, true, true, NULL::text, 300, 1, true, 1, NULL::text, 'name'::text, NULL::text, 'Name'::text, 'text'::text, '25%'::text, false, true, NULL::text, 'Office name'::text, 'Name'::text),
    ('Alias'::text, 'string'::text, 'Office alias or code (e.g. EDOF, AFRRO)'::text, false, true, NULL::text, 255, 2, true, 2, NULL::text, 'alias'::text, NULL::text, 'Alias'::text, 'text'::text, '15%'::text, true, true, NULL::text, 'Office alias or abbreviation'::text, 'Alias'::text),
    ('Code'::text, 'string'::text, 'Unique code matching OrganizationHierarchy.Code'::text, true, true, NULL::text, 50, 3, true, 3, NULL::text, 'code'::text, NULL::text, 'Code'::text, 'text'::text, '12%'::text, false, true, NULL::text, 'Office code (business key for link)'::text, 'Code'::text),
    ('Id'::text, 'int'::text, 'Office ID'::text, true, true, NULL::text, NULL::int, 4, true, 4, NULL::text, 'id'::text, NULL::text, 'ID'::text, 'text'::text, '8%'::text, false, true, NULL::text, 'Office identifier'::text, 'Id'::text),
    ('OrganizationHierarchyId'::text, 'int'::text, 'FK to OrganizationHierarchy; populated by matching Code'::text, false, true, NULL::text, NULL::int, 5, false, NULL::int, NULL::text, 'organizationHierarchyId'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Organization hierarchy reference'::text, 'OrganizationHierarchyId'::text),
    ('InternalName'::text, 'string'::text, 'Internal system name (path from root)'::text, false, true, NULL::text, 500, 6, false, NULL::int, NULL::text, 'internalName'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Internal system name (path from root)'::text, 'InternalName'::text),
    ('ExternalName'::text, 'string'::text, 'External name for the entity/business unit'::text, false, true, NULL::text, 255, 7, false, NULL::int, NULL::text, 'externalName'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'External name for the entity'::text, 'ExternalName'::text),
    ('OrganisationalEntityType'::text, 'string'::text, 'Organizational entity type (e.g. Regional Office, MCO, Project Office, Corporate)'::text, false, true, NULL::text, 100, 8, false, NULL::int, NULL::text, 'organisationalEntityType'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Organizational entity type'::text, 'OrganisationalEntityType'::text),
    ('HierarchyLevel'::text, 'int'::text, 'Office hierarchy level (1-5)'::text, false, true, NULL::text, NULL::int, 9, true, 5, NULL::text, 'hierarchyLevel'::text, NULL::text, 'Level'::text, 'text'::text, '8%'::text, false, true, NULL::text, 'Hierarchy level'::text, 'HierarchyLevel'::text),
    ('EffectiveDate'::text, 'date'::text, 'Date from which the office was made active in the structure'::text, false, true, NULL::text, NULL::int, 10, false, NULL::int, NULL::text, 'effectiveDate'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Date office became active'::text, 'EffectiveDate'::text),
    ('CostCentreId'::text, 'string'::text, 'Cost centre ID (Primary identifier for the organizational unit)'::text, false, true, NULL::text, 50, 11, true, 3, NULL::text, 'costCentreId'::text, NULL::text, 'Cost Centre'::text, 'text'::text, '12%'::text, false, true, NULL::text, 'Cost centre identifier'::text, 'CostCentreId'::text),
    ('FinancialCentreType'::text, 'string'::text, 'Financial centre type (Cost centre, Revenue Centre, etc.)'::text, false, true, NULL::text, 100, 12, false, NULL::int, NULL::text, 'financialCentreType'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Financial centre type'::text, 'FinancialCentreType'::text),
    ('Funding'::text, 'string'::text, 'Funding (JSON or comma-separated: Direct Costs, Management Expense, etc.)'::text, false, true, NULL::text, 500, 13, false, NULL::int, NULL::text, 'funding'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'Funding types'::text, 'Funding'::text),
    ('NerTarget'::text, 'decimal'::text, 'NER target (USD) for current fiscal year'::text, false, true, NULL::text, NULL::int, 14, false, NULL::int, NULL::text, 'nerTarget'::text, NULL::text, NULL::text, 'currency'::text, NULL::text, false, true, NULL::text, 'NER target in USD'::text, 'NerTarget'::text),
    ('NerTargetPeriod'::text, 'string'::text, 'NER target period (fiscal year)'::text, false, true, NULL::text, 20, 15, false, NULL::int, NULL::text, 'nerTargetPeriod'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'NER target period'::text, 'NerTargetPeriod'::text),
    ('EaTarget'::text, 'decimal'::text, 'EA target (USD)'::text, false, true, NULL::text, NULL::int, 16, false, NULL::int, NULL::text, 'eaTarget'::text, NULL::text, NULL::text, 'currency'::text, NULL::text, false, true, NULL::text, 'EA target in USD'::text, 'EaTarget'::text),
    ('EaTargetPeriod'::text, 'string'::text, 'EA target period (fiscal year)'::text, false, true, NULL::text, 20, 17, false, NULL::int, NULL::text, 'eaTargetPeriod'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, 'EA target period'::text, 'EaTargetPeriod'::text),
    ('ScopeType'::text, 'string'::text, 'Scope type (Functional or Geographic)'::text, false, true, NULL::text, 50, 18, true, 5, NULL::text, 'scopeType'::text, NULL::text, 'Scope'::text, 'text'::text, '10%'::text, false, true, NULL::text, 'Office scope type'::text, 'ScopeType'::text),
    ('Status'::text, 'int'::text, 'Office status (Active/Inactive)'::text, true, true, NULL::text, NULL::int, 19, true, 8, NULL::text, 'status'::text, NULL::text, 'Status'::text, 'badge'::text, '10%'::text, false, true, NULL::text, 'Office status'::text, 'Status'::text),
    ('ChildrenCount'::text, 'int'::text, 'Number of child offices'::text, false, true, NULL::text, NULL::int, 20, true, 6, NULL::text, 'childrenCount'::text, NULL::text, 'Child Offices'::text, 'text'::text, '12%'::text, false, true, NULL::text, 'Child offices count'::text, 'ChildrenCount'::text),
    ('Type'::text, 'string'::text, 'Office type (Executive Office, MCO, etc.)'::text, false, true, NULL::text, 100, 21, true, 7, NULL::text, 'type'::text, NULL::text, 'Type'::text, 'badge'::text, '15%'::text, false, true, NULL::text, 'Office type'::text, 'Type'::text),
    ('ParentId'::text, 'int'::text, 'Parent office ID'::text, false, true, NULL::text, NULL::int, 22, false, NULL::int, NULL::text, 'parentId'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, NULL::text, 'ParentId'::text),
    ('ParentName'::text, 'string'::text, 'Parent office name'::text, false, true, NULL::text, 200, 23, false, NULL::int, NULL::text, 'parentName'::text, NULL::text, NULL::text, 'text'::text, NULL::text, false, true, NULL::text, NULL::text, 'ParentName'::text),
    ('RegionalDirector'::text, 'string'::text, 'Regional Director for this office (from org unit role)'::text, false, true, NULL::text, 255, 24, true, 7, NULL::text, 'regionalDirector'::text, NULL::text, 'Regional Director'::text, 'text'::text, '15%'::text, false, true, NULL::text, 'Regional Director for this office'::text, 'RegionalDirector'::text)
) AS fd("FieldName", "DataType", "Description", "IsRequired", "IsActive", "DefaultValue", "MaxLength", "DisplayOrder", "ShowInListView", "ListViewOrder", "RelatedDisplayProperty", "DisplayFieldPath", "DisplayTemplate", "ListViewLabel", "ListViewType", "ListViewWidth", "ListViewEllipsis", "ListViewSortable", "FirstLetterFallbackField", "HelperText", "Name")
WHERE em."EntityName" = 'Office'
AND NOT EXISTS (SELECT 1 FROM public."EntityFieldManagers" efm WHERE efm."EntityManagerId" = em."Id" AND efm."FieldName" = fd."FieldName");

-- Update Office list view order for 7-field card layout: Name, Alias, CostCentreId, HierarchyLevel, ScopeType, ChildrenCount, RegionalDirector
UPDATE public."EntityFieldManagers" efm
SET "ShowInListView" = true, "ListViewOrder" = v."ListViewOrder", "ListViewLabel" = v."ListViewLabel"
FROM public."EntityManagers" em,
(VALUES
    ('Name'::text, 1, 'Name'::text),
    ('Alias'::text, 2, 'Alias'::text),
    ('CostCentreId'::text, 3, 'Cost Centre'::text),
    ('HierarchyLevel'::text, 4, 'Level'::text),
    ('ScopeType'::text, 5, 'Scope'::text),
    ('ChildrenCount'::text, 6, 'Child Offices'::text),
    ('RegionalDirector'::text, 7, 'Regional Director'::text)
) AS v("FieldName", "ListViewOrder", "ListViewLabel")
WHERE efm."EntityManagerId" = em."Id" AND em."EntityName" = 'Office' AND efm."FieldName" = v."FieldName";

-- Hide Code and Id from Office list view; push Type/Status to end (badges shown as tags)
UPDATE public."EntityFieldManagers" efm
SET "ShowInListView" = v."ShowInListView", "ListViewOrder" = v."ListViewOrder"
FROM public."EntityManagers" em,
(VALUES
    ('Code'::text, false, NULL::int),
    ('Id'::text, false, NULL::int),
    ('Type'::text, true, 8),
    ('Status'::text, true, 9)
) AS v("FieldName", "ShowInListView", "ListViewOrder")
WHERE efm."EntityManagerId" = em."Id" AND em."EntityName" = 'Office' AND efm."FieldName" = v."FieldName";
