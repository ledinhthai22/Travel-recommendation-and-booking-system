using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddLienHeToPaymentPayloadAndDonDatTour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DiaChiLienHe",
                table: "DonDatTour",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EmailLienHe",
                table: "DonDatTour",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "HoTenLienHe",
                table: "DonDatTour",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SoDienThoaiLienHe",
                table: "DonDatTour",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$xz6arT1sRCuLliqbyRqMAuuKSvRSNnDFC2Km.SxBJCHN3FQORvqKG", new DateTime(2026, 7, 18, 15, 51, 55, 487, DateTimeKind.Local).AddTicks(5912), new DateTime(2026, 7, 18, 15, 51, 55, 487, DateTimeKind.Local).AddTicks(5833) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3112));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3122));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3124));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3125));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3126));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3128));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3129));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3130));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3133));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3135));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3136));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3137));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3138));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3140));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3141));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3142));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3144));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 51, 55, 488, DateTimeKind.Local).AddTicks(3145));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DiaChiLienHe",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "EmailLienHe",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "HoTenLienHe",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "SoDienThoaiLienHe",
                table: "DonDatTour");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$fq96bs5U9JeWhDJ/k2WFzu3zaN4UduRTZixMspPDtEYTL7EAnwlFy", new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(8693), new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(8642) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9551));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9559));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9560));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9561));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9562));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9563));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9564));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9564));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9566));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9568));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9569));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9570));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9571));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9572));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9574));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9585));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9586));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 15, 48, 22, 857, DateTimeKind.Local).AddTicks(9596));
        }
    }
}
