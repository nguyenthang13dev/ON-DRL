using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.User_GroupUserService.ViewModels
{
    public class User_GroupUserCreateVM
    {
        [Required]
		public Guid UserId {get; set; }
		[Required]
		public List<Guid>? GroupUserId {get; set; }
    }
}