using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddMaKhachSanToLichTrinh_V2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaKhachSan",
                table: "LichTrinh",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$MUlZyun/HEFFeIn7.y9ZluWjpC/THw.KCIb/M2L2agoubZGiGOsTe", new DateTime(2026, 6, 29, 11, 18, 56, 885, DateTimeKind.Local).AddTicks(9657), new DateTime(2026, 6, 29, 11, 18, 56, 885, DateTimeKind.Local).AddTicks(9628) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(616));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(625));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(627));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(628));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(629));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(630));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(632));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(633));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(635));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(637));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(638));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(639));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(640));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(641));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(659));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(661));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(662));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 18, 56, 886, DateTimeKind.Local).AddTicks(672));

            migrationBuilder.CreateIndex(
                name: "IX_LichTrinh_MaKhachSan",
                table: "LichTrinh",
                column: "MaKhachSan");

            migrationBuilder.AddForeignKey(
                name: "FK_LichTrinh_KhachSan_MaKhachSan",
                table: "LichTrinh",
                column: "MaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_LichTrinh_KhachSan_MaKhachSan",
                table: "LichTrinh");

            migrationBuilder.DropIndex(
                name: "IX_LichTrinh_MaKhachSan",
                table: "LichTrinh");

            migrationBuilder.DropColumn(
                name: "MaKhachSan",
                table: "LichTrinh");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$X0ENGdYbGuNoARd9Cr//Weg3WG.RnbuzYlByIRFfvoatxS.Bgy1t.", new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(3714), new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(3698) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4383));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4389));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4389));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4391));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4391));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4392));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4393));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4396));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4398));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4398));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4399));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4400));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4401));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4401));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4415));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4416));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4417));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 16, 55, 300, DateTimeKind.Local).AddTicks(4421));
        }
    }
}
