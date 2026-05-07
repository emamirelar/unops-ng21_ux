using UNOPS.PAO.Business.Workflow.Interfaces;

namespace UNOPS.PAO.Business.Workflow;

/// <summary>
/// Default no-op when the host does not register a UNOPS risk register implementation.
/// </summary>
public sealed class NullOpportunityWorkflowRiskConditionTextProvider : IOpportunityWorkflowRiskConditionTextProvider
{
    public Task<string?> GetAggregateSearchTextAsync(int opportunityId, CancellationToken cancellationToken = default) =>
        Task.FromResult<string?>(null);
}
