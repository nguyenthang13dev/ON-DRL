using Hinet.Service.Dto;

namespace Hinet.Service.UC_MoTa_UseCaseService.Dto
{
    public class UC_MoTa_UseCaseSearch : SearchBase
    {
        public string? IdUseCase {get; set; }
		public string? HanhDong {get; set; }
		public string? MoTaKiemThu {get; set; }
		public string? TinhHuongKiemThu {get; set; }
		public string? KetQuaMongDoi {get; set; }
		public string? TaiKhoan {get; set; }
		public string? LinkHeThong {get; set; }
		public string? TrangThai {get; set; }
		public string? MoTaLoi {get; set; }
		public string? GhiChu {get; set; }
    }
}
