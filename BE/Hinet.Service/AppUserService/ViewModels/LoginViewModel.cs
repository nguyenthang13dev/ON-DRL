using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.AppUserService.ViewModels
{
    public class LoginViewModel
    {
        [Required]
        public string? UserName { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}
