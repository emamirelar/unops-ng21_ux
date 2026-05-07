using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UNOPS.PAO.Business.Workflow;
using UNOPS.PAO.Business.Workflow.Interfaces;
using UNOPS.PAO.DataAccess.Services;
using UNOPS.PAO.Models.Offices;
using UNOPS.PAO.Presentation.Controllers.Shared;
using UNOPS.PAO.Presentation.Helpers;
using UNOPS.PAO.UNOPSBusiness.Attributes;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.Workflow.Models.WorkflowVersionAdmin;

namespace UNOPS.PAO.Presentation.Controllers.Workflow;

/// <summary>
/// Workflow version configuration for an instance scope (<c>ScopeEntityName</c> + <c>ScopeEntityId</c>).
/// Currently only <see cref="OpportunityWorkflow.WorkflowScopeEntityName"/> is supported.
/// </summary>
[ApiController]
[Route("/")]
[Authorize(AuthenticationSchemes = "IAP")]
public sealed class WorkflowScopeConfigController : BaseController
{
    private readonly IOfficeService _officeService;
    private readonly IOfficeWorkflowConfigService _workflowScopeConfigService;

    public WorkflowScopeConfigController(
        ILogger<WorkflowScopeConfigController> logger,
        IAuthorizationService authorizationService,
        UserResolverService<int> userResolverService,
        IOfficeService officeService,
        IOfficeWorkflowConfigService workflowScopeConfigService)
        : base(logger, authorizationService, userResolverService)
    {
        _officeService = officeService;
        _workflowScopeConfigService = workflowScopeConfigService;
    }

    /// <summary>
    /// Lists workflow subject types configured in the system (same list for any supported scope instance).
    /// </summary>
    [HttpGet(APIDictionary.Scope + "/{scopeEntityName}/{scopeEntityId:int}/workflow-config/entity-types")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetWorkflowEntityTypes(
        string scopeEntityName,
        int scopeEntityId,
        CancellationToken cancellationToken)
    {
        if (!TryGetOfficeScope(scopeEntityName, scopeEntityId, out var officeId, out var scopeError))
            return scopeError!;

        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var detail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
            if (detail == null)
                return NotFound();

            var types = await _workflowScopeConfigService.ListEntityTypesForOfficeScopeAsync(officeId, cancellationToken);
            return Ok(types);
        });
    }

    /// <summary>
    /// Full workflow configuration view: each entity type with active version rows (office, defaults, ancestors) and applicable resolution.
    /// </summary>
    [HttpGet(APIDictionary.Scope + "/{scopeEntityName}/{scopeEntityId:int}/workflow-config/overview")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<IReadOnlyList<OfficeWorkflowEntityTypeOverviewDto>>> GetWorkflowConfigurationOverview(
        string scopeEntityName,
        int scopeEntityId,
        CancellationToken cancellationToken)
    {
        if (!TryGetOfficeScope(scopeEntityName, scopeEntityId, out var officeId, out var scopeError))
            return scopeError!;

        return await HandleOperationAsync<ActionResult>(async () =>
        {
            var detail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
            if (detail == null)
                return NotFound();

            var overview = await _workflowScopeConfigService.GetWorkflowConfigurationOverviewAsync(detail, cancellationToken);
            return Ok(overview);
        });
    }

    [HttpGet(APIDictionary.Scope + "/{scopeEntityName}/{scopeEntityId:int}/workflow-config/versions")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<IReadOnlyList<WorkflowVersionSummaryDto>>> GetWorkflowVersions(
        string scopeEntityName,
        int scopeEntityId,
        [FromQuery] string entityType,
        CancellationToken cancellationToken)
    {
        if (!TryGetOfficeScope(scopeEntityName, scopeEntityId, out var officeId, out var scopeError))
            return scopeError!;

        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (string.IsNullOrWhiteSpace(entityType))
                return BadRequest("entityType is required.");

            var detail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
            if (detail == null)
                return NotFound();

            var rows = await _workflowScopeConfigService.ListVersionsForOfficeScopeAsync(
                officeId,
                entityType.Trim(),
                cancellationToken);
            return Ok(rows);
        });
    }

    [HttpGet(APIDictionary.Scope + "/{scopeEntityName}/{scopeEntityId:int}/workflow-config/applicable-version")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<OfficeWorkflowApplicableVersionResponse>> GetApplicableWorkflowVersion(
        string scopeEntityName,
        int scopeEntityId,
        [FromQuery] string entityType,
        CancellationToken cancellationToken)
    {
        if (!TryGetOfficeScope(scopeEntityName, scopeEntityId, out var officeId, out var scopeError))
            return scopeError!;

        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (string.IsNullOrWhiteSpace(entityType))
                return BadRequest("entityType is required.");

            var detail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
            if (detail == null)
                return NotFound();

            var result = await _workflowScopeConfigService.GetApplicableVersionAsync(
                officeId,
                entityType.Trim(),
                cancellationToken);
            return Ok(result);
        });
    }

    [HttpGet(APIDictionary.Scope + "/{scopeEntityName}/{scopeEntityId:int}/workflow-config/graph/{stateMachineVersionId:int}")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<WorkflowVersionGraphDto>> GetWorkflowGraph(
        string scopeEntityName,
        int scopeEntityId,
        int stateMachineVersionId,
        [FromQuery] string entityType,
        CancellationToken cancellationToken)
    {
        if (!TryGetOfficeScope(scopeEntityName, scopeEntityId, out var officeId, out var scopeError))
            return scopeError!;

        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (string.IsNullOrWhiteSpace(entityType))
                return BadRequest("entityType is required.");

            var detail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
            if (detail == null)
                return NotFound();

            var graph = await _workflowScopeConfigService.GetGraphForOfficeScopeAsync(
                detail,
                entityType.Trim(),
                stateMachineVersionId,
                cancellationToken);
            if (graph == null)
                return NotFound();

            return Ok(graph);
        });
    }

    [HttpPost(APIDictionary.Scope + "/{scopeEntityName}/{scopeEntityId:int}/workflow-config/save")]
    [AccessControlled(EntityTypes.Office, "read")]
    public async Task<ActionResult<WorkflowVersionSaveResult>> SaveWorkflowVersion(
        string scopeEntityName,
        int scopeEntityId,
        [FromBody] OfficeWorkflowVersionSaveRequest request,
        CancellationToken cancellationToken)
    {
        if (!TryGetOfficeScope(scopeEntityName, scopeEntityId, out var officeId, out var scopeError))
            return scopeError!;

        return await HandleOperationAsync<ActionResult>(async () =>
        {
            if (request == null)
                return BadRequest("Request body is required.");

            var detail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
            if (detail == null)
                return NotFound();

            var userId = CurrentUserId;
            var permissions = await _officeService.GetOfficePermissionsAsync(officeId, userId, cancellationToken);
            if (permissions is not { CanEditWorkflowConfiguration: true })
                return Forbid();

            var result = await _workflowScopeConfigService.SaveForOfficeScopeAsync(officeId, request, cancellationToken);
            if (!result.Success)
                return BadRequest(result);

            return Ok(result);
        });
    }

    /// <summary>
    /// Maps URL scope to office id when <paramref name="scopeEntityName"/> is the only supported kind.
    /// </summary>
    private static bool TryGetOfficeScope(
        string scopeEntityName,
        int scopeEntityId,
        out int officeId,
        out ActionResult? error)
    {
        officeId = scopeEntityId;
        if (!string.Equals(
                scopeEntityName,
                OpportunityWorkflow.WorkflowScopeEntityName,
                StringComparison.Ordinal))
        {
            error = new BadRequestObjectResult(
                $"Scope entity '{scopeEntityName}' is not supported. Only '{OpportunityWorkflow.WorkflowScopeEntityName}' is supported.");
            return false;
        }

        error = null;
        return true;
    }
}
