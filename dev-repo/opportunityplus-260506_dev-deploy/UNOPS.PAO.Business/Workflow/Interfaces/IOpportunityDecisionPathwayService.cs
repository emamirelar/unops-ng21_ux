using UNOPS.PAO.Models.Opportunities;

namespace UNOPS.PAO.Business.Workflow.Interfaces;

/// <summary>
/// Resolves the Opportunity &quot;Submit for Go&quot; approval pathway from the applicable workflow graph,
/// condition evaluation, and org-unit role holders.
/// </summary>
public interface IOpportunityDecisionPathwayService
{
    Task<OpportunityDecisionPathwayPreviewResponse> GetSubmitForGoPathwayAsync(
        OpportunityDecisionPathwayPreviewRequest request,
        CancellationToken cancellationToken = default);
}
