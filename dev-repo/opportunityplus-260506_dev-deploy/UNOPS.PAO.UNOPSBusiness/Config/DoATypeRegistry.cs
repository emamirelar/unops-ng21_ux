using System;

namespace UNOPS.PAO.UNOPSBusiness.Config;

/// <summary>
/// Registry of all DoA (Delegation of Authority) types for gap display.
/// Used to show all (DoAType, Level) combinations even when no holder is assigned.
/// </summary>
public static class DoATypeRegistry
{
    /// <summary>
    /// DoA types shown in the office &quot;Delegation of Authority Holders&quot; matrix (gap display).
    /// HSSE is excluded: HSSE is covered by operational roles (coordinator / regional specialist), not DoA slots here.
    /// </summary>
    public static readonly IReadOnlyList<string> DoATypes = new[]
    {
        "Engagement Acceptance",
        "Finance",
        "HR",
        "Procurement",
        "Procurement - ICA"
    };

    /// <summary>
    /// DoA levels (1–4).
    /// </summary>
    public static readonly IReadOnlyList<string> DoALevels = new[] { "DoA1", "DoA2", "DoA3", "DoA4" };

    /// <summary>
    /// Returns the full matrix of (DoAType, Level) combinations for gap display.
    /// Each combination represents a slot that may or may not have an assigned holder.
    /// </summary>
    /// <returns>List of (DoAType, Level) tuples.</returns>
    public static IReadOnlyList<(string DoAType, string Level)> GetDoATypeLevelMatrix()
    {
        var matrix = new List<(string, string)>();
        foreach (var doAType in DoATypes)
        {
            foreach (var level in DoALevels)
            {
                matrix.Add((doAType, level));
            }
        }
        return matrix;
    }

    /// <summary>
    /// Maps DoAType display name to the segment used in EntityRole <c>Code</c> values (e.g. <c>DoA2_{suffix}</c>).
    /// Must match seeded codes: <c>Engagement Acceptance</c> → <c>Engagement_Acceptance</c>;
    /// <c>Procurement - ICA</c> → <c>Procurement_ICA</c> (not <c>Procurement_-_ICA</c>).
    /// </summary>
    public static string GetEntityRoleSuffix(string doAType)
    {
        if (string.IsNullOrEmpty(doAType))
            return doAType;

        // Hyphenated qualifiers like "Procurement - ICA" use a single underscore in role codes (DoA2_Procurement_ICA).
        return doAType
            .Replace(" - ", "_", StringComparison.Ordinal)
            .Replace(" ", "_", StringComparison.Ordinal);
    }

    /// <summary>
    /// Builds EntityRole code for a DoA type and level (e.g. <c>DoA2_Procurement_ICA</c>).
    /// </summary>
    public static string GetEntityRoleCode(string doAType, string level)
    {
        var suffix = GetEntityRoleSuffix(doAType);
        //return $"{level}_{suffix}_OrganizationHierarchy";
        return $"{level}_{suffix}";
    }
}
