using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.ViewModels
{
    public class NS_HopDongLaoDongEditVM : NS_HopDongLaoDongCreateVM
    {
        public Guid? Id { get; set; }
    }
}