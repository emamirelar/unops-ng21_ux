using UNOPS.PAO.Domain.Entities;

namespace UNOPS.PAO.Business.Utilities;

/// <summary>
/// Builds &quot;Works at&quot; display text aligned with EDS / People Search: <c>Code, Name-or-Description</c>
/// (e.g. <c>B0058, MP, GSSC, Shared Services Centre</c>).
/// </summary>
public static class OrgUnitWorksAtDisplayFormatter
{
    /// <summary>First segment of profile org unit (B-code) when the value is comma-separated.</summary>
    public static string? GetPrimaryOrgUnitCode(string? profileOrgUnit)
    {
        if (string.IsNullOrWhiteSpace(profileOrgUnit))
            return null;
        var first = profileOrgUnit.Split(',')[0].Trim();
        return string.IsNullOrEmpty(first) ? null : first;
    }

    public static string BuildDisplay(OrganizationHierarchy oh)
    {
        var code = oh.Code?.Trim() ?? string.Empty;
        var name = oh.Name?.Trim();
        var desc = oh.Description?.Trim();
        var tail = !string.IsNullOrEmpty(name) ? name : desc;
        if (string.IsNullOrEmpty(tail))
            return code;
        if (string.IsNullOrEmpty(code))
            return tail;

        // Name/description often already starts with the B-code (e.g. "B0009 MP, ITG, IT Group"); avoid "B0009, B0009 MP, ...".
        var tailNormalized = StripRedundantLeadingOrgUnitCode(tail, code);
        if (string.IsNullOrEmpty(tailNormalized))
            return code;
        return $"{code}, {tailNormalized}";
    }

    private static string StripRedundantLeadingOrgUnitCode(string tail, string code)
    {
        if (string.IsNullOrEmpty(tail) || string.IsNullOrEmpty(code))
            return tail;
        if (!tail.StartsWith(code, StringComparison.OrdinalIgnoreCase))
            return tail;
        if (tail.Length <= code.Length)
            return string.Empty;
        var boundary = tail[code.Length];
        if (boundary is not (' ' or ','))
            return tail;
        return tail[code.Length..].TrimStart(' ', ',');
    }

    /// <summary>Prefer hierarchy row when found; otherwise keep raw profile text.</summary>
    public static string ResolveDisplay(string? profileOrgUnit, OrganizationHierarchy? oh)
    {
        if (oh != null)
            return BuildDisplay(oh);
        return profileOrgUnit?.Trim() ?? string.Empty;
    }
}
