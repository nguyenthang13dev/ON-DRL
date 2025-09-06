using Hinet.Model.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.KySoCauHinhService.ViewModels
{
    public class SaveChuKyVM
    {
        public IFormFile? File { get; set; }
    }
}