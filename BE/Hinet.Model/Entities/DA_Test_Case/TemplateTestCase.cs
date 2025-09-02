using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [Table("UC_TemplateTestCase")]
    public class UC_TemplateTestCase : AuditableEntity
    {
        // Tên : Thêm mới  ( cập nhật,xoá,.... )
        
        public string TemplateName { get; set; }
        // Key : thêm, tạo, thêm mới
        // Ghi chú các từ khoá cách nhau dấu , ( trong view thì thêm dấu + ? )
        public string? KeyWord { get; set; }
        // ghi chú trong view thêm : Một số key cho trước 
        // // VD: {TenUseCase}, {TenChucNang}, {TacNhan}, {HanhDong}
        public int? stt { get; set; }
        public string? TemplateContent { get; set; }
    }
}
