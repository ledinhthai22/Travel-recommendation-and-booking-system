namespace DTOs.Contact
{
    public class ContactResponseDTO
    {
        public int MaLienHe { get; set; }
        public string HoTen { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string SodienThoai { get; set; } = null!;
        public string NoiDung { get; set; } = null!;
        public bool TrangThai { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
