using DTOs.Contact;
using DTOs.Page;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IContactService
    {
        Task<bool> SendContactAsync(ContactDTO contact); // gửi liên hệ 
        Task<PageDTO<ContactResponseDTO>> GetPagedContactsAsync(int pageNumber, int pageSize, string? key, bool ? status); // danh sách tìm kiết liên hệ 
        Task<bool> SoftDeleteContactAsync(int id); // xóa mềm
        Task<ContactResponseDTO?> GetContactByIdAsync(int id); // chi tiết liên hệ
    }
}
