using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Hinet.Model.Entities
{
    [Table("EmailTemplate")]
    public class EmailTemplate : AuditableEntity
    {
        [Required]
        [StringLength(100)]
        public string Code { get; set; } // Mã định danh template, ví dụ: InviteInterview

        [Required]
        [StringLength(200)]
        public string Name { get; set; } // Tên template, ví dụ: Thư mời phỏng vấn

        public string Content { get; set; } // Nội dung HTML template

        [StringLength(500)]
        public string? Description { get; set; } // Mô tả template
        public string? LoaiTemPlate { get; set; } 

        public bool IsActive { get; set; } = true;
    }
}