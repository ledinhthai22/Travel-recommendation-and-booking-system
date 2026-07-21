using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.TourBooking;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourBookingService
    {
        #region ADMIN APIs

        /// <summary>
        /// Lấy danh sách đơn đặt tour có phân trang
        /// </summary>
        Task<PageDTO<TourBookingResponseDTO>> GetPagedDonDatToursAsync(
          string? keyword,
          int? trangThaiDon,
          int? trangThaiThanhToan,
          DateTime? tuNgay,
          DateTime? denNgay,
          int page,
          int size);

        /// <summary>
        /// Lấy chi tiết đơn đặt tour
        /// </summary>
        Task<TourBookingDetailDTO?> GetDetailAsync(int maDonDatTour);

        /// <summary>
        /// Tạo đơn đặt tour bởi Admin
        /// </summary>
        Task<int> CreateBookingByAdminAsync(CreateBookingAdminDTO createBooking);

        /// <summary>
        /// Cập nhật đơn đặt tour bởi Admin
        /// </summary>
        Task<bool> UpdateBookingByAdminAsync(UpdateBookingAdminDTO updateBooking);

        /// <summary>
        /// Duyệt đơn đặt tour
        /// </summary>
        Task<bool> ApproveAsync(int maDonDatTour, int maNhanVien);

        /// <summary>
        /// Hủy đơn đặt tour
        /// </summary>
        /// <param name="maDonDatTour">Mã đơn đặt tour</param>
        /// <param name="lyDoHuy">Lý do hủy</param>
        /// <param name="maNguoiYeuCau">Mã người yêu cầu hủy (nếu là user)</param>
        /// <param name="isAdmin">Có phải admin thực hiện không</param>
        Task<bool> CancelOrderAsync(int maDonDatTour, string lyDoHuy, int? maNguoiYeuCau = null, bool isAdmin = false);

        /// <summary>
        /// Hoàn tất đơn hàng (tour đã kết thúc)
        /// </summary>
        Task<bool> CompleteOrderAsync(int maDonDatTour);

        #endregion

        #region CLIENT APIs

        /// <summary>
        /// Giữ chỗ tạm thời
        /// </summary>
        Task<ReserveSeatsResultDTO> ReserveSeatsAsync(int maNguoiDung, ReserveSeatsDTO dto);

        /// <summary>
        /// Hủy giữ chỗ
        /// </summary>
        Task ReleaseReservationAsync(int maGiuCho, int maNguoiDung);

        /// <summary>
        /// Tạo đơn đặt tour bởi Client (User)
        /// </summary>
        Task<int> CreateBookingByClientAsync(int maNguoiDung, CreateBookingClientDTO dto, int? maGiuCho);

        /// <summary>
        /// Lấy danh sách đơn đặt tour của User
        /// </summary>
        Task<List<UserBookingListDTO>> GetUserBookingsAsync(int maNguoiDung);

        /// <summary>
        /// Lấy chi tiết đơn đặt tour của User
        /// </summary>
        Task<TourBookingDetailDTO?> GetUserBookingDetailAsync(int maDonDatTour, int maNguoiDung);

        #endregion

        #region COMMON APIs

        /// <summary>
        /// Cập nhật thông tin hành khách
        /// </summary>
        Task<bool> UpdatePassengerAsync(int maKhachHang, UpdatePassengerDTO dto);

        #endregion

        #region PRINT CONTRACT

        /// <summary>
        /// In hợp đồng cho danh sách đơn
        /// </summary>
        Task<List<(byte[] Pdf, string FileName)>> GenerateContractsPdfWithNameAsync(List<int> maDonDatTours);

        /// <summary>
        /// In hợp đồng theo chuyến
        /// </summary>
        Task<List<(byte[] Pdf, string FileName)>> GenerateContractsPdfByChuyenWithNameAsync(int maChuyen);

        #endregion
    }
}