using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class NotificationReceiver : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ThongBao_NguoiDung_NguoiDungMaNguoiDung",
                table: "ThongBao");

            migrationBuilder.DropForeignKey(
                name: "FK_ThongBao_NhanViens_NhanVienMaNhanVien",
                table: "ThongBao");

            migrationBuilder.DropIndex(
                name: "IX_ThongBao_NguoiDungMaNguoiDung",
                table: "ThongBao");

            migrationBuilder.DropIndex(
                name: "IX_ThongBao_NhanVienMaNhanVien",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "DaDoc",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "IsBroadcast",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "MaNguoiDung",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "MaNhanVien",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "NgayDoc",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "NguoiDungMaNguoiDung",
                table: "ThongBao");

            migrationBuilder.DropColumn(
                name: "NhanVienMaNhanVien",
                table: "ThongBao");

            migrationBuilder.AlterColumn<int>(
                name: "LoaiThongBao",
                table: "ThongBao",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<string>(
                name: "LinkChiTiet",
                table: "ThongBao",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

            migrationBuilder.CreateTable(
                name: "ThongBaoNguoiNhan",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaThongBao = table.Column<int>(type: "int", nullable: false),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: true),
                    MaNhanVien = table.Column<int>(type: "int", nullable: true),
                    DaDoc = table.Column<bool>(type: "bit", nullable: false),
                    NgayNhan = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayDoc = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBaoNguoiNhan", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ThongBaoNguoiNhan_NguoiDung_MaNguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThongBaoNguoiNhan_NhanViens_MaNhanVien",
                        column: x => x.MaNhanVien,
                        principalTable: "NhanViens",
                        principalColumn: "MaNhanVien",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ThongBaoNguoiNhan_ThongBao_MaThongBao",
                        column: x => x.MaThongBao,
                        principalTable: "ThongBao",
                        principalColumn: "MaThongBao",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$Dk7pwbQDXoqINkght6Ffdunb6G4Il6saihv4mePlIQQtYjvSWOsi.", new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(1790), new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(1770) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2585));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2592));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2593));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2594));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2594));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2595));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2596));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2597));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2601));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2602));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2603));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2604));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2605));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2606));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2622));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2623));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2624));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 2, 0, 38, 48, 623, DateTimeKind.Local).AddTicks(2635));

            migrationBuilder.CreateIndex(
                name: "IX_ThongBaoNguoiNhan_MaNguoiDung",
                table: "ThongBaoNguoiNhan",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBaoNguoiNhan_MaNhanVien",
                table: "ThongBaoNguoiNhan",
                column: "MaNhanVien");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBaoNguoiNhan_MaThongBao",
                table: "ThongBaoNguoiNhan",
                column: "MaThongBao");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ThongBaoNguoiNhan");

            migrationBuilder.AlterColumn<string>(
                name: "LoaiThongBao",
                table: "ThongBao",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "LinkChiTiet",
                table: "ThongBao",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "DaDoc",
                table: "ThongBao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsBroadcast",
                table: "ThongBao",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "MaNguoiDung",
                table: "ThongBao",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaNhanVien",
                table: "ThongBao",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayDoc",
                table: "ThongBao",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NguoiDungMaNguoiDung",
                table: "ThongBao",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "NhanVienMaNhanVien",
                table: "ThongBao",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$8uJn.8W/Xe2Fi182mPylpOIWsBe9n/qeOmP7N2SATwXIaHmo5gKAu", new DateTime(2026, 7, 1, 23, 57, 54, 834, DateTimeKind.Local).AddTicks(9969), new DateTime(2026, 7, 1, 23, 57, 54, 834, DateTimeKind.Local).AddTicks(9938) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(852));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(860));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(860));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(861));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(863));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(936));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(937));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(947));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(954));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(955));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(957));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(958));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(973));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(974));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(975));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 1, 23, 57, 54, 835, DateTimeKind.Local).AddTicks(978));

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_NguoiDungMaNguoiDung",
                table: "ThongBao",
                column: "NguoiDungMaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_ThongBao_NhanVienMaNhanVien",
                table: "ThongBao",
                column: "NhanVienMaNhanVien");

            migrationBuilder.AddForeignKey(
                name: "FK_ThongBao_NguoiDung_NguoiDungMaNguoiDung",
                table: "ThongBao",
                column: "NguoiDungMaNguoiDung",
                principalTable: "NguoiDung",
                principalColumn: "MaNguoiDung");

            migrationBuilder.AddForeignKey(
                name: "FK_ThongBao_NhanViens_NhanVienMaNhanVien",
                table: "ThongBao",
                column: "NhanVienMaNhanVien",
                principalTable: "NhanViens",
                principalColumn: "MaNhanVien");
        }
    }
}
