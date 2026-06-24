using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Doi_ten_TienNghi_Thanh_TienIch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KS_TI_TienNghi_MaTienIch",
                table: "KS_TI");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TienNghi",
                table: "TienNghi");

            migrationBuilder.RenameTable(
                name: "TienNghi",
                newName: "TienIch");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TienIch",
                table: "TienIch",
                column: "MaTienIch");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$4kTchbpYUVrdFouQ4cYK2e5DhYhFsVxs0H607ZQYJEmlXuWLjhhnK", new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(3570), new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(3538) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4175));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4181));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4182));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4183));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4185));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4185));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4186));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4187));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4189));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4190));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4190));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4191));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4192));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4194));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4202));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4203));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 24, 13, 2, 47, 217, DateTimeKind.Local).AddTicks(4204));

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TI_TienIch_MaTienIch",
                table: "KS_TI",
                column: "MaTienIch",
                principalTable: "TienIch",
                principalColumn: "MaTienIch",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KS_TI_TienIch_MaTienIch",
                table: "KS_TI");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TienIch",
                table: "TienIch");

            migrationBuilder.RenameTable(
                name: "TienIch",
                newName: "TienNghi");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TienNghi",
                table: "TienNghi",
                column: "MaTienIch");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$WtnVqrqPJiMNG5QBCs6xX.58FxVP1m76cIaoiXUx3IfQX8XNiKMUq", new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3403), new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3360) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3936));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3943));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3944));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3945));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3945));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3946));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3947));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3947));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3949));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3950));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3951));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3952));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3952));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3953));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3959));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3960));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 23, 23, 2, 17, 133, DateTimeKind.Local).AddTicks(3962));

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TI_TienNghi_MaTienIch",
                table: "KS_TI",
                column: "MaTienIch",
                principalTable: "TienNghi",
                principalColumn: "MaTienIch",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
