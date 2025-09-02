using Hinet.Service.Dto;

namespace Hinet.Service.DA_NoiDungCuocHopService.Dto
{
    public class DA_NoiDungCuocHopSearch : SearchBase
    {
        public Guid? DuAnId {get; set; }
		public string? ThoiGianHop {get; set; }
		public bool? IsNoiBo {get; set; }
		public string? TenDuAn {get; set; }
		public string? ThanhPhanThamGia {get; set; }
		public string? NoiDungCuocHop {get; set; }
		public string? DiaDiemCuocHop {get; set; }
    }
}
