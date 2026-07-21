namespace travel_recommendation_and_booking_system.Constants
{
    public static class BookingConstants
    {
        #region Trạng thái tài chính (TrangThaiTaiChinh)

        /// <summary>
        /// 0 - Chưa thanh toán
        /// </summary>
        public const int TC_CHUA_THANH_TOAN = 0;

        /// <summary>
        /// 1 - Đã đặt cọc
        /// </summary>
        public const int TC_DA_DAT_COC = 1;

        /// <summary>
        /// 2 - Đã thanh toán đủ
        /// </summary>
        public const int TC_DA_THANH_TOAN_DU = 2;

        /// <summary>
        /// 3 - Đang hoàn tiền
        /// </summary>
        public const int TC_DANG_HOAN_TIEN = 3;

        /// <summary>
        /// 4 - Đã hoàn tiền
        /// </summary>
        public const int TC_DA_HOAN_TIEN = 4;

        /// <summary>
        /// 5 - Mất cọc
        /// </summary>
        public const int TC_MAT_COC = 5;

        #endregion

        #region Trạng thái đơn (TrangThaiDon)

        /// <summary>
        /// 1 - Chờ thanh toán
        /// </summary>
        public const int DON_CHO_THANH_TOAN = 1;

        /// <summary>
        /// 2 - Chờ duyệt
        /// </summary>
        public const int DON_CHO_DUYET = 2;

        /// <summary>
        /// 3 - Đã duyệt
        /// </summary>
        public const int DON_DA_DUYET = 3;

        /// <summary>
        /// 4 - Đang diễn ra
        /// </summary>
        public const int DON_DANG_DIEN_RA = 4;

        /// <summary>
        /// 5 - Hoàn tất
        /// </summary>
        public const int DON_HOAN_TAT = 5;

        /// <summary>
        /// 6 - Đã hủy
        /// </summary>
        public const int DON_DA_HUY = 6;

        #endregion

        #region Trạng thái thanh toán (TrangThaiThanhToan)

        /// <summary>
        /// 0 - Chờ xử lý
        /// </summary>
        public const int TT_CHO_XU_LY = 0;

        /// <summary>
        /// 1 - Thành công
        /// </summary>
        public const int TT_THANH_CONG = 1;

        /// <summary>
        /// 2 - Thất bại
        /// </summary>
        public const int TT_THAT_BAI = 2;

        /// <summary>
        /// 3 - Đã hủy
        /// </summary>
        public const int TT_DA_HUY = 3;

        #endregion

        #region Loại thanh toán (LoaiThanhToan)

        /// <summary>
        /// 1 - Đặt cọc
        /// </summary>
        public const int LOAI_DAT_COC = 1;

        /// <summary>
        /// 2 - Thanh toán phần còn lại
        /// </summary>
        public const int LOAI_THANH_TOAN_PHAN_CON_LAI = 2;

        /// <summary>
        /// 3 - Thanh toán toàn bộ
        /// </summary>
        public const int LOAI_THANH_TOAN_TOAN_BO = 3;

        /// <summary>
        /// 4 - Hoàn tiền
        /// </summary>
        public const int LOAI_HOAN_TIEN = 4;

        #endregion

        #region Phương thức thanh toán (PhuongThucThanhToan)

        /// <summary>
        /// 1 - VNPay
        /// </summary>
        public const int PTTT_VNPAY = 1;

        /// <summary>
        /// 2 - Tiền mặt
        /// </summary>
        public const int PTTT_TIEN_MAT = 2;

        /// <summary>
        /// 3 - Chuyển khoản
        /// </summary>
        public const int PTTT_CHUYEN_KHOAN = 3;

        #endregion

        #region Chính sách (Policy)

        /// <summary>
        /// Tỷ lệ cọc cho phép: 30%, 50%, 100%
        /// </summary>
        public static readonly int[] ValidDepositPercentages = { 30, 50, 100 };

        /// <summary>
        /// Hạn đặt cọc: 24 giờ
        /// </summary>
        public const int DEPOSIT_DEADLINE_HOURS = 48;

        /// <summary>
        /// Số ngày tối thiểu để hủy đơn
        /// </summary>
        public const int CANCELLATION_DEADLINE_DAYS = 3;

        /// <summary>
        /// Số ngày trước khởi hành để gắn cờ công nợ
        /// </summary>
        public const int OVERDUE_FLAG_DAYS = 7;

        #endregion

        #region Helper Methods - Trạng thái đơn

        /// <summary>
        /// Lấy tên trạng thái đơn
        /// </summary>
        public static string GetOrderStatusName(int status)
        {
            return status switch
            {
                DON_CHO_THANH_TOAN => "Chờ thanh toán",
                DON_CHO_DUYET => "Chờ duyệt",
                DON_DA_DUYET => "Đã duyệt",
                DON_DANG_DIEN_RA => "Đang diễn ra",
                DON_HOAN_TAT => "Hoàn tất",
                DON_DA_HUY => "Đã hủy",
                _ => "Không xác định"
            };
        }

        /// <summary>
        /// Kiểm tra đơn đang hoạt động (1-4)
        /// </summary>
        public static bool IsOrderActive(int status)
        {
            return status >= DON_CHO_THANH_TOAN && status <= DON_DANG_DIEN_RA;
        }

        /// <summary>
        /// Kiểm tra đơn đã bị hủy (6)
        /// </summary>
        public static bool IsOrderCancelled(int status)
        {
            return status == DON_DA_HUY;
        }

        /// <summary>
        /// Kiểm tra đơn đã hoàn tất (5)
        /// </summary>
        public static bool IsOrderCompleted(int status)
        {
            return status == DON_HOAN_TAT;
        }

        #endregion

        #region Helper Methods - Trạng thái tài chính

        /// <summary>
        /// Lấy tên trạng thái tài chính
        /// </summary>
        public static string GetFinancialStatusName(int status)
        {
            return status switch
            {
                TC_CHUA_THANH_TOAN => "Chưa thanh toán",
                TC_DA_DAT_COC => "Đã đặt cọc",
                TC_DA_THANH_TOAN_DU => "Đã thanh toán đủ",
                TC_DANG_HOAN_TIEN => "Đang hoàn tiền",
                TC_DA_HOAN_TIEN => "Đã hoàn tiền",
                TC_MAT_COC => "Mất cọc",
                _ => "Không xác định"
            };
        }

        #endregion

        #region Helper Methods - Thanh toán

        /// <summary>
        /// Lấy tên trạng thái thanh toán
        /// </summary>
        public static string GetPaymentStatusName(int status)
        {
            return status switch
            {
                TT_CHO_XU_LY => "Chờ xử lý",
                TT_THANH_CONG => "Thành công",
                TT_THAT_BAI => "Thất bại",
                TT_DA_HUY => "Đã hủy",
                _ => "Không xác định"
            };
        }

        /// <summary>
        /// Lấy tên loại thanh toán
        /// </summary>
        public static string GetPaymentTypeName(int type)
        {
            return type switch
            {
                LOAI_DAT_COC => "Đặt cọc",
                LOAI_THANH_TOAN_PHAN_CON_LAI => "Thanh toán phần còn lại",
                LOAI_THANH_TOAN_TOAN_BO => "Thanh toán toàn bộ",
                LOAI_HOAN_TIEN => "Hoàn tiền",
                _ => "Khác"
            };
        }

        /// <summary>
        /// Lấy tên phương thức thanh toán
        /// </summary>
        public static string GetPaymentMethodName(int method)
        {
            return method switch
            {
                PTTT_VNPAY => "VNPay",
                PTTT_TIEN_MAT => "Tiền mặt",
                PTTT_CHUYEN_KHOAN => "Chuyển khoản",
                _ => "Không xác định"
            };
        }

        /// <summary>
        /// Kiểm tra thanh toán thành công
        /// </summary>
        public static bool IsPaymentSuccess(int status)
        {
            return status == TT_THANH_CONG;
        }

        #endregion

        #region Helper Methods - Hủy đơn

        /// <summary>
        /// Kiểm tra đơn có thể hủy không (dành cho cả admin và user)
        /// </summary>
        public static bool CanCancel(int status, DateTime ngayKhoiHanh)
        {
            if (!IsOrderActive(status))
                return false;

            return ngayKhoiHanh > DateTime.Now.AddDays(CANCELLATION_DEADLINE_DAYS);
        }

        /// <summary>
        /// Kiểm tra đơn có thể hủy bởi user không
        /// </summary>
        public static bool CanUserCancel(int status, DateTime ngayKhoiHanh)
        {
            switch (status)
            {
                case DON_CHO_THANH_TOAN:
                case DON_CHO_DUYET:
                    return true;

                case DON_DA_DUYET:
                    return ngayKhoiHanh > DateTime.Now.AddDays(CANCELLATION_DEADLINE_DAYS);

                default:
                    return false;
            }
        }

        /// <summary>
        /// Kiểm tra đơn có thể hủy bởi admin không
        /// </summary>
        public static bool CanAdminCancel(int status, DateTime ngayKhoiHanh, DateTime ngayKetThuc)
        {
            // Không thể hủy đơn đã hoàn tất hoặc đã hủy
            if (status == DON_HOAN_TAT || IsOrderCancelled(status))
                return false;

            // Không thể hủy nếu tour đã kết thúc
            if (ngayKetThuc < DateTime.Now)
                return false;

            return true;
        }

        #endregion

        #region Helper Methods - Chính sách

        /// <summary>
        /// Kiểm tra tỷ lệ cọc hợp lệ
        /// </summary>
        public static bool IsValidDepositPercentage(int percentage)
        {
            return ValidDepositPercentages.Contains(percentage);
        }

        /// <summary>
        /// Kiểm tra hạn đặt cọc đã hết chưa
        /// </summary>
        public static bool IsDepositDeadlineExpired(DateTime ngayDat, DateTime currentTime)
        {
            return (currentTime - ngayDat).TotalHours > DEPOSIT_DEADLINE_HOURS;
        }

        /// <summary>
        /// Kiểm tra đơn có cần gắn cờ công nợ không
        /// </summary>
        public static bool NeedOverdueFlag(DateTime ngayKhoiHanh, DateTime currentTime)
        {
            var daysBefore = (ngayKhoiHanh - currentTime).TotalDays;
            return daysBefore <= OVERDUE_FLAG_DAYS && daysBefore > 0;
        }

        #endregion
    }
}