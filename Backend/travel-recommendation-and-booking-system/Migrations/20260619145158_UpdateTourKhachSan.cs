using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTourKhachSan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tour_KhachSan_KhachSan_KhachSanMaKhachSan",
                table: "Tour_KhachSan");

            migrationBuilder.DropForeignKey(
                name: "FK_Tour_KhachSan_Tour_TourMaTour",
                table: "Tour_KhachSan");

            migrationBuilder.DropIndex(
                name: "IX_Tour_KhachSan_KhachSanMaKhachSan",
                table: "Tour_KhachSan");

            migrationBuilder.DropIndex(
                name: "IX_Tour_KhachSan_TourMaTour",
                table: "Tour_KhachSan");

            migrationBuilder.DropColumn(
                name: "KhachSanMaKhachSan",
                table: "Tour_KhachSan");

            migrationBuilder.DropColumn(
                name: "TourMaTour",
                table: "Tour_KhachSan");

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

            migrationBuilder.CreateIndex(
                name: "IX_Tour_KhachSan_MaKhachSan",
                table: "Tour_KhachSan",
                column: "MaKhachSan");

            migrationBuilder.AddForeignKey(
                name: "FK_Tour_KhachSan_KhachSan_MaKhachSan",
                table: "Tour_KhachSan",
                column: "MaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tour_KhachSan_Tour_MaTour",
                table: "Tour_KhachSan",
                column: "MaTour",
                principalTable: "Tour",
                principalColumn: "MaTour",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tour_KhachSan_KhachSan_MaKhachSan",
                table: "Tour_KhachSan");

            migrationBuilder.DropForeignKey(
                name: "FK_Tour_KhachSan_Tour_MaTour",
                table: "Tour_KhachSan");

            migrationBuilder.DropIndex(
                name: "IX_Tour_KhachSan_MaKhachSan",
                table: "Tour_KhachSan");

            migrationBuilder.AddColumn<int>(
                name: "KhachSanMaKhachSan",
                table: "Tour_KhachSan",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TourMaTour",
                table: "Tour_KhachSan",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$3rQNPCwij/Eg0QDpswxnhutvKPf7uo13bNsUjB8mYoZu/OAX0ALL2", new DateTime(2026, 6, 18, 10, 25, 58, 983, DateTimeKind.Local).AddTicks(9958), new DateTime(2026, 6, 18, 10, 25, 58, 983, DateTimeKind.Local).AddTicks(9923) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(485));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(491));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(492));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(519));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(521));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(522));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(531));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(544));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(546));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(547));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(548));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(549));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(550));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(550));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(551));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(552));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 18, 10, 25, 58, 984, DateTimeKind.Local).AddTicks(553));

            migrationBuilder.CreateIndex(
                name: "IX_Tour_KhachSan_KhachSanMaKhachSan",
                table: "Tour_KhachSan",
                column: "KhachSanMaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_Tour_KhachSan_TourMaTour",
                table: "Tour_KhachSan",
                column: "TourMaTour");

            migrationBuilder.AddForeignKey(
                name: "FK_Tour_KhachSan_KhachSan_KhachSanMaKhachSan",
                table: "Tour_KhachSan",
                column: "KhachSanMaKhachSan",
                principalTable: "KhachSan",
                principalColumn: "MaKhachSan",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tour_KhachSan_Tour_TourMaTour",
                table: "Tour_KhachSan",
                column: "TourMaTour",
                principalTable: "Tour",
                principalColumn: "MaTour",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
