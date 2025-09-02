using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;

namespace Hinet.Service.QLNhanSu.NS_ChamCongService.ViewModels
{
    public class NS_ChamCongSearch : SearchBase
    {
        public DateTime? NgayLamViec { get; set; }

        public TimeSpan? GioVao { get; set; }

        public TimeSpan? GioRa { get; set; }

        public byte? TrangThai { get; set; } // 0 = Bình thường, 1 = Đi muộn, 2 = Về sớm

        public string? MaNV { get; set; }
    }
    public class DataTableSearch
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public string? MaNV { get; set; }
    }
}
