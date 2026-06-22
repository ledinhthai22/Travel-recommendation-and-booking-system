using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class SeedPhuongTien : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$VY4w1Yh5NoL3eHT95uOgJeu21gvYbk3ipckHA3k8EoTWhCeegEHrq", new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(8568), new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(8528) });

            migrationBuilder.InsertData(
                table: "PhuongTien",
                columns: new[] { "MaPhuongTien", "Icon", "MaVietTat", "NgayCapNhat", "NgayTao", "NgayXoa", "TenPhuongTien", "TrangThai" },
                values: new object[,]
                {
                    { 1, "Plane", "MB", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Máy Bay", true },
                    { 2, "Bus", "OT", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Ô Tô", true },
                    { 3, "Train", "TH", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Tàu Hỏa", true },
                    { 4, "Ship", "TT", new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new DateTime(2025, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Tàu Thủy", true }
                });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9220));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9227));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9228));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9229));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9229));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9230));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9231));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9231));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9232));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9233));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9234));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9235));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9236));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9236));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9243));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9244));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9245));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "PhuongTien",
                keyColumn: "MaPhuongTien",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "PhuongTien",
                keyColumn: "MaPhuongTien",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "PhuongTien",
                keyColumn: "MaPhuongTien",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "PhuongTien",
                keyColumn: "MaPhuongTien",
                keyValue: 4);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$cK3y9QoCql5flgHFU8Ry8uqcgG3yTJsxoaA86DHM5FgjD1XoTSKoG", new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4138), new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4113) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4717));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4724));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4725));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4746));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4748));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4748));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4753));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4768));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4769));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4770));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4772));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4773));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4774));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4774));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4775));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4776));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 51, 4, 841, DateTimeKind.Local).AddTicks(4777));
        }
    }
}
