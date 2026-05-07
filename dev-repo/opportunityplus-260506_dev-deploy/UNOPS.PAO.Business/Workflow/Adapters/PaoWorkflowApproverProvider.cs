using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UNOPS.PAO.Business.Opportunities;
using UNOPS.PAO.Business.Workflow.Interfaces;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.Workflow.DataAccess;
using UNOPS.Workflow.Models;

namespace UNOPS.PAO.Business.Workflow.Adapters;

/// <summary>
/// PAO implementation of IWorkflowApproverProvider.
/// Provides entity-specific workflow approvers based on stakeholders and entity roles.
/// For GO transition: Uses DoA Level 2 holders from the opportunity's ResponsibleOrgUnit,
/// with fallback to DoA Level 3 when no DoA2 holders exist.
/// For other transitions: Uses stakeholder-based lookup.
/// Uses DbContextFactory to create separate context instances for each operation,
/// avoiding DbContext concurrency issues with other async workflow operations.
/// </summary>
public class PaoWorkflowApproverProvider : IPaoWorkflowApproverProvider
{
    private readonly IDbContextFactory<AppDbContext> _contextFactory;
    private readonly WorkflowDbContext _workflowContext;
    private readonly ILogger<PaoWorkflowApproverProvider>? _logger;

    public PaoWorkflowApproverProvider(
        IDbContextFactory<AppDbContext> contextFactory,
        WorkflowDbContext workflowContext,
        ILogger<PaoWorkflowApproverProvider>? logger = null)
    {
        _contextFactory = contextFactory;
        _workflowContext = workflowContext;
        _logger = logger;
    }

    /// <summary>
    /// Gets the list of users who can approve a workflow transition.
    /// </summary>
    public async Task<List<WorkflowApproverModel>> GetApproversAsync(
        string entityName,
        int entityId,
        string fromStage,
        string toStage,
        int? stateMachineVersionId = null)
    {
        var approvers = new List<WorkflowApproverModel>();

        // Get roles that can approve this transition
        var stageChangeRoles = await GetStageChangeRolesAsync(
            entityName, fromStage, toStage, canApprove: true, stateMachineVersionId: stateMachineVersionId);

        if (!stageChangeRoles.Any())
            return approvers;

        var roleNames = stageChangeRoles.Select(r => r.RoleName).ToList();

        // For Opportunity entities, find stakeholders with the required roles
        if (entityName.Equals("opportunity", StringComparison.OrdinalIgnoreCase))
        {
            approvers = await GetOpportunityApproversAsync(entityId, roleNames, toStage);
        }

        return approvers;
    }

    /// <summary>
    /// Gets workflow approval tasks and required roles for a stage transition.
    /// </summary>
    public async Task<(List<WorkflowTaskModel> approvals, string[] roles)?> GetApprovalConfigurationAsync(
        string entityName,
        int entityId,
        string fromStage,
        string toStage,
        int? stateMachineVersionId = null)
    {
        var stageChangeRoles = await GetStageChangeRolesAsync(
            entityName, fromStage, toStage, canApprove: true, stateMachineVersionId: stateMachineVersionId);

        if (!stageChangeRoles.Any())
            return null;

        var roles = stageChangeRoles.Select(r => r.RoleName).Distinct().ToArray();
        var roleNames = stageChangeRoles.Select(r => r.RoleName).ToList();

        // Get approvers for the entity
        var tasks = new List<WorkflowTaskModel>();

        if (entityName.Equals("opportunity", StringComparison.OrdinalIgnoreCase))
        {
            var approvers = await GetOpportunityApproverTasksAsync(entityId, roleNames, toStage);
            tasks.AddRange(approvers);
        }

        return (tasks, roles);
    }

    /// <summary>
    /// Gets workflow trigger users and required roles for a stage transition.
    /// </summary>
    public async Task<(List<WorkflowTaskModel> triggers, string[] roles)?> GetTriggerConfigurationAsync(
        string entityName,
        int entityId,
        string fromStage,
        string toStage,
        int? stateMachineVersionId = null)
    {
        var stageChangeRoles = await GetStageChangeRolesAsync(
            entityName, fromStage, toStage, canTrigger: true, stateMachineVersionId: stateMachineVersionId);

        if (!stageChangeRoles.Any())
            return null;

        var roles = stageChangeRoles.Select(r => r.RoleName).Distinct().ToArray();
        var roleNames = stageChangeRoles.Select(r => r.RoleName).ToList();

        // Get triggers for the entity
        var tasks = new List<WorkflowTaskModel>();

        if (entityName.Equals("opportunity", StringComparison.OrdinalIgnoreCase))
        {
            var triggers = await GetOpportunityTriggerTasksAsync(entityId, roleNames);
            tasks.AddRange(triggers);
        }

        return (tasks, roles);
    }

    /// <summary>
    /// Checks if a user can approve a workflow transition.
    /// </summary>
    public async Task<bool> CanUserApproveAsync(
        string entityName,
        int entityId,
        int userId,
        string fromStage,
        string toStage,
        int? stateMachineVersionId = null)
    {
        var approvers = await GetApproversAsync(entityName, entityId, fromStage, toStage, stateMachineVersionId);
        return approvers.Any(a => a.UserId == userId);
    }

    /// <summary>
    /// Returns the subset of <paramref name="candidateRoleIds"/> (FK to <see cref="EntityRole.Id"/>) that
    /// <paramref name="userId"/> holds for the given Opportunity. The user is considered to hold a role
    /// when they have a non-deleted <see cref="EntityUserRole"/> on the opportunity's
    /// <c>ResponsibleOrgUnitId</c>, or when they are the configured Officer-in-Charge for a row that
    /// matches one of the candidate role ids. Engagement Acceptance DoA filters
    /// (see <see cref="OpportunityTeamAutoPopulateRoleFilter"/>) are applied to keep this consistent
    /// with <see cref="GetDoA2HoldersForOrgUnitAsync"/> / <see cref="GetDoA3HoldersForOrgUnitAsync"/>:
    /// holding DoA2 for a different DoAType does not grant cascade for an EA approval round.
    /// </summary>
    /// <remarks>
    /// Used by <c>WorkflowManager.CascadeDelegateAutoCompletionsAsync</c> to detect when the current
    /// approver acted strictly as a delegate (e.g., DoA3 standing in for DoA2) and therefore upcoming
    /// rows whose primary <see cref="StateMachineStageChangeRole.RoleId"/> equals the user's role id
    /// should be auto-completed without re-soliciting their approval.
    /// </remarks>
    public async Task<IReadOnlySet<int>> FilterUserRoleIdsAsync(
        string entityName,
        int entityId,
        int userId,
        IReadOnlyCollection<int> candidateRoleIds,
        int? stateMachineVersionId = null,
        CancellationToken cancellationToken = default)
    {
        if (candidateRoleIds.Count == 0 || userId <= 0)
            return new HashSet<int>();

        // Today only the Opportunity entity has delegate-aware approval rounds (DoA2 with DoA3 delegate).
        // Other entities can be added here as their workflows gain delegates.
        if (!entityName.Equals("opportunity", StringComparison.OrdinalIgnoreCase))
            return new HashSet<int>();

        var candidateIdsList = candidateRoleIds.Distinct().ToList();

        await using var context = await _contextFactory.CreateDbContextAsync(cancellationToken);

        var opportunity = await context.Set<Opportunity>()
            .AsNoTracking()
            .Where(o => o.Id == entityId && !o.IsDeleted)
            .Select(o => new { o.Id, o.ResponsibleOrgUnitId })
            .FirstOrDefaultAsync(cancellationToken);

        if (opportunity?.ResponsibleOrgUnitId == null)
        {
            _logger?.LogDebug(
                "FilterUserRoleIdsAsync: Opportunity {OpportunityId} not found or missing ResponsibleOrgUnitId; no roles matched for user {UserId}",
                entityId, userId);
            return new HashSet<int>();
        }

        var orgUnitId = opportunity.ResponsibleOrgUnitId.Value;
        // Officer-In-Charge is stored as a stringified resource id (see TryParseOfficerInChargeUserId).
        var userIdStr = userId.ToString();

        var matchedRoleIds = await context.Set<EntityUserRole>()
            .AsNoTracking()
            .Where(e => !e.IsDeleted &&
                        e.EntityType == "OrganizationHierarchy" &&
                        e.EntityId == orgUnitId &&
                        e.EntityRoleId.HasValue &&
                        candidateIdsList.Contains(e.EntityRoleId.Value) &&
                        e.EntityRole != null &&
                        (e.EntityRole.SubType == null ||
                         e.EntityRole.SubType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceSubType) &&
                        (e.DoAType == null ||
                         e.DoAType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceDoAType) &&
                        (e.UserId == userId || e.OfficerInChargeResourceId == userIdStr))
            .Select(e => e.EntityRoleId!.Value)
            .Distinct()
            .ToListAsync(cancellationToken);

        return matchedRoleIds.ToHashSet();
    }

    /// <summary>
    /// Gets stage change roles that match the criteria.
    /// </summary>
    private async Task<List<StageChangeRoleInfo>> GetStageChangeRolesAsync(
        string entityName,
        string fromStage,
        string toStage,
        bool? canApprove = null,
        bool? canTrigger = null,
        int? stateMachineVersionId = null)
    {
        // stateMachineVersionId: reserved for when PAO's workflow submodule includes FK/joins from role to
        // StateMachineStageChange + StateMachineVersion (see unops-workflow). Older domain models filter by legacy keys only.
        _ = stateMachineVersionId;

        var query = _workflowContext.StateMachineStageChangeRoles
            .Where(x => !x.IsDeleted &&
                        x.EntityType.ToLower() == entityName.ToLower() &&
                        x.FromStage == fromStage &&
                        x.ToStage == toStage);

        if (canApprove.HasValue)
            query = query.Where(x => x.CanApprove == canApprove.Value);

        if (canTrigger.HasValue)
            query = query.Where(x => x.CanTrigger == canTrigger.Value);

        return await query
            .Select(x => new StageChangeRoleInfo
            {
                RoleId = x.RoleId,
                RoleName = x.RoleName ?? string.Empty,
                CanApprove = x.CanApprove,
                CanTrigger = x.CanTrigger
            })
            .ToListAsync();
    }

    /// <summary>
    /// Gets approvers for an Opportunity based on the target stage.
    /// For GO transition: Returns DoA holders from the opportunity's ResponsibleOrgUnit
    /// (DoA2 first, DoA3 fallback when no DoA2 holders exist).
    /// For other transitions: Returns stakeholders with the required entity roles.
    /// </summary>
    private async Task<List<WorkflowApproverModel>> GetOpportunityApproversAsync(
        int opportunityId, 
        List<string> roleNames,
        string toStage)
    {
        // For GO transition, use DoA holders from ResponsibleOrgUnit (DoA2 first, DoA3 fallback)
        if (toStage == OpportunityWorkflow.Stages.Go)
        {
            return await GetDoA2HoldersForOpportunityAsync(opportunityId, toStage);
        }

        // For other transitions, use stakeholder-based lookup
        return await GetStakeholderApproversAsync(opportunityId, roleNames, toStage);
    }

    /// <summary>
    /// Gets DoA holders for an opportunity's ResponsibleOrgUnit.
    /// Uses DoA2 first; falls back to DoA3 when no DoA2 holders exist.
    /// </summary>
    /// <param name="opportunityId">The opportunity ID.</param>
    /// <param name="toStage">The target workflow stage.</param>
    /// <returns>List of DoA approvers (DoA2 or DoA3).</returns>
    private async Task<List<WorkflowApproverModel>> GetDoA2HoldersForOpportunityAsync(
        int opportunityId,
        string toStage)
    {
        await using var context = await _contextFactory.CreateDbContextAsync();
        
        // Get the opportunity's ResponsibleOrgUnitId
        var opportunity = await context.Set<Opportunity>()
            .AsNoTracking()
            .Where(o => o.Id == opportunityId && !o.IsDeleted)
            .Select(o => new { o.Id, o.ResponsibleOrgUnitId })
            .FirstOrDefaultAsync();

        if (opportunity == null)
        {
            _logger?.LogWarning("Opportunity {OpportunityId} not found for DoA2 lookup", opportunityId);
            return new List<WorkflowApproverModel>();
        }

        if (!opportunity.ResponsibleOrgUnitId.HasValue)
        {
            _logger?.LogWarning("Opportunity {OpportunityId} has no ResponsibleOrgUnitId set for DoA2 lookup", opportunityId);
            return new List<WorkflowApproverModel>();
        }

        return await GetDoAHoldersForOrgUnitAsync(opportunity.ResponsibleOrgUnitId.Value, toStage);
    }

    /// <summary>
    /// Gets DoA holders for a specific organization unit.
    /// Uses DoA2 holders first; falls back to DoA3 when no DoA2 holders exist.
    /// </summary>
    /// <param name="orgUnitId">The organization unit ID.</param>
    /// <param name="toStage">The target workflow stage.</param>
    /// <returns>List of DoA approvers (DoA2 or DoA3).</returns>
    private async Task<List<WorkflowApproverModel>> GetDoAHoldersForOrgUnitAsync(int orgUnitId, string toStage)
    {
        var doa2Holders = await GetDoA2HoldersForOrgUnitAsync(orgUnitId, toStage);
        if (doa2Holders.Any())
        {
            return doa2Holders;
        }

        return await GetDoA3HoldersForOrgUnitAsync(orgUnitId, toStage);
    }

    /// <summary>
    /// Gets DoA Level 2 holders for a specific organization unit.
    /// Queries EntityUserRole for users with DoA2_Engagement_Acceptance role on the org unit.
    /// Filters by DoAType = Engagement Acceptance only (null for legacy records).
    /// </summary>
    /// <param name="orgUnitId">The organization unit ID.</param>
    /// <param name="toStage">The target workflow stage.</param>
    /// <returns>List of DoA Level 2 approvers.</returns>
    private async Task<List<WorkflowApproverModel>> GetDoA2HoldersForOrgUnitAsync(
        int orgUnitId,
        string toStage)
    {
        await using var context = await _contextFactory.CreateDbContextAsync();
        
        var doaHolders = await context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                       e.EntityType == "OrganizationHierarchy" &&
                       e.EntityId == orgUnitId &&
                       e.EntityRole != null &&
                       e.EntityRole.Code == OpportunityTeamAutoPopulateRoleFilter.DoA2EngagementAcceptanceCode &&
                       (e.EntityRole.SubType == null || e.EntityRole.SubType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceSubType) &&
                       (e.DoAType == null || e.DoAType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceDoAType))
            .ToListAsync();

        if (!doaHolders.Any())
        {
            _logger?.LogWarning(
                "No DoA Level 2 holders found for OrganizationHierarchy {OrgUnitId}", 
                orgUnitId);
        }

        return await MapDoARolesToApproversWithOfficerInChargeAsync(
            context, doaHolders, "DoA Level 2", toStage);
    }

    /// <summary>
    /// Gets DoA Level 3 holders for a specific organization unit.
    /// Used as fallback when no DoA2 holders exist.
    /// Filters by DoAType = Engagement Acceptance only (null for legacy records).
    /// </summary>
    /// <param name="orgUnitId">The organization unit ID.</param>
    /// <param name="toStage">The target workflow stage.</param>
    /// <returns>List of DoA Level 3 approvers.</returns>
    private async Task<List<WorkflowApproverModel>> GetDoA3HoldersForOrgUnitAsync(int orgUnitId, string toStage)
    {
        await using var context = await _contextFactory.CreateDbContextAsync();

        var doaHolders = await context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Include(e => e.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(e => !e.IsDeleted &&
                       e.EntityType == "OrganizationHierarchy" &&
                       e.EntityId == orgUnitId &&
                       e.EntityRole != null &&
                       e.EntityRole.Code == OpportunityTeamAutoPopulateRoleFilter.DoA3EngagementAcceptanceCode &&
                       (e.EntityRole.SubType == null || e.EntityRole.SubType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceSubType) &&
                       (e.DoAType == null || e.DoAType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceDoAType))
            .ToListAsync();

        if (!doaHolders.Any())
        {
            _logger?.LogWarning(
                "No DoA Level 3 holders found for OrganizationHierarchy {OrgUnitId} (DoA2 fallback)",
                orgUnitId);
        }

        return await MapDoARolesToApproversWithOfficerInChargeAsync(
            context, doaHolders, "DoA Level 3", toStage);
    }

    /// <summary>
    /// Maps DoA Engagement Acceptance role rows to approvers, including <see cref="EntityUserRole.OfficerInChargeResourceId"/>
    /// when it resolves to an internal user id — same workflow permissions as the primary DoA holder.
    /// </summary>
    private async Task<List<WorkflowApproverModel>> MapDoARolesToApproversWithOfficerInChargeAsync(
        AppDbContext context,
        List<EntityUserRole> roleRows,
        string roleDisplay,
        string toStage)
    {
        var models = new List<WorkflowApproverModel>();
        var seenUserIds = new HashSet<int>();

        foreach (var e in roleRows.Where(x => x.User != null).OrderBy(x => x.Id))
        {
            if (!seenUserIds.Add(e.UserId))
                continue;
            models.Add(MapPaoUserToWorkflowApprover(e.User!, roleDisplay, toStage));
        }

        var oicIdsToLoad = new List<int>();
        foreach (var e in roleRows)
        {
            if (!TryParseOfficerInChargeUserId(e.OfficerInChargeResourceId, out var oicId))
                continue;
            if (seenUserIds.Contains(oicId))
                continue;
            oicIdsToLoad.Add(oicId);
        }

        oicIdsToLoad = oicIdsToLoad.Distinct().ToList();
        if (oicIdsToLoad.Count == 0)
            return models;

        var oicUsers = await context.PAOUsers
            .AsNoTracking()
            .Include(u => u.UserProfile)
            .Where(u => oicIdsToLoad.Contains(u.Id))
            .ToListAsync();

        foreach (var oicUser in oicUsers.OrderBy(u => u.Id))
        {
            if (!seenUserIds.Add(oicUser.Id))
                continue;
            models.Add(MapPaoUserToWorkflowApprover(oicUser, roleDisplay, toStage));
        }

        return models;
    }

    private static WorkflowApproverModel MapPaoUserToWorkflowApprover(PAOUser user, string roleDisplay, string toStage)
    {
        return new WorkflowApproverModel
        {
            UserId = user.Id,
            FirstName = user.UserProfile?.Name?.Split(' ').FirstOrDefault() ?? string.Empty,
            LastName = user.UserProfile?.Name?.Split(' ').Skip(1).FirstOrDefault() ?? string.Empty,
            Name = user.UserProfile?.Name ?? user.Email,
            Email = user.Email ?? string.Empty,
            Role = roleDisplay,
            ToStage = toStage
        };
    }

    private static bool TryParseOfficerInChargeUserId(string? resourceId, out int userId)
    {
        userId = 0;
        if (string.IsNullOrWhiteSpace(resourceId))
            return false;
        return int.TryParse(resourceId.Trim(), out userId) && userId > 0;
    }

    /// <summary>
    /// Gets approvers for an Opportunity based on stakeholders with the required roles.
    /// Used for non-GO transitions.
    /// </summary>
    private async Task<List<WorkflowApproverModel>> GetStakeholderApproversAsync(
        int opportunityId, 
        List<string> roleNames,
        string toStage)
    {
        await using var context = await _contextFactory.CreateDbContextAsync();
        
        // Get stakeholders with the required entity roles
        var stakeholders = await context.Set<OpportunityStakeholder>()
            .AsNoTracking()
            .Include(s => s.EntityRole)
            .Include(s => s.User)
                .ThenInclude(u => u!.UserProfile)
            .Where(s => s.OpportunityId == opportunityId &&
                       s.UserId.HasValue &&
                       s.EntityRole != null &&
                       roleNames.Contains(s.EntityRole.Name))
            .ToListAsync();

        return stakeholders
            .Where(s => s.User != null)
            .Select(s => new WorkflowApproverModel
            {
                UserId = s.UserId!.Value,
                FirstName = s.User!.UserProfile?.Name?.Split(' ').FirstOrDefault() ?? string.Empty,
                LastName = s.User!.UserProfile?.Name?.Split(' ').Skip(1).FirstOrDefault() ?? string.Empty,
                Name = s.User!.UserProfile?.Name ?? s.User.Email,
                Email = s.User!.Email ?? string.Empty,
                Role = s.EntityRole!.Name,
                ToStage = toStage
            })
            .ToList();
    }

    /// <summary>
    /// Gets approval tasks for an Opportunity.
    /// For GO transition: Returns DoA holders from the opportunity's ResponsibleOrgUnit
    /// (DoA2 first, DoA3 fallback when no DoA2 holders exist).
    /// For other transitions: Returns stakeholders with the required entity roles.
    /// </summary>
    private async Task<List<WorkflowTaskModel>> GetOpportunityApproverTasksAsync(
        int opportunityId, 
        List<string> roleNames,
        string toStage)
    {
        // For GO transition, use DoA holders from ResponsibleOrgUnit (DoA2 first, DoA3 fallback)
        if (toStage == OpportunityWorkflow.Stages.Go)
        {
            return await GetDoAHolderTasksForOpportunityAsync(opportunityId);
        }

        await using var context = await _contextFactory.CreateDbContextAsync();
        
        // For other transitions, use stakeholder-based lookup
        var stakeholders = await context.Set<OpportunityStakeholder>()
            .AsNoTracking()
            .Include(s => s.EntityRole)
            .Where(s => s.OpportunityId == opportunityId &&
                       s.UserId.HasValue &&
                       s.EntityRole != null &&
                       roleNames.Contains(s.EntityRole.Name))
            .ToListAsync();

        return stakeholders
            .Select(s => new WorkflowTaskModel
            {
                UserId = s.UserId!.Value,
                Role = s.EntityRole!.Name
            })
            .ToList();
    }

    /// <summary>
    /// Gets DoA holder tasks for an opportunity's ResponsibleOrgUnit.
    /// Uses DoA2 holders first; falls back to DoA3 when no DoA2 holders exist.
    /// </summary>
    private async Task<List<WorkflowTaskModel>> GetDoAHolderTasksForOpportunityAsync(int opportunityId)
    {
        await using var context = await _contextFactory.CreateDbContextAsync();

        // Get the opportunity's ResponsibleOrgUnitId
        var opportunity = await context.Set<Opportunity>()
            .AsNoTracking()
            .Where(o => o.Id == opportunityId && !o.IsDeleted)
            .Select(o => new { o.Id, o.ResponsibleOrgUnitId })
            .FirstOrDefaultAsync();

        if (opportunity?.ResponsibleOrgUnitId == null)
        {
            return new List<WorkflowTaskModel>();
        }

        var orgUnitId = opportunity.ResponsibleOrgUnitId.Value;

        // Try DoA2 first
        var doa2Holders = await context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Where(e => !e.IsDeleted &&
                       e.EntityType == "OrganizationHierarchy" &&
                       e.EntityId == orgUnitId &&
                       e.EntityRole != null &&
                       e.EntityRole.Code == OpportunityTeamAutoPopulateRoleFilter.DoA2EngagementAcceptanceCode &&
                       (e.EntityRole.SubType == null || e.EntityRole.SubType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceSubType) &&
                       (e.DoAType == null || e.DoAType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceDoAType))
            .ToListAsync();

        if (doa2Holders.Any())
            return BuildDoAWorkflowTasksWithOfficerInCharge(doa2Holders, "DoA Level 2");

        // Fallback to DoA3
        var doa3Holders = await context.Set<EntityUserRole>()
            .AsNoTracking()
            .Include(e => e.EntityRole)
            .Where(e => !e.IsDeleted &&
                       e.EntityType == "OrganizationHierarchy" &&
                       e.EntityId == orgUnitId &&
                       e.EntityRole != null &&
                       e.EntityRole.Code == OpportunityTeamAutoPopulateRoleFilter.DoA3EngagementAcceptanceCode &&
                       (e.EntityRole.SubType == null || e.EntityRole.SubType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceSubType) &&
                       (e.DoAType == null || e.DoAType == OpportunityTeamAutoPopulateRoleFilter.EngagementAcceptanceDoAType))
            .ToListAsync();

        return BuildDoAWorkflowTasksWithOfficerInCharge(doa3Holders, "DoA Level 3");
    }

    /// <summary>
    /// Primary DoA assignees plus <see cref="EntityUserRole.OfficerInChargeResourceId"/> users (same role label).
    /// </summary>
    private static List<WorkflowTaskModel> BuildDoAWorkflowTasksWithOfficerInCharge(
        List<EntityUserRole> roleRows,
        string roleLabel)
    {
        var tasks = new List<WorkflowTaskModel>();
        var seen = new HashSet<int>();
        foreach (var e in roleRows.OrderBy(x => x.Id))
        {
            if (seen.Add(e.UserId))
                tasks.Add(new WorkflowTaskModel { UserId = e.UserId, Role = roleLabel });
        }

        foreach (var e in roleRows)
        {
            if (!TryParseOfficerInChargeUserId(e.OfficerInChargeResourceId, out var oicId))
                continue;
            if (!seen.Add(oicId))
                continue;
            tasks.Add(new WorkflowTaskModel { UserId = oicId, Role = roleLabel });
        }

        return tasks;
    }

    /// <summary>
    /// Gets trigger tasks for an Opportunity.
    /// Includes both:
    /// - Stakeholders with trigger roles (e.g., Opportunity Manager)
    /// - Collaborators (Opportunity Development Team members who have edit permissions)
    /// </summary>
    private async Task<List<WorkflowTaskModel>> GetOpportunityTriggerTasksAsync(
        int opportunityId, 
        List<string> roleNames)
    {
        await using var context = await _contextFactory.CreateDbContextAsync();
        
        var tasks = new List<WorkflowTaskModel>();
        
        // 1. Get stakeholders with trigger roles (e.g., Opportunity Manager)
        var stakeholders = await context.Set<OpportunityStakeholder>()
            .AsNoTracking()
            .Include(s => s.EntityRole)
            .Where(s => s.OpportunityId == opportunityId &&
                       !s.IsDeleted &&
                       s.UserId.HasValue &&
                       s.EntityRole != null &&
                       roleNames.Contains(s.EntityRole.Name))
            .ToListAsync();

        tasks.AddRange(stakeholders
            .Select(s => new WorkflowTaskModel
            {
                UserId = s.UserId!.Value,
                Role = s.EntityRole!.Name
            }));
        
        // 2. Get Collaborators (Opportunity Development Team members)
        // Collaborators have edit permissions and should be able to trigger workflows
        var collaborators = await context.Set<OpportunityCollaborator>()
            .AsNoTracking()
            .Where(c => c.OpportunityId == opportunityId && !c.IsDeleted)
            .ToListAsync();

        tasks.AddRange(collaborators
            .Select(c => new WorkflowTaskModel
            {
                UserId = c.UserId,
                Role = "Collaborator"
            }));
        
        // Remove duplicates (in case a user is both a stakeholder with trigger role and a collaborator)
        return tasks
            .GroupBy(t => t.UserId)
            .Select(g => g.First())
            .ToList();
    }

    /// <summary>
    /// Internal record for stage change role information.
    /// </summary>
    private record StageChangeRoleInfo
    {
        public int RoleId { get; init; }
        public string RoleName { get; init; } = string.Empty;
        public bool CanApprove { get; init; }
        public bool CanTrigger { get; init; }
    }
}
