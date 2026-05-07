using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSDataAccess.Seed.Seeders;

/// <summary>
/// Seeds Regional Management Oversight Advisor (RMOA) <see cref="EntityUserRole"/> rows from the practitioner list
/// (Connected Sheets export as of seed authoring). Uses <see cref="RoleSheetRoleSource"/> so EDS Mgmt sync does not
/// treat these as orphans. Update <see cref="RmoaSeedRows"/> when the source list changes.
/// </summary>
public static class RegionalManagementOversightAdvisorRoleSheetSeeder
{
    /// <summary>Must match EDS / integration expectations for sheet-driven roles outside BigQuery Mgmt.</summary>
    public const string RoleSheetRoleSource = "RoleSheet";

    public const string RmoaEntityRoleCode = "Regional_Management_Oversight_Advisor_OrganizationHierarchy";

    private const string OrganizationHierarchyEntityType = "OrganizationHierarchy";
    private const int SystemUserId = 1;

    /// <summary>
    /// Source: RMOA+HQ equivalents list (Org_Unit_Work_At = org hierarchy B-code + description, email = PAO login).
    /// </summary>
    private static readonly RmoaSeedRow[] RmoaSeedRows =
    [
        new(
            OrgUnitCode: "B5303",
            Email: "idrisa@unops.org",
            ResourceId: "2345",
            PositionTitle: "Management and Oversight Senior Advisor",
            OrgUnitWorksAt: "B5303, AFR, ESAMCO, East and Southern Africa MCO",
            EffectiveDateUtc: new DateTime(2026, 4, 23, 0, 0, 0, DateTimeKind.Utc)),
        new(
            OrgUnitCode: "B0050",
            Email: "christaa@unops.org",
            ResourceId: "221526",
            PositionTitle: "Management and Oversight Senior Advisor",
            OrgUnitWorksAt: "B0050, ECR, ECROD, Office of the RD",
            EffectiveDateUtc: new DateTime(2026, 4, 23, 0, 0, 0, DateTimeKind.Utc)),
        new(
            OrgUnitCode: "B5009",
            Email: "robertgodin@unops.org",
            ResourceId: "62336",
            PositionTitle: "Management and Oversight Senior Advisor",
            OrgUnitWorksAt: "B5009, GPO, GPOOD, Office of the Director",
            EffectiveDateUtc: new DateTime(2026, 4, 23, 0, 0, 0, DateTimeKind.Utc)),
        new(
            OrgUnitCode: "B0054",
            Email: "paolab@unops.org",
            ResourceId: "63748",
            PositionTitle: "Management and Oversight Senior Advisor",
            OrgUnitWorksAt: "B0054, LCR, LCROD, Office of the RD",
            EffectiveDateUtc: new DateTime(2026, 4, 23, 0, 0, 0, DateTimeKind.Utc)),
        new(
            OrgUnitCode: "B5120",
            Email: "claudiaa@unops.org",
            ResourceId: "73399",
            PositionTitle: "Management and Oversight Senior Advisor",
            OrgUnitWorksAt: "B5120, MR, MROD, Office of the RD",
            EffectiveDateUtc: new DateTime(2026, 4, 23, 0, 0, 0, DateTimeKind.Utc)),
    ];

    public static async Task SeedRegionalManagementOversightAdvisorRoleSheetAsync(UNOPSAppDbContext context)
    {
        Console.WriteLine($"Starting {nameof(RegionalManagementOversightAdvisorRoleSheetSeeder)}...");

        var entityRole = await context.EntityRoles
            .FirstOrDefaultAsync(
                er => er.Code == RmoaEntityRoleCode && er.EntityType == OrganizationHierarchyEntityType && !er.IsDeleted);

        if (entityRole == null)
        {
            Console.WriteLine($"Skip RMOA RoleSheet seed: entity role '{RmoaEntityRoleCode}' not found. Run EntityRoleSeeder first.");
            return;
        }

        var orgRows = await context.OrganizationHierarchies
            .AsNoTracking()
            .Where(oh => oh.Type == OrganizationUnitType.OrgUnit && !oh.IsDeleted && oh.Code != null)
            .Select(oh => new { oh.Id, Code = oh.Code! })
            .ToListAsync();

        var codeToOrgId = orgRows.ToDictionary(x => x.Code, x => x.Id, StringComparer.OrdinalIgnoreCase);

        var emailRows = await context.PAOUsers
            .AsNoTracking()
            .Where(u => u.Email != null && u.ActiveUser)
            .Select(u => new { u.Id, Email = u.Email!.ToLowerInvariant() })
            .ToListAsync();

        var emailMap = emailRows
            .GroupBy(x => x.Email)
            .ToDictionary(g => g.Key, g => g.First().Id);

        var targets = new Dictionary<int, RmoaTarget>();
        var skippedNoOrg = 0;
        var skippedNoUser = 0;

        foreach (var row in RmoaSeedRows)
        {
            var orgCode = row.OrgUnitCode.Trim();
            var email = row.Email.Trim().ToLowerInvariant();
            if (string.IsNullOrEmpty(orgCode) || string.IsNullOrEmpty(email))
                continue;

            if (!codeToOrgId.TryGetValue(orgCode, out var entityId))
            {
                skippedNoOrg++;
                Console.WriteLine($"RMOA RoleSheet: no OrganizationHierarchy OrgUnit with code '{orgCode}' — skip ({email}).");
                continue;
            }

            if (!emailMap.TryGetValue(email, out var userId))
            {
                skippedNoUser++;
                Console.WriteLine($"RMOA RoleSheet: no active PAO user for email '{email}' — skip org {orgCode}.");
                continue;
            }

            var positionTitle = Truncate(row.PositionTitle.Trim(), 255);
            var orgUnitWorksAt = Truncate(row.OrgUnitWorksAt.Trim(), 255);
            var resourceId = string.IsNullOrWhiteSpace(row.ResourceId) ? null : Truncate(row.ResourceId.Trim(), 50);

            targets[entityId] = new RmoaTarget(
                entityId,
                userId,
                positionTitle,
                orgUnitWorksAt,
                row.EffectiveDateUtc,
                resourceId);
        }

        var entityRoleId = entityRole.Id;
        var existing = await context.Set<EntityUserRole>()
            .Where(e =>
                !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityRoleId == entityRoleId &&
                e.RoleSource == RoleSheetRoleSource)
            .OrderBy(e => e.Id)
            .ToListAsync();

        var existingByEntityId = existing
            .GroupBy(e => e.EntityId)
            .ToDictionary(g => g.Key, g => g.OrderBy(r => r.Id).ToList());

        var now = DateTime.UtcNow;
        var upserted = 0;
        var deleted = 0;

        foreach (var (entityId, rows) in existingByEntityId)
        {
            if (!targets.ContainsKey(entityId))
            {
                foreach (var r in rows.Where(x => !x.IsDeleted))
                {
                    r.SetDeleteAuditData(SystemUserId);
                    deleted++;
                }
            }
        }

        foreach (var (entityId, target) in targets)
        {
            if (!existingByEntityId.TryGetValue(entityId, out var rows))
                rows = new List<EntityUserRole>();

            var activeRows = rows.Where(r => !r.IsDeleted).ToList();
            var keep = activeRows.FirstOrDefault(r => r.UserId == target.UserId);

            foreach (var extra in activeRows.Where(r => r.Id != keep?.Id))
            {
                extra.SetDeleteAuditData(SystemUserId);
                deleted++;
            }

            if (keep != null)
            {
                keep.UserId = target.UserId;
                keep.PositionTitle = target.PositionTitle;
                keep.OrgUnitWorksAt = target.OrgUnitWorksAt;
                keep.ApplicabilityPeriodStart = target.ApplicabilityStart;
                keep.OfficerInChargeResourceId = target.ResourceId;
                keep.Name = BuildRecordName(entityId, target.UserId);
                keep.LastModifiedBy = SystemUserId;
                keep.LastModifiedDate = now;
                upserted++;
                continue;
            }

            var restored = rows.FirstOrDefault(r => r.IsDeleted && r.UserId == target.UserId);
            if (restored != null)
            {
                restored.IsDeleted = false;
                restored.DeletedBy = default;
                restored.DeletedDate = null;
                restored.UserId = target.UserId;
                restored.PositionTitle = target.PositionTitle;
                restored.OrgUnitWorksAt = target.OrgUnitWorksAt;
                restored.ApplicabilityPeriodStart = target.ApplicabilityStart;
                restored.OfficerInChargeResourceId = target.ResourceId;
                restored.Name = BuildRecordName(entityId, target.UserId);
                restored.LastModifiedBy = SystemUserId;
                restored.LastModifiedDate = now;
                upserted++;
                continue;
            }

            var insert = new EntityUserRole
            {
                UserId = target.UserId,
                EntityRoleId = entityRoleId,
                EntityId = entityId,
                EntityType = OrganizationHierarchyEntityType,
                RoleSource = RoleSheetRoleSource,
                PositionTitle = target.PositionTitle,
                OrgUnitWorksAt = target.OrgUnitWorksAt,
                ApplicabilityPeriodStart = target.ApplicabilityStart,
                ApplicabilityPeriodEnd = null,
                OfficerInChargeResourceId = target.ResourceId,
                Name = BuildRecordName(entityId, target.UserId),
                Status = EntityStatus.Active,
                WorkflowStatus = WorkflowStatus.None,
                CreatedBy = SystemUserId,
                CreatedDate = now,
                LastModifiedBy = SystemUserId,
                LastModifiedDate = now,
                IsDeleted = false,
            };
            context.Set<EntityUserRole>().Add(insert);
            upserted++;
        }

        await context.SaveChangesAsync();

        Console.WriteLine(
            $"RMOA RoleSheet seed complete. Targets: {targets.Count}, upserts: {upserted}, soft-deleted: {deleted}, skipped (no org): {skippedNoOrg}, skipped (no user): {skippedNoUser}.");
    }

    private sealed record RmoaSeedRow(
        string OrgUnitCode,
        string Email,
        string? ResourceId,
        string PositionTitle,
        string OrgUnitWorksAt,
        DateTime? EffectiveDateUtc);

    private sealed record RmoaTarget(
        int EntityId,
        int UserId,
        string? PositionTitle,
        string? OrgUnitWorksAt,
        DateTime? ApplicabilityStart,
        string? ResourceId);

    private static string BuildRecordName(int entityId, int userId) =>
        $"RoleSheet-RMOA-{entityId}-{userId}";

    private static string? Truncate(string? value, int max)
    {
        if (string.IsNullOrEmpty(value))
            return value;
        value = value.Trim();
        return value.Length <= max ? value : value[..max];
    }
}
