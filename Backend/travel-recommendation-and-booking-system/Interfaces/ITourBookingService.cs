using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.TourBooking;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ITourBookingService
    {
        Task<PageDTO<TourBookingResponseDTO>> GetPagedDonDatToursAsync(string? keyword, int? trangThaiDon, int? trangThaiThanhToan,DateTime? ngayDat, int page, int size);
        Task<TourBookingDetailDTO?> GetDetailAsync(int maDonDatTour);
        Task<int> CreateBookingByAdminAsync(CreateBookingAdminDTO createBooking);
        Task<bool> UpdateBookingByAdminAsync(UpdateBookingAdminDTO updateBooking);
        Task<bool> ApproveAsync(int maDonDatTour, int maNhanVien);
        Task<bool> CancelOrderAsync(int maDonDatTour);
        Task<bool> UpdatePaymentStatusAsync(int maDonDatTour, int trangThai);
        Task<bool> UpdateInvoiceStatusAsync(int maDonDatTour, int trangThai);
        Task<ReserveSeatsResultDTO> ReserveSeatsAsync(int maNguoiDung, ReserveSeatsDTO dto);
        Task ReleaseReservationAsync(int maGiuCho, int maNguoiDung);
        Task<int> CreateBookingByClientAsync(int maNguoiDung, CreateBookingClientDTO dto, int? maGiuCho);
        Task<List<UserBookingListDTO>> GetUserBookingsAsync(int maNguoiDung);
        Task<TourBookingDetailDTO?> GetUserBookingDetailAsync(int maDonDatTour, int maNguoiDung);
        Task<bool> CancelByUserAsync(int maDonDatTour, int maNguoiDung);
        Task<bool> UpdatePassengerAsync(int maKhachHang, UpdatePassengerDTO dto);
        //in hợp đồng
        Task<(byte[] Pdf, string FileName)> GenerateContractsPdfWithNameAsync(List<int> maDonDatTours);
        Task<(byte[] Pdf, string FileName)> GenerateContractsPdfByChuyenWithNameAsync(int maChuyen);

    }
}
