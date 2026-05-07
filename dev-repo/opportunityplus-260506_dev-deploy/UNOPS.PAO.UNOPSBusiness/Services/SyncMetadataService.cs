using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSDataAccess.Context;
using UNOPS.PAO.UNOPSDataAccess.External;

namespace UNOPS.PAO.UNOPSBusiness.Services;

/// <summary>
/// Retrieves last successful sync timestamps from external.SyncExecutionLogs.
/// Status = 2 is SyncStatus.Completed (successful).
/// Uses <see cref="SyncMonitoringDbContext"/> when registered (separate EDS monitoring database); otherwise <see cref="UNOPSAppDbContext"/>.
/// </summary>
public class SyncMetadataService : ISyncMetadataService
{
    private const int SyncStatusCompleted = 2;

    private readonly UNOPSAppDbContext _appContext;
    private readonly SyncMonitoringDbContext? _monitoringContext;

    public SyncMetadataService(UNOPSAppDbContext appContext, SyncMonitoringDbContext? monitoringContext = null)
    {
        _appContext = appContext;
        _monitoringContext = monitoringContext;
    }

    /// <inheritdoc />
    public async Task<DateTime?> GetLastSyncedAtAsync(string configurationName, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(configurationName))
            return null;

        var query = BuildCompletedSyncQuery(configurationName);

        var lastSynced = await query
            .OrderByDescending(e => e.LastUpdatedAt ?? e.EndTime)
            .Select(e => e.LastUpdatedAt ?? e.EndTime)
            .FirstOrDefaultAsync(cancellationToken);

        return lastSynced;
    }

    private IQueryable<SyncExecutionLogEntry> BuildCompletedSyncQuery(string configurationName)
    {
        if (_monitoringContext != null)
        {
            return _monitoringContext.SyncExecutionLogs
                .AsNoTracking()
                .Where(e => e.ConfigurationName == configurationName && e.Status == SyncStatusCompleted);
        }

        return _appContext.SyncExecutionLogs
            .AsNoTracking()
            .Where(e => e.ConfigurationName == configurationName && e.Status == SyncStatusCompleted);
    }
}
