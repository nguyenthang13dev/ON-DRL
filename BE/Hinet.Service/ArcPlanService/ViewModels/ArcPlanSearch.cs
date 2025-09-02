using Hinet.Service.Dto;

namespace Hinet.Service.ArcPlanService.Dto
{
    public class ArcPlanSearch : SearchBase
    {
        public string? Description {get; set; }
		public string? GhiChu {get; set; }
		public string? Method {get; set; }
		public string? Name {get; set; }
		public string? Outcome {get; set; }
		public string? PlanID {get; set; }
		public string? Status {get; set; }
		public DateTime? StartDate { get; set; }
		public DateTime? EndDate { get; set; }

    }
}
