using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.EmailService.Dto
{
    public class ApplyCVSuccessDto
    {
        public string TenUngVien { get; set; } = string.Empty;
        public string ViTri { get; set; } = string.Empty;
        public string TenCongTy { get; set; } = string.Empty;
        public string ThoiGianUngTuyen { get; set; } = string.Empty;
        public string EmailLienHe { get; set; } = string.Empty;
        public string SoDienThoaiLienHe { get; set; } = string.Empty;
        public int NamHienTai { get; set; } = DateTime.Now.Year;
        public string DiaChi {  get; set; } = string.Empty;
    }
}
