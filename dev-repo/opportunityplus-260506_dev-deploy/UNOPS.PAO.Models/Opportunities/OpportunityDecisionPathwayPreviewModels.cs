namespace UNOPS.PAO.Models.Opportunities;

/// <summary>
/// Request: resolve Submit-for-Go approval pathway for a responsible org unit (office scope).
/// </summary>
public sealed class OpportunityDecisionPathwayPreviewRequest
{
    /// <summary>Required: organization hierarchy / office id for workflow scope and role holders.</summary>
    public int ResponsibleOrgUnitId { get; set; }

    /// <summary>When set, field values for condition evaluation are loaded from this saved opportunity (edit flow).</summary>
    public int? OpportunityId { get; set; }

    /// <summary>
    /// When <see cref="OpportunityId"/> is null (create flow), string field values by workflow condition key.
    /// Merged over defaults; keys match opportunity search / workflow condition catalog (e.g. proposedInitiativeTypeId).
    /// </summary>
    public Dictionary<string, string>? DraftFieldValues { get; set; }
}

/// <summary>Response for decision pathway preview UI.</summary>
public sealed class OpportunityDecisionPathwayPreviewResponse
{
    /// <summary>False when no applicable version, missing transition, or no qualifying approver rows.</summary>
    public bool HasPathway { get; set; }

    /// <summary>When <see cref="HasPathway"/> is false, stable key for client translation (e.g. opportunity.decisionPathway.none).</summary>
    public string? WarningMessageKey { get; set; }

    public IReadOnlyList<OpportunityDecisionPathwayStepModel> Steps { get; set; } = Array.Empty<OpportunityDecisionPathwayStepModel>();

    /// <summary>
    /// Approving workflow roles whose configured conditions did not match this opportunity at preview time
    /// (e.g. an optional DoA3 step that the office wired to a budget threshold not crossed by this opportunity).
    /// Surfaced so the UI can list them under "Not required for this opportunity" without exposing per-condition rationale.
    /// Empty when no conditional roles were filtered out.
    /// </summary>
    public IReadOnlyList<OpportunityDecisionPathwayStepModel> SkippedSteps { get; set; } = Array.Empty<OpportunityDecisionPathwayStepModel>();
}

/// <summary>One approval card (one workflow role row after condition filtering), ordered by sequence then declaration order.</summary>
public sealed class OpportunityDecisionPathwayStepModel
{
    public int Sequence { get; set; }

    public int WorkflowRoleId { get; set; }

    public string WorkflowRoleName { get; set; } = string.Empty;

    /// <summary>Entity role code when resolved from catalog (for translations).</summary>
    public string? EntityRoleCode { get; set; }

    public IReadOnlyList<OpportunityDecisionPathwayPersonModel> People { get; set; } = Array.Empty<OpportunityDecisionPathwayPersonModel>();

    public bool UsedDelegateFallback { get; set; }

    /// <summary>True when the workflow role has at least one configured condition (i.e. it could be skipped on a different opportunity).</summary>
    public bool IsConditional { get; set; }
}

public sealed class OpportunityDecisionPathwayPersonModel
{
    public int UserId { get; set; }

    public string? DisplayName { get; set; }

    public string? Position { get; set; }

    public string? OfficerInChargeResourceId { get; set; }

    public string? OfficerInChargeDisplayName { get; set; }
}
