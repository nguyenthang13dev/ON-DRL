using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.EmailThongBaoService.ViewModels
{
    public class EmailThongBaoEditVM : EmailThongBaoCreateVM
    {
        public Guid? Id { get; set; }
    }
}