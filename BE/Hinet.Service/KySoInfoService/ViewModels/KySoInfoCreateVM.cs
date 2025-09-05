using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.KySoInfoService.ViewModels
{
    public class KySoInfoCreateVM
    {
        [Required]
		public long UserId {get; set; }
		[Required]
		public long? IdDoiTuong {get; set; }
		public string? LoaiDoiTuong {get; set; }
		public string? DuongDanFile {get; set; }
		public string? ThongTin {get; set; }
		public string? TrangThai {get; set; }
    }
}