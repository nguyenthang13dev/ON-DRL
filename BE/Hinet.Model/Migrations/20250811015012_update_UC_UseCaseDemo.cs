using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hinet.Model.Migrations
{
    /// <inheritdoc />
    public partial class update_UC_UseCaseDemo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "lstHanhDongNangCao",
                table: "UC_UseCaseDemo",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "5644645e-7fb6-490b-a7d5-f8513cf3c2ae", "AQAAAAIAAYagAAAAEDumTWg6MeC2v70F8mx6Xur4RiF6LiFgV51/va1I+yMp+t0tx6hMlMaMQKa1D5wdAw==", "e915037a-0ccc-418b-998a-8048973416f5" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "lstHanhDongNangCao",
                table: "UC_UseCaseDemo");

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "f92533bf-ce08-41f6-a47b-88a68d09ae69", "AQAAAAIAAYagAAAAEPCWssKmkfP293tLDBVFqaNt3Xhijt8KQz8h1VQAl7x3fqTU8EfV/NKUzVBXPrQJww==", "22c01461-034f-481d-86dd-391e854d8ba4" });
        }
    }
}
