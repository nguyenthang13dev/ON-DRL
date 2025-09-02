using Hinet.Service.Dto;

namespace Hinet.Service.DA_KeHoachThucHienService.Dto
{
    public class DA_KeHoachThucHienSearch : SearchBase
    {
        public Guid? DuAnId {get; set; }
		public Guid? GroupNoiDungId {get; set; }
		public string? NgayBatDau {get; set; }
		public string? NgayKetThuc {get; set; }
		public int? CanhBaoTruocNgay {get; set; }
		public bool? IsKeHoachNoiBo {get; set; }
		public bool? IsCanhBao {get; set; }
		public string? NoiDungCongViec {get; set; }
    }
}
