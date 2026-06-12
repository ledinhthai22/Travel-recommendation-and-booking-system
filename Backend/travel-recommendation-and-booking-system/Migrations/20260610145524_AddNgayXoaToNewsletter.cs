using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddNgayXoaToNewsletter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "Newsletter",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$GqsI9u0DYsVSxf2GuDip6OWSuOA6DB3zQDRXjsWMFI6wgdwOK/iga", new DateTime(2026, 6, 10, 21, 55, 24, 448, DateTimeKind.Local).AddTicks(1252), new DateTime(2026, 6, 10, 21, 55, 24, 448, DateTimeKind.Local).AddTicks(1233) });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "Newsletter");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$59Gp2k50lWt5bdCH.3b83.P23/xApSVooAC5rnLyoIDtcSkyQrGWK", new DateTime(2026, 6, 6, 11, 45, 55, 125, DateTimeKind.Local).AddTicks(3814), new DateTime(2026, 6, 6, 11, 45, 55, 125, DateTimeKind.Local).AddTicks(3787) });
        }
    }
}
