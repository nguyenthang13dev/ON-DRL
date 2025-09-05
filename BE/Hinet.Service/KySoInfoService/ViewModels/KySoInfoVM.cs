using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.KySoInfoService.ViewModels
{
    public class KySoInfoVM
    {
        public Guid? IdDoiTuong { get; set; }
        public string? UserName { get; set; }
        public string? LoaiDoiTuong { get; set; }
        public string? DuongDanFile { get; set; }
        public string? ThongTin { get; set; }
        public string? TrangThai { get; set; }
    }
}
