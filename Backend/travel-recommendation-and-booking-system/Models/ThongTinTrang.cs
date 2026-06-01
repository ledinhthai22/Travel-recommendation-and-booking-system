using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("ThongTinTrang")]
    public class ThongTinTrang
    {
        [Key]
        public int MaTTTrang { get; set; }
        public string Key { get; set; }
        public string Noidung { get; set; }
        public bool Trangthai { get; set; }
        public DateTime NgayCapNhat { get; set; } = DateTime.Now;
    }
}
