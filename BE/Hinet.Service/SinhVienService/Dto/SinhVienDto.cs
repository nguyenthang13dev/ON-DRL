using Hinet.Model.MongoEntities;
using Hinet.Service.Dto;

namespace Hinet.Service.SinhVienService.Dto
{
    public class SinhVienDto : SinhVien
    {
        // Add extra display properties if needed
        public string? TenKhoa { get; set; }
        public string? TenLopHanhChinh { get; set; }
        public string TenTrangThai
        {
            get
            {
                return TrangThai switch
                {
                    "DangHoc" => "Đang học",
                    "BaoLuu" => "Bảo lưu",
                    "DaTotNghiep" => "Đã tốt nghiệp",
                    "NghiHoc" => "Nghỉ học",

                    _ => TrangThai
                };
            }
        }
    }

    public class SinhVienSearch : SearchBase
    {
        public string? HoTen { get; set; }
        public string? MaSV { get; set; }
        public Guid? KhoaId { get; set; }
        public Guid? LopHanhChinhId { get; set; }
        public string? TrangThai { get; set; }
    }
}