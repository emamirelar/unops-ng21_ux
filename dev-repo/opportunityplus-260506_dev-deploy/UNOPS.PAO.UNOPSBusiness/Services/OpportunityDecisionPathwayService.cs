using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Business.Workflow;
using UNOPS.PAO.Business.Workflow.Interfaces;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Models.Opportunities;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.Workflow.Business;
using UNOPS.Workflow.Models.WorkflowVersionAdmin;

namespace UNOPS.PAO.UNOPSBusiness.Services;

/// <inheritdoc />
public sealed class OpportunityDecisionPathwayService : IOpportunityDecisionPathwayService
{
    private const string WarningNoneKey = "opportunity.decisionPathway.none";

    private readonly AppDbContext _db;
    private readonly IOfficeService _officeService;
    private readonly IOfficeWorkflowConfigService _officeWorkflowConfig;
    private readonly IOpportunityWorkflowRiskConditionTextProvider _riskConditionText;

    public OpportunityDecisionPathwayService(
        AppDbContext db,
        IOfficeService officeService,
        IOfficeWorkflowConfigService officeWorkflowConfig,
        IOpportunityWorkflowRiskConditionTextProvider riskConditionText)
    {
        _db = db;
        _officeService = officeService;
        _officeWorkflowConfig = officeWorkflowConfig;
        _riskConditionText = riskConditionText;
    }

    /// <inheritdoc />
    public async Task<OpportunityDecisionPathwayPreviewResponse> GetSubmitForGoPathwayAsync(
        OpportunityDecisionPathwayPreviewRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.ResponsibleOrgUnitId <= 0)
        {
            return None(WarningNoneKey);
        }

        var officeId = request.ResponsibleOrgUnitId;
        var applicable = await _officeWorkflowConfig.GetApplicableVersionAsync(
            officeId,
            OpportunityWorkflow.EntityName,
            cancellationToken);

        if (!applicable.ApplicableStateMachineVersionId.HasValue)
        {
            return None(WarningNoneKey);
        }

        var versionId = applicable.ApplicableStateMachineVersionId.Value;
        var officeDetail = await _officeService.GetOfficeDetailAsync(officeId, cancellationToken);
        if (officeDetail == null)
        {
            return None(WarningNoneKey);
        }

        var graph = await _officeWorkflowConfig.GetGraphForOfficeScopeAsync(
            officeDetail,
            OpportunityWorkflow.EntityName,
            versionId,
            cancellationToken);

        if (graph == null)
        {
            return None(WarningNoneKey);
        }

        var transition = graph.StageChanges.FirstOrDefault(c =>
            string.Equals((c.FromStage ?? string.Empty).Trim(), OpportunityWorkflow.Stages.IdentifyAndProfile, StringComparison.OrdinalIgnoreCase) &&
            string.Equals((c.ToStage ?? string.Empty).Trim(), OpportunityWorkflow.Stages.Go, StringComparison.OrdinalIgnoreCase) &&
            string.Equals((c.Name ?? string.Empty).Trim(), "Submit for Go", StringComparison.OrdinalIgnoreCase));

        if (transition == null)
        {
            return None(WarningNoneKey);
        }

        var approvingRoles = (transition.Roles ?? [])
            .Where(r => r.CanApprove)
            .ToList();

        if (approvingRoles.Count == 0)
        {
            return None(WarningNoneKey);
        }

        var fieldValues = await BuildConditionFieldValuesAsync(request, approvingRoles, cancellationToken);

        var orderedRoles = approvingRoles
            .OrderBy(r => r.Sequence)
            .ThenBy(r => r.RoleId)
            .ToList();

        var qualifyingRoles = new List<WorkflowStageChangeRoleDefinitionDto>();
        var skippedRoles = new List<WorkflowStageChangeRoleDefinitionDto>();
        foreach (var role in orderedRoles)
        {
            if (WorkflowGraphConditionEvaluator.RoleStepApplies(role, fieldValues))
                qualifyingRoles.Add(role);
            else
                skippedRoles.Add(role);
        }

        if (qualifyingRoles.Count == 0)
        {
            return None(WarningNoneKey);
        }

        var steps = new List<OpportunityDecisionPathwayStepModel>();
        foreach (var role in qualifyingRoles)
        {
            var (people, usedDelegate, code) = await ResolvePeopleForRoleAsync(
                officeId,
                role,
                cancellationToken);

            steps.Add(new OpportunityDecisionPathwayStepModel
            {
                Sequence = role.Sequence,
                WorkflowRoleId = role.RoleId,
                WorkflowRoleName = role.RoleName ?? string.Empty,
                EntityRoleCode = code,
                People = people,
                UsedDelegateFallback = usedDelegate,
                IsConditional = HasConditions(role),
            });
        }

        var skippedSteps = new List<OpportunityDecisionPathwayStepModel>();
        foreach (var role in skippedRoles)
        {
            var code = await GetEntityRoleCodeAsync(role.RoleId, cancellationToken);
            skippedSteps.Add(new OpportunityDecisionPathwayStepModel
            {
                Sequence = role.Sequence,
                WorkflowRoleId = role.RoleId,
                WorkflowRoleName = role.RoleName ?? string.Empty,
                EntityRoleCode = code,
                People = Array.Empty<OpportunityDecisionPathwayPersonModel>(),
                UsedDelegateFallback = false,
                IsConditional = HasConditions(role),
            });
        }

        return new OpportunityDecisionPathwayPreviewResponse
        {
            HasPathway = true,
            Steps = steps,
            SkippedSteps = skippedSteps,
        };
    }

    private static bool HasConditions(WorkflowStageChangeRoleDefinitionDto role) =>
        role.Conditions != null && role.Conditions.Any(c => c != null);

    private static OpportunityDecisionPathwayPreviewResponse None(string key) =>
        new()
        {
            HasPathway = false,
            WarningMessageKey = key,
            Steps = Array.Empty<OpportunityDecisionPathwayStepModel>(),
            SkippedSteps = Array.Empty<OpportunityDecisionPathwayStepModel>(),
        };

    private async Task<IReadOnlyDictionary<string, string>> BuildConditionFieldValuesAsync(
        OpportunityDecisionPathwayPreviewRequest request,
        IReadOnlyList<WorkflowStageChangeRoleDefinitionDto> approvingRoles,
        CancellationToken cancellationToken)
    {
        var keys = approvingRoles
            .SelectMany(r => r.Conditions ?? [])
            .Select(c => c.FieldKey)
            .Where(k => !string.IsNullOrWhiteSpace(k))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        Dictionary<string, string> map = new(StringComparer.OrdinalIgnoreCase);

        // No conditions reference any opportunity field — skip the (potentially expensive) load entirely.
        if (keys.Count == 0)
        {
            return map;
        }

        if (request.OpportunityId.HasValue && request.OpportunityId.Value > 0)
        {
            var opportunityId = request.OpportunityId.Value;
            var wantsRiskText = keys.Any(k => string.Equals(k, OpportunityWorkflowConditionFieldKeys.RisksConditionText, StringComparison.OrdinalIgnoreCase));
            var nonRiskKeys = wantsRiskText
                ? keys.Where(k => !string.Equals(k, OpportunityWorkflowConditionFieldKeys.RisksConditionText, StringComparison.OrdinalIgnoreCase)).ToList()
                : keys;

            // Only hydrate the opportunity (with all its includes) when at least one non-risk field key needs it.
            // Otherwise (e.g. only RisksConditionText is requested) avoid the heavy multi-include query entirely.
            if (nonRiskKeys.Count > 0)
            {
                var opp = await LoadOpportunityForPathwayAsync(opportunityId, cancellationToken);
                if (opp == null)
                {
                    return map;
                }

                OpportunityWorkflowConditionFieldValues.AppendFieldValues(opp, nonRiskKeys, map);
            }
            else
            {
                // Lightweight existence check so a deleted opportunity still produces no field values.
                var exists = await _db.Opportunities
                    .AsNoTracking()
                    .AnyAsync(o => o.Id == opportunityId && !o.IsDeleted, cancellationToken);
                if (!exists)
                {
                    return map;
                }
            }

            if (wantsRiskText)
            {
                var riskText = await _riskConditionText.GetAggregateSearchTextAsync(opportunityId, cancellationToken);
                map[OpportunityWorkflowConditionFieldKeys.RisksConditionText] = riskText ?? string.Empty;
            }
        }
        else if (request.DraftFieldValues != null)
        {
            foreach (var kv in request.DraftFieldValues)
            {
                if (!string.IsNullOrWhiteSpace(kv.Key))
                    map[kv.Key] = kv.Value ?? string.Empty;
            }
        }

        return map;
    }

    // AsSplitQuery() is required: without it, chaining 10 collection-level Includes produces a single
    // SQL with cartesian joins that explodes on older opportunities with many child rows
    // (Countries × SDGs × SDGTargets × SDGIndicators × Deliverables × Stakeholders × ...).
    // The same fix is applied in UNOPSOpportunityManager for the opportunity get-by-id query.
    private async Task<Opportunity?> LoadOpportunityForPathwayAsync(int opportunityId, CancellationToken cancellationToken) =>
        await _db.Opportunities
            .AsNoTracking()
            .WithWorkflowConditionIncludes()
            .AsSplitQuery()
            .FirstOrDefaultAsync(o => o.Id == opportunityId && !o.IsDeleted, cancellationToken);

    private async Task<(IReadOnlyList<OpportunityDecisionPathwayPersonModel> People, bool UsedDelegate, string? RoleCode)> ResolvePeopleForRoleAsync(
        int officeId,
        WorkflowStageChangeRoleDefinitionDto role,
        CancellationToken cancellationToken)
    {
        var primaryRoleCode = await GetEntityRoleCodeAsync(role.RoleId, cancellationToken);
        var primary = await LoadUsersForEntityRoleAsync(officeId, role.RoleId, cancellationToken);
        if (primary.Count > 0)
            return (primary, false, primaryRoleCode);

        var delegateRoleIds = (role.Delegates ?? [])
            .Select(d => d.RoleId)
            .Where(id => id > 0)
            .Distinct()
            .ToList();

        var delegatePeople = new List<OpportunityDecisionPathwayPersonModel>();
        foreach (var did in delegateRoleIds)
            delegatePeople.AddRange(await LoadUsersForEntityRoleAsync(officeId, did, cancellationToken));

        var distinct = delegatePeople
            .GroupBy(p => p.UserId)
            .Select(g => g.First())
            .ToList();

        return (distinct, true, primaryRoleCode);
    }

    private async Task<string?> GetEntityRoleCodeAsync(int entityRoleId, CancellationToken cancellationToken)
    {
        if (entityRoleId <= 0) return null;
        return await _db.EntityRoles.AsNoTracking()
            .Where(r => r.Id == entityRoleId && !r.IsDeleted)
            .Select(r => r.Code)
            .FirstOrDefaultAsync(cancellationToken);
    }

    private async Task<List<OpportunityDecisionPathwayPersonModel>> LoadUsersForEntityRoleAsync(
        int officeId,
        int entityRoleId,
        CancellationToken cancellationToken)
    {
        if (entityRoleId <= 0) return [];

        var rows = await _db.EntityUserRoles
            .AsNoTracking()
            .Include(e => e.User).ThenInclude(u => u!.UserProfile)
            .Include(e => e.EntityRole)
            .Where(e =>
                !e.IsDeleted &&
                e.EntityType == "OrganizationHierarchy" &&
                e.EntityId == officeId &&
                e.EntityRoleId == entityRoleId)
            .ToListAsync(cancellationToken);

        var people = new List<OpportunityDecisionPathwayPersonModel>();
        foreach (var eur in rows)
        {
            people.Add(new OpportunityDecisionPathwayPersonModel
            {
                UserId = eur.UserId,
                DisplayName = eur.User?.UserProfile?.Name ?? eur.User?.Email,
                Position = eur.PositionTitle ?? eur.User?.UserProfile?.Position,
                OfficerInChargeResourceId = eur.OfficerInChargeResourceId,
                OfficerInChargeDisplayName = null,
            });
        }

        await PopulateOiCNamesAsync(people, cancellationToken);
        return people;
    }

    private async Task PopulateOiCNamesAsync(List<OpportunityDecisionPathwayPersonModel> people, CancellationToken cancellationToken)
    {
        var oicIds = people
            .Select(p => p.OfficerInChargeResourceId)
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Select(s => int.TryParse(s!.Trim(), out var id) ? id : (int?)null)
            .Where(id => id.HasValue && id.Value > 0)
            .Select(id => id!.Value)
            .Distinct()
            .ToList();

        if (oicIds.Count == 0) return;

        var users = await _db.PAOUsers.AsNoTracking()
            .Where(u => oicIds.Contains(u.Id))
            .Select(u => new { u.Id, Name = u.Name ?? u.Email ?? string.Empty })
            .ToListAsync(cancellationToken);

        var map = users.ToDictionary(u => u.Id, u => u.Name);
        foreach (var p in people)
        {
            if (string.IsNullOrWhiteSpace(p.OfficerInChargeResourceId)) continue;
            if (!int.TryParse(p.OfficerInChargeResourceId.Trim(), out var id)) continue;
            if (map.TryGetValue(id, out var name))
                p.OfficerInChargeDisplayName = name;
        }
    }
}
