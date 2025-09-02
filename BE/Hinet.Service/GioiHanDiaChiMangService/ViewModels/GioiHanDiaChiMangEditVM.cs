using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.GioiHanDiaChiMangService.ViewModels
{
    public class GioiHanDiaChiMangEditVM : GioiHanDiaChiMangCreateVM
    {
        public Guid? Id { get; set; }
    }
}