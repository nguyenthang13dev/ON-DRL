using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Hinet.Model.Entities.TuyenDung;

namespace Hinet.Service.TD_UngVienService.ViewModel
{
    public class TD_UngVienCreateVM
    {
        [StringLength(250)]
        public string? HoTen { get; set; }

        public DateTime? NgaySinh { get; set; }

        public GioiTinh_UngVien? GioiTinh { get; set; } // 0: Nam, 1: Nữ, 2: Khác

        [StringLength(250)]
        public string? Email { get; set; }

        [StringLength(250)]
        [RegularExpression(@"^(0|\+84)[1-9][0-9]{8}$", ErrorMessage = "Số điện thoại không hợp lệ.")]
        public string? SoDienThoai { get; set; }

        [StringLength(250)]
        public string? DiaChi { get; set; }

        [StringLength(200)]
        public string? TrinhDoHocVan { get; set; }

        [StringLength(500)]
        public string? KinhNghiem { get; set; }
        public IFormFile? CVFile { get; set; }
        public DateTime? NgayUngTuyen { get; set; }
        public DateTime? ThoiGianPhongVan { get; set; }
        public TrangThai_UngVien TrangThai { get; set; } = TrangThai_UngVien.ChuaXetDuyet;
        public string? GhiChuUngVien { get; set; }
        public Guid TuyenDungId { get; set; }
    }
}
