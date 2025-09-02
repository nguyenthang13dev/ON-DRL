using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.QL_NghiPhep.NP_DangKyNghiPhepService.ViewModels
{
    public class NP_DangKyNghiPhepCreateVM
    {
        public string? MaLoaiPhep { get; set; }
        public DateTime TuNgay { get; set; }
        public DateTime DenNgay { get; set; }
        public required string LyDo { get; set; }
        public Decimal SoNgayNghi { get; set; }
        public string? MaNhanSuBanGiao { get; set; }
        public string? CongViecBanGiao { get; set; }
    }

    public class ConfigUploadForm
    {
        public string? fileId { get; set; }
        public string? itemId { get; set; }
    }

    public class TuChoiVM
    {
        public string? LyDoTuChoi { get; set; }
    }
}
