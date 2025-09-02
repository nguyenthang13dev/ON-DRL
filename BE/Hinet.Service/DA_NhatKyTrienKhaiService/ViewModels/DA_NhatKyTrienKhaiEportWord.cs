using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Hinet.Model.Entities.DuAn;

namespace Hinet.Service.DA_NhatKyTrienKhaiService.ViewModels
{
    public class DA_NhatKyTrienKhaiEportWord :DA_NhatKyTrienKhai
    {
        public string? TenGoiThau { get; set; }
        public string? DiaDiemTrienKhai { get; set; }
        public string? ChuDauTu { get; set; }
        public string? TenDuAnText { get; set; }

        public string ? KetQuaThucHien { get; set; }


    }

    public class UrlFilePath
    {
        public string urlFile { get; set; }
        public string tenFile { get; set; }

    }
}
