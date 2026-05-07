using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Business.Workflow.Interfaces;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSBusiness.Workflow;

/// <summary>
/// Builds aggregated risk text from the UNOPS risk register for workflow condition evaluation.
/// </summary>
public sealed class UnopsOpportunityWorkflowRiskConditionTextProvider : IOpportunityWorkflowRiskConditionTextProvider
{
    private readonly UNOPSAppDbContext _db;

    public UnopsOpportunityWorkflowRiskConditionTextProvider(UNOPSAppDbContext db)
    {
        _db = db;
    }

    /// <inheritdoc />
    public async Task<string?> GetAggregateSearchTextAsync(int opportunityId, CancellationToken cancellationToken = default)
    {
        var risks = await _db.Risks
            .AsNoTracking()
            .Where(r => r.EntityType == "Opportunity" && r.EntityId == opportunityId && !r.IsDeleted)
            .Include(r => r.RiskCategory)
            .Include(r => r.RiskTypeEntity)
            .Include(r => r.RiskImpactLevelEntity)
            .Include(r => r.RiskResponseTypeEntity)
            .Include(r => r.PreDefinedHighRisk)
            .ToListAsync(cancellationToken);

        if (risks.Count == 0)
            return string.Empty;

        var parts = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var r in risks)
        {
            AddNonEmpty(parts, r.Title);
            AddNonEmpty(parts, r.Description);
            AddNonEmpty(parts, r.Recommendation);
            if (r.RiskCategory != null)
                AddNonEmpty(parts, r.RiskCategory.Name);
            if (r.RiskTypeEntity != null)
                AddNonEmpty(parts, r.RiskTypeEntity.Name);
            if (r.RiskImpactLevelEntity != null)
            {
                AddNonEmpty(parts, r.RiskImpactLevelEntity.Name);
                AddNonEmpty(parts, r.RiskImpactLevelEntity.DisplayLabel);
            }

            if (r.RiskResponseTypeEntity != null)
                AddNonEmpty(parts, r.RiskResponseTypeEntity.Name);

            AddNonEmpty(parts, r.Impact.ToString());
            if (r.PreDefinedHighRisk != null)
            {
                AddNonEmpty(parts, r.PreDefinedHighRisk.ShortTitle);
                AddNonEmpty(parts, r.PreDefinedHighRisk.Description);
            }
        }

        return string.Join(" | ", parts.OrderBy(x => x, StringComparer.OrdinalIgnoreCase));
    }

    private static void AddNonEmpty(HashSet<string> parts, string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return;
        parts.Add(value.Trim());
    }
}
