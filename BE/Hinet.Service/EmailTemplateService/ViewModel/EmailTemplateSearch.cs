using Hinet.Service.Dto;
using System;
using System.ComponentModel.DataAnnotations;

namespace Hinet.Service.EmailTemplateService.ViewModel
{
    public class EmailTemplateSearch :SearchBase
    {
        public string? Code { get; set; }
        public string? LoaiTemPlate { get; set; }
        public string? Name { get; set; }
        public bool? IsActive { get; set; } = true; 
    }
}