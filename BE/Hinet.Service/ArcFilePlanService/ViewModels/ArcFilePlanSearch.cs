using Hinet.Service.Dto;

namespace Hinet.Service.ArcFilePlanService.Dto
{
    public class ArcFilePlanSearch : SearchBase
    {
        public string? FileCode {get; set; }
		public long? FileCatalog {get; set; }
		public string? FileNotaion {get; set; }
		public string? Title {get; set; }
    }
}
