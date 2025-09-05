using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.KySoCauHinhService.ViewModels
{
    public class KySoCauHinhCreateVM
    {
        public Guid? IdBieuMau { get; set; }
        public Guid? IdDTTienTrinhXuLy { get; set; }
        public string? Type { get; set; }
        public int PosX { get; set; }
        public int PosY { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
        public string? Content { get; set; }
        public string? ImageSrc { get; set; }
        public int? FontSize { get; set; }
        public string? TextColor { get; set; }
    }
}