using Hinet.Service.Dto;


namespace Hinet.Service.HuyenService.Dto
{
    public class HuyenSearch : SearchBase
    {
        public string? TenHuyen {get; set; }
		public string? MaHuyen {get; set; }
		public string? MaTinh {get; set; }
		public string? Loai {get; set; }
    }
}
