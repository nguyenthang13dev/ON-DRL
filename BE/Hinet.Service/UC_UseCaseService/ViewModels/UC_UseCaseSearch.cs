using Hinet.Service.Dto;

namespace Hinet.Service.UC_UseCaseService.Dto
{
    public class UC_UseCaseSearch : SearchBase
    {
        public string? IdDuAn {get; set; }
		public string? TenUseCase {get; set; }
		public string? TacNhanChinh {get; set; }
		public string? TacNhanPhu {get; set; }
		public string? DoCanThiet {get; set; }
		public string? DoPhucTap {get; set; }
		public string? ParentId {get; set; }
    }
}
