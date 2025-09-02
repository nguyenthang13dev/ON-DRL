using Hinet.Service.Dto;

namespace Hinet.Service.SystemLogsService.Dto
{
    public class SystemLogsSearch : SearchBase
    {
        public string? UserName {get; set; }
		public DateTime? TimestampFrom {get; set; }
		public DateTime? TimestampTo {get; set; }
		public string? IPAddress {get; set; }
		public string? Level {get; set; }
		public string? Message {get; set; }
    }
}
