using Hinet.Model.Entities;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.HoatDongNgoaiKhoaService.ViewModels
{
    public class HoatDongNgoaiKhoaCreateVM
    {
        public string TenHoatDong { get; set; }
        public string Status { get; set; }
        public string? QrValue { get; set; }
        public DateTime? ThoiHanDangKy { get; set; }
        public List<AppUser>? DanhSachDangKy { get; set; }
    }
}
