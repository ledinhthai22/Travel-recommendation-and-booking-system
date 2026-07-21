using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using travel_recommendation_and_booking_system.Constants;

namespace travel_recommendation_and_booking_system.Models
{
    [Table("ThanhToan")]
    public class ThanhToan
    {
        [Key]
        public int MaThanhToan { get; set; }

        [ForeignKey(nameof(DonDatTour))]
        public int MaDonDatTour { get; set; }

        [MaxLength(100)]
        public string? MaGiaoDich { get; set; }

        [MaxLength(100)]
        public string? VnpTransactionNo { get; set; }

        [MaxLength(500)]
        public string? NoiDung { get; set; }

        /// <summary>
        /// 1 = VNPay
        /// 2 = Tiền mặt
        /// 3 = Chuyển khoản
        /// </summary>
        public int PhuongThucThanhToan { get; set; }

        /// <summary>
        /// 1 = Đặt cọc
        /// 2 = Thanh toán phần còn lại
        /// 3 = Thanh toán toàn bộ
        /// 4 = Hoàn tiền
        /// </summary>
        public int LoaiThanhToan { get; set; }

        /// <summary>
        /// 0 = Chờ xử lý
        /// 1 = Thành công
        /// 2 = Thất bại
        /// 3 = Đã hủy
        /// </summary>
        public int TrangThaiThanhToan { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTienThanhToan { get; set; }

        /// <summary>
        /// Chỉ dùng cho giao dịch hoàn tiền (LoaiThanhToan = 4)
        /// </summary>
        [Column(TypeName = "decimal(18,2)")]
        public decimal? SoTienHoan { get; set; }

        public DateTime NgayThanhToan { get; set; }

        public DateTime? NgayXacNhan { get; set; }

        /// <summary>
        /// Ngày hoàn tiền thành công
        /// </summary>
        public DateTime? NgayHoanTien { get; set; }

        public int? MaNhanVienXuLyHoan { get; set; }

        [MaxLength(500)]
        public string? LyDoHoanTien { get; set; }

        public virtual DonDatTour DonDatTour { get; set; } = null!;

        #region NotMapped Properties

        [NotMapped]
        public bool LaGiaoDichHoanTien => LoaiThanhToan == BookingConstants.LOAI_HOAN_TIEN;

        [NotMapped]
        public bool ThanhCong => TrangThaiThanhToan == BookingConstants.TT_THANH_CONG;

        [NotMapped]
        public bool ThatBai => TrangThaiThanhToan == BookingConstants.TT_THAT_BAI;

        [NotMapped]
        public bool DaHuy => TrangThaiThanhToan == BookingConstants.TT_DA_HUY;

        [NotMapped]
        public bool LaGiaoDichDatCoc => LoaiThanhToan == BookingConstants.LOAI_DAT_COC;

        [NotMapped]
        public bool LaGiaoDichThanhToanConLai => LoaiThanhToan == BookingConstants.LOAI_THANH_TOAN_PHAN_CON_LAI;

        [NotMapped]
        public bool LaGiaoDichThanhToanToanBo => LoaiThanhToan == BookingConstants.LOAI_THANH_TOAN_TOAN_BO;

        [NotMapped]
        public bool LaPhuongThucVNPay => PhuongThucThanhToan == BookingConstants.PTTT_VNPAY;

        [NotMapped]
        public bool LaPhuongThucTienMat => PhuongThucThanhToan == BookingConstants.PTTT_TIEN_MAT;

        [NotMapped]
        public bool LaPhuongThucChuyenKhoan => PhuongThucThanhToan == BookingConstants.PTTT_CHUYEN_KHOAN;

        [NotMapped]
        public string TenPhuongThuc => BookingConstants.GetPaymentMethodName(PhuongThucThanhToan);

        [NotMapped]
        public string TenLoaiThanhToan => BookingConstants.GetPaymentTypeName(LoaiThanhToan);

        [NotMapped]
        public string TenTrangThai => BookingConstants.GetPaymentStatusName(TrangThaiThanhToan);

        #endregion
    }
}