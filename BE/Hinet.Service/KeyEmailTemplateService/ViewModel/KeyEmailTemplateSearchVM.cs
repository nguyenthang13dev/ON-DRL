using Hinet.Service.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Hinet.Service.KeyEmailTemplateService.ViewModel
{
   public class KeyEmailTemplateSearchVM:SearchBase
    {
        public Guid EmailTemplateId { get; set; }
    }
}
