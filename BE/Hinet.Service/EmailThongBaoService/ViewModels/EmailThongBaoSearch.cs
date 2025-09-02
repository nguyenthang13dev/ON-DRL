using Hinet.Service.Dto;

namespace Hinet.Service.EmailThongBaoService.Dto
{
    public class EmailThongBaoSearch : SearchBase
    {
        public string? Ma {get; set; }
		public string? NoiDung {get; set; }
    }
}
