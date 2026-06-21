
using DTOs.Page;
using DTOs.Staff;
using travel_recommendation_and_booking_system.DTOs.Staff;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IStaffService
    {
        Task<List<StaffDTO>> GetTourGuiDe();
        Task<PageDTO<StaffResponseDTO>> GetPagedStaffsAsync(int pageNumber, int pageSize, StaffFilterDTO staff); // lấy danh sách tất cả nhân viên
        Task<StaffResponseDTO?> GetStaffByIdAsync(int id); // lấy thông tin nhân viên theo id
        Task<StaffResponseDTO> CreateAsync(StaffDTO staff); // tạo mới nhân viên
        Task<StaffResponseDTO?> UpdateAsync(int maNguoiDung, StaffDTO staff); // cập nhật thông tin nhân viên
        Task<bool> UpdateStatusAsync(int maNguoiDung, int trangthai); // cập nhật trạng thái hoạt động của nhân viên
        Task<bool> DeleteAsync(int maNguoiDung); // xóa nhân viên
        Task<bool> ResetPasswordAsync(int maNguoiDung, string newPassword); // cấp mật khẩu mới cho nhân viên
    }
}
