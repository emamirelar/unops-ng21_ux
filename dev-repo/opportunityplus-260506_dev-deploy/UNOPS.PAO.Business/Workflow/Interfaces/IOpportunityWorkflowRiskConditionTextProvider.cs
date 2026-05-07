namespace UNOPS.PAO.Business.Workflow.Interfaces;

/// <summary>
/// Supplies aggregated risk text for <see cref="OpportunityWorkflowConditionFieldKeys.RisksConditionText"/> when evaluating workflow conditions.
/// Implemented in the UNOPS host with access to the risk register; default implementation returns no text.
/// </summary>
public interface IOpportunityWorkflowRiskConditionTextProvider
{
    /// <summary>
    /// Returns a single string containing titles, descriptions, categories, impact labels, and related risk metadata for substring matching.
    /// </summary>
    Task<string?> GetAggregateSearchTextAsync(int opportunityId, CancellationToken cancellationToken = default);
}
