using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class LichSuThanhToan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LichSuTrangThai",
                table: "DonDatTour",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LoaiNguoiYeuCauHuy",
                table: "DonDatTour",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LyDoTuChoiHuy",
                table: "DonDatTour",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaNguoiYeuCauHuy",
                table: "DonDatTour",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaNhanVienXuLyHuy",
                table: "DonDatTour",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXuLyHuy",
                table: "DonDatTour",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienHoanThucTe",
                table: "DonDatTour",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienMatCoc",
                table: "DonDatTour",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TyLeHoanTien",
                table: "DonDatTour",
                type: "decimal(5,2)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$bn0.3t7Oavf2ecDuuJBz7eDd6AXHAi6pFJIg4QJMYeg6y3370ytCS", new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8143), new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8103) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8772));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8779));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8780));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8781));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8781));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8782));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8783));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8784));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8785));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8786));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8787));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8788));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8789));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8791));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8791));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8792));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8793));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 19, 19, 7, 42, 663, DateTimeKind.Local).AddTicks(8798));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LichSuTrangThai",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "LoaiNguoiYeuCauHuy",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "LyDoTuChoiHuy",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "MaNguoiYeuCauHuy",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "MaNhanVienXuLyHuy",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "NgayXuLyHuy",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "SoTienHoanThucTe",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "SoTienMatCoc",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "TyLeHoanTien",
                table: "DonDatTour");

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
    }
}
