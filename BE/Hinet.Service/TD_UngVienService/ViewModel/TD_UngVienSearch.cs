using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_UngVienService.ViewModel
{
    public class TD_UngVienSearch : SearchBase
    {
        [StringLength(250)]
        public string? HoTen { get; set; }
        public GioiTinh_UngVien? GioiTinh { get; set; } // 0: Nam, 1: Nữ, 2: Khác

        [StringLength(250)]
        public string? Email { get; set; }

        [StringLength(250)]
        public string? sdt { get; set; }

        [StringLength(500)]
        public string? KinhNghiem { get; set; }
        public DateOnly? NgayUngTuyen { get; set; }
        public TrangThai_UngVien? TrangThai { get; set; }
        public Guid? TuyenDungId { get; set; }
        public DateOnly? ThoiGianPhongVan_Start { get; set; }
        public DateOnly? ThoiGianPhongVan_End { get; set; }
    }
}
