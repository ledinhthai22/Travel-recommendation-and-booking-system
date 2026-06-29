using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Xoa_Bo_Phan_Vung_Tour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TrongNuoc",
                table: "Tour");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Qi8ZsrUtBRJmYiggaBOz1ObjZ3s2PKrhN1YV8xGUrDhY0JKn02Lc6", new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(3882), new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(3859) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4456));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4462));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4463));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4464));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4465));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4466));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4469));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4470));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4471));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4472));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4474));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4475));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4476));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4477));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4478));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4479));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4480));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 28, 20, 0, 8, 131, DateTimeKind.Local).AddTicks(4481));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "TrongNuoc",
                table: "Tour",
                type: "bit",
                nullable: false,
                defaultValue: false);

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
    }
}
