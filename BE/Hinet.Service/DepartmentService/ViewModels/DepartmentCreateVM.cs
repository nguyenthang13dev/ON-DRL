
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.DepartmentService.ViewModels
{
    public class DepartmentCreateVM
    {
        public string? CreatedId {get; set; }
		public string? UpdatedId {get; set; }
		public long? ParentId {get; set; }
		public long? Priority {get; set; }
		[Required]
		public string? Name {get; set; }
		[Required]
		public string? Code {get; set; }
		[Required]
		public string? Loai {get; set; }
		[Required]
		public int Level {get; set; }
		[Required]
		public bool IsActive {get; set; }

		// tí xóa
		public string idcha { get; set; }
		public string idchinhno { get; set; }
        public int? SoNgayTiepTrenThang { get; set; }
    }
}