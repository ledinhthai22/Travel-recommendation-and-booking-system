using travel_recommendation_and_booking_system.DTOs.Schedule;
using travel_recommendation_and_booking_system.DTOs.ScheduleDetails;

namespace travel_recommendation_and_booking_system.Interfaces
{
    public interface IScheduleService
    {

        Task<bool> AddScheduleAsync(ScheduleDTO dto);

        Task<List<ScheduleReponseDTO>> GetByTourAsync(int maTour);

        Task<bool> UpdateScheduleAsync(int maLichTrinh, ScheduleDTO dto);
        Task<bool> DeleteScheduleAsync(int maLichTrinh);


        Task<bool> AddCTLTAsync(ScheduleDetailsDTO dto);


        Task<List<ScheduleDetailsReponseDTO>> GetByLichTrinhAsync(int maLichTrinh);

        Task<bool> UpdateCTLTAsync(int maCTLT, ScheduleDetailsDTO dto);
        Task<bool> DeleteCTLTAsync(int maCTLT);
    }
}