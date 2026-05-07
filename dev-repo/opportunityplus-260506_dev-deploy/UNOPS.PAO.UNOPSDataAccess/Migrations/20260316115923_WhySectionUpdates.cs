using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class WhySectionUpdates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernClimateChange",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernCreateJobs",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernEnvironmentalSafeguards",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernGenderEquality",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernPeopleBenefitting",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernProcurementCapacity",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CrossCuttingConcernSupplierCapacity",
                schema: "public",
                table: "Opportunities",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CrossCuttingConcernsOther",
                schema: "public",
                table: "Opportunities",
                type: "character varying(150)",
                maxLength: 150,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernClimateChange",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernCreateJobs",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernEnvironmentalSafeguards",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernGenderEquality",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernPeopleBenefitting",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernProcurementCapacity",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernSupplierCapacity",
                schema: "public",
                table: "Opportunities");

            migrationBuilder.DropColumn(
                name: "CrossCuttingConcernsOther",
                schema: "public",
                table: "Opportunities");
        }
    }
}
