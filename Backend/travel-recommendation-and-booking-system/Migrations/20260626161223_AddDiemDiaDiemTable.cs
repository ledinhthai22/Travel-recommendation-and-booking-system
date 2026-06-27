using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AddDiemDiaDiemTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SoThichDiaDiemNguoiDungs",
                columns: table => new
                {
                    MaDiemDiaDiem = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaDiaDiem = table.Column<int>(type: "int", nullable: false),
                    DiemYeuThich = table.Column<float>(type: "real", nullable: false),
                    NguoiDungMaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    DiaDiemMaDiaDiem = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoThichDiaDiemNguoiDungs", x => x.MaDiemDiaDiem);
                    table.ForeignKey(
                        name: "FK_SoThichDiaDiemNguoiDungs_DiaDiem_DiaDiemMaDiaDiem",
                        column: x => x.DiaDiemMaDiaDiem,
                        principalTable: "DiaDiem",
                        principalColumn: "MaDiaDiem",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SoThichDiaDiemNguoiDungs_NguoiDung_NguoiDungMaNguoiDung",
                        column: x => x.NguoiDungMaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$i0aNwKSxAMBAUxa/w0Jv8OzCRMEkWnPKcfXVuyYq54qcpcoZcv/u2", new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(5726), new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(5710) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6389));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6396));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6397));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6398));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6399));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6399));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6400));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6401));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6402));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6403));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6403));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6404));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6405));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6406));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6412));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6413));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 26, 23, 12, 20, 66, DateTimeKind.Local).AddTicks(6414));

            migrationBuilder.CreateIndex(
                name: "IX_SoThichDiaDiemNguoiDungs_DiaDiemMaDiaDiem",
                table: "SoThichDiaDiemNguoiDungs",
                column: "DiaDiemMaDiaDiem");

            migrationBuilder.CreateIndex(
                name: "IX_SoThichDiaDiemNguoiDungs_NguoiDungMaNguoiDung",
                table: "SoThichDiaDiemNguoiDungs",
                column: "NguoiDungMaNguoiDung");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SoThichDiaDiemNguoiDungs");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$vfavxFJZwH7.QFUdC5AipueVxYq1pc.eEu7lFM6UOPYb5G/491pJK", new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5068), new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5053) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5727));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5733));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5734));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5735));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5736));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5736));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5737));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5820));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5822));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5823));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5823));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5824));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5825));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5826));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5831));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5832));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 25, 23, 9, 32, 138, DateTimeKind.Local).AddTicks(5833));
        }
    }
}
