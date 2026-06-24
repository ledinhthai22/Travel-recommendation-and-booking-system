using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Add_GiaTu_Tour : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "GiaTu",
                table: "Tour",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$WtnVqrqPJiMNG5QBCs6xX.58FxVP1m76cIaoiXUx3IfQX8XNiKMUq", new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3403), new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3360) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3936));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3943));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3944));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3945));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3945));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3946));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3947));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3947));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3949));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3950));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3951));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3952));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3952));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3953));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3959));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3962));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GiaTu",
                table: "Tour");

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
        }
    }
}
