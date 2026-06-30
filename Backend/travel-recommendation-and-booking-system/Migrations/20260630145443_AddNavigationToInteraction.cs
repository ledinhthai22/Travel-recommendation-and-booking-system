using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddNavigationToInteraction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TrangThaiTuongTac",
                columns: table => new
                {
                    MaTuongTac = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    DaXemChiTiet = table.Column<bool>(type: "bit", nullable: false),
                    DaQuanTamLau = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrangThaiTuongTac", x => x.MaTuongTac);
                    table.ForeignKey(
                        name: "FK_TrangThaiTuongTac_NguoiDung_MaNguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrangThaiTuongTac_Tour_MaTour",
                        column: x => x.MaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$fGbsClpDModEoW02Ot3gme1A3s50MPyu6knt453qG9I9zxVRYx1mq", new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2192), new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2176) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2521));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2528));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2529));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2530));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2531));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2531));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2532));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2533));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2534));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2535));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2536));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2536));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2537));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2538));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2539));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2540));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2541));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 21, 54, 40, 107, DateTimeKind.Local).AddTicks(2542));

            migrationBuilder.CreateIndex(
                name: "IX_TrangThaiTuongTac_MaNguoiDung",
                table: "TrangThaiTuongTac",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_TrangThaiTuongTac_MaTour",
                table: "TrangThaiTuongTac",
                column: "MaTour");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrangThaiTuongTac");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$SX6bjXZkekZ6SuEIhIGRPeGqP1R/28cHs9L0gZXOxzlUEkQLbRdd.", new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(918), new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(900) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1387));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1393));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1393));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1395));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1397));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1397));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1398));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1399));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1399));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1400));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1401));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1402));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1403));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1404));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1405));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1405));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1406));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 30, 14, 47, 24, 816, DateTimeKind.Local).AddTicks(1407));
        }
    }
}
