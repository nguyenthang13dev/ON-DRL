using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.NhomUseCaseService.ViewModels
{
    public class NhomUseCaseCreateVM
    {
        [Required]
		public string TenNhom {get; set; }
		[Required]
		public int Order {get; set; }
		[Required]
		public string ParentId {get; set; }
		[Required]
		public string MoTa {get; set; }
    }
}