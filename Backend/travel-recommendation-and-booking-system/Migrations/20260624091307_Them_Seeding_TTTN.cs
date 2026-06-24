using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Them_Seeding_TTTN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Kt6zTToJhruipwzzKGhBD.C7Lvz3iF6pgl1PoZpeapEQYD4jKCuAm", new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4166), new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4146) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4799));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4806));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4807));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4808));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4809));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4810));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4811));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4811));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4813));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4814));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4815));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4816));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4817));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4818));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4821));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4822));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4823));

            migrationBuilder.InsertData(
                table: "ThongTinTrang",
                columns: new[] { "MaTTTrang", "Key", "NgayCapNhat", "NgayXoa", "Noidung", "Trangthai" },
                values: new object[] { 19, "Map_Trang_Lien_He", new DateTime(2026, 6, 24, 16, 13, 6, 605, DateTimeKind.Local).AddTicks(4828), null, null, true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$4kTchbpYUVrdFouQ4cYK2e5DhYhFsVxs0H607ZQYJEmlXuWLjhhnK", new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(3570), new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(3538) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4175));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4181));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4182));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4183));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4185));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4185));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4186));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4187));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4189));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4190));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4190));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4191));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4192));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4194));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4202));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4203));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4204));
        }
    }
}
