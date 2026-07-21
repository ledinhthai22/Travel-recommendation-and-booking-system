using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddLoaiGiaoDichAndMaDonDatToPaymentPayload : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LoaiThanhToan",
                table: "ThanhToan",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXacNhan",
                table: "ThanhToan",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MaGiuCho",
                table: "PaymentPayload",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "LoaiGiaoDich",
                table: "PaymentPayload",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MaDonDatTour",
                table: "PaymentPayload",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienDaThanhToan",
                table: "DonDatTour",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "TienCoc",
                table: "DonDatTour",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TrangThaiCoc",
                table: "DonDatTour",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Fqy/7yFA1XLhGo7/LDRS4eYtReKmsdQ0ZB9WwCl0AEv8oLT7Gh/vO", new DateTime(2026, 7, 14, 17, 10, 20, 300, DateTimeKind.Local).AddTicks(9221), new DateTime(2026, 7, 14, 17, 10, 20, 300, DateTimeKind.Local).AddTicks(9196) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(229));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(241));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(242));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(242));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(243));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(244));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(245));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(245));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(247));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(248));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(249));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(250));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(251));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(251));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(252));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(265));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(266));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 17, 10, 20, 301, DateTimeKind.Local).AddTicks(270));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoaiThanhToan",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "NgayXacNhan",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "LoaiGiaoDich",
                table: "PaymentPayload");

            migrationBuilder.DropColumn(
                name: "MaDonDatTour",
                table: "PaymentPayload");

            migrationBuilder.DropColumn(
                name: "SoTienDaThanhToan",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "TienCoc",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "TrangThaiCoc",
                table: "DonDatTour");

            migrationBuilder.AlterColumn<int>(
                name: "MaGiuCho",
                table: "PaymentPayload",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$aSJ1dsnlgv9v7zBLEmrrguvXgfyO8o77jXL4kyKmCd2LmU0wWSdvm", new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(5469), new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(5443) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6339));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6345));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6346));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6347));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6347));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6348));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6349));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6350));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6352));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6353));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6354));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6355));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6356));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6357));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6358));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6359));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6360));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 14, 16, 38, 8, 342, DateTimeKind.Local).AddTicks(6361));
        }
    }
}
