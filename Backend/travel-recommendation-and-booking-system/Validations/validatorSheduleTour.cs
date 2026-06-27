using travel_recommendation_and_booking_system.DTOs.Schedule;

namespace travel_recommendation_and_booking_system.Validations
{
    public static class validatorSheduleTour
    {
        public static void ValidateSchedules(
            List<ScheduleDTO> schedules
        )
        {
            if (schedules == null || !schedules.Any())
                return;

            ValidateDuplicateLocation(schedules);
            ValidateTimeRange(schedules);
            ValidateTimeOverlap(schedules);
        }

        private static void ValidateDuplicateLocation(
            List<ScheduleDTO> schedules
        )
        {
            var allLocationIds = schedules
                .SelectMany(x => x.ChiTietLichTrinh ?? new())
                .Select(x => x.MaDiaDiem)
                .ToList();

            var duplicateLocation = allLocationIds
                .GroupBy(x => x)
                .FirstOrDefault(x => x.Count() > 1);

            if (duplicateLocation != null)
            {
                throw new Exception(
                    $"Địa điểm có mã {duplicateLocation.Key} đã xuất hiện trong lịch trình tour."
                );
            }
        }

        private static void ValidateTimeRange(List<ScheduleDTO> schedules)
        {
            foreach (var schedule in schedules)
            {
                foreach (var detail in schedule.ChiTietLichTrinh ?? new())
                {
                    if (!TimeSpan.TryParse(detail.GioBatDau, out var startTime))
                        throw new Exception($"Ngày {schedule.SoThuTuNgay}: Định dạng giờ bắt đầu không hợp lệ.");

                    // GioKetThuc là optional — chỉ validate khi có giá trị
                    if (!string.IsNullOrWhiteSpace(detail.GioKetThuc))
                    {
                        if (!TimeSpan.TryParse(detail.GioKetThuc, out var endTime))
                            throw new Exception($"Ngày {schedule.SoThuTuNgay}: Định dạng giờ kết thúc không hợp lệ.");

                        if (startTime >= endTime)
                            throw new Exception($"Ngày {schedule.SoThuTuNgay}: Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
                    }
                }
            }
        }

        private static void ValidateTimeOverlap(List<ScheduleDTO> schedules)
        {
            foreach (var schedule in schedules)
            {
                var details = (schedule.ChiTietLichTrinh ?? new())
                    .OrderBy(x => x.GioBatDau)
                    .ToList();

                for (int i = 0; i < details.Count - 1; i++)
                {
                    var current = details[i];
                    var next = details[i + 1];

                    // Nếu không có GioKetThuc thì dùng GioBatDau làm điểm kết thúc
                    var currentEndStr = string.IsNullOrWhiteSpace(current.GioKetThuc)
                        ? current.GioBatDau
                        : current.GioKetThuc;

                    if (TimeSpan.TryParse(currentEndStr, out var currentEnd) &&
                        TimeSpan.TryParse(next.GioBatDau, out var nextStart))
                    {
                        if (currentEnd > nextStart)
                            throw new Exception($"Ngày {schedule.SoThuTuNgay}: Mốc thời gian bị chồng lấn.");
                    }
                    else
                    {
                        throw new Exception($"Ngày {schedule.SoThuTuNgay}: Định dạng giờ không hợp lệ.");
                    }
                }
            }
        }
    }
}