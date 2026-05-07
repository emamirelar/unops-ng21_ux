using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using UNOPS.PAO.UNOPSDataAccess.Context;
using UNOPS.PAO.UNOPSDomain.Entities;

namespace UNOPS.PAO.UNOPSDataAccess.Seed.Seeders;

/// <summary>
/// Initial defaults for the workflow condition field allow-list. Idempotent on the row level:
/// only inserts rows that don't already exist (so admin selections are never overwritten on
/// subsequent seed runs). Catalog discovery uses reflection to avoid an
/// <c>UNOPSDataAccess → UNOPSBusiness</c> project reference; falls back to a no-op when the
/// catalog interface or implementations cannot be resolved (e.g. test harnesses).
///
/// Defaults:
/// <list type="bullet">
///   <item><c>Opportunity</c> — only <c>risks.conditionText</c>, <c>deliverables.serviceLine</c>,
///   and <c>initiativeBudgetUSD</c> start out allowed; every other catalog field is seeded
///   with <c>IsAllowed = false</c>.</item>
///   <item>All other registered entities — every catalog field starts allowed.</item>
/// </list>
/// </summary>
public static class WorkflowConditionFieldSeeder
{
    private const string CatalogInterfaceTypeName =
        "UNOPS.PAO.UNOPSBusiness.Interfaces.IWorkflowConditionFieldCatalog, UNOPS.PAO.UNOPSBusiness";

    private const string OpportunityEntityName = "Opportunity";

    private static readonly HashSet<string> OpportunityDefaultAllowedKeys = new(StringComparer.OrdinalIgnoreCase)
    {
        "risks.conditionText",
        "deliverables.serviceLine",
        "initiativeBudgetUSD",
    };

    public static async Task SeedWorkflowConditionFieldsAsync(UNOPSAppDbContext context, IServiceProvider serviceProvider)
    {
        Console.WriteLine("🔄 Seeding WorkflowConditionFields defaults...");

        var catalogInterface = Type.GetType(CatalogInterfaceTypeName, throwOnError: false);
        if (catalogInterface is null)
        {
            Console.WriteLine("  ⚠️  IWorkflowConditionFieldCatalog interface not found. Skipping.");
            return;
        }

        var enumerableType = typeof(IEnumerable<>).MakeGenericType(catalogInterface);
        if (serviceProvider.GetService(enumerableType) is not System.Collections.IEnumerable catalogs)
        {
            Console.WriteLine("  ⚠️  No IWorkflowConditionFieldCatalog implementations registered. Skipping.");
            return;
        }

        var existing = await context.WorkflowConditionFields.AsNoTracking().ToListAsync();
        var existingByEntityKey = existing
            .GroupBy(w => w.EntityName, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                g => g.Key,
                g => g.Select(w => w.FieldKey).ToHashSet(StringComparer.OrdinalIgnoreCase),
                StringComparer.OrdinalIgnoreCase);

        var inserted = 0;
        var skipped = 0;

        foreach (var catalog in catalogs)
        {
            if (catalog is null) continue;

            var entityName = (string?)catalogInterface.GetProperty("EntityName")?.GetValue(catalog);
            if (string.IsNullOrWhiteSpace(entityName)) continue;

            var fields = catalogInterface.GetMethod("GetAvailableFields")?.Invoke(catalog, null) as System.Collections.IEnumerable;
            if (fields is null) continue;

            existingByEntityKey.TryGetValue(entityName, out var seenKeys);
            seenKeys ??= new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            var displayOrder = 0;
            foreach (var field in fields)
            {
                if (field is null) continue;

                var fieldKey = (string?)field.GetType().GetProperty("FieldKey")?.GetValue(field);
                if (string.IsNullOrWhiteSpace(fieldKey)) continue;

                displayOrder += 10;

                if (seenKeys.Contains(fieldKey))
                {
                    skipped++;
                    continue;
                }

                var isAllowed = string.Equals(entityName, OpportunityEntityName, StringComparison.OrdinalIgnoreCase)
                    ? OpportunityDefaultAllowedKeys.Contains(fieldKey)
                    : true;

                context.WorkflowConditionFields.Add(new WorkflowConditionField
                {
                    EntityName = entityName,
                    FieldKey = fieldKey,
                    IsAllowed = isAllowed,
                    DisplayOrder = displayOrder,
                    CreatedBy = 1,
                    CreatedDate = DateTime.UtcNow,
                });

                inserted++;
            }
        }

        if (inserted > 0)
        {
            await context.SaveChangesAsync();
        }

        Console.WriteLine($"✅ WorkflowConditionFields seeding completed. Inserted: {inserted}, Skipped (existed): {skipped}\n");
    }
}
