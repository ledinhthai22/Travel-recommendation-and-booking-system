using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoi_Chuyen_khoi_Hanh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropIndex(
                name: "IX_ChuyenKhoiHanh_MaHDV",
                table: "ChuyenKhoiHanh");

            migrationBuilder.AddColumn<int>(
                name: "NguoiDungMaNguoiDung",
                table: "ChuyenKhoiHanh",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$6tBlUUy3hGoBh68ReN50R.GvGOcysmS6FQHavhixR7ogMQ8Jdwhk.", new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(1573), new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(1536) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2396));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2404));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2406));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2406));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2407));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2408));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2409));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2409));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2412));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2413));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2414));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2415));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2416));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2417));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2418));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2419));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 44, 22, 811, DateTimeKind.Local).AddTicks(2420));

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_NguoiDungMaNguoiDung",
                table: "ChuyenKhoiHanh",
                column: "NguoiDungMaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh",
                column: "NhanVienMaNhanVien");

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_NguoiDungMaNguoiDung",
                table: "ChuyenKhoiHanh",
                column: "NguoiDungMaNguoiDung",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung");

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NhanViens_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh",
                column: "NhanVienMaNhanVien",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_NguoiDungMaNguoiDung",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NhanViens_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropIndex(
                name: "IX_ChuyenKhoiHanh_NguoiDungMaNguoiDung",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropIndex(
                name: "IX_ChuyenKhoiHanh_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropColumn(
                name: "NguoiDungMaNguoiDung",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropColumn(
                name: "NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$IdQ3rfjtPCQe/ynYCkvfcue7RhVmjMxHd4pig4uv8iOWmUTr/KknC", new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(4988), new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(4953) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5589));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5595));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5596));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5597));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5598));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5599));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5600));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5600));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5601));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5602));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5603));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5604));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5605));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5606));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5607));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5608));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 19, 36, 0, 787, DateTimeKind.Local).AddTicks(5609));

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV");

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung");
        }
    }
}
