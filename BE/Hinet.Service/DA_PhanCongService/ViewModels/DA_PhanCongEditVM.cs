using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_PhanCongService.ViewModels
{
    public class DA_PhanCongEditVM : DA_PhanCongCreateVM
    {
        public Guid? Id { get; set; }
    }
}