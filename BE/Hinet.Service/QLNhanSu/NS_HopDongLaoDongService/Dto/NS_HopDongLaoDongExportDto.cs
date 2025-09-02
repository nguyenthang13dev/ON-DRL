using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_HopDongLaoDongService.Dto
{
    public class NS_HopDongLaoDongExportDto
    {
        public Guid Id { get; set; }
        public string? SoHopDong { get; set; }
        public string? NgayKy { get; set; }
        public string? HoTenNhanSu { get; set; }
        public string? NgaySinh { get; set; }
        public string? DiaChiThuongTru { get; set; }
        public string? CMND { get; set; }
        public string? NgayCapCMND { get; set; }
        public string? NoiCapCMND { get; set; }
        public string? LoaiHopDong { get; set; }
        public string? NgayHetHan { get; set; }
        public string? ChucVu { get; set; }
    }
}
