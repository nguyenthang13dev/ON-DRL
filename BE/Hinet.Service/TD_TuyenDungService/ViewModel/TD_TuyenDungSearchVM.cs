using Hinet.Model.Entities.TuyenDung;
using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.TD_ViTriTuyenDungService.ViewModel
{
   public class TD_TuyenDungSearchVM:SearchBase
    {
        [StringLength(250)]
        public string? TenViTri { get; set; }
        public Guid? PhongBanId { get; set; }
        public int? SoLuongCanTuyen { get; set; }
        public DateOnly? NgayBatDau { get; set; }
        public DateOnly? NgayKetThuc { get; set; }
        public TinhTrang_TuyenDung? TinhTrang { get; set; }
        public Loai_TuyenDung? Loai { get; set; }
        public HinhThuc_TuyenDung? HinhThuc { get; set; } 
    }
}
