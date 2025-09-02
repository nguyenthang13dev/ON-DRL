using Hinet.Service.Dto;

namespace Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.ViewModels
{
    public class NS_HopDongLaoDongSearch : SearchBase
    {
        public Guid? NhanSuId { get; set; }
        public DateTime? NgayKyFrom { get; set; }
        public DateTime? NgayKyTo { get; set; }
        public DateTime? NgayHetHanFrom { get; set; }
        public DateTime? NgayHetHanTo { get; set; }
        public byte? LoaiHopDong { get; set; }
        public string? SoHopDong { get; set; }
        public string? GhiChu { get; set; }
    }
}
