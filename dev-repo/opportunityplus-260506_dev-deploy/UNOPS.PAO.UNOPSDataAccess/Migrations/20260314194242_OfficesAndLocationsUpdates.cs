using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class OfficesAndLocationsUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "DeletedDate",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "LastModifiedBy",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "LastModifiedDate",
                schema: "public",
                table: "Offices");

            migrationBuilder.DropColumn(
                name: "WorkflowStatus",
                schema: "public",
                table: "Offices");

            migrationBuilder.CreateTable(
                name: "Locations",
                schema: "public",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    Code = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    OfficeId = table.Column<int>(type: "integer", nullable: false),
                    Alias = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: true),
                    Description = table.Column<string>(type: "text", nullable: true),
                    LocationType = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    AddressLine = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    PostalCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    City = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    State = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    CountryCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: true),
                    CountryName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    PrimaryLatitude = table.Column<decimal>(type: "numeric", nullable: true),
                    PrimaryLongitude = table.Column<decimal>(type: "numeric", nullable: true),
                    CoordinatesJson = table.Column<string>(type: "text", nullable: true),
                    LocationCoordinatorId = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true),
                    LocationGuid = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Locations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Locations_Offices_OfficeId",
                        column: x => x.OfficeId,
                        principalSchema: "public",
                        principalTable: "Offices",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Locations_Code",
                schema: "public",
                table: "Locations",
                column: "Code",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Locations_OfficeId",
                schema: "public",
                table: "Locations",
                column: "OfficeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Locations",
                schema: "public");

            migrationBuilder.AddColumn<int>(
                name: "CreatedBy",
                schema: "public",
                table: "Offices",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                schema: "public",
                table: "Offices",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "DeletedBy",
                schema: "public",
                table: "Offices",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedDate",
                schema: "public",
                table: "Offices",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LastModifiedBy",
                schema: "public",
                table: "Offices",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastModifiedDate",
                schema: "public",
                table: "Offices",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkflowStatus",
                schema: "public",
                table: "Offices",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
