using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Sua_Relationship_Cua_Don_Dat_Tour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_NhanViens_NhanVienMaNhanVien",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_UuDai_UuDaiMaUuDai",
                table: "DonDatTour");

            migrationBuilder.DropIndex(
                name: "IX_DonDatTour_NhanVienMaNhanVien",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "NhanVienMaNhanVien",
                table: "DonDatTour");

            migrationBuilder.AlterColumn<int>(
                name: "UuDaiMaUuDai",
                table: "DonDatTour",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "KhachSanMaKhachSan",
                table: "DonDatTour",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$SpsYwUzpf.UySuwkLiZVh.RBDe0t8/xEZH2rTjVgNaIkUNzovuGg6", new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8663), new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8646) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8978));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8984));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8985));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8986));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8987));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8988));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8989));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8990));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8993));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8994));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8995));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8996));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8997));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8998));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8999));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(8999));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(9000));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 29, 37, 818, DateTimeKind.Local).AddTicks(9001));

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaKhachSan",
                table: "DonDatTour",
                column: "MaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaNhanVienDuyet",
                table: "DonDatTour",
                column: "MaNhanVienDuyet");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaUuDai",
                table: "DonDatTour",
                column: "MaUuDai");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour",
                column: "KhachSanMaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_KhachSan_MaKhachSan",
                table: "DonDatTour",
                column: "MaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_NhanViens_MaNhanVienDuyet",
                table: "DonDatTour",
                column: "MaNhanVienDuyet",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_UuDai_MaUuDai",
                table: "DonDatTour",
                column: "MaUuDai",
                principalTable: "UuDai",
                principalColumn: "MaUuDai",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_UuDai_UuDaiMaUuDai",
                table: "DonDatTour",
                column: "UuDaiMaUuDai",
                principalTable: "UuDai",
                principalColumn: "MaUuDai");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_KhachSan_MaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_NhanViens_MaNhanVienDuyet",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_UuDai_MaUuDai",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_UuDai_UuDaiMaUuDai",
                table: "DonDatTour");

            migrationBuilder.DropIndex(
                name: "IX_DonDatTour_MaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropIndex(
                name: "IX_DonDatTour_MaNhanVienDuyet",
                table: "DonDatTour");

            migrationBuilder.DropIndex(
                name: "IX_DonDatTour_MaUuDai",
                table: "DonDatTour");

            migrationBuilder.AlterColumn<int>(
                name: "UuDaiMaUuDai",
                table: "DonDatTour",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "KhachSanMaKhachSan",
                table: "DonDatTour",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NhanVienMaNhanVien",
                table: "DonDatTour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Djrmqdx88TplXH1q9626De7AuaKdGsj3cUPJC2XquywwUlJ2u.xiu", new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(3509), new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(3486) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4271));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4277));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4278));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4278));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4279));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4280));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4280));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4281));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4283));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4284));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4285));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4286));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4286));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4289));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4303));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4304));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4305));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4311));

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_NhanVienMaNhanVien",
                table: "DonDatTour",
                column: "NhanVienMaNhanVien");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour",
                column: "KhachSanMaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_NhanViens_NhanVienMaNhanVien",
                table: "DonDatTour",
                column: "NhanVienMaNhanVien",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_UuDai_UuDaiMaUuDai",
                table: "DonDatTour",
                column: "UuDaiMaUuDai",
                principalTable: "UuDai",
                principalColumn: "MaUuDai",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
