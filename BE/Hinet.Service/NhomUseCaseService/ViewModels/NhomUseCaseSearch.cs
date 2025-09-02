using Hinet.Service.Dto;

namespace Hinet.Service.NhomUseCaseService.Dto
{
    public class NhomUseCaseSearch : SearchBase
    {
        public string? TenNhom {get; set; }
		public int? Order {get; set; }
		public string? ParentId {get; set; }
		public string? MoTa {get; set; }
    }
}
