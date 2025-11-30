using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.GiaoVienService.ViewModels
{
    public class GiaoVienCreateVM
    {
        public string MaGiaoVien { get; set; }

        public string HoTen { get; set; }

        public string Email { get; set; }

        public string? SoDienThoai { get; set; }

        public bool GioiTinh { get; set; }

        public DateTime NgaySinh { get; set; }

        public Guid KhoaId { get; set; }

        public string TrangThai { get; set; } 
    }
}
