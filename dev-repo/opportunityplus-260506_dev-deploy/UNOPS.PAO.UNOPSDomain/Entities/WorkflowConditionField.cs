using System.ComponentModel.DataAnnotations;
using UNOPS.PAO.Domain.Infrastructure;

namespace UNOPS.PAO.UNOPSDomain.Entities;

/// <summary>
/// Admin-managed allow-list for fields that may appear in the workflow condition
/// "Field" dropdown (Edit Workflow Configuration screen). One row per
/// (<see cref="EntityName"/>, <see cref="FieldKey"/>) pair across the whole tenant
/// (configuration is global). Server-side enforcement uses these rows to filter
/// what the workflow editor sees and to validate save attempts.
/// </summary>
public class WorkflowConditionField : ModifiableDeletableEntity
{
    /// <summary>
    /// Workflow subject entity name (matches <c>StateMachineVersion.EntityType</c>).
    /// Examples: <c>Opportunity</c>.
    /// </summary>
    [Required]
    [StringLength(100)]
    public string EntityName { get; set; } = string.Empty;

    /// <summary>
    /// Stable key used as <c>SMStageChangeRoleCondition.FieldKey</c>. Must be a member of
    /// the server-side catalog for <see cref="EntityName"/> (e.g. <c>risks.conditionText</c>).
    /// </summary>
    [Required]
    [StringLength(200)]
    public string FieldKey { get; set; } = string.Empty;

    /// <summary>
    /// When true, the field is shown in the workflow condition dropdown. Cannot be
    /// flipped to false while the field is referenced by any workflow version's conditions.
    /// </summary>
    public bool IsAllowed { get; set; } = true;

    /// <summary>
    /// Optional admin-supplied label. When set, overrides the catalog's default display name
    /// in the workflow condition dropdown (only). All other surfaces continue to use the
    /// catalog default.
    /// </summary>
    [StringLength(200)]
    public string? LabelOverride { get; set; }

    /// <summary>
    /// Order in which the field appears in the workflow condition dropdown (ascending).
    /// Ties broken by the catalog default display name.
    /// </summary>
    public int DisplayOrder { get; set; } = 0;
}
