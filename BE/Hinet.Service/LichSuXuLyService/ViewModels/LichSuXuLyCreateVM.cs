using System;
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.LichSuXuLyService.ViewModels
{
    public class LichSuXuLyCreateVM
    {
        [Required(ErrorMessage = "ItemId là bắt buộc")]
        public Guid ItemId { get; set; }

        [Required(ErrorMessage = "ItemType là bắt buộc")]
        public string ItemType { get; set; }

        public string? note { get; set; }
        public string? oldData { get; set; }
        public string? newDaTa { get; set; }
    }
}