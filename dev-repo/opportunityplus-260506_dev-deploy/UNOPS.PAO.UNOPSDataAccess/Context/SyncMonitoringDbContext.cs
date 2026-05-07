using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.UNOPSDataAccess.External;

namespace UNOPS.PAO.UNOPSDataAccess.Context;

/// <summary>
/// Read-only DbContext for EDS monitoring data in <c>external."SyncExecutionLogs"</c> when that data
/// lives on a separate PostgreSQL instance from <see cref="UNOPSAppDbContext"/>.
/// </summary>
public class SyncMonitoringDbContext : DbContext
{
    public SyncMonitoringDbContext(DbContextOptions<SyncMonitoringDbContext> options)
        : base(options)
    {
    }

    public DbSet<SyncExecutionLogEntry> SyncExecutionLogs { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SyncExecutionLogEntry>(entity =>
        {
            entity.ToTable("SyncExecutionLogs", "external");
            entity.HasKey(e => e.Id);
        });
    }
}
