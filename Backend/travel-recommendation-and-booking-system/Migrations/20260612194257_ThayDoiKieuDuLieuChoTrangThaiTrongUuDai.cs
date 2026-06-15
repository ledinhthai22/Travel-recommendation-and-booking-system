using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoiKieuDuLieuChoTrangThaiTrongUuDai : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TrangThai",
                table: "UuDai",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "TrangThai",
                table: "UuDai",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$q/ST8yZ66P21.KRrvQP/aOdPqtuyUaXdC2xr.ytuewW1u/.XI4n/W", new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(6832), new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(6807) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7363));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7370));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7371));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7371));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7372));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7373));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7374));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(7374));
        }
    }
}
