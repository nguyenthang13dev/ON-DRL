using System;
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.EmailTemplateService.ViewModel
{
    public class EmailTemplateEditVM:EmailTemplateCreateVM
    {
        [Required]
        public Guid Id { get; set; }
    }
}