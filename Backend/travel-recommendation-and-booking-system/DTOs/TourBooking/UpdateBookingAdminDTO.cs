namespace travel_recommendation_and_booking_system.DTOs.TourBooking
{
    public class UpdateBookingAdminDTO
    {
        public int MaDonDatTour { get; set; }
        public int? SoNguoiLon { get; set; }
        public int? SoTreEm { get; set; }
        public int? SoEmBe { get; set; }
        public int? MaKhachSan { get; set; }
        public int? MaUuDai { get; set; }

        /// <summary>
        /// Trạng thái đơn (1-6)
        /// 1 = Chờ thanh toán
        /// 2 = Chờ duyệt
        /// 3 = Đã duyệt
        /// 4 = Đang diễn ra
        /// 5 = Hoàn tất
        /// 6 = Đã hủy
        /// </summary>
        public int? TrangThaiDon { get; set; }

        /// <summary>
        /// Trạng thái tài chính (0-5)
        /// 0 = Chưa thanh toán
        /// 1 = Đã đặt cọc
        /// 2 = Đã thanh toán đủ
        /// 3 = Đang hoàn tiền
        /// 4 = Đã hoàn tiền
        /// 5 = Mất cọc
        /// </summary>
        public int? TrangThaiTaiChinh { get; set; }

        public int? MaNhanVien { get; set; }
    }
}