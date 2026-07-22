using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using travel_recommendation_and_booking_system.Constants;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("DonDatTour")]
    public class DonDatTour
    {
        [Key]
        public int MaDonDatTour { get; set; }

        public int MaNguoiDung { get; set; }

        public int MaChuyen { get; set; }

        [Required]
        [MaxLength(50)]
        public string MaDatCho { get; set; } = string.Empty;

        public int? MaUuDai { get; set; }

        public int? MaNhanVienDuyet { get; set; }

        public int SoNguoiLon { get; set; }

        public int SoTreEm { get; set; }

        public int SoEmBe { get; set; }

        public int SoPhongDon { get; set; }

        [MaxLength(1000)]
        public string GhiChu { get; set; } = string.Empty;

        [MaxLength(100)]
        public string? HoTenLienHe { get; set; }

        [MaxLength(20)]
        public string? SoDienThoaiLienHe { get; set; }

        [MaxLength(100)]
        public string? EmailLienHe { get; set; }

        [MaxLength(255)]
        public string? DiaChiLienHe { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaNguoiLonTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTreEmTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaEmBeTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal PhuThuPhongDonTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaTriGiamTaiDat { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTien { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TienCoc { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal SoTienDaThanhToan { get; set; }


        public bool DaDanhGia { get; set; } = false;

        /// <summary>
        /// Trạng thái tài chính
        /// 0 = Chưa thanh toán
        /// 1 = Đã đặt cọc
        /// 2 = Đã thanh toán đủ
        /// 3 = Đang hoàn tiền
        /// 4 = Đã hoàn tiền
        /// 5 = Mất cọc
        /// </summary>
        public int TrangThaiTaiChinh { get; set; }

        /// <summary>
        /// Trạng thái đơn
        /// 1 = Chờ thanh toán
        /// 2 = Chờ duyệt
        /// 3 = Đã duyệt
        /// 4 = Đang diễn ra
        /// 5 = Hoàn tất
        /// 6 = Đã hủy
        /// </summary>
        public int TrangThaiDon { get; set; }

        public DateTime NgayDat { get; set; }

        public DateTime? NgayDuyet { get; set; }

        public DateTime? NgayHuy { get; set; }

        public DateTime? NgayYeuCauHuy { get; set; }

        public DateTime NgayCapNhat { get; set; }

        [MaxLength(500)]
        public string? LyDoHuy { get; set; }

        [MaxLength(500)]
        public string? HinhAnhHuy { get; set; }

        [MaxLength(1000)]
        public string? AdminNote { get; set; }

        public int? MaNguoiYeuCauHuy { get; set; }

        [MaxLength(20)]
        public string? LoaiNguoiYeuCauHuy { get; set; }

        public int? MaNhanVienXuLyHuy { get; set; }

        public DateTime? NgayXuLyHuy { get; set; }

        [MaxLength(500)]
        public string? LyDoTuChoiHuy { get; set; }

        public string? LichSuTrangThai { get; set; }

        public bool CoCanhBaoCongNo { get; set; } = false;

        public DateTime? NgayGanCoCanhBao { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; } = default!;

        [ForeignKey(nameof(MaNguoiDung))]
        public virtual NguoiDung? NguoiDung { get; set; }

        [ForeignKey(nameof(MaChuyen))]
        public virtual ChuyenKhoiHanh? ChuyenKhoiHanh { get; set; }

        [ForeignKey(nameof(MaNhanVienDuyet))]
        public virtual NhanVien? NhanVien { get; set; }

        [ForeignKey(nameof(MaUuDai))]
        public virtual UuDai? UuDai { get; set; }

        public virtual ICollection<KhachHang> KhachHangs { get; set; } = new List<KhachHang>();

        public virtual ICollection<ThanhToan> ThanhToans { get; set; } = new List<ThanhToan>();

        [NotMapped]
        public decimal SoTienConLai => Math.Max(0, TongTien - SoTienDaThanhToan);

        [NotMapped]
        public bool DaDatCoc => SoTienDaThanhToan >= TienCoc;

        [NotMapped]
        public bool DaThanhToanDu => SoTienDaThanhToan >= TongTien;

        [NotMapped]
        public ThanhToan? ThanhToanMoiNhat =>
            ThanhToans
                .OrderByDescending(x => x.NgayThanhToan)
                .FirstOrDefault();

        [NotMapped]
        public bool CoTheHuy
        {
            get
            {
                if (!BookingConstants.IsOrderActive(TrangThaiDon))
                    return false;

                if (ChuyenKhoiHanh == null)
                    return false;

                return BookingConstants.CanCancel(TrangThaiDon, ChuyenKhoiHanh.NgayKhoiHanh);
            }
        }

        [NotMapped]
        public bool CoTheHuyByUser
        {
            get
            {
                if (ChuyenKhoiHanh == null)
                    return false;

                return BookingConstants.CanUserCancel(TrangThaiDon, ChuyenKhoiHanh.NgayKhoiHanh);
            }
        }

        [NotMapped]
        public bool CoTheHuyByAdmin
        {
            get
            {
                if (ChuyenKhoiHanh == null)
                    return false;

                return BookingConstants.CanAdminCancel(
                    TrangThaiDon,
                    ChuyenKhoiHanh.NgayKhoiHanh,
                    ChuyenKhoiHanh.NgayKetThuc
                );
            }
        }

        [NotMapped]
        public bool DaHuy => TrangThaiDon == BookingConstants.DON_DA_HUY;

        [NotMapped]
        public bool DaHoanTat => TrangThaiDon == BookingConstants.DON_HOAN_TAT;

        [NotMapped]
        public bool DangHoatDong => BookingConstants.IsOrderActive(TrangThaiDon);

        [NotMapped]
        public bool DangHoanTien => TrangThaiTaiChinh == BookingConstants.TC_DANG_HOAN_TIEN;

        [NotMapped]
        public bool DaHoanTien => TrangThaiTaiChinh == BookingConstants.TC_DA_HOAN_TIEN;

        [NotMapped]
        public bool MatCoc => TrangThaiTaiChinh == BookingConstants.TC_MAT_COC;

        [NotMapped]
        public bool DaDatCocThanhCong => TrangThaiTaiChinh == BookingConstants.TC_DA_DAT_COC;

        [NotMapped]
        public bool DaThanhToanDayDu => TrangThaiTaiChinh == BookingConstants.TC_DA_THANH_TOAN_DU;

        [NotMapped]
        public string TenTrangThaiDon => BookingConstants.GetOrderStatusName(TrangThaiDon);

        [NotMapped]
        public string TenTrangThaiTaiChinh => BookingConstants.GetFinancialStatusName(TrangThaiTaiChinh);

        public void AppendStatusHistory(int oldStatus, int newStatus, string action, string? note = null)
        {
            var history = string.IsNullOrEmpty(LichSuTrangThai)
                ? new List<StatusHistoryEntry>()
                : System.Text.Json.JsonSerializer.Deserialize<List<StatusHistoryEntry>>(LichSuTrangThai) ?? new List<StatusHistoryEntry>();

            history.Add(new StatusHistoryEntry
            {
                OldStatus = oldStatus,
                NewStatus = newStatus,
                Action = action,
                Note = note,
                Timestamp = DateTime.Now,
                UserId = MaNguoiDung.ToString()
            });

            LichSuTrangThai = System.Text.Json.JsonSerializer.Serialize(history);
        }
    }

    public class StatusHistoryEntry
    {
        public int OldStatus { get; set; }
        public int NewStatus { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? Note { get; set; }
        public DateTime Timestamp { get; set; }
        public string? UserId { get; set; }
    }
}