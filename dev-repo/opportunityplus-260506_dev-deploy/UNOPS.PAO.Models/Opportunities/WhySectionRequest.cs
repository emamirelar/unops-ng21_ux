using System.ComponentModel.DataAnnotations;

namespace UNOPS.PAO.Models.Opportunities;

/// <summary>
/// Request model for updating the WHY section of an opportunity
/// Includes strategic alignment, expected beneficiaries, outcomes, and SDG alignments
/// </summary>
public class WhySectionRequest
{
    
    
    /// <summary>
    /// Results focus description
    /// </summary>
    public string? ResultsFocus { get; set; }

    /// <summary>
    /// Expected impact description (max 200 characters)
    /// </summary>
    public string? ExpectedImpact { get; set; }
    
    /// <summary>
    /// Expected outcomes description (max 200 characters)
    /// </summary>
    public string? ExpectedOutcomes { get; set; }

    /// <summary>
    /// Expected beneficiaries description
    /// </summary>
    public string? ExpectedBeneficiaries { get; set; }
    
    /// <summary>
    /// Estimated number of direct beneficiaries (positive integer)
    /// </summary>
    public int? EstimatedDirectBeneficiaries { get; set; }
    
    /// <summary>
    /// Estimated number of indirect beneficiaries (positive integer)
    /// </summary>
    public int? EstimatedIndirectBeneficiaries { get; set; }
    
    /// <summary>
    /// Indicates whether beneficiary numbers will be determined during development
    /// </summary>
    public bool BeneficiariesToBeDetermined { get; set; }
    
    /// <summary>
    /// Challenges that the initiative will address
    /// </summary>
    [MaxLength(1000)]
    public string? Challenges { get; set; }

    /// <summary>
    /// List of SDG alignments for the opportunity
    /// </summary>
    public List<OpportunitySDGRequest>? SdGs { get; set; }

    /// <summary>
    /// List of UNCF Outcome alignments for the opportunity (country-specific)
    /// </summary>
    public List<OpportunityUNCFOutcomeRequest>? UncfOutcomes { get; set; }
    
    /// <summary>
    /// List of UNOPS Mission alignments for the opportunity
    /// </summary>
    public List<OpportunityUNOPSMissionRequest>? UNOPSMissions { get; set; }
    
    /// <summary>
    /// Indicates whether UNOPS Strategic Missions alignment is not applicable for this opportunity.
    /// When true, no missions need to be selected and validation will pass.
    /// </summary>
    public bool UNOPSMissionsNotApplicable { get; set; }

    #region Cross-Cutting Concerns

    /// <summary>
    /// Account for people benefitting, including women and youth.
    /// </summary>
    public bool? CrossCuttingConcernPeopleBenefitting { get; set; }

    /// <summary>
    /// Advance gender equality and/or social inclusion.
    /// </summary>
    public bool? CrossCuttingConcernGenderEquality { get; set; }

    /// <summary>
    /// Create jobs.
    /// </summary>
    public bool? CrossCuttingConcernCreateJobs { get; set; }

    /// <summary>
    /// Develop capacity for suppliers and/or implementing partners.
    /// </summary>
    public bool? CrossCuttingConcernSupplierCapacity { get; set; }

    /// <summary>
    /// Develop capacity for procurement and/or infrastructure institutions.
    /// </summary>
    public bool? CrossCuttingConcernProcurementCapacity { get; set; }

    /// <summary>
    /// Mainstream environmental and/or social safeguards.
    /// </summary>
    public bool? CrossCuttingConcernEnvironmentalSafeguards { get; set; }

    /// <summary>
    /// Mitigate and/or adapt to climate change.
    /// </summary>
    public bool? CrossCuttingConcernClimateChange { get; set; }

    /// <summary>
    /// Other cross-cutting concerns or reason for none of the above having been selected. Max 150 characters.
    /// </summary>
    public string? CrossCuttingConcernsOther { get; set; }

    #endregion
}

