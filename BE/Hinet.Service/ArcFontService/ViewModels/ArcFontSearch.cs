using Hinet.Service.Dto;

namespace Hinet.Service.ArcFontService.Dto
{
    public class ArcFontSearch : SearchBase
    {
        public string? Identifier {get; set; }
		public string? OrganId {get; set; }
		public string? FondName {get; set; }
		public int? ArchivesTimeStart {get; set; }
		public int? ArchivesTimeEnd {get; set; }
		public int? PaperTotal {get; set; }
		public int? PaperDigital {get; set; }
		public string? Language {get; set; }
    }
}
