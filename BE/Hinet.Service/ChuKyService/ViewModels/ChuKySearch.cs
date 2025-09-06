using Hinet.Service.Dto;

namespace Hinet.Service.ChuKyService.Dto
{
    public class ChuKySearch : SearchBase
    {
        public Guid? UserId {get; set; }
		public string? Name {get; set; }
		public string? DuongDanFile {get; set; }
    }
}
