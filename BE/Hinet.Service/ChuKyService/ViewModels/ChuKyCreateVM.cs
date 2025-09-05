using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ChuKyService.ViewModels
{
    public class ChuKyCreateVM
    {
        public IFormFile File { get; set; }
    }
}