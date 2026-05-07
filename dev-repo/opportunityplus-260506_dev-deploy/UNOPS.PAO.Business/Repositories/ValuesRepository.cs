using System;
using UNOPS.PAO.Business.Opportunities;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Models.OrganizationUnits;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.Utilities.Interfaces;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.UNOPSDomain.Entities;

namespace UNOPS.PAO.Business.Repositories;
public class ValuesRepository
{
    AppDbContext context;

    public ValuesRepository(AppDbContext context)
    {
        this.context = context;
    }

    public IEnumerable<Currency> GetCurrencies() => context.Currencies.Where(x => x.Status == EntityStatus.Active);

    public IEnumerable<EligibleEntity> GetEligibleEntities() => context.EligibleEntities.Where(x => x.Status == EntityStatus.Active);

    public IEnumerable<Models.Shared.SimpleValueModel> GetCountries() 
        => context.Countries
            .Where(x => x.Status == EntityStatus.Active)
            .OrderBy(x => x.Name)
            .Select(x => new Models.Shared.SimpleValueModel
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Iso2Code,
                Description = x.Name,
                Continent = x.ContinentDescription,
                Region = x.RegionDescription
            })
            .ToList();

    public IQueryable<Partner> GetPartners()
        => context.Partners
            .Where(x => !x.IsDeleted);
    
    // Get flat list of organization units by type
    public IEnumerable<OrganizationHierarchy> GetOrganizationsByType(OrganizationUnitType type)
        => context.OrganizationHierarchies
            .Where(x => !x.IsDeleted && x.Type == type && x.Status == EntityStatus.Active)
            .OrderBy(x => x.Name);

    // Get flat list of organization units by multiple types (for Opportunity dropdown)
    public IEnumerable<OrganizationHierarchy> GetOrganizationsByTypes(params OrganizationUnitType[] types)
        => context.OrganizationHierarchies
            .Where(x => !x.IsDeleted && types.Contains(x.Type) && x.Status == EntityStatus.Active)
            .OrderBy(x => x.Name);

    /// <summary>
    /// Active P3M offices for Opportunity responsible-org dropdown.
    /// <see cref="OrganizationHierarchyModel.Id"/> is <see cref="Office.Id"/>; Type reflects linked <see cref="OrganizationHierarchy"/> when present.
    /// </summary>
    public List<OrganizationHierarchyModel> GetOpportunityOrganizationUnits()
        => context.Set<Office>()
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .Where(o => !o.IsDeleted && o.Status == EntityStatus.Active)
            .OrderBy(o => o.Name)
            .AsEnumerable()
            .Select(o => new OrganizationHierarchyModel
            {
                Id = o.Id,
                OrganizationHierarchyId = o.OrganizationHierarchyId,
                Code = o.Code,
                Name = o.Name,
                Status = o.Status.ToString(),
                Type = o.OrganizationHierarchy != null
                    ? o.OrganizationHierarchy.Type.ToString()
                    : (o.OrganisationalEntityType ?? "Office"),
                Description = o.ExternalName ?? o.InternalName ?? string.Empty,
                ParentId = null,
                ParentName = null,
                ParentCode = null,
                IsSelfManagementEnabled = false,
                ChildrenCount = 0,
                EntityRelationshipCount = 0,
            })
            .ToList();

    public Task<int[]> ResolveResponsibleOrgKeysToOrganizationHierarchyIdsAsync(int[] keys)
        => ResponsibleOfficeResolution.ResolveKeysToOrganizationHierarchyIdsAsync(context, keys);

    // Get complete hierarchy starting from root (where ParentId is null)
    public async Task<IEnumerable<OrganizationHierarchyTreeModel>> GetOrganizationHierarchy()
    {
        var allUnits = await context.OrganizationHierarchies
            .Where(x => !x.IsDeleted && x.Status == EntityStatus.Active)
            .OrderBy(x => x.Name)
            .ToListAsync();

        var rootUnits = allUnits.Where(x => x.ParentId == null).ToList();
        var result = new List<OrganizationHierarchyTreeModel>();

        foreach (var root in rootUnits)
        {
            var treeModel = new OrganizationHierarchyTreeModel
            {
                Data = new OrganizationHierarchyDataModel
                {
                    Id = root.Id,
                    Code = root.Code,
                    Name = root.Name,
                    Type = root.Type,
                    Description = root.Description,
                    ParentId = root.ParentId,
                    Children = BuildChildren(root.Id, allUnits)
                }
            };
            result.Add(treeModel);
        }

        return result;
    }

    private List<OrganizationHierarchyDataModel> BuildChildren(int parentId, List<OrganizationHierarchy> allUnits)
    {
        var children = allUnits.Where(x => x.ParentId == parentId).ToList();
        var result = new List<OrganizationHierarchyDataModel>();

        foreach (var child in children)
        {
            result.Add(new OrganizationHierarchyDataModel
            {
                Id = child.Id,
                Code = child.Code,
                Name = child.Name,
                Type = child.Type,
                Description = child.Description,
                ParentId = child.ParentId,
                Children = BuildChildren(child.Id, allUnits)
            });
        }

        return result;
    }

    // Get hierarchy for a specific organization unit and its descendants
    public async Task<OrganizationHierarchy> GetOrganizationHierarchyById(int id)
        => await context.OrganizationHierarchies
            .Where(x => !x.IsDeleted && x.Id == id)
            .Include(x => x.Children)
            .ThenInclude(child => child.Children)
            .FirstOrDefaultAsync();

    // Get flat list of all active organization units
    public IEnumerable<OrganizationHierarchy> GetAllOrganizations()
        => context.OrganizationHierarchies
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.Name);
    

    public IEnumerable<Contact> GetContacts()
        => context.Contacts.Where(x => !x.IsDeleted)
                   .Include(x => x.Partner);

    public IEnumerable<PAOUser> GetUsers()
        => context.PAOUsers.Where(u => u.ActiveUser);

    // Optimized user loading with pagination and search
    public async Task<(IEnumerable<PAOUser> Users, int TotalCount)> GetUsersPagedAsync(
        int pageIndex = 0, 
        int pageSize = 50, 
        string? searchTerm = null,
        bool activeOnly = true,
        int[]? selectedUserIds = null)
    {
        var allUsers = new List<PAOUser>();
        
        // First, get selected users if any are provided
        if (selectedUserIds != null && selectedUserIds.Length > 0)
        {
            var selectedUsers = await context.PAOUsers
                .Include(u => u.UserProfile)
                .Where(u => u.ActiveUser &&
                           selectedUserIds.Contains(u.Id) && 
                           (!activeOnly || u.UserProfile == null || !u.UserProfile.IsDeleted))
                .ToListAsync();
            
            allUsers.AddRange(selectedUsers);
        }

        var query = context.PAOUsers
            .Include(u => u.UserProfile)
            .Where(u => u.ActiveUser && (!activeOnly || !u.UserProfile!.IsDeleted)); // Filter active users if requested

        // Exclude already selected users from the main query
        if (selectedUserIds != null && selectedUserIds.Length > 0)
        {
            query = query.Where(u => !selectedUserIds.Contains(u.Id));
        }

        // Apply search filter
        if (!string.IsNullOrEmpty(searchTerm))
        {
            var searchLower = searchTerm.ToLower();
            query = query.Where(u => 
                u.Email.ToLower().Contains(searchLower) ||
                (u.UserProfile != null && (
                    (u.UserProfile.FirstName != null && u.UserProfile.FirstName.ToLower().Contains(searchLower)) ||
                    (u.UserProfile.LastName != null && u.UserProfile.LastName.ToLower().Contains(searchLower)) ||
                    (u.UserProfile.Position != null && u.UserProfile.Position.ToLower().Contains(searchLower)) ||
                    (u.UserProfile.OrgUnit != null && u.UserProfile.OrgUnit.ToLower().Contains(searchLower))
                ))
            );
        }

        // Order by name for consistent results
        query = query.OrderBy(u => u.UserProfile != null ? u.UserProfile.FirstName ?? "" : "")
                    .ThenBy(u => u.UserProfile != null ? u.UserProfile.LastName ?? "" : "")
                    .ThenBy(u => u.Email);

        var totalCount = await query.CountAsync();
        var pagedUsers = await query
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync();

        allUsers.AddRange(pagedUsers);

        // Sort final result: selected users first, then paged results
        var selectedIds = selectedUserIds ?? Array.Empty<int>();
        var finalUsers = allUsers
            .OrderBy(u => selectedIds.Contains(u.Id) ? 0 : 1) // Selected users first
            .ThenBy(u => u.UserProfile?.FirstName ?? "")
            .ThenBy(u => u.UserProfile?.LastName ?? "")
            .ThenBy(u => u.Email);

        // Total count includes selected users plus the count of searchable users
        var finalTotalCount = (selectedUserIds?.Length ?? 0) + totalCount;

        return (finalUsers, finalTotalCount);
    }

    // Quick search for autocomplete - returns first 20 matches plus any selected users
    public async Task<IEnumerable<PAOUser>> SearchUsersAsync(string? searchTerm, int maxResults = 20, int[]? selectedUserIds = null)
    {
        var allUsers = new List<PAOUser>();

        // First, get selected users if any are provided
        if (selectedUserIds != null && selectedUserIds.Length > 0)
        {
            var selectedUsers = await context.PAOUsers
                .Include(u => u.UserProfile)
                .Where(u => u.ActiveUser &&
                           selectedUserIds.Contains(u.Id) && u.UserProfile != null && !u.UserProfile.IsDeleted)
                .ToListAsync();
            
            allUsers.AddRange(selectedUsers);
        }

        // Then get search results if search term is provided
        if (!string.IsNullOrEmpty(searchTerm) && searchTerm.Length >= 2)
        {
            var excludeIds = selectedUserIds ?? Array.Empty<int>();
            var searchTerms = searchTerm.ToLower().Split(' ', StringSplitOptions.RemoveEmptyEntries);

            var query = context.PAOUsers
                .Include(u => u.UserProfile)
                .Where(u => u.ActiveUser &&
                           u.UserProfile != null && !u.UserProfile.IsDeleted &&
                    !excludeIds.Contains(u.Id));

            // Each word must match at least one field (AND across words, OR across fields)
            // e.g. "John Smith" → "john" matches any field AND "smith" matches any field
            foreach (var term in searchTerms)
            {
                query = query.Where(u =>
                    u.Email.ToLower().Contains(term) ||
                    (u.UserProfile.FirstName != null && u.UserProfile.FirstName.ToLower().Contains(term)) ||
                    (u.UserProfile.LastName != null && u.UserProfile.LastName.ToLower().Contains(term)) ||
                    (u.UserProfile.Position != null && u.UserProfile.Position.ToLower().Contains(term)) ||
                    (u.UserProfile.OrgUnit != null && u.UserProfile.OrgUnit.ToLower().Contains(term)));
            }

            var searchUsers = await query
                .OrderBy(u => u.UserProfile.FirstName ?? "")
                .ThenBy(u => u.UserProfile.LastName ?? "")
                .Take(maxResults)
                .ToListAsync();

            allUsers.AddRange(searchUsers);
        }

        // Sort the final result: selected users first, then search results
        var selectedIds = selectedUserIds ?? Array.Empty<int>();
        return allUsers
            .OrderBy(u => selectedIds.Contains(u.Id) ? 0 : 1) // Selected users first
            .ThenBy(u => u.UserProfile?.FirstName ?? "")
            .ThenBy(u => u.UserProfile?.LastName ?? "");
    }

    /// <summary>
    /// Loads organization hierarchy rows for B-codes (case-insensitive) to enrich directory &quot;Works at&quot; display.
    /// </summary>
    public async Task<Dictionary<string, OrganizationHierarchy>> GetOrganizationHierarchiesByPrimaryCodesAsync(
        IReadOnlyCollection<string> primaryCodes,
        CancellationToken cancellationToken = default)
    {
        var distinct = primaryCodes
            .Where(c => !string.IsNullOrWhiteSpace(c))
            .Select(c => c.Trim())
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        if (distinct.Count == 0)
            return new Dictionary<string, OrganizationHierarchy>(StringComparer.OrdinalIgnoreCase);

        var lowered = distinct.Select(c => c.ToLowerInvariant()).ToList();
        var rows = await context.OrganizationHierarchies
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

    public IEnumerable<LiaisonOffice> GetLiaisonOffices() 
        => context.LiaisonOffices.Where(x => x.IsActive && !x.IsDeleted);

    /// <summary>
    /// Office tree for global org selector / PrimeNG: <see cref="OrganizationHierarchyPrimeDataModel.Id"/> is
    /// <see cref="Office.Id"/>; <see cref="OrganizationHierarchyPrimeDataModel.ParentId"/> is parent <see cref="Office.Id"/>.
    /// Parent/child structure uses <see cref="Office.ParentOrganizationHierarchyId"/> → parent's
    /// <see cref="Office.OrganizationHierarchyId"/> (MASTER parent cost centre), not <see cref="OrganizationHierarchy.ParentId"/>.
    /// Active offices are queried with AsNoTracking(), then materialized to build the recursive tree in memory;
    /// office counts are expected to stay moderate. If that changes, consider caching (short TTL) at the API layer.
    /// </summary>
    public async Task<IEnumerable<OrganizationHierarchyPrimeModel>> GetOrganizationHierarchyPrime()
    {
        var offices = await context.Set<Office>()
            .AsNoTracking()
            .Include(o => o.OrganizationHierarchy)
            .Where(o => !o.IsDeleted && o.Status == EntityStatus.Active)
            .OrderBy(o => o.Name)
            .ToListAsync();

        if (offices.Count == 0)
            return Enumerable.Empty<OrganizationHierarchyPrimeModel>();

        var byOrgHierarchyId = offices
            .Where(o => o.OrganizationHierarchyId.HasValue)
            .ToDictionary(o => o.OrganizationHierarchyId!.Value);

        static Office? ResolveParentOffice(Office o, Dictionary<int, Office> byOrgHid)
        {
            if (!o.ParentOrganizationHierarchyId.HasValue)
                return null;
            return byOrgHid.TryGetValue(o.ParentOrganizationHierarchyId.Value, out var p) ? p : null;
        }

        var roots = offices
            .Where(o => ResolveParentOffice(o, byOrgHierarchyId) == null)
            .OrderBy(o => o.Name)
            .ToList();

        return roots.Select(r => BuildOfficePrimeNode(r, offices, byOrgHierarchyId, expanded: true)).ToList();
    }

    private static OrganizationHierarchyPrimeModel BuildOfficePrimeNode(
        Office office,
        List<Office> allOffices,
        Dictionary<int, Office> byOrgHierarchyId,
        bool expanded)
    {
        var org = office.OrganizationHierarchy;
        var type = org?.Type ?? OrganizationUnitType.Office;

        List<Office> children;
        if (office.OrganizationHierarchyId.HasValue)
        {
            var oid = office.OrganizationHierarchyId.Value;
            children = allOffices
                .Where(o => o.ParentOrganizationHierarchyId == oid)
                .OrderBy(o => o.Name)
                .ToList();
        }
        else
        {
            children = new List<Office>();
        }

        int? parentOfficeId = null;
        if (office.ParentOrganizationHierarchyId.HasValue
            && byOrgHierarchyId.TryGetValue(office.ParentOrganizationHierarchyId.Value, out var parentOffice))
            parentOfficeId = parentOffice.Id;

        return new OrganizationHierarchyPrimeModel
        {
            Expanded = expanded,
            Type = "person",
            Data = new OrganizationHierarchyPrimeDataModel
            {
                Id = office.Id,
                Code = office.Code ?? "N/A",
                Name = office.Name ?? "Unnamed",
                Type = type,
                Description = office.ExternalName ?? office.InternalName ?? org?.Description ?? "No description available",
                ParentId = parentOfficeId
            },
            Children = children.Select(c => BuildOfficePrimeNode(c, allOffices, byOrgHierarchyId, expanded: false)).ToList()
        };
    }

    public IEnumerable<ProposedInitiativeType> GetProposedInitiativeTypes()
        => context.ProposedInitiativeTypes.Where(x => x.Status == EntityStatus.Active);

    public IEnumerable<Output> GetOutputs()
        => context.Outputs
            .Where(x => x.Status == EntityStatus.Active);

    /// <summary>
    /// Gets outputs by their IDs for semantic search results
    /// </summary>
    public IEnumerable<Output> GetOutputsByIds(IEnumerable<int> ids)
        => context.Outputs
            .Where(x => ids.Contains(x.Id) && x.Status == EntityStatus.Active);

    public IEnumerable<SDG> GetSDGs()
        => context.SDGs.Where(x => x.Status == EntityStatus.Active);

    public IEnumerable<SDGTarget> GetSDGTargets()
        => context.SDGTargets.Where(x => x.Status == EntityStatus.Active);

    public IEnumerable<SDGTarget> GetSDGTargetsBySDGId(string sdgId)
        => context.SDGTargets.Where(x => x.SDGId == sdgId && x.Status == EntityStatus.Active);

    public IEnumerable<SDGIndicator> GetSDGIndicators()
        => context.SDGIndicators.Where(x => x.Status == EntityStatus.Active);

    public IEnumerable<SDGIndicator> GetSDGIndicatorsByTargetId(string targetId)
        => context.SDGIndicators.Where(x => x.SDGTargetId == targetId && x.Status == EntityStatus.Active);

    public IEnumerable<UNCFOutcome> GetUNCFOutcomes(bool includeInactive = false)
    {
        // Join with UNCFMetadata to filter by active metadata status
        var query = from outcome in context.UNCFOutcomes
                    join metadata in context.UNCFMetadatas
                        on new { outcome.Country, outcome.UNCooperationFrameworkVersionNo }
                        equals new { metadata.Country, metadata.UNCooperationFrameworkVersionNo }
                    where (includeInactive || outcome.Status == EntityStatus.Active)
                        && (includeInactive || metadata.Status == EntityStatus.Active)
                    select outcome;
        
        // Return only latest version for each outcome-country combination
        return query
            .GroupBy(x => new { x.UNCFOutcomeId, x.Country })
            .Select(g => g.OrderByDescending(x => x.UNCooperationFrameworkVersionNo).First());
    }

    public IEnumerable<UNCFOutcome> GetUNCFOutcomesByCountry(string countryCode, bool includeInactive = false)
    {
        // Join with UNCFMetadata to filter by active metadata status
        var query = from outcome in context.UNCFOutcomes
                    join metadata in context.UNCFMetadatas
                        on new { outcome.Country, outcome.UNCooperationFrameworkVersionNo }
                        equals new { metadata.Country, metadata.UNCooperationFrameworkVersionNo }
                    where outcome.Country == countryCode
                        && (includeInactive || outcome.Status == EntityStatus.Active)
                        && (includeInactive || metadata.Status == EntityStatus.Active)
                    select outcome;
        
        // Return only latest version for each outcome-country combination
        return query
            .GroupBy(x => new { x.UNCFOutcomeId, x.Country })
            .Select(g => g.OrderByDescending(x => x.UNCooperationFrameworkVersionNo).First());
    }

    public IEnumerable<UNCFIndicator> GetUNCFIndicators(bool includeInactive = false)
    {
        // Join with UNCFMetadata to filter by active metadata status
        var query = from indicator in context.UNCFIndicators
                    join metadata in context.UNCFMetadatas
                        on new { indicator.Country, indicator.UNCooperationFrameworkVersionNo }
                        equals new { metadata.Country, metadata.UNCooperationFrameworkVersionNo }
                    where (includeInactive || indicator.Status == EntityStatus.Active)
                        && (includeInactive || metadata.Status == EntityStatus.Active)
                    select indicator;
        
        return query;
    }

    public IEnumerable<UNOPSMission> GetUNOPSMissions(bool includeInactive = false)
    {
        return context.Set<UNOPSMission>()
            .Where(m => includeInactive || m.Status == EntityStatus.Active)
            .OrderBy(m => m.DisplayOrder)
            .ToList();
    }

    public IEnumerable<UNCFIndicator> GetUNCFIndicatorsByOutcomeId(int outcomeId, bool includeInactive = false)
    {
        // Get the outcome first to determine its external ID and version
        var outcome = context.UNCFOutcomes.FirstOrDefault(x => x.Id == outcomeId);
        if (outcome == null) return Enumerable.Empty<UNCFIndicator>();
        
        // Join with UNCFMetadata to filter by active metadata status
        var query = from indicator in context.UNCFIndicators
                    join metadata in context.UNCFMetadatas
                        on new { indicator.Country, indicator.UNCooperationFrameworkVersionNo }
                        equals new { metadata.Country, metadata.UNCooperationFrameworkVersionNo }
                    where indicator.UNCFOutcomeExternalId == outcome.UNCFOutcomeId 
                        && indicator.UNCooperationFrameworkVersionNo == outcome.UNCooperationFrameworkVersionNo
                        && (includeInactive || indicator.Status == EntityStatus.Active)
                        && (includeInactive || metadata.Status == EntityStatus.Active)
                    select indicator;
        
        return query;
    }

    public async Task<IEnumerable<Models.Shared.SimpleValueModel>> GetEntityRolesAsync(string entityType)
    {
        return await context.EntityRoles
            .Where(x => x.EntityType == entityType && x.Status == EntityStatus.Active)
            .OrderBy(x => x.Name)
            .Select(x => new Models.Shared.SimpleValueModel
            {
                Id = x.Id,
                Name = x.Name,
                Code = x.Code,
                Description = x.Description,
                Type = x.Type,
                SubType = x.SubType
            })
            .ToListAsync();
    }

    public async Task<IEnumerable<Models.Shared.SimpleValueModel>> GetInternalUsersAsync()
    {
        return await context.PAOUsers
            .Include(x => x.UserProfile)
            .Where(x => x.ActiveUser && x.IsInternal)
            .OrderBy(x => x.Email)
            .Select(x => new Models.Shared.SimpleValueModel
            {
                Id = x.Id,
                Name = x.UserProfile != null ? x.UserProfile.Name : x.Email,
                Code = x.Email,
                Description = x.Email,
                Position = x.UserProfile != null ? x.UserProfile.Position : null
            })
            .ToListAsync();
    }

    /// <summary>
    /// Check if a UNCF Outcome has a newer active version available (checks UNCFMetadata for newer framework version)
    /// </summary>
    public bool HasNewerUNCFOutcomeVersion(string country, int currentVersionNo)
    {
        // Check UNCFMetadata table directly for a newer framework version for this country
        return context.UNCFMetadatas
            .Any(m => m.Country == country
                   && m.UNCooperationFrameworkVersionNo > currentVersionNo
                   && m.Status == EntityStatus.Active);
    }

    /// <summary>
    /// Check if a UNCF Indicator has a newer active version available (checks UNCFMetadata for newer framework version)
    /// </summary>
    public bool HasNewerUNCFIndicatorVersion(string country, int currentVersionNo)
    {
        // Check UNCFMetadata table directly for a newer framework version for this country
        return context.UNCFMetadatas
            .Any(m => m.Country == country
                   && m.UNCooperationFrameworkVersionNo > currentVersionNo
                   && m.Status == EntityStatus.Active);
    }

    /// <summary>
    /// Check if a UNCF Outcome is currently active (matching UNCFMetadata is active)
    /// </summary>
    public bool IsUNCFOutcomeActive(int uncfOutcomeId)
    {
        var outcome = context.UNCFOutcomes.FirstOrDefault(x => x.Id == uncfOutcomeId);
        if (outcome == null || outcome.Status != EntityStatus.Active) return false;
        
        // Check if the matching UNCFMetadata record is active
        var matchingMetadata = context.UNCFMetadatas.FirstOrDefault(m =>
            m.Country == outcome.Country &&
            m.UNCooperationFrameworkVersionNo == outcome.UNCooperationFrameworkVersionNo);
        
        // Outcome is active only if the metadata is active
        return matchingMetadata != null && matchingMetadata.Status == EntityStatus.Active;
    }

    /// <summary>
    /// Check if a UNCF Indicator is currently active (matching UNCFMetadata is active)
    /// </summary>
    public bool IsUNCFIndicatorActive(int uncfIndicatorId)
    {
        var indicator = context.UNCFIndicators.FirstOrDefault(x => x.Id == uncfIndicatorId);
        if (indicator == null || indicator.Status != EntityStatus.Active) return false;
        
        // Check if the matching UNCFMetadata record is active
        var matchingMetadata = context.UNCFMetadatas.FirstOrDefault(m =>
            m.Country == indicator.Country &&
            m.UNCooperationFrameworkVersionNo == indicator.UNCooperationFrameworkVersionNo);
        
        // Indicator is active only if the metadata is active
        return matchingMetadata != null && matchingMetadata.Status == EntityStatus.Active;
    }

    /// <summary>
    /// Gets suggested organization units based on the countries of implementation.
    /// Returns the org units that are directly responsible for the countries,
    /// and if there are multiple countries with different org units, returns the common parent org unit.
    /// </summary>
    public async Task<Models.OrganizationUnits.SuggestedOrgUnitsResponse> GetSuggestedOrgUnitsForCountriesAsync(int[] countryIds)
    {
        if (countryIds == null || countryIds.Length == 0)
        {
            return new Models.OrganizationUnits.SuggestedOrgUnitsResponse
            {
                SuggestedOrgUnitIds = new List<int>(),
                PrimarySuggestionId = null,
                SuggestionReason = null
            };
        }

        // Get org unit relationships for all the countries
        var orgUnitRelationships = await context.OrganizationUnitRelationships
            .Include(r => r.OrganizationHierarchy)
            .Where(r => r.EntityType == "Country" && countryIds.Contains(r.EntityId) && !r.IsDeleted)
            .ToListAsync();

        if (!orgUnitRelationships.Any())
        {
            return new Models.OrganizationUnits.SuggestedOrgUnitsResponse
            {
                SuggestedOrgUnitIds = new List<int>(),
                PrimarySuggestionId = null,
                SuggestionReason = null
            };
        }

        // Get distinct org unit IDs responsible for these countries
        var distinctOrgUnitIds = orgUnitRelationships
            .Where(r => r.OrganizationHierarchy != null)
            .Select(r => r.OrganizationHierarchyId)
            .Distinct()
            .ToList();

        var suggestedIds = new List<int>(distinctOrgUnitIds);
        int? primarySuggestionId = null;
        string? suggestionReason = null;

        if (distinctOrgUnitIds.Count == 1)
        {
            // Single org unit is responsible for all countries
            primarySuggestionId = distinctOrgUnitIds.First();
            suggestionReason = "responsible_for_all_countries";
        }
        else if (distinctOrgUnitIds.Count > 1)
        {
            // Multiple org units - find the common parent
            var commonParentId = await FindCommonParentOrgUnitAsync(distinctOrgUnitIds);
            if (commonParentId.HasValue)
            {
                // Add common parent to suggestions and make it primary
                if (!suggestedIds.Contains(commonParentId.Value))
                {
                    suggestedIds.Insert(0, commonParentId.Value);
                }
                primarySuggestionId = commonParentId.Value;
                suggestionReason = "common_parent_for_multiple_countries";
            }
            else
            {
                // No common parent found, use the first org unit
                primarySuggestionId = distinctOrgUnitIds.First();
                suggestionReason = "multiple_responsible_units";
            }
        }

        // Map OrganizationHierarchy ids → Office ids (operational hierarchy) for API/UI
        var hierarchyIdsForMap = suggestedIds
            .Concat(primarySuggestionId.HasValue ? new[] { primarySuggestionId.Value } : Array.Empty<int>())
            .Distinct()
            .ToList();

        var officeByHierarchy = await context.Set<Office>()
            .AsNoTracking()
            .Where(o => !o.IsDeleted && o.Status == EntityStatus.Active
                && o.OrganizationHierarchyId != null
                && hierarchyIdsForMap.Contains(o.OrganizationHierarchyId.Value))
            .Select(o => new { o.Id, o.OrganizationHierarchyId })
            .ToListAsync();

        var firstOfficeByHierarchy = officeByHierarchy
            .GroupBy(x => x.OrganizationHierarchyId!.Value)
            .ToDictionary(g => g.Key, g => g.OrderBy(x => x.Id).First().Id);

        static List<int> MapHierarchyIdsToOfficeIds(
            List<int> hierarchyIds,
            Dictionary<int, int> map)
        {
            var result = new List<int>();
            foreach (var hid in hierarchyIds)
            {
                if (map.TryGetValue(hid, out var officeId))
                    result.Add(officeId);
            }
            return result;
        }

        var mappedSuggested = MapHierarchyIdsToOfficeIds(suggestedIds, firstOfficeByHierarchy);
        int? mappedPrimary = primarySuggestionId.HasValue && firstOfficeByHierarchy.TryGetValue(primarySuggestionId.Value, out var p)
            ? p
            : null;

        return new Models.OrganizationUnits.SuggestedOrgUnitsResponse
        {
            SuggestedOrgUnitIds = mappedSuggested,
            PrimarySuggestionId = mappedPrimary,
            SuggestionReason = suggestionReason
        };
    }

    /// <summary>
    /// Finds the lowest common ancestor (parent) org unit for a set of org unit IDs
    /// </summary>
    private async Task<int?> FindCommonParentOrgUnitAsync(List<int> orgUnitIds)
    {
        if (orgUnitIds == null || orgUnitIds.Count == 0)
            return null;

        if (orgUnitIds.Count == 1)
            return orgUnitIds.First();

        // Build hierarchy chains for each org unit (from child to root)
        var hierarchyChains = new List<List<int>>();
        
        foreach (var orgUnitId in orgUnitIds)
        {
            var chain = await BuildHierarchyChainAsync(orgUnitId);
            if (chain.Any())
            {
                hierarchyChains.Add(chain);
            }
        }

        if (hierarchyChains.Count < 2)
            return orgUnitIds.First();

        // Find the first common ancestor by comparing chains from root to leaf
        // Reverse chains so we start from root
        foreach (var chain in hierarchyChains)
        {
            chain.Reverse();
        }

        int? commonParent = null;
        var minLength = hierarchyChains.Min(c => c.Count);
        
        for (int i = 0; i < minLength; i++)
        {
            var currentLevelId = hierarchyChains[0][i];
            if (hierarchyChains.All(c => c[i] == currentLevelId))
            {
                commonParent = currentLevelId;
            }
            else
            {
                break;
            }
        }

        return commonParent;
    }

    /// <summary>
    /// Builds the hierarchy chain from a given org unit to the root
    /// </summary>
    private async Task<List<int>> BuildHierarchyChainAsync(int orgUnitId)
    {
        var chain = new List<int>();
        int? currentId = orgUnitId;

        while (currentId.HasValue)
        {
            chain.Add(currentId.Value);
            var orgUnit = await context.OrganizationHierarchies
                .Where(oh => oh.Id == currentId.Value && !oh.IsDeleted)
                .Select(oh => new { oh.Id, oh.ParentId })
                .FirstOrDefaultAsync();

            if (orgUnit == null)
                break;

            currentId = orgUnit.ParentId;
        }

        return chain;
    }

    /// <summary>
    /// Gets EntityUserRoles for multiple OrganizationHierarchies, grouped by EntityRole.
    /// Used to auto-populate internal stakeholders when selecting OrgUnits.
    /// </summary>
    /// <param name="forOpportunityTeamOnly">
    /// When true, returns only director roles (same as Opportunity stakeholder auto-population — no DoA roles).
    /// </param>
    public async Task<List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse>> GetEntityUserRolesByOrgUnitsAsync(int[] organizationHierarchyIds, bool forOpportunityTeamOnly = false)
    {
        return await GetEntityUserRolesByOrgUnitsWithRowFilterAsync(
            organizationHierarchyIds,
            forOpportunityTeamOnly
                ? (eur, role) => OpportunityTeamAutoPopulateRoleFilter.IsDirectorStakeholderEntityUserRole(eur, role)
                : null,
            suppressUnassignedDoATypes: forOpportunityTeamOnly);
    }

    /// <summary>
    /// DoA2/DoA3 Engagement Acceptance holders for "Opportunity Decision Making Pathway" (not persisted as OpportunityStakeholder).
    /// </summary>
    public async Task<List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse>> GetOpportunityDecisionMakingPathwayEntityUserRolesByOrgUnitsAsync(int[] organizationHierarchyIds)
    {
        return await GetEntityUserRolesByOrgUnitsWithRowFilterAsync(
            organizationHierarchyIds,
            (eur, role) => OpportunityTeamAutoPopulateRoleFilter.IsDecisionMakingPathwayEngagementAcceptanceDoA(eur, role),
            suppressUnassignedDoATypes: true);
    }

    private async Task<List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse>> GetEntityUserRolesByOrgUnitsWithRowFilterAsync(
        int[] organizationHierarchyIds,
        Func<EntityUserRole, EntityRole?, bool>? rowFilter,
        bool suppressUnassignedDoATypes)
    {
        if (organizationHierarchyIds == null || organizationHierarchyIds.Length == 0)
            return new List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse>();

        // Get all org units in a single query
        var orgUnits = await context.OrganizationHierarchies
            .Where(oh => organizationHierarchyIds.Contains(oh.Id) && !oh.IsDeleted)
            .Select(oh => new { oh.Id, oh.Name, oh.Type })
            .ToListAsync();

        if (!orgUnits.Any())
            return new List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse>();

        // Get all EntityUserRoles for these OrganizationHierarchies in a single query
        var entityUserRoles = await context.EntityUserRoles
            .Include(eur => eur.EntityRole)
            .Include(eur => eur.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(eur => eur.EntityType == "OrganizationHierarchy" 
                       && organizationHierarchyIds.Contains(eur.EntityId)
                       && eur.EntityRoleId.HasValue
                       && !eur.IsDeleted)
            .ToListAsync();

        if (rowFilter != null)
        {
            entityUserRoles = entityUserRoles
                .Where(eur => rowFilter(eur, eur.EntityRole))
                .ToList();
        }

        // DoA type: derive from role code suffix (e.g. DoA1_HR -> HR -> Human Resources)
        // Must match EntityRoleSeeder + EDS 10-entity-user-roles-doa config
        var codeSuffixToDisplayName = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            ["HR"] = "Human Resources",
            ["Finance"] = "Finance",
            ["Procurement"] = "Procurement",
            ["Procurement_ICA"] = "Procurement ICA",
            ["OrganizationHierarchy"] = "Engagement Acceptance"
        };
        var allDoATypes = codeSuffixToDisplayName.Values.Distinct().ToList();

        // Build response for each org unit
        var results = new List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse>();
        
        foreach (var orgUnit in orgUnits)
        {
            var orgUnitRoles = entityUserRoles.Where(eur => eur.EntityId == orgUnit.Id).ToList();

            // Group by EntityRole for this specific org unit
            var roleGroups = orgUnitRoles
                .GroupBy(eur => new { eur.EntityRoleId, RoleName = eur.EntityRole?.Name, RoleCode = eur.EntityRole?.Code })
                .Select(g => new Models.OrganizationUnits.EntityUserRoleGroupModel
                {
                    EntityRoleId = g.Key.EntityRoleId ?? 0,
                    EntityRoleName = g.Key.RoleName,
                    EntityRoleCode = g.Key.RoleCode,
                    Users = g.Select(eur => new Models.OrganizationUnits.UserBasicModel
                    {
                        UserId = eur.UserId,
                        Name = eur.User?.UserProfile?.Name ?? eur.User?.Email,
                        Email = eur.User?.Email,
                        Position = eur.PositionTitle ?? eur.User?.UserProfile?.Position,
                        OrgUnitWorksAt = eur.OrgUnitWorksAt,
                        ApplicabilityPeriodStart = eur.ApplicabilityPeriodStart,
                        ApplicabilityPeriodEnd = eur.ApplicabilityPeriodEnd,
                        Conditions = eur.Conditions,
                        DoAType = eur.DoAType,
                        OfficerInChargeResourceId = eur.OfficerInChargeResourceId
                    }).ToList()
                })
                .ToList();

            List<string> unassignedDoATypes;
            if (suppressUnassignedDoATypes)
            {
                unassignedDoATypes = new List<string>();
            }
            else
            {
                var assignedTypes = orgUnitRoles
                    .Select(eur => eur.EntityRole?.Code)
                    .Where(c => !string.IsNullOrEmpty(c))
                    .Select(code =>
                    {
                        var idx = code!.IndexOf('_');
                        if (idx < 0) return null;
                        var suffix = code[(idx + 1)..];
                        return codeSuffixToDisplayName.TryGetValue(suffix, out var displayName) ? displayName : null;
                    })
                    .Where(t => t != null)
                    .ToHashSet(StringComparer.OrdinalIgnoreCase);
                unassignedDoATypes = allDoATypes.Where(t => !assignedTypes.Contains(t)).ToList();
            }

            results.Add(new Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse
            {
                OrganizationHierarchyId = orgUnit.Id,
                OrganizationHierarchyName = orgUnit.Name,
                OrganizationHierarchyType = orgUnit.Type.ToString(),
                RoleGroups = roleGroups,
                UnassignedDoATypes = unassignedDoATypes
            });
        }

        await PopulateOfficerInChargeDisplayNamesAsync(results);

        return results;
    }

    /// <summary>
    /// Resolves <see cref="UserBasicModel.OfficerInChargeDisplayName"/> from internal user ids (same as office DoA OiC).
    /// </summary>
    private async Task PopulateOfficerInChargeDisplayNamesAsync(
        List<Models.OrganizationUnits.EntityUserRolesByOrgUnitResponse> results)
    {
        var oicIds = results
            .SelectMany(r => r.RoleGroups.SelectMany(g => g.Users))
            .Select(u => u.OfficerInChargeResourceId)
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => int.TryParse(s!.Trim(), out var id) ? id : (int?)null)
            .Where(id => id.HasValue && id.Value > 0)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        if (oicIds.Count == 0)
            return;

        var users = await context.PAOUsers
            .AsNoTracking()
            .Include(u => u.UserProfile)
            .Where(u => oicIds.Contains(u.Id))
            .ToListAsync();

        var idToDisplay = users.ToDictionary(
            u => u.Id,
            u => !string.IsNullOrWhiteSpace(u.Name) ? u.Name : u.Email ?? string.Empty);

        foreach (var response in results)
        {
            foreach (var group in response.RoleGroups)
            {
                foreach (var user in group.Users)
                {
                    if (string.IsNullOrWhiteSpace(user.OfficerInChargeResourceId))
                        continue;
                    if (!int.TryParse(user.OfficerInChargeResourceId.Trim(), out var oid) || oid <= 0)
                        continue;
                    if (idToDisplay.TryGetValue(oid, out var display) && !string.IsNullOrEmpty(display))
                        user.OfficerInChargeDisplayName = display;
                }
            }
        }
    }

    /// <summary>
    /// Gets org unit IDs for the given country IDs, including their parent and grandparent org units.
    /// Used when a GPO is selected as the responsible org unit to auto-populate stakeholders
    /// from the normally responsible org units for each implementation country.
    /// </summary>
    public async Task<List<int>> GetOrgUnitIdsForCountriesWithHierarchyAsync(int[] countryIds)
    {
        if (countryIds == null || countryIds.Length == 0)
            return new List<int>();

        // Get org unit relationships for these countries
        var orgUnitRelationships = await context.OrganizationUnitRelationships
            .Where(r => 
                r.EntityType == "Country" 
                && countryIds.Contains(r.EntityId)
                && !r.IsDeleted)
            .Select(r => r.OrganizationHierarchyId)
            .Distinct()
            .ToListAsync();

        if (!orgUnitRelationships.Any())
            return new List<int>();

        // For each org unit, get itself plus parent and grandparent
        var allOrgUnitIds = new HashSet<int>();

        foreach (var orgUnitId in orgUnitRelationships)
        {
            // Get the org unit and its ancestors (up to 2 levels)
            var currentId = orgUnitId;
            var levelsToGet = 3; // Current + parent + grandparent

            for (int i = 0; i < levelsToGet && currentId != 0; i++)
            {
                var orgUnit = await context.OrganizationHierarchies
                    .Where(oh => oh.Id == currentId && !oh.IsDeleted)
                    .Select(oh => new { oh.Id, oh.ParentId, oh.Type })
                    .FirstOrDefaultAsync();

                if (orgUnit == null)
                    break;

                // Only add OrgUnit type (not Hub, Region, GPO)
                if (orgUnit.Type.ToString() == "OrgUnit")
                {
                    allOrgUnitIds.Add(orgUnit.Id);
                }

                currentId = orgUnit.ParentId ?? 0;
            }
        }

        return allOrgUnitIds.ToList();
    }

    /// <summary>
    /// Gets child org unit IDs under a Hub/Region that directly relate to at least one of the given country IDs.
    /// Used when a Hub or Region is selected as the responsible org unit to auto-populate stakeholders
    /// from the child org units that are responsible for the implementation countries.
    /// </summary>
    public async Task<List<int>> GetChildOrgUnitIdsForHubRegionAsync(int parentOrgUnitId, int[] countryIds)
    {
        if (countryIds == null || countryIds.Length == 0)
            return new List<int>();

        // Get org unit IDs that are directly responsible for these countries
        var countryOrgUnitIds = await context.OrganizationUnitRelationships
            .Where(r => 
                r.EntityType == "Country" 
                && countryIds.Contains(r.EntityId)
                && !r.IsDeleted)
            .Select(r => r.OrganizationHierarchyId)
            .Distinct()
            .ToListAsync();

        if (!countryOrgUnitIds.Any())
            return new List<int>();

        // Get all descendants of the parent Hub/Region
        var descendantIds = await GetAllDescendantOrgUnitIdsAsync(parentOrgUnitId);

        // Filter to only include descendants that directly relate to the countries
        var relevantOrgUnitIds = countryOrgUnitIds
            .Where(id => descendantIds.Contains(id))
            .ToList();

        return relevantOrgUnitIds;
    }

    /// <summary>
    /// Gets all descendant org unit IDs under a given parent org unit (recursive).
    /// </summary>
    private async Task<HashSet<int>> GetAllDescendantOrgUnitIdsAsync(int parentOrgUnitId)
    {
        var descendants = new HashSet<int>();
        var toProcess = new Queue<int>();
        toProcess.Enqueue(parentOrgUnitId);

        while (toProcess.Count > 0)
        {
            var currentParentId = toProcess.Dequeue();

            var children = await context.OrganizationHierarchies
                .Where(oh => oh.ParentId == currentParentId && !oh.IsDeleted)
                .Select(oh => oh.Id)
                .ToListAsync();

            foreach (var childId in children)
            {
                if (descendants.Add(childId))
                {
                    toProcess.Enqueue(childId);
                }
            }
        }

        return descendants;
    }
}