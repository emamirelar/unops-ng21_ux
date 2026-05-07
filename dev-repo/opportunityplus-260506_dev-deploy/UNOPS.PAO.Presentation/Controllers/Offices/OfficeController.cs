using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UNOPS.PAO.DataAccess.Services;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Models.Offices;
using UNOPS.PAO.Models.Search;
using UNOPS.PAO.Models.Shared;
using UNOPS.PAO.Presentation.Controllers.Shared;
using UNOPS.PAO.Presentation.Helpers;
using UNOPS.PAO.UNOPSBusiness.Attributes;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSBusiness.Services;

namespace UNOPS.PAO.Presentation.Controllers.Offices;

[ApiController]
[Route("/")]
[Authorize(AuthenticationSchemes = "IAP")]
public class OfficeController : BaseController
{
    private readonly IOfficeService _officeService;
    private readonly AdvancedSearchService _advancedSearchService;

    public OfficeController(
        IOfficeService officeService,
        AdvancedSearchService advancedSearchService,
        ILogger<OfficeController> logger,
        IAuthorizationService authorizationService,
        UserResolverService<int> userResolverService)
        : base(logger, authorizationService, userResolverService)
    {
        _officeService = officeService;
        _advancedSearchService = advancedSearchService;
    }

    /// <summary>
    /// Gets offices with optional filtering and pagination.
    /// </summary>
    [HttpGet(APIDictionary.Office)]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<PaginationResponse<OfficeListModel>>> GetOffices([FromQuery] OfficeFilterRequest request)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var result = await _officeService.GetOfficesAsync(request);
            return Ok(result);
        });
    }

    /// <summary>
    /// Searches offices by query string.
    /// </summary>
    [HttpGet(APIDictionary.Office + "/search")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<PaginationResponse<OfficeListModel>>> SearchOffices([FromQuery] string query, [FromQuery] OfficeFilterRequest request)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var result = await _officeService.SearchOfficesAsync(query ?? "", request);
            return Ok(result);
        });
    }

    /// <summary>
    /// Get supported search fields for offices - helps frontend build dynamic advanced search forms.
    /// </summary>
    [HttpGet(APIDictionary.Office + "/search-fields")]
    [AccessControlled(EntityTypes.Office, "read")]
    public ActionResult<List<SearchFieldInfo>> GetOfficeSearchFields()
    {
        try
        {
            var fields = new List<SearchFieldInfo>
            {
                new() { Field = "name", DisplayName = "office.list.columnName", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "alias", DisplayName = "office.list.columnAlias", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "code", DisplayName = "office.list.columnCode", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "costCentreId", DisplayName = "office.list.columnCostCentre", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "type", DisplayName = "office.list.columnType", FieldType = "text", AllowedOperators = new List<string> { "eq", "neq" } },
                new() { Field = "internalName", DisplayName = "office.list.columnInternalName", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "externalName", DisplayName = "office.list.columnExternalName", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "hierarchyLevel", DisplayName = "office.list.columnHierarchyLevel", FieldType = "number", AllowedOperators = new List<string> { "eq", "neq", "gt", "lt", "gte", "lte" } },
                new() { Field = "effectiveDate", DisplayName = "office.list.columnEffectiveDate", FieldType = "date", AllowedOperators = new List<string> { "after", "before", "between" } },
                new() { Field = "financialCentreType", DisplayName = "office.list.columnFinancialCentreType", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "funding", DisplayName = "office.list.columnFunding", FieldType = "text", AllowedOperators = new List<string> { "like", "eq", "neq" } },
                new() { Field = "scopeType", DisplayName = "office.list.columnScopeType", FieldType = "text", AllowedOperators = new List<string> { "eq", "neq" } },
                new() { Field = "status", DisplayName = "office.list.columnStatus", FieldType = "number", AllowedOperators = new List<string> { "eq", "neq" } },
                new() { Field = "parentId", DisplayName = "office.list.columnParent", FieldType = "number", AllowedOperators = new List<string> { "eq", "neq" } }
            };
            return Ok(fields);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving office search fields");
            return StatusCode(500, new { error = "An error occurred while retrieving search fields" });
        }
    }

    /// <summary>
    /// Advanced search for offices with structured filters.
    /// Uses AdvancedSearchService for consistent behavior with Partner, Contact, Interaction entities.
    /// Filters format: JSON array of { "field": "name"|"alias"|"code"|"type"|"costCentreId"|..., "operator": "like"|"eq"|"neq"|..., "value": "..." }
    /// </summary>
    [HttpGet(APIDictionary.Office + "/advanced-search")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<PaginationResponse<OfficeListModel>>> AdvancedSearchOffices(
        [FromQuery] string filters,
        [FromQuery] int pageIndex = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? orderBy = "name",
        [FromQuery] bool ascending = true,
        [FromQuery] bool filterActive = true)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (string.IsNullOrWhiteSpace(filters))
            {
                return BadRequest(new { error = "Search filters are required" });
            }

            List<UNOPS.PAO.UNOPSBusiness.Services.SearchFilter> searchFilters;
            try
            {
                searchFilters = JsonSerializer.Deserialize<List<UNOPS.PAO.UNOPSBusiness.Services.SearchFilter>>(filters)
                    ?? new List<UNOPS.PAO.UNOPSBusiness.Services.SearchFilter>();
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse office search filters: {Filters}", filters);
                return BadRequest(new { error = "Invalid filter format. Expected JSON array of filter objects." });
            }

            var paginationRequest = new PaginationRequest
            {
                PageIndex = pageIndex,
                PageSize = pageSize,
                OrderBy = orderBy ?? "name",
                Ascending = ascending,
                FilterActive = filterActive
            };

            PaginationResponse<OfficeListModel> result;
            try
            {
                result = await _advancedSearchService.SearchWithFiltersAsync<Office, OfficeListModel>(
                    searchFilters,
                    paginationRequest,
                    User);
            }
            catch (System.Linq.Dynamic.Core.Exceptions.ParseException ex)
            {
                _logger.LogWarning(ex, "Invalid search filter field or operator");
                return BadRequest(new { error = "Invalid search filter field or operator." });
            }

            return Ok(result);
        });
    }

    /// <summary>
    /// Gets office hierarchy tree.
    /// </summary>
    [HttpGet(APIDictionary.Office + "/tree")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<List<OfficeTreeNodeModel>>> GetOfficeTree([FromQuery] int? rootId)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var result = await _officeService.GetOfficeTreeAsync(rootId);
            return Ok(result);
        });
    }

    /// <summary>
    /// Gets an office by ID.
    /// </summary>
    [HttpGet(APIDictionary.Office + "/{id:int}")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<OfficeDetailModel>> GetOffice(int id)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var detail = await _officeService.GetOfficeDetailAsync(id);
            if (detail == null)
                return NotFound();

            return Ok(detail);
        });
    }

    /// <summary>
    /// Gets permissions for an office.
    /// </summary>
    [HttpGet(APIDictionary.Office + "/{id:int}/permissions")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<OfficePermissionsModel>> GetOfficePermissions(int id)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var detail = await _officeService.GetOfficeDetailAsync(id);
            if (detail == null)
                return NotFound();

            var userId = CurrentUserId;
            var permissions = await _officeService.GetOfficePermissionsAsync(id, userId);
            if (permissions == null)
                return NotFound();

            return Ok(permissions);
        });
    }

    /// <summary>
    /// Paged in-app operational role assignment audit for one role (OfficeMaster assign flow).
    /// Requires <c>canEditOperationalRoles</c>.
    /// </summary>
    [HttpGet(APIDictionary.Office + "/{id:int}/operational-roles/assignment-history")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<OfficeOperationalRoleAssignmentHistoryResponse>> GetOperationalRoleAssignmentHistory(
        int id,
        [FromQuery] string entityRoleCode,
        [FromQuery] int pageIndex = 0,
        [FromQuery] int pageSize = 15,
        CancellationToken cancellationToken = default)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (string.IsNullOrWhiteSpace(entityRoleCode))
                return BadRequest(new { error = "entityRoleCode is required." });

            var userId = CurrentUserId;
            var permissions = await _officeService.GetOfficePermissionsAsync(id, userId, cancellationToken);
            if (permissions is not { CanEditOperationalRoles: true })
                return Forbid();

            var result = await _officeService.GetOperationalRoleAssignmentHistoryAsync(
                id,
                entityRoleCode.Trim(),
                pageIndex,
                pageSize,
                cancellationToken);
            if (result == null)
                return NotFound();

            return Ok(result);
        });
    }

    /// <summary>
    /// Updates one OfficeMaster operational role (Director Manager, Deputy Director Manager, or HSSE Coordinator).
    /// Requires <c>canEditOperationalRoles</c> (Works At must match this office).
    /// </summary>
    [HttpPut(APIDictionary.Office + "/{id:int}/operational-roles")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<OfficeDetailModel>> UpdateOfficeOperationalRole(
        int id,
        [FromBody] UpdateOfficeOperationalRoleRequest request,
        CancellationToken cancellationToken)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (request == null)
                return BadRequest(new { error = "Request body is required." });

            var userId = CurrentUserId;
            var permissions = await _officeService.GetOfficePermissionsAsync(id, userId, cancellationToken);
            if (permissions is not { CanEditOperationalRoles: true })
                return Forbid();

            var detail = await _officeService.UpdateOfficeOperationalRoleAsync(id, request, userId, cancellationToken);
            if (detail == null)
                return NotFound();

            return Ok(detail);
        });
    }

    /// <summary>
    /// Gets opportunities related to an office (by responsible org unit hierarchy).
    /// </summary>
    [HttpGet(APIDictionary.Office + "/{id:int}/opportunities")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<PaginationResponse<OfficeRelatedOpportunityModel>>> GetOfficeOpportunities(int id, [FromQuery] OfficeFilterRequest request)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var detail = await _officeService.GetOfficeDetailAsync(id);
            if (detail == null)
                return NotFound();

            var result = await _officeService.GetRelatedOpportunitiesAsync(id, request);
            return Ok(result);
        });
    }

    /// <summary>
    /// Gets partners related to an office (by organization unit relationships).
    /// </summary>
    [HttpGet(APIDictionary.Office + "/{id:int}/partners")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<PaginationResponse<OfficeRelatedPartnerModel>>> GetOfficePartners(int id, [FromQuery] OfficeFilterRequest request)
    {
        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var detail = await _officeService.GetOfficeDetailAsync(id);
            if (detail == null)
                return NotFound();

            var result = await _officeService.GetRelatedPartnersAsync(id, request);
            return Ok(result);
        });
    }
}
