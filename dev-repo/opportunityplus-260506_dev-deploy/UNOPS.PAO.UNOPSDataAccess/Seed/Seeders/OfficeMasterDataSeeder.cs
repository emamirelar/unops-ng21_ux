using System.Globalization;
using System.Text;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using Microsoft.Extensions.Configuration;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSDataAccess.Seed.Seeders;

/// <summary>
/// Updates Office entities with MASTER Office Data from Google Sheets.
/// Matches by Cost Centre (Office.Code / CostCentreId).
/// Updates: Alias (from sheet “Alias” column — not overwritten by offices EDS sync), HierarchyLevel,
/// OrganisationalEntityType, ScopeType, Funding, FinancialCentreType,
/// ParentOrganizationHierarchyId (Parent cost centre code → OrganizationHierarchy.Code), EstablishedBy.
/// Columns Q–R–S: Director/Manager, Director/Manager OiC, HSSE Coordinator — upserts <see cref="EntityUserRole"/>
/// with <see cref="OfficeMasterDataSeeder.OfficeMasterRoleSource"/> (not touched by EDS Mgmt orphan cleanup).
/// Source: https://docs.google.com/spreadsheets/d/16Uuw1ilo1J-I8dIbpUS0HYcbrNubukdY5XDDHBBRua0
/// Sheet: &lt;MASTER&gt; Office Data (row 1 = header).
/// </summary>
public static class OfficeMasterDataSeeder
{
    private const string DefaultSpreadsheetId = "16Uuw1ilo1J-I8dIbpUS0HYcbrNubukdY5XDDHBBRua0";
    private const string DefaultSheetName = "<MASTER> Office Data";

    /// <summary>RoleSource for sheet-driven operational assignments; must differ from <c>Mgmt</c> (EDS).</summary>
    public const string OfficeMasterRoleSource = "OfficeMaster";

    private const string OrganizationHierarchyEntityType = "OrganizationHierarchy";

    private const string EntityRoleCodeOrganizationalDirector = "Organizational_Director_OrganizationHierarchy";
    private const string EntityRoleCodeOrganizationalDeputyDirector = "Organizational_Deputy_Director_OrganizationHierarchy";
    private const string EntityRoleCodeOrganizationalHsseCoordinator = "Organizational_HSSE_Coordinator_OrganizationHierarchy";

    /// <summary>Prior roles used for sheet columns before splitting into Organizational_* codes; OfficeMaster assignments only.</summary>
    private static readonly string[] LegacyOfficeMasterSheetEntityRoleCodes =
    [
        "OfficeMaster_Director_Manager_OrganizationHierarchy",
        "Director_Manager_OiC_OrganizationHierarchy",
        "HSSE_Coordinator_OrganizationHierarchy",
    ];

    /// <summary>0-based column indices: Q, R, S.</summary>
    private const int ColDirectorManager = 16;

    private const int ColDirectorManagerOiC = 17;
    private const int ColHsseCoordinator = 18;

    private const int SystemUserId = 1;

    /// <summary>
    /// Result of Office Master Data import.
    /// </summary>
    public sealed record ImportResult(
        bool Success,
        int Updated,
        int Skipped,
        int NotFound,
        int RolesUpserted,
        int RolesSoftDeleted,
        int RolesSkippedNoUser,
        int RolesSkippedNoOrgLink,
        int RolesSkippedDuplicateName,
        string? ErrorMessage);

    public static async Task SeedOfficeMasterDataAsync(UNOPSAppDbContext context, IServiceProvider serviceProvider)
    {
        Console.WriteLine("🔄 Seeding Office Master Data from Google Sheets...");
        var result = await ImportOfficeMasterDataAsync(context, serviceProvider);

        if (!result.Success)
        {
            Console.WriteLine($"  ⚠️  {result.ErrorMessage}");
            Console.WriteLine("  Skipping Office Master Data seeding.");
            return;
        }

        Console.WriteLine($"✅ Office Master Data seeding completed.");
        Console.WriteLine($"   📊 Offices — Updated: {result.Updated}, Skipped: {result.Skipped}, NotFound: {result.NotFound}");
        Console.WriteLine(
            $"   📊 Roles — Upserted: {result.RolesUpserted}, SoftDeleted: {result.RolesSoftDeleted}, NoUser: {result.RolesSkippedNoUser}, NoOrg: {result.RolesSkippedNoOrgLink}, AmbiguousName: {result.RolesSkippedDuplicateName}");
        Console.WriteLine();
    }

    /// <summary>
    /// Imports Office Master Data from Google Sheets and returns statistics.
    /// Can be called from the seeding pipeline or from a dedicated API endpoint.
    /// </summary>
    public static async Task<ImportResult> ImportOfficeMasterDataAsync(
        UNOPSAppDbContext context,
        IServiceProvider serviceProvider)
    {
        var configuration = serviceProvider?.GetService(typeof(IConfiguration)) as IConfiguration;
        var spreadsheetId = configuration?["OfficeMasterData:SpreadsheetId"] ?? DefaultSpreadsheetId;
        var sheetName = configuration?["OfficeMasterData:SheetName"] ?? DefaultSheetName;

        IList<IList<object>>? values;
        try
        {
            var credential = serviceProvider?.GetService(typeof(GoogleCredential)) as GoogleCredential;
            values = await FetchSheetDataAsync(spreadsheetId, sheetName, credential);
        }
        catch (Exception ex)
        {
            return new ImportResult(false, 0, 0, 0, 0, 0, 0, 0, 0,
                $"Failed to read Google Sheet: {ex.Message}. Ensure you have access to the sheet and credentials are configured (e.g. gcloud auth application-default login).");
        }

        if (values == null || values.Count < 2)
            return new ImportResult(false, 0, 0, 0, 0, 0, 0, 0, 0, "No data rows in sheet.");

        var rows = ParseSheetValues(values);
        var offices = await context.Set<Office>()
            .Where(o => !o.IsDeleted)
            .ToDictionaryAsync(o => o.Code, o => o);

        var hierarchyRows = await context.Set<OrganizationHierarchy>()
            .AsNoTracking()
            .Where(h => !h.IsDeleted)
            .Select(h => new { h.Code, h.Id })
            .ToListAsync();

        var orgHierarchyByCode = hierarchyRows
            .Where(x => !string.IsNullOrWhiteSpace(x.Code))
            .GroupBy(x => x.Code.Trim(), StringComparer.OrdinalIgnoreCase)
            .ToDictionary(g => g.Key, g => g.First().Id, StringComparer.OrdinalIgnoreCase);

        int updated = 0;
        int notFound = 0;
        int skipped = 0;

        foreach (var row in rows)
        {
            var costCentre = row.CostCentre?.Trim();
            if (string.IsNullOrEmpty(costCentre) || IsNa(costCentre))
                continue;

            if (!offices.TryGetValue(costCentre, out var office))
            {
                notFound++;
                continue;
            }

            var funding = BuildFundingString(row.ManagementExpense, row.DirectCostSharedServices, row.DirectCosts);
            var hierarchyLevel = ParseIntOrNull(row.LevelInOperationalHierarchy);
            var type = Normalize(row.Type);
            var scopeType = Normalize(row.ScopeType);
            var financialCentreType = Normalize(row.FinancialCentreType);
            var establishedBy = Normalize(row.EstablishedBy);
            var alias = Normalize(row.Alias);

            int? parentOrganizationHierarchyId = null;
            var parentCode = Normalize(row.ParentCostCentreCode);
            if (parentCode != null &&
                orgHierarchyByCode.TryGetValue(parentCode, out var parentHierarchyId))
            {
                parentOrganizationHierarchyId = parentHierarchyId;
            }

            var hasChanges =
                office.Alias != alias ||
                office.HierarchyLevel != hierarchyLevel ||
                office.OrganisationalEntityType != type ||
                office.ScopeType != scopeType ||
                office.Funding != funding ||
                office.FinancialCentreType != financialCentreType ||
                office.ParentOrganizationHierarchyId != parentOrganizationHierarchyId ||
                office.EstablishedBy != establishedBy;

            if (!hasChanges)
            {
                skipped++;
                continue;
            }

            office.Alias = alias;
            office.HierarchyLevel = hierarchyLevel;
            office.OrganisationalEntityType = type;
            office.ScopeType = scopeType;
            office.Funding = funding;
            office.FinancialCentreType = financialCentreType;
            office.ParentOrganizationHierarchyId = parentOrganizationHierarchyId;
            office.EstablishedBy = establishedBy;
            updated++;
        }

        await context.SaveChangesAsync();

        var roleSync = await SyncOfficeMasterOperationalRolesAsync(context, rows, offices, orgHierarchyByCode);

        await context.SaveChangesAsync();

        return new ImportResult(
            true,
            updated,
            skipped,
            notFound,
            roleSync.Upserted,
            roleSync.SoftDeleted,
            roleSync.SkippedNoUser,
            roleSync.SkippedNoOrgLink,
            roleSync.SkippedDuplicateName,
            null);
    }

    private sealed record RoleSyncCounters(
        int Upserted,
        int SoftDeleted,
        int SkippedNoUser,
        int SkippedNoOrgLink,
        int SkippedDuplicateName);

    private sealed class RoleOperationCounters
    {
        public int Upserted;
        public int SoftDeleted;
        public int SkippedNoUser;
        public int SkippedNoOrg;
        public int SkippedDuplicateName;
    }

    /// <summary>EntityRole Id and display <see cref="EntityUserRole.PositionTitle"/> (from seeded <see cref="EntityRole.Name"/>).</summary>
    private sealed record OfficeMasterRoleSlot(int EntityRoleId, string PositionTitle);

    /// <summary>Removes sheet-driven rows that used previous EntityRole codes (one combined director role + shared OiC/HSSE codes).</summary>
    private static async Task SoftDeleteLegacyOfficeMasterAssignmentsAsync(UNOPSAppDbContext context)
    {
        var assignments = await context.Set<EntityUserRole>()
            .Include(e => e.EntityRole)
            .Where(e =>
                !e.IsDeleted &&
                e.RoleSource == OfficeMasterRoleSource &&
                e.EntityRole != null &&
                e.EntityRole.Code != null &&
                LegacyOfficeMasterSheetEntityRoleCodes.Contains(e.EntityRole.Code))
            .ToListAsync();

        foreach (var e in assignments)
            e.SetDeleteAuditData(SystemUserId);
    }

    private static async Task<RoleSyncCounters> SyncOfficeMasterOperationalRolesAsync(
        UNOPSAppDbContext context,
        List<MasterOfficeRow> rows,
        Dictionary<string, Office> officesByCode,
        Dictionary<string, int> orgHierarchyByCode)
    {
        await SoftDeleteLegacyOfficeMasterAssignmentsAsync(context);

        var roleRows = await context.Set<EntityRole>()
            .AsNoTracking()
            .Where(er =>
                !er.IsDeleted &&
                er.Code != null &&
                (er.Code == EntityRoleCodeOrganizationalDirector ||
                 er.Code == EntityRoleCodeOrganizationalDeputyDirector ||
                 er.Code == EntityRoleCodeOrganizationalHsseCoordinator))
            .Select(er => new { er.Id, er.Code, er.Name })
            .ToListAsync();

        OfficeMasterRoleSlot? slotFor(string code)
        {
            foreach (var r in roleRows)
            {
                if (string.Equals(r.Code, code, StringComparison.Ordinal))
                    return new OfficeMasterRoleSlot(
                        r.Id,
                        TruncatePositionTitle(string.IsNullOrWhiteSpace(r.Name) ? code : r.Name));
            }

            return null;
        }

        var directorSlot = slotFor(EntityRoleCodeOrganizationalDirector);
        var deputySlot = slotFor(EntityRoleCodeOrganizationalDeputyDirector);
        var hsseSlot = slotFor(EntityRoleCodeOrganizationalHsseCoordinator);
        if (directorSlot == null || deputySlot == null || hsseSlot == null)
        {
            Console.WriteLine(
                "  ⚠️  Office Master role sync skipped: one or more EntityRoles missing (run EntityRole seeder). " +
                $"Expected codes: {EntityRoleCodeOrganizationalDirector}, {EntityRoleCodeOrganizationalDeputyDirector}, {EntityRoleCodeOrganizationalHsseCoordinator}.");
            return new RoleSyncCounters(0, 0, 0, 0, 0);
        }

        var profileLookups = await BuildUserProfileLookupCachesAsync(context);
        var orgHierarchyDescriptionByCode = await BuildOrgHierarchyDescriptionByCodeAsync(context);

        var roleOps = new RoleOperationCounters();

        foreach (var row in rows)
        {
            var costCentre = row.CostCentre?.Trim();
            if (string.IsNullOrEmpty(costCentre) || IsNa(costCentre))
                continue;

            if (!officesByCode.TryGetValue(costCentre, out var office))
                continue;

            if (!TryResolveOrganizationHierarchyId(office, orgHierarchyByCode, out var entityId))
            {
                roleOps.SkippedNoOrg += CountNonEmptyRoles(row);
                continue;
            }

            await ProcessRoleColumnAsync(
                context,
                row.DirectorManagerName,
                entityId,
                directorSlot.EntityRoleId,
                directorSlot.PositionTitle,
                office,
                profileLookups.NameToUserIds,
                profileLookups.UserIdToPosition,
                profileLookups.UserIdToOrgUnit,
                orgHierarchyDescriptionByCode,
                roleOps);
            await ProcessRoleColumnAsync(
                context,
                row.DirectorManagerOiCName,
                entityId,
                deputySlot.EntityRoleId,
                deputySlot.PositionTitle,
                office,
                profileLookups.NameToUserIds,
                profileLookups.UserIdToPosition,
                profileLookups.UserIdToOrgUnit,
                orgHierarchyDescriptionByCode,
                roleOps);
            await ProcessRoleColumnAsync(
                context,
                row.HsseCoordinatorName,
                entityId,
                hsseSlot.EntityRoleId,
                hsseSlot.PositionTitle,
                office,
                profileLookups.NameToUserIds,
                profileLookups.UserIdToPosition,
                profileLookups.UserIdToOrgUnit,
                orgHierarchyDescriptionByCode,
                roleOps);
        }

        return new RoleSyncCounters(
            roleOps.Upserted,
            roleOps.SoftDeleted,
            roleOps.SkippedNoUser,
            roleOps.SkippedNoOrg,
            roleOps.SkippedDuplicateName);
    }

    private static int CountNonEmptyRoles(MasterOfficeRow row)
    {
        var n = 0;
        if (!string.IsNullOrWhiteSpace(NormalizePersonNameCell(row.DirectorManagerName)))
            n++;
        if (!string.IsNullOrWhiteSpace(NormalizePersonNameCell(row.DirectorManagerOiCName)))
            n++;
        if (!string.IsNullOrWhiteSpace(NormalizePersonNameCell(row.HsseCoordinatorName)))
            n++;
        return n;
    }

    private static bool TryResolveOrganizationHierarchyId(
        Office office,
        Dictionary<string, int> orgHierarchyByCode,
        out int entityId)
    {
        if (office.OrganizationHierarchyId is { } hid && hid > 0)
        {
            entityId = hid;
            return true;
        }

        var code = office.Code?.Trim();
        if (code != null && orgHierarchyByCode.TryGetValue(code, out var id))
        {
            entityId = id;
            return true;
        }

        entityId = default;
        return false;
    }

    private static async Task ProcessRoleColumnAsync(
        UNOPSAppDbContext context,
        string? sheetCell,
        int entityId,
        int entityRoleId,
        string fallbackPositionTitle,
        Office office,
        Dictionary<string, List<int>> nameToUserIds,
        Dictionary<int, string?> userIdToPosition,
        Dictionary<int, string?> userIdToOrgUnit,
        Dictionary<string, string?> orgHierarchyDescriptionByCode,
        RoleOperationCounters c)
    {
        var normalizedCell = NormalizePersonNameCell(sheetCell);

        if (string.IsNullOrEmpty(normalizedCell))
        {
            var toClear = await context.Set<EntityUserRole>()
                .Where(e =>
                    !e.IsDeleted &&
                    e.EntityType == OrganizationHierarchyEntityType &&
                    e.EntityId == entityId &&
                    e.EntityRoleId == entityRoleId &&
                    e.RoleSource == OfficeMasterRoleSource)
                .ToListAsync();

            foreach (var existing in toClear)
            {
                existing.SetDeleteAuditData(SystemUserId);
                c.SoftDeleted++;
            }

            return;
        }

        var resolve = ResolveUserIdFromSheetName(normalizedCell, nameToUserIds);
        if (resolve.Ambiguous)
            c.SkippedDuplicateName++;
        if (!resolve.UserId.HasValue)
        {
            c.SkippedNoUser++;
            return;
        }

        var userId = resolve.UserId.Value;
        var positionTitle = TruncatePositionTitle(
            ResolvePositionTitleFromUserProfile(userId, userIdToPosition, fallbackPositionTitle));
        var orgWorksAtFallback = office.ExternalName ?? office.Name ?? office.Code ?? string.Empty;
        var orgUnitWorksAt = ResolveOrgUnitWorksAtFromUserProfile(
            userId,
            userIdToOrgUnit,
            orgHierarchyDescriptionByCode,
            orgWorksAtFallback);
        var orgLabel = office.Code ?? entityId.ToString(CultureInfo.InvariantCulture);
        var recordName =
            $"OfficeMaster-{orgLabel}-{entityRoleId}-{userId}";
        var now = DateTime.UtcNow;

        var matches = await context.Set<EntityUserRole>()
            .Where(e =>
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == entityId &&
                e.EntityRoleId == entityRoleId &&
                e.RoleSource == OfficeMasterRoleSource)
            .OrderBy(e => e.IsDeleted ? 1 : 0)
            .ThenBy(e => e.Id)
            .ToListAsync();

        var assignment = matches.FirstOrDefault();
        if (matches.Count > 1)
        {
            foreach (var extra in matches.Skip(1).Where(e => !e.IsDeleted))
            {
                extra.SetDeleteAuditData(SystemUserId);
                c.SoftDeleted++;
            }
        }

        if (assignment == null)
        {
            context.Set<EntityUserRole>().Add(new EntityUserRole
            {
                Name = recordName,
                Status = EntityStatus.Active,
                WorkflowStatus = WorkflowStatus.None,
                CreatedBy = SystemUserId,
                CreatedDate = now,
                LastModifiedBy = SystemUserId,
                LastModifiedDate = now,
                IsDeleted = false,
                UserId = userId,
                EntityRoleId = entityRoleId,
                EntityId = entityId,
                EntityType = OrganizationHierarchyEntityType,
                RoleSource = OfficeMasterRoleSource,
                PositionTitle = positionTitle,
                OrgUnitWorksAt = orgUnitWorksAt,
            });
            c.Upserted++;
            return;
        }

        if (assignment.IsDeleted)
        {
            assignment.IsDeleted = false;
            assignment.DeletedBy = default;
            assignment.DeletedDate = null;
        }

        assignment.UserId = userId;
        assignment.EntityRoleId = entityRoleId;
        assignment.EntityId = entityId;
        assignment.Name = recordName;
        assignment.LastModifiedBy = SystemUserId;
        assignment.LastModifiedDate = now;
        assignment.PositionTitle = positionTitle;
        assignment.OrgUnitWorksAt = orgUnitWorksAt;
        c.Upserted++;
    }

    /// <summary>
    /// Uses <see cref="UserProfile.Position"/> when set; otherwise the entity-role display title from the sheet slot.
    /// </summary>
    private static string ResolvePositionTitleFromUserProfile(
        int userId,
        Dictionary<int, string?> userIdToPosition,
        string fallbackFromEntityRole)
    {
        if (userIdToPosition.TryGetValue(userId, out var pos) && !string.IsNullOrWhiteSpace(pos))
            return pos.Trim();

        return fallbackFromEntityRole;
    }

    /// <summary><see cref="EntityUserRole.PositionTitle"/> max length is 255.</summary>
    private static string TruncatePositionTitle(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
            return string.Empty;
        const int maxLen = 255;
        var t = name.Trim();
        return t.Length <= maxLen ? t : t[..maxLen];
    }

    /// <summary>
    /// <see cref="UserProfile.OrgUnit"/> holds People Search <c>Org_Unit_Work_At</c> (code); append
    /// <see cref="OrganizationHierarchy.Description"/> when the code matches. Fallback: office display label.
    /// </summary>
    private static string ResolveOrgUnitWorksAtFromUserProfile(
        int userId,
        Dictionary<int, string?> userIdToOrgUnit,
        Dictionary<string, string?> orgHierarchyDescriptionByCode,
        string fallbackOfficeLabel)
    {
        if (!userIdToOrgUnit.TryGetValue(userId, out var ou) || string.IsNullOrWhiteSpace(ou))
            return TruncateOrgUnitWorksAt(fallbackOfficeLabel);

        var code = ou.Trim();
        if (orgHierarchyDescriptionByCode.TryGetValue(code, out var desc) && !string.IsNullOrWhiteSpace(desc))
        {
            var d = desc.Trim();
            if (!string.Equals(code, d, StringComparison.OrdinalIgnoreCase))
                return TruncateOrgUnitWorksAt($"{code}, {d}");
        }

        return TruncateOrgUnitWorksAt(code);
    }

    private static async Task<Dictionary<string, string?>> BuildOrgHierarchyDescriptionByCodeAsync(
        UNOPSAppDbContext context)
    {
        var rows = await context.Set<OrganizationHierarchy>()
            .AsNoTracking()
            .Where(h => !h.IsDeleted)
            .Select(h => new { h.Code, h.Description })
            .ToListAsync();

        var map = new Dictionary<string, string?>(StringComparer.OrdinalIgnoreCase);
        foreach (var r in rows)
        {
            var key = r.Code?.Trim();
            if (string.IsNullOrEmpty(key))
                continue;
            if (!map.ContainsKey(key))
                map[key] = r.Description;
        }

        return map;
    }

    /// <summary><see cref="EntityUserRole.OrgUnitWorksAt"/> max length is 255.</summary>
    private static string TruncateOrgUnitWorksAt(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return string.Empty;
        const int maxLen = 255;
        var t = value.Trim();
        return t.Length <= maxLen ? t : t[..maxLen];
    }

    private sealed record UserResolveResult(int? UserId, bool Ambiguous);

    private static UserResolveResult ResolveUserIdFromSheetName(
        string normalizedSheetName,
        Dictionary<string, List<int>> nameToUserIds)
    {
        var key = NormalizeNameKey(normalizedSheetName);
        if (string.IsNullOrEmpty(key))
            return new UserResolveResult(null, false);

        if (!nameToUserIds.TryGetValue(key, out var ids) || ids.Count == 0)
            return new UserResolveResult(null, false);

        if (ids.Count > 1)
            return new UserResolveResult(ids[0], true);

        return new UserResolveResult(ids[0], false);
    }

    /// <summary>
    /// Sheet-name → user ids (see <see cref="BuildNameToUserIdsFromProfileRows"/>), plus user id →
    /// <see cref="UserProfile.Position"/> and <see cref="UserProfile.OrgUnit"/> for operational roles.
    /// Reads persisted <c>UserProfile."Name"</c> via SQL when the column exists.
    /// </summary>
    private static async Task<UserProfileLookupCaches> BuildUserProfileLookupCachesAsync(UNOPSAppDbContext context)
    {
        List<UserProfileNameLookupRow> rows;
        try
        {
            rows = await context.Database
                .SqlQueryRaw<UserProfileNameLookupRow>(
                    """
                    SELECT "UserId", "FirstName", "LastName", "Name", "Position", "OrgUnit"
                    FROM public."UserProfile"
                    WHERE NOT "IsDeleted"
                    """)
                .ToListAsync();
        }
        catch (Exception ex) when (IsPostgresUndefinedColumn(ex))
        {
            rows = await context.Set<UserProfile>()
                .AsNoTracking()
                .Where(p => !p.IsDeleted)
                .Select(p => new UserProfileNameLookupRow
                {
                    UserId = p.UserId,
                    FirstName = p.FirstName,
                    LastName = p.LastName,
                    Name = null,
                    Position = p.Position,
                    OrgUnit = p.OrgUnit,
                })
                .ToListAsync();
        }

        var userIdToPosition = new Dictionary<int, string?>();
        var userIdToOrgUnit = new Dictionary<int, string?>();
        foreach (var p in rows)
        {
            userIdToPosition[p.UserId] = p.Position;
            userIdToOrgUnit[p.UserId] = p.OrgUnit;
        }

        var nameToUserIds = BuildNameToUserIdsFromProfileRows(rows);
        return new UserProfileLookupCaches(nameToUserIds, userIdToPosition, userIdToOrgUnit);
    }

    private sealed record UserProfileLookupCaches(
        Dictionary<string, List<int>> NameToUserIds,
        Dictionary<int, string?> UserIdToPosition,
        Dictionary<int, string?> UserIdToOrgUnit);

    private static Dictionary<string, List<int>> BuildNameToUserIdsFromProfileRows(
        IEnumerable<UserProfileNameLookupRow> rows)
    {
        var map = new Dictionary<string, List<int>>(StringComparer.Ordinal);
        foreach (var p in rows)
        {
            if (!string.IsNullOrWhiteSpace(p.Name))
                AddUserToNameMap(map, p.Name, p.UserId);

            AddUserToNameMap(map, BuildProfileDisplayName(p.FirstName, p.LastName), p.UserId);

            var f = p.FirstName?.Trim();
            var l = p.LastName?.Trim();
            if (!string.IsNullOrEmpty(f) && !string.IsNullOrEmpty(l))
            {
                AddUserToNameMap(map, $"{l}, {f}", p.UserId);
                AddUserToNameMap(map, $"{l} {f}", p.UserId);
                AddUserToNameMap(map, $"{f}, {l}", p.UserId);
            }
        }

        return map;
    }

    /// <summary>42703 = undefined_column — DB has no persisted <c>Name</c> on <c>UserProfile</c>.</summary>
    private static bool IsPostgresUndefinedColumn(Exception ex)
    {
        for (var e = ex; e != null; e = e.InnerException)
        {
            if (e is PostgresException pg && pg.SqlState == PostgresErrorCodes.UndefinedColumn)
                return true;
        }

        return false;
    }

    private sealed class UserProfileNameLookupRow
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Name { get; set; }
        public string? Position { get; set; }
        public string? OrgUnit { get; set; }
    }

    private static void AddUserToNameMap(Dictionary<string, List<int>> map, string? displayLabel, int userId)
    {
        var key = NormalizeNameKey(displayLabel);
        if (string.IsNullOrEmpty(key))
            return;

        if (!map.TryGetValue(key, out var list))
        {
            list = [];
            map[key] = list;
        }

        if (!list.Contains(userId))
            list.Add(userId);
    }

    private static string BuildProfileDisplayName(string? firstName, string? lastName)
    {
        var f = firstName?.Trim() ?? string.Empty;
        var l = lastName?.Trim() ?? string.Empty;
        if (f.Length > 0 && l.Length > 0)
            return $"{f} {l}";
        if (f.Length > 0)
            return f;
        return l;
    }

    private static string? NormalizePersonNameCell(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || IsNa(value))
            return null;
        return value.Trim();
    }

    private static string NormalizeNameKey(string? displayName)
    {
        if (string.IsNullOrWhiteSpace(displayName))
            return string.Empty;

        var s = displayName.Trim()
            .Replace('\u00A0', ' ')
            .Replace('\u2007', ' ')
            .Replace('\u202F', ' ')
            .ToLowerInvariant()
            .Normalize(NormalizationForm.FormKC);

        while (s.Contains("  ", StringComparison.Ordinal))
            s = s.Replace("  ", " ", StringComparison.Ordinal);
        return s;
    }

    private static async Task<IList<IList<object>>?> FetchSheetDataAsync(
        string spreadsheetId,
        string sheetName,
        GoogleCredential? appCredential = null)
    {
        var credential = appCredential ?? await GoogleCredential.GetApplicationDefaultAsync();
        var scopedCredential = credential.CreateScoped(SheetsService.Scope.SpreadsheetsReadonly);
        var service = new SheetsService(new BaseClientService.Initializer
        {
            HttpClientInitializer = scopedCredential,
            ApplicationName = "OfficeMasterDataSeeder"
        });

        var range = $"'{sheetName}'!A1:S";
        var request = service.Spreadsheets.Values.Get(spreadsheetId, range);
        var response = await request.ExecuteAsync();
        return response.Values;
    }

    private static List<MasterOfficeRow> ParseSheetValues(IList<IList<object>> values)
    {
        var rows = new List<MasterOfficeRow>();
        var header = values[0].Select(c => c?.ToString() ?? string.Empty).ToList();

        var costCentreIndex = FindColumnIndex(header, "Cost Centre");
        if (costCentreIndex < 0)
            return rows;

        var aliasColIndex = FindColumnIndex(header, "Alias");
        var typeColIndex = FindColumnIndex(header, "Type");
        var levelColIndex = FindColumnIndex(header, "Level in Operational Hierarchy");
        var scopeColIndex = FindColumnIndex(header, "Scope Type");
        var mgmtExpIndex = FindColumnIndex(header, "Management Expense");
        var directSharedIndex = FindColumnIndex(header, "Direct Cost for Shared Services");
        var directCostsIndex = FindColumnIndex(header, "Direct Costs");
        var financialCentreTypeIndex = FindColumnIndex(header, "Financial centre type");
        var parentCostCentreIndex = FindParentCostCentreColumnIndex(header);
        var establishedByIndex = FindColumnIndex(header, "Established by");

        for (var i = 1; i < values.Count; i++)
        {
            var cells = values[i].Select(c => c?.ToString() ?? string.Empty).ToList();
            if (cells.Count <= costCentreIndex)
                continue;

            rows.Add(new MasterOfficeRow
            {
                CostCentre = GetCell(cells, costCentreIndex),
                Alias = GetCell(cells, aliasColIndex),
                LevelInOperationalHierarchy = GetCell(cells, levelColIndex),
                Type = GetCell(cells, typeColIndex),
                ScopeType = GetCell(cells, scopeColIndex),
                ManagementExpense = GetCell(cells, mgmtExpIndex),
                DirectCostSharedServices = GetCell(cells, directSharedIndex),
                DirectCosts = GetCell(cells, directCostsIndex),
                FinancialCentreType = GetCell(cells, financialCentreTypeIndex),
                ParentCostCentreCode = GetCell(cells, parentCostCentreIndex),
                EstablishedBy = GetCell(cells, establishedByIndex),
                DirectorManagerName = GetCell(cells, ColDirectorManager),
                DirectorManagerOiCName = GetCell(cells, ColDirectorManagerOiC),
                HsseCoordinatorName = GetCell(cells, ColHsseCoordinator),
            });
        }

        return rows;
    }

    private static int FindColumnIndex(IReadOnlyList<string> header, string partialName)
    {
        for (var i = 0; i < header.Count; i++)
        {
            if (header[i].Contains(partialName, StringComparison.OrdinalIgnoreCase))
                return i;
        }

        return -1;
    }

    /// <summary>
    /// MASTER "Parent" cost centre column (not "Parent Internal name").
    /// </summary>
    private static int FindParentCostCentreColumnIndex(IReadOnlyList<string> header)
    {
        for (var i = 0; i < header.Count; i++)
        {
            var h = header[i].Trim();
            if (string.Equals(h, "Parent", StringComparison.OrdinalIgnoreCase))
                return i;
        }

        for (var i = 0; i < header.Count; i++)
        {
            if (header[i].Contains("Parent", StringComparison.OrdinalIgnoreCase) &&
                !header[i].Contains("Parent Internal", StringComparison.OrdinalIgnoreCase))
                return i;
        }

        return -1;
    }

    private static string GetCell(IReadOnlyList<string> cells, int index)
    {
        if (index < 0 || index >= cells.Count)
            return string.Empty;
        var value = cells[index] ?? string.Empty;
        return IsNa(value) ? string.Empty : value;
    }

    private static bool IsNa(string value) =>
        string.Equals(value, "#N/A", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(value, "N/A", StringComparison.OrdinalIgnoreCase);

    private static string? Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || IsNa(value))
            return null;
        return value.Trim();
    }

    private static int? ParseIntOrNull(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || IsNa(value))
            return null;
        return int.TryParse(value.Trim(), NumberStyles.Integer, CultureInfo.InvariantCulture, out var n) ? n : null;
    }

    private static bool IsYes(string? value) =>
        !string.IsNullOrWhiteSpace(value) &&
        string.Equals(value.Trim(), "Y", StringComparison.OrdinalIgnoreCase);

    private static string? BuildFundingString(string? managementExpense, string? directCostSharedServices, string? directCosts)
    {
        var parts = new List<string>();
        if (IsYes(managementExpense))
            parts.Add("Management Expense");
        if (IsYes(directCostSharedServices))
            parts.Add("Direct Cost for Shared Services");
        if (IsYes(directCosts))
            parts.Add("Direct Costs");

        return parts.Count == 0 ? null : string.Join(", ", parts);
    }

    private sealed class MasterOfficeRow
    {
        public string? CostCentre { get; set; }
        public string? Alias { get; set; }
        public string? LevelInOperationalHierarchy { get; set; }
        public string? Type { get; set; }
        public string? ScopeType { get; set; }
        public string? ManagementExpense { get; set; }
        public string? DirectCostSharedServices { get; set; }
        public string? DirectCosts { get; set; }
        public string? FinancialCentreType { get; set; }
        public string? ParentCostCentreCode { get; set; }
        public string? EstablishedBy { get; set; }
        public string? DirectorManagerName { get; set; }
        public string? DirectorManagerOiCName { get; set; }
        public string? HsseCoordinatorName { get; set; }
    }
}
