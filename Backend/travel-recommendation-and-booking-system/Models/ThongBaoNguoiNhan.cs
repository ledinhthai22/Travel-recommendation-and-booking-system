using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using travel_recommendation_and_booking_system.Models;

[Table("ThongBaoNguoiNhan")]
public class ThongBaoNguoiNhan
{
    [Key]
    public int Id { get; set; }

    public int MaThongBao { get; set; }

    public int? MaNguoiDung { get; set; }

    public int? MaNhanVien { get; set; }

    public bool DaDoc { get; set; } = false;

    public DateTime NgayNhan { get; set; } = DateTime.Now;

    public DateTime? NgayDoc { get; set; }

    [ForeignKey(nameof(MaThongBao))]
    public virtual ThongBao ThongBao { get; set; }

    public virtual NguoiDung? NguoiDung { get; set; }

    public virtual NhanVien? NhanVien { get; set; }
}