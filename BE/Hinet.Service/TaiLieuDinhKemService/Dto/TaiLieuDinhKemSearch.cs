using Hinet.Service.Common;
using Hinet.Service.Dto;

namespace Hinet.Service.TaiLieuDinhKemService.Dto
{
    public class TaiLieuDinhKemSearch : SearchBase
    {
		
		public string? Item_ID {get; set; }
		public long? KichThuocMax {get; set; }
		public long? KichThuocMin {get; set; }
		public string? TenTaiLieu {get; set; }
		public string? LoaiTaiLieu {get; set; }
		public string? DinhDangFile {get; set; }
		public bool? IsDonVi {get; set; } = false;
		
		
    }
}
