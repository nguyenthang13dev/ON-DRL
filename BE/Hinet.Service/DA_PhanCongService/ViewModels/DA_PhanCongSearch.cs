using Hinet.Service.Dto;

namespace Hinet.Service.DA_PhanCongService.Dto
{
    public class DA_PhanCongSearch : SearchBase
    {
        public Guid? DuAnId {get; set; }
		public Guid? VaiTroId {get; set; }
		public Guid? UserId {get; set; }
		public string? OrderBy {get; set; }
    }
}
