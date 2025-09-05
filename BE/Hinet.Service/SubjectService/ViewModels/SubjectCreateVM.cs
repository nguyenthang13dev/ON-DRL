
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.SubjectService.ViewModels
{
    public class SubjectCreateVM
    {
        [Required]
        public string Code { get; set; } // Mã môn h?c (VD: CS101)

        [Required]
        public string Name { get; set; } // Tên môn h?c

        public string? Description { get; set; } // Mô t? h?c ph?n

        public int Credits { get; set; } // S? tín ch?

        public Guid? Department { get; set; } // Khoa/ b? môn ph? trách

        public int? Semester { get; set; } // H?c k? khuy?n ngh? (1,2,...)

        public Guid? Prerequisites { get; set; } // Môn h?c tiên quy?t (mã môn h?c khác)

        public Guid? Corequisites { get; set; } // Môn h?c song hành

        public int? TheoryHours { get; set; } // S? ti?t lý thuy?t

        public int? PracticeHours { get; set; } // S? ti?t th?c hành

        public bool IsElective { get; set; } // Có ph?i môn t? ch?n không

        public string? AssessmentMethod { get; set; } // Hình th?c ?ánh giá (Thi, Bài t?p l?n, Th?c hành,...)
    }
}