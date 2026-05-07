using System.ComponentModel.DataAnnotations;

namespace UNOPS.PAO.Models.EntityConfiguration;

/// <summary>
/// Single row returned by <c>GET /entity-configuration/{entity}/workflow-condition-fields</c>.
/// Combines static catalog data with the persisted admin selection and lock state.
/// </summary>
public class WorkflowConditionFieldDto
{
    /// <summary>Stable field key (e.g. <c>risks.conditionText</c>).</summary>
    public string FieldKey { get; set; } = string.Empty;

    /// <summary>Catalog default display name (translation key).</summary>
    public string DefaultDisplayName { get; set; } = string.Empty;

    /// <summary>Effective display name = <see cref="LabelOverride"/> when set, else <see cref="DefaultDisplayName"/>.</summary>
    public string EffectiveDisplayName { get; set; } = string.Empty;

    /// <summary>Optional admin label override (workflow dropdown only).</summary>
    public string? LabelOverride { get; set; }

    /// <summary>Field data type (text/number/date/boolean/enum/partner/user).</summary>
    public string FieldType { get; set; } = "text";

    /// <summary>Whether the catalog declares this as a navigation property.</summary>
    public bool IsNavigationProperty { get; set; }

    /// <summary>Allowed comparison operators (translation keys).</summary>
    public List<string> AllowedOperators { get; set; } = new();

    /// <summary>Whether the field currently appears in the workflow condition dropdown.</summary>
    public bool IsAllowed { get; set; }

    /// <summary>Whether the admin can flip <see cref="IsAllowed"/> off (false when in use anywhere).</summary>
    public bool IsLocked { get; set; }

    /// <summary>Display order in the workflow dropdown (ascending).</summary>
    public int DisplayOrder { get; set; }

    /// <summary>Distinct workflow versions that reference this field.</summary>
    public int InUseVersionCount { get; set; }

    /// <summary>Distinct scope instances (e.g. offices) referenced by versions that use this field.</summary>
    public int InUseOfficeCount { get; set; }

    /// <summary>Compact summary for the lock tooltip (e.g. "Used in 3 versions across 2 offices").</summary>
    public string? LockSummary { get; set; }
}

/// <summary>
/// One row in the lock "show details" popover.
/// </summary>
public class WorkflowConditionFieldUsageDto
{
    public int StateMachineVersionId { get; set; }

    /// <summary>Scope kind (e.g. <c>Office</c>); null for subject-only default versions ("no scope").</summary>
    public string? ScopeEntityName { get; set; }

    /// <summary>Scope instance id (e.g. office id); null for scope-kind defaults.</summary>
    public string? ScopeEntityId { get; set; }

    /// <summary>Resolved display name for the scope instance (e.g. office name); null when unresolved or scope-less.</summary>
    public string? ScopeDisplayName { get; set; }
}

/// <summary>
/// Save payload for the workflow condition field allow-list. Replaces all rows for
/// <see cref="EntityName"/> in a single transaction. Server validates that the request
/// does not deselect any field still referenced by a workflow version.
/// </summary>
public class SaveWorkflowConditionFieldsRequest
{
    [Required]
    [StringLength(100)]
    public string EntityName { get; set; } = string.Empty;

    public List<WorkflowConditionFieldUpsertDto> Fields { get; set; } = new();
}

public class WorkflowConditionFieldUpsertDto
{
    [Required]
    [StringLength(200)]
    public string FieldKey { get; set; } = string.Empty;

    public bool IsAllowed { get; set; } = true;

    [StringLength(200)]
    public string? LabelOverride { get; set; }

    public int DisplayOrder { get; set; } = 0;
}
