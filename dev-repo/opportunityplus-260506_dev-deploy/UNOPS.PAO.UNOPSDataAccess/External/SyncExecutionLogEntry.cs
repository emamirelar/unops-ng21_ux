namespace UNOPS.PAO.UNOPSDataAccess.External;

/// <summary>
/// Read-only entity mapping to external."SyncExecutionLogs".
/// Used by SyncMetadataService to query last successful sync timestamps.
/// Table is created and managed by External Data Service; PAO does not create migrations for it.
/// </summary>
public sealed class SyncExecutionLogEntry
{
    public long Id { get; set; }
    public string ConfigurationName { get; set; } = string.Empty;
    public int Status { get; set; }
    public DateTime? LastUpdatedAt { get; set; }
    public DateTime? EndTime { get; set; }
}
