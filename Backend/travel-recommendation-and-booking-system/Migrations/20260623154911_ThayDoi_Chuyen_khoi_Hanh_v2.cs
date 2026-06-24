using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoi_Chuyen_khoi_Hanh_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NhanViens_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropIndex(
                name: "IX_ChuyenKhoiHanh_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropColumn(
                name: "NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$OqbkQTjCGULgzuBtdij7gOA3RJySXPDnhW9z/Vyhq9IMHoT4kwNJm", new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(8843), new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(8823) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9695));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9702));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9703));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9703));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9704));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9705));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9705));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9706));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9708));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9709));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9710));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9712));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9725));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9726));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 22, 49, 11, 285, DateTimeKind.Local).AddTicks(9727));

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV");

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NhanViens_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NhanViens_MaHDV",
                table: "ChuyenKhoiHanh");

            migrationBuilder.DropIndex(
                name: "IX_ChuyenKhoiHanh_MaHDV",
                table: "ChuyenKhoiHanh");

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
                name: "IX_ChuyenKhoiHanh_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh",
                column: "NhanVienMaNhanVien");

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NhanViens_NhanVienMaNhanVien",
                table: "ChuyenKhoiHanh",
                column: "NhanVienMaNhanVien",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
