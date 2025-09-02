using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcPlanService.ViewModels
{
    public class ArcPlanCreateVM
    {
        [Required]
		public string Description {get; set; }
		[Required]
		public string GhiChu {get; set; }
		[Required]
		public string Method {get; set; }
		[Required]
		public string Name {get; set; }
		[Required]
		public string Outcome {get; set; }
		[Required]
		public string PlanID {get; set; }
		[Required]
		public string Status {get; set; }
    }
}