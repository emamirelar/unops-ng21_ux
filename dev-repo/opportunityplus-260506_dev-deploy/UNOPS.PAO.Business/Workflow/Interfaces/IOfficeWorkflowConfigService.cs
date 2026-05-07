using UNOPS.PAO.Models.Offices;
using UNOPS.Workflow.Models.WorkflowVersionAdmin;

namespace UNOPS.PAO.Business.Workflow.Interfaces;

/// <summary>
/// Office-scoped workflow version admin: list subjects, resolve applicable version, load graph, save.
/// </summary>
public interface IOfficeWorkflowConfigService
{
    /// <summary>
    /// Distinct workflow subject (<c>EntityType</c>) values with at least one version row for this office instance scope.
    /// </summary>
    Task<IReadOnlyList<string>> ListEntityTypesForOfficeScopeAsync(int officeId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<WorkflowVersionSummaryDto>> ListVersionsForOfficeScopeAsync(
        int officeId,
        string entityType,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// All configured entity types with version rows (including defaults), applicable id, and UI context for this office.
    /// </summary>
    Task<IReadOnlyList<OfficeWorkflowEntityTypeOverviewDto>> GetWorkflowConfigurationOverviewAsync(
        OfficeDetailModel office,
        CancellationToken cancellationToken = default);

    Task<OfficeWorkflowApplicableVersionResponse> GetApplicableVersionAsync(
        int officeId,
        string entityType,
        CancellationToken cancellationToken = default);

    /// <summary>
    /// Loads graph when the version is visible for this office (instance, scope default, global default, or ancestor instance).
    /// </summary>
    Task<WorkflowVersionGraphDto?> GetGraphForOfficeScopeAsync(
        OfficeDetailModel office,
        string entityType,
        int stateMachineVersionId,
        CancellationToken cancellationToken = default);

    Task<WorkflowVersionSaveResult> SaveForOfficeScopeAsync(
        int officeId,
        OfficeWorkflowVersionSaveRequest request,
        CancellationToken cancellationToken = default);
}
