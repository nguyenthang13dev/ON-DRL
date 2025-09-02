using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.EmailTemplateService.ViewModel
{
    public class EmailTemplateCreateVM
    {
        [Required]
        [StringLength(100)]
        [RegularExpression(@"^\S+$", ErrorMessage = "Không được chứa khoảng trắng.")]
        public string Code { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        public string Content { get; set; }

        [StringLength(500)]
        public string? Description { get; set; }
        public string? LoaiTemPlate { get; set; } 
        public Dictionary<string, string> lstKeyEmailTemplate { get; set; }
    }
}