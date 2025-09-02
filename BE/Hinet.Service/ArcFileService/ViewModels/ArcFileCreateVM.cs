using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcFileService.ViewModels
{
    public class ArcFileCreateVM
    {
        [Required]
		public string FileCode {get; set; }
		[Required]
		public long FileCataLog {get; set; }
		[Required]
		public string FileNotation {get; set; }
		[Required]
		public string Title {get; set; }
		[Required]
		public string Maintenance {get; set; }
		[Required]
		public bool Rights {get; set; }
		[Required]
		public string Language {get; set; }
		[Required]
		public DateTime StartDate {get; set; }
		[Required]
		public DateTime EndDate {get; set; }
		[Required]
		public string KeyWord {get; set; }
		[Required]
		public string Format {get; set; }
		[Required]
		public int Nam {get; set; }

		////
        public string? OrganId { get; set; }
        public long? TotalDoc { get; set; }
        public string? Description { get; set; }
        public string? InforSign { get; set; }
        public long? SheetNumber { get; set; }
        public long? PageNumber { get; set; }
    }
}