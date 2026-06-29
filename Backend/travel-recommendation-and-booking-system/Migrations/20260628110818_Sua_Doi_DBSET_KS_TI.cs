using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Sua_Doi_DBSET_KS_TI : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "KhuVuc",
                table: "DiaDiem");

            migrationBuilder.DropColumn(
                name: "QuocGia",
                table: "DiaDiem");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$pwGbxvXqoK2x8fyawIwfi.I6vCSIizw1d7i1WxMNC3OUqJnE6spsK", new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(2715), new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(2690) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3405));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3415));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3417));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3417));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3418));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3419));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3420));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3519));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3522));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3523));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3524));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3525));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3526));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3527));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3540));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3541));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3543));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 18, 8, 16, 620, DateTimeKind.Local).AddTicks(3549));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "KhuVuc",
                table: "DiaDiem",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "QuocGia",
                table: "DiaDiem",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$h4RyWutP3x3B0IV5mlDYGu.x3o4WlBILYKoNhpihxB9U0Tvigz1qK", new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2110), new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2092) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2683));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2696));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2697));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2698));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2699));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2701));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2702));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2703));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2705));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2706));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2707));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2709));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2710));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2719));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2720));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2721));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 27, 16, 31, 9, 681, DateTimeKind.Local).AddTicks(2727));
        }
    }
}
