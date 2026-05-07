using UNOPS.PAO.Business.Interfaces;
using UNOPS.PAO.UNOPSBusiness.Interfaces;
using UNOPS.PAO.UNOPSBusiness.Managers;

namespace UNOPS.PAO.UNOPSBusiness.Workflow;

/// <summary>
/// <see cref="IWorkflowConditionFieldCatalog"/> for the Opportunity workflow subject.
/// Sources its descriptors from <see cref="UNOPSOpportunityManager.GetOpportunitySearchFields"/>
/// so the admin allow-list, advanced search, and workflow editor share a single field universe.
/// </summary>
public sealed class OpportunityWorkflowConditionFieldCatalog : IWorkflowConditionFieldCatalog
{
    public const string EntityNameValue = "Opportunity";

    private readonly IManagerWrapper _managerWrapper;

    public OpportunityWorkflowConditionFieldCatalog(IManagerWrapper managerWrapper)
    {
        _managerWrapper = managerWrapper ?? throw new ArgumentNullException(nameof(managerWrapper));
    }

    public string EntityName => EntityNameValue;

    public IReadOnlyList<WorkflowConditionFieldDescriptor> GetAvailableFields()
    {
        var unopsWrapper = (UNOPSManagerWrapper)_managerWrapper;
        var rows = unopsWrapper.OpportunityManagerInternal.GetOpportunitySearchFields();

        return rows
            .Select(r => new WorkflowConditionFieldDescriptor(
                FieldKey: r.Field,
                DefaultDisplayName: r.DisplayName,
                FieldType: r.FieldType,
                AllowedOperators: r.AllowedOperators?.ToArray() ?? Array.Empty<string>(),
                IsNavigationProperty: r.IsNavigationProperty,
                NavigationEntity: r.NavigationEntity,
                DropdownOptions: r.DropdownOptions?
                    .Select(o => new WorkflowConditionFieldDropdownOption(o.Value, o.Label))
                    .ToArray()))
            .ToArray();
    }
}
