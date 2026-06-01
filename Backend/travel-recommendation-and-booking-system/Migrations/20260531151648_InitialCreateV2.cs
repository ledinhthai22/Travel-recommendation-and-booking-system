using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebDuLich.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateV2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Banner",
                columns: table => new
                {
                    MaBanner = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DuongDanAnh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    LinkLienKet = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Banner", x => x.MaBanner);
                });

            migrationBuilder.CreateTable(
                name: "DiaDiem",
                columns: table => new
                {
                    MaDiaDiem = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDiaDiem = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DuongDanAnh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    LoaiDiaDiem = table.Column<int>(type: "int", nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TinhThanh = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    QuocGia = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    KhuVuc = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiaDiem", x => x.MaDiaDiem);
                });

            migrationBuilder.CreateTable(
                name: "KhachSan",
                columns: table => new
                {
                    MaKhachSan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenKhachSan = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SoSao = table.Column<int>(type: "int", nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachSan", x => x.MaKhachSan);
                });

            migrationBuilder.CreateTable(
                name: "LienHe",
                columns: table => new
                {
                    MaLienHe = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HoTen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LienHe", x => x.MaLienHe);
                });

            migrationBuilder.CreateTable(
                name: "LoaiHinhTour",
                columns: table => new
                {
                    MaLoaiTour = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenLoaiTour = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoaiHinhTour", x => x.MaLoaiTour);
                });

            migrationBuilder.CreateTable(
                name: "Newsletter",
                columns: table => new
                {
                    MaNewsletter = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    NgayGui = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Newsletter", x => x.MaNewsletter);
                });

            migrationBuilder.CreateTable(
                name: "PhuongTien",
                columns: table => new
                {
                    MaPhuongTien = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenPhuongTien = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhuongTien", x => x.MaPhuongTien);
                });

            migrationBuilder.CreateTable(
                name: "ThongTinTrang",
                columns: table => new
                {
                    MaTTTrang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Key = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Noidung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Trangthai = table.Column<bool>(type: "bit", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongTinTrang", x => x.MaTTTrang);
                });

            migrationBuilder.CreateTable(
                name: "TienNghi",
                columns: table => new
                {
                    MaTienNghi = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenTienNghi = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TienNghi", x => x.MaTienNghi);
                });

            migrationBuilder.CreateTable(
                name: "UuDai",
                columns: table => new
                {
                    MaUuDai = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaCode = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TenUuDai = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    PhanTramGiam = table.Column<float>(type: "real", nullable: false),
                    DieuKienApDung = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NgayBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayHetHan = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoLuongToiDa = table.Column<int>(type: "int", nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UuDai", x => x.MaUuDai);
                });

            migrationBuilder.CreateTable(
                name: "VaiTro",
                columns: table => new
                {
                    MaVaiTro = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenVaiTro = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaiTro", x => x.MaVaiTro);
                });

            migrationBuilder.CreateTable(
                name: "HinhAnhSK",
                columns: table => new
                {
                    MaAnhSK = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaKhachSan = table.Column<int>(type: "int", nullable: false),
                    DuongDanAnh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AnhChinh = table.Column<bool>(type: "bit", nullable: false),
                    SoThuTu = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HinhAnhSK", x => x.MaAnhSK);
                    table.ForeignKey(
                        name: "FK_HinhAnhSK_KhachSan_MaKhachSan",
                        column: x => x.MaKhachSan,
                        principalTable: "KhachSan",
                        principalColumn: "MaKhachSan",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tour",
                columns: table => new
                {
                    MaTour = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaLoaiTour = table.Column<int>(type: "int", nullable: false),
                    TenTour = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoiGianTour = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SoLuongToiDa = table.Column<int>(type: "int", nullable: false),
                    LuotDat = table.Column<int>(type: "int", nullable: false),
                    LuotXem = table.Column<int>(type: "int", nullable: false),
                    DiemKhoiHanh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tour", x => x.MaTour);
                    table.ForeignKey(
                        name: "FK_Tour_LoaiHinhTour_MaLoaiTour",
                        column: x => x.MaLoaiTour,
                        principalTable: "LoaiHinhTour",
                        principalColumn: "MaLoaiTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KS_TN",
                columns: table => new
                {
                    MaKhachSan = table.Column<int>(type: "int", nullable: false),
                    MaTienNghi = table.Column<int>(type: "int", nullable: false),
                    KhachSanMaKhachSan = table.Column<int>(type: "int", nullable: false),
                    TienNghiMaTienNghi = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KS_TN", x => new { x.MaKhachSan, x.MaTienNghi });
                    table.ForeignKey(
                        name: "FK_KS_TN_KhachSan_KhachSanMaKhachSan",
                        column: x => x.KhachSanMaKhachSan,
                        principalTable: "KhachSan",
                        principalColumn: "MaKhachSan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_KS_TN_TienNghi_TienNghiMaTienNghi",
                        column: x => x.TienNghiMaTienNghi,
                        principalTable: "TienNghi",
                        principalColumn: "MaTienNghi",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NguoiDung",
                columns: table => new
                {
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaVaiTro = table.Column<int>(type: "int", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DiaChi = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(64)", maxLength: 64, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NguoiDung", x => x.MaNguoiDung);
                    table.ForeignKey(
                        name: "FK_NguoiDung_VaiTro_MaVaiTro",
                        column: x => x.MaVaiTro,
                        principalTable: "VaiTro",
                        principalColumn: "MaVaiTro",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HinhAnhTour",
                columns: table => new
                {
                    MaAnhTour = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    DuongDanAnh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    AnhChinh = table.Column<bool>(type: "bit", nullable: false),
                    SoThuTu = table.Column<int>(type: "int", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HinhAnhTour", x => x.MaAnhTour);
                    table.ForeignKey(
                        name: "FK_HinhAnhTour_Tour_MaTour",
                        column: x => x.MaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "LichTrinh",
                columns: table => new
                {
                    MaLichTrinh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    TenLichTrinh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DuongDanAnh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    BuaAn = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SoThuTuNgay = table.Column<int>(type: "int", nullable: false),
                    HoatDongChinh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    LuuY = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LichTrinh", x => x.MaLichTrinh);
                    table.ForeignKey(
                        name: "FK_LichTrinh_Tour_MaTour",
                        column: x => x.MaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Tour_KhachSan",
                columns: table => new
                {
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    MaKhachSan = table.Column<int>(type: "int", nullable: false),
                    TourMaTour = table.Column<int>(type: "int", nullable: false),
                    KhachSanMaKhachSan = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tour_KhachSan", x => new { x.MaTour, x.MaKhachSan });
                    table.ForeignKey(
                        name: "FK_Tour_KhachSan_KhachSan_KhachSanMaKhachSan",
                        column: x => x.KhachSanMaKhachSan,
                        principalTable: "KhachSan",
                        principalColumn: "MaKhachSan",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Tour_KhachSan_Tour_TourMaTour",
                        column: x => x.TourMaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChuyenKhoiHanh",
                columns: table => new
                {
                    MaChuyen = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaHDV = table.Column<int>(type: "int", nullable: false),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    MaPhuongTien = table.Column<int>(type: "int", nullable: false),
                    MaChuyenCode = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    TenChuyen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DiemKhoiHanh = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    DiemDen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    NgayKhoiHanh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GioDenNoiDi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayKetThuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GioDenNoiVe = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SoLuongCho = table.Column<int>(type: "int", nullable: false),
                    GhiChu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChuyenKhoiHanh", x => x.MaChuyen);
                    table.ForeignKey(
                        name: "FK_ChuyenKhoiHanh_NguoiDung_MaHDV",
                        column: x => x.MaHDV,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChuyenKhoiHanh_PhuongTien_MaPhuongTien",
                        column: x => x.MaPhuongTien,
                        principalTable: "PhuongTien",
                        principalColumn: "MaPhuongTien",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChuyenKhoiHanh_Tour_MaTour",
                        column: x => x.MaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DanhGia",
                columns: table => new
                {
                    MaDanhGia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    DiemDanhGia = table.Column<int>(type: "int", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrangThai = table.Column<bool>(type: "bit", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhGia", x => x.MaDanhGia);
                    table.ForeignKey(
                        name: "FK_DanhGia_NguoiDung_MaNguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DanhGia_Tour_MaTour",
                        column: x => x.MaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DanhSachYeuThich",
                columns: table => new
                {
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaTour = table.Column<int>(type: "int", nullable: false),
                    NguoiDungMaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    TourMaTour = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DanhSachYeuThich", x => new { x.MaNguoiDung, x.MaTour });
                    table.ForeignKey(
                        name: "FK_DanhSachYeuThich_NguoiDung_NguoiDungMaNguoiDung",
                        column: x => x.NguoiDungMaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DanhSachYeuThich_Tour_TourMaTour",
                        column: x => x.TourMaTour,
                        principalTable: "Tour",
                        principalColumn: "MaTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SoThichNguoiDung",
                columns: table => new
                {
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaLoaiTour = table.Column<int>(type: "int", nullable: false),
                    DiemYeuThich = table.Column<float>(type: "real", nullable: false),
                    NguoiDungMaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    LoaiHinhTourMaLoaiTour = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SoThichNguoiDung", x => new { x.MaNguoiDung, x.MaLoaiTour });
                    table.ForeignKey(
                        name: "FK_SoThichNguoiDung_LoaiHinhTour_LoaiHinhTourMaLoaiTour",
                        column: x => x.LoaiHinhTourMaLoaiTour,
                        principalTable: "LoaiHinhTour",
                        principalColumn: "MaLoaiTour",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SoThichNguoiDung_NguoiDung_NguoiDungMaNguoiDung",
                        column: x => x.NguoiDungMaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CTLichTrinh",
                columns: table => new
                {
                    MaCTLT = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaLichTrinh = table.Column<int>(type: "int", nullable: false),
                    MaDiaDiem = table.Column<int>(type: "int", nullable: false),
                    GioBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GioKetThuc = table.Column<DateTime>(type: "datetime2", nullable: false),
                    HoatDong = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CTLichTrinh", x => x.MaCTLT);
                    table.ForeignKey(
                        name: "FK_CTLichTrinh_DiaDiem_MaDiaDiem",
                        column: x => x.MaDiaDiem,
                        principalTable: "DiaDiem",
                        principalColumn: "MaDiaDiem",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CTLichTrinh_LichTrinh_MaLichTrinh",
                        column: x => x.MaLichTrinh,
                        principalTable: "LichTrinh",
                        principalColumn: "MaLichTrinh",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DonDatTour",
                columns: table => new
                {
                    MaDonDatTour = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNguoiDung = table.Column<int>(type: "int", nullable: false),
                    MaChuyen = table.Column<int>(type: "int", nullable: false),
                    MaDatCho = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    MaKhachSan = table.Column<int>(type: "int", nullable: true),
                    MaUuDai = table.Column<int>(type: "int", nullable: true),
                    SoNguoiLon = table.Column<int>(type: "int", nullable: false),
                    SoTreEm = table.Column<int>(type: "int", nullable: false),
                    SoEmBe = table.Column<int>(type: "int", nullable: false),
                    NgayDat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TongTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TrangThaiThanhToan = table.Column<bool>(type: "bit", nullable: false),
                    TrangThaiDon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DonDatTour", x => x.MaDonDatTour);
                    table.ForeignKey(
                        name: "FK_DonDatTour_ChuyenKhoiHanh_MaChuyen",
                        column: x => x.MaChuyen,
                        principalTable: "ChuyenKhoiHanh",
                        principalColumn: "MaChuyen",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DonDatTour_KhachSan_MaKhachSan",
                        column: x => x.MaKhachSan,
                        principalTable: "KhachSan",
                        principalColumn: "MaKhachSan");
                    table.ForeignKey(
                        name: "FK_DonDatTour_NguoiDung_MaNguoiDung",
                        column: x => x.MaNguoiDung,
                        principalTable: "NguoiDung",
                        principalColumn: "MaNguoiDung",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DonDatTour_UuDai_MaUuDai",
                        column: x => x.MaUuDai,
                        principalTable: "UuDai",
                        principalColumn: "MaUuDai");
                });

            migrationBuilder.CreateTable(
                name: "GiaChuyen",
                columns: table => new
                {
                    MaGia = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Machuyen = table.Column<int>(type: "int", nullable: false),
                    HangKhachSan = table.Column<int>(type: "int", nullable: false),
                    GiaNguoiLon = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiaTreEm = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    GiaEmBe = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PhuThuPhongDon = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayCapNhat = table.Column<DateTime>(type: "datetime2", nullable: false),
                    NgayXoa = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GiaChuyen", x => x.MaGia);
                    table.ForeignKey(
                        name: "FK_GiaChuyen_ChuyenKhoiHanh_Machuyen",
                        column: x => x.Machuyen,
                        principalTable: "ChuyenKhoiHanh",
                        principalColumn: "MaChuyen",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "KhachHang",
                columns: table => new
                {
                    MaKhachHang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaDonDatTour = table.Column<int>(type: "int", nullable: false),
                    HoTen = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    SoDienThoai = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LoaiKhach = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhachHang", x => x.MaKhachHang);
                    table.ForeignKey(
                        name: "FK_KhachHang_DonDatTour_MaDonDatTour",
                        column: x => x.MaDonDatTour,
                        principalTable: "DonDatTour",
                        principalColumn: "MaDonDatTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ThanhToan",
                columns: table => new
                {
                    MaThanhToan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PhuongThucThanhToan = table.Column<bool>(type: "bit", nullable: false),
                    MaDonDatTour = table.Column<int>(type: "int", nullable: false),
                    MaGiaoDich = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayThanhToan = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TrangThaiThanhToan = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThanhToan", x => x.MaThanhToan);
                    table.ForeignKey(
                        name: "FK_ThanhToan_DonDatTour_MaDonDatTour",
                        column: x => x.MaDonDatTour,
                        principalTable: "DonDatTour",
                        principalColumn: "MaDonDatTour",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_MaHDV",
                table: "ChuyenKhoiHanh",
                column: "MaHDV");

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_MaPhuongTien",
                table: "ChuyenKhoiHanh",
                column: "MaPhuongTien");

            migrationBuilder.CreateIndex(
                name: "IX_ChuyenKhoiHanh_MaTour",
                table: "ChuyenKhoiHanh",
                column: "MaTour");

            migrationBuilder.CreateIndex(
                name: "IX_CTLichTrinh_MaDiaDiem",
                table: "CTLichTrinh",
                column: "MaDiaDiem");

            migrationBuilder.CreateIndex(
                name: "IX_CTLichTrinh_MaLichTrinh",
                table: "CTLichTrinh",
                column: "MaLichTrinh");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_MaNguoiDung",
                table: "DanhGia",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_DanhGia_MaTour",
                table: "DanhGia",
                column: "MaTour");

            migrationBuilder.CreateIndex(
                name: "IX_DanhSachYeuThich_NguoiDungMaNguoiDung",
                table: "DanhSachYeuThich",
                column: "NguoiDungMaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_DanhSachYeuThich_TourMaTour",
                table: "DanhSachYeuThich",
                column: "TourMaTour");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaChuyen",
                table: "DonDatTour",
                column: "MaChuyen");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaKhachSan",
                table: "DonDatTour",
                column: "MaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaNguoiDung",
                table: "DonDatTour",
                column: "MaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_DonDatTour_MaUuDai",
                table: "DonDatTour",
                column: "MaUuDai");

            migrationBuilder.CreateIndex(
                name: "IX_GiaChuyen_Machuyen",
                table: "GiaChuyen",
                column: "Machuyen");

            migrationBuilder.CreateIndex(
                name: "IX_HinhAnhSK_MaKhachSan",
                table: "HinhAnhSK",
                column: "MaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_HinhAnhTour_MaTour",
                table: "HinhAnhTour",
                column: "MaTour");

            migrationBuilder.CreateIndex(
                name: "IX_KhachHang_MaDonDatTour",
                table: "KhachHang",
                column: "MaDonDatTour");

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_KhachSanMaKhachSan",
                table: "KS_TN",
                column: "KhachSanMaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_KS_TN_TienNghiMaTienNghi",
                table: "KS_TN",
                column: "TienNghiMaTienNghi");

            migrationBuilder.CreateIndex(
                name: "IX_LichTrinh_MaTour",
                table: "LichTrinh",
                column: "MaTour");

            migrationBuilder.CreateIndex(
                name: "IX_NguoiDung_MaVaiTro",
                table: "NguoiDung",
                column: "MaVaiTro");

            migrationBuilder.CreateIndex(
                name: "IX_SoThichNguoiDung_LoaiHinhTourMaLoaiTour",
                table: "SoThichNguoiDung",
                column: "LoaiHinhTourMaLoaiTour");

            migrationBuilder.CreateIndex(
                name: "IX_SoThichNguoiDung_NguoiDungMaNguoiDung",
                table: "SoThichNguoiDung",
                column: "NguoiDungMaNguoiDung");

            migrationBuilder.CreateIndex(
                name: "IX_ThanhToan_MaDonDatTour",
                table: "ThanhToan",
                column: "MaDonDatTour");

            migrationBuilder.CreateIndex(
                name: "IX_Tour_MaLoaiTour",
                table: "Tour",
                column: "MaLoaiTour");

            migrationBuilder.CreateIndex(
                name: "IX_Tour_KhachSan_KhachSanMaKhachSan",
                table: "Tour_KhachSan",
                column: "KhachSanMaKhachSan");

            migrationBuilder.CreateIndex(
                name: "IX_Tour_KhachSan_TourMaTour",
                table: "Tour_KhachSan",
                column: "TourMaTour");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Banner");

            migrationBuilder.DropTable(
                name: "CTLichTrinh");

            migrationBuilder.DropTable(
                name: "DanhGia");

            migrationBuilder.DropTable(
                name: "DanhSachYeuThich");

            migrationBuilder.DropTable(
                name: "GiaChuyen");

            migrationBuilder.DropTable(
                name: "HinhAnhSK");

            migrationBuilder.DropTable(
                name: "HinhAnhTour");

            migrationBuilder.DropTable(
                name: "KhachHang");

            migrationBuilder.DropTable(
                name: "KS_TN");

            migrationBuilder.DropTable(
                name: "LienHe");

            migrationBuilder.DropTable(
                name: "Newsletter");

            migrationBuilder.DropTable(
                name: "SoThichNguoiDung");

            migrationBuilder.DropTable(
                name: "ThanhToan");

            migrationBuilder.DropTable(
                name: "ThongTinTrang");

            migrationBuilder.DropTable(
                name: "Tour_KhachSan");

            migrationBuilder.DropTable(
                name: "DiaDiem");

            migrationBuilder.DropTable(
                name: "LichTrinh");

            migrationBuilder.DropTable(
                name: "TienNghi");

            migrationBuilder.DropTable(
                name: "DonDatTour");

            migrationBuilder.DropTable(
                name: "ChuyenKhoiHanh");

            migrationBuilder.DropTable(
                name: "KhachSan");

            migrationBuilder.DropTable(
                name: "UuDai");

            migrationBuilder.DropTable(
                name: "NguoiDung");

            migrationBuilder.DropTable(
                name: "PhuongTien");

            migrationBuilder.DropTable(
                name: "Tour");

            migrationBuilder.DropTable(
                name: "VaiTro");

            migrationBuilder.DropTable(
                name: "LoaiHinhTour");
        }
    }
}
