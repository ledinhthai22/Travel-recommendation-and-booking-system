using System.ComponentModel.DataAnnotations;

namespace DTOs.Contact
{
    public class ContactDTO
    {
        [Required(ErrorMessage = "Họ tên không được để trống")]
        [MaxLength(100)]
        public string HoTen { get; set; } = null!;

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Số điện thoại không được trống ")]
        [RegularExpression(@"^(0[3|5|7|8|9])[0-9]{8}$", ErrorMessage = "Số điện thoại không đúng định dạng")]
        public string SoDienThoai { get; set; } =null!;

        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string NoiDung { get; set; } = null!;
    }
}
