using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService.Dto
{
    public class DataTableChamCong
    {
        public string MaNV { get; set; }
        public string HoTen { get; set; }
        public string ChucVu { get; set; }
        public Dictionary<string, ChamCongTheoNgayDto> DataOfDate { get; set; }
    }

    public class ChamCongTheoNgayDto
    {
        public string GioVao { get; set; } = "";
        public byte? TrangThai { get; set; } = null;
        public bool IsNgayLe { get; set; } 
        public bool IsNghiPhep { get; set; } 
    }

    public class DataChamCongDto : ChamCongTheoNgayDto
    {
        public string? MaNV { get; set; }
        public bool IsNgayLe { get; set; }
        public bool IsNghiPhep { get; set; }
        public DateTime? NgayDiemDanh { get; set; }
        public string? Note { get; set; }
    }
}
