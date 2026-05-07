namespace UNOPS.PAO.UNOPSBusiness.Interfaces;

/// <summary>
/// Server-side registry of fields that may be referenced by workflow conditions for a
/// specific entity type. Implementations are entity-agnostic from the consumer's
/// perspective (admin manager, controller). New workflow subjects (e.g. Project)
/// can be added by registering a new <see cref="IWorkflowConditionFieldCatalog"/>.
/// </summary>
public interface IWorkflowConditionFieldCatalog
{
    /// <summary>
    /// Workflow subject this catalog covers. Matches <c>StateMachineVersion.EntityType</c>.
    /// </summary>
    string EntityName { get; }

    /// <summary>
    /// All fields the entity type exposes to the workflow editor before any admin filtering.
    /// The result is the universe from which admins pick. Operators come from this catalog
    /// (not configurable by the admin).
    /// </summary>
    IReadOnlyList<WorkflowConditionFieldDescriptor> GetAvailableFields();
}

/// <summary>
/// Description of a single field eligible for use in workflow conditions.
/// </summary>
public sealed record WorkflowConditionFieldDescriptor(
    string FieldKey,
    string DefaultDisplayName,
    string FieldType,
    IReadOnlyList<string> AllowedOperators,
    bool IsNavigationProperty,
    string? NavigationEntity = null,
    IReadOnlyList<WorkflowConditionFieldDropdownOption>? DropdownOptions = null);

public sealed record WorkflowConditionFieldDropdownOption(string Value, string Label);
