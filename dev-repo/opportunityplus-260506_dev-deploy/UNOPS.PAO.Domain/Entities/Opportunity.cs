using UNOPS.PAO.Domain.Infrastructure;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace UNOPS.PAO.Domain.Entities;

public class Opportunity : ModifiableDeletableEntity
{
    public new int Id { get; set; }

    [MaxLength(120)]
    public new required string Name { get; set; }
    
    public required string Description { get; set; }
    
    [MaxLength(255)]
    public string? PartnerReference { get; set; }
    
    /// <summary>
    /// Current workflow stage. Default is "IDENTIFY &amp; PROFILE".
    /// Valid values: "IDENTIFY &amp; PROFILE", "GO", "NO GO"
    /// </summary>
    [MaxLength(100)]
    public string Stage { get; set; } = "IDENTIFY & PROFILE";
    
    /// <summary>
    /// FK to <see cref="Office"/> (<c>Offices</c> table). Property name matches the <c>ResponsibleOrgUnitId</c> column; stores <see cref="Office.Id"/>.
    /// </summary>
    public int? ResponsibleOrgUnitId { get; set; }
    /// <summary>Navigation to the responsible P3M office (same FK as <see cref="ResponsibleOrgUnitId"/>).</summary>
    public virtual Office? ResponsibleOrgUnit { get; set; }
    
    [Column(TypeName = "decimal(18, 2)")]
    public decimal? InitiativeBudgetUSD { get; set; }
    
    public DateTime? TargetSigningDate { get; set; }
    
    /// <summary>
    /// Implementation start date - defaults to TargetSigningDate if not specified
    /// </summary>
    public DateTime? ImplementationStartDate { get; set; }
    
    public DateTime? TargetDeliveryDate { get; set; }
    
    /// <summary>
    /// Indicates if the target signing date is a firm deadline defined by the partner
    /// </summary>
    public bool IsTargetSigningDateFirm { get; set; }
    
    /// <summary>
    /// Notes about the target signing date (e.g., partner deadline, submission closing date)
    /// </summary>
    [MaxLength(1000)]
    public string? SigningDateNotes { get; set; }
    
    /// <summary>
    /// Partner submission deadline (if applicable)
    /// </summary>
    public DateTime? SubmissionDeadline { get; set; }
    
    public int? ProposedInitiativeTypeId { get; set; }
    public virtual ProposedInitiativeType? ProposedInitiativeType { get; set; }
        
    [MaxLength(2000)]
    public string? ResultsFocus { get; set; }
    
    /// <summary>
    /// Expected impact description (max 510 characters)
    /// </summary>
    [MaxLength(510)]
    public string? ExpectedImpact { get; set; }
    
    /// <summary>
    /// Expected outcomes description (max 510 characters)
    /// </summary>
    [MaxLength(510)]
    public string? ExpectedOutcomes { get; set; }
    
    [MaxLength(1000)]
    public string? ExpectedBeneficiaries { get; set; }
    
    /// <summary>
    /// Estimated number of direct beneficiaries (positive integer)
    /// Null if this information will be sought during development
    /// </summary>
    public int? EstimatedDirectBeneficiaries { get; set; }
    
    /// <summary>
    /// Estimated number of indirect beneficiaries (positive integer)
    /// Null if this information will be sought during development
    /// </summary>
    public int? EstimatedIndirectBeneficiaries { get; set; }
    
    /// <summary>
    /// Indicates whether beneficiary numbers will be determined during development
    /// True if user opts to provide this information later
    /// </summary>
    public bool BeneficiariesToBeDetermined { get; set; } = false;
    
    [MaxLength(1000)]
    public string? Challenges { get; set; }
    
    /// <summary>
    /// AI-generated opportunity statement in markdown format
    /// </summary>
    public string? OpportunityStatementMarkdown { get; set; }
    
    /// <summary>
    /// AI-generated banner image for the opportunity (base64 encoded)
    /// </summary>
    public string? OpportunityBannerImage { get; set; }
    
    /// <summary>
    /// AI-generated thumbnail image for the opportunity (base64 encoded)
    /// </summary>
    public string? OpportunityThumbnail { get; set; }
    
    /// <summary>
    /// Whether funding is pooled across multiple partners
    /// </summary>
    public bool IsPooledFunding { get; set; }
    
    /// <summary>
    /// Indicates that the user has acknowledged reviewing all organizational high risks
    /// Part of AC1 requirement for high risk checklist acknowledgement
    /// </summary>
    public bool HighRisksAcknowledged { get; set; }
    
    /// <summary>
    /// Indicates how UNOPS will deliver the Products & Services (nullable - not set by default)
    /// </summary>
    public DeliveryModality? DeliveryModality { get; set; }
    
    public virtual ICollection<OpportunityFundingPartner> FundingPartners { get; set; } = new HashSet<OpportunityFundingPartner>();
    
    public virtual ICollection<OpportunityClientPartner> ClientPartners { get; set; } = new HashSet<OpportunityClientPartner>();
    
    public virtual ICollection<OpportunityStakeholder> Stakeholders { get; set; } = new HashSet<OpportunityStakeholder>();
    
    public virtual ICollection<OpportunityExternalStakeholder> ExternalStakeholders { get; set; } = new HashSet<OpportunityExternalStakeholder>();
    
    /// <summary>
    /// Free-text list of external stakeholders not found in the contact list
    /// </summary>
    [MaxLength(2000)]
    public string? MiscExternalStakeholders { get; set; }
    
    /// <summary>
    /// Additional notes about external stakeholders (e.g., their influence, capacity, role)
    /// </summary>
    [MaxLength(2000)]
    public string? ExternalStakeholderNotes { get; set; }
    
    public virtual ICollection<OpportunityDeliverable> Deliverables { get; set; } = new HashSet<OpportunityDeliverable>();
    
    public virtual ICollection<OpportunityCountry> Countries { get; set; } = new HashSet<OpportunityCountry>();
    
    public virtual ICollection<OpportunitySDG> SDGs { get; set; } = new HashSet<OpportunitySDG>();
    
    public virtual ICollection<OpportunitySDGTarget> SDGTargets { get; set; } = new HashSet<OpportunitySDGTarget>();
    
    public virtual ICollection<OpportunitySDGIndicator> SDGIndicators { get; set; } = new HashSet<OpportunitySDGIndicator>();
    
    public virtual ICollection<OpportunityUNCFOutcome> UNCFOutcomes { get; set; } = new HashSet<OpportunityUNCFOutcome>();
    
    public virtual ICollection<OpportunityUNCFIndicator> UNCFIndicators { get; set; } = new HashSet<OpportunityUNCFIndicator>();
    
    public virtual ICollection<OpportunityUNOPSMission> UNOPSMissions { get; set; } = new HashSet<OpportunityUNOPSMission>();
    
    /// <summary>
    /// Indicates whether UNOPS Strategic Missions alignment is not applicable for this opportunity.
    /// When true, no missions need to be selected and validation will pass.
    /// </summary>
    public bool UNOPSMissionsNotApplicable { get; set; } = false;

    #region Cross-Cutting Concerns (WHY Section)

    /// <summary>
    /// Account for people benefitting, including women and youth. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernPeopleBenefitting { get; set; }

    /// <summary>
    /// Advance gender equality and/or social inclusion. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernGenderEquality { get; set; }

    /// <summary>
    /// Create jobs. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernCreateJobs { get; set; }

    /// <summary>
    /// Develop capacity for suppliers and/or implementing partners. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernSupplierCapacity { get; set; }

    /// <summary>
    /// Develop capacity for procurement and/or infrastructure institutions. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernProcurementCapacity { get; set; }

    /// <summary>
    /// Mainstream environmental and/or social safeguards. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernEnvironmentalSafeguards { get; set; }

    /// <summary>
    /// Mitigate and/or adapt to climate change. Null = not yet answered.
    /// </summary>
    public bool? CrossCuttingConcernClimateChange { get; set; }

    /// <summary>
    /// Other cross-cutting concerns or reason for none of the above having been selected. Max 150 characters.
    /// Required when all 7 items are No.
    /// </summary>
    [MaxLength(150)]
    public string? CrossCuttingConcernsOther { get; set; }

    #endregion
    
    /// <summary>
    /// Collaborators who have permissions to edit all fields of the opportunity.
    /// Part of the Opportunity Development Team.
    /// </summary>
    public virtual ICollection<OpportunityCollaborator> Collaborators { get; set; } = new HashSet<OpportunityCollaborator>();
    
    public virtual List<Document>? Documents { get; set; }
    
    [NotMapped]
    public virtual ICollection<EntityRolePerson>? RoleAssignments { get; set; }
    
    /// <summary>
    /// The Executive assigned to direct Opportunity development after Go decision.
    /// Set by the decision-maker during Go approval. Nullable until Go decision is made.
    /// </summary>
    public int? ExecutiveId { get; set; }
    
    /// <summary>
    /// Navigation property to the assigned Executive user.
    /// </summary>
    [ForeignKey(nameof(ExecutiveId))]
    public virtual PAOUser? Executive { get; set; }
    
    // Audit user navigation properties
    [ForeignKey(nameof(CreatedBy))]
    public virtual PAOUser? CreatedByUser { get; set; }
    
    [ForeignKey(nameof(LastModifiedBy))]
    public virtual PAOUser? LastModifiedByUser { get; set; }
}

