using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using UNOPS.PAO.UNOPSDataAccess.Utilities;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class MigrateOrgUnitToOfficeRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Opportunities_OrganizationHierarchies_ResponsibleOrgUnitId",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.CreateTable(
                name: "OfficeRelationships",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OfficeId = table.Column<int>(type: "integer", nullable: false),
                    EntityId = table.Column<int>(type: "integer", nullable: false),
                    EntityType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
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
                    table.PrimaryKey("PK_OfficeRelationships", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OfficeRelationships_Offices_OfficeId",
                        column: x => x.OfficeId,
                        principalSchema: "public",
                        principalTable: "Offices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OfficeRelationships_EntityId_EntityType",
                schema: "public",
                table: "OfficeRelationships",
                columns: new[] { "EntityId", "EntityType" });

            migrationBuilder.CreateIndex(
                name: "IX_OfficeRelationships_EntityId_EntityType_OfficeId",
                schema: "public",
                table: "OfficeRelationships",
                columns: new[] { "EntityId", "EntityType", "OfficeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OfficeRelationships_OfficeId",
                schema: "public",
                table: "OfficeRelationships",
                column: "OfficeId");

            // ResponsibleOrgUnitId still references OrganizationHierarchies.Id until now — map to Office.Id
            // (same resolution rules as MigrateOrgUnitRelationships.sql) before FK to Offices.
            // Use a correlated scalar subquery — PostgreSQL does not allow the UPDATE target alias inside FROM LATERAL.
            migrationBuilder.Sql(@"
UPDATE public.""Opportunities"" opp
SET ""ResponsibleOrgUnitId"" = (
  SELECT o.""Id""
  FROM public.""Offices"" o
  WHERE NOT o.""IsDeleted""
    AND o.""Status"" = 1
    AND (
      (o.""OrganizationHierarchyId"" IS NOT NULL AND o.""OrganizationHierarchyId"" = opp.""ResponsibleOrgUnitId"")
      OR o.""Code"" = (SELECT h.""Code"" FROM public.""OrganizationHierarchies"" h WHERE h.""Id"" = opp.""ResponsibleOrgUnitId"" LIMIT 1)
    )
  ORDER BY o.""Id""
  LIMIT 1
)
WHERE opp.""ResponsibleOrgUnitId"" IS NOT NULL;

UPDATE public.""Opportunities"" opp
SET ""ResponsibleOrgUnitId"" = NULL
WHERE opp.""ResponsibleOrgUnitId"" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.""Offices"" f
    WHERE f.""Id"" = opp.""ResponsibleOrgUnitId"" AND NOT f.""IsDeleted""
  );
");

            migrationBuilder.AddForeignKey(
                name: "FK_Opportunities_Offices_ResponsibleOrgUnitId",
                schema: "public",
                table: "Opportunities",
                column: "ResponsibleOrgUnitId",
                principalSchema: "public",
                principalTable: "Offices",
                principalColumn: "Id");

            MigrationSqlScriptExecutor.ExecuteSqlScripts(migrationBuilder, new[]
            {
                "MigrateOrgUnitRelationships.sql"
            });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Opportunities_Offices_ResponsibleOrgUnitId",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropTable(
                name: "OfficeRelationships",
                schema: "public");

            migrationBuilder.AddForeignKey(
                name: "FK_Opportunities_OrganizationHierarchies_ResponsibleOrgUnitId",
                schema: "public",
                table: "Opportunities",
                column: "ResponsibleOrgUnitId",
                principalSchema: "public",
                principalTable: "OrganizationHierarchies",
                principalColumn: "Id");
        }
    }
}
