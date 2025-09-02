using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.NS_NgayLeService.ViewModels
{
    public class NS_NgayLeCreateUpdateVM
    {
        public Guid? Id { get; set; }
        [Required(ErrorMessage = "Ngày bắt đầu là bắt buộc.")]
        public DateTime NgayBatDau { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc là bắt buộc.")]
        public DateTime NgayKetThuc { get; set; }

        [Required(ErrorMessage = "Tên ngày lễ là bắt buộc.")]
        [StringLength(100, ErrorMessage = "Tên ngày lễ không được vượt quá 100 ký tự.")]
        public string TenNgayLe { get; set; }

        [Required(ErrorMessage = "Loại ngày lễ là bắt buộc.")]
        public string? LoaiNLCode { get; set; } 

        [StringLength(500, ErrorMessage = "Mô tả không được vượt quá 500 ký tự.")]
        public string? MoTa { get; set; }

        public string? TrangThai { get; set; } = "HoatDong";

        [Required(ErrorMessage = "Năm là bắt buộc.")]
        [Range(1900, 2200, ErrorMessage = "Năm không hợp lệ.")]
        public int Nam { get; set; }
    }
}
