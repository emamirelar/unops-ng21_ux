using System.Globalization;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.Workflow.Business.Interfaces;

namespace UNOPS.PAO.Business.Workflow;

/// <summary>
/// Resolves workflow version scope for Opportunity using <c>ResponsibleOrgUnitId</c> (office id),
/// matching regional <see cref="OpportunityWorkflow.WorkflowScopeEntityName"/> configuration.
/// </summary>
public sealed class PaoOpportunityWorkflowVersionScopeProvider : IWorkflowVersionScopeProvider
{
    private readonly AppDbContext _db;

    public PaoOpportunityWorkflowVersionScopeProvider(AppDbContext db)
    {
        _db = db;
    }

    /// <inheritdoc />
    public async Task<WorkflowVersionScopeContext> GetScopeForEntityAsync(
        string entityName,
        int entityId,
        CancellationToken cancellationToken = default)
    {
        if (!string.Equals(entityName, OpportunityWorkflow.EntityName, StringComparison.Ordinal))
            return new WorkflowVersionScopeContext(null, null);

        var row = await _db.Opportunities
            .AsNoTracking()
            .Where(o => o.Id == entityId)
            .Select(o => new { o.ResponsibleOrgUnitId, o.IsDeleted })
            .FirstOrDefaultAsync(cancellationToken);

        if (row is null || row.IsDeleted || !row.ResponsibleOrgUnitId.HasValue)
            return new WorkflowVersionScopeContext(null, null);

        var officeId = row.ResponsibleOrgUnitId.Value;
        var order = await OfficeWorkflowScopeResolution.BuildOrderForOfficeIdAsync(_db, officeId, cancellationToken);

        return new WorkflowVersionScopeContext(
            OpportunityWorkflow.WorkflowScopeEntityName,
            officeId.ToString(CultureInfo.InvariantCulture),
            order);
    }
}
