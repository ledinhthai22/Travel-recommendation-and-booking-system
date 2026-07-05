using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThemHoanTienVaoThanhToan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MaNhanVienXuLyHoan",
                table: "ThanhToan",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayHoanTien",
                table: "ThanhToan",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienHoan",
                table: "ThanhToan",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Q/dGTTmi6xzlaaqjQ6gWIOjrN3HZo8qbAFFKWkvNEvCqjrtvMjWb6", new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2306), new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2289) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2779));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2788));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2789));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2790));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2790));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2791));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2792));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2792));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2794));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2795));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2796));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2796));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2797));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2798));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2799));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2799));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2800));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 55, 33, 882, DateTimeKind.Local).AddTicks(2801));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaNhanVienXuLyHoan",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "NgayHoanTien",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "SoTienHoan",
                table: "ThanhToan");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$LcqfALyy9zDUXsewywXGdOGuH35tQghZPgWJptv5sHCw5v9XdU0qe", new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(7527), new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(7511) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8207));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8213));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8214));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8215));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8216));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8216));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8217));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8218));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8220));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8220));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8221));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8222));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8223));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8224));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8239));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8240));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8241));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 5, 11, 49, 31, 82, DateTimeKind.Local).AddTicks(8246));
        }
    }
}
