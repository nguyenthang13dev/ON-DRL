using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.KySoInfoService.ViewModels
{
    public class KySoInfoEditVM : KySoInfoCreateVM
    {
        public Guid? Id { get; set; }
    }
}