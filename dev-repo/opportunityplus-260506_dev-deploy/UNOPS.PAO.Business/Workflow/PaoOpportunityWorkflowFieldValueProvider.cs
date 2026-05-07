using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Business.Workflow.Interfaces;
using UNOPS.PAO.DataAccess.Context;
using UNOPS.Workflow.Business.Interfaces;

namespace UNOPS.PAO.Business.Workflow;

/// <summary>
/// Supplies current Opportunity field values for workflow approval-step conditions at submit time.
/// Uses the same keys and formatting as <see cref="OpportunityWorkflowConditionFieldValues"/> (pathway preview).
/// </summary>
public sealed class PaoOpportunityWorkflowFieldValueProvider : IWorkflowFieldValueProvider
{
    private readonly AppDbContext _db;
    private readonly IOpportunityWorkflowRiskConditionTextProvider _riskConditionText;

    public PaoOpportunityWorkflowFieldValueProvider(
        AppDbContext db,
        IOpportunityWorkflowRiskConditionTextProvider riskConditionText)
    {
        _db = db;
        _riskConditionText = riskConditionText;
    }

    /// <inheritdoc />
    public async Task<IReadOnlyDictionary<string, string>> GetFieldValuesAsync(
        string entityName,
        int entityId,
        IReadOnlyCollection<string> fieldKeys,
        CancellationToken cancellationToken = default)
    {
        var empty = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

        if (fieldKeys == null || fieldKeys.Count == 0)
            return empty;

        if (!string.Equals(entityName, OpportunityWorkflow.EntityName, StringComparison.OrdinalIgnoreCase))
            return empty;

        var keys = fieldKeys
            .Where(k => !string.IsNullOrWhiteSpace(k))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToList();

        if (keys.Count == 0)
            return empty;

        var wantsRiskText = keys.Any(k => string.Equals(k, OpportunityWorkflowConditionFieldKeys.RisksConditionText, StringComparison.OrdinalIgnoreCase));
        var nonRiskKeys = wantsRiskText
            ? keys.Where(k => !string.Equals(k, OpportunityWorkflowConditionFieldKeys.RisksConditionText, StringComparison.OrdinalIgnoreCase)).ToList()
            : keys;

        // Only hydrate the opportunity (with all its includes) when at least one non-risk field key needs it.
        // AsSplitQuery() avoids the cartesian explosion that the chained collection Includes would otherwise
        // produce on opportunities with many child rows.
        if (nonRiskKeys.Count > 0)
        {
            var opp = await _db.Opportunities
                .AsNoTracking()
                .WithWorkflowConditionIncludes()
                .AsSplitQuery()
                .FirstOrDefaultAsync(o => o.Id == entityId && !o.IsDeleted, cancellationToken);

            if (opp is null)
                return empty;

            OpportunityWorkflowConditionFieldValues.AppendFieldValues(opp, nonRiskKeys, empty);
        }
        else
        {
            var exists = await _db.Opportunities
                .AsNoTracking()
                .AnyAsync(o => o.Id == entityId && !o.IsDeleted, cancellationToken);
            if (!exists)
                return empty;
        }

        if (wantsRiskText)
        {
            var riskText = await _riskConditionText.GetAggregateSearchTextAsync(entityId, cancellationToken);
            empty[OpportunityWorkflowConditionFieldKeys.RisksConditionText] = riskText ?? string.Empty;
        }

        return empty;
    }
}
