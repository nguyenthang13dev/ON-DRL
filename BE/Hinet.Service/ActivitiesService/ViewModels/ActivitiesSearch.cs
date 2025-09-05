using Hinet.Service.Dto;

namespace Hinet.Service.ActivitiesService.Dto
{
    public class ActivitiesSearch : SearchBase
    {
        public DateTime? StartDate {get; set; }
		public DateTime? EndDate {get; set; }
		public string? Name {get; set; }
		public string? Description {get; set; }
		public string? QRPath {get; set; }
    }
}
