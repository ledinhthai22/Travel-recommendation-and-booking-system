using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class AllowNullMaDiaDiemInCTLichTrinh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CTLichTrinh_DiaDiem_MaDiaDiem",
                table: "CTLichTrinh");

            migrationBuilder.AlterColumn<int>(
                name: "MaDiaDiem",
                table: "CTLichTrinh",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$eSCQFRYZcWnEyD15rQz7ouul.hD80o3FZm4xrtEesohvr1MvBz9Yu", new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1092), new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1068) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1868));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1876));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1876));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1877));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1878));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1879));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1879));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1880));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1882));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1956));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1957));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1958));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1959));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1961));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1962));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 8, 18, 34, 16, 439, DateTimeKind.Local).AddTicks(1963));

            migrationBuilder.AddForeignKey(
                name: "FK_CTLichTrinh_DiaDiem_MaDiaDiem",
                table: "CTLichTrinh",
                column: "MaDiaDiem",
                principalTable: "DiaDiem",
                principalColumn: "MaDiaDiem");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CTLichTrinh_DiaDiem_MaDiaDiem",
                table: "CTLichTrinh");

            migrationBuilder.AlterColumn<int>(
                name: "MaDiaDiem",
                table: "CTLichTrinh",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$bkiGV/8sxk.0LlQRpiOS9uRHD3Ep1M50i3285AQ.eDo.zPZ4H29qe", new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(8695), new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(8672) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9488));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9496));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9497));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9498));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9499));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9500));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9500));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9501));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9503));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9504));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9505));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9506));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9507));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9508));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9509));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9510));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9511));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 6, 19, 46, 31, 596, DateTimeKind.Local).AddTicks(9532));

            migrationBuilder.AddForeignKey(
                name: "FK_CTLichTrinh_DiaDiem_MaDiaDiem",
                table: "CTLichTrinh",
                column: "MaDiaDiem",
                principalTable: "DiaDiem",
                principalColumn: "MaDiaDiem",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
