using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class EntityRolesOfficeUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ApplicabilityPeriodEnd",
                schema: "public",
                table: "EntityUserRoles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApplicabilityPeriodStart",
                schema: "public",
                table: "EntityUserRoles",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Conditions",
                schema: "public",
                table: "EntityUserRoles",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DoAType",
                schema: "public",
                table: "EntityUserRoles",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrgUnitWorksAt",
                schema: "public",
                table: "EntityUserRoles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PositionTitle",
                schema: "public",
                table: "EntityUserRoles",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Offices",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OrganizationHierarchyId = table.Column<int>(type: "integer", nullable: true),
                    InternalName = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    Alias = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    ExternalName = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    OrganisationalEntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    HierarchyLevel = table.Column<int>(type: "integer", nullable: true),
                    EffectiveDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CostCentreId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    FinancialCentreType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    Funding = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    NerTarget = table.Column<decimal>(type: "numeric", nullable: true),
                    NerTargetPeriod = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    EaTarget = table.Column<decimal>(type: "numeric", nullable: true),
                    EaTargetPeriod = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    ScopeType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    WorkflowStatus = table.Column<int>(type: "integer", nullable: false),
                    CreatedBy = table.Column<int>(type: "integer", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastModifiedBy = table.Column<int>(type: "integer", nullable: false),
                    LastModifiedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    DeletedBy = table.Column<int>(type: "integer", nullable: false),
                    DeletedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Offices", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Offices_OrganizationHierarchies_OrganizationHierarchyId",
                        column: x => x.OrganizationHierarchyId,
                        principalSchema: "public",
                        principalTable: "OrganizationHierarchies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Offices_Code",
                schema: "public",
                table: "Offices",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offices_OrganizationHierarchyId",
                schema: "public",
                table: "Offices",
                column: "OrganizationHierarchyId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Offices",
                schema: "public");

            migrationBuilder.DropColumn(
                name: "ApplicabilityPeriodEnd",
                schema: "public",
                table: "EntityUserRoles");

            migrationBuilder.DropColumn(
                name: "ApplicabilityPeriodStart",
                schema: "public",
                table: "EntityUserRoles");

            migrationBuilder.DropColumn(
                name: "Conditions",
                schema: "public",
                table: "EntityUserRoles");

            migrationBuilder.DropColumn(
                name: "DoAType",
                schema: "public",
                table: "EntityUserRoles");

            migrationBuilder.DropColumn(
                name: "OrgUnitWorksAt",
                schema: "public",
                table: "EntityUserRoles");

            migrationBuilder.DropColumn(
                name: "PositionTitle",
                schema: "public",
                table: "EntityUserRoles");

        }
    }
}
