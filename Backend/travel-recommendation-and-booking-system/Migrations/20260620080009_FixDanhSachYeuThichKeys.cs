using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class FixDanhSachYeuThichKeys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DanhSachYeuThich_NguoiDung_NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich");

            migrationBuilder.DropForeignKey(
                name: "FK_DanhSachYeuThich_Tour_TourMaTour",
                table: "DanhSachYeuThich");

            migrationBuilder.DropIndex(
                name: "IX_DanhSachYeuThich_NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich");

            migrationBuilder.DropIndex(
                name: "IX_DanhSachYeuThich_TourMaTour",
                table: "DanhSachYeuThich");

            migrationBuilder.DropColumn(
                name: "NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich");

            migrationBuilder.DropColumn(
                name: "TourMaTour",
                table: "DanhSachYeuThich");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$BTMrSw3lox/kfrTHwPEPuuKRo/2yVttLaHE0KNAmKhxYaraU8qGTG", new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(8644), new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(8628) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9079));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9089));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9091));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9105));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9106));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9107));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9112));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9126));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9127));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9129));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9130));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9131));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9133));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9134));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9135));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9137));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 15, 0, 5, 91, DateTimeKind.Local).AddTicks(9138));

            migrationBuilder.CreateIndex(
                name: "IX_DanhSachYeuThich_MaTour",
                table: "DanhSachYeuThich",
                column: "MaTour");

            migrationBuilder.AddForeignKey(
                name: "FK_DanhSachYeuThich_NguoiDung_MaNguoiDung",
                table: "DanhSachYeuThich",
                column: "MaNguoiDung",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DanhSachYeuThich_Tour_MaTour",
                table: "DanhSachYeuThich",
                column: "MaTour",
                principalTable: "Tour",
                principalColumn: "MaTour",
                onDelete: ReferentialAction.Cascade);
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
                values: new object[] { "$2a$11$xnI2oaXAsw6NGMbArCYQPOmkOi6Oie1zkdDEeZTiEGL8SR7fY55wW", new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6335), new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6315) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6846));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6853));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6854));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6855));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6856));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6857));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6858));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6858));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6859));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6860));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6861));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6862));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6863));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6864));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6865));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6866));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6867));

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
