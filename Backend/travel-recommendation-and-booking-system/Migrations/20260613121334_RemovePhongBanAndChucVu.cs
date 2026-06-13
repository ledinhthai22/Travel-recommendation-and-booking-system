using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class RemovePhongBanAndChucVu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChucVu",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "PhongBan",
                table: "NguoiDung");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$6NRHALl2uH9k/u5crVvEfOMzr/wTQBd0FCUq.vz14tWWbP2z9rgdy", new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(1738), new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(1721) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2271));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2278));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2279));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2279));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2280));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2281));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2282));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 13, 19, 13, 31, 774, DateTimeKind.Local).AddTicks(2283));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChucVu",
                table: "NguoiDung",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PhongBan",
                table: "NguoiDung",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "ChucVu", "MatKhau", "NgayCapNhat", "NgayTao", "PhongBan" },
                values: new object[] { null, "$2a$11$q/ST8yZ66P21.KRrvQP/aOdPqtuyUaXdC2xr.ytuewW1u/.XI4n/W", new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(6832), new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(6807), null });

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
