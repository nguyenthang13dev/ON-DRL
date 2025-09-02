using Hinet.Service.Dto;

namespace Hinet.Service.GioiHanDiaChiMangService.Dto
{
    public class GioiHanDiaChiMangSearch : SearchBase
    {
        public string? IPAddress {get; set; }
		public bool? Allowed {get; set; }
    }
}
