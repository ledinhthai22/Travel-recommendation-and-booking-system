using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoiTen : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SoTienHoanThucTe",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "SoTienHoanThucTe",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "SoTienMatCoc",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "TyLeHoanTien",
                table: "DonDatTour");

            migrationBuilder.RenameColumn(
                name: "TrangThaiCoc",
                table: "DonDatTour",
                newName: "TrangThaiTaiChinh");

            migrationBuilder.AlterColumn<int>(
                name: "MaNhanVienXuLyHoan",
                table: "ThanhToan",
                type: "int",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50,
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$avj7FmrC2XXeqPr8ArTxrO8BGYc7RTThTd0bKxo0KmwyPMkM52Rj2", new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6238), new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6197) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6940));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6949));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6950));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6951));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6952));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6953));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6954));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6954));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6958));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6959));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6961));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6962));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6963));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6964));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6965));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 20, 20, 55, 12, 319, DateTimeKind.Local).AddTicks(6970));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TrangThaiTaiChinh",
                table: "DonDatTour",
                newName: "TrangThaiCoc");

            migrationBuilder.AlterColumn<string>(
                name: "MaNhanVienXuLyHoan",
                table: "ThanhToan",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienHoanThucTe",
                table: "ThanhToan",
                type: "decimal(18,2)",
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
    }
}
