using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ChuKyService.ViewModels
{
    public class ChuKyEditVM : ChuKyCreateVM
    {
        public Guid? Id { get; set; }
    }
}