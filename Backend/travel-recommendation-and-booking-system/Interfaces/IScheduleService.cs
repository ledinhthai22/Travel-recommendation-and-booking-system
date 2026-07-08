using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IScheduleService
    {
        Task<ScheduleReponseDTO> AddScheduleAsync(ScheduleDTO dto);

        Task<ScheduleReponseDTO> UpdateScheduleAsync(int maLichTrinh, ScheduleDTO dto);

        Task<bool> DeleteScheduleAsync(int maLichTrinh);
        Task<List<ScheduleReponseDTO>> GetByTourAsync(int maTour);

        // CTLichTrinh
        Task<bool> AddCTLTAsync(ScheduleDetailsDTO dto);
        Task<List<ScheduleDetailsReponseDTO>> GetByLichTrinhAsync(int maLichTrinh);
        Task<bool> UpdateCTLTAsync(int maCTLT, ScheduleDetailsDTO dto);
        Task<bool> DeleteCTLTAsync(int maCTLT);
    }
}