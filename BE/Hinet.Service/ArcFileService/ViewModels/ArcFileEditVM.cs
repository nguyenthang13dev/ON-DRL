using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcFileService.ViewModels
{
    public class ArcFileEditVM : ArcFileCreateVM
    {
        public Guid? Id { get; set; }
    }
}