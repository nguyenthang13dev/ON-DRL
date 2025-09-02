using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.DA_NoiDungCuocHopService.ViewModels
{
    public class DA_NoiDungCuocHopEditVM : DA_NoiDungCuocHopCreateVM
    {
        public Guid? Id { get; set; }
    }
}