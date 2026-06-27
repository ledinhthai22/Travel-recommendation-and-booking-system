using DTOs.Page;
using travel_recommendation_and_booking_system.DTOs.Log;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface ILogService
    {
        Task LoggingAsync(LogDTO request);
        Task<PageDTO<LogResponseDTO>> GetPagedLogsAsync(int pageNumber, int pageSize, string? key, string? accountType, int? accountId);
        Task<LogResponseDTO> GetLogByIdAsync(int id);
    }
}
