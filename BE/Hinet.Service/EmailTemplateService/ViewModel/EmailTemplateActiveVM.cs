using System;
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.EmailTemplateService.ViewModel
{
    public class EmailTemplateActiveVM
    {
        [Required]
        public Guid Id { get; set; }
        public bool IsActive { get; set; }
    }
}