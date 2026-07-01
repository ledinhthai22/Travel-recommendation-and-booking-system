using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("ThongBao")]
public class ThongBao
{
    [Key]
    public int MaThongBao { get; set; }

    [Required]
    [StringLength(255)]
    public string TieuDe { get; set; }

    [Required]
    public string NoiDung { get; set; }

    public int LoaiThongBao { get; set; }

    public string? LinkChiTiet { get; set; }

    public DateTime NgayTao { get; set; } = DateTime.Now;

    public virtual ICollection<ThongBaoNguoiNhan> NguoiNhans { get; set; }
        = new List<ThongBaoNguoiNhan>();
}