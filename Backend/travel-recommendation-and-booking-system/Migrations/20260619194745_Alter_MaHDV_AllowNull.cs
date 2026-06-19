using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Alter_MaHDV_AllowNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                table: "ChuyenKhoiHanh");

            migrationBuilder.AlterColumn<int>(
                name: "MaHDV",
                table: "ChuyenKhoiHanh",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$xnI2oaXAsw6NGMbArCYQPOmkOi6Oie1zkdDEeZTiEGL8SR7fY55wW", new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6335), new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6315) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6846));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6853));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6854));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6855));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6856));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6857));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6858));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6858));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6859));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6860));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6861));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6862));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6863));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6864));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6865));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6866));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 20, 2, 47, 40, 717, DateTimeKind.Local).AddTicks(6867));

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                table: "ChuyenKhoiHanh");

            migrationBuilder.AlterColumn<int>(
                name: "MaHDV",
                table: "ChuyenKhoiHanh",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$kjoMQUuUXkG5WiuZAf14EOPPVSYKz5I9pmc63hOAhClccv7rg3W5q", new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(6917), new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(6900) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7293));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7300));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7301));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7315));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7316));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7317));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7321));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7329));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7330));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7331));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7332));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7333));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7334));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7336));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7337));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7338));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 19, 21, 51, 54, 938, DateTimeKind.Local).AddTicks(7339));

            migrationBuilder.AddForeignKey(
                name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
