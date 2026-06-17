using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs;
using travel_recommendation_and_booking_system.DTOs.WebInfo;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IWebInfoService
    {
        // client
        Task<Dictionary<string, string?>> GetWebInfoSettingsClientAsync(); //lấy tất cả thông tin trang web dưới dạng key-value cho client
        //admin
        Task<PageDTO<WebInfoResponseDTO>> GetPagedWebInfoAsync(int pageNumber, int pageSize, WebinfoDTO webinfo); // lấy danh sách tất cả thông tin trang web
        Task<WebInfoResponseDTO?> GetWebInfoByIdAsync(int id); // lấy thông tin trang web theo id
        Task<WebInfoResponseDTO> UpdateAsync(int maTTTrang, UpdateWebInfoDTO webinfo); // cập nhật thông tin trang web
        Task<bool> UpdateStatusAsync(int maTTTrang, bool trangthai); // cập nhật trạng thái hiển thị của thông tin trang web
        Task<bool> ClearContentAsync(int maTTTrang); // xóa thông tin trang 
    }
}
