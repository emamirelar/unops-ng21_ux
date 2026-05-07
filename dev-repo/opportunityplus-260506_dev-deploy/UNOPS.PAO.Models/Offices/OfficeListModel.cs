using UNOPS.PAO.Models.Shared;

namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Office list item for list/search views.
/// </summary>
public class OfficeListModel
{
    public int Id { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public string? Alias { get; set; }
    public string? Type { get; set; }
    public int? HierarchyLevel { get; set; }
    public int? ParentId { get; set; }
    public string? ParentName { get; set; }
    public int ChildrenCount { get; set; }
    public int Status { get; set; }
    public string? RegionalDirector { get; set; }
    public string? ScopeType { get; set; }

    /// <summary>FK to OrganizationHierarchy; populated by matching Code.</summary>
    public int? OrganizationHierarchyId { get; set; }

    /// <summary>Internal system name (path from root).</summary>
    public string? InternalName { get; set; }

    /// <summary>External name for the entity/business unit.</summary>
    public string? ExternalName { get; set; }

    /// <summary>Organizational entity type (e.g. Regional Office, MCO, Project Office, Corporate).</summary>
    public string? OrganisationalEntityType { get; set; }

    /// <summary>Date from which the office was made active in the structure.</summary>
    public DateTime? EffectiveDate { get; set; }

    /// <summary>Cost centre ID (Primary identifier for the organizational unit).</summary>
    public string? CostCentreId { get; set; }

    /// <summary>Financial centre type (Cost centre, Revenue Centre, etc.).</summary>
    public string? FinancialCentreType { get; set; }

    /// <summary>Funding (JSON or comma-separated: Direct Costs, Management Expense, etc.).</summary>
    public string? Funding { get; set; }

    /// <summary>NER target (USD) for current fiscal year.</summary>
    public decimal? NerTarget { get; set; }

    /// <summary>NER target period (fiscal year).</summary>
    public string? NerTargetPeriod { get; set; }

    /// <summary>EA target (USD).</summary>
    public decimal? EaTarget { get; set; }

    /// <summary>EA target period (fiscal year).</summary>
    public string? EaTargetPeriod { get; set; }

    /// <summary>
    /// Conditional tags for display on cards (Type, Status) - consistent with Partner entity.
    /// </summary>
    public List<EntityTagModel>? Tags => CalculateConditionalTags();

    /// <summary>
    /// Calculate conditional tags based on office Type and Status for frontend display.
    /// </summary>
    public List<EntityTagModel> CalculateConditionalTags()
    {
        var tags = new List<EntityTagModel>();

        // Office Type tag (e.g. "Executive Office", "DED Office")
        if (!string.IsNullOrEmpty(Type))
        {
            tags.Add(new EntityTagModel { Tag = Type, Color = "bg-badge-info text-badge-info" });
        }

        // Office Status tag (EntityStatus: Inactive=0, Active=1, OnHold=2, Closed=3, Draft=4, Archived=5, Open=6)
        var statusDisplay = Status switch
        {
            0 => "Inactive",
            1 => "Active",
            2 => "On Hold",
            3 => "Closed",
            4 => "Draft",
            5 => "Archived",
            6 => "Open",
            _ => null
        };

        if (!string.IsNullOrEmpty(statusDisplay))
        {
            var statusColor = Status switch
            {
                1 => "bg-badge-success text-badge-success",       // Active - green
                0 => "bg-badge-secondary text-badge-secondary",  // Inactive - gray
                3 => "bg-badge-danger text-badge-danger",       // Closed - red
                5 => "bg-yellow-100 text-yellow-800",          // Archived - yellow
                2 => "bg-badge-warn text-badge-warn",           // On Hold - orange
                4 => "bg-badge-secondary text-badge-secondary", // Draft - gray
                6 => "bg-badge-info text-badge-info",           // Open - blue
                _ => "bg-badge-secondary text-badge-secondary"
            };
            tags.Add(new EntityTagModel { Tag = statusDisplay, Color = statusColor });
        }

        return tags;
    }
}
