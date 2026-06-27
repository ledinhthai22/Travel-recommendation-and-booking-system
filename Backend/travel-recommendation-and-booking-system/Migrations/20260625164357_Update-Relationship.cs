using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateRelationship : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_UuDai_UuDaiMaUuDai",
                table: "DonDatTour");

            migrationBuilder.DropIndex(
                name: "IX_DonDatTour_KhachSanMaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropIndex(
                name: "IX_DonDatTour_UuDaiMaUuDai",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "KhachSanMaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "UuDaiMaUuDai",
                table: "DonDatTour");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$yq6.eDjLuOBTnIFuhfGLlO25euUkJNhUUz9zsGvQ/ssld5Y2tOSkm", new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(1806), new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(1787) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2303));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2309));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2310));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2311));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2312));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2414));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2415));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2415));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2417));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2418));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2419));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2420));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2421));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2422));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2430));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2431));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2432));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 43, 56, 849, DateTimeKind.Local).AddTicks(2436));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "KhachSanMaKhachSan",
                table: "DonDatTour",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UuDaiMaUuDai",
                table: "DonDatTour",
                type: "int",
                nullable: true);

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
                name: "IX_DonDatTour_KhachSanMaKhachSan",
                table: "DonDatTour",
                column: "KhachSanMaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_UuDaiMaUuDai",
                table: "DonDatTour",
                column: "UuDaiMaUuDai");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour",
                column: "KhachSanMaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan");

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_UuDai_UuDaiMaUuDai",
                table: "DonDatTour",
                column: "UuDaiMaUuDai",
                principalTable: "UuDai",
                principalColumn: "MaUuDai");
        }
    }
}
