using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class NgayXoa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "NgayXoa",
                table: "LoaiDiaDiem",
                newName: "Ngayxoa");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$mUZmt9PUTyOli9vDfnXt0O4OSX3D7ivxA7RWQC/xbLKKVh6v7Rb/G", new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9155), new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9141) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9555));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9561));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9562));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9580));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9580));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9581));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9588));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9599));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9600));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9601));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9602));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9603));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9604));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9605));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9606));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9606));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 42, 6, 71, DateTimeKind.Local).AddTicks(9607));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Ngayxoa",
                table: "LoaiDiaDiem",
                newName: "NgayXoa");

            migrationBuilder.UpdateData(
                table: "NguoiDung",
                keyColumn: "MaNguoiDung",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$c1tcR33g2RgUAIxhPPFJVucs8wVy66r2QvpQ/vfTAIgPLB8JHO1Uq", new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(7456), new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(7438) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8032));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8038));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8039));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8040));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8041));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8041));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8042));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8043));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8044));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8045));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8046));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8126));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8127));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8129));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8130));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8131));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 6, 16, 21, 21, 19, 406, DateTimeKind.Local).AddTicks(8131));
        }
    }
}
