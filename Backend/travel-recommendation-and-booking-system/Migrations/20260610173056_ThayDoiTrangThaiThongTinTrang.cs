using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoiTrangThaiThongTinTrang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$kMIDM4BfnMS48TLigXEB7e/fvxvv0Fal2jyhFW0HTx3RhMv6EtKE.", new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2292), new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2266) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2802), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2808), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2809), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2809), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2810), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2811), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2811), true });

            migrationBuilder.InsertData(
                table: "ThongTinTrang",
                columns: new[] { "MaTTTrang", "Key", "NgayCapNhat", "NgayXoa", "Noidung", "Trangthai" },
                values: new object[] { 8, "zalo", new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2812), null, null, true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$tReuUN275B9GmOunBIziGO3wc0yFiYegCBSuVmqsljKJrUnTqaqoC", new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8364), new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8342) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8863), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8870), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8871), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8871), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8872), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8873), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 6, 14, 514, DateTimeKind.Local).AddTicks(8873), null });
        }
    }
}
