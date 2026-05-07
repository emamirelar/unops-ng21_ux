using System.Security.Claims;
using UNOPS.PAO.Models.EntityConfiguration;

namespace UNOPS.PAO.UNOPSBusiness.Interfaces;

/// <summary>
/// Administration of the workflow condition "Field" dropdown allow-list.
/// Coordinates the catalog (universe of fields), the persisted admin selection,
/// and the workflow usage query that determines which rows are locked.
/// </summary>
public interface IWorkflowConditionFieldAdminManager
{
    /// <summary>
    /// Workflow subjects supported by the host (e.g. <c>Opportunity</c>). One per registered
    /// <see cref="IWorkflowConditionFieldCatalog"/>.
    /// </summary>
    IReadOnlyList<string> GetSupportedEntities();

    /// <summary>
    /// Returns the merged catalog + admin selection + lock state for an entity.
    /// </summary>
    Task<IReadOnlyList<WorkflowConditionFieldDto>> GetFieldsAsync(
        ClaimsPrincipal user,
        string entityName,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Returns the (version, scope) tuples for a single field in <paramref name="entityName"/>,
    /// resolved with display names. Powers the "Show details" popover behind the lock summary.
    /// </summary>
    Task<IReadOnlyList<WorkflowConditionFieldUsageDto>> GetFieldUsagesAsync(
        ClaimsPrincipal user,
        string entityName,
        string fieldKey,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Replaces the stored allow-list for <paramref name="request.EntityName"/> in a single
    /// transaction. Throws when the request would deselect a field referenced by any workflow
    /// version (defense-in-depth; the UI also disables the checkbox in that case).
    /// </summary>
    Task<IReadOnlyList<WorkflowConditionFieldDto>> SaveFieldsAsync(
        ClaimsPrincipal user,
        SaveWorkflowConditionFieldsRequest request,
        CancellationToken cancellationToken = default);
}
