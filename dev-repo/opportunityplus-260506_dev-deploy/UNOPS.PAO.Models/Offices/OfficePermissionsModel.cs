namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Office permissions for UI.
/// </summary>
public class OfficePermissionsModel
{
    public bool CanView { get; set; }

    /// <summary>Upload strategy documents on Regional Office (OfficeMaster Director/Deputy).</summary>
    public bool CanUploadDocuments { get; set; }

    /// <summary>Edit scoped workflow configuration for this office (separate from document upload).</summary>
    public bool CanEditWorkflowConfiguration { get; set; }

    /// <summary>
    /// Edit operational roles (Director Manager, Deputy, HSSE Coordinator, etc.) when the user's
    /// HR "works at" org unit matches this office's organization hierarchy.
    /// </summary>
    public bool CanEditOperationalRoles { get; set; }
}
