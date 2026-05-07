namespace UNOPS.PAO.Models.Offices;

/// <summary>
/// Paged in-app operational role assignment audit for one role (OfficeMaster assign flow).
/// </summary>
public class OfficeOperationalRoleAssignmentHistoryResponse
{
    public List<OfficeOperationalRoleAuditEntryModel> Records { get; set; } = new();

    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    public int TotalCount { get; set; }

    public bool HasMore { get; set; }
}
