using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace travelrecommendationandbookingsystem.Migrations
{
    /// <inheritdoc />
    public partial class Chinh_Sua_Nghiep_Vu_Thanh_Toan_v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LyDoHoanTien",
                table: "ThanhToan",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SoTienHoanThucTe",
                table: "ThanhToan",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AdminNote",
                table: "DonDatTour",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "NgayYeuCauHuy",
                table: "DonDatTour",
                type: "datetime2",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$DcpOfYmi3yTexAFbX0MDwezGqlkbCwjqcwjq3EvYNJWIgNh/si0cC", new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(825), new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(805) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1701));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1708));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1709));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1710));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1711));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1712));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1713));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1715));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1715));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1716));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1717));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1718));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1719));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1720));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1735));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1736));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 12, 29, 47, 885, DateTimeKind.Local).AddTicks(1741));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LyDoHoanTien",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "SoTienHoanThucTe",
                table: "ThanhToan");

            migrationBuilder.DropColumn(
                name: "AdminNote",
                table: "DonDatTour");

            migrationBuilder.DropColumn(
                name: "NgayYeuCauHuy",
                table: "DonDatTour");

            migrationBuilder.UpdateData(
                table: "NhanViens",
                keyColumn: "MaNhanVien",
                keyValue: 1,
                columns: new[] { "MatKhau", "NgayCapNhat", "NgayTao" },
                values: new object[] { "$2a$11$4/TNTPgTi2CscFPNv1RASO99.1kiuYi0h.arAvHEFPkSG6CnmoVw.", new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(2300), new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(2278) });

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 1,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3175));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 2,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3182));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 3,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3183));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 4,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3184));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 5,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3184));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 7,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3187));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 8,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3188));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 9,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3239));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 10,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3241));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 11,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3242));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 12,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3243));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 13,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3244));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 14,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3245));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 15,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3246));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 16,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3246));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 17,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3260));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 18,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3260));

            migrationBuilder.UpdateData(
                table: "ThongTinTrang",
                keyColumn: "MaTTTrang",
                keyValue: 19,
                column: "NgayCapNhat",
                value: new DateTime(2026, 7, 17, 11, 12, 3, 673, DateTimeKind.Local).AddTicks(3265));
        }
    }
}
