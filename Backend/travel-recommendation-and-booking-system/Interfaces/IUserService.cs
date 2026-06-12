using DTOs.Page;
using DTOs.User;
using travel_recommendation_and_booking_system.DTOs.User;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDTO?> GetMeAsync(int maNguoiDung); // thông tin user
        Task<bool> CreateUserAsync(UserCreateDTO user); // thêm người dùng
        Task<bool> UpdateUserAsync(int id, UserUpdateDTO request); // cập nhật người dùng
        Task<PageDTO<UserResponseDTO>> GetUsersAsync(int pageNumber, int pageSize, string? keyword, int? status); // danh sách tìm kiếm người dùng
        Task<bool> LockUserAsync(int id); // khóa tk
        Task<bool> UnLockUserAsync(int id); // mở khóa tk

        //nhân viên
        Task<bool> CreateStaffAsync(StaffCreateDTO request);
        Task<bool> UpdateStaffAsync(int id, StaffUpdateDTO request);
        Task<PageDTO<StaffResponseDTO>> GetStaffsAsync(int pageNumber, int pageSize, string? keyword,int? status);
    }
}
