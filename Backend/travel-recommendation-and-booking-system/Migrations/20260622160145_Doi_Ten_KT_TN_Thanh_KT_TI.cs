using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Doi_Ten_KT_TN_Thanh_KT_TI : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KS_TN");

            migrationBuilder.CreateTable(
                name: "KS_TI",
                columns: table => new
                {
                    MaKhachSan = table.Column<int>(type: "int", nullable: false),
                    MaTienIch = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KS_TI", x => new { x.MaKhachSan, x.MaTienIch });
                    table.ForeignKey(
                        name: "FK_KS_TI_KhachSan_MaKhachSan",
                        column: x => x.MaKhachSan,
                        principalTable: "KhachSan",
                        principalColumn: "MaKhachSan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KS_TI_TienNghi_MaTienIch",
                        column: x => x.MaTienIch,
                        principalTable: "TienNghi",
                        principalColumn: "MaTienIch",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$lRXal2If5bYZRMLLN/FsMeidIcbUer.TWQL5XDQIKHW34ZP5wdO4C", new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(2861), new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(2837) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3736));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3745));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3746));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3747));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3747));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3748));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3749));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3749));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3751));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3752));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3753));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3754));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3755));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3755));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3767));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3768));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 23, 1, 45, 155, DateTimeKind.Local).AddTicks(3769));

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_MaTienIch",
                table: "KS_TI",
                column: "MaTienIch");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KS_TI");

            migrationBuilder.CreateTable(
                name: "KS_TN",
                columns: table => new
                {
                    MaKhachSan = table.Column<int>(type: "int", nullable: false),
                    MaTienIch = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KS_TN", x => new { x.MaKhachSan, x.MaTienIch });
                    table.ForeignKey(
                        name: "FK_KS_TN_KhachSan_MaKhachSan",
                        column: x => x.MaKhachSan,
                        principalTable: "KhachSan",
                        principalColumn: "MaKhachSan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KS_TN_TienNghi_MaTienIch",
                        column: x => x.MaTienIch,
                        principalTable: "TienNghi",
                        principalColumn: "MaTienIch",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$cAg.LdBLcAHPHC/Eb523Lutw4YI61ub/BQnGn1cjwQIXquqrTtjDO", new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(8802), new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(8760) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9549));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9557));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9558));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9559));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9561));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9562));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9563));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9564));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9565));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9567));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9568));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9569));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9571));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9572));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9580));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9581));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 45, 59, 585, DateTimeKind.Local).AddTicks(9583));

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_MaTienIch",
                table: "KS_TN",
                column: "MaTienIch");
        }
    }
}
