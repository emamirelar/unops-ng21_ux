using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using UNOPS.PAO.Domain.Enums;

namespace UNOPS.PAO.Domain.Entities;

/// <summary>
/// Office entity representing UNOPS P3M organizational units.
/// Data synced from EDS (Big Query Organisational_Structures).
/// Related to OrganizationHierarchy via Code (Office.Code = OrganizationHierarchy.Code).
/// </summary>
public class Office : IBaseBusinessEntity<int>
{
    // IBaseBusinessEntity requirements
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public EntityStatus Status { get; set; } = EntityStatus.Active;

    // Audit field (managed by External Data Service)
    public bool IsDeleted { get; set; }

    /// <summary>
    /// Unique code matching OrganizationHierarchy.Code (business key for link).
    /// </summary>
    [Required]
    [MaxLength(50)]
    public required string Code { get; set; }

    /// <summary>
    /// FK to OrganizationHierarchy; populated by matching Code.
    /// </summary>
    public int? OrganizationHierarchyId { get; set; }

    /// <summary>
    /// Navigation property to linked OrganizationHierarchy.
    /// </summary>
    public virtual OrganizationHierarchy? OrganizationHierarchy { get; set; }

    /// <summary>
    /// FK to the parent org unit (MASTER "Parent" cost centre code resolved via OrganizationHierarchy.Code).
    /// </summary>
    public int? ParentOrganizationHierarchyId { get; set; }

    /// <summary>
    /// Navigation to parent org unit in the hierarchy (MASTER Parent column).
    /// </summary>
    public virtual OrganizationHierarchy? ParentOrganizationHierarchy { get; set; }

    /// <summary>
    /// Who established the office (MASTER "Established by").
    /// </summary>
    [MaxLength(255)]
    public string? EstablishedBy { get; set; }

    /// <summary>
    /// Internal system name (path from root, e.g. "Region OrgUnit Description").
    /// </summary>
    [MaxLength(500)]
    public string? InternalName { get; set; }

    /// <summary>
    /// Common name or abbreviation.
    /// </summary>
    [MaxLength(255)]
    public string? Alias { get; set; }

    /// <summary>
    /// External name for the entity/business unit.
    /// </summary>
    [MaxLength(255)]
    public string? ExternalName { get; set; }

    /// <summary>
    /// Organizational entity type (e.g. Regional Office, MCO, Project Office, Corporate).
    /// </summary>
    [MaxLength(100)]
    public string? OrganisationalEntityType { get; set; }

    /// <summary>
    /// Hierarchy level (1–5).
    /// </summary>
    public int? HierarchyLevel { get; set; }

    /// <summary>
    /// Date from which the office was made active in the structure.
    /// </summary>
    public DateTime? EffectiveDate { get; set; }

    /// <summary>
    /// Cost centre ID (Primary identifier for the organizational unit).
    /// </summary>
    [MaxLength(50)]
    public string? CostCentreId { get; set; }

    /// <summary>
    /// Financial centre type (Cost centre, Revenue Centre, etc.).
    /// </summary>
    [MaxLength(100)]
    public string? FinancialCentreType { get; set; }

    /// <summary>
    /// Funding (JSON or comma-separated: Direct Costs, Management Expense, etc.).
    /// </summary>
    [MaxLength(500)]
    public string? Funding { get; set; }

    /// <summary>
    /// NER target (USD) for current fiscal year.
    /// </summary>
    public decimal? NerTarget { get; set; }

    /// <summary>
    /// NER target period (fiscal year).
    /// </summary>
    [MaxLength(20)]
    public string? NerTargetPeriod { get; set; }

    /// <summary>
    /// EA target (USD).
    /// </summary>
    public decimal? EaTarget { get; set; }

    /// <summary>
    /// EA target period (fiscal year).
    /// </summary>
    [MaxLength(20)]
    public string? EaTargetPeriod { get; set; }

    /// <summary>
    /// Scope type (Functional or Geographic).
    /// </summary>
    [MaxLength(50)]
    public string? ScopeType { get; set; }

    /// <summary>
    /// Polymorphic links from partners, contacts, interactions, etc. to this office.
    /// Populated by application code; not loaded from EDS.
    /// </summary>
    public virtual ICollection<OfficeRelationship> OfficeRelationships { get; set; } = new HashSet<OfficeRelationship>();
}
