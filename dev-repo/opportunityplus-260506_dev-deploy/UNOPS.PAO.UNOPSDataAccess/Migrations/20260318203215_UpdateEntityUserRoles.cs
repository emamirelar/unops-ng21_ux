using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateEntityUserRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Update EntityRoles: DoA1-4_OrganizationHierarchy → DoA1-4_Engagement_Acceptance
            migrationBuilder.Sql(@"
                UPDATE ""EntityRoles"" SET ""Code"" = 'DoA1_Engagement_Acceptance' WHERE ""Code"" = 'DoA1_OrganizationHierarchy';
                UPDATE ""EntityRoles"" SET ""Code"" = 'DoA2_Engagement_Acceptance' WHERE ""Code"" = 'DoA2_OrganizationHierarchy';
                UPDATE ""EntityRoles"" SET ""Code"" = 'DoA3_Engagement_Acceptance' WHERE ""Code"" = 'DoA3_OrganizationHierarchy';
                UPDATE ""EntityRoles"" SET ""Code"" = 'DoA4_Engagement_Acceptance' WHERE ""Code"" = 'DoA4_OrganizationHierarchy';
            ");

            // 2. Truncate EntityUserRoles so EDS can repopulate with new role codes
            migrationBuilder.Sql(@"TRUNCATE TABLE ""EntityUserRoles"" CASCADE;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
