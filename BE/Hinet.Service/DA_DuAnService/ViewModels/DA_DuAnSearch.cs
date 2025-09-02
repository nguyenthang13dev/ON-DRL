using Hinet.Service.Dto;

namespace Hinet.Service.DA_DuAnService.Dto
{
    public class DA_DuAnSearch : SearchBase
    {
        public string? TenDuAn {get; set; }
		public DateTime? NgayBatDau {get; set; }
		public DateTime? NgayKetThuc {get; set; }
		public string? MoTaDuAn {get; set; }
		public DateTime? NgayTiepNhan {get; set; }
		public string? YeuCauDuAn {get; set; }
		public Int16? TrangThaiThucHien {get; set; }
		public DateTime? TimeCaiDatMayChu {get; set; }
		public bool? IsBackupMayChu {get; set; }
		public string? LinkDemo {get; set; }
		public string? LinkThucTe {get; set; }
		public Guid? UserId { get; set; }
    }
}
