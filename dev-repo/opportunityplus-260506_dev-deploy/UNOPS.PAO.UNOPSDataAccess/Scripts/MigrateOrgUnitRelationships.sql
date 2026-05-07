-- =============================================================================
-- Migrate OrganizationUnitRelationships -> OfficeRelationships (PostgreSQL)
-- =============================================================================
-- Prerequisites:
--   - public."OrganizationUnitRelationships" populated (legacy polymorphic links)
--   - public."OfficeRelationships" table exists (see migration MigrateOrgUnitToOfficeRelationship)
--   - public."Offices" rows linked to hierarchies ("OrganizationHierarchyId" and/or "Code")
--
-- Behaviour:
--   - For each OUR row, resolves exactly one Office:
--       1) Prefer Office where NOT "IsDeleted" AND "OrganizationHierarchyId" = OUR."OrganizationHierarchyId"
--       2) Else Office where NOT "IsDeleted" AND "Code" = OrganizationHierarchies."Code" for that hierarchy Id
--       3) Picks deterministic smallest Office."Id" when multiple match
--   - Inserts a matching OfficeRelationship with the same audit / soft-delete fields as OUR
--   - Idempotent: ON CONFLICT DO NOTHING on unique ("EntityId", "EntityType", "OfficeId")
--
-- Does NOT drop or modify OrganizationUnitRelationships (safe to re-run; clean up separately if desired).
-- =============================================================================

BEGIN;

-- Optional: preview rows that cannot be mapped (no office found)
-- SELECT our.*
-- FROM public."OrganizationUnitRelationships" AS our
-- WHERE NOT EXISTS (
--   SELECT 1 FROM public."Offices" AS o
--   WHERE NOT o."IsDeleted"
--     AND o."OrganizationHierarchyId" IS NOT NULL
--     AND o."OrganizationHierarchyId" = our."OrganizationHierarchyId"
-- )
-- AND NOT EXISTS (
--   SELECT 1
--   FROM public."OrganizationHierarchies" AS h
--   INNER JOIN public."Offices" AS o ON NOT o."IsDeleted" AND o."Code" = h."Code"
--   WHERE h."Id" = our."OrganizationHierarchyId"
-- );

INSERT INTO public."OfficeRelationships" (
    "OfficeId",
    "EntityId",
    "EntityType",
    "Name",
    "Status",
    "WorkflowStatus",
    "CreatedBy",
    "CreatedDate",
    "LastModifiedBy",
    "LastModifiedDate",
    "IsDeleted",
    "DeletedBy",
    "DeletedDate"
)
SELECT
    x."OfficeId",
    our."EntityId",
    our."EntityType",
    CASE
        WHEN our."Name" IS NOT NULL AND our."Name" <> '' THEN our."Name"
        ELSE our."EntityType" || '-' || our."EntityId"::text || '-' || x."OfficeCode"
    END AS "Name",
    our."Status",
    our."WorkflowStatus",
    our."CreatedBy",
    our."CreatedDate",
    our."LastModifiedBy",
    our."LastModifiedDate",
    our."IsDeleted",
    our."DeletedBy",
    our."DeletedDate"
FROM public."OrganizationUnitRelationships" AS our
INNER JOIN LATERAL (
    SELECT o."Id" AS "OfficeId", o."Code" AS "OfficeCode"
    FROM public."Offices" AS o
    WHERE NOT o."IsDeleted"
      AND (
          (o."OrganizationHierarchyId" IS NOT NULL AND o."OrganizationHierarchyId" = our."OrganizationHierarchyId")
          OR o."Code" = (
              SELECT h."Code"
              FROM public."OrganizationHierarchies" AS h
              WHERE h."Id" = our."OrganizationHierarchyId"
              LIMIT 1
          )
      )
    ORDER BY
        CASE
            WHEN o."OrganizationHierarchyId" IS NOT NULL AND o."OrganizationHierarchyId" = our."OrganizationHierarchyId" THEN 0
            ELSE 1
        END,
        o."Id"
    LIMIT 1
) AS x ON TRUE
ON CONFLICT ("EntityId", "EntityType", "OfficeId") DO NOTHING;

COMMIT;

-- Verification examples (run after commit):
-- SELECT COUNT(*) FROM public."OrganizationUnitRelationships";
-- SELECT COUNT(*) FROM public."OfficeRelationships";
-- SELECT our."Id", our."EntityId", our."EntityType", our."OrganizationHierarchyId"
-- FROM public."OrganizationUnitRelationships" our
-- WHERE NOT EXISTS (
--   SELECT 1 FROM public."Offices" o
--   WHERE NOT o."IsDeleted" AND o."OrganizationHierarchyId" = our."OrganizationHierarchyId"
-- )
-- AND NOT EXISTS (
--   SELECT 1 FROM public."OrganizationHierarchies" h
--   JOIN public."Offices" o ON NOT o."IsDeleted" AND o."Code" = h."Code"
--   WHERE h."Id" = our."OrganizationHierarchyId"
-- );
