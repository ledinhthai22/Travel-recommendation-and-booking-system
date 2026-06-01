using System.ComponentModel.DataAnnotations.Schema;

namespace WebDuLich.Models
{
    [Table("Tour_KhachSan")]
    public class Tour_KhachSan
    {
        public int MaTour { get; set; }
        public int MaKhachSan { get; set; }

        public virtual Tour Tour { get; set; }
        public virtual KhachSan KhachSan { get; set; }
    }
}
