using Hinet.Service.DA_NoiDungCuocHopService.Dto;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_NoiDungCuocHopService.ViewModels
{
    public class DA_NoiDungCuocHopCreateVM
    {
        [Required]
		public Guid DuAnId {get; set; }
		[Required]
		public DateTime ThoiGianHop {get; set; }
		[Required]
		public bool IsNoiBo {get; set; }
		[Required]
		public string TenDuAn {get; set; }
		[Required]
		public string ThanhPhanThamGia {get; set; }
		[Required]
		public string NoiDungCuocHop {get; set; }
		[Required]
		public string DiaDiemCuocHop {get; set; }
		public string? TaiLieuDinhKem {get; set; }
		public List<TaiLieuUpload> ListTaiLieu { get; set; } = new List<TaiLieuUpload>();
    }
}