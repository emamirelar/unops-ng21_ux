using System.Linq.Expressions;
using System.Security.Claims;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSDataAccess.Context;
using UNOPS.PAO.Business.Services;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.UNOPSDomain.Entities;

namespace UNOPS.PAO.UNOPSBusiness.Services;

/// <summary>
/// Centralized service for applying global filters across all queries
/// This ensures consistent global filter behavior across BaseRepository, AdvancedSearchService, and other services
/// </summary>
public class GlobalFilterService
{
    private readonly IUserPreferenceService _userPreferenceService;
    private readonly ILogger<GlobalFilterService> _logger;
    private readonly UNOPSAppDbContext _context;
    private readonly IOfficeService _officeService;

    public GlobalFilterService(
        IUserPreferenceService userPreferenceService,
        ILogger<GlobalFilterService> logger,
        UNOPSAppDbContext context,
        IOfficeService officeService)
    {
        _userPreferenceService = userPreferenceService;
        _logger = logger;
        _context = context;
        _officeService = officeService;
    }

    /// <summary>
    /// Apply all global filters to a queryable based on user preferences
    /// </summary>
    /// <typeparam name="TEntity">Entity type</typeparam>
    /// <param name="query">Query to filter</param>
    /// <param name="user">Current user for preferences</param>
    /// <returns>Filtered query</returns>
    public async Task<IQueryable<TEntity>> ApplyGlobalFiltersAsync<TEntity>(IQueryable<TEntity> query, ClaimsPrincipal user) 
        where TEntity : class
    {
        if (user?.Identity?.IsAuthenticated != true)
            return query;

        var currentUserId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(currentUserId))
            return query;

        try
        {
            // Get global filters from user preferences
            var globalFilters = await _userPreferenceService.GetGlobalFiltersAsync(currentUserId);
            if (globalFilters == null)
                return query;

            var entityType = typeof(TEntity);
            var parameter = Expression.Parameter(entityType, "x");
            Expression? combinedExpression = null;

            // Apply organization unit filter
            if (globalFilters.OrgUnitId.HasValue)
            {
                combinedExpression = await ApplyOrgUnitFilterAsync(parameter, entityType, globalFilters.OrgUnitId.Value, combinedExpression);
            }

            // Apply "Related to Me" filter
            if (globalFilters.RelatedToMe && int.TryParse(currentUserId, out var userIdInt))
            {
                combinedExpression = ApplyRelatedToMeFilter(parameter, entityType, userIdInt, combinedExpression);
            }

            // Apply date filters
            combinedExpression = ApplyDateFilters(parameter, entityType, globalFilters, combinedExpression);

            // Apply the combined filter expression if any filters were applied
            if (combinedExpression != null)
            {
                var lambda = Expression.Lambda<Func<TEntity, bool>>(combinedExpression, parameter);
                query = query.Where(lambda);
                _logger.LogDebug("Applied global filters for user {UserId}", currentUserId);
            }

            return query;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to apply global filters for user {UserId}, continuing without filters", currentUserId);
            return query;
        }
    }

    #region Filter Implementation Methods

    /// <summary>
    /// Apply RelatedToMe filter - checks both CreatedBy and LastModifiedBy, plus entity-specific relationships
    /// For Opportunities: Also checks if user is a stakeholder
    /// </summary>
    private Expression? ApplyRelatedToMeFilter(ParameterExpression parameter, Type entityType, int userId, Expression? existingExpression)
    {
        var createdByProperty = entityType.GetProperty("CreatedBy");
        var lastModifiedByProperty = entityType.GetProperty("LastModifiedBy");
        
        Expression? userExpression = null;
        
        // Check CreatedBy
        if (createdByProperty != null && (createdByProperty.PropertyType == typeof(int) || createdByProperty.PropertyType == typeof(int?)))
        {
            var createdByAccess = Expression.Property(parameter, createdByProperty);
            var createdByConstant = Expression.Constant(userId, createdByProperty.PropertyType);
            var createdByEquals = Expression.Equal(createdByAccess, createdByConstant);
            userExpression = createdByEquals;
        }
        
        // Check LastModifiedBy
        if (lastModifiedByProperty != null && (lastModifiedByProperty.PropertyType == typeof(int) || lastModifiedByProperty.PropertyType == typeof(int?)))
        {
            var lastModifiedByAccess = Expression.Property(parameter, lastModifiedByProperty);
            var lastModifiedByConstant = Expression.Constant(userId, lastModifiedByProperty.PropertyType);
            var lastModifiedByEquals = Expression.Equal(lastModifiedByAccess, lastModifiedByConstant);
            
            if (userExpression != null)
            {
                // Combine with OR: (CreatedBy == userId) OR (LastModifiedBy == userId)
                userExpression = Expression.OrElse(userExpression, lastModifiedByEquals);
            }
            else
            {
                userExpression = lastModifiedByEquals;
            }
        }

        // For Opportunity entity, also check if user is a stakeholder
        if (entityType.Name == "Opportunity")
        {
            try
            {
                // Get opportunity IDs where user is a stakeholder
                var opportunityIdsWithUser = _context.Set<OpportunityStakeholder>()
                    .Where(s => s.UserId == userId)
                    .Select(s => s.OpportunityId)
                    .ToList();

                if (opportunityIdsWithUser.Any())
                {
                    var idProperty = GetIdProperty(entityType);
                    if (idProperty != null)
                    {
                        var idAccess = Expression.Property(parameter, idProperty);
                        var idsConstant = Expression.Constant(opportunityIdsWithUser);
                        var containsMethod = typeof(List<int>).GetMethod("Contains");
                        var stakeholderCheck = Expression.Call(idsConstant, containsMethod, idAccess);
                        
                        if (userExpression != null)
                        {
                            // Combine with OR: (CreatedBy/LastModifiedBy check) OR (Is Stakeholder)
                            userExpression = Expression.OrElse(userExpression, stakeholderCheck);
                        }
                        else
                        {
                            userExpression = stakeholderCheck;
                        }
                        
                        _logger.LogDebug("Applied stakeholder filter for Opportunity - found {Count} opportunities", opportunityIdsWithUser.Count);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to apply stakeholder filter for Opportunity entity");
                // Continue with just CreatedBy/LastModifiedBy filtering
            }
        }
        
        // Combine with existing expression using AND
        if (userExpression != null && existingExpression != null)
        {
            return Expression.AndAlso(existingExpression, userExpression);
        }
        
        return userExpression ?? existingExpression;
    }

    /// <summary>
    /// Apply date filters (DateOn, DateFrom, DateTo) to CreatedDate and LastModifiedDate
    /// </summary>
    private Expression? ApplyDateFilters(ParameterExpression parameter, Type entityType, dynamic globalFilters, Expression? existingExpression)
    {
        try
        {
            Expression? dateExpression = null;

            // Check if DateOn is set (single date mode)
            if (HasProperty(globalFilters, "DateOn") && globalFilters.DateOn != null)
            {
                var dateOn = (DateTime)globalFilters.DateOn;
                var startOfDay = dateOn.Date;
                var endOfDay = startOfDay.AddDays(1);

                dateExpression = CreateDateRangeExpression(parameter, entityType, startOfDay, endOfDay);
                _logger.LogDebug("Applied DateOn filter: {Date}", dateOn.ToString("yyyy-MM-dd"));
            }
            // Otherwise check DateFrom/DateTo range mode
            else
            {
                DateTime? dateFrom = HasProperty(globalFilters, "DateFrom") ? globalFilters.DateFrom : null;
                DateTime? dateTo = HasProperty(globalFilters, "DateTo") ? globalFilters.DateTo : null;

                if (dateFrom.HasValue || dateTo.HasValue)
                {
                    var fromDate = dateFrom?.Date;
                    var toDate = dateTo?.Date.AddDays(1); // Include entire day

                    dateExpression = CreateDateRangeExpression(parameter, entityType, fromDate, toDate);
                    _logger.LogDebug("Applied DateFrom/DateTo filter: {From} - {To}", 
                        fromDate?.ToString("yyyy-MM-dd") ?? "no limit", 
                        dateTo?.ToString("yyyy-MM-dd") ?? "no limit");
                }
            }

            // Combine with existing expression using AND
            if (dateExpression != null && existingExpression != null)
            {
                return Expression.AndAlso(existingExpression, dateExpression);
            }

            return dateExpression ?? existingExpression;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Error applying date filters, skipping date filtering");
            return existingExpression;
        }
    }

    /// <summary>
    /// Apply OrgUnit filter with smart entity-specific logic using comprehensive relationship-based filtering
    /// 1. Partner: Direct relationships + through contacts + through interactions
    /// 2. Contact: Direct relationships + through partners + through interactions
    /// 3. Interaction: Direct relationships + through contacts + through partners
    /// </summary>
    private async Task<Expression?> ApplyOrgUnitFilterAsync(ParameterExpression parameter, Type entityType, int orgUnitId, Expression? existingExpression)
    {
        try
        {
            var (skipFilter, orgUnitIds) = await _officeService.ResolveGlobalFilterOrganizationHierarchyIdsAsync(orgUnitId);
            if (skipFilter)
            {
                _logger.LogDebug("Org unit filter skipped for {EntityType} (e.g. OPS root or office without hierarchy link)", entityType.Name);
                return existingExpression;
            }

            _logger.LogDebug("Smart org unit filter for {EntityType} with {Count} org hierarchy ids", entityType.Name, orgUnitIds.Count);

            var entityTypeName = GetEntityTypeNameForRelationship(entityType);

            if (entityType == typeof(Partner) || entityType == typeof(UNOPSPartner))
            {
                // 1. Partner: Comprehensive relationship-based filtering
                return await ApplyPartnerOrgUnitFilterAsync(parameter, entityType, orgUnitIds, existingExpression);
            }
            else if (entityType == typeof(Contact) || entityType == typeof(UNOPSContact))
            {
                // 2. Contact: Comprehensive relationship-based filtering
                return await ApplyContactOrgUnitFilterAsync(parameter, entityType, orgUnitIds, existingExpression);
            }
            else if (entityType == typeof(Interaction) || entityType == typeof(UNOPSInteraction))
            {
                // 3. Interaction: Comprehensive relationship-based filtering
                return await ApplyInteractionOrgUnitFilterAsync(parameter, entityType, orgUnitIds, existingExpression);
            }
            else if (entityType == typeof(Opportunity))
            {
                // 4. Opportunity: Filter by ResponsibleOrgUnitId (direct FK, not OrganizationUnitRelationship)
                return ApplyOpportunityOrgUnitFilter(parameter, entityType, orgUnitIds, existingExpression);
            }
            else if (entityType == typeof(Office))
            {
                // 5. Office: Filter by OrganizationHierarchyId (direct FK to OrganizationHierarchy)
                return ApplyOfficeOrgUnitFilter(parameter, entityType, orgUnitIds, existingExpression);
            }
            else
            {
                // For other entity types, try direct lookup first
                return await ApplyDirectOrgUnitFilterAsync(parameter, entityType, orgUnitIds, entityTypeName, existingExpression);
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to apply OrgUnit filter for {EntityType}, continuing without org unit filtering", entityType.Name);
            return existingExpression;
        }
    }

    /// <summary>
    /// Apply organization unit filtering for Opportunity: <c>ResponsibleOrgUnitId</c> is an Office id;
    /// user's filter uses OrganizationHierarchy subtree ids — match via <see cref="Office.OrganizationHierarchyId"/>.
    /// </summary>
    private Expression? ApplyOpportunityOrgUnitFilter(
        ParameterExpression parameter,
        Type entityType,
        List<int> orgUnitIds,
        Expression? existingExpression)
    {
        var responsibleOfficeNav = entityType.GetProperty("ResponsibleOrgUnit");
        if (responsibleOfficeNav == null)
        {
            _logger.LogWarning("Opportunity entity has no ResponsibleOrgUnit navigation - skipping org unit filter");
            return existingExpression;
        }

        var officeType = typeof(Office);
        var orgHierarchyIdOnOffice = officeType.GetProperty(nameof(Office.OrganizationHierarchyId));
        if (orgHierarchyIdOnOffice == null)
            return existingExpression;

        var officeAccess = Expression.Property(parameter, responsibleOfficeNav);
        var officeNotNull = Expression.NotEqual(officeAccess, Expression.Constant(null, responsibleOfficeNav.PropertyType));

        var ohIdAccess = Expression.Property(officeAccess, orgHierarchyIdOnOffice);
        var hasValueProperty = typeof(int?).GetProperty("HasValue");
        var valueProperty = typeof(int?).GetProperty("Value");
        if (hasValueProperty == null || valueProperty == null)
            return existingExpression;

        var hasOhId = Expression.Property(ohIdAccess, hasValueProperty);
        var hasOhIdCheck = Expression.Equal(hasOhId, Expression.Constant(true));
        var ohIdValue = Expression.Property(ohIdAccess, valueProperty);

        var idsConstant = Expression.Constant(orgUnitIds);
        var containsMethod = typeof(List<int>).GetMethod("Contains");
        if (containsMethod == null)
            return existingExpression;

        var containsCall = Expression.Call(idsConstant, containsMethod, ohIdValue);
        var opportunityFilter = Expression.AndAlso(officeNotNull, Expression.AndAlso(hasOhIdCheck, containsCall));

        _logger.LogDebug("Applied ResponsibleOrgUnit (Office → hierarchy) filter for Opportunity with {Count} org units", orgUnitIds.Count);

        if (existingExpression != null)
        {
            return Expression.AndAlso(existingExpression, opportunityFilter);
        }

        return opportunityFilter;
    }

    /// <summary>
    /// Apply organization unit filtering for Office entities using OrganizationHierarchyId.
    /// Office has a direct FK to OrganizationHierarchy.
    /// </summary>
    private Expression? ApplyOfficeOrgUnitFilter(
        ParameterExpression parameter,
        Type entityType,
        List<int> orgUnitIds,
        Expression? existingExpression)
    {
        var orgHierarchyIdProperty = entityType.GetProperty("OrganizationHierarchyId");
        if (orgHierarchyIdProperty == null ||
            orgHierarchyIdProperty.PropertyType != typeof(int?))
        {
            _logger.LogWarning("Office entity has no OrganizationHierarchyId property - skipping org unit filter");
            return existingExpression;
        }

        var orgHierarchyIdAccess = Expression.Property(parameter, orgHierarchyIdProperty);

        var hasValueProperty = typeof(int?).GetProperty("HasValue");
        if (hasValueProperty == null)
            return existingExpression;

        var hasValueAccess = Expression.Property(orgHierarchyIdAccess, hasValueProperty);
        var hasValueCheck = Expression.Equal(hasValueAccess, Expression.Constant(true));

        var valueProperty = typeof(int?).GetProperty("Value");
        if (valueProperty == null)
            return existingExpression;

        var valueAccess = Expression.Property(orgHierarchyIdAccess, valueProperty);
        var idsConstant = Expression.Constant(orgUnitIds);
        var containsMethod = typeof(List<int>).GetMethod("Contains");
        if (containsMethod == null)
            return existingExpression;

        var containsCall = Expression.Call(idsConstant, containsMethod, valueAccess);

        var officeFilter = Expression.AndAlso(hasValueCheck, containsCall);

        _logger.LogDebug("Applied OrganizationHierarchyId filter for Office with {Count} org units", orgUnitIds.Count);

        if (existingExpression != null)
        {
            return Expression.AndAlso(existingExpression, officeFilter);
        }

        return officeFilter;
    }

    #endregion

    #region Helper Methods

    /// <summary>
    /// Create date range expression for CreatedDate and/or LastModifiedDate
    /// </summary>
    private Expression? CreateDateRangeExpression(ParameterExpression parameter, Type entityType, DateTime? fromDate, DateTime? toDate)
    {
        var createdDateProperty = entityType.GetProperty("CreatedDate");
        var lastModifiedDateProperty = entityType.GetProperty("LastModifiedDate");

        Expression? combinedDateExpression = null;

        // Check CreatedDate
        if (createdDateProperty != null && createdDateProperty.PropertyType == typeof(DateTime))
        {
            var createdDateAccess = Expression.Property(parameter, createdDateProperty);
            var createdDateCondition = CreatePropertyDateRangeCondition(createdDateAccess, fromDate, toDate, typeof(DateTime));
            
            if (createdDateCondition != null)
            {
                combinedDateExpression = createdDateCondition;
            }
        }

        // Check LastModifiedDate (usually nullable DateTime)
        if (lastModifiedDateProperty != null && 
            (lastModifiedDateProperty.PropertyType == typeof(DateTime?) || lastModifiedDateProperty.PropertyType == typeof(DateTime)))
        {
            var lastModifiedDateAccess = Expression.Property(parameter, lastModifiedDateProperty);
            var lastModifiedDateCondition = CreatePropertyDateRangeCondition(lastModifiedDateAccess, fromDate, toDate, lastModifiedDateProperty.PropertyType);

            if (lastModifiedDateCondition != null)
            {
                if (combinedDateExpression != null)
                {
                    // Combine with OR: (CreatedDate in range) OR (LastModifiedDate in range)
                    combinedDateExpression = Expression.OrElse(combinedDateExpression, lastModifiedDateCondition);
                }
                else
                {
                    combinedDateExpression = lastModifiedDateCondition;
                }
            }
        }

        return combinedDateExpression;
    }

    /// <summary>
    /// Create date range condition for a specific property
    /// </summary>
    private Expression? CreatePropertyDateRangeCondition(MemberExpression propertyAccess, DateTime? fromDate, DateTime? toDate, Type propertyType)
    {
        Expression? condition = null;

        // From date condition
        if (fromDate.HasValue)
        {
            var fromConstant = Expression.Constant(fromDate.Value, propertyType);
            var fromCondition = Expression.GreaterThanOrEqual(propertyAccess, fromConstant);
            condition = fromCondition;
        }

        // To date condition
        if (toDate.HasValue)
        {
            var toConstant = Expression.Constant(toDate.Value, propertyType);
            var toCondition = Expression.LessThan(propertyAccess, toConstant);

            if (condition != null)
            {
                condition = Expression.AndAlso(condition, toCondition);
            }
            else
            {
                condition = toCondition;
            }
        }

        return condition;
    }

    /// <summary>
    /// Check if dynamic object has a property
    /// </summary>
    private bool HasProperty(dynamic obj, string propertyName)
    {
        try
        {
            return obj.GetType().GetProperty(propertyName) != null;
        }
        catch
        {
            return false;
        }
    }

    /// <summary>
    /// Get entity type name for OrganizationUnitRelationship lookup
    /// Handles inheritance (e.g., UNOPSPartner -> Partner)
    /// </summary>
    private string GetEntityTypeNameForRelationship(Type entityType)
    {
        // Handle UNOPS inheritance - they are stored with their base type names
        if (entityType == typeof(UNOPSPartner))
            return "Partner";
        if (entityType == typeof(UNOPSContact))
            return "Contact";
        if (entityType == typeof(UNOPSInteraction))
            return "Interaction";
        
        // For all other types, use the actual type name
        return entityType.Name;
    }

    /// <summary>
    /// Apply direct organization unit filtering by looking up entity IDs in OrganizationUnitRelationship table
    /// </summary>
    private async Task<Expression?> ApplyDirectOrgUnitFilterAsync(ParameterExpression parameter, Type entityType, List<int> orgUnitIds, string entityTypeName, Expression? existingExpression)
    {
        var validEntityIds = (await _context.Set<OrganizationUnitRelationship>()
            .Where(orgRel => 
                orgRel.EntityType == entityTypeName && 
                !orgRel.IsDeleted &&
                orgRel.Status == EntityStatus.Active &&
                orgUnitIds.Contains(orgRel.OrganizationHierarchyId))
            .Select(orgRel => orgRel.EntityId)
            .ToListAsync())
            .Union(await GetEntityIdsFromOfficeRelationshipsForFilterAsync(entityTypeName, orgUnitIds))
            .Distinct()
            .ToList();

        _logger.LogDebug("Direct filter found {Count} {EntityType} IDs", validEntityIds.Count, entityTypeName);

        if (validEntityIds.Any())
        {
            var idProperty = GetIdProperty(entityType);
            if (idProperty != null)
            {
                var idAccess = Expression.Property(parameter, idProperty);
                var idsConstant = Expression.Constant(validEntityIds);
                var containsMethod = typeof(List<int>).GetMethod("Contains");
                var containsCall = Expression.Call(idsConstant, containsMethod, idAccess);
                
                // Combine with existing expression using AND
                if (existingExpression != null)
                {
                    return Expression.AndAlso(existingExpression, containsCall);
                }
                return containsCall;
            }
            else
            {
                // If no ID property found, return false (empty result)
                _logger.LogWarning("No ID property found for {EntityType} - returning empty result for org unit filter", entityType.Name);
                return Expression.Constant(false);
            }
        }
        else
        {
            // If no valid entity IDs found in org unit, return false (empty result)
            _logger.LogDebug("No entities found in organization unit for {EntityType} - returning empty result", entityTypeName);
            return Expression.Constant(false);
        }
    }

    /// <summary>
    /// Apply organization unit filtering for Contact entities using comprehensive relationship-based filtering:
    /// 1. Direct contact org unit relationships
    /// 2. Associated contacts through their partners' org unit relationships
    /// 3. Associated contacts through interactions that are related to org units
    /// </summary>
    private async Task<Expression?> ApplyContactOrgUnitFilterAsync(ParameterExpression parameter, Type entityType, List<int> orgUnitIds, Expression? existingExpression)
    {
        var allValidContactIds = new HashSet<int>();

        foreach (var id in await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Contact), orgUnitIds))
            allValidContactIds.Add(id);

        // 2. Contacts whose partner is linked to the org units via OfficeRelationship
        var validPartnerIds = await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Partner), orgUnitIds);

        if (validPartnerIds.Any())
        {
            var contactIdsThroughPartners = await _context.Set<UNOPSContact>()
                .Where(c => validPartnerIds.Contains(c.PartnerId))
                .Select(c => c.Id)
                .ToListAsync();

            foreach (var id in contactIdsThroughPartners)
                allValidContactIds.Add(id);

            _logger.LogDebug("Contact filter found {Count} contact IDs through partner org units", contactIdsThroughPartners.Count);
        }

        // 3. Get contact IDs through interactions that are related to org units
        // First get all interaction IDs that are related to org units (office links)
        var validInteractionIds = new HashSet<int>();

        foreach (var id in await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Interaction), orgUnitIds))
            validInteractionIds.Add(id);

        // Now get contact IDs associated with these interactions
        if (validInteractionIds.Any())
        {
            var contactIdsThroughInteractions = await _context.Set<InteractionContact>()
                .Where(ic => validInteractionIds.Contains(ic.InteractionId))
                .Select(ic => ic.ContactId)
                .Distinct()
                .ToListAsync();

            foreach (var id in contactIdsThroughInteractions)
                allValidContactIds.Add(id);

            _logger.LogDebug("Contact filter found {Count} contact IDs through interaction org units", contactIdsThroughInteractions.Count);
        }

        var interactionIdsFromOfficeContacts = await _context.Set<InteractionContact>()
            .Where(ic => allValidContactIds.Contains(ic.ContactId))
            .Select(ic => ic.InteractionId)
            .Distinct()
            .ToListAsync();
        foreach (var id in interactionIdsFromOfficeContacts)
            validInteractionIds.Add(id);

        var totalContactIds = allValidContactIds.ToList();
        _logger.LogDebug("Contact filter found {Count} total contact IDs across all org unit relationships", totalContactIds.Count);

        if (totalContactIds.Any())
        {
            var idProperty = GetIdProperty(entityType);
            if (idProperty != null)
            {
                var idAccess = Expression.Property(parameter, idProperty);
                var contactIdsConstant = Expression.Constant(totalContactIds);
                var containsMethod = typeof(List<int>).GetMethod("Contains");
                var containsCall = Expression.Call(contactIdsConstant, containsMethod, idAccess);
                
                // Combine with existing expression using AND
                if (existingExpression != null)
                {
                    return Expression.AndAlso(existingExpression, containsCall);
                }
                return containsCall;
            }
        }

        // If no valid contact IDs found, return empty result
        return Expression.Constant(false);
    }

    /// <summary>
    /// Apply organization unit filtering for Partner entities using comprehensive relationship-based filtering:
    /// 1. Direct partner org unit relationships
    /// 2. Partners associated with contacts that are in org units
    /// 3. Partners associated with interactions that are related to org units
    /// </summary>
    private async Task<Expression?> ApplyPartnerOrgUnitFilterAsync(ParameterExpression parameter, Type entityType, List<int> orgUnitIds, Expression? existingExpression)
    {
        var allValidPartnerIds = new HashSet<int>();

        // 1. Get direct partner IDs from OrganizationUnitRelationship table
        var directPartnerIds = await _context.Set<OrganizationUnitRelationship>()
            .Where(orgRel => 
                orgRel.EntityType == "Partner" && 
                !orgRel.IsDeleted &&
                orgRel.Status == EntityStatus.Active &&
                orgUnitIds.Contains(orgRel.OrganizationHierarchyId))
            .Select(orgRel => orgRel.EntityId)
            .ToListAsync();

        foreach (var id in directPartnerIds)
            allValidPartnerIds.Add(id);

        foreach (var id in await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Partner), orgUnitIds))
            allValidPartnerIds.Add(id);

        _logger.LogDebug("Partner filter found {Count} direct partner IDs in org units", directPartnerIds.Count);

        // 2. Get partner IDs through contacts that are directly in org units
        var contactIdsInOrgUnits = (await _context.Set<OrganizationUnitRelationship>()
            .Where(orgRel => 
                orgRel.EntityType == "Contact" && 
                !orgRel.IsDeleted &&
                orgRel.Status == EntityStatus.Active &&
                orgUnitIds.Contains(orgRel.OrganizationHierarchyId))
            .Select(orgRel => orgRel.EntityId)
            .ToListAsync())
            .Union(await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Contact), orgUnitIds))
            .Distinct()
            .ToList();

        if (contactIdsInOrgUnits.Any())
        {
            var partnerIdsThroughContacts = await _context.Set<UNOPSContact>()
                .Where(c => contactIdsInOrgUnits.Contains(c.Id))
                .Select(c => c.PartnerId)
                .Distinct()
                .ToListAsync();

            foreach (var id in partnerIdsThroughContacts)
                allValidPartnerIds.Add(id);

            _logger.LogDebug("Partner filter found {Count} partner IDs through contact org units", partnerIdsThroughContacts.Count);
        }

        // 3. Get partner IDs through interactions that are related to org units
        var validInteractionIds = new HashSet<int>();

        foreach (var id in await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Interaction), orgUnitIds))
            validInteractionIds.Add(id);

        // Now get partner IDs from these interactions through InteractionPartner relationships
        if (validInteractionIds.Any())
        {
            var partnerIdsThroughInteractions = await _context.Set<InteractionPartner>()
                .Where(ip => validInteractionIds.Contains(ip.InteractionId))
                .Select(ip => ip.PartnerId)
                .Distinct()
                .ToListAsync();

            foreach (var id in partnerIdsThroughInteractions)
                allValidPartnerIds.Add(id);

            _logger.LogDebug("Partner filter found {Count} partner IDs through interaction org units", partnerIdsThroughInteractions.Count);
        }

        var totalPartnerIds = allValidPartnerIds.ToList();
        _logger.LogDebug("Partner filter found {Count} total partner IDs across all org unit relationships", totalPartnerIds.Count);

        if (totalPartnerIds.Any())
        {
            var idProperty = GetIdProperty(entityType);
            if (idProperty != null)
            {
                var idAccess = Expression.Property(parameter, idProperty);
                var partnerIdsConstant = Expression.Constant(totalPartnerIds);
                var containsMethod = typeof(List<int>).GetMethod("Contains");
                var containsCall = Expression.Call(partnerIdsConstant, containsMethod, idAccess);
                
                // Combine with existing expression using AND
                if (existingExpression != null)
                {
                    return Expression.AndAlso(existingExpression, containsCall);
                }
                return containsCall;
            }
        }

        // If no valid partner IDs found, return empty result
        return Expression.Constant(false);
    }

    /// <summary>
    /// Apply organization unit filtering for Interaction entities using comprehensive relationship-based filtering:
    /// 1. Direct interaction office links
    /// 2. Associated contacts' org unit relationships  
    /// 3. Associated contacts' underlying partners' org unit relationships
    /// 4. Direct partner associations (InteractionPartners) org unit relationships
    /// </summary>
    private async Task<Expression?> ApplyInteractionOrgUnitFilterAsync(ParameterExpression parameter, Type entityType, List<int> orgUnitIds, Expression? existingExpression)
    {
        var allValidInteractionIds = new HashSet<int>();

        foreach (var id in await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Interaction), orgUnitIds))
            allValidInteractionIds.Add(id);

        var directOfficeInteractionCount = allValidInteractionIds.Count;
        _logger.LogDebug("Interaction filter found {Count} direct interaction IDs via office org units", directOfficeInteractionCount);

        // 2. Get interaction IDs through associated contacts' org units
        var contactInteractionIds = await _context.Set<UNOPSInteraction>()
            .Join(_context.Set<InteractionContact>(), 
                  i => i.Id, 
                  ic => ic.InteractionId, 
                  (i, ic) => new { InteractionId = i.Id, ContactId = ic.ContactId })
            .Join(_context.Set<OrganizationUnitRelationship>(),
                  x => x.ContactId,
                  orgRel => orgRel.EntityId,
                  (x, orgRel) => new { x.InteractionId, orgRel })
            .Where(x => 
                x.orgRel.EntityType == "Contact" &&
                !x.orgRel.IsDeleted &&
                x.orgRel.Status == EntityStatus.Active &&
                orgUnitIds.Contains(x.orgRel.OrganizationHierarchyId))
            .Select(x => x.InteractionId)
            .Distinct()
            .ToListAsync();

        foreach (var id in contactInteractionIds)
            allValidInteractionIds.Add(id);

        _logger.LogDebug("Interaction filter found {Count} interaction IDs through contact org units", contactInteractionIds.Count);

        var officeContactIdsForInteraction = await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Contact), orgUnitIds);
        if (officeContactIdsForInteraction.Count > 0)
        {
            var interactionIdsThroughOfficeContacts = await _context.Set<InteractionContact>()
                .Where(ic => officeContactIdsForInteraction.Contains(ic.ContactId))
                .Select(ic => ic.InteractionId)
                .Distinct()
                .ToListAsync();

            foreach (var id in interactionIdsThroughOfficeContacts)
                allValidInteractionIds.Add(id);

            _logger.LogDebug(
                "Interaction filter found {Count} interaction IDs through office-linked contacts",
                interactionIdsThroughOfficeContacts.Count);
        }

        // 3. Also check interactions through direct partner associations (InteractionPartners)
        var directPartnerInteractionIds = await _context.Set<UNOPSInteraction>()
            .Join(_context.Set<InteractionPartner>(), 
                  i => i.Id, 
                  ip => ip.InteractionId, 
                  (i, ip) => new { InteractionId = i.Id, PartnerId = ip.PartnerId })
            .Join(_context.Set<OrganizationUnitRelationship>(),
                  x => x.PartnerId,
                  orgRel => orgRel.EntityId,
                  (x, orgRel) => new { x.InteractionId, orgRel })
            .Where(x => 
                x.orgRel.EntityType == "Partner" &&
                !x.orgRel.IsDeleted &&
                x.orgRel.Status == EntityStatus.Active &&
                orgUnitIds.Contains(x.orgRel.OrganizationHierarchyId))
            .Select(x => x.InteractionId)
            .Distinct()
            .ToListAsync();

        foreach (var id in directPartnerInteractionIds)
            allValidInteractionIds.Add(id);

        _logger.LogDebug("Interaction filter found {Count} interaction IDs through direct partner associations", directPartnerInteractionIds.Count);

        var officePartnerIdsForInteraction = await GetEntityIdsFromOfficeRelationshipsForFilterAsync(nameof(Partner), orgUnitIds);
        if (officePartnerIdsForInteraction.Count > 0)
        {
            var interactionIdsThroughOfficePartners = await _context.Set<InteractionPartner>()
                .Where(ip => officePartnerIdsForInteraction.Contains(ip.PartnerId))
                .Select(ip => ip.InteractionId)
                .Distinct()
                .ToListAsync();

            foreach (var id in interactionIdsThroughOfficePartners)
                allValidInteractionIds.Add(id);

            _logger.LogDebug(
                "Interaction filter found {Count} interaction IDs through office-linked partners",
                interactionIdsThroughOfficePartners.Count);
        }

        var totalInteractionIds = allValidInteractionIds.ToList();
        _logger.LogDebug("Interaction filter found {Count} total interaction IDs across all org unit relationships", totalInteractionIds.Count);

        if (totalInteractionIds.Any())
        {
            var idProperty = GetIdProperty(entityType);
            if (idProperty != null)
            {
                var idAccess = Expression.Property(parameter, idProperty);
                var interactionIdsConstant = Expression.Constant(totalInteractionIds);
                var containsMethod = typeof(List<int>).GetMethod("Contains");
                var containsCall = Expression.Call(interactionIdsConstant, containsMethod, idAccess);
                
                // Combine with existing expression using AND
                if (existingExpression != null)
                {
                    return Expression.AndAlso(existingExpression, containsCall);
                }
                return containsCall;
            }
        }

        // If no valid interaction IDs found, return empty result
        return Expression.Constant(false);
    }

    private async Task<List<int>> GetEntityIdsFromOfficeRelationshipsForFilterAsync(string entityTypeName, List<int> orgUnitIds)
    {
        var officeIds = await OfficeRelationshipSyncHelper.GetOfficeIdsMatchingOrgFilterAsync(_context, orgUnitIds);
        return await OfficeRelationshipSyncHelper.GetEntityIdsFromOfficeRelationshipsAsync(_context, entityTypeName, officeIds);
    }

    /// <summary>
    /// Get the Id property from an entity type, handling inheritance scenarios
    /// </summary>
    private System.Reflection.PropertyInfo? GetIdProperty(Type entityType)
    {
        // Try to get Id property with DeclaredOnly first to avoid ambiguity
        var idProperty = entityType.GetProperty("Id", System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.DeclaredOnly);
        
        if (idProperty == null)
        {
            // If not found with DeclaredOnly, try all properties and get the first Id property
            var allIdProperties = entityType.GetProperties().Where(p => p.Name == "Id").ToArray();
            if (allIdProperties.Length > 0)
            {
                idProperty = allIdProperties[0]; // Take the first one
            }
        }
        
        return idProperty;
    }

    #endregion
}
