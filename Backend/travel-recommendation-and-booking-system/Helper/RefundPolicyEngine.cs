using travel_recommendation_and_booking_system.Constants;

namespace travel_recommendation_and_booking_system.Helpers
{
    public static class RefundPolicyEngine
    {
        /// <summary>
        /// Tính tỷ lệ hoàn tiền dựa trên số ngày trước khởi hành
        /// </summary>
        public static RefundPolicyResult CalculateRefundPolicy(DateTime ngayKhoiHanh, DateTime ngayHuy)
        {
            var daysBeforeDeparture = (ngayKhoiHanh - ngayHuy).TotalDays;
            var result = new RefundPolicyResult
            {
                DaysBeforeDeparture = (int)daysBeforeDeparture
            };

            if (daysBeforeDeparture >= 30)
            {
                result.RefundRate = 1.0m;
                result.Policy = "Hủy trước 30 ngày: Hoàn 100%";
                result.FinancialStatus = BookingConstants.TC_DA_HOAN_TIEN;
                result.OrderStatus = BookingConstants.DON_DA_HUY;
            }
            else if (daysBeforeDeparture >= 15)
            {
                result.RefundRate = 0.7m;
                result.Policy = "Hủy trước 15-29 ngày: Hoàn 70%";
                result.FinancialStatus = BookingConstants.TC_DA_HOAN_TIEN;
                result.OrderStatus = BookingConstants.DON_DA_HUY;
            }
            else if (daysBeforeDeparture >= 7)
            {
                result.RefundRate = 0.5m;
                result.Policy = "Hủy trước 7-14 ngày: Hoàn 50%";
                result.FinancialStatus = BookingConstants.TC_DA_HOAN_TIEN;
                result.OrderStatus = BookingConstants.DON_DA_HUY;
            }
            else if (daysBeforeDeparture >= 3)
            {
                result.RefundRate = 0.3m;
                result.Policy = "Hủy trước 3-6 ngày: Hoàn 30%";
                result.FinancialStatus = BookingConstants.TC_DA_HOAN_TIEN;
                result.OrderStatus = BookingConstants.DON_DA_HUY;
            }
            else if (daysBeforeDeparture >= 0)
            {
                result.RefundRate = 0m;
                result.Policy = "Hủy trong vòng 3 ngày: Không hoàn tiền";
                result.FinancialStatus = BookingConstants.TC_MAT_COC;
                result.OrderStatus = BookingConstants.DON_DA_HUY;
            }
            else
            {
                result.RefundRate = 0m;
                result.Policy = "Hủy sau khi tour đã khởi hành: Không hoàn tiền";
                result.FinancialStatus = BookingConstants.TC_MAT_COC;
                result.OrderStatus = BookingConstants.DON_DA_HUY;
            }

            result.IsRefundable = result.RefundRate > 0;

            return result;
        }

        /// <summary>
        /// Kiểm tra xem đơn có thể hủy không
        /// </summary>
        public static (bool CanCancel, string Reason) CanCancel(DateTime ngayKhoiHanh, DateTime ngayKetThuc, DateTime currentTime)
        {
            if (ngayKetThuc < currentTime)
                return (false, "Tour đã kết thúc, không thể hủy.");

            if (ngayKhoiHanh.AddDays(3) < currentTime)
                return (false, "Tour đã khởi hành quá 3 ngày, không thể hủy.");

            return (true, string.Empty);
        }

        /// <summary>
        /// Kiểm tra hạn đặt cọc
        /// </summary>
        public static bool IsDepositDeadlineExpired(DateTime ngayDat, DateTime currentTime)
        {
            return (currentTime - ngayDat).TotalHours > BookingConstants.DEPOSIT_DEADLINE_HOURS;
        }

        /// <summary>
        /// Lấy thông tin chính sách hủy để hiển thị cho user
        /// </summary>
        public static List<CancellationPolicyInfo> GetCancellationPolicy()
        {
            return new List<CancellationPolicyInfo>
            {
                new() { DaysBefore = 30, RefundRate = 100, Label = "Hủy trước 30 ngày: Hoàn 100%" },
                new() { DaysBefore = 15, RefundRate = 70, Label = "Hủy trước 15-29 ngày: Hoàn 70%" },
                new() { DaysBefore = 7, RefundRate = 50, Label = "Hủy trước 7-14 ngày: Hoàn 50%" },
                new() { DaysBefore = 3, RefundRate = 30, Label = "Hủy trước 3-6 ngày: Hoàn 30%" },
                new() { DaysBefore = 0, RefundRate = 0, Label = "Hủy trong vòng 3 ngày: Không hoàn tiền" }
            };
        }

        /// <summary>
        /// Tính toán số tiền hoàn và mất dựa trên tổng tiền đã thanh toán
        /// </summary>
        public static (decimal RefundAmount, decimal LostAmount) CalculateRefundAmounts(
            decimal tongTienDaThanhToan,
            decimal refundRate)
        {
            var refundAmount = Math.Round(tongTienDaThanhToan * refundRate, 0);
            var lostAmount = tongTienDaThanhToan - refundAmount;
            return (refundAmount, lostAmount);
        }

        /// <summary>
        /// Lấy trạng thái tài chính tương ứng với tỷ lệ hoàn
        /// </summary>
        public static int GetFinancialStatusForRefund(decimal refundRate)
        {
            return refundRate > 0 ? BookingConstants.TC_DANG_HOAN_TIEN : BookingConstants.TC_MAT_COC;
        }

        /// <summary>
        /// Kiểm tra có được hoàn tiền không
        /// </summary>
        public static bool IsEligibleForRefund(decimal refundRate)
        {
            return refundRate > 0;
        }
    }

    public class RefundPolicyResult
    {
        /// <summary>
        /// Tỷ lệ hoàn tiền (0.0 - 1.0)
        /// </summary>
        public decimal RefundRate { get; set; }

        /// <summary>
        /// Mô tả chính sách
        /// </summary>
        public string Policy { get; set; } = string.Empty;

        /// <summary>
        /// Có được hoàn tiền không
        /// </summary>
        public bool IsRefundable { get; set; }

        /// <summary>
        /// Trạng thái tài chính sau khi hủy
        /// </summary>
        public int FinancialStatus { get; set; }

        /// <summary>
        /// Trạng thái đơn sau khi hủy
        /// </summary>
        public int OrderStatus { get; set; }

        /// <summary>
        /// Số ngày trước khởi hành
        /// </summary>
        public int DaysBeforeDeparture { get; set; }

        /// <summary>
        /// Số tiền được hoàn (tính từ tổng tiền đã thanh toán)
        /// </summary>
        public decimal RefundAmount { get; set; }

        /// <summary>
        /// Số tiền bị mất (tính từ tổng tiền đã thanh toán)
        /// </summary>
        public decimal LostAmount { get; set; }

        /// <summary>
        /// Tổng tiền đã thanh toán
        /// </summary>
        public decimal TotalPaidAmount { get; set; }
    }

    public class CancellationPolicyInfo
    {
        public int DaysBefore { get; set; }
        public int RefundRate { get; set; }
        public string Label { get; set; } = string.Empty;
    }
}