namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Full office detail including key info, hierarchy, roles, and DoA holders.
/// </summary>
public class OfficeDetailModel
{
    public int Id { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public int? OrganizationHierarchyId { get; set; }
    public OfficeKeyInformationModel? KeyInformation { get; set; }
    public OfficeFinancialInformationModel? FinancialInformation { get; set; }
    public OfficeScopeModel? Scope { get; set; }
    public List<OfficePhysicalDetailsModel> PhysicalLocations { get; set; } = new();
    public List<OfficeOperationalRoleModel> OperationalRoles { get; set; } = new();

    /// <summary>Recent in-app changes to operational role assignments (AC5).</summary>
    public List<OfficeOperationalRoleAuditEntryModel> OperationalRoleAuditTrail { get; set; } = new();

    public List<OfficeDoAHolderModel> DoAHolders { get; set; } = new();
    public List<OfficeHierarchyNodeModel> ParentChain { get; set; } = new();
    public List<OfficeTreeNodeModel> Children { get; set; } = new();

    /// <summary>
    /// All descendant offices in the office tree (transitive children via <c>ParentOrganizationHierarchyId</c>),
    /// excluding this office — used for workflow regional impact messaging.
    /// </summary>
    public int WorkflowConfigurationImpactedDescendantOfficeCount { get; set; }

    /// <summary>Regional Director name (holder of Regional_Director_OrganizationHierarchy role).</summary>
    public string? RegionalDirector { get; set; }
    public OfficePermissionsModel? Permissions { get; set; }
    /// <summary>When each section was last synced from external source (SyncExecutionLogs).</summary>
    public OfficeSyncMetadataModel? SyncMetadata { get; set; }
}

/// <summary>
/// Sync metadata: when each section was last synced from external source.
/// </summary>
public class OfficeSyncMetadataModel
{
    /// <summary>Last synced date for Financial Information (offices config).</summary>
    public DateTime? FinancialLastSyncedAt { get; set; }

    /// <summary>Last synced date for Operational Roles (entity-user-roles-mgmt config).</summary>
    public DateTime? OperationalRolesLastSyncedAt { get; set; }

    /// <summary>Last synced date for DoA Holders (entity-user-roles-doa config).</summary>
    public DateTime? DoAHoldersLastSyncedAt { get; set; }

    /// <summary>Last synced date for geographic data (locations config: implementation + scope countries).</summary>
    public DateTime? LocationsLastSyncedAt { get; set; }
}
