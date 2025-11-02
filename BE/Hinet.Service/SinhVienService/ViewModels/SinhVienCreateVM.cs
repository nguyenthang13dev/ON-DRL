using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.SinhVienService.ViewModels
{
    public class SinhVienCreateVM
    {
        public string MaSV { get; set; }

        public string HoTen { get; set; }

        public DateTime NgaySinh { get; set; }

        public bool GioiTinh { get; set; }

        public string Email { get; set; }

        public string TrangThai { get; set; } // DangHoc, BaoLuu, DaTotNghiep, NghiHoc

        public Guid KhoaId { get; set; }

        public Guid LopHanhChinhId { get; set; }

    }
}
