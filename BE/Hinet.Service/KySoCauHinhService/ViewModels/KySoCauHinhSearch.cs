using Hinet.Service.Dto;

namespace Hinet.Service.KySoCauHinhService.Dto
{
    public class KySoCauHinhSearch : SearchBase
    {
        public Guid? IdBieuMau {get; set; }
		public Guid? IdDTTienTrinhXuLy {get; set; }
		public string? DuongDanFile {get; set; }
		public int? ImagePosX {get; set; }
		public int? ImagePosY {get; set; }
		public int? ImageWidth {get; set; }
		public int? ImageHeight {get; set; }
		public int? TextPosX {get; set; }
		public int? TextPosY {get; set; }
		public int? FontSize {get; set; }
    }
}
