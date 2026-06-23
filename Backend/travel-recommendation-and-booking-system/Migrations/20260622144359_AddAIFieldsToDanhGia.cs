using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddAIFieldsToDanhGia : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.AlterColumn<int>(
                name: "TrangThaiDon",
                table: "DonDatTour",
                type: "int",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<string>(
                name: "GhiChuKiemDuyet",
                table: "DanhGia",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsProcessedByAI",
                table: "DanhGia",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$180lc3va67ervDBskYu5yuen5QXIWL6HP7N6HUgpPJ26k.JO4MCRy", new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2355), new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2340) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2663));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2668));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2669));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2683));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2684));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2685));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2688));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2701));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2703));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2703));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2704));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2705));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2706));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2707));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2708));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2709));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 21, 43, 59, 116, DateTimeKind.Local).AddTicks(2710));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DanhSachYeuThich_NguoiDung_MaNguoiDung",
                table: "DanhSachYeuThich");

            migrationBuilder.DropForeignKey(
                name: "FK_DanhSachYeuThich_Tour_MaTour",
                table: "DanhSachYeuThich");

            migrationBuilder.DropIndex(
                name: "IX_DanhSachYeuThich_MaTour",
                table: "DanhSachYeuThich");

            migrationBuilder.DropColumn(
                name: "GhiChuKiemDuyet",
                table: "DanhGia");

            migrationBuilder.DropColumn(
                name: "IsProcessedByAI",
                table: "DanhGia");

            migrationBuilder.AlterColumn<string>(
                name: "TrangThaiDon",
                table: "DonDatTour",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldMaxLength: 50);

            migrationBuilder.AddColumn<int>(
                name: "NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TourMaTour",
                table: "DanhSachYeuThich",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$tcN5YEA9ztXiHbd6L/NkE.0lJXcHiqniKrGdF0a6Zx8YtmHZhzDae", new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(3263), new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(3238) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4103));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4112));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4115));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4116));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4117));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4117));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4118));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4120));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4121));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4122));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4123));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4124));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4125));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4125));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4126));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 0, 39, 10, 696, DateTimeKind.Local).AddTicks(4127));

            migrationBuilder.CreateIndex(
                name: "IX_DanhSachYeuThich_NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich",
                column: "NguoiDungMaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_DanhSachYeuThich_TourMaTour",
                table: "DanhSachYeuThich",
                column: "TourMaTour");

            migrationBuilder.AddForeignKey(
                name: "FK_DanhSachYeuThich_NguoiDung_NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich",
                column: "NguoiDungMaNguoiDung",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DanhSachYeuThich_Tour_TourMaTour",
                table: "DanhSachYeuThich",
                column: "TourMaTour",
                principalTable: "Tour",
                principalColumn: "MaTour",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
