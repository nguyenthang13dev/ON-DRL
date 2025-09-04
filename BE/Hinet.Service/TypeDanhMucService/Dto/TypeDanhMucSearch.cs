using Hinet.Service.Common;
using Hinet.Service.Dto;

namespace Hinet.Service.TypeDanhMucService.Dto
{
    public class TypeDanhMucSearch : SearchBase
    {
        public string? TenTinh { get; set; }
        public string? MaTinh { get; set; }
        public string? Loai { get; set; }
    }
}
