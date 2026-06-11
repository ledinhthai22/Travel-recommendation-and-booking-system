using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoiModelThongTinTrangV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Trangthai",
                table: "ThongTinTrang",
                type: "bit",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "bit");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "Trangthai",
                table: "ThongTinTrang",
                type: "bit",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "bit",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$YQEA9E49PrWtqK29gjmBaOotj0/wRGCPy.y.wkrJ8RsYmZHClh8u2", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(7946), new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(7922) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8481), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8491), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8491), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8492), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8493), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8494), true });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                columns: new[] { "NgayCapNhat", "Trangthai" },
                values: new object[] { new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8494), true });
        }
    }
}
