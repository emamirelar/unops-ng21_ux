using System.Security.Claims;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Models.Offices;
using UNOPS.PAO.Models.Shared;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSBusiness.Managers;

/// <summary>
/// Manager for Office entity data access.
/// </summary>
public class OfficeManager : IOfficeManager
{
    private readonly UNOPSAppDbContext _context;
    private readonly IMapper _mapper;

    public OfficeManager(IMapper mapper, UNOPSAppDbContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    /// <inheritdoc />
    public async Task<Office?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .FirstOrDefaultAsync(o => o.Id == id && !o.IsDeleted, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Office?> GetByCodeAsync(string code, CancellationToken cancellationToken = default)
    {
        return await _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .FirstOrDefaultAsync(o => o.Code == code && !o.IsDeleted, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<PaginationResponse<OfficeListModel>> GetOfficesAsync(OfficeFilterRequest request, CancellationToken cancellationToken = default)
    {
        var query = _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
                .ThenInclude(oh => oh!.Parent)
            .Where(o => !o.IsDeleted);

        if (!string.IsNullOrWhiteSpace(request.Name))
        {
            var nameLower = request.Name.ToLowerInvariant();
            query = query.Where(o =>
                (o.InternalName != null && o.InternalName.ToLower().Contains(nameLower)) ||
                (o.Name != null && o.Name.ToLower().Contains(nameLower)) ||
                (o.Alias != null && o.Alias.ToLower().Contains(nameLower)));
        }

        if (!string.IsNullOrWhiteSpace(request.Code))
        {
            var codeLower = request.Code.ToLowerInvariant();
            query = query.Where(o => o.Code.ToLower().Contains(codeLower));
        }

        if (!string.IsNullOrWhiteSpace(request.Type))
        {
            query = query.Where(o => o.OrganisationalEntityType == request.Type);
        }

        if (request.ParentId.HasValue)
        {
            query = query.Where(o => o.OrganizationHierarchy != null &&
                !o.OrganizationHierarchy.IsDeleted &&
                o.OrganizationHierarchy.ParentId == request.ParentId.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.Alias))
        {
            var aliasLower = request.Alias.ToLowerInvariant();
            query = query.Where(o => o.Alias != null && o.Alias.ToLower().Contains(aliasLower));
        }

        if (!string.IsNullOrWhiteSpace(request.CostCentreId))
        {
            var costCentreLower = request.CostCentreId.ToLowerInvariant();
            query = query.Where(o => o.CostCentreId != null && o.CostCentreId.ToLower().Contains(costCentreLower));
        }

        if (!string.IsNullOrWhiteSpace(request.InternalName))
        {
            var internalLower = request.InternalName.ToLowerInvariant();
            query = query.Where(o => o.InternalName != null && o.InternalName.ToLower().Contains(internalLower));
        }

        if (!string.IsNullOrWhiteSpace(request.ExternalName))
        {
            var externalLower = request.ExternalName.ToLowerInvariant();
            query = query.Where(o => o.ExternalName != null && o.ExternalName.ToLower().Contains(externalLower));
        }

        if (request.HierarchyLevel.HasValue)
        {
            query = query.Where(o => o.HierarchyLevel == request.HierarchyLevel.Value);
        }

        if (request.EffectiveDateFrom.HasValue)
        {
            query = query.Where(o => o.EffectiveDate >= request.EffectiveDateFrom.Value);
        }

        if (request.EffectiveDateTo.HasValue)
        {
            query = query.Where(o => o.EffectiveDate <= request.EffectiveDateTo.Value);
        }

        if (!string.IsNullOrWhiteSpace(request.FinancialCentreType))
        {
            var fctLower = request.FinancialCentreType.ToLowerInvariant();
            query = query.Where(o => o.FinancialCentreType != null && o.FinancialCentreType.ToLower().Contains(fctLower));
        }

        if (!string.IsNullOrWhiteSpace(request.Funding))
        {
            var fundingLower = request.Funding.ToLowerInvariant();
            query = query.Where(o => o.Funding != null && o.Funding.ToLower().Contains(fundingLower));
        }

        if (!string.IsNullOrWhiteSpace(request.ScopeType))
        {
            query = query.Where(o => o.ScopeType == request.ScopeType);
        }

        if (request.Status.HasValue)
        {
            query = query.Where(o => (int)o.Status == request.Status.Value);
        }

        // Basic search: name, alias, cost centre ONLY (not code, internalName, externalName)
        if (!string.IsNullOrWhiteSpace(request.SearchTerm))
        {
            var term = request.SearchTerm.ToLowerInvariant();
            query = query.Where(o =>
                (o.Name != null && o.Name.ToLower().Contains(term)) ||
                (o.Alias != null && o.Alias.ToLower().Contains(term)) ||
                (o.CostCentreId != null && o.CostCentreId.ToLower().Contains(term)));
        }

        var totalCount = await query.CountAsync(cancellationToken);

        var orderBy = request.OrderBy?.ToLowerInvariant() ?? "name";
        var ascending = request.Ascending ?? true;

        query = orderBy switch
        {
            "code" => ascending ? query.OrderBy(o => o.Code) : query.OrderByDescending(o => o.Code),
            "alias" => ascending ? query.OrderBy(o => o.Alias) : query.OrderByDescending(o => o.Alias),
            "type" => ascending ? query.OrderBy(o => o.OrganisationalEntityType) : query.OrderByDescending(o => o.OrganisationalEntityType),
            "costcentreid" => ascending ? query.OrderBy(o => o.CostCentreId) : query.OrderByDescending(o => o.CostCentreId),
            "hierarchylevel" => ascending ? query.OrderBy(o => o.HierarchyLevel) : query.OrderByDescending(o => o.HierarchyLevel),
            "effectivedate" => ascending ? query.OrderBy(o => o.EffectiveDate) : query.OrderByDescending(o => o.EffectiveDate),
            "scopetype" => ascending ? query.OrderBy(o => o.ScopeType) : query.OrderByDescending(o => o.ScopeType),
            _ => ascending ? query.OrderBy(o => o.Name) : query.OrderByDescending(o => o.Name)
        };

        var skip = (request.PageIndex - 1) * request.PageSize;
        var entities = await query
            .Skip(skip)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        var orgHierarchyIds = entities
            .Where(o => o.OrganizationHierarchyId.HasValue)
            .Select(o => o.OrganizationHierarchyId!.Value)
            .Distinct()
            .ToList();

        var childrenCounts = orgHierarchyIds.Count > 0
            ? await GetChildOfficeCountsByOrgHierarchyIdsAsync(orgHierarchyIds, cancellationToken)
            : new Dictionary<int, int>();

        var regionalDirectors = await LoadRegionalDirectorsByOrgHierarchyIdsAsync(orgHierarchyIds, cancellationToken);

        var records = entities.Select(o =>
        {
            var orgHierarchyId = o.OrganizationHierarchyId;
            var childrenCount = orgHierarchyId.HasValue && childrenCounts.TryGetValue(orgHierarchyId.Value, out var count) ? count : 0;
            var regionalDirector = orgHierarchyId.HasValue && regionalDirectors.TryGetValue(orgHierarchyId.Value, out var rd) ? rd : null;

            return new OfficeListModel
            {
                Id = o.Id,
                Code = o.Code,
                Name = o.Name ?? o.Code,
                Alias = o.Alias,
                Type = o.OrganisationalEntityType,
                HierarchyLevel = o.HierarchyLevel,
                ParentId = o.OrganizationHierarchy?.ParentId,
                ParentName = o.OrganizationHierarchy?.Parent != null ? o.OrganizationHierarchy.Parent.Name : null,
                ChildrenCount = childrenCount,
                Status = (int)o.Status,
                RegionalDirector = regionalDirector,
                ScopeType = o.ScopeType,
                OrganizationHierarchyId = o.OrganizationHierarchyId,
                InternalName = o.InternalName,
                ExternalName = o.ExternalName,
                OrganisationalEntityType = o.OrganisationalEntityType,
                EffectiveDate = o.EffectiveDate,
                CostCentreId = o.CostCentreId,
                FinancialCentreType = o.FinancialCentreType,
                Funding = o.Funding,
                NerTarget = o.NerTarget,
                NerTargetPeriod = o.NerTargetPeriod,
                EaTarget = o.EaTarget,
                EaTargetPeriod = o.EaTargetPeriod
            };
        }).ToList();

        return new PaginationResponse<OfficeListModel>
        {
            Records = records,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalPages = (int)Math.Ceiling(totalCount / (double)request.PageSize)
        };
    }

    /// <inheritdoc />
    public async Task<List<object>> GetByIdsAsync(int[] ids, ClaimsPrincipal? user = null)
    {
        if (ids == null || ids.Length == 0)
            return new List<object>();

        var offices = await _context.Offices
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
                .ThenInclude(oh => oh!.Parent)
            .Where(o => !o.IsDeleted && ids.Contains(o.Id))
            .ToListAsync();

        var orgHierarchyIds = offices
            .Where(o => o.OrganizationHierarchyId.HasValue)
            .Select(o => o.OrganizationHierarchyId!.Value)
            .Distinct()
            .ToList();

        var childrenCounts = orgHierarchyIds.Count > 0
            ? await GetChildOfficeCountsByOrgHierarchyIdsAsync(orgHierarchyIds, CancellationToken.None)
            : new Dictionary<int, int>();

        var regionalDirectors = await LoadRegionalDirectorsByOrgHierarchyIdsAsync(orgHierarchyIds);

        var records = offices.Select(o =>
        {
            var orgHierarchyId = o.OrganizationHierarchyId;
            var childrenCount = orgHierarchyId.HasValue && childrenCounts.TryGetValue(orgHierarchyId.Value, out var count) ? count : 0;
            var regionalDirector = orgHierarchyId.HasValue && regionalDirectors.TryGetValue(orgHierarchyId.Value, out var rd) ? rd : null;

            return (object)new OfficeListModel
            {
                Id = o.Id,
                Code = o.Code,
                Name = o.Name ?? o.Code,
                Alias = o.Alias,
                Type = o.OrganisationalEntityType,
                HierarchyLevel = o.HierarchyLevel,
                ParentId = o.OrganizationHierarchy?.ParentId,
                ParentName = o.OrganizationHierarchy?.Parent != null ? o.OrganizationHierarchy.Parent.Name : null,
                ChildrenCount = childrenCount,
                Status = (int)o.Status,
                RegionalDirector = regionalDirector,
                ScopeType = o.ScopeType,
                OrganizationHierarchyId = o.OrganizationHierarchyId,
                InternalName = o.InternalName,
                ExternalName = o.ExternalName,
                OrganisationalEntityType = o.OrganisationalEntityType,
                EffectiveDate = o.EffectiveDate,
                CostCentreId = o.CostCentreId,
                FinancialCentreType = o.FinancialCentreType,
                Funding = o.Funding,
                NerTarget = o.NerTarget,
                NerTargetPeriod = o.NerTargetPeriod,
                EaTarget = o.EaTarget,
                EaTargetPeriod = o.EaTargetPeriod
            };
        }).ToList();

        return records;
    }

    /// <inheritdoc />
    public async Task<List<OfficeListModel>> MapOfficesToOfficeListModelsAsync(List<Office> offices, CancellationToken cancellationToken = default)
    {
        if (offices == null || offices.Count == 0)
            return new List<OfficeListModel>();

        var orgHierarchyIds = offices
            .Where(o => o.OrganizationHierarchyId.HasValue)
            .Select(o => o.OrganizationHierarchyId!.Value)
            .Distinct()
            .ToList();

        var childrenCounts = orgHierarchyIds.Count > 0
            ? await GetChildOfficeCountsByOrgHierarchyIdsAsync(orgHierarchyIds, cancellationToken)
            : new Dictionary<int, int>();

        var regionalDirectors = await LoadRegionalDirectorsByOrgHierarchyIdsAsync(orgHierarchyIds, cancellationToken);

        return offices.Select(o =>
        {
            var orgHierarchyId = o.OrganizationHierarchyId;
            var childrenCount = orgHierarchyId.HasValue && childrenCounts.TryGetValue(orgHierarchyId.Value, out var count) ? count : 0;
            var regionalDirector = orgHierarchyId.HasValue && regionalDirectors.TryGetValue(orgHierarchyId.Value, out var rd) ? rd : null;

            return new OfficeListModel
            {
                Id = o.Id,
                Code = o.Code,
                Name = o.Name ?? o.Code,
                Alias = o.Alias,
                Type = o.OrganisationalEntityType,
                HierarchyLevel = o.HierarchyLevel,
                ParentId = o.OrganizationHierarchy?.ParentId,
                ParentName = o.OrganizationHierarchy?.Parent != null ? o.OrganizationHierarchy.Parent.Name : null,
                ChildrenCount = childrenCount,
                Status = (int)o.Status,
                RegionalDirector = regionalDirector,
                ScopeType = o.ScopeType,
                OrganizationHierarchyId = o.OrganizationHierarchyId,
                InternalName = o.InternalName,
                ExternalName = o.ExternalName,
                OrganisationalEntityType = o.OrganisationalEntityType,
                EffectiveDate = o.EffectiveDate,
                CostCentreId = o.CostCentreId,
                FinancialCentreType = o.FinancialCentreType,
                Funding = o.Funding,
                NerTarget = o.NerTarget,
                NerTargetPeriod = o.NerTargetPeriod,
                EaTarget = o.EaTarget,
                EaTargetPeriod = o.EaTargetPeriod
            };
        }).ToList();
    }

    private const string OrganizationHierarchyEntityType = "OrganizationHierarchy";
    private const string MgmtRoleSource = "Mgmt";
    private const string OfficeMasterRoleSource = "OfficeMaster";
    private const string RegionalDirectorRoleCode = "Regional_Director_OrganizationHierarchy";
    private const string OrganizationalDirectorRoleCode = "Organizational_Director_OrganizationHierarchy";

    /// <summary>
    /// Counts direct child offices per org unit id: non-deleted <see cref="Office"/> rows whose
    /// <see cref="Office.ParentOrganizationHierarchyId"/> equals the parent office's
    /// <see cref="Office.OrganizationHierarchyId"/>.
    /// </summary>
    private async Task<Dictionary<int, int>> GetChildOfficeCountsByOrgHierarchyIdsAsync(
        IReadOnlyCollection<int> orgHierarchyIds,
        CancellationToken cancellationToken)
    {
        if (orgHierarchyIds.Count == 0)
            return new Dictionary<int, int>();

        var distinctIds = orgHierarchyIds.Distinct().ToList();

        return await _context.Offices
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.ParentOrganizationHierarchyId != null && distinctIds.Contains(o.ParentOrganizationHierarchyId.Value))
            .GroupBy(o => o.ParentOrganizationHierarchyId!.Value)
            .ToDictionaryAsync(g => g.Key, g => g.Count(), cancellationToken);
    }

    private async Task<Dictionary<int, string>> LoadRegionalDirectorsByOrgHierarchyIdsAsync(
        List<int> orgHierarchyIds,
        CancellationToken cancellationToken = default)
    {
        if (orgHierarchyIds.Count == 0)
            return new Dictionary<int, string>();

        var masterRoles = await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                orgHierarchyIds.Contains(e.EntityId) &&
                e.RoleSource == OfficeMasterRoleSource &&
                e.EntityRole != null &&
                e.EntityRole.Code == OrganizationalDirectorRoleCode)
            .OrderBy(e => e.Id)
            .ToListAsync(cancellationToken);

        var masterByOrg = masterRoles
            .GroupBy(r => r.EntityId)
            .ToDictionary(g => g.Key, g => HolderDisplayNameForList(g.First()));

        var rdRoles = await _context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                e.EntityType == OrganizationHierarchyEntityType &&
                orgHierarchyIds.Contains(e.EntityId) &&
                e.RoleSource == MgmtRoleSource &&
                e.EntityRole != null &&
                e.EntityRole.Code == RegionalDirectorRoleCode)
            .OrderBy(e => e.Id)
            .ToListAsync(cancellationToken);

        var mgmtByOrg = rdRoles
            .GroupBy(r => r.EntityId)
            .ToDictionary(g => g.Key, g => HolderDisplayNameForList(g.First()));

        var result = new Dictionary<int, string>();
        foreach (var id in orgHierarchyIds.Distinct())
        {
            if (masterByOrg.TryGetValue(id, out var m) && !string.IsNullOrEmpty(m))
            {
                result[id] = m;
                continue;
            }

            if (mgmtByOrg.TryGetValue(id, out var legacy) && !string.IsNullOrEmpty(legacy))
                result[id] = legacy;
        }

        return result;
    }

    private static string HolderDisplayNameForList(EntityUserRole r)
    {
        var user = r.User;
        if (user == null) return string.Empty;
        var name = user.UserProfile?.Name;
        if (!string.IsNullOrEmpty(name))
            return name.Trim();
        return user.Email ?? string.Empty;
    }
}
