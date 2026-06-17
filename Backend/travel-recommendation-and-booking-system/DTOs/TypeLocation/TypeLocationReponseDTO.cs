namespace travel_recommendation_and_booking_system.DTOs.TypeLocation
{
    public class TypeLocationReponseDTO { 
        public int MaLoaiDD {  get; set; }
        public string TenLoaiDD { get; set; }
        public DateTime NgayTao { get; set; }
        public DateTime NgayCapNhat { get; set; }
        public DateTime? NgayXoa { get; set; }
    }
}
