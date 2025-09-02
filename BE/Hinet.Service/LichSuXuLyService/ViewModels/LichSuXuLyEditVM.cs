using System;
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.LichSuXuLyService.ViewModels
{
    public class LichSuXuLyEditVM : LichSuXuLyCreateVM
    {
        [Required(ErrorMessage = "Id là bắt buộc")]
        public Guid Id { get; set; }
    }
}