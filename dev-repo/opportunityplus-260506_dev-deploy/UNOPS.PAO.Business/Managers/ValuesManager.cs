namespace UNOPS.PAO.Business.Managers;

using System.Threading;
using AutoMapper;
using UNOPS.PAO.Business.Repositories;
using UNOPS.PAO.Business.Utilities;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Utilities.Interfaces;
using UNOPS.PAO.UNOPSDomain.Entities;
using UNOPS.PAO.Models.Users;
using UNOPS.PAO.Models.LiaisonOffices;
using UNOPS.PAO.Models.OrganizationUnits;
using UNOPS.PAO.Models.Partners;
using UNOPS.PAO.Models.Locations;
using UNOPS.PAO.Models.Shared;
using UNOPS.PAO.Models.Contacts;
using UNOPS.PAO.Models.Values;
using UNOPS.PAO.Models.SDG;
using UNOPS.PAO.Models.UNCF;
using UNOPS.PAO.Models;

public class ValuesManager : IApplicationService
{
    private IMapper mapper;

    ValuesRepository repository;

    public ValuesManager(IMapper mapper, AppDbContext context)
    {
        this.mapper = mapper;
        repository = new ValuesRepository(context);
    }

    public IEnumerable<CurrencyModel> GetCurrencies() => repository.GetCurrencies().Select(mapper.Map<CurrencyModel>);

    public IEnumerable<EligibleEntityModel> GetEligibleEntities() => repository.GetEligibleEntities().Select(mapper.Map<EligibleEntityModel>);
    public IEnumerable<SimpleValueModel> GetCountries() => repository.GetCountries();

    public IQueryable<PartnerValueModel> GetPartners()
         => (IQueryable<PartnerValueModel>)repository.GetPartners().Select(mapper.Map<PartnerValueModel>);

    public IQueryable<Partner> GetPartnersForFiltering()
         => repository.GetPartners();

    /// <summary>Active P3M offices for Partner, Contact, Interaction org-unit dropdowns (<see cref="OrganizationHierarchyModel.Id"/> is Office id).</summary>
    public IEnumerable<OrganizationHierarchyModel> GetOrganizationUnits()
        => repository.GetOpportunityOrganizationUnits();

    /// <summary>
    /// Gets P3M offices for Opportunity responsible-org dropdown (Ids are <see cref="UNOPS.PAO.Domain.Entities.Office.Id"/>).
    /// </summary>
    public IEnumerable<OrganizationHierarchyModel> GetOpportunityOrganizationUnits()
        => repository.GetOpportunityOrganizationUnits();

    public IEnumerable<ContactValueModel> GetContacts()
         => repository.GetContacts().Select(mapper.Map<ContactValueModel>);

    public IEnumerable<UserValueModel> GetUsers()
         => repository.GetUsers().Select(mapper.Map<UserValueModel>);

    // Optimized paginated user retrieval
    public async Task<PaginationResponse<UserValueModel>> GetUsersPagedAsync(UsersPagedRequest request)
    {
        var (users, totalCount) = await repository.GetUsersPagedAsync(
            request.PageIndex,
            request.PageSize,
            request.SearchTerm,
            request.ActiveOnly,
            request.SelectedUserIds
        );

        var userModels = users.Select(mapper.Map<UserValueModel>).ToList();
        await EnrichUserOrgUnitWorksAtDisplayAsync(userModels, CancellationToken.None);

        return new PaginationResponse<UserValueModel>
        {
            Records = userModels,
            TotalCount = totalCount,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };
    }

    // Quick user search for autocomplete
    public async Task<IEnumerable<UserValueModel>> SearchUsersAsync(string? searchTerm, int maxResults = 20, int[]? selectedUserIds = null)
    {
        var users = await repository.SearchUsersAsync(searchTerm, maxResults, selectedUserIds);
        var userModels = users.Select(mapper.Map<UserValueModel>).ToList();
        await EnrichUserOrgUnitWorksAtDisplayAsync(userModels, CancellationToken.None);
        return userModels;
    }

    private async Task EnrichUserOrgUnitWorksAtDisplayAsync(
        IList<UserValueModel> models,
        CancellationToken cancellationToken)
    {
        if (models.Count == 0)
            return;

        var primaries = models
            .Select(m => OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(m.UserProfile?.OrgUnit))
            .Where(c => c != null)
            .Cast<string>()
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();
        if (primaries.Count == 0)
            return;

        var lookup = await repository.GetOrganizationHierarchiesByPrimaryCodesAsync(primaries, cancellationToken);

        foreach (var m in models)
        {
            if (m.UserProfile == null)
                continue;

            var primary = OrgUnitWorksAtDisplayFormatter.GetPrimaryOrgUnitCode(m.UserProfile.OrgUnit);
            OrganizationHierarchy? oh = null;
            if (primary != null)
            {
                lookup.TryGetValue(primary, out oh);
                oh ??= lookup.Values.FirstOrDefault(v =>
                    string.Equals(v.Code, primary, StringComparison.OrdinalIgnoreCase));
            }

            m.UserProfile.OrgUnitWorksAtDisplay =
                OrgUnitWorksAtDisplayFormatter.ResolveDisplay(m.UserProfile.OrgUnit, oh);
        }
    }

    public IEnumerable<LiaisonOfficeModel> GetLiaisonOffices()
         => repository.GetLiaisonOffices().Select(mapper.Map<LiaisonOfficeModel>);

    public IEnumerable<SimpleValueModel> GetProposedInitiativeTypes()
         => repository.GetProposedInitiativeTypes().Select(mapper.Map<SimpleValueModel>);

    public IEnumerable<OutputModel> GetOutputs()
         => repository.GetOutputs().Select(mapper.Map<OutputModel>);

    /// <summary>
    /// Gets outputs by their IDs for semantic search results
    /// </summary>
    public IEnumerable<OutputModel> GetOutputsByIds(IEnumerable<int> ids)
         => repository.GetOutputsByIds(ids).Select(mapper.Map<OutputModel>);

    public IEnumerable<SDGModel> GetSDGs()
         => repository.GetSDGs().Select(mapper.Map<SDGModel>);

    public IEnumerable<SDGTargetModel> GetSDGTargets()
         => repository.GetSDGTargets().Select(mapper.Map<SDGTargetModel>);

    public IEnumerable<SDGTargetModel> GetSDGTargetsBySDGId(string sdgId)
         => repository.GetSDGTargetsBySDGId(sdgId).Select(mapper.Map<SDGTargetModel>);

    public IEnumerable<SDGIndicatorModel> GetSDGIndicators()
         => repository.GetSDGIndicators().Select(mapper.Map<SDGIndicatorModel>);

    public IEnumerable<SDGIndicatorModel> GetSDGIndicatorsByTargetId(string targetId)
         => repository.GetSDGIndicatorsByTargetId(targetId).Select(mapper.Map<SDGIndicatorModel>);

    public IEnumerable<UNCFOutcomeModel> GetUNCFOutcomes()
         => repository.GetUNCFOutcomes().Select(mapper.Map<UNCFOutcomeModel>);

    public IEnumerable<UNCFOutcomeModel> GetUNCFOutcomesByCountry(string countryCode)
         => repository.GetUNCFOutcomesByCountry(countryCode).Select(mapper.Map<UNCFOutcomeModel>);

    public IEnumerable<UNCFIndicatorModel> GetUNCFIndicators()
         => repository.GetUNCFIndicators().Select(mapper.Map<UNCFIndicatorModel>);

    public IEnumerable<UNCFIndicatorModel> GetUNCFIndicatorsByOutcomeId(int outcomeId)
         => repository.GetUNCFIndicatorsByOutcomeId(outcomeId).Select(mapper.Map<UNCFIndicatorModel>);

    public IEnumerable<UNOPSMissionModel> GetUNOPSMissions(bool includeInactive = false)
         => repository.GetUNOPSMissions(includeInactive).Select(mapper.Map<UNOPSMissionModel>);

    public async Task<IEnumerable<SimpleValueModel>> GetEntityRolesAsync(string entityType)
         => await repository.GetEntityRolesAsync(entityType);

    public async Task<IEnumerable<SimpleValueModel>> GetInternalUsersAsync()
         => await repository.GetInternalUsersAsync();

    public async Task<SuggestedOrgUnitsResponse> GetSuggestedOrgUnitsForCountriesAsync(int[] countryIds)
         => await repository.GetSuggestedOrgUnitsForCountriesAsync(countryIds);

    public async Task<List<EntityUserRolesByOrgUnitResponse>> GetEntityUserRolesByOrgUnitsAsync(int[] organizationHierarchyIds)
    {
        var resolved = await repository.ResolveResponsibleOrgKeysToOrganizationHierarchyIdsAsync(organizationHierarchyIds);
        return await repository.GetEntityUserRolesByOrgUnitsAsync(resolved);
    }

    /// <summary>
    /// Entity user roles for Opportunity Team auto-populated block: director roles only (no DoA).
    /// </summary>
    public async Task<List<EntityUserRolesByOrgUnitResponse>> GetOpportunityTeamEntityUserRolesByOrgUnitsAsync(int[] organizationHierarchyIds)
    {
        var resolved = await repository.ResolveResponsibleOrgKeysToOrganizationHierarchyIdsAsync(organizationHierarchyIds);
        return await repository.GetEntityUserRolesByOrgUnitsAsync(resolved, forOpportunityTeamOnly: true);
    }

    /// <summary>
    /// Engagement Acceptance DoA2/DoA3 holders for Opportunity Decision Making Pathway (not persisted as stakeholders).
    /// </summary>
    public async Task<List<EntityUserRolesByOrgUnitResponse>> GetOpportunityDecisionMakingPathwayEntityUserRolesByOrgUnitsAsync(int[] organizationHierarchyIds)
    {
        var resolved = await repository.ResolveResponsibleOrgKeysToOrganizationHierarchyIdsAsync(organizationHierarchyIds);
        return await repository.GetOpportunityDecisionMakingPathwayEntityUserRolesByOrgUnitsAsync(resolved);
    }

    public async Task<List<int>> GetOrgUnitIdsForCountriesWithHierarchyAsync(int[] countryIds)
         => await repository.GetOrgUnitIdsForCountriesWithHierarchyAsync(countryIds);

    public async Task<List<int>> GetChildOrgUnitIdsForHubRegionAsync(int parentOrgUnitId, int[] countryIds)
         => await repository.GetChildOrgUnitIdsForHubRegionAsync(parentOrgUnitId, countryIds);
}