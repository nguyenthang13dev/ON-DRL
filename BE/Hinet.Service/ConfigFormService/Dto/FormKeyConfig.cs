using Hinet.Service.ConfigFormKeyService.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.ConfigFormService.Dto
{
    public class FormKeyConfig
    {
        public List<ConfirFormKeyDto> configKeys  { get; set; }
        public string HtmlContent  { get; set; }
    }
}
