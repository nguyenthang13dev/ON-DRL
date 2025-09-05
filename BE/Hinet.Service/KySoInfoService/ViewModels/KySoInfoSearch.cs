using Hinet.Service.Dto;

namespace Hinet.Service.KySoInfoService.Dto
{
    public class KySoInfoSearch : SearchBase
    {
        public Guid? UserId {get; set; }
		public Guid? IdDoiTuong {get; set; }
		public string? LoaiDoiTuong {get; set; }
		public string? DuongDanFile {get; set; }
		public string? ThongTin {get; set; }
		public string? TrangThai {get; set; }
    }
}
