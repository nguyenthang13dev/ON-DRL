using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcFontService.ViewModels
{
    public class ArcFontEditVM : ArcFontCreateVM
    {
        public Guid? Id { get; set; }
    }
}