using System.Text.Json;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using UNOPS.PAO.Business.Utilities;
using UNOPS.PAO.Business.Interfaces;
using UNOPS.PAO.DataAccess.Services;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.Domain.Infrastructure;
using UNOPS.PAO.UNOPSBusiness.Config;
using UNOPS.PAO.Models.Offices;
using UNOPS.PAO.Models.Shared;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSBusiness.Services;

/// <summary>
/// Service for Office entity operations including list, search, tree, detail,
/// related entities (opportunities, partners), and permissions.
/// Operational Roles and DoA Holders are loaded from EntityUserRole.
/// </summary>
public class OfficeService : IOfficeService
{
    private const string OrganizationHierarchyEntityType = "OrganizationHierarchy";
    private const string MgmtRoleSource = "Mgmt";
    private const string DoARoleSource = "DoA";
    private const string OfficeMasterRoleSource = "OfficeMaster";
    /// <summary>Sheet imports (e.g. RMOA practitioner CSV) — not EDS Mgmt; see <c>RegionalManagementOversightAdvisorRoleSheetSeeder</c>.</summary>
    private const string RoleSheetRoleSource = "RoleSheet";
    /// <summary>Director row from office master import (<see cref="OfficeMasterRoleSource"/>).</summary>
    private const string OrganizationalDirectorRoleCode = "Organizational_Director_OrganizationHierarchy";

    private const string OrganizationalDeputyDirectorRoleCode = "Organizational_Deputy_Director_OrganizationHierarchy";

    private const string RegionalManagementOversightAdvisorRoleCode = "Regional_Management_Oversight_Advisor_OrganizationHierarchy";

    private const string HoSSRoleCode = "HoSS_OrganizationHierarchy";

    /// <summary>Operational roles for which the UI shows a &quot;Works at&quot; vs this office warning (by org hierarchy id).</summary>
    private static readonly HashSet<string> WorksAtOrganizationMismatchRoleCodes =
        new(StringComparer.Ordinal)
        {
            OrganizationalDirectorRoleCode,
            OrganizationalDeputyDirectorRoleCode,
            "Organizational_HSSE_Coordinator_OrganizationHierarchy",
            RegionalManagementOversightAdvisorRoleCode,
        };

    private static readonly HashSet<string> OfficeMasterOnlyOperationalRoleCodes =
    [
        OrganizationalDirectorRoleCode,
        OrganizationalDeputyDirectorRoleCode,
        "Organizational_HSSE_Coordinator_OrganizationHierarchy",
        RegionalManagementOversightAdvisorRoleCode,
    ];

    /// <summary>MASTER office data roles allowed to upload strategy documents on Regional Office offices only.</summary>
    private static readonly HashSet<string> OfficeDocumentUploadEntityRoleCodes =
        new(StringComparer.Ordinal)
        {
            OrganizationalDirectorRoleCode,
            OrganizationalDeputyDirectorRoleCode,
        };

    private const string RegionalOfficeOrganisationalEntityType = "Regional Office";

    private const string HsseRegionalSpecialistRoleCode = "HSSE_Regional_Specialist_OrganizationHierarchy";
    private const string HsseRegionalSpecialistOicRoleCode = "HSSE_Regional_Specialist_OiC_OrganizationHierarchy";

    /// <summary>
    /// Operational role matrix for the office detail UI. Head of Programme is excluded (AC9).
    /// HSSE regional specialist roles and Regional Management Oversight Advisor appear only for Regional Office (AC8, AC10).
    /// </summary>
    private static List<string> GetOperationalRoleMatrixCodes(string? organisationalEntityType)
    {
        var codes = new List<string>
        {
            OrganizationalDirectorRoleCode,
            OrganizationalDeputyDirectorRoleCode,
            "Organizational_HSSE_Coordinator_OrganizationHierarchy",
        };

        if (IsRegionalOfficeType(organisationalEntityType))
        {
            codes.Add(HsseRegionalSpecialistRoleCode);
            codes.Add(HsseRegionalSpecialistOicRoleCode);
            codes.Add(RegionalManagementOversightAdvisorRoleCode);
        }

        codes.Add(HoSSRoleCode);
        return codes;
    }

    private static bool IsRegionalOfficeType(string? organisationalEntityType) =>
        string.Equals(organisationalEntityType?.Trim(), RegionalOfficeOrganisationalEntityType, StringComparison.OrdinalIgnoreCase);

    /// <summary>
    /// True when the holder&apos;s primary org unit (resolved to <see cref="OrganizationHierarchy.Id"/>) differs from this office&apos;s org unit.
    /// </summary>
    private static bool ComputeWorksAtOrganizationMismatch(
        string roleCode,
        int officeOrganizationHierarchyId,
        int? holderPrimaryOrganizationHierarchyId)
    {
        if (!WorksAtOrganizationMismatchRoleCodes.Contains(roleCode))
            return false;
        if (holderPrimaryOrganizationHierarchyId is not { } holderId)
            return false;
        return holderId != officeOrganizationHierarchyId;
    }

    private const string SyncConfigOffices = "offices";
    private const string SyncConfigLocations = "locations";
    private const string SyncConfigEntityUserRolesMgmt = "entity-user-roles-mgmt";
    private const string SyncConfigEntityUserRolesDoa = "entity-user-roles-doa";

    /// <summary><see cref="AuditLog.EntityType"/> for <see cref="UpdateOfficeOperationalRoleAsync"/> (AC5).</summary>
    private const string OfficeOperationalRoleAuditEntityType = "OfficeOperationalRole";

    private readonly UNOPSAppDbContext _context;
    private readonly IOfficeManager _officeManager;
    private readonly IOrgUnitHierarchyService _hierarchyService;
    private readonly ISyncMetadataService _syncMetadataService;
    private readonly IMapper _mapper;
    private readonly UserResolverService<int> _userResolver;
    /// <summary>
    /// Resolved lazily: <see cref="IOpportunityManager"/> is not registered in DI (it is created inside
    /// <see cref="IManagerWrapper"/>), and <see cref="OfficeService"/> is required while the wrapper is still
    /// being constructed (<c>GlobalFilterService</c> → <c>IOfficeService</c>).
    /// </summary>
    private readonly Lazy<IOpportunityManager> _opportunityManager;

    public OfficeService(
        UNOPSAppDbContext context,
        IOfficeManager officeManager,
        IOrgUnitHierarchyService hierarchyService,
        ISyncMetadataService syncMetadataService,
        IMapper mapper,
        UserResolverService<int> userResolver,
        IServiceProvider serviceProvider)
    {
        _context = context;
        _officeManager = officeManager;
        _hierarchyService = hierarchyService;
        _syncMetadataService = syncMetadataService;
        _mapper = mapper;
        _userResolver = userResolver;
        _opportunityManager = new Lazy<IOpportunityManager>(
            () => serviceProvider.GetRequiredService<IManagerWrapper>().OpportunityManager);
    }

    /// <inheritdoc />
    public async Task<PaginationResponse<OfficeListModel>> GetOfficesAsync(OfficeFilterRequest request, CancellationToken cancellationToken = default)
    {
        return await _officeManager.GetOfficesAsync(request, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<PaginationResponse<OfficeListModel>> SearchOfficesAsync(string query, OfficeFilterRequest request, CancellationToken cancellationToken = default)
    {
        var searchRequest = new OfficeFilterRequest
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            OrderBy = request.OrderBy,
            Ascending = request.Ascending,
            Name = request.Name,
            Alias = request.Alias,
            Code = request.Code,
            Type = request.Type,
            ParentId = request.ParentId,
            CostCentreId = request.CostCentreId,
            InternalName = request.InternalName,
            ExternalName = request.ExternalName,
            HierarchyLevel = request.HierarchyLevel,
            EffectiveDateFrom = request.EffectiveDateFrom,
            EffectiveDateTo = request.EffectiveDateTo,
            FinancialCentreType = request.FinancialCentreType,
            Funding = request.Funding,
            ScopeType = request.ScopeType,
            Status = request.Status,
            SearchTerm = query
        };
        return await _officeManager.GetOfficesAsync(searchRequest, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<List<OfficeTreeNodeModel>> GetOfficeTreeAsync(int? rootId, CancellationToken cancellationToken = default)
    {
        var offices = await _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .Where(o => !o.IsDeleted)
            .ToListAsync(cancellationToken);

        var officeByOrgId = offices
            .Where(o => o.OrganizationHierarchyId.HasValue)
            .ToDictionary(o => o.OrganizationHierarchyId!.Value);

        return BuildTree(offices, officeByOrgId, rootId);
    }

    /// <inheritdoc />
    public async Task<(bool SkipFilter, List<int> OrganizationHierarchyIds)> ResolveGlobalFilterOrganizationHierarchyIdsAsync(
        int officeOrLegacyHierarchyId,
        CancellationToken cancellationToken = default)
    {
        var office = await _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .FirstOrDefaultAsync(o => o.Id == officeOrLegacyHierarchyId && !o.IsDeleted, cancellationToken);

        if (office != null)
        {
            if (string.Equals(office.OrganizationHierarchy?.Code, "OPS", StringComparison.OrdinalIgnoreCase))
                return (true, new List<int>());
            if (!office.OrganizationHierarchyId.HasValue)
                return (true, new List<int>());

            var scope = await GetRelatedOrgUnitIdsForOfficeAsync(office, cancellationToken);
            return (false, scope);
        }

        var hierarchy = await _context.OrganizationHierarchies
            .AsNoTracking()
            .FirstOrDefaultAsync(
                x => x.Id == officeOrLegacyHierarchyId && !x.IsDeleted && x.Status == EntityStatus.Active,
                cancellationToken);

        if (hierarchy != null && string.Equals(hierarchy.Code, "OPS", StringComparison.OrdinalIgnoreCase))
            return (true, new List<int>());

        var legacy = await _hierarchyService.GetDescendantIdsAsync(officeOrLegacyHierarchyId);
        return (false, legacy);
    }

    /// <inheritdoc />
    public async Task<OfficeDetailModel?> GetOfficeDetailAsync(int id, CancellationToken cancellationToken = default)
    {
        var office = await _officeManager.GetByIdAsync(id, cancellationToken);
        if (office == null)
            return null;

        var geographicScope = await LoadGeographicScopeFromOfficeRelationshipsAsync(office, cancellationToken);
        var physicalLocations = await LoadPhysicalLocationsAsync(office.Id, cancellationToken);

        var orgHierarchyId = office.OrganizationHierarchyId;
        var syncMetadata = await LoadSyncMetadataAsync(cancellationToken);

        var userId = _userResolver.GetCurrentUserId();
        OfficeDetailModel detail;

        if (!orgHierarchyId.HasValue)
        {
            var parentChainOnly = new List<OfficeHierarchyNodeModel>
            {
                new()
                {
                    Id = office.Id,
                    OfficeId = office.Id,
                    Code = office.Code,
                    Name = office.Name ?? office.Code,
                    Type = office.OrganisationalEntityType,
                    IsCurrent = true
                }
            };
            detail = BuildDetailWithoutRoles(office, physicalLocations, new List<OfficeOperationalRoleModel>(), new List<OfficeDoAHolderModel>(), parentChainOnly, new List<OfficeTreeNodeModel>(), geographicScope, syncMetadata);
        }
        else
        {
            var operationalRoles = await LoadOperationalRolesAsync(office, cancellationToken);
            var doAHolders = await LoadDoAHoldersWithGapsAsync(orgHierarchyId.Value, cancellationToken);
            var parentChain = await BuildParentChainForOfficeAsync(office, cancellationToken);
            var children = await BuildChildOfficesForOfficeAsync(office, cancellationToken);
            detail = BuildDetailWithoutRoles(office, physicalLocations, operationalRoles, doAHolders, parentChain, children, geographicScope, syncMetadata);
        }

        detail.WorkflowConfigurationImpactedDescendantOfficeCount =
            await CountDescendantOfficesInOfficeTreeAsync(office, cancellationToken);

        detail.Permissions = await GetOfficePermissionsAsync(id, userId, cancellationToken);
        detail.RegionalDirector = orgHierarchyId.HasValue
            ? await LoadRegionalDirectorForOrgHierarchyAsync(orgHierarchyId.Value, cancellationToken)
            : null;
        detail.OperationalRoleAuditTrail = await LoadOperationalRoleAuditTrailAsync(office.Id, cancellationToken);
        return detail;
    }

    /// <inheritdoc />
    public async Task<PaginationResponse<OfficeRelatedOpportunityModel>> GetRelatedOpportunitiesAsync(int officeId, OfficeFilterRequest request, CancellationToken cancellationToken = default)
    {
        var office = await _officeManager.GetByIdAsync(officeId, cancellationToken);
        if (office?.OrganizationHierarchyId == null)
            return EmptyPagination<OfficeRelatedOpportunityModel>(request);

        var orgIds = await GetRelatedOrgUnitIdsForOfficeAsync(office, cancellationToken);

        // Opportunities store ResponsibleOrgUnitId as Office.Id; map related hierarchy ids to office ids.
        var relatedOfficeIds = await _context.Offices
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.OrganizationHierarchyId != null && orgIds.Contains(o.OrganizationHierarchyId.Value))
            .Select(o => o.Id)
            .ToListAsync(cancellationToken);
        relatedOfficeIds.Add(office.Id);
        var relatedOfficeIdSet = relatedOfficeIds.Distinct().ToList();

        var query = _context.Set<Opportunity>()
            .AsNoTracking()
            .Include(o => o.ResponsibleOrgUnit)
            .Include(o => o.ClientPartners.Where(cp => !cp.IsDeleted))
                .ThenInclude(cp => cp.Partner)
            .Where(o => !o.IsDeleted && o.ResponsibleOrgUnitId != null && relatedOfficeIdSet.Contains(o.ResponsibleOrgUnitId.Value));

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLowerInvariant();
            query = query.Where(o =>
                (o.Name != null && o.Name.ToLower().Contains(term)) ||
                (o.Description != null && o.Description.ToLower().Contains(term)) ||
                (o.PartnerReference != null && o.PartnerReference.ToLower().Contains(term)));
        }

        if (request.FilterActive)
            query = query.Where(o => o.Status != EntityStatus.Inactive && o.Status != EntityStatus.Archived);

        var totalCount = await query.CountAsync(cancellationToken);
        var orderBy = request.OrderBy?.ToLowerInvariant() ?? "name";
        var ascending = request.Ascending ?? true;
        query = orderBy switch
        {
            "createddate" => ascending ? query.OrderBy(o => o.CreatedDate) : query.OrderByDescending(o => o.CreatedDate),
            "targetsigningdate" => ascending ? query.OrderBy(o => o.TargetSigningDate) : query.OrderByDescending(o => o.TargetSigningDate),
            _ => ascending ? query.OrderBy(o => o.Name) : query.OrderByDescending(o => o.Name)
        };

        var skip = (request.PageIndex - 1) * request.PageSize;
        var entities = await query.Skip(skip).Take(request.PageSize).ToListAsync(cancellationToken);
        var records = entities.Select(o => new OfficeRelatedOpportunityModel
        {
            Id = o.Id,
            Name = o.Name,
            ResponsibleOrgUnitId = o.ResponsibleOrgUnitId,
            ResponsibleOrgUnitName = o.ResponsibleOrgUnit?.Name,
            Stage = o.Stage,
            PartnerName = o.ClientPartners?
                .Where(cp => !cp.IsDeleted && cp.Partner != null)
                .Select(cp => cp.Partner!.Name)
                .FirstOrDefault() ?? o.PartnerReference,
            Value = o.InitiativeBudgetUSD,
            CreatedDate = o.CreatedDate,
            TargetSigningDate = o.TargetSigningDate
        }).ToList();

        return new PaginationResponse<OfficeRelatedOpportunityModel>
        {
            Records = records,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    /// <inheritdoc />
    public async Task<PaginationResponse<OfficeRelatedPartnerModel>> GetRelatedPartnersAsync(int officeId, OfficeFilterRequest request, CancellationToken cancellationToken = default)
    {
        var office = await _officeManager.GetByIdAsync(officeId, cancellationToken);
        if (office?.OrganizationHierarchyId == null)
            return EmptyPagination<OfficeRelatedPartnerModel>(request);

        var orgIds = await GetRelatedOrgUnitIdsForOfficeAsync(office, cancellationToken);

        // Partner→office links live in OfficeRelationships (keyed by OfficeId) since the OrgUnit→Office switch.
        // Map this office's hierarchy subtree to office ids and read partner ids from OfficeRelationships.
        var relatedOfficeIds = await _context.Offices
            .AsNoTracking()
            .Where(o => !o.IsDeleted
                        && o.OrganizationHierarchyId != null
                        && orgIds.Contains(o.OrganizationHierarchyId.Value))
            .Select(o => o.Id)
            .ToListAsync(cancellationToken);
        relatedOfficeIds.Add(office.Id);
        var relatedOfficeIdSet = relatedOfficeIds.Distinct().ToList();

        var partnerIds = await _context.Set<OfficeRelationship>()
            .AsNoTracking()
            .Where(r => !r.IsDeleted
                        && r.Status == EntityStatus.Active
                        && r.EntityType == nameof(Partner)
                        && relatedOfficeIdSet.Contains(r.OfficeId))
            .Select(r => r.EntityId)
            .Distinct()
            .ToListAsync(cancellationToken);

        if (partnerIds.Count == 0)
            return EmptyPagination<OfficeRelatedPartnerModel>(request);

        // Include all partners regardless of status (Active, Archived, Inactive) — relationship-level
        // status filtering above is the source of truth for what is "related" to this office.
        var query = _context.Set<Partner>()
            .AsNoTracking()
            .Where(p => !p.IsDeleted && partnerIds.Contains(p.Id));

        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLowerInvariant();
            query = query.Where(p =>
                (p.Name != null && p.Name.ToLower().Contains(term)) ||
                (p.PartnerShortDescription != null && p.PartnerShortDescription.ToLower().Contains(term)));
        }

        // Exclude inactive only; include Archived so office related-partners list shows archived partners.
        if (request.FilterActive)
            query = query.Where(p => p.Status != EntityStatus.Inactive);

        var totalCount = await query.CountAsync(cancellationToken);
        var orderBy = request.OrderBy?.ToLowerInvariant() ?? "name";
        var ascending = request.Ascending ?? true;
        query = orderBy switch
        {
            "code" => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name),
            _ => ascending ? query.OrderBy(p => p.Name) : query.OrderByDescending(p => p.Name)
        };

        var skip = (request.PageIndex - 1) * request.PageSize;
        var entities = await query.Skip(skip).Take(request.PageSize).ToListAsync(cancellationToken);
        var pagePartnerIds = entities.Select(p => p.Id).ToList();

        var countByPartner = new Dictionary<int, int>();
        if (pagePartnerIds.Count > 0)
        {
            var clientOpps = await _context.Set<OpportunityClientPartner>()
                .AsNoTracking()
                .Where(ocp => !ocp.IsDeleted && pagePartnerIds.Contains(ocp.PartnerId))
                .Select(ocp => new { ocp.PartnerId, ocp.OpportunityId })
                .ToListAsync(cancellationToken);
            var fundingOpps = await _context.Set<OpportunityFundingPartner>()
                .AsNoTracking()
                .Where(ofp => !ofp.IsDeleted && pagePartnerIds.Contains(ofp.PartnerId))
                .Select(ofp => new { ofp.PartnerId, ofp.OpportunityId })
                .ToListAsync(cancellationToken);
            var allPairs = clientOpps.Concat(fundingOpps).ToList();
            var oppIds = allPairs.Select(x => x.OpportunityId).Distinct().ToList();
            var activeOppIds = oppIds.Count > 0
                ? await _context.Set<Opportunity>()
                    .AsNoTracking()
                    .Where(o => !o.IsDeleted && oppIds.Contains(o.Id))
                    .Select(o => o.Id)
                    .ToListAsync(cancellationToken)
                : new List<int>();
            var validPairs = allPairs.Where(p => activeOppIds.Contains(p.OpportunityId)).ToList();
            countByPartner = validPairs
                .GroupBy(p => p.PartnerId)
                .ToDictionary(g => g.Key, g => g.Select(x => x.OpportunityId).Distinct().Count());
        }

        var records = entities.Select(p => new OfficeRelatedPartnerModel
        {
            Id = p.Id,
            Name = p.Name,
            Status = (int)p.Status,
            OpportunitiesCount = countByPartner.TryGetValue(p.Id, out var c) ? c : 0
        }).ToList();

        return new PaginationResponse<OfficeRelatedPartnerModel>
        {
            Records = records,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    /// <inheritdoc />
    public async Task<OfficePermissionsModel?> GetOfficePermissionsAsync(int officeId, int userId, CancellationToken cancellationToken = default)
    {
        var office = await _officeManager.GetByIdAsync(officeId, cancellationToken);
        if (office == null)
            return null;

        var canUploadDocuments = await CanUserUploadDocumentsAsync(office, userId, cancellationToken);
        var canEditWorkflowConfiguration = await CanUserEditWorkflowConfigurationAsync(office, userId, cancellationToken);
        var canEditOperationalRoles = await CanUserEditOperationalRolesAsync(office, userId, cancellationToken);

        return new OfficePermissionsModel
        {
            CanView = true,
            CanUploadDocuments = canUploadDocuments,
            CanEditWorkflowConfiguration = canEditWorkflowConfiguration,
            CanEditOperationalRoles = canEditOperationalRoles
        };
    }

    /// <inheritdoc />
    public async Task<OfficeDetailModel?> UpdateOfficeOperationalRoleAsync(
        int officeId,
        UpdateOfficeOperationalRoleRequest request,
        int currentUserId,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(request);

        var office = await _officeManager.GetByIdAsync(officeId, cancellationToken);
        if (office == null)
            return null;

        if (!await CanUserEditOperationalRolesAsync(office, currentUserId, cancellationToken))
            throw new UnauthorizedAccessException("Cannot edit operational roles for this office.");

        if (office.OrganizationHierarchyId is not { } orgHierarchyId)
            throw new BusinessException("Office has no organization hierarchy; operational roles cannot be assigned.");

        var code = (request.EntityRoleCode ?? string.Empty).Trim();
        if (!OfficeMasterOnlyOperationalRoleCodes.Contains(code))
            throw new BusinessException("This operational role cannot be edited in Opportunity+ from this screen.");

        var todayUtc = DateOnly.FromDateTime(DateTime.UtcNow);
        if (request.EffectiveDate < todayUtc)
            throw new BusinessException("Effective date must be today or a future date.");

        var targetUser = await _context.PAOUsers
            .Include(u => u.UserProfile)
            .FirstOrDefaultAsync(
                u => u.Id == request.UserId &&
                    u.ActiveUser &&
                    u.UserProfile != null &&
                    !u.UserProfile.IsDeleted,
                cancellationToken);

        if (targetUser?.UserProfile is not { } holderProfile)
            throw new BusinessException("Selected user is not active or has no profile.");

        if (string.Equals(code, OrganizationalDirectorRoleCode, StringComparison.Ordinal))
        {
            var deputyHolderUserId = await GetOfficeMasterHolderUserIdForRoleCodeAsync(
                orgHierarchyId,
                OrganizationalDeputyDirectorRoleCode,
                cancellationToken);
            if (deputyHolderUserId.HasValue && deputyHolderUserId.Value == request.UserId)
                throw new BusinessException(
                    "Director/Manager and Deputy Director/Manager cannot be assigned to the same person.");
        }
        else if (string.Equals(code, OrganizationalDeputyDirectorRoleCode, StringComparison.Ordinal))
        {
            var directorHolderUserId = await GetOfficeMasterHolderUserIdForRoleCodeAsync(
                orgHierarchyId,
                OrganizationalDirectorRoleCode,
                cancellationToken);
            if (directorHolderUserId.HasValue && directorHolderUserId.Value == request.UserId)
                throw new BusinessException(
                    "Director/Manager and Deputy Director/Manager cannot be assigned to the same person.");
        }

        var entityRole = await _context.Set<EntityRole>()
            .AsNoTracking()
            .FirstOrDefaultAsync(
                er => er.Code == code && !er.IsDeleted,
                cancellationToken);

        if (entityRole == null)
            throw new BusinessException($"Unknown entity role code: {code}");

        var existingQuery = _context.Set<EntityUserRole>()
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == orgHierarchyId &&
                e.EntityRoleId == entityRole.Id);

        // RMOA may be seeded as RoleSheet; replacing assignment removes sheet + OfficeMaster rows.
        if (string.Equals(code, RegionalManagementOversightAdvisorRoleCode, StringComparison.Ordinal))
        {
            existingQuery = existingQuery.Where(e =>
                e.RoleSource == OfficeMasterRoleSource || e.RoleSource == RoleSheetRoleSource);
        }
        else
        {
            existingQuery = existingQuery.Where(e => e.RoleSource == OfficeMasterRoleSource);
        }

        var existing = await existingQuery.ToListAsync(cancellationToken);

        var previousUserIds = existing.Select(e => e.UserId).Distinct().OrderBy(id => id).ToList();

        foreach (var row in existing)
        {
            row.SetDeleteAuditData(currentUserId);
        }

        var effectiveStart = DateTime.SpecifyKind(request.EffectiveDate.ToDateTime(TimeOnly.MinValue), DateTimeKind.Utc);

        var orgUnitWorksAt = await ResolveOrgUnitWorksAtForAssignmentAsync(holderProfile.OrgUnit, cancellationToken);

        var assignment = new EntityUserRole
        {
            UserId = targetUser.Id,
            EntityRoleId = entityRole.Id,
            EntityId = orgHierarchyId,
            EntityType = OrganizationHierarchyEntityType,
            RoleSource = OfficeMasterRoleSource,
            PositionTitle = holderProfile.Position,
            OrgUnitWorksAt = orgUnitWorksAt,
            ApplicabilityPeriodStart = effectiveStart,
            ApplicabilityPeriodEnd = null,
            Conditions = null,
            DoAType = null,
            OfficerInChargeResourceId = null,
            Name = $"Office operational role {code}",
            Status = EntityStatus.Active
        };
        assignment.SetCreateAuditData(currentUserId);
        _context.Set<EntityUserRole>().Add(assignment);

        var auditPayload = JsonSerializer.Serialize(new
        {
            officeId,
            organizationHierarchyId = orgHierarchyId,
            entityRoleCode = code,
            previousUserIds,
            newUserId = targetUser.Id,
            effectiveDate = request.EffectiveDate.ToString("yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture),
        });
        var auditEntry = new AuditLog
        {
            EntityType = "OfficeOperationalRole",
            EntityId = officeId,
            Action = "assign",
            Timestamp = DateTime.UtcNow,
            UserId = currentUserId,
            JsonData = auditPayload,
            Description =
                $"Office {office.Code}: operational role {entityRole.Name} ({code}) assigned to user {targetUser.Id} (effective {request.EffectiveDate:yyyy-MM-dd}).",
            Name = $"OfficeOperationalRole_{officeId}_{code}_{Guid.NewGuid():N}",
            Status = EntityStatus.Active,
        };
        auditEntry.SetCreateAuditData(currentUserId);
        _context.AuditLogs.Add(auditEntry);

        await _context.SaveChangesAsync(cancellationToken);

        await _opportunityManager.Value.SyncStakeholdersFromEntityUserRolesForOfficeAsync(officeId, cancellationToken);

        return await GetOfficeDetailAsync(officeId, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<OfficeOperationalRoleAssignmentHistoryResponse?> GetOperationalRoleAssignmentHistoryAsync(
        int officeId,
        string entityRoleCode,
        int pageIndex,
        int pageSize,
        CancellationToken cancellationToken = default)
    {
        var office = await _officeManager.GetByIdAsync(officeId, cancellationToken);
        if (office == null)
            return null;

        var code = (entityRoleCode ?? string.Empty).Trim();
        if (!OfficeMasterOnlyOperationalRoleCodes.Contains(code))
        {
            throw new BusinessException(
                "This operational role does not support in-app assignment history from this screen.");
        }

        pageIndex = Math.Max(0, pageIndex);
        pageSize = Math.Clamp(pageSize, 1, 100);

        // JsonData is a PostgreSQL jsonb column: do not use string.Contains (translates to LIKE on jsonb → 42883).
        // Top-level key match via jsonb @> (EF.Functions.JsonContains).
        var jsonRoleFilter = JsonSerializer.Serialize(new { entityRoleCode = code });
        var baseQuery = _context.AuditLogs
            .AsNoTracking()
            .Where(a =>
                !a.IsDeleted &&
                a.EntityType == OfficeOperationalRoleAuditEntityType &&
                a.EntityId == officeId &&
                a.JsonData != null &&
                EF.Functions.JsonContains(a.JsonData, jsonRoleFilter));

        var totalCount = await baseQuery.CountAsync(cancellationToken);
        var logs = await baseQuery
            .OrderByDescending(a => a.Timestamp)
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);

        var records = await MapOperationalRoleAuditLogsToEntryModelsAsync(logs, cancellationToken);

        return new OfficeOperationalRoleAssignmentHistoryResponse
        {
            Records = records,
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalCount = totalCount,
            HasMore = (pageIndex + 1) * pageSize < totalCount,
        };
    }

    /// <summary>
    /// Org unit ids used for related opportunities and partners: full <see cref="OrganizationHierarchy"/>
    /// subtree under this office's org unit (all depths), plus any org units reachable via the
    /// <see cref="Office.ParentOrganizationHierarchyId"/> office graph (children, grandchildren, …), each merged
    /// with that org unit's hierarchy subtree so nested org units are included.
    /// </summary>
    private async Task<List<int>> GetRelatedOrgUnitIdsForOfficeAsync(Office office, CancellationToken cancellationToken)
    {
        if (!office.OrganizationHierarchyId.HasValue)
            return new List<int>();

        var rootId = office.OrganizationHierarchyId.Value;

        // All org units under this node in OrganizationHierarchy (recursive).
        var result = new HashSet<int>(await _hierarchyService.GetDescendantIdsAsync(rootId));

        var officeLinks = await _context.Offices
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.ParentOrganizationHierarchyId != null && o.OrganizationHierarchyId != null)
            .Select(o => new { o.ParentOrganizationHierarchyId, o.OrganizationHierarchyId })
            .ToListAsync(cancellationToken);

        var childOrgIdsByParent = officeLinks
            .GroupBy(x => x.ParentOrganizationHierarchyId!.Value)
            .ToDictionary(
                g => g.Key,
                g => g.Select(x => x.OrganizationHierarchyId!.Value).Distinct().ToList());

        var queue = new Queue<int>();
        var queued = new HashSet<int> { rootId };
        queue.Enqueue(rootId);

        while (queue.Count > 0)
        {
            var parentOrgId = queue.Dequeue();
            if (!childOrgIdsByParent.TryGetValue(parentOrgId, out var childOrgIds))
                continue;

            foreach (var childOrgId in childOrgIds)
            {
                if (!result.Contains(childOrgId))
                {
                    foreach (var id in await _hierarchyService.GetDescendantIdsAsync(childOrgId))
                        result.Add(id);
                }

                if (queued.Add(childOrgId))
                    queue.Enqueue(childOrgId);
            }
        }

        return result.ToList();
    }

    private static List<OfficeTreeNodeModel> BuildTree(
        List<Office> offices,
        Dictionary<int, Office> officeByOrgId,
        int? rootId)
    {
        var roots = rootId.HasValue
            ? offices.Where(o => o.OrganizationHierarchy?.ParentId == rootId).ToList()
            : offices.Where(o => o.OrganizationHierarchy?.ParentId == null).ToList();

        return roots.Select(o => BuildTreeNode(o, offices, officeByOrgId)).ToList();
    }

    private static OfficeTreeNodeModel BuildTreeNode(Office office, List<Office> allOffices, Dictionary<int, Office> officeByOrgId)
    {
        var orgId = office.OrganizationHierarchyId;
        var children = orgId.HasValue
            ? allOffices.Where(o => o.OrganizationHierarchy?.ParentId == orgId).ToList()
            : new List<Office>();

        return new OfficeTreeNodeModel
        {
            Id = office.Id,
            Code = office.Code,
            Name = office.Name ?? office.Code,
            Type = office.OrganisationalEntityType,
            Children = children.Select(c => BuildTreeNode(c, allOffices, officeByOrgId)).ToList()
        };
    }

    /// <summary>
    /// Geographic scope for the office detail tab: countries linked via <see cref="OfficeRelationship"/>
    /// (<c>EntityType</c> country) where the responsible <see cref="OfficeRelationship.OfficeId"/> is this office
    /// or a descendant office (same parent rule as <see cref="Office.ParentOrganizationHierarchyId"/>).
    /// </summary>
    private async Task<List<CountryScopeModel>> LoadGeographicScopeFromOfficeRelationshipsAsync(Office office, CancellationToken cancellationToken)
    {
        var officeIds = await GetDescendantOfficeIdsIncludingSelfAsync(office, cancellationToken);
        if (officeIds.Count == 0)
            return new List<CountryScopeModel>();

        var relationships = await _context.Set<OfficeRelationship>()
            .AsNoTracking()
            .Where(r => !r.IsDeleted && r.Status == EntityStatus.Active
                && r.EntityType == nameof(Country)
                && officeIds.Contains(r.OfficeId))
            .ToListAsync(cancellationToken);

        if (relationships.Count == 0)
            return new List<CountryScopeModel>();

        var countryIds = relationships.Select(r => r.EntityId).Distinct().ToList();
        var countries = await _context.Set<Country>()
            .AsNoTracking()
            .Where(c => !c.IsDeleted && countryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, cancellationToken);

        var responsibleOfficeIds = relationships.Select(r => r.OfficeId).Distinct().ToList();
        var responsibleOffices = await _context.Set<Office>()
            .AsNoTracking()
            .Where(o => !o.IsDeleted && responsibleOfficeIds.Contains(o.Id))
            .ToDictionaryAsync(o => o.Id, cancellationToken);

        var result = new List<CountryScopeModel>();
        foreach (var rel in relationships)
        {
            if (!countries.TryGetValue(rel.EntityId, out var country))
                continue;
            if (!responsibleOffices.TryGetValue(rel.OfficeId, out var responsibleOffice))
                continue;

            result.Add(new CountryScopeModel
            {
                Id = country.Id,
                Code = country.Iso2Code ?? "",
                Name = country.Name ?? "",
                ResponsibleOfficeName = $"{(responsibleOffice.Name ?? responsibleOffice.Code)} ({responsibleOffice.Code})",
                ResponsibleOfficeId = responsibleOffice.Id,
                Status = "Assigned"
            });
        }

        return result;
    }

    /// <summary>
    /// This office and descendant offices (children use <see cref="Office.ParentOrganizationHierarchyId"/> =
    /// parent's <see cref="Office.OrganizationHierarchyId"/>).
    /// </summary>
    private async Task<HashSet<int>> GetDescendantOfficeIdsIncludingSelfAsync(Office office, CancellationToken cancellationToken)
    {
        var snapshots = await _context.Set<Office>()
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.Status == EntityStatus.Active)
            .Select(o => new { o.Id, o.OrganizationHierarchyId, o.ParentOrganizationHierarchyId })
            .ToListAsync(cancellationToken);

        var byId = snapshots.ToDictionary(s => s.Id);
        var result = new HashSet<int>();
        var queue = new Queue<int>();

        if (!byId.ContainsKey(office.Id))
            return result;

        result.Add(office.Id);
        queue.Enqueue(office.Id);

        while (queue.Count > 0)
        {
            var currentId = queue.Dequeue();
            var current = byId[currentId];
            if (!current.OrganizationHierarchyId.HasValue)
                continue;
            var orgHid = current.OrganizationHierarchyId.Value;
            foreach (var child in snapshots.Where(s => s.ParentOrganizationHierarchyId == orgHid))
            {
                if (result.Add(child.Id))
                    queue.Enqueue(child.Id);
            }
        }

        return result;
    }

    /// <summary>
    /// Director/Manager shown in office header: MASTER Office Data assignment when present, otherwise
    /// legacy Mgmt Regional Director (for environments not yet loaded from the sheet).
    /// </summary>
    private async Task<string?> LoadRegionalDirectorForOrgHierarchyAsync(int orgHierarchyId, CancellationToken cancellationToken)
    {
        var master = await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == orgHierarchyId &&
                e.RoleSource == OfficeMasterRoleSource &&
                e.EntityRole != null &&
                e.EntityRole.Code == OrganizationalDirectorRoleCode)
            .OrderBy(e => e.Id)
            .FirstOrDefaultAsync(cancellationToken);

        return HolderDisplayName(master);
    }

    private static string? HolderDisplayName(EntityUserRole? assignment)
    {
        var holder = assignment?.User;
        if (holder == null) return null;
        var n = holder.Name;
        if (string.IsNullOrWhiteSpace(n))
            n = holder.Email;
        return string.IsNullOrWhiteSpace(n) ? null : n.Trim();
    }

    /// <summary>
    /// Store full &quot;Works at&quot; (code + hierarchy name/description) on assignment, not only the profile B-code.
    /// </summary>
    private async Task<string?> ResolveOrgUnitWorksAtForAssignmentAsync(
        string? profileOrgUnit,
        CancellationToken cancellationToken)
    {
        var primary = OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(profileOrgUnit);
        if (string.IsNullOrEmpty(primary))
            return string.IsNullOrWhiteSpace(profileOrgUnit) ? null : profileOrgUnit.Trim();

        var oh = await _context.OrganizationHierarchies
            .AsNoTracking()
            .FirstOrDefaultAsync(
                o => !o.IsDeleted &&
                    o.Code != null &&
                    o.Code.ToLower() == primary.ToLower(),
                cancellationToken);

        var display = OrgUnitWorksAtDisplayFormatter.ResolveDisplay(profileOrgUnit, oh);
        return string.IsNullOrEmpty(display) ? null : display;
    }

    private async Task<Dictionary<string, OrganizationHierarchy>> LoadOrgHierarchiesForWorksAtDisplayAsync(
        List<string> primaryCodes,
        CancellationToken cancellationToken)
    {
        if (primaryCodes.Count == 0)
            return new Dictionary<string, OrganizationHierarchy>(StringComparer.OrdinalIgnoreCase);

        var lowered = primaryCodes.Select(c => c.ToLowerInvariant()).ToList();
        var rows = await _context.OrganizationHierarchies
            .AsNoTracking()
            .Where(oh => !oh.IsDeleted && oh.Code != null && lowered.Contains(oh.Code.ToLower()))
            .ToListAsync(cancellationToken);

        var dict = new Dictionary<string, OrganizationHierarchy>(StringComparer.OrdinalIgnoreCase);
        foreach (var oh in rows)
        {
            if (oh.Code != null)
                dict[oh.Code] = oh;
        }

        return dict;
    }

    private async Task<List<OfficeOperationalRoleModel>> LoadOperationalRolesAsync(Office office, CancellationToken cancellationToken)
    {
        var orgHierarchyId = office.OrganizationHierarchyId!.Value;

        var matrixCodes = GetOperationalRoleMatrixCodes(office.OrganisationalEntityType);

        var assignments = await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == orgHierarchyId &&
                (e.RoleSource == MgmtRoleSource ||
                 e.RoleSource == OfficeMasterRoleSource ||
                 e.RoleSource == RoleSheetRoleSource) &&
                e.EntityRole != null &&
                e.EntityRole.Code != null)
            .ToListAsync(cancellationToken);

        var byCode = assignments
            .GroupBy(r => r.EntityRole!.Code!)
            .ToDictionary(g => g.Key, g => g.OrderBy(r => r.Id).ToList());

        var primaryCodesForLookup = assignments
            .SelectMany(a => new[]
            {
                OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(a.OrgUnitWorksAt),
                OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(a.User?.UserProfile?.OrgUnit),
            })
            .Where(s => !string.IsNullOrEmpty(s))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .Cast<string>()
            .ToList();
        var worksAtEnrichMap = await LoadOrgHierarchiesForWorksAtDisplayAsync(primaryCodesForLookup, cancellationToken);

        string? ResolveWorksAtForTableDisplay(string? raw)
        {
            if (string.IsNullOrWhiteSpace(raw))
                return raw;
            var t = raw.Trim();
            if (t.Contains(','))
                return raw;
            if (worksAtEnrichMap.TryGetValue(t, out var oh))
                return OrgUnitWorksAtDisplayFormatter.BuildDisplay(oh);
            oh = worksAtEnrichMap.Values.FirstOrDefault(v =>
                string.Equals(v.Code, t, StringComparison.OrdinalIgnoreCase));
            return oh != null ? OrgUnitWorksAtDisplayFormatter.BuildDisplay(oh) : raw;
        }

        int? ResolveHolderPrimaryOrgHierarchyId(EntityUserRole row)
        {
            var p1 = OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(row.OrgUnitWorksAt);
            if (!string.IsNullOrEmpty(p1) && worksAtEnrichMap.TryGetValue(p1, out var oh1))
                return oh1.Id;
            var p2 = OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(row.User?.UserProfile?.OrgUnit);
            if (!string.IsNullOrEmpty(p2) && worksAtEnrichMap.TryGetValue(p2, out var oh2))
                return oh2.Id;
            return null;
        }

        var result = new List<OfficeOperationalRoleModel>();
        foreach (var code in matrixCodes)
        {
            if (!byCode.TryGetValue(code, out var list) || list.Count == 0)
            {
                result.Add(new OfficeOperationalRoleModel
                {
                    EntityRoleCode = code,
                    RoleName = code,
                    HolderName = null,
                    HolderUserId = null,
                    PositionTitle = null,
                    OrgUnitWorksAt = null,
                    ApplicabilityPeriodStart = null,
                    IsActive = false,
                    WorksAtMismatch = false,
                });
                continue;
            }

            // Sheet-driven org roles: OfficeMaster only — hide Mgmt rows. RMOA also allows RoleSheet (practitioner CSV).
            if (OfficeMasterOnlyOperationalRoleCodes.Contains(code))
            {
                if (string.Equals(code, RegionalManagementOversightAdvisorRoleCode, StringComparison.Ordinal))
                {
                    list = [.. list.Where(r =>
                        string.Equals(r.RoleSource, OfficeMasterRoleSource, StringComparison.Ordinal) ||
                        string.Equals(r.RoleSource, RoleSheetRoleSource, StringComparison.Ordinal))];
                }
                else
                {
                    list = [.. list.Where(r =>
                        string.Equals(r.RoleSource, OfficeMasterRoleSource, StringComparison.Ordinal))];
                }
            }

            if (list.Count == 0)
            {
                result.Add(new OfficeOperationalRoleModel
                {
                    EntityRoleCode = code,
                    RoleName = code,
                    HolderName = null,
                    HolderUserId = null,
                    PositionTitle = null,
                    OrgUnitWorksAt = null,
                    ApplicabilityPeriodStart = null,
                    IsActive = false,
                    WorksAtMismatch = false,
                });
                continue;
            }

            // One row per assignment (same role code may have multiple users — same pattern as DoA holders).
            foreach (var r in list)
            {
                var holder = r.User;
                string? holderName = null;
                int? holderUserId = null;
                if (holder != null)
                {
                    holderUserId = holder.Id;
                    var n = holder.Name;
                    if (string.IsNullOrWhiteSpace(n))
                        n = holder.Email;
                    holderName = string.IsNullOrWhiteSpace(n) ? null : n.Trim();
                }

                var orgUnitDisplay = ResolveWorksAtForTableDisplay(r.OrgUnitWorksAt);
                var holderOrgId = ResolveHolderPrimaryOrgHierarchyId(r);
                result.Add(new OfficeOperationalRoleModel
                {
                    EntityRoleCode = code,
                    RoleName = r.EntityRole?.Name ?? code,
                    HolderName = holderName,
                    HolderUserId = holderUserId,
                    PositionTitle = r.PositionTitle,
                    OrgUnitWorksAt = orgUnitDisplay,
                    ApplicabilityPeriodStart = r.ApplicabilityPeriodStart,
                    IsActive = IsRoleActive(r),
                    WorksAtMismatch = ComputeWorksAtOrganizationMismatch(code, orgHierarchyId, holderOrgId),
                });
            }
        }

        return result;
    }

    private async Task<List<OfficeOperationalRoleAuditEntryModel>> LoadOperationalRoleAuditTrailAsync(
        int officeId,
        CancellationToken cancellationToken)
    {
        var logs = await _context.AuditLogs
            .AsNoTracking()
            .Where(a =>
                !a.IsDeleted &&
                a.EntityType == OfficeOperationalRoleAuditEntityType &&
                a.EntityId == officeId)
            .OrderByDescending(a => a.Timestamp)
            .Take(100)
            .ToListAsync(cancellationToken);

        return await MapOperationalRoleAuditLogsToEntryModelsAsync(logs, cancellationToken);
    }

    private async Task<List<OfficeOperationalRoleAuditEntryModel>> MapOperationalRoleAuditLogsToEntryModelsAsync(
        List<AuditLog> logs,
        CancellationToken cancellationToken)
    {
        if (logs.Count == 0)
            return new List<OfficeOperationalRoleAuditEntryModel>();

        var parsed = new List<(AuditLog Log, string? Code, string? Eff, int NewUid, List<int> Prev)>();
        var assigneeIds = new HashSet<int>();
        foreach (var log in logs)
        {
            string? code = null;
            string? eff = null;
            var newUid = 0;
            var prev = new List<int>();
            if (!string.IsNullOrEmpty(log.JsonData))
            {
                try
                {
                    using var doc = JsonDocument.Parse(log.JsonData);
                    var root = doc.RootElement;
                    if (root.TryGetProperty("entityRoleCode", out var c) && c.ValueKind == JsonValueKind.String)
                        code = c.GetString();
                    if (root.TryGetProperty("effectiveDate", out var e) && e.ValueKind == JsonValueKind.String)
                        eff = e.GetString();
                    if (root.TryGetProperty("newUserId", out var n) && n.ValueKind == JsonValueKind.Number)
                        newUid = n.GetInt32();
                    if (root.TryGetProperty("previousUserIds", out var p) && p.ValueKind == JsonValueKind.Array)
                    {
                        foreach (var el in p.EnumerateArray())
                        {
                            if (el.ValueKind == JsonValueKind.Number)
                                prev.Add(el.GetInt32());
                        }
                    }
                }
                catch (JsonException)
                {
                    // leave parsed fields empty
                }
            }

            assigneeIds.Add(log.UserId);
            if (newUid > 0)
                assigneeIds.Add(newUid);
            foreach (var id in prev)
                assigneeIds.Add(id);

            parsed.Add((log, code, eff, newUid, prev));
        }

        var distinctCodes = parsed
            .Select(p => p.Code)
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .Distinct(StringComparer.Ordinal)
            .Cast<string>()
            .ToList();

        var roleNameByCode = new Dictionary<string, string?>(StringComparer.Ordinal);
        if (distinctCodes.Count > 0)
        {
            var roleRows = await _context.Set<EntityRole>()
                .AsNoTracking()
                .Where(er => !er.IsDeleted && er.Code != null && distinctCodes.Contains(er.Code))
                .Select(er => new { er.Code, er.Name })
                .ToListAsync(cancellationToken);
            foreach (var row in roleRows)
            {
                if (row.Code != null)
                    roleNameByCode[row.Code] = row.Name;
            }
        }

        var users = await _context.PAOUsers
            .AsNoTracking()
            .Where(u => assigneeIds.Contains(u.Id))
            .Select(u => new { u.Id, u.Name, u.Email })
            .ToListAsync(cancellationToken);

        string? DisplayName(string? name, string? email)
        {
            if (!string.IsNullOrWhiteSpace(name))
                return name.Trim();
            if (!string.IsNullOrWhiteSpace(email))
                return email.Trim();
            return null;
        }

        var nameById = users.ToDictionary(
            u => u.Id,
            u => DisplayName(u.Name, u.Email));

        var result = new List<OfficeOperationalRoleAuditEntryModel>(parsed.Count);
        foreach (var (log, code, eff, newUid, prev) in parsed)
        {
            result.Add(new OfficeOperationalRoleAuditEntryModel
            {
                Timestamp = log.Timestamp,
                ChangedByUserId = log.UserId,
                ChangedByName = nameById.GetValueOrDefault(log.UserId),
                EntityRoleCode = code ?? string.Empty,
                RoleName = code != null && roleNameByCode.TryGetValue(code, out var rn) ? rn : null,
                EffectiveDate = eff,
                NewUserId = newUid,
                NewAssigneeName = newUid > 0 ? nameById.GetValueOrDefault(newUid) : null,
                PreviousUserIds = prev,
                Description = log.Description,
            });
        }

        return result;
    }

    private async Task<List<OfficeDoAHolderModel>> LoadDoAHoldersWithGapsAsync(int orgHierarchyId, CancellationToken cancellationToken)
    {
        var matrix = DoATypeRegistry.GetDoATypeLevelMatrix();
        var doARoles = await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == orgHierarchyId &&
                e.RoleSource == DoARoleSource)
            .ToListAsync(cancellationToken);

        var officerInChargeDisplayByResourceId = await LoadOfficerInChargeDisplayNamesAsync(doARoles, cancellationToken);

        // Group by role code: multiple users per role, or same user with different applicability periods
        var roleCodeToHolders = doARoles
            .Where(r => r.EntityRole?.Code != null)
            .GroupBy(r => r.EntityRole!.Code!)
            .ToDictionary(g => g.Key, g => g.ToList());

        var result = new List<OfficeDoAHolderModel>();
        foreach (var (doAType, level) in matrix)
        {
            var roleCode = DoATypeRegistry.GetEntityRoleCode(doAType, level);
            var holders = roleCodeToHolders.TryGetValue(roleCode, out var list) ? list : new List<EntityUserRole>();

            if (holders.Count == 0)
            {
                result.Add(new OfficeDoAHolderModel
                {
                    DoAType = doAType,
                    DoALevel = level,
                    RoleHolder = null,
                    ApplicabilityPeriodStart = null,
                    ApplicabilityPeriodEnd = null,
                    Conditions = null,
                    IsActive = false
                });
            }
            else
            {
                foreach (var holder in holders)
                {
                    var oicResourceId = string.IsNullOrWhiteSpace(holder.OfficerInChargeResourceId)
                        ? null
                        : holder.OfficerInChargeResourceId.Trim();
                    string? oicDisplayName = null;
                    if (oicResourceId != null)
                    {
                        officerInChargeDisplayByResourceId.TryGetValue(oicResourceId, out oicDisplayName);
                        if (string.IsNullOrWhiteSpace(oicDisplayName))
                            oicDisplayName = oicResourceId;
                    }

                    result.Add(new OfficeDoAHolderModel
                    {
                        DoAType = doAType,
                        DoALevel = level,
                        RoleHolder = holder.User?.Name ?? holder.User?.Email ?? "",
                        ApplicabilityPeriodStart = holder.ApplicabilityPeriodStart,
                        ApplicabilityPeriodEnd = holder.ApplicabilityPeriodEnd,
                        Conditions = holder.Conditions,
                        RoleSource = holder.RoleSource,
                        IsActive = IsRoleActive(holder),
                        OfficerInChargeResourceId = oicResourceId,
                        OfficerInChargeDisplayName = oicDisplayName
                    });
                }
            }
        }

        return result;
    }

    /// <summary>
    /// Resolves Officer-in-Charge display names from <see cref="EntityUserRole.OfficerInChargeResourceId"/>
    /// when it matches an internal user id.
    /// </summary>
    private async Task<Dictionary<string, string>> LoadOfficerInChargeDisplayNamesAsync(
        IReadOnlyList<EntityUserRole> doARoles,
        CancellationToken cancellationToken)
    {
        var keys = doARoles
            .Select(r => r.OfficerInChargeResourceId)
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => s!.Trim())
            .Distinct(StringComparer.Ordinal)
            .ToList();

        var userIds = keys
            .Select(k => int.TryParse(k, out var id) ? (int?)id : null)
            .Where(id => id.HasValue)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        if (userIds.Count == 0)
            return new Dictionary<string, string>(StringComparer.Ordinal);

        var users = await _context.PAOUsers
            .AsNoTracking()
            .Include(u => u.UserProfile)
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync(cancellationToken);

        var map = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var u in users)
        {
            var display = !string.IsNullOrWhiteSpace(u.Name) ? u.Name : u.Email;
            if (string.IsNullOrWhiteSpace(display))
                continue;
            map[u.Id.ToString()] = display;
        }

        var result = new Dictionary<string, string>(StringComparer.Ordinal);
        foreach (var key in keys)
        {
            if (map.TryGetValue(key, out var name))
                result[key] = name;
        }

        return result;
    }

    /// <summary>
    /// Primary OfficeMaster holder for an operational role code on this org unit (first by id), if any.
    /// </summary>
    private async Task<int?> GetOfficeMasterHolderUserIdForRoleCodeAsync(
        int orgHierarchyId,
        string entityRoleCode,
        CancellationToken cancellationToken)
    {
        var roleId = await _context.Set<EntityRole>()
            .AsNoTracking()
            .Where(er => er.Code == entityRoleCode && !er.IsDeleted)
            .Select(er => (int?)er.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (!roleId.HasValue)
            return null;

        return await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == orgHierarchyId &&
                e.EntityRoleId == roleId.Value &&
                e.RoleSource == OfficeMasterRoleSource)
            .OrderBy(e => e.Id)
            .Select(e => (int?)e.UserId)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private static bool IsRoleActive(EntityUserRole r)
    {
        if (r.ApplicabilityPeriodEnd.HasValue && r.ApplicabilityPeriodEnd.Value.Date < DateTime.UtcNow.Date)
            return false;
        return true;
    }

    /// <summary>
    /// Builds parent chain: walks <see cref="Office.ParentOrganizationHierarchyId"/> via EF to ancestor offices,
    /// then appends the current office with <see cref="OfficeHierarchyNodeModel.IsCurrent"/>.
    /// Does not infer parents from <see cref="OrganizationHierarchy"/> alone — only linked <see cref="Office"/> rows.
    /// </summary>
    private async Task<List<OfficeHierarchyNodeModel>> BuildParentChainForOfficeAsync(Office office, CancellationToken cancellationToken)
    {
        var chain = await BuildAncestorsFromOfficeParentFkAsync(office, cancellationToken);

        chain.Add(new OfficeHierarchyNodeModel
        {
            Id = office.Id,
            OfficeId = office.Id,
            Code = office.Code,
            Name = office.Name ?? office.Code,
            Type = office.OrganisationalEntityType,
            IsCurrent = true
        });

        return chain;
    }

    /// <summary>
    /// Walks up from <paramref name="office"/> using
    /// <c>Offices WHERE OrganizationHierarchyId = current.ParentOrganizationHierarchyId</c>.
    /// </summary>
    private async Task<List<OfficeHierarchyNodeModel>> BuildAncestorsFromOfficeParentFkAsync(Office office, CancellationToken cancellationToken)
    {
        var ancestors = new List<OfficeHierarchyNodeModel>();
        if (!office.ParentOrganizationHierarchyId.HasValue)
            return ancestors;

        var cursor = office;
        var visited = new HashSet<int>();
        const int maxDepth = 64;
        for (var depth = 0; depth < maxDepth && cursor.ParentOrganizationHierarchyId.HasValue; depth++)
        {
            var parentOrgId = cursor.ParentOrganizationHierarchyId.Value;
            if (!visited.Add(parentOrgId))
                break;

            var parent = await _context.Offices
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    o => o.OrganizationHierarchyId == parentOrgId && !o.IsDeleted,
                    cancellationToken);
            if (parent == null)
                break;

            ancestors.Insert(
                0,
                new OfficeHierarchyNodeModel
                {
                    Id = parent.Id,
                    OfficeId = parent.Id,
                    Code = parent.Code,
                    Name = parent.Name ?? parent.Code,
                    Type = parent.OrganisationalEntityType,
                    IsCurrent = false
                });
            cursor = parent;
        }

        return ancestors;
    }

    /// <summary>
    /// Direct child offices where <see cref="Office.ParentOrganizationHierarchyId"/> equals this office's
    /// <see cref="Office.OrganizationHierarchyId"/> (no org-hierarchy fallback).
    /// </summary>
    private async Task<List<OfficeTreeNodeModel>> BuildChildOfficesForOfficeAsync(Office office, CancellationToken cancellationToken)
    {
        if (!office.OrganizationHierarchyId.HasValue)
            return new List<OfficeTreeNodeModel>();

        var myOrgUnitId = office.OrganizationHierarchyId.Value;

        var directChildren = await _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .Where(o => !o.IsDeleted && o.ParentOrganizationHierarchyId == myOrgUnitId)
            .OrderBy(o => o.Name)
            .ToListAsync(cancellationToken);

        return directChildren
            .Select(o => new OfficeTreeNodeModel
            {
                Id = o.Id,
                Code = o.Code,
                Name = o.Name ?? o.Code,
                Type = o.OrganisationalEntityType,
                Children = new List<OfficeTreeNodeModel>()
            })
            .ToList();
    }

    private async Task<List<OfficePhysicalDetailsModel>> LoadPhysicalLocationsAsync(int officeId, CancellationToken cancellationToken)
    {
        var locations = await _context.Locations
            .AsNoTracking()
            .Where(l => l.OfficeId == officeId && !l.IsDeleted)
            .ToListAsync(cancellationToken);

        return locations.Select(MapLocationToPhysicalDetails).ToList();
    }

    private static OfficePhysicalDetailsModel MapLocationToPhysicalDetails(Location loc)
    {
        var address = BuildAddress(loc.AddressLine, loc.PostalCode, loc.City, loc.State, loc.CountryName);
        var geoCoordinates = BuildGeoCoordinates(loc.PrimaryLatitude, loc.PrimaryLongitude, loc.CoordinatesJson);

        return new OfficePhysicalDetailsModel
        {
            OfficeId = loc.Code,
            OfficeName = loc.Name,
            Alias = loc.Alias,
            LocationType = loc.LocationType,
            Description = loc.Description,
            Address = address,
            City = loc.City,
            Country = loc.CountryName ?? loc.CountryCode,
            GeoCoordinates = geoCoordinates
        };
    }

    private static string? BuildAddress(string? addressLine, string? postalCode, string? city, string? state, string? countryName)
    {
        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(addressLine)) parts.Add(addressLine);
        if (!string.IsNullOrWhiteSpace(postalCode)) parts.Add(postalCode);
        if (!string.IsNullOrWhiteSpace(city)) parts.Add(city);
        if (!string.IsNullOrWhiteSpace(state)) parts.Add(state);
        if (!string.IsNullOrWhiteSpace(countryName)) parts.Add(countryName);
        return parts.Count > 0 ? string.Join("\n", parts) : null;
    }

    private static string? BuildGeoCoordinates(decimal? lat, decimal? lon, string? coordinatesJson)
    {
        if (lat.HasValue && lon.HasValue)
            return $"{lat.Value:G}, {lon.Value:G}";
        if (!string.IsNullOrWhiteSpace(coordinatesJson))
            return coordinatesJson;
        return null;
    }

    private async Task<OfficeSyncMetadataModel?> LoadSyncMetadataAsync(CancellationToken cancellationToken)
    {
        try
        {
            var financial = await _syncMetadataService.GetLastSyncedAtAsync(SyncConfigOffices, cancellationToken);
            var locations = await _syncMetadataService.GetLastSyncedAtAsync(SyncConfigLocations, cancellationToken);
            var roles = await _syncMetadataService.GetLastSyncedAtAsync(SyncConfigEntityUserRolesMgmt, cancellationToken);
            var doa = await _syncMetadataService.GetLastSyncedAtAsync(SyncConfigEntityUserRolesDoa, cancellationToken);

            if (financial == null && locations == null && roles == null && doa == null)
                return null;

            return new OfficeSyncMetadataModel
            {
                FinancialLastSyncedAt = financial,
                LocationsLastSyncedAt = locations,
                OperationalRolesLastSyncedAt = roles,
                DoAHoldersLastSyncedAt = doa
            };
        }
        catch
        {
            return null;
        }
    }

    private static OfficeDetailModel BuildDetailWithoutRoles(
        Office office,
        List<OfficePhysicalDetailsModel> physicalLocations,
        List<OfficeOperationalRoleModel> operationalRoles,
        List<OfficeDoAHolderModel> doAHolders,
        List<OfficeHierarchyNodeModel> parentChain,
        List<OfficeTreeNodeModel> children,
        List<CountryScopeModel> geographicScope,
        OfficeSyncMetadataModel? syncMetadata = null)
    {
        return new OfficeDetailModel
        {
            Id = office.Id,
            Code = office.Code,
            Name = office.Name ?? office.Code,
            OrganizationHierarchyId = office.OrganizationHierarchyId,
            KeyInformation = new OfficeKeyInformationModel
            {
                Id = office.Id,
                Code = office.Code,
                InternalName = office.InternalName,
                Alias = office.Alias,
                ExternalName = office.ExternalName,
                OrganisationalEntityType = office.OrganisationalEntityType,
                HierarchyLevel = office.HierarchyLevel,
                EffectiveDate = office.EffectiveDate
            },
            FinancialInformation = new OfficeFinancialInformationModel
            {
                CostCentreId = office.CostCentreId,
                FinancialCentreType = office.FinancialCentreType,
                Funding = office.Funding,
                NerTarget = office.NerTarget,
                NerTargetPeriod = office.NerTargetPeriod,
                EaTarget = office.EaTarget,
                EaTargetPeriod = office.EaTargetPeriod
            },
            Scope = new OfficeScopeModel { ScopeType = office.ScopeType, GeographicScope = geographicScope },
            PhysicalLocations = physicalLocations,
            OperationalRoles = operationalRoles,
            DoAHolders = doAHolders,
            ParentChain = parentChain,
            Children = children,
            SyncMetadata = syncMetadata
        };
    }

    /// <summary>
    /// Regional Office + OfficeMaster Organizational Director or Deputy Director on this office's org unit.
    /// Shared rule for document upload and workflow configuration edit until product diverges.
    /// </summary>
    private async Task<bool> IsRegionalOfficeDirectorOrDeputyOfficeMasterAsync(
        Office office,
        int userId,
        CancellationToken cancellationToken)
    {
        if (office.OrganizationHierarchyId is not { } orgHierarchyId)
            return false;

        if (!string.Equals(office.OrganisationalEntityType, RegionalOfficeOrganisationalEntityType, StringComparison.OrdinalIgnoreCase))
            return false;

        return await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                e.EntityId == orgHierarchyId &&
                e.UserId == userId &&
                e.RoleSource == OfficeMasterRoleSource &&
                e.EntityRole != null &&
                e.EntityRole.Code != null &&
                OfficeDocumentUploadEntityRoleCodes.Contains(e.EntityRole.Code))
            .AnyAsync(cancellationToken);
    }

    private Task<bool> CanUserUploadDocumentsAsync(Office office, int userId, CancellationToken cancellationToken) =>
        IsRegionalOfficeDirectorOrDeputyOfficeMasterAsync(office, userId, cancellationToken);

    private Task<bool> CanUserEditWorkflowConfigurationAsync(Office office, int userId, CancellationToken cancellationToken) =>
        IsRegionalOfficeDirectorOrDeputyOfficeMasterAsync(office, userId, cancellationToken);

    /// <summary>
    /// <see cref="UserProfile.OrgUnit"/> (&quot;works at&quot; code) resolves to the same
    /// <see cref="OrganizationHierarchy"/> as <see cref="Office.OrganizationHierarchyId"/>.
    /// Aligns with <c>UserPreferenceService</c> org resolution (OrgUnit-type hierarchy rows).
    /// </summary>
    private async Task<bool> CanUserEditOperationalRolesAsync(
        Office office,
        int userId,
        CancellationToken cancellationToken)
    {
        if (office.OrganizationHierarchyId is not { } officeOrgHierarchyId)
            return false;

        var profile = await _context.UserProfile
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId, cancellationToken);

        if (profile?.OrgUnit is not { } worksAtRaw || string.IsNullOrWhiteSpace(worksAtRaw))
            return false;

        var primary = OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(worksAtRaw.Trim());
        if (string.IsNullOrEmpty(primary))
            return false;

        var userOrgId = await _context.OrganizationHierarchies
            .AsNoTracking()
            .Where(oh =>
                oh.Code != null &&
                oh.Code.ToLower() == primary.ToLower() &&
                oh.Type == OrganizationUnitType.OrgUnit)
            .Select(oh => (int?)oh.Id)
            .FirstOrDefaultAsync(cancellationToken);

        if (userOrgId.HasValue)
            return userOrgId.Value == officeOrgHierarchyId;

        // Fallback: business key on office matches primary works-at code even if hierarchy row type/filter differs.
        return string.Equals(primary, office.Code.Trim(), StringComparison.OrdinalIgnoreCase);
    }

    /// <summary>
    /// Counts all offices in the subtree under <paramref name="office"/> (by <see cref="Office.ParentOrganizationHierarchyId"/> links), excluding <paramref name="office"/> itself.
    /// </summary>
    private async Task<int> CountDescendantOfficesInOfficeTreeAsync(Office office, CancellationToken cancellationToken)
    {
        if (!office.OrganizationHierarchyId.HasValue)
            return 0;

        var rootOrgId = office.OrganizationHierarchyId.Value;

        var officesWithParent = await _context.Offices
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.OrganizationHierarchyId != null && o.ParentOrganizationHierarchyId != null)
            .Select(o => new { o.OrganizationHierarchyId, o.ParentOrganizationHierarchyId })
            .ToListAsync(cancellationToken);

        var childrenByParent = officesWithParent
            .GroupBy(x => x.ParentOrganizationHierarchyId!.Value)
            .ToDictionary(g => g.Key, g => g.Select(x => x.OrganizationHierarchyId!.Value).Distinct().ToList());

        var queue = new Queue<int>();
        if (childrenByParent.TryGetValue(rootOrgId, out var directKids))
        {
            foreach (var kid in directKids)
                queue.Enqueue(kid);
        }

        var count = 0;
        var seenOrgIds = new HashSet<int> { rootOrgId };

        while (queue.Count > 0)
        {
            var orgId = queue.Dequeue();
            if (!seenOrgIds.Add(orgId))
                continue;

            count++;

            if (childrenByParent.TryGetValue(orgId, out var deeper))
            {
                foreach (var childOrgId in deeper)
                    queue.Enqueue(childOrgId);
            }
        }

        return count;
    }

    private static PaginationResponse<T> EmptyPagination<T>(OfficeFilterRequest request) where T : class
    {
        return new PaginationResponse<T>
        {
            Records = new List<T>(),
            TotalCount = 0,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalPages = 0
        };
    }
}
