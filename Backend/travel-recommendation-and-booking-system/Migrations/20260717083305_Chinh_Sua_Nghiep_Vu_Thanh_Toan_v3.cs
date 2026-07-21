using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Chinh_Sua_Nghiep_Vu_Thanh_Toan_v3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NgayTao",
                table: "PaymentPayload");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "PaymentPayload",
                newName: "MaPaymentPayload");

            migrationBuilder.AlterColumn<string>(
                name: "TxnRef",
                table: "PaymentPayload",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DanhSachHanhKhachJson",
                table: "PaymentPayload",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "DaXuLy",
                table: "PaymentPayload",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$EUGrCzQsIkY.A2f4d9dlkuvCbk4WI76g8RsGUnC2mD2AAIBGN55aK", new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(1677), new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(1656) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2555));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2562));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2563));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2563));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2564));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2565));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2565));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2566));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2568));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2569));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2569));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2572));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2573));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2574));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2575));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2589));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2590));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 15, 33, 4, 430, DateTimeKind.Local).AddTicks(2595));

            migrationBuilder.CreateIndex(
                name: "IX_PaymentPayload_MaChuyen",
                table: "PaymentPayload",
                column: "MaChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentPayload_MaDonDatTour",
                table: "PaymentPayload",
                column: "MaDonDatTour");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentPayload_MaGiuCho",
                table: "PaymentPayload",
                column: "MaGiuCho");

            migrationBuilder.CreateIndex(
                name: "IX_PaymentPayload_MaNguoiDung",
                table: "PaymentPayload",
                column: "MaNguoiDung");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentPayload_ChuyenKhoiHanh_MaChuyen",
                table: "PaymentPayload",
                column: "MaChuyen",
                principalTable: "ChuyenKhoiHanh",
                principalColumn: "MaChuyen",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentPayload_DonDatTour_MaDonDatTour",
                table: "PaymentPayload",
                column: "MaDonDatTour",
                principalTable: "DonDatTour",
                principalColumn: "MaDonDatTour");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentPayload_GiuCho_MaGiuCho",
                table: "PaymentPayload",
                column: "MaGiuCho",
                principalTable: "GiuCho",
                principalColumn: "MaGiuCho");

            migrationBuilder.AddForeignKey(
                name: "FK_PaymentPayload_NguoiDung_MaNguoiDung",
                table: "PaymentPayload",
                column: "MaNguoiDung",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PaymentPayload_ChuyenKhoiHanh_MaChuyen",
                table: "PaymentPayload");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentPayload_DonDatTour_MaDonDatTour",
                table: "PaymentPayload");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentPayload_GiuCho_MaGiuCho",
                table: "PaymentPayload");

            migrationBuilder.DropForeignKey(
                name: "FK_PaymentPayload_NguoiDung_MaNguoiDung",
                table: "PaymentPayload");

            migrationBuilder.DropIndex(
                name: "IX_PaymentPayload_MaChuyen",
                table: "PaymentPayload");

            migrationBuilder.DropIndex(
                name: "IX_PaymentPayload_MaDonDatTour",
                table: "PaymentPayload");

            migrationBuilder.DropIndex(
                name: "IX_PaymentPayload_MaGiuCho",
                table: "PaymentPayload");

            migrationBuilder.DropIndex(
                name: "IX_PaymentPayload_MaNguoiDung",
                table: "PaymentPayload");

            migrationBuilder.DropColumn(
                name: "DaXuLy",
                table: "PaymentPayload");

            migrationBuilder.RenameColumn(
                name: "MaPaymentPayload",
                table: "PaymentPayload",
                newName: "Id");

            migrationBuilder.AlterColumn<string>(
                name: "TxnRef",
                table: "PaymentPayload",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "DanhSachHanhKhachJson",
                table: "PaymentPayload",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayTao",
                table: "PaymentPayload",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$DcpOfYmi3yTexAFbX0MDwezGqlkbCwjqcwjq3EvYNJWIgNh/si0cC", new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(825), new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(805) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1701));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1708));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1709));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1710));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1712));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1713));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1715));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1715));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1716));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1717));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1718));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1719));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1720));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1735));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1736));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1741));
        }
    }
}
