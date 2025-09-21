// Hinet.Service/GiaoVienService/Dto/GiaoVienDto.cs
using Hinet.Model.MongoEntities;
using Hinet.Service.Dto;

namespace Hinet.Service.GiaoVienService.Dto
{
    public class GiaoVienDto : GiaoVien
    {
        public string TenTrangThai
        {
            get
            {
                return TrangThai switch
                {
                    "DangLam" => "Đang làm việc",
                    "NghiViec" => "Nghỉ việc",
                    _ => TrangThai
                };
            }
        }
        public string TenKhoa { get; set; }
    }

    public class GiaoVienSearch : SearchBase
    {
        public string? HoTen { get; set; }
        public string? MaGiaoVien { get; set; }
        public Guid? KhoaId { get; set; }
    }
}