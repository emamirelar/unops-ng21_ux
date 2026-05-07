namespace UNOPS.PAO.UNOPSBusiness.Interfaces;

/// <summary>
/// Service to retrieve last successful sync timestamps from external.SyncExecutionLogs.
/// Used to display "Last synced" information for Financial, Operational Roles, and DoA Holders.
/// </summary>
public interface ISyncMetadataService
{
    /// <summary>
    /// Gets the last successful sync timestamp for a configuration.
    /// Queries external."SyncExecutionLogs" where ConfigurationName = configName and Status = 2 (Completed).
    /// </summary>
    /// <param name="configurationName">Configuration name (e.g. "offices", "entity-user-roles-mgmt", "entity-user-roles-doa").</param>
    /// <param name="cancellationToken">Cancellation token.</param>
    /// <returns>LastUpdatedAt of the most recent successful sync, or null if none found.</returns>
    Task<DateTime?> GetLastSyncedAtAsync(string configurationName, CancellationToken cancellationToken = default);
}
