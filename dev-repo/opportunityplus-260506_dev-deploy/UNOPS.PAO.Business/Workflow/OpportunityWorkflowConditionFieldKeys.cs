namespace UNOPS.PAO.Business.Workflow;

/// <summary>
/// Field keys for opportunity workflow step conditions (aligned with search-fields API and stored graph conditions).
/// </summary>
public static class OpportunityWorkflowConditionFieldKeys
{
    /// <summary>
    /// Aggregated searchable text from all risks on the opportunity (for substring / contains matching).
    /// </summary>
    public const string RisksConditionText = "risks.conditionText";

    /// <summary>
    /// Distinct <see cref="Domain.Entities.Output.ServiceLine"/> values from deliverables' outputs (comma-separated).
    /// </summary>
    public const string DeliverablesServiceLine = "deliverables.serviceLine";
}
