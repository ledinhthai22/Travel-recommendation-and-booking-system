using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WebDuLich.Models
{
    [Table("Newsletter")]
    public class Newsletter
    {
        [Key]
        public int MaNewsletter { get; set; }
        [Required]
        [StringLength(255)]
        public string Email { get; set; }
        public DateTime NgayGui { get; set; } = DateTime.Now;
    }
}
