using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UNOPS.PAO.Business.Workflow;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.Workflow.DataAccess;
using UNOPS.Workflow.Domain.Entities;

namespace UNOPS.PAO.Business.Workflow.Seeders;

/// <summary>
/// Seeds workflow role rows for Opportunity transitions (default <see cref="StateMachineVersion"/>).
/// Uses PAO <c>EntityRole</c> codes for Opportunity Manager and OrganizationHierarchy DoA roles; DoA3 is stored as a delegate on the DoA2 approver row.
/// Deletes legacy Partnership Lead <c>StateMachineStageChangeRoles</c> rows for Opportunity
/// IDENTIFY &amp; PROFILE → GO / NO GO only (and any dependent <c>WorkflowLogRequiredSteps</c>) before upserting.
/// </summary>
public static class StateMachineStageChangeRoleSeeder
{
    /// <summary>Display name for Opportunity Manager (matches PAO <c>EntityRole.Name</c>).</summary>
    public static class RoleNames
    {
        public const string OpportunityManager = "Opportunity Manager";
    }

    /// <summary>Opportunity entity role code (see <c>EntityRoleSeeder</c>).</summary>
    public const string OpportunityManagerRoleCode = "Opportunity_Manager_Opportunity";

    /// <summary>Organization hierarchy DoA Engagement Acceptance codes.</summary>
    public const string DoA2EngagementAcceptanceCode = "DoA2_Engagement_Acceptance";

    public const string DoA3EngagementAcceptanceCode = "DoA3_Engagement_Acceptance";

    private const string OrganizationHierarchyEntityType = "OrganizationHierarchy";

    private const string PartnershipLeadRoleName = "Partnership Lead";

    /// <summary>
    /// Seeds role permissions for Opportunity workflow transitions (idempotent).
    /// </summary>
    public static async Task SeedStateMachineStageChangeRolesAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var workflowContext = scope.ServiceProvider.GetRequiredService<WorkflowDbContext>();
        var appContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<WorkflowDbContext>>();

        try
        {
            var versionId = await WorkflowDefaultVersionHelper.EnsureDefaultStateMachineVersionAsync(
                workflowContext,
                OpportunityWorkflow.EntityName,
                OpportunityWorkflow.WorkflowScopeEntityName,
                scopeEntityId: null,
                logger);

            await HardDeletePartnershipLeadWorkflowRolesAsync(workflowContext, logger);

            var omRole = await appContext.EntityRoles.AsNoTracking()
                .FirstOrDefaultAsync(r =>
                    !r.IsDeleted &&
                    r.EntityType == OpportunityWorkflow.EntityName &&
                    r.Code == OpportunityManagerRoleCode);

            var doa2Role = await appContext.EntityRoles.AsNoTracking()
                .FirstOrDefaultAsync(r =>
                    !r.IsDeleted &&
                    r.EntityType == OrganizationHierarchyEntityType &&
                    r.Code == DoA2EngagementAcceptanceCode);

            var doa3Role = await appContext.EntityRoles.AsNoTracking()
                .FirstOrDefaultAsync(r =>
                    !r.IsDeleted &&
                    r.EntityType == OrganizationHierarchyEntityType &&
                    r.Code == DoA3EngagementAcceptanceCode);

            if (omRole == null)
                logger.LogWarning(
                    "EntityRole with Code {Code} not found. Skipping Opportunity Manager workflow role rows.",
                    OpportunityManagerRoleCode);

            if (doa2Role == null)
                logger.LogWarning(
                    "EntityRole with Code {Code} not found. Skipping DoA2 approver workflow role rows.",
                    DoA2EngagementAcceptanceCode);

            if (doa3Role == null)
                logger.LogWarning(
                    "EntityRole with Code {Code} not found. Skipping DoA3 delegate rows.",
                    DoA3EngagementAcceptanceCode);

            async Task<StateMachineStageChange?> FindChangeAsync(string fromStage, string toStage) =>
                await workflowContext.StateMachineStageChanges
                    .FirstOrDefaultAsync(c =>
                        !c.IsDeleted &&
                        c.EntityName == OpportunityWorkflow.EntityName &&
                        c.StateMachineVersionId == versionId &&
                        c.FromStage == fromStage &&
                        c.ToStage == toStage);

            // --- IDENTIFY & PROFILE → GO: OM trigger + DoA2 approve + DoA3 delegate ---
            var toGo = await FindChangeAsync(
                OpportunityWorkflow.Stages.IdentifyAndProfile,
                OpportunityWorkflow.Stages.Go);
            if (toGo != null && omRole != null)
                await UpsertRoleRowAsync(workflowContext, toGo, omRole.Id, omRole.Name, canTrigger: true, canApprove: false,
                    sequence: 1, $"OM — Submit for Go", logger);

            if (toGo != null && doa2Role != null)
                await UpsertDoA2WithDelegateAsync(
                    workflowContext, toGo, doa2Role, doa3Role, "Approve Go", logger);

            // --- IDENTIFY & PROFILE → NO GO: OM trigger + DoA2 approve + DoA3 delegate ---
            var toNoGo = await FindChangeAsync(
                OpportunityWorkflow.Stages.IdentifyAndProfile,
                OpportunityWorkflow.Stages.NoGo);
            if (toNoGo != null && omRole != null)
                await UpsertRoleRowAsync(workflowContext, toNoGo, omRole.Id, omRole.Name, canTrigger: true, canApprove: false,
                    sequence: 1, "OM — Submit for No Go", logger);

            if (toNoGo != null && doa2Role != null)
                await UpsertDoA2WithDelegateAsync(
                    workflowContext, toNoGo, doa2Role, doa3Role, "Approve No Go", logger);

            // --- NO GO → IDENTIFY & PROFILE: OM trigger only ---
            var reopenNoGo = await FindChangeAsync(
                OpportunityWorkflow.Stages.NoGo,
                OpportunityWorkflow.Stages.IdentifyAndProfile);
            if (reopenNoGo != null && omRole != null)
                await UpsertRoleRowAsync(workflowContext, reopenNoGo, omRole.Id, omRole.Name, canTrigger: true, canApprove: false,
                    sequence: 1, "OM — Reopen from No Go", logger);

            // --- IDENTIFY & PROFILE → CANCELLED: OM trigger only ---
            var toCancelled = await FindChangeAsync(
                OpportunityWorkflow.Stages.IdentifyAndProfile,
                OpportunityWorkflow.Stages.Cancelled);
            if (toCancelled != null && omRole != null)
                await UpsertRoleRowAsync(workflowContext, toCancelled, omRole.Id, omRole.Name, canTrigger: true, canApprove: false,
                    sequence: 1, "OM — Cancel", logger);

            // --- CANCELLED → IDENTIFY & PROFILE: OM trigger only ---
            var reopenCancelled = await FindChangeAsync(
                OpportunityWorkflow.Stages.Cancelled,
                OpportunityWorkflow.Stages.IdentifyAndProfile);
            if (reopenCancelled != null && omRole != null)
                await UpsertRoleRowAsync(workflowContext, reopenCancelled, omRole.Id, omRole.Name, canTrigger: true, canApprove: false,
                    sequence: 1, "OM — Reopen from Cancelled", logger);

            await workflowContext.SaveChangesAsync();
            logger.LogInformation("Workflow stage change role seeding completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding workflow stage change roles");
            throw;
        }
    }

    private static async Task HardDeletePartnershipLeadWorkflowRolesAsync(
        WorkflowDbContext workflowContext,
        ILogger logger)
    {
        var legacyRows = await workflowContext.StateMachineStageChangeRoles
            .Where(r =>
                r.RoleName == PartnershipLeadRoleName &&
                r.EntityType == OpportunityWorkflow.EntityName &&
                r.FromStage == OpportunityWorkflow.Stages.IdentifyAndProfile &&
                (r.ToStage == OpportunityWorkflow.Stages.Go || r.ToStage == OpportunityWorkflow.Stages.NoGo))
            .ToListAsync();

        if (legacyRows.Count == 0)
            return;

        var legacyIds = legacyRows.Select(r => r.Id).ToList();

        var requiredSteps = await workflowContext.WorkflowLogRequiredSteps
            .Where(s => legacyIds.Contains(s.StateMachineStageChangeRoleId))
            .ToListAsync();

        if (requiredSteps.Count > 0)
        {
            workflowContext.WorkflowLogRequiredSteps.RemoveRange(requiredSteps);
            logger.LogInformation(
                "Removed {Count} WorkflowLogRequiredSteps row(s) referencing Partnership Lead stage-change roles.",
                requiredSteps.Count);
        }

        foreach (var row in legacyRows)
        {
            logger.LogInformation(
                "Removing Partnership Lead workflow role row id {Id} for transition {From} → {To}",
                row.Id, row.FromStage, row.ToStage);
        }

        workflowContext.StateMachineStageChangeRoles.RemoveRange(legacyRows);
    }

    private static async Task UpsertRoleRowAsync(
        WorkflowDbContext workflowContext,
        StateMachineStageChange change,
        int roleId,
        string roleName,
        bool canTrigger,
        bool canApprove,
        int sequence,
        string rowDisplayName,
        ILogger logger)
    {
        var existing = await workflowContext.StateMachineStageChangeRoles
            .FirstOrDefaultAsync(r =>
                r.StateMachineStageChangeId == change.Id &&
                r.RoleId == roleId &&
                r.Sequence == sequence);

        if (existing == null)
        {
            workflowContext.StateMachineStageChangeRoles.Add(new StateMachineStageChangeRole
            {
                StateMachineStageChangeId = change.Id,
                EntityType = OpportunityWorkflow.EntityName,
                FromStage = change.FromStage,
                ToStage = change.ToStage,
                RoleId = roleId,
                RoleName = roleName,
                Sequence = sequence,
                CanTrigger = canTrigger,
                CanApprove = canApprove,
                Name = rowDisplayName,
                Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active
            });
            logger.LogInformation(
                "Creating workflow role: {Name} on {From} → {To}",
                rowDisplayName, change.FromStage, change.ToStage);
            return;
        }

        var needsUpdate = false;
        if (existing.IsDeleted)
        {
            existing.IsDeleted = false;
            existing.DeletedBy = 0;
            existing.DeletedDate = null;
            existing.Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active;
            needsUpdate = true;
        }

        if (existing.CanTrigger != canTrigger ||
            existing.CanApprove != canApprove ||
            existing.RoleName != roleName ||
            existing.Name != rowDisplayName ||
            existing.EntityType != OpportunityWorkflow.EntityName ||
            existing.FromStage != change.FromStage ||
            existing.ToStage != change.ToStage)
        {
            existing.CanTrigger = canTrigger;
            existing.CanApprove = canApprove;
            existing.RoleName = roleName;
            existing.Name = rowDisplayName;
            existing.EntityType = OpportunityWorkflow.EntityName;
            existing.FromStage = change.FromStage;
            existing.ToStage = change.ToStage;
            needsUpdate = true;
        }

        if (needsUpdate)
        {
            logger.LogInformation(
                "Updating workflow role id {Id} on {From} → {To}",
                existing.Id, change.FromStage, change.ToStage);
        }
    }

    private static async Task UpsertDoA2WithDelegateAsync(
        WorkflowDbContext workflowContext,
        StateMachineStageChange change,
        UNOPS.PAO.Domain.Entities.EntityRole doa2Role,
        UNOPS.PAO.Domain.Entities.EntityRole? doa3Role,
        string transitionLabel,
        ILogger logger)
    {
        const int approveSequence = 1;

        var existing = await workflowContext.StateMachineStageChangeRoles
            .Include(r => r.Delegates)
            .FirstOrDefaultAsync(r =>
                r.StateMachineStageChangeId == change.Id &&
                r.RoleId == doa2Role.Id &&
                r.Sequence == approveSequence);

        if (existing == null)
        {
            var row = new StateMachineStageChangeRole
            {
                StateMachineStageChangeId = change.Id,
                EntityType = OpportunityWorkflow.EntityName,
                FromStage = change.FromStage,
                ToStage = change.ToStage,
                RoleId = doa2Role.Id,
                RoleName = doa2Role.Name,
                Sequence = approveSequence,
                CanTrigger = false,
                CanApprove = true,
                Name = $"DoA2 — {transitionLabel}",
                Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active
            };

            if (doa3Role != null)
            {
                row.Delegates.Add(new SMStageChangeRoleDelegate
                {
                    RoleId = doa3Role.Id,
                    RoleName = doa3Role.Name,
                    Name = $"DoA3 delegate — {transitionLabel}",
                    Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active
                });
            }

            workflowContext.StateMachineStageChangeRoles.Add(row);
            logger.LogInformation(
                "Creating DoA2 approver role on {From} → {To} with delegate: {HasDelegate}",
                change.FromStage, change.ToStage, doa3Role != null);
            return;
        }

        if (existing.IsDeleted)
        {
            existing.IsDeleted = false;
            existing.DeletedBy = 0;
            existing.DeletedDate = null;
            existing.Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active;
        }

        existing.CanTrigger = false;
        existing.CanApprove = true;
        existing.RoleName = doa2Role.Name;
        existing.Name = $"DoA2 — {transitionLabel}";
        existing.EntityType = OpportunityWorkflow.EntityName;
        existing.FromStage = change.FromStage;
        existing.ToStage = change.ToStage;

        if (doa3Role != null)
        {
            var del = existing.Delegates.FirstOrDefault(d => !d.IsDeleted && d.RoleId == doa3Role.Id);
            if (del == null)
            {
                existing.Delegates.Add(new SMStageChangeRoleDelegate
                {
                    RoleId = doa3Role.Id,
                    RoleName = doa3Role.Name,
                    Name = $"DoA3 delegate — {transitionLabel}",
                    Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active
                });
                logger.LogInformation("Added DoA3 delegate to DoA2 role id {Id}", existing.Id);
            }
            else if (del.IsDeleted)
            {
                del.IsDeleted = false;
                del.Status = UNOPS.Workflow.Domain.Enums.EntityStatus.Active;
                del.RoleName = doa3Role.Name;
                del.Name = $"DoA3 delegate — {transitionLabel}";
            }
        }

        logger.LogInformation("Updated DoA2 approver role id {Id} on {From} → {To}", existing.Id, change.FromStage, change.ToStage);
    }
}
