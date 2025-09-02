
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.RoleService.ViewModels
{
    public class RoleCreateVM
    {
		[Required]
        public string? Name {get; set; }
		[Required]
        [RegularExpression("^[a-zA-Z0-9_-]+$", ErrorMessage = "Mã nhóm quyền chỉ chứa chữ, số, gạch dưới hoặc gạch ngang")]
        public string? Code {get; set; }
		public string? Type {get; set; }
    }
}