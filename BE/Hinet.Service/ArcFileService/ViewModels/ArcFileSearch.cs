using Hinet.Service.Dto;

namespace Hinet.Service.ArcFileService.Dto
{
    public class ArcFileSearch : SearchBase
    {
        public string? FileCode {get; set; }
		public long? FileCataLog {get; set; }
		public string? FileNotation {get; set; }
		public string? Title {get; set; }
		public string? Maintenance {get; set; }
		public bool? Rights {get; set; }
		public string? OrganId { get; set; }
		public string? Language {get; set; }
		public DateTime? StartDateFrom {get; set; }
		public DateTime? StartDateTo {get; set; }
		public DateTime? EndDateFrom {get; set; }
		public DateTime? EndDateTo {get; set; }
		public string? KeyWord {get; set; }
		public string? Format {get; set; }
		public int? Nam {get; set; }
    }
}
