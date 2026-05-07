using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;
using UNOPS.PAO.UNOPSDataAccess.Context;

namespace UNOPS.PAO.UNOPSDataAccess.Seed.Seeders;

/// <summary>
/// Imports country → responsible office links from the "All countries office responsible" Google Sheet.
/// Creates/updates <see cref="OfficeRelationship"/> with <c>EntityType="Country"</c> (office-based scope).
/// Does not modify <see cref="OrganizationUnitRelationship"/>.
/// Rows not present in the sheet are soft-deleted on existing country office relationships seeded by this import.
/// Source: https://docs.google.com/spreadsheets/d/16Uuw1ilo1J-I8dIbpUS0HYcbrNubukdY5XDDHBBRua0
/// Sheet: &lt;MASTER&gt; All countries office responsible (row 1 = header).
/// Uses the app's GoogleCredential from DI when available.
/// </summary>
public static class CountryOfficeResponsibleSeeder
{
    private const string DefaultSpreadsheetId = "16Uuw1ilo1J-I8dIbpUS0HYcbrNubukdY5XDDHBBRua0";
    private const string DefaultSheetName = "<MASTER> All countries office responsible";

    /// <summary>
    /// Result of Country Office Responsible import.
    /// </summary>
    public sealed record ImportResult(
        bool Success,
        int Inserted,
        int Updated,
        int Skipped,
        int MarkedInactive,
        int NotFoundCountry,
        int NotFoundOrgUnit,
        string? ErrorMessage);

    public static async Task SeedCountryOfficeResponsibleAsync(UNOPSAppDbContext context, IServiceProvider serviceProvider)
    {
        Console.WriteLine("🔄 Seeding Country Office Responsible from Google Sheets...");
        var result = await ImportCountryOfficeResponsibleAsync(context, serviceProvider);

        if (!result.Success)
        {
            Console.WriteLine($"  ⚠️  {result.ErrorMessage}");
            Console.WriteLine("  Skipping Country Office Responsible seeding.");
            return;
        }

        Console.WriteLine($"✅ Country Office Responsible seeding completed.");
        Console.WriteLine($"   📊 Statistics:");
        Console.WriteLine($"      ✅ Inserted: {result.Inserted}");
        Console.WriteLine($"      🔄 Updated: {result.Updated}");
        Console.WriteLine($"      ⏭️  Skipped (unchanged): {result.Skipped}");
        Console.WriteLine($"      ⚠️  Marked Inactive (not in sheet): {result.MarkedInactive}");
        if (result.NotFoundCountry > 0)
            Console.WriteLine($"      ⚠️  Countries not found: {result.NotFoundCountry}");
        if (result.NotFoundOrgUnit > 0)
            Console.WriteLine($"      ⚠️  Offices not found (by cost centre code): {result.NotFoundOrgUnit}");
        Console.WriteLine();
    }

    /// <summary>
    /// Imports country → responsible office links from Google Sheets into <see cref="OfficeRelationship"/>.
    /// Can be called from the seeding pipeline or from a dedicated API endpoint.
    /// </summary>
    public static async Task<ImportResult> ImportCountryOfficeResponsibleAsync(UNOPSAppDbContext context, IServiceProvider serviceProvider)
    {
        var configuration = serviceProvider?.GetService(typeof(IConfiguration)) as IConfiguration;
        var spreadsheetId = configuration?["CountryOfficeResponsible:SpreadsheetId"] ?? DefaultSpreadsheetId;
        var sheetName = configuration?["CountryOfficeResponsible:SheetName"] ?? DefaultSheetName;

        IList<IList<object>>? values;
        try
        {
            var credential = serviceProvider?.GetService(typeof(GoogleCredential)) as GoogleCredential;
            values = await FetchSheetDataAsync(spreadsheetId, sheetName, credential);
        }
        catch (Exception ex)
        {
            return new ImportResult(false, 0, 0, 0, 0, 0, 0,
                $"Failed to read Google Sheet: {ex.Message}. Ensure you have access to the sheet and credentials are configured.");
        }

        if (values == null || values.Count < 2)
            return new ImportResult(false, 0, 0, 0, 0, 0, 0, "No data rows in sheet.");

        var rows = ParseSheetValues(values);

        var countriesByIso2 = await context.Set<Country>()
            .Where(c => !c.IsDeleted)
            .ToDictionaryAsync(c => c.Iso2Code, c => c);

        var countriesByIso3 = await context.Set<Country>()
            .Where(c => !c.IsDeleted && c.Iso3Code != null)
            .ToDictionaryAsync(c => c.Iso3Code!, c => c);

        var officesByCode = await context.Set<Office>()
            .Where(o => !o.IsDeleted)
            .ToDictionaryAsync(o => o.Code, o => o);

        var existingRelationships = await context.Set<OfficeRelationship>()
            .Where(r => r.EntityType == nameof(Country) && !r.IsDeleted)
            .ToListAsync();

        var sheetKeys = new HashSet<(int OfficeId, int CountryId)>();

        int inserted = 0;
        int updated = 0;
        int skipped = 0;
        int notFoundCountry = 0;
        int notFoundOrgUnit = 0;

        foreach (var row in rows)
        {
            var iso2 = Normalize(row.Iso2);
            var iso3 = Normalize(row.Iso3);
            var costCentre = Normalize(row.CostCentre);

            if (string.IsNullOrEmpty(costCentre) || IsNa(costCentre))
                continue;

            Country? country = null;
            if (!string.IsNullOrEmpty(iso2) && !IsNa(iso2) && countriesByIso2.TryGetValue(iso2, out var c2))
                country = c2;
            else if (!string.IsNullOrEmpty(iso3) && !IsNa(iso3) && countriesByIso3.TryGetValue(iso3, out var c3))
                country = c3;

            if (country == null)
            {
                notFoundCountry++;
                continue;
            }

            if (!officesByCode.TryGetValue(costCentre, out var office))
            {
                notFoundOrgUnit++;
                continue;
            }

            var officeId = office.Id;
            var key = (officeId, country.Id);
            if (!sheetKeys.Add(key))
                continue;

            var existingRel = existingRelationships.FirstOrDefault(r =>
                r.OfficeId == officeId &&
                r.EntityId == country.Id &&
                r.EntityType == nameof(Country));

            if (existingRel == null)
            {
                var newRel = new OfficeRelationship
                {
                    Name = $"Country-{country.Id}-{costCentre}",
                    OfficeId = officeId,
                    EntityId = country.Id,
                    EntityType = nameof(Country),
                    Status = EntityStatus.Active,
                    CreatedBy = 1,
                    CreatedDate = DateTime.UtcNow,
                    LastModifiedBy = 1,
                    LastModifiedDate = DateTime.UtcNow,
                    IsDeleted = false
                };
                context.Set<OfficeRelationship>().Add(newRel);
                inserted++;
            }
            else
            {
                var expectedName = $"Country-{country.Id}-{costCentre}";
                var hasChanges = false;

                if (existingRel.Name != expectedName)
                {
                    existingRel.Name = expectedName;
                    hasChanges = true;
                }

                if (existingRel.Status != EntityStatus.Active)
                {
                    existingRel.Status = EntityStatus.Active;
                    existingRel.IsDeleted = false;
                    hasChanges = true;
                }

                if (hasChanges)
                {
                    existingRel.LastModifiedBy = 1;
                    existingRel.LastModifiedDate = DateTime.UtcNow;
                    updated++;
                }
                else
                {
                    skipped++;
                }
            }
        }

        int markedInactive = 0;
        foreach (var rel in existingRelationships)
        {
            if (!sheetKeys.Contains((rel.OfficeId, rel.EntityId)))
            {
                rel.Status = EntityStatus.Inactive;
                rel.IsDeleted = true;
                rel.LastModifiedBy = 1;
                rel.LastModifiedDate = DateTime.UtcNow;
                markedInactive++;
            }
        }

        await context.SaveChangesAsync();
        return new ImportResult(true, inserted, updated, skipped, markedInactive, notFoundCountry, notFoundOrgUnit, null);
    }

    private static async Task<IList<IList<object>>?> FetchSheetDataAsync(string spreadsheetId, string sheetName, GoogleCredential? appCredential = null)
    {
        var credential = appCredential ?? await GoogleCredential.GetApplicationDefaultAsync();
        var scopedCredential = credential.CreateScoped(SheetsService.Scope.SpreadsheetsReadonly);
        var service = new SheetsService(new BaseClientService.Initializer
        {
            HttpClientInitializer = scopedCredential,
            ApplicationName = "CountryOfficeResponsibleSeeder"
        });

        var range = $"'{sheetName}'!A1:N";
        var request = service.Spreadsheets.Values.Get(spreadsheetId, range);
        var response = await request.ExecuteAsync();
        return response.Values;
    }

    private static List<CountryOfficeRow> ParseSheetValues(IList<IList<object>> values)
    {
        var rows = new List<CountryOfficeRow>();
        var header = values[0].Select(c => c?.ToString() ?? string.Empty).ToList();

        var iso2Index = FindColumnIndex(header, "ISO2");
        var iso3Index = FindColumnIndex(header, "ISO3");
        var costCentreIndex = FindColumnIndex(header, "Cost_centre_normally_responsible");

        if (costCentreIndex < 0)
            return rows;

        var maxCol = Math.Max(costCentreIndex, Math.Max(iso2Index >= 0 ? iso2Index : 0, iso3Index >= 0 ? iso3Index : 0));

        for (var i = 1; i < values.Count; i++)
        {
            var cells = values[i].Select(c => c?.ToString() ?? string.Empty).ToList();
            if (cells.Count <= maxCol)
                continue;

            rows.Add(new CountryOfficeRow
            {
                Iso2 = iso2Index >= 0 ? GetCell(cells, iso2Index) : null,
                Iso3 = iso3Index >= 0 ? GetCell(cells, iso3Index) : null,
                CostCentre = GetCell(cells, costCentreIndex)
            });
        }

        return rows;
    }

    private static int FindColumnIndex(IReadOnlyList<string> header, string partialName)
    {
        for (var i = 0; i < header.Count; i++)
        {
            if (header[i].Contains(partialName, StringComparison.OrdinalIgnoreCase))
                return i;
        }
        return -1;
    }

    private static string GetCell(IReadOnlyList<string> cells, int index)
    {
        if (index < 0 || index >= cells.Count)
            return string.Empty;
        return cells[index] ?? string.Empty;
    }

    private static bool IsNa(string value) =>
        string.Equals(value, "#N/A", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(value, "N/A", StringComparison.OrdinalIgnoreCase);

    private static string? Normalize(string? value)
    {
        if (string.IsNullOrWhiteSpace(value) || IsNa(value))
            return null;
        return value.Trim();
    }

    private sealed class CountryOfficeRow
    {
        public string? Iso2 { get; set; }
        public string? Iso3 { get; set; }
        public string? CostCentre { get; set; }
    }
}
