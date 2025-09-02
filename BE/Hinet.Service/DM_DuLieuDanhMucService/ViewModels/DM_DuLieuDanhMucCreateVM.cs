
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.DM_DuLieuDanhMucService.ViewModels
{
    public class DM_DuLieuDanhMucCreateVM
    {
  
		public Guid? GroupId {get; set; }
		[Required]
		public string? Name {get; set; }
		[Required]
		public string? Code {get; set; }
		public string? Note {get; set; }
		public int? Priority {get; set; }

        public Guid? DonViId { get; set; }
        public string? DuongDanFile { get; set; }
        public string? NoiDung { get; set; }
        public Guid? FileDinhKem { get; set; }
        public Guid? ParentId { get; set; }
    }
}