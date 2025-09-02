using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities.LuuTruBQP
{
    [Table("ArcFont")]
    public class ArcFont : AuditableEntity
    {
        [Required] [StringLength(200)] public string? Identifier { get; set; } // Mã cơ quan lưu trữ (lấy từ Department)

        [Required] [StringLength(13)] public string? OrganId { get; set; } // Mã phông lưu trữ
        [Required] [StringLength(200)] public string? FondName { get; set; } // Tên phông lưu trữ

        public string? FondHistory { get; set; } // Lịch sử đơn vị hình thành phông
        public string? ArchivesTime { get; set; } // Thời gian tài liệu (VD: "1946-1975")
        [Required] public int ArchivesTimeStart { get; set; } // Năm đầu
        [Required] public int ArchivesTimeEnd { get; set; } // Năm cuối
        [Required] public int PaperTotal { get; set; } // Tổng số tài liệu giấy (mét giá)
        [Required] public int PaperDigital { get; set; } // Số lượng tài liệu giấy đã số hóa (số trang)

        public string? KeyGroups { get; set; } // Các nhóm tài liệu chủ yếu
        public string? OtherTypes { get; set; } // Các loại hình tài liệu khác (phim, ảnh,...)
        [Required] [StringLength(100)] public string? Language { get; set; } // Ngôn ngữ

        public string? LookupTools { get; set; } // Công cụ tra cứu
        public int? CopyNumber { get; set; } // Số lượng trang tài liệu đã lập bản sao bảo hiểm
        public string? Description { get; set; } // Ghi chú
    }
}