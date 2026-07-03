using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Them_So_Lan_Otp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LanGuiOtpGanNhat",
                table: "NguoiDung",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LanNhapSaiOtpGanNhat",
                table: "NguoiDung",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SoLanNhapSaiOtp",
                table: "NguoiDung",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$EwHQvQyp99JOsWNoACyWzeDoZbn7VOQ.sihs1ZIWBfaIaeMJbByWa", new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(5956), new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(5935) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6768));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6776));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6777));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6777));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6778));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6779));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6779));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6780));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6782));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6782));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6783));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6784));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6785));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6786));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6798));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6799));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6800));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 3, 11, 0, 39, 70, DateTimeKind.Local).AddTicks(6804));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LanGuiOtpGanNhat",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "LanNhapSaiOtpGanNhat",
                table: "NguoiDung");

            migrationBuilder.DropColumn(
                name: "SoLanNhapSaiOtp",
                table: "NguoiDung");

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
        }
    }
}
