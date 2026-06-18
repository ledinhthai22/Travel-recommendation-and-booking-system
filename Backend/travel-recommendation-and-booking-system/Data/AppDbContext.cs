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
        public DbSet<HinhAnhSK> HinhAnhSKs { get; set; }
        public DbSet<TienNghi> TienNghis { get; set; }
        public DbSet<LoaiDiaDiem> LoaiDiaDiem { get; set; }
        public DbSet<KS_TN> KS_TNs { get; set; }
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

            modelBuilder.Entity<KS_TN>(entity =>
            {

                entity.HasKey(kt => new { kt.MaKhachSan, kt.MaTienNghi });


                entity.HasOne(x => x.KhachSan)
                      .WithMany(x => x.KS_TNs)
                      .HasForeignKey(x => x.MaKhachSan);

                entity.HasOne(x => x.TienNghi)
                      .WithMany(x => x.KS_TNs)
                      .HasForeignKey(x => x.MaTienNghi);


                entity.HasIndex(x => x.MaTienNghi)
                      .HasDatabaseName("IX_KS_TN_MaTienNghi");
            });

            modelBuilder.Entity<Tour_KhachSan>().HasKey(tk => new { tk.MaTour, tk.MaKhachSan });

            modelBuilder.Entity<SoThichNguoiDung>().HasKey(sn => new { sn.MaNguoiDung, sn.MaLoaiTour });

            modelBuilder.Entity<DanhSachYeuThich>().HasKey(dy => new { dy.MaNguoiDung, dy.MaTour });

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
