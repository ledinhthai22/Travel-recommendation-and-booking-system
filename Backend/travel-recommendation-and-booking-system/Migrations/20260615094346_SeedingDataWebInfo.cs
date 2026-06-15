using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class SeedingDataWebInfo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 6);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$go6kzBi0Cr2AHF1omkz/b.gSeYTdRbEb7MrVO3gwiVxkpvpxONqde", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(3553), new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(3531) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4080));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4086));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4087));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4112));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4113));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4121));

            migrationBuilder.InsertData(
                table: "ThongTinTrang",
                columns: new[] { "MaTTTrang", "Key", "NgayCapNhat", "NgayXoa", "Noidung", "Trangthai" },
                values: new object[,]
                {
                    { 9, "faq_1_question", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4133), null, null, true },
                    { 10, "faq_1_answer", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4134), null, null, true },
                    { 11, "faq_2_question", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4135), null, null, true },
                    { 12, "faq_2_answer", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4136), null, null, true },
                    { 13, "faq_3_question", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4136), null, null, true },
                    { 14, "faq_3_answer", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4137), null, null, true },
                    { 15, "faq_4_question", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4138), null, null, true },
                    { 16, "faq_4_answer", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4139), null, null, true },
                    { 17, "faq_5_question", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4140), null, null, true },
                    { 18, "faq_5_answer", new DateTime(2026, 6, 15, 16, 43, 45, 270, DateTimeKind.Local).AddTicks(4141), null, null, true }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18);

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$KkeWyAXYiRRCsAIAEhiIOevqu3CKWn/ccRXgwgxSkYWn/dDrcXhce", new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(3669), new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(3646) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4339));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4348));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4349));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4349));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4351));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4352));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4353));

            migrationBuilder.InsertData(
                table: "ThongTinTrang",
                columns: new[] { "MaTTTrang", "Key", "NgayCapNhat", "NgayXoa", "Noidung", "Trangthai" },
                values: new object[] { 6, "footer_copyright", new DateTime(2026, 6, 14, 9, 34, 22, 844, DateTimeKind.Local).AddTicks(4352), null, null, true });
        }
    }
}
