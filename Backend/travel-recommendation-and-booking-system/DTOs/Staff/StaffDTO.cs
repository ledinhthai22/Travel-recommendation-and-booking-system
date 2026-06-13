using System.ComponentModel.DataAnnotations;

namespace DTOs.Staff
{
    public class StaffDTO
    {
        //public int MaNguoiDung { get; set; }

        [StringLength(100, ErrorMessage = "Họ tên tối đa 100 ký tự")]
        public string? HoTen { get; set; }


        [EmailAddress(ErrorMessage = "Email không đúng định dạng")]
        public string? Email { get; set; }


        [MinLength(8, ErrorMessage = "Mật khẩu tối thiểu 8 ký tự")]
        public string? Matkhau { get; set; }


        [RegularExpression(@"^(0[0-9]{9})$",
            ErrorMessage = "Số điện thoại không hợp lệ")]
        public string? SoDienThoai { get; set; }
        public bool GioiTinh { get; set; }
        public IFormFile? DuongDanAnh { get; set; }

        public string? DiaChi { get; set; }

        public DateTime? NgaySinh { get; set; }


        public int? TrangThai { get; set; }

        public int MaVaiTro { get; set; }
        public DateTime? NgayXoa { get; set; }
        public DateTime? NgayTao { get; set; }
        public DateTime? NgayCapNhat { get; set; }
    }
}
