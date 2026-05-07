namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Update a single OfficeMaster operational role assignment (Director, Deputy Director, or HSSE Coordinator).
/// </summary>
public class UpdateOfficeOperationalRoleRequest
{
    /// <summary>Entity role code, e.g. Organizational_Director_OrganizationHierarchy.</summary>
    public required string EntityRoleCode { get; set; }

    /// <summary>PAO user id of the selected active personnel.</summary>
    public int UserId { get; set; }

    /// <summary>Effective date (UTC calendar date). Must be today or a future date.</summary>
    public DateOnly EffectiveDate { get; set; }
}
