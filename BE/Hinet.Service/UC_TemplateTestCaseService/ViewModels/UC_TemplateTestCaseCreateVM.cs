using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.UC_TemplateTestCaseService.ViewModels
{
    public class UC_TemplateTestCaseCreateVM
    {
        [Required]
		public string TemplateName {get; set; }
		[Required]
		public string KeyWord {get; set; }
		[Required]
		public string TemplateContent {get; set; }
    }
}