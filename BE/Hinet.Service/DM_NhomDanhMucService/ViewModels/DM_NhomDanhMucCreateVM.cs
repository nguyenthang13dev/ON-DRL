
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.DM_NhomDanhMucService.ViewModels
{
    public class DM_NhomDanhMucCreateVM
    {
        public string? CreatedId {get; set; }
		public string? UpdatedId {get; set; }
		[Required]
		public string? GroupName {get; set; }
		[Required]
		public string? GroupCode {get; set; }
    }
}