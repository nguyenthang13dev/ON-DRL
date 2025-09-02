using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
namespace Hinet.Service.ArcFontService.ViewModels
{
    public class ArcFontCreateVM
    {
        [Required]
		public string Identifier {get; set; }
		[Required]
		public string OrganId {get; set; }
		[Required]
		public string FondName {get; set; }
		[Required]
		public int ArchivesTimeStart {get; set; }
		[Required]
		public int ArchivesTimeEnd {get; set; }
		[Required]
		public int PaperTotal {get; set; }
		[Required]
		public int PaperDigital {get; set; }
		[Required]
		public string Language {get; set; }
        public string? FondHistory { get; set; } // Lịch sử đơn vị 
        public string? ArchivesTime { get; set; } // Lịch sử đơn vị 
        public string? KeyGroups { get; set; }
        public string? OtherTypes { get; set; } // Các loại hình tài liệu khác (phim, ảnh,...)
        public string? LookupTools { get; set; } // Công cụ tra cứu
        public int? CopyNumber { get; set; } // Số lượng trang tài liệu đã lập bản sao bảo hiểm
        public string? Description { get; set; } // Ghi chú

    }
}