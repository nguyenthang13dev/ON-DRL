using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.KySoCauHinhService.ViewModels
{
    public class KySoCauHinhEditVM : KySoCauHinhCreateVM
    {
        public Guid? Id { get; set; }
        public int? DisplayWidth { get; set; }
        public int? DisplayHeight { get; set; }
        public int? MarginLeft { get; set; }
        public int? MarginTop { get; set; }
        public string? ImageSrc { get; set; }
        public IFormFile? File { get; set; }
    }
}