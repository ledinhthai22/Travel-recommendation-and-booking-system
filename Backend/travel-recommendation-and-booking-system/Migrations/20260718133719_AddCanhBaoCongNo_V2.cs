using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddCanhBaoCongNo_V2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "CoCanhBaoCongNo",
                table: "DonDatTour",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayGanCoCanhBao",
                table: "DonDatTour",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$s5MzzGlYU91.zL7viOJF1.kEcqRnjEK0Mbb8RgNik7AcA0U7qlL.u", new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(3783), new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(3738) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4624));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4631));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4632));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4633));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4634));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4635));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4635));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4636));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4638));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4639));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4640));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4641));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4642));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4643));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4644));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4650));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4651));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 37, 19, 158, DateTimeKind.Local).AddTicks(4657));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoCanhBaoCongNo",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "NgayGanCoCanhBao",
                table: "DonDatTour");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$4/5isxSnV9r4Ftuv0C7creoFrre9PiLn73/4QY8TRUga7bpbf.OOu", new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(5644), new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(5588) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6911));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6921));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6923));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6924));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6925));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6927));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6928));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6929));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6932));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6934));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6935));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6937));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6939));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6942));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6943));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6944));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 18, 20, 35, 25, 206, DateTimeKind.Local).AddTicks(6946));
        }
    }
}
