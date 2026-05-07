using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace UNOPS.PAO.UNOPSDataAccess.Migrations
{
    /// <inheritdoc />
    public partial class UpdateOpportunityChallengesLength : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Truncate any existing Challenges values that exceed 1000 characters
            // so the subsequent ALTER COLUMN does not fail with a data truncation error.
            migrationBuilder.Sql(@"
                UPDATE public.""Opportunities""
                SET    ""Challenges""       = LEFT(""Challenges"", 1000),
                       ""LastModifiedDate"" = NOW()
                WHERE  LENGTH(""Challenges"") > 1000;
            ");

            // Step 2: Narrow the column from 1020 → 1000 characters
            migrationBuilder.AlterColumn<string>(
                name: "Challenges",
                schema: "public",
                table: "Opportunities",
                type: "character varying(1000)",
                maxLength: 1000,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1020)",
                oldMaxLength: 1020,
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Challenges",
                schema: "public",
                table: "Opportunities",
                type: "character varying(1020)",
                maxLength: 1020,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(1000)",
                oldMaxLength: 1000,
                oldNullable: true);
        }
    }
}
