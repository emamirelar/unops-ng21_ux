using Microsoft.EntityFrameworkCore;
using UNOPS.PAO.UNOPSDataAccess.Context;
using UNOPS.PAO.Domain.Entities;
using UNOPS.PAO.Domain.Enums;

namespace UNOPS.PAO.UNOPSDataAccess.Seed.Seeders;

public class EntityRoleSeeder
{
    public static async Task SeedEntityRolesAsync(UNOPSAppDbContext context)
    {
        await SeedOpportunityRolesAsync(context);
        await SeedOrganizationHierarchyRolesAsync(context);
        await SeedOfficeMasterOrganizationHierarchyRolesAsync(context);
        await SeedDoATypeRolesAsync(context);
    }

    /// <summary>
    /// Adds a role if it doesn't exist, or updates it if it does exist (by EntityType and Name, or by Code)
    /// Returns true if role was added, false if it was updated
    /// </summary>
    private static async Task<bool> AddOrUpdateRoleAsync(UNOPSAppDbContext context, EntityRole role)
    {
        // First, try to find by EntityType and Name
        var existingRole = await context.EntityRoles
            .FirstOrDefaultAsync(er => er.EntityType == role.EntityType && er.Name == role.Name);

        // If not found by Name, try to find by Code
        if (existingRole == null && !string.IsNullOrWhiteSpace(role.Code))
        {
            existingRole = await context.EntityRoles
                .FirstOrDefaultAsync(er => er.EntityType == role.EntityType && er.Code == role.Code);
        }

        if (existingRole != null)
        {
            // Update existing role properties (preserve Id, CreatedDate, CreatedBy)
            existingRole.Name = role.Name;
            existingRole.Description = role.Description;
            existingRole.Type = role.Type;
            existingRole.SubType = role.SubType;
            existingRole.IsInternal = role.IsInternal;
            existingRole.AllowsMultiple = role.AllowsMultiple;
            existingRole.Status = role.Status;
            existingRole.Code = role.Code;
            existingRole.LastModifiedDate = DateTime.UtcNow;
            existingRole.LastModifiedBy = 1; // System user
            
            context.EntityRoles.Update(existingRole);
            return false; // Updated, not added
        }

        await context.EntityRoles.AddAsync(role);
        return true; // Added
    }

    private static async Task SeedOpportunityRolesAsync(UNOPSAppDbContext context)
    {
        var rolesToSeed = new List<EntityRole>
        {
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "Opportunity Manager",
                Code = "Opportunity_Manager_Opportunity",
                Description = "Primary manager responsible for overall opportunity strategy, stakeholder engagement, and successful delivery",
                IsInternal = true,
                AllowsMultiple = false,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "Partnership Lead",
                Code = "Partnership_Lead_Opportunity",
                Description = "Lead responsible for partnership development, relationship management, and collaboration with partners",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "Reviewer",
                Code = "Reviewer_Opportunity",
                Description = "Reviewer responsible for quality assurance, compliance checks, and approval workflows",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "Internal Stakeholder",
                Code = "Internal_Stakeholder_Opportunity",
                Description = "Internal UNOPS stakeholder involved in the opportunity",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "External Stakeholder",
                Code = "External_Stakeholder_Opportunity",
                Description = "External stakeholder or partner contact involved in the opportunity",
                IsInternal = false,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Infrastructure",
                Code = "SME_Infrastructure_Opportunity",
                Description = "Subject Matter Expert providing infrastructure expertise and guidance",
                Type = "SME",
                SubType = "Service Line",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Project Management",
                Code = "SME_Project_Management_Opportunity",
                Description = "Subject Matter Expert providing project management expertise and guidance",
                Type = "SME",
                SubType = "Service Line",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Human Resources",
                Code = "SME_Human_Resources_Opportunity",
                Description = "Subject Matter Expert providing human resources expertise and guidance",
                Type = "SME",
                SubType = "Service Line",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Financial Management",
                Code = "SME_Financial_Management_Opportunity",
                Description = "Subject Matter Expert providing financial management expertise and guidance",
                Type = "SME",
                SubType = "Service Line",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Procurement",
                Code = "SME_Procurement_Opportunity",
                Description = "Subject Matter Expert providing procurement expertise and guidance",
                Type = "SME",
                SubType = "Service Line",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - GESI",
                Code = "SME_GESI_Opportunity",
                Description = "Subject Matter Expert providing Gender Equality and Social Inclusion expertise and guidance",
                Type = "SME",
                SubType = "Other",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - HSSE",
                Code = "SME_HSSE_Opportunity",
                Description = "Subject Matter Expert providing Health, Safety, Social and Environmental expertise and guidance",
                Type = "SME",
                SubType = "Other",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Results Management",
                Code = "SME_Results_Management_Opportunity",
                Description = "Subject Matter Expert providing results management expertise and guidance",
                Type = "SME",
                SubType = "Other",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "Opportunity",
                Name = "SME - Risk Management",
                Code = "SME_Risk_Management_Opportunity",
                Description = "Subject Matter Expert providing risk management expertise and guidance",
                Type = "SME",
                SubType = "Other",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            }
        };

        var addedCount = 0;
        var updatedCount = 0;
        foreach (var role in rolesToSeed)
        {
            if (await AddOrUpdateRoleAsync(context, role))
            {
                addedCount++;
            }
            else
            {
                updatedCount++;
            }
        }

        if (addedCount > 0 || updatedCount > 0)
        {
            await context.SaveChangesAsync();
            if (addedCount > 0 && updatedCount > 0)
            {
                Console.WriteLine($"Seeded {addedCount} new and updated {updatedCount} existing EntityRoles for Opportunity entity.");
            }
            else if (addedCount > 0)
            {
                Console.WriteLine($"Seeded {addedCount} new EntityRoles for Opportunity entity.");
            }
            else
            {
                Console.WriteLine($"Updated {updatedCount} existing EntityRoles for Opportunity entity.");
            }
        }
        else
        {
            Console.WriteLine("No EntityRoles for Opportunity were added or updated.");
        }
    }

    private static async Task SeedOrganizationHierarchyRolesAsync(UNOPSAppDbContext context)
    {
        var rolesToSeed = new List<EntityRole>
        {
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Region Director",
                Code = "Regional_Director_OrganizationHierarchy",
                Description = "Director responsible for overseeing the entire region",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Region Deputy Director",
                Code = "Regional_Deputy_Director_OrganizationHierarchy",
                Description = "Deputy Director supporting the Region Director",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Hub Director",
                Code = "MCO_Director_OrganizationHierarchy",
                Description = "Director responsible for overseeing an MCO",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Hub Deputy Director",
                Code = "MCO_Deputy_Director_OrganizationHierarchy",
                Description = "Deputy Director supporting the MCO Director",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "OrgUnit Director",
                Code = "OrgUnit_Director_OrganizationHierarchy",
                Description = "Director responsible for overseeing an organizational unit",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "OrgUnit Deputy Director",
                Code = "OrgUnit_Deputy_Director_OrganizationHierarchy",
                Description = "Deputy Director supporting the OrgUnit Director",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            // Operational Roles (HSSE, HOP, HoSS, OiC)
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Director Manager OiC",
                Code = "Director_Manager_OiC_OrganizationHierarchy",
                Description = "Director Manager Officer in Charge",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "HSSE Regional Specialist",
                Code = "HSSE_Regional_Specialist_OrganizationHierarchy",
                Description = "HSSE Regional Specialist",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "HSSE Regional Specialist OiC",
                Code = "HSSE_Regional_Specialist_OiC_OrganizationHierarchy",
                Description = "HSSE Regional Specialist Officer in Charge",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Regional Management Oversight Advisor",
                Code = "Regional_Management_Oversight_Advisor_OrganizationHierarchy",
                Description = "Regional Management Oversight Advisor (Regional Office; Opportunity+ OfficeMaster)",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                // Name must differ from Office Master HSSE: AddOrUpdateRoleAsync matches EntityType+Name first; a shared
                // "HSSE Coordinator" overwrote this role's Code to Organizational_* and broke EDS mgmt EntityRoleId lookup.
                Name = "HSSE Coordinator (Organizational Structure)",
                Code = "HSSE_Coordinator_OrganizationHierarchy",
                Description =
                    "HSSE coordinator from organisational structure / BigQuery sync (RoleSource Mgmt), distinct from office sheet role.",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Head of Programme",
                Code = "Head_Of_Programme_OrganizationHierarchy",
                Description = "Head of Programme (HOP)",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "HoSS",
                Code = "HoSS_OrganizationHierarchy",
                Description = "Head of Support Services",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1 // System user
            }
        };

        var addedCount = 0;
        var updatedCount = 0;
        foreach (var role in rolesToSeed)
        {
            if (await AddOrUpdateRoleAsync(context, role))
            {
                addedCount++;
            }
            else
            {
                updatedCount++;
            }
        }

        if (addedCount > 0 || updatedCount > 0)
        {
            await context.SaveChangesAsync();
            if (addedCount > 0 && updatedCount > 0)
            {
                Console.WriteLine($"Seeded {addedCount} new and updated {updatedCount} existing EntityRoles for OrganizationHierarchy entity.");
            }
            else if (addedCount > 0)
            {
                Console.WriteLine($"Seeded {addedCount} new EntityRoles for OrganizationHierarchy entity.");
            }
            else
            {
                Console.WriteLine($"Updated {updatedCount} existing EntityRoles for OrganizationHierarchy entity.");
            }
        }
        else
        {
            Console.WriteLine("No EntityRoles for OrganizationHierarchy were added or updated.");
        }
    }

    /// <summary>
    /// Three operational roles populated only from the office master data import (<see cref="OfficeMasterDataSeeder"/>);
    /// assignments use <c>RoleSource</c> <c>OfficeMaster</c> (not EDS Mgmt). Distinct from BigQuery Mgmt director roles.
    /// </summary>
    private static async Task SeedOfficeMasterOrganizationHierarchyRolesAsync(UNOPSAppDbContext context)
    {
        var officeMasterRoles = new List<EntityRole>
        {
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Director/Manager",
                Code = "Organizational_Director_OrganizationHierarchy",
                Description =
                    "Director / Manager for the unit; holder from office master data (sheet). RoleSource OfficeMaster.",
                IsInternal = true,
                AllowsMultiple = false,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                Name = "Deputy Director",
                Code = "Organizational_Deputy_Director_OrganizationHierarchy",
                Description =
                    "Deputy / officer-in-charge; holder from office master data (sheet). RoleSource OfficeMaster.",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1
            },
            new EntityRole
            {
                EntityType = "OrganizationHierarchy",
                // Distinct Name required — see HSSE role in SeedOrganizationHierarchyRolesAsync.
                Name = "HSSE Coordinator (Office Master)",
                Code = "Organizational_HSSE_Coordinator_OrganizationHierarchy",
                Description =
                    "HSSE coordinator for the unit; holder from office master data (sheet). RoleSource OfficeMaster.",
                IsInternal = true,
                AllowsMultiple = true,
                Status = EntityStatus.Active,
                CreatedDate = DateTime.UtcNow,
                CreatedBy = 1
            }
        };

        var addedCount = 0;
        var updatedCount = 0;
        foreach (var role in officeMasterRoles)
        {
            if (await AddOrUpdateRoleAsync(context, role))
                addedCount++;
            else
                updatedCount++;
        }

        if (addedCount > 0 || updatedCount > 0)
        {
            await context.SaveChangesAsync();
            Console.WriteLine(
                $"Office Master EntityRoles: {addedCount} added, {updatedCount} updated (OrganizationHierarchy / sheet-driven).");
        }
        else
        {
            Console.WriteLine("No Office Master EntityRoles to add or update.");
        }
    }

    /// <summary>
    /// Seeds domain-specific Delegation of Authority (DoA) roles for BigQuery sync.
    /// Maps to Delegation_Of_Authorities_Report: Human Resources, Finance, Procurement, Procurement - ICA.
    /// Engagement Acceptance uses DoA1_Engagement_Acceptance through DoA4_Engagement_Acceptance (seeded in SeedDoATypeRolesAsync).
    /// </summary>
    private static async Task SeedDoATypeRolesAsync(UNOPSAppDbContext context)
    {
        var rolesToSeed = new List<EntityRole>
        {
            // Engagement Acceptance (levels 1, 2, 3, 4) - used by 10-entity-user-roles-doa.yaml
            CreateDoARole("OrganizationHierarchy", "DoA1 - Engagement Acceptance", "DoA1_Engagement_Acceptance", "Engagement Acceptance DoA Level 1", "DoA", "Engagement Acceptance"),
            CreateDoARole("OrganizationHierarchy", "DoA2 - Engagement Acceptance", "DoA2_Engagement_Acceptance", "Engagement Acceptance DoA Level 2", "DoA", "Engagement Acceptance"),
            CreateDoARole("OrganizationHierarchy", "DoA3 - Engagement Acceptance", "DoA3_Engagement_Acceptance", "Engagement Acceptance DoA Level 3", "DoA", "Engagement Acceptance"),
            CreateDoARole("OrganizationHierarchy", "DoA4 - Engagement Acceptance", "DoA4_Engagement_Acceptance", "Engagement Acceptance DoA Level 4", "DoA", "Engagement Acceptance"),
            // Human Resources (levels 0, 1, 2, 3, 4)
            CreateDoARole("OrganizationHierarchy", "DoA0 - Human Resources", "DoA0_HR", "Human Resources DoA Level 0", "DoA", "Human Resources"),
            CreateDoARole("OrganizationHierarchy", "DoA1 - Human Resources", "DoA1_HR", "Human Resources DoA Level 1", "DoA", "Human Resources"),
            CreateDoARole("OrganizationHierarchy", "DoA2 - Human Resources", "DoA2_HR", "Human Resources DoA Level 2", "DoA", "Human Resources"),
            CreateDoARole("OrganizationHierarchy", "DoA3 - Human Resources", "DoA3_HR", "Human Resources DoA Level 3", "DoA", "Human Resources"),
            CreateDoARole("OrganizationHierarchy", "DoA4 - Human Resources", "DoA4_HR", "Human Resources DoA Level 4", "DoA", "Human Resources"),
            // Finance (levels 1, 2, 3, 4, F)
            CreateDoARole("OrganizationHierarchy", "DoA1 - Finance", "DoA1_Finance", "Finance DoA Level 1", "DoA", "Finance"),
            CreateDoARole("OrganizationHierarchy", "DoA2 - Finance", "DoA2_Finance", "Finance DoA Level 2", "DoA", "Finance"),
            CreateDoARole("OrganizationHierarchy", "DoA3 - Finance", "DoA3_Finance", "Finance DoA Level 3", "DoA", "Finance"),
            CreateDoARole("OrganizationHierarchy", "DoA4 - Finance", "DoA4_Finance", "Finance DoA Level 4", "DoA", "Finance"),
            CreateDoARole("OrganizationHierarchy", "DoAF - Finance", "DoAF_Finance", "Finance DoA Level F (Full)", "DoA", "Finance"),
            // Procurement (levels 1, 2, 3, 4)
            CreateDoARole("OrganizationHierarchy", "DoA1 - Procurement", "DoA1_Procurement", "Procurement DoA Level 1", "DoA", "Procurement"),
            CreateDoARole("OrganizationHierarchy", "DoA2 - Procurement", "DoA2_Procurement", "Procurement DoA Level 2", "DoA", "Procurement"),
            CreateDoARole("OrganizationHierarchy", "DoA3 - Procurement", "DoA3_Procurement", "Procurement DoA Level 3", "DoA", "Procurement"),
            CreateDoARole("OrganizationHierarchy", "DoA4 - Procurement", "DoA4_Procurement", "Procurement DoA Level 4", "DoA", "Procurement"),
            // Procurement - ICA (levels 1, 2, 3, 4, 5)
            CreateDoARole("OrganizationHierarchy", "DoA1 - Procurement ICA", "DoA1_Procurement_ICA", "Procurement ICA DoA Level 1", "DoA", "Procurement - ICA"),
            CreateDoARole("OrganizationHierarchy", "DoA2 - Procurement ICA", "DoA2_Procurement_ICA", "Procurement ICA DoA Level 2", "DoA", "Procurement - ICA"),
            CreateDoARole("OrganizationHierarchy", "DoA3 - Procurement ICA", "DoA3_Procurement_ICA", "Procurement ICA DoA Level 3", "DoA", "Procurement - ICA"),
            CreateDoARole("OrganizationHierarchy", "DoA4 - Procurement ICA", "DoA4_Procurement_ICA", "Procurement ICA DoA Level 4", "DoA", "Procurement - ICA"),
            CreateDoARole("OrganizationHierarchy", "DoA5 - Procurement ICA", "DoA5_Procurement_ICA", "Procurement ICA DoA Level 5", "DoA", "Procurement - ICA"),
        };

        var addedCount = 0;
        var updatedCount = 0;
        foreach (var role in rolesToSeed)
        {
            if (await AddOrUpdateRoleAsync(context, role))
            {
                addedCount++;
            }
            else
            {
                updatedCount++;
            }
        }

        if (addedCount > 0 || updatedCount > 0)
        {
            await context.SaveChangesAsync();
            if (addedCount > 0 && updatedCount > 0)
            {
                Console.WriteLine($"Seeded {addedCount} new and updated {updatedCount} existing EntityRoles for DoA types.");
            }
            else if (addedCount > 0)
            {
                Console.WriteLine($"Seeded {addedCount} new EntityRoles for DoA types.");
            }
            else
            {
                Console.WriteLine($"Updated {updatedCount} existing EntityRoles for DoA types.");
            }
        }
        else
        {
            Console.WriteLine("No EntityRoles for DoA types were added or updated.");
        }
    }

    private static EntityRole CreateDoARole(string entityType, string name, string code, string description, string type, string subType)
    {
        return new EntityRole
        {
            EntityType = entityType,
            Name = name,
            Code = code,
            Description = description,
            Type = type,
            SubType = subType,
            IsInternal = true,
            AllowsMultiple = true,
            Status = EntityStatus.Active,
            CreatedDate = DateTime.UtcNow,
            CreatedBy = 1 // System user
        };
    }
}

