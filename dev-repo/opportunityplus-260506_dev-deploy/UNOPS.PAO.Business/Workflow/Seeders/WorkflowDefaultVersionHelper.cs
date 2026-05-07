using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UNOPS.Workflow.DataAccess;
using UNOPS.Workflow.Domain.Entities;
using UNOPS.Workflow.Domain.Enums;

namespace UNOPS.PAO.Business.Workflow.Seeders;

/// <summary>
/// Ensures a <see cref="StateMachineVersion"/> row exists for seed data to reference.
/// For Opportunity, aligns with the scope-kind default (<see cref="OpportunityWorkflow.WorkflowScopeEntityName"/> + null id)
/// and upgrades legacy M2 rows that used both-null scope.
/// </summary>
public static class WorkflowDefaultVersionHelper
{
    private static readonly DateTime DefaultEffectiveFromUtc =
        new(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    /// <summary>
    /// Returns the id of the default version for <paramref name="entityType"/> and scope (creates the row if missing).
    /// Pass <c>null</c> for both scope parameters for a subject-only default (both scope columns null).
    /// </summary>
    public static async Task<int> EnsureDefaultStateMachineVersionAsync(
        WorkflowDbContext workflowContext,
        string entityType,
        string? scopeEntityName,
        string? scopeEntityId,
        ILogger? logger = null,
        CancellationToken cancellationToken = default)
    {
        var nameNorm = string.IsNullOrWhiteSpace(scopeEntityName) ? null : scopeEntityName.Trim();
        var idNorm = string.IsNullOrWhiteSpace(scopeEntityId) ? null : scopeEntityId.Trim();

        if (entityType == OpportunityWorkflow.EntityName &&
            string.Equals(nameNorm, OpportunityWorkflow.WorkflowScopeEntityName, StringComparison.Ordinal) &&
            idNorm == null)
        {
            await NormalizeOpportunityLegacyDefaultVersionRowAsync(workflowContext, logger, cancellationToken);
        }

        var existing = await workflowContext.StateMachineVersions
            .Where(v =>
                !v.IsDeleted &&
                v.Status == EntityStatus.Active &&
                v.EntityType == entityType &&
                (nameNorm == null ? v.ScopeEntityName == null : v.ScopeEntityName == nameNorm) &&
                (idNorm == null ? v.ScopeEntityId == null : v.ScopeEntityId == idNorm))
            .OrderByDescending(v => v.EffectiveFrom)
            .FirstOrDefaultAsync(cancellationToken);

        if (existing != null)
            return existing.Id;

        var version = new StateMachineVersion
        {
            EntityType = entityType,
            ScopeEntityName = nameNorm,
            ScopeEntityId = idNorm,
            EffectiveFrom = DefaultEffectiveFromUtc,
            EffectiveTo = null,
            Name = entityType,
            Status = EntityStatus.Active
        };

        workflowContext.StateMachineVersions.Add(version);
        await workflowContext.SaveChangesAsync(cancellationToken);

        logger?.LogInformation(
            "Created default StateMachineVersion for {EntityType} (scope {ScopeName}/{ScopeId}) with id {Id}",
            entityType,
            nameNorm ?? "(null)",
            idNorm ?? "(null)",
            version.Id);

        return version.Id;
    }

    /// <summary>
    /// If no active Opportunity scope-kind default exists yet, sets <see cref="OpportunityWorkflow.WorkflowScopeEntityName"/>
    /// on the most recent legacy row (both scope fields null). Does nothing when an Office + null id row already exists.
    /// </summary>
    private static async Task NormalizeOpportunityLegacyDefaultVersionRowAsync(
        WorkflowDbContext workflowContext,
        ILogger? logger,
        CancellationToken cancellationToken)
    {
        var hasScopeKindDefault = await workflowContext.StateMachineVersions
            .AnyAsync(
                v =>
                    !v.IsDeleted &&
                    v.Status == EntityStatus.Active &&
                    v.EntityType == OpportunityWorkflow.EntityName &&
                    v.ScopeEntityName == OpportunityWorkflow.WorkflowScopeEntityName &&
                    v.ScopeEntityId == null,
                cancellationToken);

        if (hasScopeKindDefault)
            return;

        var legacyRows = await workflowContext.StateMachineVersions
            .Where(
                v =>
                    !v.IsDeleted &&
                    v.Status == EntityStatus.Active &&
                    v.EntityType == OpportunityWorkflow.EntityName &&
                    v.ScopeEntityName == null &&
                    v.ScopeEntityId == null)
            .OrderByDescending(v => v.EffectiveFrom)
            .ThenByDescending(v => v.Id)
            .ToListAsync(cancellationToken);

        if (legacyRows.Count == 0)
            return;

        var row = legacyRows[0];
        row.ScopeEntityName = OpportunityWorkflow.WorkflowScopeEntityName;
        await workflowContext.SaveChangesAsync(cancellationToken);

        logger?.LogInformation(
            "Set ScopeEntityName to {Scope} on Opportunity StateMachineVersion id {Id} (legacy both-null default).",
            OpportunityWorkflow.WorkflowScopeEntityName,
            row.Id);
    }
}
