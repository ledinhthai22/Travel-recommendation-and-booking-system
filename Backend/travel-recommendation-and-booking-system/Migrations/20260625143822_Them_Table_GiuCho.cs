using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Them_Table_GiuCho : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GiuCho",
                columns: table => new
                {
                    MaGiuCho = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaChuyen = table.Column<int>(type: "int", nullable: false),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    SoChoGiu = table.Column<int>(type: "int", nullable: false),
                    ThoiGianHetHan = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiuCho", x => x.MaGiuCho);
                    table.ForeignKey(
                        name: "FK_GiuCho_ChuyenKhoiHanh_MaChuyen",
                        column: x => x.MaChuyen,
                        principalTable: "ChuyenKhoiHanh",
                        principalColumn: "MaChuyen",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_GiuCho_NguoiDung_MaNguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Djrmqdx88TplXH1q9626De7AuaKdGsj3cUPJC2XquywwUlJ2u.xiu", new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(3509), new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(3486) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4271));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4277));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4278));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4278));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4279));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4280));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4280));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4281));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4283));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4284));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4285));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4286));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4286));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4289));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4303));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4304));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4305));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 21, 38, 21, 706, DateTimeKind.Local).AddTicks(4311));

            migrationBuilder.CreateIndex(
                name: "IX_GiuCho_MaChuyen",
                table: "GiuCho",
                column: "MaChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_GiuCho_MaNguoiDung",
                table: "GiuCho",
                column: "MaNguoiDung");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GiuCho");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$J/m6.6O5TWnPlDI05Suqi.WmLvz8DK6nNnpN7h8L1zMlt6o/BRp9O", new DateTime(2026, 6, 25, 20, 12, 38, 602, DateTimeKind.Local).AddTicks(9407), new DateTime(2026, 6, 25, 20, 12, 38, 602, DateTimeKind.Local).AddTicks(9384) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(295));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(300));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(301));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(302));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(303));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(303));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(304));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(305));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(307));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(308));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(308));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(309));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(310));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(311));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(322));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(323));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(324));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 20, 12, 38, 603, DateTimeKind.Local).AddTicks(331));
        }
    }
}
