using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Xoa_MaKhachSan_DonDatTour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_KhachSan_MaKhachSan",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "MaKhachSan",
                table: "PaymentPayload");

            migrationBuilder.RenameColumn(
                name: "MaKhachSan",
                table: "DonDatTour",
                newName: "KhachSanMaKhachSan");

            migrationBuilder.RenameIndex(
                name: "IX_DonDatTour_MaKhachSan",
                table: "DonDatTour",
                newName: "IX_DonDatTour_KhachSanMaKhachSan");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$h4RyWutP3x3B0IV5mlDYGu.x3o4WlBILYKoNhpihxB9U0Tvigz1qK", new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2110), new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2092) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2683));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2696));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2697));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2698));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2699));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2701));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2702));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2703));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2705));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2706));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2707));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2709));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2710));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2719));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2720));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2721));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2727));

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour",
                column: "KhachSanMaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DonDatTour_KhachSan_KhachSanMaKhachSan",
                table: "DonDatTour");

            migrationBuilder.RenameColumn(
                name: "KhachSanMaKhachSan",
                table: "DonDatTour",
                newName: "MaKhachSan");

            migrationBuilder.RenameIndex(
                name: "IX_DonDatTour_KhachSanMaKhachSan",
                table: "DonDatTour",
                newName: "IX_DonDatTour_MaKhachSan");

            migrationBuilder.AddColumn<int>(
                name: "MaKhachSan",
                table: "PaymentPayload",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$oo74vJNaFA2eTHKEsOTS5ONKvQnrRu6z52sRTKMha8.HGb3LOLsHa", new DateTime(2026, 6, 27, 1, 24, 50, 777, DateTimeKind.Local).AddTicks(9679), new DateTime(2026, 6, 27, 1, 24, 50, 777, DateTimeKind.Local).AddTicks(9650) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(402));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(409));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(410));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(411));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(412));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(413));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(413));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(414));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(417));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(418));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(419));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(420));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(421));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(422));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(2047));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(2055));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(2056));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 1, 24, 50, 778, DateTimeKind.Local).AddTicks(2062));

            migrationBuilder.AddForeignKey(
                name: "FK_DonDatTour_KhachSan_MaKhachSan",
                table: "DonDatTour",
                column: "MaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
