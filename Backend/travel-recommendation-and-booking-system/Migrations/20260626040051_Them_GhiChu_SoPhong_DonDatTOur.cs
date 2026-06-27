using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Them_GhiChu_SoPhong_DonDatTOur : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "phongdon",
                table: "KhachHang");

            migrationBuilder.AlterColumn<int>(
                name: "TrangThaiThanhToan",
                table: "DonDatTour",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AddColumn<string>(
                name: "GhiChu",
                table: "DonDatTour",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "SoPhongDon",
                table: "DonDatTour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$qbU4LDVknM4Lg8wDm6Ud0OZbv4Ds3AkLSnq9A0aJa9LSXLTA1v07O", new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5311), new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5296) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5769));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5776));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5777));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5779));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5780));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5780));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5781));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5783));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5785));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5864));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5865));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5866));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5867));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5867));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5872));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5873));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5874));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 11, 0, 51, 383, DateTimeKind.Local).AddTicks(5880));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GhiChu",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "SoPhongDon",
                table: "DonDatTour");

            migrationBuilder.AddColumn<bool>(
                name: "phongdon",
                table: "KhachHang",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<bool>(
                name: "TrangThaiThanhToan",
                table: "DonDatTour",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$kVayA3jePpc8NQwwAuepKeQdf3jfWysIr2kP5Aw871eWK2HWdLEha", new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(445), new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(421) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1102));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1109));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1110));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1111));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1111));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1112));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1114));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1116));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1117));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1118));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1119));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1120));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1121));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1124));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1285));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 10, 22, 11, 726, DateTimeKind.Local).AddTicks(1299));
        }
    }
}
