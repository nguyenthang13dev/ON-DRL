// Hinet.Service/LopHanhChinhService/Dto/LopHanhChinhDto.cs
using Hinet.Model.MongoEntities;
using Hinet.Service.Dto;

namespace Hinet.Service.LopHanhChinhService.Dto
{
    public class LopHanhChinhDto : LopHanhChinh
    {
        public string? TenKhoa { get; set; }
        public string? TenGiaoVienCoVan { get; set; }
    }

    public class LopHanhChinhSearch : SearchBase
    {
        public string? TenLop { get; set; }
        public Guid? KhoaId { get; set; }
        public Guid? GiaoVienCoVanId { get; set; }
    }
}

