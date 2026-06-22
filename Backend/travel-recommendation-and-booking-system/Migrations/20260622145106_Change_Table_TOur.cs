using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Change_Table_TOur : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ThoiGianTour",
                table: "Tour");

            migrationBuilder.AddColumn<int>(
                name: "Dem",
                table: "Tour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Ngay",
                table: "Tour",
                type: "int",
                maxLength: 255,
                nullable: false,
                defaultValue: 0);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Dem",
                table: "Tour");

            migrationBuilder.DropColumn(
                name: "Ngay",
                table: "Tour");

            migrationBuilder.AddColumn<string>(
                name: "ThoiGianTour",
                table: "Tour",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$niMDsQJ..mtfwwUwtCO/aOQ2VXgULdxHwYvwRbUkxKTRbVcFez3eK", new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(5829), new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(5801) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6381));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6388));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6390));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6409));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6410));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6411));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6420));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6434));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6435));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6436));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6437));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6438));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6439));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6439));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6440));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6441));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 17, 18, 16, 175, DateTimeKind.Local).AddTicks(6442));
        }
    }
}
