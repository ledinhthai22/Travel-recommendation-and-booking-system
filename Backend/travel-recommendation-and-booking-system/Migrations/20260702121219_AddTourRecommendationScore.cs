using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddTourRecommendationScore : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TourRecommendationScore",
                columns: table => new
                {
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    Score = table.Column<float>(type: "real", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TourRecommendationScore", x => new { x.MaNguoiDung, x.MaTour });
                    table.ForeignKey(
                        name: "FK_TourRecommendationScore_NguoiDung_MaNguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TourRecommendationScore_Tour_MaTour",
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
                values: new object[] { "$2a$11$bQNb7B/QFB9mnTYtwWa6luA.qM7kXUT6DRtkZiB.dcPPFTWTy1gUm", new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(6441), new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(6419) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7179));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7185));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7186));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7187));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7188));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7189));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7189));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7190));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7191));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7192));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7193));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7194));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7195));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7196));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7213));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7214));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7215));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 19, 12, 17, 786, DateTimeKind.Local).AddTicks(7219));

            migrationBuilder.CreateIndex(
                name: "IX_TourRecommendationScore_MaNguoiDung",
                table: "TourRecommendationScore",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_TourRecommendationScore_MaTour",
                table: "TourRecommendationScore",
                column: "MaTour");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TourRecommendationScore");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$nWDdUKKDmHGHu1zbhIc8.Ox0GStAsi/HjyZRYDerXJtYffID7cAaW", new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8056), new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8039) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8598));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8606));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8606));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8607));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8608));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8609));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8610));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8610));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8612));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8613));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8614));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8617));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8618));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8618));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8619));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8620));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8621));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 14, 44, 1, 654, DateTimeKind.Local).AddTicks(8621));
        }
    }
}
