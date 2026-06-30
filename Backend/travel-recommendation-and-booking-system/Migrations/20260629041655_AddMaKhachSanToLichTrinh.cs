using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddMaKhachSanToLichTrinh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CTLichTrinh_KhachSan_MaKhachSan",
                table: "CTLichTrinh");

            migrationBuilder.DropIndex(
                name: "IX_CTLichTrinh_MaKhachSan",
                table: "CTLichTrinh");

            migrationBuilder.DropColumn(
                name: "MaKhachSan",
                table: "CTLichTrinh");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MaKhachSan",
                table: "CTLichTrinh",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Um4xDfgpOzDLBLXxlEdYvuENYrlCFLKzOSlyJ2kUvFH9s8jZl/Dbi", new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(538), new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(517) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1343));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1350));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1351));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1352));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1352));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1353));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1354));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1354));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1357));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1358));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1359));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1360));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1360));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1362));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1389));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1390));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1391));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 29, 11, 5, 26, 825, DateTimeKind.Local).AddTicks(1401));

            migrationBuilder.CreateIndex(
                name: "IX_CTLichTrinh_MaKhachSan",
                table: "CTLichTrinh",
                column: "MaKhachSan");

            migrationBuilder.AddForeignKey(
                name: "FK_CTLichTrinh_KhachSan_MaKhachSan",
                table: "CTLichTrinh",
                column: "MaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan");
        }
    }
}
