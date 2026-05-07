using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using UNOPS.PAO.Business.Workflow;
using UNOPS.Workflow.DataAccess;
using UNOPS.Workflow.Domain.Entities;
using UNOPS.Workflow.Domain.Enums;

namespace UNOPS.PAO.Business.Workflow.Seeders;

/// <summary>
/// Seeds <see cref="StateMachineStage"/> rows for the Opportunity default workflow version.
/// </summary>
public static class StateMachineStageSeeder
{
    /// <summary>
    /// Seeds stage definitions for Opportunity (idempotent). Run before stage changes and role seeders.
    /// </summary>
    public static async Task SeedStateMachineStagesAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var workflowContext = scope.ServiceProvider.GetRequiredService<WorkflowDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<WorkflowDbContext>>();

        try
        {
            var versionId = await WorkflowDefaultVersionHelper.EnsureDefaultStateMachineVersionAsync(
                workflowContext,
                OpportunityWorkflow.EntityName,
                OpportunityWorkflow.WorkflowScopeEntityName,
                scopeEntityId: null,
                logger);

            var sm = OpportunityWorkflow.StateMachine;

            foreach (var state in sm.States)
            {
                var stageCode = state.StageCode ?? string.Empty;
                var existing = await workflowContext.StateMachineStages
                    .FirstOrDefaultAsync(s =>
                        s.StateMachineVersionId == versionId &&
                        s.StageCode == stageCode);

                if (existing == null)
                {
                    workflowContext.StateMachineStages.Add(new StateMachineStage
                    {
                        StateMachineVersionId = versionId,
                        EntityType = OpportunityWorkflow.EntityName,
                        StageCode = stageCode,
                        DisplayName = state.DisplayName,
                        Sequence = state.Sequence,
                        Facing = (int)state.Facing,
                        Name = !string.IsNullOrWhiteSpace(state.DisplayName) ? state.DisplayName! : stageCode,
                        Status = EntityStatus.Active
                    });

                    logger.LogInformation(
                        "Creating workflow stage: {EntityType} {StageCode} (version {VersionId})",
                        OpportunityWorkflow.EntityName,
                        stageCode,
                        versionId);
                }
                else
                {
                    var needsUpdate = false;

                    if (existing.IsDeleted)
                    {
                        existing.IsDeleted = false;
                        existing.DeletedBy = 0;
                        existing.DeletedDate = null;
                        existing.Status = EntityStatus.Active;
                        needsUpdate = true;
                    }

                    if (existing.Sequence != state.Sequence ||
                        existing.DisplayName != state.DisplayName ||
                        existing.Facing != (int)state.Facing ||
                        existing.Name != (!string.IsNullOrWhiteSpace(state.DisplayName) ? state.DisplayName! : stageCode))
                    {
                        existing.Sequence = state.Sequence;
                        existing.DisplayName = state.DisplayName;
                        existing.Facing = (int)state.Facing;
                        existing.Name = !string.IsNullOrWhiteSpace(state.DisplayName) ? state.DisplayName! : stageCode;
                        existing.Status = EntityStatus.Active;
                        needsUpdate = true;
                    }

                    if (needsUpdate)
                    {
                        logger.LogInformation(
                            "Updated workflow stage: {EntityType} {StageCode} (version {VersionId})",
                            OpportunityWorkflow.EntityName,
                            stageCode,
                            versionId);
                    }
                }
            }

            await workflowContext.SaveChangesAsync();
            logger.LogInformation("Workflow stage seeding completed successfully");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error seeding workflow stages");
            throw;
        }
    }
}
