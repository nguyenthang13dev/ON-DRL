using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_KeHoachThucHienService.ViewModels
{
    public class DA_KeHoachThucHienEditVM : DA_KeHoachThucHienCreateVM
    {
        public Guid? Id { get; set; }
    }
}