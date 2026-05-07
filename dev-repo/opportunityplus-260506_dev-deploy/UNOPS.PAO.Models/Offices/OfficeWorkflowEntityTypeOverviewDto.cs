using UNOPS.Workflow.Models.WorkflowVersionAdmin;

namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Workflow version rows and applicable resolution for one workflow subject (<c>EntityType</c>) on an office.
/// </summary>
public sealed class OfficeWorkflowEntityTypeOverviewDto
{
    public required string EntityType { get; init; }

    public int? ApplicableStateMachineVersionId { get; init; }

    public OfficeWorkflowApplicableContextKind ApplicableContextKind { get; init; }

    /// <summary>Optional display argument (e.g. parent office name or foreign scope id).</summary>
    public string? ApplicableContextDetail { get; init; }

    public required IReadOnlyList<WorkflowVersionSummaryDto> Versions { get; init; }

    /// <summary>
    /// Active versions with <c>EffectiveFrom</c> after &quot;now&quot; (UTC) for the same scope as <see cref="Versions"/>.
    /// </summary>
    public required IReadOnlyList<WorkflowVersionSummaryDto> UpcomingVersions { get; init; }
}
