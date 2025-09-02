using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.ViewModels
{
    public class NS_HopDongLaoDongCreateVM
    {
        [Required]
        public Guid NhanSuId { get; set; }
        [Required]
        public DateTime? NgayKy { get; set; }
        public DateTime? NgayHetHan { get; set; }
        public byte LoaiHopDong { get; set; }
        public string? SoHopDong { get; set; }
        public string? GhiChu { get; set; }
    }
}