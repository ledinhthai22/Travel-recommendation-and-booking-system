using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThemDaDanhGia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DaDanhGia",
                table: "DonDatTour",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Ai0123BHNoOccNLyyetfQOznW7klfnNQoTinbQWSmwGW2glKmD4Sa", new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(8554), new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(8516) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9241));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9250));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9251));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9251));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9252));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9253));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9253));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9254));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9264));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9265));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9266));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9267));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9268));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9269));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9270));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9295));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9296));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 21, 20, 6, 49, 384, DateTimeKind.Local).AddTicks(9392));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DaDanhGia",
                table: "DonDatTour");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$avj7FmrC2XXeqPr8ArTxrO8BGYc7RTThTd0bKxo0KmwyPMkM52Rj2", new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6238), new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6197) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6949));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6950));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6951));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6952));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6953));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6954));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6954));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6958));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6959));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6961));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6962));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6963));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6964));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6965));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6970));
        }
    }
}
