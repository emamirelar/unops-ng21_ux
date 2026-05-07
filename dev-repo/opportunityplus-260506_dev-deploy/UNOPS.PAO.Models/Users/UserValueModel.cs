namespace UNOPS.PAO.Models.Users;

public class UserValueModel
{
    public int Id { get; set; }
    public required string Email { get; set; }
    public UserProfileValueModel? UserProfile { get; set; }
    public string Name
    {
        get
        {
            if (string.IsNullOrEmpty(UserProfile?.Name))
            {
                return Email;
            }

            return UserProfile.Name;
        }
    }
}

public class UserProfileValueModel
{
    public int UserId { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    public required string Name { get; set; }
    /// <summary>Job title from HR profile (directory display).</summary>
    public string? Position { get; set; }
    /// <summary>Works-at / org unit text from HR profile (directory display).</summary>
    public string? OrgUnit { get; set; }

    /// <summary>
    /// Enriched &quot;Works at&quot; for UI: code + name from OrganizationHierarchy when the profile only stores a B-code.
    /// </summary>
    public string? OrgUnitWorksAtDisplay { get; set; }
}