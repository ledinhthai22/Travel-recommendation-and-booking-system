using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddTieuDeToBanner : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TieuDe",
                table: "Banner",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TieuDe",
                table: "Banner");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$kMIDM4BfnMS48TLigXEB7e/fvxvv0Fal2jyhFW0HTx3RhMv6EtKE.", new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2292), new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2266) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2802));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2808));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2809));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2809));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2810));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2811));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2811));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 11, 0, 30, 54, 733, DateTimeKind.Local).AddTicks(2812));
        }
    }
}
