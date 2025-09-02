using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.GroupUserService.ViewModels
{
    public class GroupUserCreateVM
    {
        [Required]
		public string Name {get; set; }
		[Required]
		public string Code {get; set; }
    }
}