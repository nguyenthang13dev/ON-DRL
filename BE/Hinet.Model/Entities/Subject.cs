using MongoDbGenericRepository.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Model.Entities
{
    [CollectionName("Subject")]
    public class Subject : AuditableEntity
    {
        [Required]
        public string Code { get; set; } // Mã môn học (VD: CS101)

        [Required]
        public string Name { get; set; } // Tên môn học

        public string? Description { get; set; } // Mô tả học phần

        public int Credits { get; set; } // Số tín chỉ

        public Guid? Department { get; set; } // Khoa/ bộ môn phụ trách

        public int? Semester { get; set; } // Học kỳ khuyến nghị (1,2,...)

        public Guid? Prerequisites { get; set; } // Môn học tiên quyết (mã môn học khác)

        public Guid? Corequisites { get; set; } // Môn học song hành

        public int? TheoryHours { get; set; } // Số tiết lý thuyết

        public int? PracticeHours { get; set; } // Số tiết thực hành

        public bool IsElective { get; set; } // Có phải môn tự chọn không

        public string? AssessmentMethod { get; set; } // Hình thức đánh giá (Thi, Bài tập lớn, Thực hành,...)
    }
}
