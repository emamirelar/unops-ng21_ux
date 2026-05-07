namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Resolved workflow version for a workflow subject at an office scope (runtime resolution rules).
/// </summary>
public sealed class OfficeWorkflowApplicableVersionResponse
{
    public required string EntityType { get; init; }

    public int? ApplicableStateMachineVersionId { get; init; }
}
