using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using travel_recommendation_and_booking_system.Data;
using travel_recommendation_and_booking_system.DTOs.Payment;
using travel_recommendation_and_booking_system.Helper;
using travel_recommendation_and_booking_system.Interfaces;
using travel_recommendation_and_booking_system.Models;

namespace travel_recommendation_and_booking_system.Controllers.Client
{
    [ApiController]
    [Route("api/client/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly AppDbContext _context;
        private readonly VnPayConfig _vnpayConfig;

        public PaymentController(
            IPaymentService paymentService,
            AppDbContext context,
            IOptions<VnPayConfig> vnpayConfig)
        {
            _paymentService = paymentService;
            _context = context;
            _vnpayConfig = vnpayConfig.Value;
        }

        [HttpPost("create-payment")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentRequestDTO request)
        {
            Console.WriteLine($"[CreatePayment] Received request for MaGiuCho: {request.MaGiuCho}");

            var giuCho = await _context.GiuChos
                .Include(x => x.ChuyenKhoiHanh)
                    .ThenInclude(x => x.GiaChuyens)
                .FirstOrDefaultAsync(x => x.MaGiuCho == request.MaGiuCho);

            if (giuCho == null || giuCho.ThoiGianHetHan <= DateTime.Now)
            {
                Console.WriteLine("[CreatePayment] Error: GiuCho invalid or expired");
                return BadRequest(new { message = "Phiên giữ chỗ không hợp lệ hoặc đã hết hạn." });
            }

            var gia = giuCho.ChuyenKhoiHanh.GiaChuyens.FirstOrDefault();
            if (gia == null)
            {
                Console.WriteLine("[CreatePayment] Error: No price table");
                return BadRequest(new { message = "Chuyến chưa có bảng giá." });
            }

            decimal tongTienGoc =
                request.SoNguoiLon * gia.GiaNguoiLon +
                request.SoTreEm * gia.GiaTreEm +
                request.SoEmBe * gia.GiaEmBe;

            // Xóa payload cũ
            var payloadCu = await _context.PaymentPayloads
                .Where(x => x.MaGiuCho == request.MaGiuCho)
                .ToListAsync();
            _context.PaymentPayloads.RemoveRange(payloadCu);

            var payload = new PaymentPayload
            {
                MaGiuCho = request.MaGiuCho,
                MaNguoiDung = giuCho.MaNguoiDung,
                MaChuyen = request.MaChuyen,
                SoNguoiLon = request.SoNguoiLon,
                SoTreEm = request.SoTreEm,
                SoEmBe = request.SoEmBe,
                MaUuDai = request.MaUuDai,
                TongTienGoc = tongTienGoc,
                GhiChu = request.GhiChu,
                DanhSachHanhKhach = request.DanhSachHanhKhach.Select(k => new HanhKhachPayload
                {
                    HoTen = k.HoTen,
                    SoDienThoai = k.SoDienThoai,
                    Email = k.Email,
                    NgaySinh = k.NgaySinh,
                    GioiTinh = k.GioiTinh,
                    LoaiKhach = k.LoaiKhach,
                    PhongDon = k.PhongDon
                }).ToList()
            };

            _context.PaymentPayloads.Add(payload);
            await _context.SaveChangesAsync();

            var ip = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var txnRef = $"{request.MaCodeChuyen}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

            Console.WriteLine($"[CreatePayment] Created TxnRef: {txnRef}");

            var paymentUrl = await _paymentService.CreatePaymentUrlAsync(request, ip, txnRef);

            Console.WriteLine($"[CreatePayment] Payment URL generated successfully");

            return Ok(new { paymentUrl, txnRef });
        }

        [HttpGet("status/{txnRef}")]
        public async Task<IActionResult> GetPaymentStatus(string txnRef)
        {
            Console.WriteLine($"[GetPaymentStatus] Checking for TxnRef: {txnRef}");

            // Tìm theo MaGiaoDich (số giao dịch VNPay) HOẶC TxnRef
            var thanhToan = await _context.ThanhToans
                .Where(x => x.MaGiaoDich == txnRef || x.MaGiaoDich.Contains(txnRef))
                .Select(x => new { x.TrangThaiThanhToan, x.MaDonDatTour })
                .FirstOrDefaultAsync();

            if (thanhToan == null)
            {
                Console.WriteLine("[GetPaymentStatus] → PENDING (no record)");
                return Ok(new { status = "PENDING" });
            }

            var status = thanhToan.TrangThaiThanhToan switch
            {
                1 => "SUCCESS",
                2 => "FAILED",
                _ => "PENDING"
            };

            Console.WriteLine($"[GetPaymentStatus] → {status}");
            return Ok(new { status, maDonDatTour = thanhToan.MaDonDatTour });
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnPayReturn()
        {
            var queryData = Request.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
            Console.WriteLine("[VnPayReturn] Received redirect from VNPay");

            var vnpay = new VnPayLibrary();
            string secureHash = string.Empty;

            foreach (var kv in queryData)
            {
                if (string.IsNullOrEmpty(kv.Key)) continue;
                if (kv.Key == "vnp_SecureHash")
                    secureHash = kv.Value;
                else if (kv.Key.StartsWith("vnp_"))
                    vnpay.AddResponseData(kv.Key, kv.Value);
            }

            bool isValid = vnpay.ValidateSignature(secureHash, _vnpayConfig.HashSecret);
            string responseCode = vnpay.GetResponseData("vnp_ResponseCode");
            string txnRef = vnpay.GetResponseData("vnp_TxnRef");

            Console.WriteLine($"[VnPayReturn] ResponseCode: {responseCode} | Valid: {isValid}");
            if (responseCode == "00" && isValid)
            {
                Console.WriteLine("[VnPayReturn] Waiting for IPN to commit...");
                for (int i = 0; i < 10; i++)
                {
                    var exists = await _context.ThanhToans
                        .AnyAsync(t => t.MaGiaoDich == txnRef && t.TrangThaiThanhToan == 1);

                    if (exists)
                    {
                        Console.WriteLine($"[VnPayReturn] IPN committed after {(i + 1) * 500}ms");
                        break;
                    }

                    await Task.Delay(500);
                }
            }

            var qs = $"?code={responseCode}&txn={Uri.EscapeDataString(txnRef ?? "")}&amount={vnpay.GetResponseData("vnp_Amount")}&transNo={vnpay.GetResponseData("vnp_TransactionNo")}&valid={(isValid ? "1" : "0")}";

            return Redirect("http://localhost:5173/payment-return" + qs);
        }

        [HttpGet("vnpay-ipn")]
        public async Task<IActionResult> VnPayIpn()
        {
            var queryData = Request.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
            Console.WriteLine($"[VnPayIpn] IPN called from VNPay - {DateTime.Now}");

            var (rspCode, message) = await _paymentService.ProcessVnPayIpnAsync(queryData);

            Console.WriteLine($"[VnPayIpn] Response to VNPay: RspCode={rspCode}, Message={message}");
            return Ok(new { RspCode = rspCode, Message = message });
        }
    }
}