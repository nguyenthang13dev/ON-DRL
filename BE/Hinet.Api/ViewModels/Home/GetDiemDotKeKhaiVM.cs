namespace Hinet.Api.ViewModels.Home
{
    public class GetDiemDotKeKhaiVM
    {
        public Guid DotKeKhaiId { get; set; }
        public int Loai { get; set; }
        public string? MaCapDanhGia { get; set; }
        public Guid? DonViId { get; set; }
        public bool? IsXa { get; set; }
    }
}
