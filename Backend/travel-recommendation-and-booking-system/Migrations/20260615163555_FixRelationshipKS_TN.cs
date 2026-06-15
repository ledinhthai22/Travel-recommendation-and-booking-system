using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class FixRelationshipKS_TN : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KS_TN_KhachSan_KhachSanMaKhachSan",
                table: "KS_TN");

            migrationBuilder.DropForeignKey(
                name: "FK_KS_TN_TienNghi_TienNghiMaTienNghi",
                table: "KS_TN");

            migrationBuilder.DropIndex(
                name: "IX_KS_TN_KhachSanMaKhachSan",
                table: "KS_TN");

            migrationBuilder.DropIndex(
                name: "IX_KS_TN_TienNghiMaTienNghi",
                table: "KS_TN");

            migrationBuilder.DropColumn(
                name: "KhachSanMaKhachSan",
                table: "KS_TN");

            migrationBuilder.DropColumn(
                name: "TienNghiMaTienNghi",
                table: "KS_TN");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$0L15xdkZW/dAPj3AIsnSNuaVlwuj4/fVovtX9cM2rBUb9xPdMClaq", new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(517), new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(500) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1114));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1122));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1122));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1141));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1142));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1142));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1146));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1156));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1158));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1159));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1160));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1161));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1162));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1163));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1164));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1165));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 23, 35, 54, 352, DateTimeKind.Local).AddTicks(1165));

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_MaTienNghi",
                table: "KS_TN",
                column: "MaTienNghi");

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TN_KhachSan_MaKhachSan",
                table: "KS_TN",
                column: "MaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TN_TienNghi_MaTienNghi",
                table: "KS_TN",
                column: "MaTienNghi",
                principalTable: "TienNghi",
                principalColumn: "MaTienNghi",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KS_TN_KhachSan_MaKhachSan",
                table: "KS_TN");

            migrationBuilder.DropForeignKey(
                name: "FK_KS_TN_TienNghi_MaTienNghi",
                table: "KS_TN");

            migrationBuilder.DropIndex(
                name: "IX_KS_TN_MaTienNghi",
                table: "KS_TN");

            migrationBuilder.AddColumn<int>(
                name: "KhachSanMaKhachSan",
                table: "KS_TN",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TienNghiMaTienNghi",
                table: "KS_TN",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$go6kzBi0Cr2AHF1omkz/b.gSeYTdRbEb7MrVO3gwiVxkpvpxONqde", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(3553), new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(3531) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4080));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4086));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4087));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4112));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4121));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4133));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4134));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4135));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4136));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4136));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4137));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4138));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4139));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4140));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4141));

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_KhachSanMaKhachSan",
                table: "KS_TN",
                column: "KhachSanMaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_TienNghiMaTienNghi",
                table: "KS_TN",
                column: "TienNghiMaTienNghi");

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TN_KhachSan_KhachSanMaKhachSan",
                table: "KS_TN",
                column: "KhachSanMaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TN_TienNghi_TienNghiMaTienNghi",
                table: "KS_TN",
                column: "TienNghiMaTienNghi",
                principalTable: "TienNghi",
                principalColumn: "MaTienNghi",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
