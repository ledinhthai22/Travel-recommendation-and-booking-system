using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Hangfirejob : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$KkeWyAXYiRRCsAIAEhiIOevqu3CKWn/ccRXgwgxSkYWn/dDrcXhce", new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(3669), new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(3646) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4339));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4348));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4349));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4349));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4351));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4352));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4352));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4353));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$EbP7baAo8Y7Z/58CdOwy3OjlmL4qKEaz4php0ZHbjnezquK753zKy", new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8208), new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8187) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8723));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8730));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8731));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8732));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8732));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8733));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8734));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 2, 42, 56, 157, DateTimeKind.Local).AddTicks(8734));
        }
    }
}
