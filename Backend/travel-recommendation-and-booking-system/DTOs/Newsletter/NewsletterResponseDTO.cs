namespace DTOs.Newsletter
{
    public class NewsletterResponseDTO
    {
        public int MaNewsletter { get; set; }
        public string Email { get; set; } = null!;
        public DateTime NgayGui { get; set; }
        public DateTime NgayXoa { get; set; }
    }
}
