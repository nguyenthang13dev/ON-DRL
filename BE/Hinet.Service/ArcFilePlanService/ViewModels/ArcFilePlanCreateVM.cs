using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcFilePlanService.ViewModels
{
    public class ArcFilePlanCreateVM
    {
        [Required]
		public string FileCode {get; set; }
		[Required]
		public long FileCatalog {get; set; }
		[Required]
		public string FileNotaion {get; set; }
		[Required]
		public string Title {get; set; }
    }
}