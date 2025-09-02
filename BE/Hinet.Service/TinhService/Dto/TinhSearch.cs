using Hinet.Service.Common;
using Hinet.Service.Dto;

namespace Hinet.Service.TinhService.Dto
{
    public class TinhSearch : SearchBase
    {
        public string? TenTinh { get; set; }
        public string? MaTinh { get; set; }
        public string? Loai { get; set; }
    }
}
