using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.EmailService.Dto
{
    public class InviteInterviewDto
    {
        public string TenUngVien { get; set; } 
        public string ViTri { get; set; } 
        public string TenCongTy { get; set; } 
        public string ThoiGian { get; set; } 
        public string DiaDiem { get; set; } 
        public string NguoiLienHe { get; set; } 
        public string GhiChu { get; set; } 
        public string LinkXacNhan { get; set; }  // nếu bạn dùng xác nhận tham gia
        public string EmailLienHe { get; set; } 
        public string SoDienThoaiLienHe { get; set; } 
        public int NamHienTai { get; set; } = DateTime.Now.Year;
    }

}
