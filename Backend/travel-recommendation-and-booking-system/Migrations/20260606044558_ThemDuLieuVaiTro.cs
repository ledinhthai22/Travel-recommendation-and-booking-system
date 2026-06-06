using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThemDuLieuVaiTro : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "VaiTro",
                columns: new[] { "MaVaiTro", "TenVaiTro" },
                values: new object[,]
                {
                    { 1, "Quản Trị Viên" },
                    { 2, "Nhân Viên" },
                    { 3, "Hướng Dẫn Viên" },
                    { 4, "Khách Hàng" }
                });

            migrationBuilder.InsertData(
                table: "NguoiDung",
                columns: new[] { "MaNguoiDung", "DiaChi", "DuongDanAnh", "Email", "HoTen", "MaOtp", "MaVaiTro", "MatKhau", "NgayCapNhat", "NgaySinh", "NgayTao", "NgayXoa", "SoDienThoai", "ThoiGianHetHanOtp", "TrangThai" },
                values: new object[] { 1, null, null, "admin@gmail.com", "Quản Trị Viên", null, 1, "$2a$11$59Gp2k50lWt5bdCH.3b83.P23/xApSVooAC5rnLyoIDtcSkyQrGWK", new DateTime(2026, 6, 6, 11, 45, 55, 125, DateTimeKind.Local).AddTicks(3814), null, new DateTime(2026, 6, 6, 11, 45, 55, 125, DateTimeKind.Local).AddTicks(3787), null, "0988888888", null, 1 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "VaiTro",
                keyColumn: "MaVaiTro",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "VaiTro",
                keyColumn: "MaVaiTro",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "VaiTro",
                keyColumn: "MaVaiTro",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "VaiTro",
                keyColumn: "MaVaiTro",
                keyValue: 1);
        }
    }
}
