using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.EmailThongBaoService.ViewModels
{
    public class EmailThongBaoCreateVM
    {
        public string? Ma {get; set; }
		public string? NoiDung {get; set; }
    }
}