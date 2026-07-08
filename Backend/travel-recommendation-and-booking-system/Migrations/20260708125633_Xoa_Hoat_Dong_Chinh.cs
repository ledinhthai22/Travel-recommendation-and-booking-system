using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Xoa_Hoat_Dong_Chinh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HoatDongChinh",
                table: "LichTrinh");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$BXnppWh0vDbRpKeAs6dNYuIkS5b9Ll2PUGcldzb0/xJHwzZRXNey6", new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(2521), new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(2505) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3163));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3169));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3170));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3171));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3172));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3173));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3173));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3174));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3176));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3177));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3178));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3178));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3179));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3180));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3195));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3196));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3197));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 19, 56, 32, 499, DateTimeKind.Local).AddTicks(3203));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HoatDongChinh",
                table: "LichTrinh",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$eSCQFRYZcWnEyD15rQz7ouul.hD80o3FZm4xrtEesohvr1MvBz9Yu", new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1092), new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1068) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1868));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1876));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1876));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1877));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1878));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1879));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1879));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1880));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1882));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1957));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1958));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1959));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1961));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1962));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1963));
        }
    }
}
