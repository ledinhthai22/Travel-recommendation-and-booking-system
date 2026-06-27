using Microsoft.EntityFrameworkCore;
using travel_recommendation_and_booking_system.Models;
namespace travel_recommendation_and_booking_system.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<VaiTro> VaiTros { get; set; }
        public DbSet<NguoiDung> NguoiDungs { get; set; }
        public DbSet<NhanVien> NhanViens { get; set; }
        public DbSet<DiaDiem> DiaDiems { get; set; }
        public DbSet<KhachSan> KhachSans { get; set; }
        public DbSet<SoThichDiaDiemNguoiDung> SoThichDiaDiemNguoiDungs { get; set; }
        public DbSet<HinhAnhSK> HinhAnhSKs { get; set; }
        public DbSet<TienIch> TienIches { get; set; }
        public DbSet<LoaiDiaDiem> LoaiDiaDiem { get; set; }
        public DbSet<KS_TI> KS_TNs { get; set; }
        public DbSet<CLoaiHinhTour> LoaiHinhTours { get; set; }
        public DbSet<Tour> Tours { get; set; }
        public DbSet<HinhAnhTour> HinhAnhTours { get; set; }
        public DbSet<PhuongTien> PhuongTiens { get; set; }
        public DbSet<ChuyenKhoiHanh> ChuyenKhoiHanhs { get; set; }
        public DbSet<GiaChuyen> GiaChuyens { get; set; }
        public DbSet<Tour_KhachSan> Tour_KhachSans { get; set; }
        public DbSet<LichTrinh> LichTrinhs { get; set; }
        public DbSet<CTLichTrinh> CTLichTrinhs { get; set; }
        public DbSet<UuDai> UuDais { get; set; }
        public DbSet<DonDatTour> DonDatTours { get; set; }
        public DbSet<KhachHang> KhachHangs { get; set; }
        public DbSet<ThanhToan> ThanhToans { get; set; }
        public DbSet<SoThichNguoiDung> SoThichNguoiDungs { get; set; }
        public DbSet<DanhSachYeuThich> DanhSachYeuThichs { get; set; }
        public DbSet<DanhGia> DanhGias { get; set; }
        public DbSet<ThongTinTrang> TrangThongTins { get; set; }
        public DbSet<Banner> Banners { get; set; }
        public DbSet<LienHe> LienHes { get; set; }
        public DbSet<Newsletter> Newsletters { get; set; }
        public DbSet<PhienDangNhap> PhienDangNhaps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<KS_TI>(entity =>
            {

                entity.HasKey(kt => new { kt.MaKhachSan, kt.MaTienIch });


                entity.HasOne(x => x.KhachSan)
                      .WithMany(x => x.KS_TNs)
                      .HasForeignKey(x => x.MaKhachSan);

                entity.HasOne(x => x.TienIch)
                      .WithMany(x => x.KS_TNs)
                      .HasForeignKey(x => x.MaTienIch);


                entity.HasIndex(x => x.MaTienIch)
                      .HasDatabaseName("IX_KS_TN_MaTienIch");
            });

            modelBuilder.Entity<Tour_KhachSan>(entity =>
            {
                entity.HasKey(tk => new { tk.MaTour, tk.MaKhachSan });

                entity.HasOne(tk => tk.Tour)
                      .WithMany(t => t.Tour_KhachSans)
                      .HasForeignKey(tk => tk.MaTour);

                entity.HasOne(tk => tk.KhachSan)
                      .WithMany(ks => ks.Tour_KhachSans)
                      .HasForeignKey(tk => tk.MaKhachSan);

                entity.HasIndex(tk => tk.MaKhachSan)
                      .HasDatabaseName("IX_Tour_KhachSan_MaKhachSan");
            });

            modelBuilder.Entity<SoThichNguoiDung>().HasKey(sn => new { sn.MaNguoiDung, sn.MaLoaiTour });

            modelBuilder.Entity<DanhSachYeuThich>(entity =>
            {
                entity.HasKey(yt => new { yt.MaNguoiDung, yt.MaTour });

                entity.HasOne(yt => yt.NguoiDung)
                      .WithMany(nd => nd.DanhSachYeuThichs)
                      .HasForeignKey(yt => yt.MaNguoiDung);

                entity.HasOne(yt => yt.Tour)
                      .WithMany(t => t.DanhSachYeuThichs)
                      .HasForeignKey(yt => yt.MaTour);

                entity.HasIndex(yt => yt.MaTour)
                      .HasDatabaseName("IX_DanhSachYeuThich_MaTour");
            });

            modelBuilder.Entity<DonDatTour>()
                .HasOne(d => d.NguoiDung)
                .WithMany(n => n.DonDatTours)
                .HasForeignKey(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<DonDatTour>()
                .HasOne(d => d.ChuyenKhoiHanh)
                .WithMany(c => c.DonDatTours)
                .HasForeignKey(d => d.MaChuyen)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<VaiTro>().HasData(
                    new VaiTro { MaVaiTro = 1, TenVaiTro = "Quản Trị Viên" },
                    new VaiTro { MaVaiTro = 2, TenVaiTro = "Nhân Viên" },
                    new VaiTro { MaVaiTro = 3, TenVaiTro = "Hướng Dẫn Viên" },
                    new VaiTro { MaVaiTro = 4, TenVaiTro = "Khách Hàng" }
                );

            modelBuilder.Entity<NguoiDung>().HasData(
                    new NguoiDung
                    {
                        MaNguoiDung = 1,
                        MaVaiTro = 1,
                        HoTen = "Quản Trị Viên",
                        Email = "admin@gmail.com",
                        MatKhau = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                        SoDienThoai = "0988888888",
                        TrangThai = 1,
                        NgayTao = DateTime.Now,
                        NgayCapNhat = DateTime.Now
                    }
                );
            modelBuilder.Entity<PhuongTien>().HasData(
                new PhuongTien
                {
                    MaPhuongTien = 1,
                    TenPhuongTien = "Máy Bay",
                    MaVietTat = "MB",
                    Icon = "Plane",
                    TrangThai = true,
                    NgayTao = new DateTime(2025, 1, 1),
                    NgayCapNhat = new DateTime(2025, 1, 1)
                },
                new PhuongTien
                {
                    MaPhuongTien = 2,
                    TenPhuongTien = "Ô Tô",
                    MaVietTat = "OT",
                    Icon = "Bus",
                    TrangThai = true,
                    NgayTao = new DateTime(2025, 1, 1),
                    NgayCapNhat = new DateTime(2025, 1, 1)
                },
                new PhuongTien
                {
                    MaPhuongTien = 3,
                    TenPhuongTien = "Tàu Hỏa",
                    MaVietTat = "TH",
                    Icon = "Train",
                    TrangThai = true,
                    NgayTao = new DateTime(2025, 1, 1),
                    NgayCapNhat = new DateTime(2025, 1, 1)
                },
                new PhuongTien
                {
                    MaPhuongTien = 4,
                    TenPhuongTien = "Tàu Thủy",
                    MaVietTat = "TT",
                    Icon = "Ship",
                    TrangThai = true,
                    NgayTao = new DateTime(2025, 1, 1),
                    NgayCapNhat = new DateTime(2025, 1, 1)
                }
            );
            modelBuilder.Entity<ThongTinTrang>().HasData(
                new ThongTinTrang
                {
                    MaTTTrang = 1,
                    Key = "logo_url",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 2,
                    Key = "ten_trang",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 3,
                    Key = "facebook_url",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 4,
                    Key = "dia_chi",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 5,
                    Key = "so_dien_thoai",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 7,
                    Key = "email_hotro",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 8,
                    Key = "zalo",
                },
                new ThongTinTrang
                {
                    MaTTTrang = 9,
                    Key = "faq_1_question",
                    Trangthai = true
                },
                new ThongTinTrang
                {
                    MaTTTrang = 10,
                    Key = "faq_1_answer",
                    Trangthai = true
                },

                new ThongTinTrang
                {
                    MaTTTrang = 11,
                    Key = "faq_2_question",
                    Trangthai = true
                },
                new ThongTinTrang
                {
                    MaTTTrang = 12,
                    Key = "faq_2_answer",
                    Trangthai = true
                },

                new ThongTinTrang
                {
                    MaTTTrang = 13,
                    Key = "faq_3_question",
                    Trangthai = true
                },
                new ThongTinTrang
                {
                    MaTTTrang = 14,
                    Key = "faq_3_answer",
                    Trangthai = true
                },

                new ThongTinTrang
                {
                    MaTTTrang = 15,
                    Key = "faq_4_question",
                    Trangthai = true
                },
                new ThongTinTrang
                {
                    MaTTTrang = 16,
                    Key = "faq_4_answer",
                    Trangthai = true
                },

                new ThongTinTrang
                {
                    MaTTTrang = 17,
                    Key = "faq_5_question",
                    Trangthai = true
                },
                new ThongTinTrang
                {
                    MaTTTrang = 18,
                    Key = "faq_5_answer",
                    Trangthai = true
                }

            );
        }

    }
}
