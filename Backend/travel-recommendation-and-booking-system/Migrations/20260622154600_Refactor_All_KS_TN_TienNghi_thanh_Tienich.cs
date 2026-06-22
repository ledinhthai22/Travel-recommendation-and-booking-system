using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Refactor_All_KS_TN_TienNghi_thanh_Tienich : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KS_TN_TienNghi_MaTienNghi",
                table: "KS_TN");

            migrationBuilder.RenameColumn(
                name: "TenTienNghi",
                table: "TienNghi",
                newName: "TenTienIch");

            migrationBuilder.RenameColumn(
                name: "MaTienNghi",
                table: "TienNghi",
                newName: "MaTienIch");

            migrationBuilder.RenameColumn(
                name: "MaTienNghi",
                table: "KS_TN",
                newName: "MaTienIch");

            migrationBuilder.RenameIndex(
                name: "IX_KS_TN_MaTienNghi",
                table: "KS_TN",
                newName: "IX_KS_TN_MaTienIch");

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

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TN_TienNghi_MaTienIch",
                table: "KS_TN",
                column: "MaTienIch",
                principalTable: "TienNghi",
                principalColumn: "MaTienIch",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_KS_TN_TienNghi_MaTienIch",
                table: "KS_TN");

            migrationBuilder.RenameColumn(
                name: "TenTienIch",
                table: "TienNghi",
                newName: "TenTienNghi");

            migrationBuilder.RenameColumn(
                name: "MaTienIch",
                table: "TienNghi",
                newName: "MaTienNghi");

            migrationBuilder.RenameColumn(
                name: "MaTienIch",
                table: "KS_TN",
                newName: "MaTienNghi");

            migrationBuilder.RenameIndex(
                name: "IX_KS_TN_MaTienIch",
                table: "KS_TN",
                newName: "IX_KS_TN_MaTienNghi");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$VY4w1Yh5NoL3eHT95uOgJeu21gvYbk3ipckHA3k8EoTWhCeegEHrq", new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(8568), new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(8528) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9220));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9227));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9228));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9229));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9229));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9230));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9231));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9231));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9232));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9233));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9234));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9235));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9236));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9236));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9243));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9244));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 22, 22, 23, 46, 87, DateTimeKind.Local).AddTicks(9245));

            migrationBuilder.AddForeignKey(
                name: "FK_KS_TN_TienNghi_MaTienNghi",
                table: "KS_TN",
                column: "MaTienNghi",
                principalTable: "TienNghi",
                principalColumn: "MaTienNghi",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
