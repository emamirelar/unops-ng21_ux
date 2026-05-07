using System.Globalization;
using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.Domain.Entities;

namespace UNOPS.PAO.Business.Workflow;

/// <summary>
/// Builds string field values for workflow step conditions (pathway preview and submit-time evaluation).
/// Keys align with <c>GetOpportunitySearchFields</c> and admin graph conditions.
/// <see cref="OpportunityWorkflowConditionFieldKeys.RisksConditionText"/> is filled via <see cref="Interfaces.IOpportunityWorkflowRiskConditionTextProvider"/> in the host app.
/// </summary>
public static class OpportunityWorkflowConditionFieldValues
{
    /// <summary>
    /// Eager loads navigations needed for dotted field keys (countries, SDGs, partners, etc.).
    /// </summary>
    public static IQueryable<Opportunity> WithWorkflowConditionIncludes(this IQueryable<Opportunity> source) =>
        source
            .Include(o => o.Countries)
            .Include(o => o.SDGs)
            .Include(o => o.SDGTargets)
            .Include(o => o.SDGIndicators)
            .Include(o => o.Deliverables)
                .ThenInclude(d => d.Output)
            .Include(o => o.Stakeholders)
            .Include(o => o.FundingPartners)
            .Include(o => o.ClientPartners)
            .Include(o => o.ExternalStakeholders)
            .Include(o => o.UNOPSMissions);

    /// <summary>
    /// Populates <paramref name="target"/> with values for requested <paramref name="keys"/> when known.
    /// </summary>
    public static void AppendFieldValues(
        Opportunity o,
        IReadOnlyCollection<string> keys,
        IDictionary<string, string> target)
    {
        bool Wants(string k) => keys.Any(x => string.Equals(x, k, StringComparison.OrdinalIgnoreCase));

        void Set(string key, string? value)
        {
            if (Wants(key))
                target[key] = value ?? string.Empty;
        }

        Set("name", o.Name);
        Set("description", o.Description);
        Set("partnerReference", o.PartnerReference);
        Set("stage", o.Stage);
        Set("resultsFocus", o.ResultsFocus);
        Set("expectedImpact", o.ExpectedImpact);
        Set("expectedOutcomes", o.ExpectedOutcomes);
        Set("expectedBeneficiaries", o.ExpectedBeneficiaries);
        Set("challenges", o.Challenges);
        Set("status", o.Status.ToString());
        Set("responsibleOrgUnitId", o.ResponsibleOrgUnitId?.ToString(CultureInfo.InvariantCulture));
        Set("proposedInitiativeTypeId", o.ProposedInitiativeTypeId?.ToString(CultureInfo.InvariantCulture));
        Set("initiativeBudgetUSD", o.InitiativeBudgetUSD?.ToString(CultureInfo.InvariantCulture));
        Set("estimatedDirectBeneficiaries", o.EstimatedDirectBeneficiaries?.ToString(CultureInfo.InvariantCulture));
        Set("estimatedIndirectBeneficiaries", o.EstimatedIndirectBeneficiaries?.ToString(CultureInfo.InvariantCulture));
        Set("beneficiariesToBeDetermined", o.BeneficiariesToBeDetermined ? "true" : "false");
        Set("deliveryModality", o.DeliveryModality.HasValue
            ? ((int)o.DeliveryModality.Value).ToString(CultureInfo.InvariantCulture)
            : string.Empty);
        Set("unopsMissionsNotApplicable", o.UNOPSMissionsNotApplicable ? "true" : "false");

        Set("createdBy", o.CreatedBy.ToString(CultureInfo.InvariantCulture));
        Set("lastModifiedBy", o.LastModifiedBy == 0 ? string.Empty : o.LastModifiedBy.ToString(CultureInfo.InvariantCulture));

        if (Wants("targetSigningDate"))
            Set("targetSigningDate", FormatDate(o.TargetSigningDate));
        if (Wants("targetDeliveryDate"))
            Set("targetDeliveryDate", FormatDate(o.TargetDeliveryDate));
        if (Wants("implementationStartDate"))
            Set("implementationStartDate", FormatDate(o.ImplementationStartDate));
        if (Wants("createdDate"))
            Set("createdDate", FormatDate(o.CreatedDate));
        if (Wants("lastModifiedDate"))
            Set("lastModifiedDate", FormatDate(o.LastModifiedDate));

        if (Wants("countries.countryId"))
        {
            var ids = o.Countries.Where(c => !c.IsDeleted).Select(c => c.CountryId).OrderBy(x => x).ToList();
            Set("countries.countryId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("sdGs.sdgId"))
        {
            var ids = o.SDGs.Where(s => !s.IsDeleted).Select(s => s.SDGId).OrderBy(x => x).ToList();
            Set("sdGs.sdgId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("sdgTargets.sdgTargetId"))
        {
            var ids = o.SDGTargets.Where(s => !s.IsDeleted).Select(s => s.SDGTargetId).OrderBy(x => x).ToList();
            Set("sdgTargets.sdgTargetId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("sdgIndicators.sdgIndicatorId"))
        {
            var ids = o.SDGIndicators.Where(s => !s.IsDeleted).Select(s => s.SDGIndicatorId).OrderBy(x => x).ToList();
            Set("sdgIndicators.sdgIndicatorId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("deliverables.outputId"))
        {
            var ids = o.Deliverables.Where(d => !d.IsDeleted && d.OutputId.HasValue).Select(d => d.OutputId!.Value).OrderBy(x => x).ToList();
            Set("deliverables.outputId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants(OpportunityWorkflowConditionFieldKeys.DeliverablesServiceLine))
        {
            var lines = o.Deliverables
                .Where(d => !d.IsDeleted && d.Output != null && !string.IsNullOrWhiteSpace(d.Output!.ServiceLine))
                .Select(d => d.Output!.ServiceLine!.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .OrderBy(x => x, StringComparer.OrdinalIgnoreCase)
                .ToList();
            Set(OpportunityWorkflowConditionFieldKeys.DeliverablesServiceLine, string.Join(",", lines));
        }

        if (Wants("fundingPartners.partnerId"))
        {
            var ids = o.FundingPartners.Where(f => !f.IsDeleted).Select(f => f.PartnerId).OrderBy(x => x).Distinct().ToList();
            Set("fundingPartners.partnerId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("clientPartners.partnerId"))
        {
            var ids = o.ClientPartners.Where(f => !f.IsDeleted).Select(f => f.PartnerId).OrderBy(x => x).Distinct().ToList();
            Set("clientPartners.partnerId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("stakeholders.userId"))
        {
            var ids = o.Stakeholders.Where(s => !s.IsDeleted && s.UserId.HasValue).Select(s => s.UserId!.Value).OrderBy(x => x).Distinct().ToList();
            Set("stakeholders.userId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("stakeholders.entityRoleId"))
        {
            var ids = o.Stakeholders.Where(s => !s.IsDeleted).Select(s => s.EntityRoleId).OrderBy(x => x).Distinct().ToList();
            Set("stakeholders.entityRoleId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("externalStakeholders.contactId"))
        {
            var ids = o.ExternalStakeholders.Where(s => !s.IsDeleted).Select(s => s.ContactId).OrderBy(x => x).Distinct().ToList();
            Set("externalStakeholders.contactId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }

        if (Wants("unopsMissions.unopsMissionId"))
        {
            var ids = o.UNOPSMissions.Where(m => !m.IsDeleted).Select(m => m.UNOPSMissionId).OrderBy(x => x).Distinct().ToList();
            Set("unopsMissions.unopsMissionId", string.Join(",", ids.Select(i => i.ToString(CultureInfo.InvariantCulture))));
        }
    }

    /// <summary>ISO-8601 round-trip for condition comparison.</summary>
    public static string FormatDate(DateTime? utc)
    {
        if (!utc.HasValue) return string.Empty;
        var d = utc.Value;
        if (d.Kind == DateTimeKind.Unspecified)
            d = DateTime.SpecifyKind(d, DateTimeKind.Utc);
        return d.ToString("O", CultureInfo.InvariantCulture);
    }
}
