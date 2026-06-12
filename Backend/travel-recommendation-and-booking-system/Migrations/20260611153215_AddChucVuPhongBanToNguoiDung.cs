using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddChucVuPhongBanToNguoiDung : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChucVu",
                table: "NguoiDung",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PhongBan",
                table: "NguoiDung",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "ChucVu", "MatKhau", "NgayCapNhat", "NgayTao", "PhongBan" },
                values: new object[] { null, "$2a$11$NY4RZvWM9RFaGDoAFgOqGe62YSijcw579fDBBjQfAb49TfmcdKhFu", new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(515), new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(500), null });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1001));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1007));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1008));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1009));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1009));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1010));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1011));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 22, 32, 15, 284, DateTimeKind.Local).AddTicks(1012));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ChucVu",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "PhongBan",
                table: "NguoiDung");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$vExzxqZCTSg9ZzGKQzTdQO7A73rD3ZmKCuwN03YkpCbtlIFwnDzNm", new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(6699), new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(6682) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(6998));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7005));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7007));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7007));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7073));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7074));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7074));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 20, 58, 19, 235, DateTimeKind.Local).AddTicks(7075));
        }
    }
}
