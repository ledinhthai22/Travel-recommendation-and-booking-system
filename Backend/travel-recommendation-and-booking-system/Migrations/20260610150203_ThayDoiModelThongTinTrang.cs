using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class ThayDoiModelThongTinTrang : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Noidung",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayCapNhat",
                table: "ThongTinTrang",
                type: "datetime2",
                nullable: true,
                oldClrType: typeof(DateTime),
                oldType: "datetime2");

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayXoa",
                table: "ThongTinTrang",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$YQEA9E49PrWtqK29gjmBaOotj0/wRGCPy.y.wkrJ8RsYmZHClh8u2", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(7946), new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(7922) });

            migrationBuilder.InsertData(
                table: "ThongTinTrang",
                columns: new[] { "MaTTTrang", "Key", "NgayCapNhat", "NgayXoa", "Noidung", "Trangthai" },
                values: new object[,]
                {
                    { 1, "logo_url", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8481), null, null, true },
                    { 2, "ten_trang", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8491), null, null, true },
                    { 3, "facebook_url", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8491), null, null, true },
                    { 4, "dia_chi", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8492), null, null, true },
                    { 5, "so_dien_thoai", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8493), null, null, true },
                    { 6, "footer_copyright", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8494), null, null, true },
                    { 7, "email_hotro", new DateTime(2026, 6, 10, 22, 2, 1, 816, DateTimeKind.Local).AddTicks(8494), null, null, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7);

            migrationBuilder.DropColumn(
                name: "NgayXoa",
                table: "ThongTinTrang");

            migrationBuilder.AlterColumn<string>(
                name: "Noidung",
                table: "ThongTinTrang",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTime>(
                name: "NgayCapNhat",
                table: "ThongTinTrang",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                oldClrType: typeof(DateTime),
                oldType: "datetime2",
                oldNullable: true);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$59Gp2k50lWt5bdCH.3b83.P23/xApSVooAC5rnLyoIDtcSkyQrGWK", new DateTime(2026, 6, 6, 11, 45, 55, 125, DateTimeKind.Local).AddTicks(3814), new DateTime(2026, 6, 6, 11, 45, 55, 125, DateTimeKind.Local).AddTicks(3787) });
        }
    }
}
