using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class ParentOrgIdUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AddColumn<string>(
                name: "EstablishedBy",
                schema: "public",
                table: "Offices",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ParentOrganizationHierarchyId",
                schema: "public",
                table: "Offices",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Offices_ParentOrganizationHierarchyId",
                schema: "public",
                table: "Offices",
                column: "ParentOrganizationHierarchyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Offices_OrganizationHierarchies_ParentOrganizationHierarchy~",
                schema: "public",
                table: "Offices",
                column: "ParentOrganizationHierarchyId",
                principalSchema: "public",
                principalTable: "OrganizationHierarchies",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Offices_OrganizationHierarchies_ParentOrganizationHierarchy~",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropIndex(
                name: "IX_Offices_ParentOrganizationHierarchyId",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "EstablishedBy",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "ParentOrganizationHierarchyId",
                schema: "public",
                table: "Offices");
        }
    }
}
