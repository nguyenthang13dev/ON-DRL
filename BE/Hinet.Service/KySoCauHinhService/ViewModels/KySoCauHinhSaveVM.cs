using Hinet.Model.Entities;
using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.KySoCauHinhService.ViewModels
{
    public class KySoCauHinhSaveVM
    {
        public Guid? IdBieuMau { get; set; }
        public Guid? IdDTTienTrinhXuLy { get; set; }
        public Guid? IdUser { get; set; }
        public string? ListCauHinh { get; set; }
        public IFormFile? File { get; set; }
    }
}