using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.QLNhanSu.NS_NhanSuService.ViewModels
{
    public class NS_NhanSuEditVM : NS_NhanSuCreateVM
    {
        public Guid? Id { get; set; }
        public string? ChucVuCode { get; set; }
        public string? PhongBanCode { get; set; }
    }
}