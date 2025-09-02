using Hinet.Model.Entities;
using Hinet.Service.KeyEmailTemplateService.Dto;
using Hinet.Service.KeyEmailTemplateService.ViewModel;
using System;

namespace Hinet.Service.EmailTemplateService.Dto
{
    public class EmailTemplateDto : EmailTemplate
    {
        public string? tenLoaiEmailTemPlate { get; set; }
        public List<KeyEmailTemplateDto>? lstKeyEmailTemplate { get; set; }
    }
}