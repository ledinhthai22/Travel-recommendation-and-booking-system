using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThemTruongGioiTinhChoNguoiDung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "GioiTinh",
                table: "NguoiDung",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "GioiTinh", "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { false, "$2a$11$q/ST8yZ66P21.KRrvQP/aOdPqtuyUaXdC2xr.ytuewW1u/.XI4n/W", new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(6832), new DateTime(2026, 6, 12, 16, 23, 41, 919, DateTimeKind.Local).AddTicks(6807) });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GioiTinh",
                table: "NguoiDung");

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
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2802));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2808));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2809));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2809));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2810));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2811));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2811));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2812));
        }
    }
}
