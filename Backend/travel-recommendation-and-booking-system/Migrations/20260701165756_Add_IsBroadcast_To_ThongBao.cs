using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Add_IsBroadcast_To_ThongBao : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBroadcast",
                table: "ThongBao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$8uJn.8W/Xe2Fi182mPylpOIWsBe9n/qeOmP7N2SATwXIaHmo5gKAu", new DateTime(2026, 7, 1, 23, 57, 54, 834, DateTimeKind.Local).AddTicks(9969), new DateTime(2026, 7, 1, 23, 57, 54, 834, DateTimeKind.Local).AddTicks(9938) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(852));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(860));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(860));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(861));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(863));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(936));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(937));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(947));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(954));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(955));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(957));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(958));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(973));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(974));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(975));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(978));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBroadcast",
                table: "ThongBao");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$vJwa9tQWn5dO/Y.XQVt4SOlXq9/.OFKxWo5b9dsN5bA6KfJSIzjIq", new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(5844), new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(5825) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6466));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6473));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6474));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6475));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6476));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6476));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6477));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6478));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6478));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6479));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6480));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6481));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6482));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6483));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6492));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6493));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6493));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 16, 4, 51, 189, DateTimeKind.Local).AddTicks(6500));
        }
    }
}
