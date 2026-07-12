using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddLoaiHoatDongToCTLichTrinh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LoaiHoatDong",
                table: "CTLichTrinh",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$sDJWOtDyw6ozpEVQGP9m2.0..NfQji8JmZOBy/A6g/lncXvDPyuZO", new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(727), new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(698) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1607));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1615));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1616));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1617));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1618));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1619));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1620));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1621));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1623));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1743));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1744));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1746));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1747));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1748));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1749));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1750));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1751));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 10, 10, 2, 16, 487, DateTimeKind.Local).AddTicks(1765));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LoaiHoatDong",
                table: "CTLichTrinh");

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
    }
}
