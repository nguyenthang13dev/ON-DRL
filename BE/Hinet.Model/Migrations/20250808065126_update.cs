using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Hinet.Model.Migrations
{
    /// <inheritdoc />
    public partial class update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            

            migrationBuilder.AddColumn<string>(
                name: "Permission",
                table: "FileSecurity",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LoaiVanBan",
                table: "FileManager",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayBanHanh",
                table: "FileManager",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoKyHieu",
                table: "FileManager",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TrichYeu",
                table: "FileManager",
                type: "text",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"),
                columns: new[] { "ConcurrencyStamp", "PasswordHash", "SecurityStamp" },
                values: new object[] { "105f0a67-a1a4-4e0b-ab34-aa2aeb34fe91", "AQAAAAIAAYagAAAAEOKgTBVEcneljG8wb6ouSJZxAhC42Zz/D3E3ShN6tvwdmqTaxjnU/rb4/fyvYmwkEw==", "089c1553-5d6d-4687-93d6-ea21d59e9ddc" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Permission",
                table: "FileSecurity");

            migrationBuilder.DropColumn(
                name: "LoaiVanBan",
                table: "FileManager");

            migrationBuilder.DropColumn(
                name: "NgayBanHanh",
                table: "FileManager");

            migrationBuilder.DropColumn(
                name: "SoKyHieu",
                table: "FileManager");

            migrationBuilder.DropColumn(
                name: "TrichYeu",
                table: "FileManager");

            
        }
    }
}
