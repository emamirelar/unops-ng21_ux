using UNOPS.Workflow.Models.WorkflowVersionAdmin;

namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Body for saving a workflow graph at an office scope. <see cref="ScopeEntityName"/> and
/// <see cref="ScopeEntityId"/> are applied server-side from the route; do not rely on client-supplied scope.
/// </summary>
public sealed class OfficeWorkflowVersionSaveRequest
{
    public required string EntityType { get; init; }

    public int SourceVersionId { get; init; }

    public DateTime? EffectiveFromUtc { get; init; }

    /// <summary>
    /// When true, the workflow library activates at <c>UtcNow</c> and ends every other active/upcoming row for this office scope.
    /// </summary>
    public bool ActivateImmediately { get; init; }

    public string? VersionDisplayName { get; init; }

    public required WorkflowVersionGraphDto Graph { get; init; }
}
